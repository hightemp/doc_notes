https://www.reddit.com/r/LocalLLaMA/comments/11o6o3f/how_to_install_llama_8bit_and_4bit/

FAQ

**Q:** What is LLaMA?

**A:** LLaMA (Large Language Model Meta AI) is a foundational large language model designed primarily for researchers. Like other large language models, LLaMA works by taking a sequence of words as an input and predicts a next word to recursively generate text.

**Q:** Is LLaMA like ChatGPT?

**A:** No. LLaMA models are not finetuned for question answering. They should be prompted so that the expected answer is the natural continuation of the prompt. Nonetheless, it is possible to chat with LLaMA models in a way similar to ChatGPT but not near the same quality.

**Q:** What languages does LLaMA support?

**A:** Primarily English, but it should have limited capabilities for the following languages: bg, ca, cs, da, de, es, fr, hr, hu, it, nl, pl, pt, ro, ru, sl, sr, sv, uk.

**Q:** I've heard about Alpaca. What is that?

**A:** That refers to the [Stanford Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html) project, an effort to build an instruction-following LLaMA model from the standard 7B LLaMA model. It has been shown to produce results similar to OpenAI's text-davinci-003. This guide contains instructions on trying out Alpaca using a few different methods.

8-bit Model Requirements

Model

VRAM Used

Minimum Total VRAM

Card examples

RAM/Swap to Load*

LLaMA-7B

9.2GB

10GB

3060 12GB, 3080 10GB

24 GB

LLaMA-13B

16.3GB

20GB

3090, 3090 Ti, 4090

32GB

LLaMA-30B

36GB

40GB

A6000 48GB, A100 40GB

72GB

LLaMA-65B

74GB

80GB

A100 80GB

144GB

*_System RAM, not VRAM, required to load the model, in addition to having enough VRAM. NOT required to RUN the model. You can use swap space if you do not have enough RAM._

4-bit Model Requirements

Model

Minimum Total VRAM

Card examples

RAM/Swap to Load

LLaMA-7B

6GB

GTX 1660, 2060, AMD 5700 XT, RTX 3050, 3060

16 GB

LLaMA-13B

10GB

AMD 6900 XT, RTX 2060 12GB, 3060 12GB, 3080, A2000

32 GB

LLaMA-30B

20GB

RTX 3080 20GB, A4500, A5000, 3090, 4090, 6000, Tesla V100

64 GB

LLaMA-65B

40GB

A100 40GB, 2x3090, 2x4090, A40, RTX A6000, 8000

128 GB

Installing Windows Subsystem for Linux (WSL)

>>**WSL installation is optional.<< If you do not want to install this, you can skip over to the Windows specific instructions below for 8-bit or 4-bit. This section requires an NVIDIA GPU.**

On Windows, you may receive better performance when using WSL. To install WSL using the instructions below, first ensure you are running at least Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11. To check for this, type info in the search box on your taskbar and then select System Information. Alternatively, hit Windows+R, type msinfo32 into the "Open" field, and then hit enter. Look at "Version" to see what version you are running.

**Instructions:**

1.  Open Powershell in administrator mode
    
2.  Enter the following command then restart your machine: wsl --install
    

This command will enable WSL, download and install the lastest Linux Kernel, use WSL2 as default, and download and install the Ubuntu Linux distribution.

3. After restart, Windows will finish installing Ubuntu. You'll be asked to create a username and password for Ubuntu. It has no bearing on your Windows username.

4. Windows will not automatically update or upgrade Ubuntu. Update and upgrade your packages by running the following command in the Ubuntu terminal (search for Ubuntu in the Start menu or taskbar and open the app): sudo apt update && sudo apt upgrade

5. You can now continue by following the Linux setup instructions for LLaMA. **Check the necessary troubleshooting info below to resolve errors**. If you plan on using 4-bit LLaMA with WSL, you will need to install the WSL-Ubuntu CUDA toolkit using the instructions below.

**Extra tips:**

To install conda, run the following inside the Ubuntu environment:

