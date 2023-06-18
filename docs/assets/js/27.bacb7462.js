(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{301:function(e,t,n){"use strict";n.r(t);var s=n(14),o=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p",[e._v("Bert Model For Text Extraction With Code (Pytorch)")]),e._v(" "),t("p",[e._v("https://www.picuki.com/\nActually, What is Bert?\nBERT(Bidirectional Encoder Representation from Transformers) is an open-sourced NLP pre-trained model developed by Google. It is used to perform various NLP tasks like-Question Answering, Natural Language Inference(MLNI), and others. Actually Bert model is bunch of Transformer encoders stacked together(not whole Transformer model only encoder part). And Bert is trained on a large corpus of unlabeled data.")]),e._v(" "),t("p",[e._v("Using BERT for Text Extraction(According to sentiment)\n1-Data Preprocessing-\nWhen we want to extract text from a given context first need some data pre-processing i.e-to set data according to model. In this case, we have given some context and selected text.first of all we will have to tokenize the context by using any HuggingFace Tokenizer(https://github.com/huggingface/tokenizers)")]),e._v(" "),t("p",[e._v("For the input of our model, we required selected text as the target.given in Figure-")]),e._v(" "),t("p",[e._v("Code for data pre-processing")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('class TweetDataset:\n    def __init__(self,tweet,sentiment,selected_text):\n        self.tweet=tweet\n        self.sentiment=sentiment\n        self.selected_text=selected_text\n        self.max_len=config.MAX_LEN\n        self.tokenizer=config.TOKENIZER\n        \n    def __len__(self):\n        return len(self.tweet)\n    \n    def __getitem__(self,item):\n        tweet=" ".join(str(self.tweet[item]).split())\n        selected_text=" ".join(str(self.selected_text[item]).split())\n        \n        len_sel_text=len(selected_text)\n        idx0=-1\n        idx1=-1\n        for ind in (i for i,e in enumerate(tweet) if e==selected_text[0]):\n            if tweet[ind:ind+len(selected_text)]==selected_text:\n                idx0=ind\n                idx1=ind+len(selected_text)-1\n                break\n        \n        char_targets=[0]*len(tweet)\n        if idx0!=-1 and idx1!=-1:\n            for j in range(idx0,idx1+1):\n                if tweet[j]!=" ":\n                    char_targets[j]=1\n        tok_tweet=self.tokenizer.encode(tweet)\n        \n        tok_tweet_tokens=tok_tweet.tokens\n        tok_tweet_ids=tok_tweet.ids\n        tok_tweet_offsets=tok_tweet.offsets[1:-1]\n        \n        targets=[0]*(len(tok_tweet_tokens)-2)\n        for j,(offset1,offset2) in enumerate(tok_tweet_offsets):\n            if sum(char_targets[offset1:offset2])>0:\n                targets[j]=1\n        targets=[0]+targets+[0]\n        target_start=[0]*len(targets)\n        target_end=[0]*len(targets)\n        \n        non_zero=np.nonzero(targets)[0]\n        if len(non_zero)>0:\n            target_start[non_zero[0]]=1\n            target_end[non_zero[-1]]=1\n            \n        mask=[1]*len(tok_tweet_ids)\n        token_type_ids=[1]*len(tok_tweet_ids)\n        \n        padding_len=self.max_len-len(tok_tweet_ids)\n        \n        ids=tok_tweet_ids+[0]*padding_len\n        mask=mask+[0]*padding_len\n        token_tpye_ids=token_type_ids+[0]*padding_len\n        targets=targets+[0]*padding_len\n        target_start=target_start+[0]*padding_len\n        target_end=target_end+[0]*padding_len   \n        \n        sentiment=[1,0,0]\n        if self.sentiment[item]=="positive":\n            sentiment=[0,0,1]\n        if self.sentiment[item]=="negative":\n            sentiment=[0,1,0]\n        return {\n            "ids":torch.tensor(ids,dtype=torch.long),\n            "mask":torch.tensor(mask,dtype=torch.long),\n            "token_type_ids":torch.tensor(token_type_ids,dtype=torch.long),\n            "targets":torch.tensor(targets,dtype=torch.long),\n            "target_start":torch.tensor(target_start,dtype=torch.long),\n            "target_end":torch.tensor(target_end,dtype=torch.long),\n            "padding_len":torch.tensor(padding_len,dtype=torch.long),\n            "tweet_token":" ".join(tok_tweet_tokens),\n            "orig_tweet":self.tweet[item],\n            "sentiment":torch.tensor(sentiment,dtype=torch.long),\n            "orig_sentiment":self.sentiment[item],\n            "orig_selected_text":self.selected_text[item]\n        }\n')])])]),t("p",[e._v("2-Design Model\na)-Architecture of BERT")]),e._v(" "),t("p",[e._v("BERT is a multi-layer bidirectional Transformer encoder. There are two models introduced in the paper.")]),e._v(" "),t("p",[e._v("BERT base — 12 layers (transformer blocks), 12 attention heads, and 110 million parameters.\nBERT Large — 24 layers, 16 attention heads and, 340 million parameters.\nHere’s a representation of BERT Architecture")]),e._v(" "),t("p",[e._v("Bert model for text extraction is mostly similar to Question Answering problem. Just like sentence pair tasks, the question becomes the first sentence and paragraph the second sentence in the input sequence. There are only two new parameters learned during fine-tuning a start vector and an end vector with the size equal to the hidden shape size. The probability of token I being the start of the answer span is computed as — softmax(S . K), where S is the start vector and K is the final transformer output of token i.")]),e._v(" "),t("p",[e._v("Input Type for Bert\nb)Code for Model design-")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("class TweetModel(transformers.BertPreTrainedModel):\n    def __init__(self, conf):\n        super(TweetModel, self).__init__(conf)\n        self.bert = transformers.BertModel.from_pretrained(config.BERT_PATH, config=conf)\n        self.drop_out = nn.Dropout(0.1)\n        self.l0 = nn.Linear(768 * 2, 2)\n        torch.nn.init.normal_(self.l0.weight, std=0.02)\n    \n    def forward(self, ids, mask, token_type_ids):\n        _, _, out = self.bert(\n            ids,\n            attention_mask=mask,\n            token_type_ids=token_type_ids\n        )\n        out = torch.cat((out[-1], out[-2]), dim=-1)\n        out = self.drop_out(out)\n        logits = self.l0(out)\n        start_logits, end_logits = logits.split(1, dim=-1)\n        start_logits = start_logits.squeeze(-1)\n        end_logits = end_logits.squeeze(-1)\n        return start_logits, end_logits\n3-Training and Evolution\nTraining of the BERT model in PyTorch is similar to other models. First, we need to define a Loss Function and to find the accuracy Jaccard Function is useful.\n\ndef loss_fn(start_logits, end_logits, start_positions, end_positions):\n    loss_fct = nn.CrossEntropyLoss()\n    start_loss = loss_fct(start_logits, start_positions)\n    end_loss = loss_fct(end_logits, end_positions)\n    total_loss = (start_loss + end_loss)\n    return total_loss\ndef jaccard(str1, str2): \n    a = set(str1.lower().split()) \n    b = set(str2.lower().split())\n    c = a.intersection(b)\n    return float(len(c)) / (len(a) + len(b) - len(c))\n")])])]),t("p",[e._v("BERT is a deeply bidirectional model. Bidirectional means that BERT learns information from both the left and the right side of a token’s context during the training phase. so that, we required a Training function to train the model over the datasets, which takes DataLoader, Model, Optimizer, Device, Scheduler as input. It is similar to other PyTorch models Training.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('def train_fn(data_loader, model, optimizer, device, scheduler=None):\n    model.train()\n    losses = AverageMeter()\n    jaccards =AverageMeter()\n    tk0 = tqdm(data_loader, total=len(data_loader))\n    \n    for bi, d in enumerate(tk0):\n        ids = d["ids"]\n        token_type_ids = d["token_type_ids"]\n        mask = d["mask"]\n        targets_start = d["targets_start"]\n        targets_end = d["targets_end"]\n        sentiment = d["sentiment"]\n        orig_selected = d["orig_selected"]\n        orig_tweet = d["orig_tweet"]\n        targets_start = d["targets_start"]\n        targets_end = d["targets_end"]\n        offsets = d["offsets"]\n        ids = ids.to(device, dtype=torch.long)\n        token_type_ids = token_type_ids.to(device, dtype=torch.long)\n        mask = mask.to(device, dtype=torch.long)\n        targets_start = targets_start.to(device, dtype=torch.long)\n        targets_end = targets_end.to(device, dtype=torch.long)\n        model.zero_grad()\n        outputs_start, outputs_end = model(\n            ids=ids,\n            mask=mask,\n            token_type_ids=token_type_ids,\n        )\n        loss = loss_fn(outputs_start, outputs_end, targets_start, targets_end)\n        loss.backward()\n        optimizer.step()\n        scheduler.step()\n        outputs_start = torch.softmax(outputs_start, dim=1).cpu().detach().numpy()\n        outputs_end = torch.softmax(outputs_end, dim=1).cpu().detach().numpy()\n        jaccard_scores = []\n        for px, tweet in enumerate(orig_tweet):\n            selected_tweet = orig_selected[px]\n            tweet_sentiment = sentiment[px]\n            jaccard_score, _ = calculate_jaccard_score(\n                original_tweet=tweet,\n                target_string=selected_tweet,\n                sentiment_val=tweet_sentiment,\n                idx_start=np.argmax(outputs_start[px, :]),\n                idx_end=np.argmax(outputs_end[px, :]),\n                offsets=offsets[px]\n            )\n            jaccard_scores.append(jaccard_score)\n        jaccards.update(np.mean(jaccard_scores), ids.size(0))\n        losses.update(loss.item(), ids.size(0))\n        tk0.set_postfix(loss=losses.avg, jaccard=jaccards.avg)\n')])])]),t("p",[e._v("You can download complete code from my Github link-https://github.com/178shivam178/kaggle_problems/blob/master/Bert%20Model%20For%20Text%20Extraction.ipynb")]),e._v(" "),t("p",[e._v("And download pre-trained weights from-https://www.kaggle.com/shivam17818/bertbaseuncaseds")])])}),[],!1,null,null,null);t.default=o.exports}}]);