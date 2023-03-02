https://github.com/NVIDIA/TensorRT/blob/main/demo/HuggingFace/notebooks/t5.ipynb
# Accelerating HuggingFace T5 Inference with TensorRT

T5 is an encoder-decoder model that converts all NLP problems into a text-to-text format. More specifically, it does so by encoding different tasks as text directives in the input stream. This enables a single model to be trained supervised on a wide variety of NLP tasks such as translation, classification, Q&A and summarization.

This notebook shows 3 easy steps to convert a  [HuggingFace PyTorch T5 model](https://huggingface.co/transformers/model_doc/t5.html)  to a TensorRT engine for high-performance inference.

1.  [Download HuggingFace T5 model](https://github.com/NVIDIA/TensorRT/blob/59898c103f07e100d3c1108c038d767f5485e0b9/demo/HuggingFace/notebooks/#1)
2.  [Convert to ONNX format](https://github.com/NVIDIA/TensorRT/blob/59898c103f07e100d3c1108c038d767f5485e0b9/demo/HuggingFace/notebooks/#2)
3.  [Convert to TensorRT engine](https://github.com/NVIDIA/TensorRT/blob/59898c103f07e100d3c1108c038d767f5485e0b9/demo/HuggingFace/notebooks/#3)

## Prerequisite

Follow the instruction at  https://github.com/NVIDIA/TensorRT  to build the TensorRT-OSS docker container required to run this notebook.

Next, we install some extra dependencies.

In \[ \]:

%%capture
!pip3 install -r ../requirements.txt

**Note:**  After this step, you should restart the Jupyter kernel for the change to take effect.

In \[ \]:

import os
import sys
ROOT_DIR = os.path.abspath("../")
sys.path.append(ROOT_DIR)

import torch
import tensorrt as trt

\# huggingface
from transformers import (
    T5ForConditionalGeneration,
    T5Tokenizer,
    T5Config,
)

## 1\. Download HuggingFace T5 model

First, we download the original HuggingFace PyTorch T5 model from HuggingFace model hubs, together with its associated tokernizer.

The T5 variants that are suported by TensorRT 8 are: t5-small (60M), t5-base (220M), t5-large (770M), t5-3b(3B), t5-11b(11B)

In \[ \]:

T5_VARIANT = 't5-small' \# choices: t5-small | t5-base | t5-large | t5-3b | t5-11b

t5_model = T5ForConditionalGeneration.from_pretrained(T5_VARIANT)
tokenizer = T5Tokenizer.from_pretrained(T5_VARIANT)
config = T5Config.from_pretrained(T5_VARIANT, use_cache = False)

In \[ \]:

\# save model locally
pytorch\_model\_dir = './models/{}/pytorch'.format(T5_VARIANT)
!mkdir  -p  $pytorch\_model\_dir

t5_model.save_pretrained(pytorch\_model\_dir)
print("Pytorch Model saved to {}".format(pytorch\_model\_dir))

### Inference with PyTorch model

Next, we will carry out inference with the PyTorch model.

#### Single example inference

In \[ \]:

inputs = tokenizer("translate English to German: That is good.", return_tensors="pt").to('cuda:0')
num_beams = 1

\# inference on a single example
t5_model.to('cuda:0').eval()
with torch.no_grad():
    outputs = t5_model(**inputs, labels=inputs\["input_ids"\])

logits = outputs.logits

In \[ \]:

\# Generate sequence for an input
outputs = t5_model.to('cuda:0').generate(inputs.input_ids.to('cuda:0'), num_beams=num_beams)
print(tokenizer.decode(outputs\[0\], skip\_special\_tokens=True))

#### Model inference benchmark: encoder and decoder stacks

For benchmarking purposes, we will employ a helper functions  `encoder_inference`  and  `decoder_inference`  which execute the inference repeatedly for the T5 encoder and decoder stacks separately, and measure end to end execution time. Let's take note of this execution time for comparison with TensorRT.

`TimingProfile`  is a named tuple that specifies the number of experiments and number of times to call the function per iteration (and number of warm-up calls although it is not used here).

In \[ \]:

from T5.measurements import decoder_inference, encoder_inference, full_inference
from T5.export import T5EncoderTorchFile, T5DecoderTorchFile, T5EncoderTRTEngine, T5DecoderTRTEngine
from NNDF.networks import TimingProfile
from NNDF.torch_utils import expand\_inputs\_for\_beam\_search

t5\_torch\_encoder = T5EncoderTorchFile.TorchModule(t5_model.encoder)
t5\_torch\_decoder = T5DecoderTorchFile.TorchModule(
    t5_model.decoder, t5_model.lm_head, t5_model.config
)

In \[ \]:

input_ids = inputs.input_ids

encoder\_last\_hidden_state, encoder\_e2e\_median_time = encoder_inference(
    t5\_torch\_encoder, input_ids, TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50)
)
encoder\_e2e\_median_time

In \[ \]:

_, decoder\_e2e\_median_time = decoder_inference(
    t5\_torch\_decoder, input_ids, encoder\_last\_hidden_state, TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50)
)
decoder\_e2e\_median_time

#### Full model inference and benchmark

Next, we will try the T5 model for the task of translation from English to German.

For benchmarking purposes, we will employ a helper function  `full_inference`  which executes the inference repeatedly and measures end to end execution time. Let's take note of this execution time for comparison with TensorRT.

In \[ \]:

from T5.T5ModelConfig import T5ModelTRTConfig, T5Metadata
decoder_output, full\_e2e\_median_runtime = full_inference(
    t5\_torch\_encoder,
    t5\_torch\_decoder,
    input_ids,
    tokenizer,
    TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50),
    num_beams=num_beams,
    max_length=T5ModelTRTConfig.MAX\_SEQUENCE\_LENGTH\[T5_VARIANT\],
)
full\_e2e\_median_runtime

Let us decode the model's output back into text.

In \[ \]:

\# De-tokenize output to raw text
print(tokenizer.decode(decoder_output\[0\], skip\_special\_tokens=True))

## 2\. Convert to ONNX

Prior to converting the model to a TensorRT engine, we will first convert the PyTorch model to an intermediate universal format.

ONNX is an open format for machine learning and deep learning models. It allows you to convert deep learning and machine learning models from different frameworks such as TensorFlow, PyTorch, MATLAB, Caffe, and Keras to a single format.

The steps to convert a PyTorch model to TensorRT are as follows:

- Convert the pretrained image segmentation PyTorch model into ONNX.
- Import the ONNX model into TensorRT.
- Apply optimizations and generate an engine.
- Perform inference on the GPU.

For the T5 model, we will convert the encoder and decoder seperately.

In \[ \]:

\# helpers
from NNDF.networks import NetworkMetadata, Precision

In \[ \]:

onnx\_model\_path = './models/{}/ONNX'.format(T5_VARIANT)
!mkdir  -p  $onnx\_model\_path

metadata=NetworkMetadata(variant=T5_VARIANT, precision=Precision(fp16=True), other=T5Metadata(kv_cache=False))

encoder\_onnx\_model_fpath = T5_VARIANT + "-encoder.onnx"
decoder\_onnx\_model_fpath = T5_VARIANT + "-decoder-with-lm-head.onnx"

t5_encoder = T5EncoderTorchFile(t5_model.to('cpu'), metadata)
t5_decoder = T5DecoderTorchFile(t5_model.to('cpu'), metadata)

onnx\_t5\_encoder = t5_encoder.as\_onnx\_model(
    os.path.join(onnx\_model\_path, encoder\_onnx\_model_fpath), force_overwrite=False
)
onnx\_t5\_decoder = t5_decoder.as\_onnx\_model(
    os.path.join(onnx\_model\_path, decoder\_onnx\_model_fpath), force_overwrite=False
)

## 3\. Convert to TensorRT

Now we are ready to parse the ONNX encoder and decoder models and convert them to optimized TensorRT engines.

Since the models contains dynamic input shapes, we can specify a valid input range with a TensorRT optimization profile.

In \[ \]:

from T5.export import T5DecoderONNXFile, T5EncoderONNXFile
from polygraphy.backend.trt import Profile
from tensorrt import PreviewFeature

In \[ \]:

tensorrt\_model\_path = './models/{}/tensorrt'.format(T5_VARIANT)
!mkdir  -p  tensorrt\_model\_path
\# Decoder optimization profiles
batch_size = 1
max\_sequence\_length = T5ModelTRTConfig.MAX\_SEQUENCE\_LENGTH\[T5_VARIANT\]
decoder_profile = Profile()
decoder_profile.add(
    "input_ids",
    min=(batch_size * num_beams, 1),
    opt=(batch_size * num_beams, max\_sequence\_length // 2),
    max=(batch_size * num_beams, max\_sequence\_length),
)
decoder_profile.add(
    "encoder\_hidden\_states",
    min=(batch_size * num_beams, 1, max\_sequence\_length),
    opt=(batch_size * num_beams, max\_sequence\_length // 2, max\_sequence\_length),
    max=(batch_size * num_beams, max\_sequence\_length, max\_sequence\_length),
)

\# Encoder optimization profiles
encoder_profile = Profile()
encoder_profile.add(
    "input_ids",
    min=(batch_size, 1),
    opt=(batch_size, max\_sequence\_length // 2),
    max=(batch_size, max\_sequence\_length),
)

In \[ \]:

preview\_dynamic\_shapes = True
engine_tag = f"bs{batch_size}"

if num_beams > 1:
    engine_tag += "-beam{}".format(num_beams)

preview_features = \[\]
if preview\_dynamic\_shapes:
    preview_features = \[PreviewFeature.FASTER\_DYNAMIC\_SHAPES_0805\]
    engine_tag += "-previewFasterDynamicShapes"

encoder\_engine\_name = os.path.join(tensorrt\_model\_path, encoder\_onnx\_model_fpath) + f"-{engine_tag}.engine".replace(f"-beam{num_beams}", "") \# encoder engine not affected by beam search
decoder\_engine\_name = os.path.join(tensorrt\_model\_path, decoder\_onnx\_model_fpath) + f"-{engine_tag}.engine"

if not os.path.exists(encoder\_engine\_name):
    t5\_trt\_encoder_engine = T5EncoderONNXFile(os.path.join(onnx\_model\_path, encoder\_onnx\_model_fpath), metadata).as\_trt\_engine(
        encoder\_engine\_name,
        profiles=\[encoder_profile\],
        preview_features=preview_features)
else:
    t5\_trt\_encoder_engine = T5EncoderTRTEngine(encoder\_engine\_name, metadata)

if not os.path.exists(decoder\_engine\_name):
    t5\_trt\_decoder_engine = T5DecoderONNXFile(os.path.join(onnx\_model\_path, decoder\_onnx\_model_fpath), metadata).as\_trt\_engine(
        decoder\_engine\_name,
        profiles=\[decoder_profile\],
        preview_features=preview_features)
else:
    t5\_trt\_decoder_engine = T5DecoderTRTEngine(decoder\_engine\_name, metadata)

### Inference with TensorRT engine

Great, if you have reached this stage, it means we now have an optimized TensorRT engine for the T5 model, ready for us to carry out inference.

#### Single example inference

The T5 model with TensorRT backend can now be employed in place of the original HuggingFace T5 model.

In \[ \]:

\# Initialize TensorRT engines
from T5.trt import T5TRTEncoder, T5TRTDecoder

t5\_trt\_encoder = T5TRTEncoder(
                t5\_trt\_encoder_engine, metadata, config
            )
t5\_trt\_decoder = T5TRTDecoder(
                t5\_trt\_decoder_engine, metadata, config, num_beams=num_beams
            )

In \[ \]:

\# Inference on a single sample
encoder\_last\_hidden_state = t5\_trt\_encoder(input_ids=input_ids)
outputs = t5\_trt\_decoder(
    expand\_inputs\_for\_beam\_search(input_ids, num_beams) if num_beams > 1 else input_ids, 
    expand\_inputs\_for\_beam\_search(encoder\_last\_hidden_state, num_beams) if num_beams > 1 else encoder\_last\_hidden_state)

In \[ \]:

\# Generate sequence for an input
max_length = 64

decoder\_input\_ids = torch.full(
    (1, 1), tokenizer.convert\_tokens\_to_ids(tokenizer.pad_token), dtype=torch.int32
).to("cuda:0")

encoder\_last\_hidden_state = t5\_trt\_encoder(input_ids=input_ids)

#### TRT engine inference benchmark: encoder and decoder stacks

First, we will bechmark the encoder and decoder stacks as before.

In \[ \]:

encoder\_last\_hidden_state, encoder\_e2e\_median_time = encoder_inference(
    t5\_trt\_encoder, input_ids, TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50)
)
encoder\_e2e\_median_time

In \[ \]:

_, decoder\_e2e\_median_time = decoder_inference(
    t5\_trt\_decoder, expand\_inputs\_for\_beam\_search(input_ids, num_beams) if num_beams > 1 else input_ids, 
    expand\_inputs\_for\_beam\_search(encoder\_last\_hidden_state, num_beams) if num_beams > 1 else encoder\_last\_hidden_state, TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50)
)
decoder\_e2e\_median_time

### Full model inference benchmark

Next, we will try the full TensorRT T5 engine for the task of translation. As before, note the time difference.

In \[ \]:

decoder_output, full\_e2e\_median_runtime = full_inference(
    t5\_trt\_encoder,
    t5\_trt\_decoder,
    input_ids,
    tokenizer,
    TimingProfile(iterations=10, number=1, warmup=1, duration=0, percentile=50),
    max_length=T5ModelTRTConfig.MAX\_SEQUENCE\_LENGTH\[metadata.variant\],
    num_beams=num_beams,
    use_cuda=True,
)

print(tokenizer.decode(decoder_output\[0\], skip\_special\_tokens=True))
full\_e2e\_median_runtime

You can now compare the output of the original PyTorch model and the TensorRT engine. Notice the speed difference. On an NVIDIA V100 32GB GPU, this results in upto ~10x performance improvement (from 0.0802s to 0.0082s for the T5-small variant).

## Conclusion and where-to next?

This notebook has walked you through the process of converting a HuggingFace PyTorch T5 model to an optimized TensorRT engine for inference in 3 easy steps. The TensorRT inference engine can be conviniently used as a drop-in replacement for the orginial HuggingFace T5 model while providing significant speed up.

If you are interested in further details of the conversion process, check out  [T5/trt.py](https://github.com/NVIDIA/TensorRT/blob/59898c103f07e100d3c1108c038d767f5485e0b9/demo/HuggingFace/T5/trt.py)