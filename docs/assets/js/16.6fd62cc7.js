(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{288:function(t,a,s){"use strict";s.r(a);var e=s(14),n=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("https://medium.com/depurr/automatic-models-loading-using-hugging-face-80c5fe778169")]),t._v(" "),a("h1",{attrs:{id:"automatic-model-loading-using-hugging-face"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#automatic-model-loading-using-hugging-face"}},[t._v("#")]),t._v(" Automatic Model Loading using Hugging Face")]),t._v(" "),a("h2",{attrs:{id:"from-a-large-selection-of-bert-based-models"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#from-a-large-selection-of-bert-based-models"}},[t._v("#")]),t._v(" From a Large Selection of BERT-based Models")]),t._v(" "),a("p",[t._v("This article shows how we can use "),a("a",{attrs:{href:"https://huggingface.co/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Hugging Face"),a("OutboundLink")],1),t._v("’s "),a("code",[t._v("Auto")]),t._v(" commands to reduce the hustle of specifying model details as we experiment with different "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/BERT_(language_model)",target:"_blank",rel:"noopener noreferrer"}},[t._v("BERT"),a("OutboundLink")],1),t._v("-based models for Natural Language Processing Tasks. From my own experiences, I found it really time-consuming to write custom tokenizers and model loading scripts for various reasons:")]),t._v(" "),a("p",[t._v("First, across NLP models there are variations in their tokenizers as they are often trained on different datasets, e.g., BERT and RoBERTa models have entirely different structures of tokenizers.")]),t._v(" "),a("p",[t._v("Second, even for a single type of model, there are variations based on cased or uncased texts, or how deep the models are, e.g., BERT model can have a cased and an uncased version, just to name a few.")]),t._v(" "),a("p",[t._v("Third, most of the NLP training is essentially transfer learning, so we have relied heavily on pretrained weights. Looking for the correct pretrained model of a particular version (e.g., cased) of a particular type of model (e.g., RoBERTa) is tedious.")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://miro.medium.com/max/700/0*Vw11Rxb0ukuzqebu",alt:""}})]),t._v(" "),a("p",[t._v("Photo by "),a("a",{attrs:{href:"https://unsplash.com/@rvignes?utm_source=medium&utm_medium=referral",target:"_blank",rel:"noopener noreferrer"}},[t._v("Romain Vignes"),a("OutboundLink")],1),t._v(" on "),a("a",{attrs:{href:"https://unsplash.com/?utm_source=medium&utm_medium=referral",target:"_blank",rel:"noopener noreferrer"}},[t._v("Unsplash"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("So, for our rescue Hugging Face has provided a very convenient "),a("code",[t._v("Auto")]),t._v(" tool and I will demystify it here.")]),t._v(" "),a("h2",{attrs:{id:"therefore-with-the-auto-tool"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#therefore-with-the-auto-tool"}},[t._v("#")]),t._v(" Therefore, with the Auto Tool")]),t._v(" "),a("blockquote",[a("ol",[a("li",[a("p",[t._v("We don’t need to hand-code text sequences to satisfy the need of tokenizers of different BERT models.")])]),t._v(" "),a("li",[a("p",[t._v("NLP models can be changed just by changing a global "),a("code",[t._v("model_name")]),t._v(" variable and Hugging Face API will take care of the rest.")])])])]),t._v(" "),a("h1",{attrs:{id:"that-s-simply-amazing"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#that-s-simply-amazing"}},[t._v("#")]),t._v(" "),a("em",[t._v("That’s simply amazing!")])]),t._v(" "),a("p",[t._v("Please note that Hugging Face Auto modules are actively under development if something new is added to their library that I missed please mention it in the comment, and I will update the article.")]),t._v(" "),a("h1",{attrs:{id:"how-to-code-in-python-using-auto"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#how-to-code-in-python-using-auto"}},[t._v("#")]),t._v(" How to Code in Python using "),a("code",[t._v("Auto")])]),t._v(" "),a("h2",{attrs:{id:"import-packages"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#import-packages"}},[t._v("#")]),t._v(" Import Packages")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" os"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" sys  \n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" numpy "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" np  \n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" pandas "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" pd  \n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" torch  \n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" transformers "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" AutoTokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" AutoModel\n")])])]),a("h2",{attrs:{id:"get-data"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#get-data"}},[t._v("#")]),t._v(" Get Data")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("train_data "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("read_csv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/kaggle/input/zenify-tweet-train-folds/train_folds.csv'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \ntrain_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h1",{attrs:{id:"global-variables"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#global-variables"}},[t._v("#")]),t._v(" Global Variables")]),t._v(" "),a("h2",{attrs:{id:"available-models"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#available-models"}},[t._v("#")]),t._v(" Available Models")]),t._v(" "),a("p",[a("strong",[a("em",[t._v("Disclaimer")])]),a("em",[t._v(": Most popular models are compatible, but not all. Just change the")]),t._v(" "),a("code",[t._v("_model_name_")]),t._v(" "),a("em",[t._v("to check if it is.")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("bert-base-uncased  \nbert-large-uncased  \nbert-base-cased  \nbert-large-cased  \nbert-base-multilingual-uncased  \nbert-base-multilingual-cased  \nbert-base-chinese  \nbert-base-german-cased  \nbert-large-uncased-whole-word-masking  \nbert-large-cased-whole-word-masking  \nbert-large-uncased-whole-word-masking-finetuned-squad  \nbert-large-cased-whole-word-masking-finetuned-squad  \nbert-base-cased-finetuned-mrpc  \nbert-base-german-dbmdz-cased  \nbert-base-german-dbmdz-uncased  \nbert-base-japanese  \nbert-base-japanese-whole-word-masking  \nbert-base-japanese-char  \nbert-base-japanese-char-whole-word-masking  \nbert-base-finnish-cased-v1  \nbert-base-finnish-uncased-v1  \nbert-base-dutch-cased  \nopenai-gpt  \ngpt2  \ngpt2-medium  \ngpt2-large  \ngpt2-xl  \ntransfo-xl-wt103  \nxlnet-base-cased  \nxlnet-large-cased  \nxlm-mlm-en-2048  \nxlm-mlm-ende-1024  \nxlm-mlm-enfr-1024  \nxlm-mlm-enro-1024  \nxlm-mlm-xnli15-1024  \nxlm-mlm-tlm-xnli15-1024  \nxlm-clm-enfr-1024  \nxlm-clm-ende-1024  \nxlm-mlm-17-1280  \nxlm-mlm-100-1280  \nroberta-base  \nroberta-large  \nroberta-large-mnli  \ndistilroberta-base  \nroberta-base-openai-detector  \nroberta-large-openai-detector  \ndistilbert-base-uncased  \ndistilbert-base-uncased-distilled-squad  \ndistilbert-base-cased  \ndistilbert-base-cased-distilled-squad  \ndistilgpt2  \ndistilbert-base-german-cased  \ndistilbert-base-multilingual-cased  \nctrl  \ncamembert-base  \nalbert-base-v1  \nalbert-large-v1  \nalbert-xlarge-v1  \nalbert-xxlarge-v1  \nalbert-base-v2  \nalbert-large-v2  \nalbert-xlarge-v2  \nalbert-xxlarge-v2  \nt5-small  \nt5-base  \nt5-large  \nt5-3B  \nt5-11B  \nxlm-roberta-base  \nxlm-roberta-large  \nflaubert-small-cased  \nflaubert-base-uncased  \nflaubert-base-cased  \nflaubert-large-cased  \nbart-large  \nbart-large-mnli  \nbart-large-cnn  \nmbart-large-en-ro  \nDialoGPT-small  \nDialoGPT-medium  \nDialoGPT-largemodel_name = \"roberta-base\"  \nsanitycheck_model_names = ['bert-base-uncased',  \n'bert-large-uncased','bert-base-cased','bert-large-cased','bert-base-multilingual-uncased','bert-base-multilingual-cased','roberta-base','roberta-large','albert-base-v1','albert-large-v1','albert-xlarge-v1']\n")])])]),a("h1",{attrs:{id:"define-tokenizer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#define-tokenizer"}},[t._v("#")]),t._v(" Define Tokenizer")]),t._v(" "),a("p",[a("code",[t._v("AutoTokenizer")])]),t._v(" "),a("ol",[a("li",[t._v("To find how to estimate “offset” in auto settings, I had to dig a lot. It was recently added as a part of PreTrainedTokenizerFirst. Please look at this "),a("a",{attrs:{href:"https://github.com/huggingface/transformers/pull/2674",target:"_blank",rel:"noopener noreferrer"}},[t._v("thread"),a("OutboundLink")],1),t._v(" for more details.")]),t._v(" "),a("li",[t._v("Offset estimation is not implemented in "),a("code",[t._v("albert")]),t._v(" models. Therefore, you have to set "),a("code",[t._v("return_offsets_mapping=False")]),t._v(" for "),a("code",[t._v("albert")]),t._v(" models")]),t._v(" "),a("li",[t._v("RoBERTa does not have a "),a("code",[t._v("token_type_ids")]),t._v(". Remember from their paper that "),a("code",[t._v("RoBERTa")]),t._v(" dropped second sentence prediction from the architecture, so just set all token ids to "),a("code",[t._v("1")]),t._v("!!")])]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("tokenizer "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" AutoTokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("from_pretrained"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("model_name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" use_fast"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" train_index "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("range")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n    question "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" train_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("sentiment"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("train_index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("  \n    answer "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" train_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("text"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("train_index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("  \n    encoded_input "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" tokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("encode_plus"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("question"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" answer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" add_special_tokens"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" return_offsets_mapping"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"**\\n**Question: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" question "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("', Answer: '")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" answer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Encoded Input: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'input_ids'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Attention Mask: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'attention_mask'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Offset: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'offset_mapping'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Token Type Ids: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'token_type_ids'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("except")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("pass")]),t._v("\n")])])]),a("h2",{attrs:{id:"sanity-check-tokenizer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sanity-check-tokenizer"}},[t._v("#")]),t._v(" Sanity Check Tokenizer")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" model_ "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" sanitycheck_model_names"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"**\\n**Model: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" model_"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        tokenizer "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" AutoTokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("from_pretrained"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("model_"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" use_fast"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        question "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" train_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("sentiment"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("  \n        answer "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" train_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("text"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("  \n      \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" model_ "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"albert-base-v1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"albert-large-v1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"albert-xlarge-v1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n            encoded_input "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" tokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("encode_plus"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("question"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" answer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" add_special_tokens"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" return_offsets_mapping"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("False")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("          \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n            encoded_input "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" tokenizer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("encode_plus"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("question"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" answer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" add_special_tokens"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" return_offsets_mapping"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n              \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Question: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" question "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("', Answer: '")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" answer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Encoded Input: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'input_ids'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Attention Mask: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'attention_mask'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Offset: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'offset_mapping'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Token Type Ids: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encoded_input"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'token_type_ids'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("except")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("pass")]),t._v("\n")])])]),a("h1",{attrs:{id:"define-model"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#define-model"}},[t._v("#")]),t._v(" Define Model")]),t._v(" "),a("p",[a("code",[t._v("AutoModel")])]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("model "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" AutoModel"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("from_pretrained"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("model_name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" model_ "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("**")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("**")]),t._v(" sanitycheck_model_names"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"**\\n**Model: "')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" model_"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        model "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" AutoModel"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("from_pretrained"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("model_"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Model successfully loaded!"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("del")]),t._v(" model  \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("except")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  \n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("pass")]),t._v("\n")])])]),a("p",[t._v("Some excellent examples are available here: "),a("a",{attrs:{href:"https://huggingface.co/transformers/usage.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://huggingface.co/transformers/usage.html"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("Now you can do your own transfer learning!")])])}),[],!1,null,null,null);a.default=n.exports}}]);