```
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

To find the name of a WSL distribution and uninstall it (afterward, you can create a new virtual machine environment by opening the app again):

```
wsl -l
wsl --unregister <DistributionName>
```

To access the web UI from another device on your local network, you will need to configure port forwarding:

```
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=7860 connectaddress=localhost connectport=7860
```

**Troubleshooting:**

If you will use 4-bit LLaMA with WSL, you must install the WSL-Ubuntu CUDA toolkit, and it must be 11.7. This CUDA toolkit will not overwrite your WSL2 driver unlike the default CUDA toolkit. Follow these steps:

```
sudo apt-key del 7fa2af80 
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.7.0/local_installers/cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb
sudo dpkg -i cuda-repo-wsl-ubuntu-11-7-local_11.7.0-1_amd64.deb
sudo cp /var/cuda-repo-wsl-ubuntu-11-7-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda
```

In order to avoid a CUDA error when starting the web UI, you will need to apply the following fix as seen in [this comment](https://github.com/TimDettmers/bitsandbytes/issues/156#issuecomment-1462329713) and issue [#400](https://github.com/oobabooga/text-generation-webui/issues/400#issuecomment-1474876859):

```
cd /home/USERNAME/miniconda3/envs/textgen/lib/python3.10/site-packages/bitsandbytes/
cp libbitsandbytes_cuda117.so libbitsandbytes_cpu.so
conda install cudatoolkit
```

If for some reason installing the WSL-Ubuntu CUDA toolkit does not work for you, [this alternate fix](https://github.com/oobabooga/text-generation-webui/issues/416#issuecomment-1475078571) should resolve any errors relating to that.

You may also need to create symbolic links to get everything working correctly. Do not do this if the above commands resolve your errors. To create the symlinks, follow the instructions [here](https://github.com/microsoft/WSL/issues/5548#issuecomment-1292858815) then restart your machine.

Installing 8-bit LLaMA with text-generation-webui

Linux:

1.  Follow the [instructions here](https://github.com/oobabooga/text-generation-webui) under "Installation"
    
2.  Download the desired Hugging Face converted model for LLaMA [here](https://huggingface.co/decapoda-research)
    
3.  Copy the entire model folder, for example llama-13b-hf, into text-generation-webui\models
    
4.  Run the following command in your conda environment: python server.py --model llama-13b-hf --load-in-8bit
    

Windows:

1.  Install [miniconda](https://docs.conda.io/en/latest/miniconda.html)
    
2.  Activate conda via powershell, replacing USERNAME with your username: powershell -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\USERNAME\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\USERNAME\miniconda3' "
    
3.  Follow the [instructions here](https://github.com/oobabooga/text-generation-webui) under "Installation", starting with the step "Create a new conda environment."
    
4.  Download the desired Hugging Face converted model for LLaMA [here](https://huggingface.co/decapoda-research)
    
5.  Copy the entire model folder, for example llama-13b-hf, into text-generation-webui\models
    
6.  Download [libbitsandbytes_cuda116.dll](https://github.com/DeXtmL/bitsandbytes-win-prebuilt) and put it in C:\Users\xxx\miniconda3\envs\textgen\lib\site-packages\bitsandbytes\
    
7.  **In** \bitsandbytes\cuda_setup\main.py **search for:** `if not torch.cuda.is_available(): return 'libsbitsandbytes_cpu.so', None, None, None, None` **and replace with:** `if torch.cuda.is_available(): return 'libbitsandbytes_cuda116.dll', None, None, None, None`
    
8.  **In** \bitsandbytes\cuda_setup\main.py **search for this** **twice:** `self.lib = ct.cdll.LoadLibrary(binary_path)` **and replace with:** `self.lib = ct.cdll.LoadLibrary(str(binary_path))`
    
9.  Run the following command in your conda environment: python server.py --model llama-13b-hf --load-in-8bit
    

**Note:** for decapoda-research models, you must **change** "tokenizer_class": "LLaMATokenizer" **to** "tokenizer_class": "LlamaTokenizer" **in** text-generation-webui/models/llama-13b-hf/tokenizer_config.json

Installing 4-bit LLaMA with text-generation-webui

Linux:

1.  Follow the [instructions here](https://github.com/oobabooga/text-generation-webui) under "Installation"
    
2.  Continue with the 4-bit specific [instructions here](https://github.com/oobabooga/text-generation-webui/wiki/LLaMA-model#4-bit-mode)
    

Windows (Step-by-Step):

1.  Install Build Tools for Visual Studio 2019 (has to be 2019) [here](https://learn.microsoft.com/en-us/visualstudio/releases/2019/history#release-dates-and-build-numbers). Check "Desktop development with C++" when installing.
    
2.  Install [miniconda](https://docs.conda.io/en/latest/miniconda.html)
    
3.  Install Git from the [website](https://git-scm.com/download/win) or simply with cmd prompt: winget install --id Git.Git -e --source winget
    
4.  Open "x64 native tools command prompt" as admin
    
5.  Activate conda, replacing USERNAME with your username: powershell -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\USERNAME\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\USERNAME\miniconda3' "
    
6.  conda create -n textgen python=3.10.9
    
7.  conda activate textgen
    
8.  conda install cuda -c nvidia/label/cuda-11.3.0 -c nvidia/label/cuda-11.3.1
    
9.  git clone [https://github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)
    
10.  cd text-generation-webui
    
11.  pip install -r requirements.txt
    
12.  pip install torch==1.12+cu113 -f [https://download.pytorch.org/whl/torch_stable.html](https://download.pytorch.org/whl/torch_stable.html)
    
13.  mkdir repositories
    
14.  cd repositories
    
15.  git clone [https://github.com/qwopqwop200/GPTQ-for-LLaMa](https://github.com/qwopqwop200/GPTQ-for-LLaMa)
    
16.  cd GPTQ-for-LLaMa
    
17.  git reset --hard c589c5456cc1c9e96065a5d285f8e3fac2cdb0fd
    
18.  pip install ninja
    
19.  $env:DISTUTILS_USE_SDK=1
    
20.  python setup_cuda.py install
    
21.  Download the 4-bit model of your choice and place it directly into your models folder. For instance, models/llama-13b-4bit-128g. The links for the updated 4-bit models are listed below in the models directory section. If you will use 7B 4-bit, download **without group-size**. For 13B 4-bit and up, download **with group-size**.
    
22.  Run the following command in your conda environment: _**without group-size**_ python server.py --model llama-7b-4bit --wbits 4 --no-stream _**with group-size**_ python server.py --model llama-13b-4bit-128g --wbits 4 --groupsize 128 --no-stream
    

**Note:** If you get the error "CUDA Setup failed despite GPU being available", do the patch in steps 6-8 of the 8-bit instructions above.

Using Alpaca-LoRA with text-generation-webui

**Make sure to follow the installation instructions for 8-bit LLaMA before using this.**

This is to reproduce the [Stanford Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html) results using low-rank adaptation (LoRA). The LoRA model produces outputs comparable to the Stanford Alpaca model, which itself can produce results of similar quality to text-davinci-003. You will need the baseline [7B LLaMA model](https://huggingface.co/decapoda-research/llama-7b-hf) downloaded and placed inside the models folder before following these steps.

**Instructions:**

1.  Navigate to the text-generation-webui folder
    
2.  Ensure it's up to date with: git pull [https://github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)
    
3.  Re-install the requirements _if needed_: pip install -r requirements.txt
    
4.  Navigate to the loras folder and download the LoRA with: git lfs install && git clone [https://huggingface.co/tloen/alpaca-lora-7b](https://huggingface.co/tloen/alpaca-lora-7b)
    
5.  Load LLaMa-7B in **8-bit mode only**: python server.py --model llama-7b-hf --load-in-8bit
    
6.  Select the LoRA in the Parameters tab
    

**Notes:**

For this particular LoRA, the prompt must be formatted like this (the starting line must be below "Response"):

```
Below is an instruction that describes a task. Write a response that appropriately completes the request.
### Instruction:
Tell me about alpacas.
### Response:
<your cursor should be on this line>
```

Message from the creator:

> We're continually fixing bugs and conducting training runs, and the weights on the Hugging Face Hub are being updated accordingly. In particular, those facing issues with response lengths should make sure that they have the latest version of the weights and code.

Tips and Output Settings in text-generation-webui

-   For a ChatGPT/CharacterAI style chat, pass --cai-chat to server.py. For more info on flags, check [here](https://github.com/oobabooga/text-generation-webui#starting-the-web-ui).
    
-   Character cards can be used to guide responses toward a desired output and improve results.
    
-   For a more creative chat, use: temp 0.72, rep pen 1.1, top_k 0, and top_p 0.73
    
-   For a more precise chat, use temp 0.7, repetition_penalty 1.1764705882352942 (1/0.85), top_k 40, and top_p 0.1
    
-   The [Getting Started](https://www.reddit.com/r/LocalLLaMA/wiki/index) page of the wiki has a few extra tips on prompts and parameters.
    

For a quick reference, here is an example chat with LLaMA 13B:

[![r/LocalLLaMA - How to install LLaMA: 8-bit and 4-bit](https://preview.redd.it/yhyuzgg6d8oa1.png?width=634&format=png&auto=webp&v=enabled&s=e703895ad863c57239d9d4602f105558ce6f1a8f)](https://preview.redd.it/yhyuzgg6d8oa1.png?width=634&format=png&auto=webp&v=enabled&s=e703895ad863c57239d9d4602f105558ce6f1a8f)

Other ways to run LLaMA

**If you have the hardware, it is recommended to use text-generation-webui for the best user experience.**

[llama.cpp](https://github.com/ggerganov/llama.cpp): a plain C/C++ implementation that runs on the CPU. There is full documentation on the GitHub page for getting started with it.

[alpaca.cpp](https://github.com/antimatter15/alpaca.cpp): a quick and easy way to try a reproduction of the Stanford Alpaca model. The GitHub page explains the setup process. With the introduction of Alpaca into llama.cpp, alpaca.cpp is deprecated but functional.

Models Directory

**Standard** LLaMA models

7B: [https://huggingface.co/decapoda-research/llama-7b-hf](https://huggingface.co/decapoda-research/llama-7b-hf)

13B: [https://huggingface.co/decapoda-research/llama-13b-hf](https://huggingface.co/decapoda-research/llama-13b-hf)

30B: [https://huggingface.co/decapoda-research/llama-30b-hf](https://huggingface.co/decapoda-research/llama-30b-hf)

65B: [https://huggingface.co/decapoda-research/llama-65b-hf](https://huggingface.co/decapoda-research/llama-65b-hf)

7B-65B 4-bit without group-size (torrent file): [https://github.com/oobabooga/text-generation-webui/files/11069779/LLaMA-HF-4bit.zip](https://github.com/oobabooga/text-generation-webui/files/11069779/LLaMA-HF-4bit.zip)

7B-65B 4-bit with group-size (torrent file): [https://github.com/oobabooga/text-generation-webui/files/11070361/LLaMA-HF-4bit-128g.zip](https://github.com/oobabooga/text-generation-webui/files/11070361/LLaMA-HF-4bit-128g.zip)

**Finetuned** LLaMA models and LoRAs

[Alpaca-LoRA 7B](https://huggingface.co/tloen/alpaca-lora-7b)

[Alpaca LoRA 13B](https://huggingface.co/chansung/alpaca-lora-13b)

[Alpaca LoRA 30B](https://huggingface.co/chansung/alpaca-lora-30b)

[Alpaca Native (7B)](https://huggingface.co/chavinlo/alpaca-native)

[Alpaca Native 4-bit (7B)](https://huggingface.co/ozcur/alpaca-native-4bit)

[gpt4all LoRA 7B](https://huggingface.co/nomic-ai/gpt4all-lora)

Resources used for this guide

[GitHub - oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)

[Support for LLaMA models · Issue #147](https://github.com/oobabooga/text-generation-webui/issues/147)

[Hugging Face Models](https://huggingface.co/decapoda-research)

[Alpaca-LoRA](https://github.com/tloen/alpaca-lora)

[Detailed parameters](https://huggingface.co/docs/api-inference/detailed_parameters)

[GPTQ for LLaMA](https://github.com/qwopqwop200/GPTQ-for-LLaMa)

[Rentry](https://rentry.org/llama-tard-v2)

[NVIDIA GPU Accelerated Computing on WSL 2](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)

[65b_sample.txt](https://gist.github.com/shawwn/03ee2422c41ef253cbef61d8c317d9ab)