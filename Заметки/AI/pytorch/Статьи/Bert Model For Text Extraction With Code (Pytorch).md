Bert Model For Text Extraction With Code (Pytorch)

https://www.picuki.com/
Actually, What is Bert?
BERT(Bidirectional Encoder Representation from Transformers) is an open-sourced NLP pre-trained model developed by Google. It is used to perform various NLP tasks like-Question Answering, Natural Language Inference(MLNI), and others. Actually Bert model is bunch of Transformer encoders stacked together(not whole Transformer model only encoder part). And Bert is trained on a large corpus of unlabeled data.

Using BERT for Text Extraction(According to sentiment)
1-Data Preprocessing-
When we want to extract text from a given context first need some data pre-processing i.e-to set data according to model. In this case, we have given some context and selected text.first of all we will have to tokenize the context by using any HuggingFace Tokenizer(https://github.com/huggingface/tokenizers)

For the input of our model, we required selected text as the target.given in Figure-


Code for data pre-processing

```
class TweetDataset:
    def __init__(self,tweet,sentiment,selected_text):
        self.tweet=tweet
        self.sentiment=sentiment
        self.selected_text=selected_text
        self.max_len=config.MAX_LEN
        self.tokenizer=config.TOKENIZER
        
    def __len__(self):
        return len(self.tweet)
    
    def __getitem__(self,item):
        tweet=" ".join(str(self.tweet[item]).split())
        selected_text=" ".join(str(self.selected_text[item]).split())
        
        len_sel_text=len(selected_text)
        idx0=-1
        idx1=-1
        for ind in (i for i,e in enumerate(tweet) if e==selected_text[0]):
            if tweet[ind:ind+len(selected_text)]==selected_text:
                idx0=ind
                idx1=ind+len(selected_text)-1
                break
        
        char_targets=[0]*len(tweet)
        if idx0!=-1 and idx1!=-1:
            for j in range(idx0,idx1+1):
                if tweet[j]!=" ":
                    char_targets[j]=1
        tok_tweet=self.tokenizer.encode(tweet)
        
        tok_tweet_tokens=tok_tweet.tokens
        tok_tweet_ids=tok_tweet.ids
        tok_tweet_offsets=tok_tweet.offsets[1:-1]
        
        targets=[0]*(len(tok_tweet_tokens)-2)
        for j,(offset1,offset2) in enumerate(tok_tweet_offsets):
            if sum(char_targets[offset1:offset2])>0:
                targets[j]=1
        targets=[0]+targets+[0]
        target_start=[0]*len(targets)
        target_end=[0]*len(targets)
        
        non_zero=np.nonzero(targets)[0]
        if len(non_zero)>0:
            target_start[non_zero[0]]=1
            target_end[non_zero[-1]]=1
            
        mask=[1]*len(tok_tweet_ids)
        token_type_ids=[1]*len(tok_tweet_ids)
        
        padding_len=self.max_len-len(tok_tweet_ids)
        
        ids=tok_tweet_ids+[0]*padding_len
        mask=mask+[0]*padding_len
        token_tpye_ids=token_type_ids+[0]*padding_len
        targets=targets+[0]*padding_len
        target_start=target_start+[0]*padding_len
        target_end=target_end+[0]*padding_len   
        
        sentiment=[1,0,0]
        if self.sentiment[item]=="positive":
            sentiment=[0,0,1]
        if self.sentiment[item]=="negative":
            sentiment=[0,1,0]
        return {
            "ids":torch.tensor(ids,dtype=torch.long),
            "mask":torch.tensor(mask,dtype=torch.long),
            "token_type_ids":torch.tensor(token_type_ids,dtype=torch.long),
            "targets":torch.tensor(targets,dtype=torch.long),
            "target_start":torch.tensor(target_start,dtype=torch.long),
            "target_end":torch.tensor(target_end,dtype=torch.long),
            "padding_len":torch.tensor(padding_len,dtype=torch.long),
            "tweet_token":" ".join(tok_tweet_tokens),
            "orig_tweet":self.tweet[item],
            "sentiment":torch.tensor(sentiment,dtype=torch.long),
            "orig_sentiment":self.sentiment[item],
            "orig_selected_text":self.selected_text[item]
        }
```

2-Design Model
a)-Architecture of BERT

BERT is a multi-layer bidirectional Transformer encoder. There are two models introduced in the paper.

BERT base — 12 layers (transformer blocks), 12 attention heads, and 110 million parameters.
BERT Large — 24 layers, 16 attention heads and, 340 million parameters.
Here’s a representation of BERT Architecture


Bert model for text extraction is mostly similar to Question Answering problem. Just like sentence pair tasks, the question becomes the first sentence and paragraph the second sentence in the input sequence. There are only two new parameters learned during fine-tuning a start vector and an end vector with the size equal to the hidden shape size. The probability of token I being the start of the answer span is computed as — softmax(S . K), where S is the start vector and K is the final transformer output of token i.


Input Type for Bert
b)Code for Model design-

```
class TweetModel(transformers.BertPreTrainedModel):
    def __init__(self, conf):
        super(TweetModel, self).__init__(conf)
        self.bert = transformers.BertModel.from_pretrained(config.BERT_PATH, config=conf)
        self.drop_out = nn.Dropout(0.1)
        self.l0 = nn.Linear(768 * 2, 2)
        torch.nn.init.normal_(self.l0.weight, std=0.02)
    
    def forward(self, ids, mask, token_type_ids):
        _, _, out = self.bert(
            ids,
            attention_mask=mask,
            token_type_ids=token_type_ids
        )
        out = torch.cat((out[-1], out[-2]), dim=-1)
        out = self.drop_out(out)
        logits = self.l0(out)
        start_logits, end_logits = logits.split(1, dim=-1)
        start_logits = start_logits.squeeze(-1)
        end_logits = end_logits.squeeze(-1)
        return start_logits, end_logits
3-Training and Evolution
Training of the BERT model in PyTorch is similar to other models. First, we need to define a Loss Function and to find the accuracy Jaccard Function is useful.

def loss_fn(start_logits, end_logits, start_positions, end_positions):
    loss_fct = nn.CrossEntropyLoss()
    start_loss = loss_fct(start_logits, start_positions)
    end_loss = loss_fct(end_logits, end_positions)
    total_loss = (start_loss + end_loss)
    return total_loss
def jaccard(str1, str2): 
    a = set(str1.lower().split()) 
    b = set(str2.lower().split())
    c = a.intersection(b)
    return float(len(c)) / (len(a) + len(b) - len(c))
```

BERT is a deeply bidirectional model. Bidirectional means that BERT learns information from both the left and the right side of a token’s context during the training phase. so that, we required a Training function to train the model over the datasets, which takes DataLoader, Model, Optimizer, Device, Scheduler as input. It is similar to other PyTorch models Training.

```
def train_fn(data_loader, model, optimizer, device, scheduler=None):
    model.train()
    losses = AverageMeter()
    jaccards =AverageMeter()
    tk0 = tqdm(data_loader, total=len(data_loader))
    
    for bi, d in enumerate(tk0):
        ids = d["ids"]
        token_type_ids = d["token_type_ids"]
        mask = d["mask"]
        targets_start = d["targets_start"]
        targets_end = d["targets_end"]
        sentiment = d["sentiment"]
        orig_selected = d["orig_selected"]
        orig_tweet = d["orig_tweet"]
        targets_start = d["targets_start"]
        targets_end = d["targets_end"]
        offsets = d["offsets"]
        ids = ids.to(device, dtype=torch.long)
        token_type_ids = token_type_ids.to(device, dtype=torch.long)
        mask = mask.to(device, dtype=torch.long)
        targets_start = targets_start.to(device, dtype=torch.long)
        targets_end = targets_end.to(device, dtype=torch.long)
        model.zero_grad()
        outputs_start, outputs_end = model(
            ids=ids,
            mask=mask,
            token_type_ids=token_type_ids,
        )
        loss = loss_fn(outputs_start, outputs_end, targets_start, targets_end)
        loss.backward()
        optimizer.step()
        scheduler.step()
        outputs_start = torch.softmax(outputs_start, dim=1).cpu().detach().numpy()
        outputs_end = torch.softmax(outputs_end, dim=1).cpu().detach().numpy()
        jaccard_scores = []
        for px, tweet in enumerate(orig_tweet):
            selected_tweet = orig_selected[px]
            tweet_sentiment = sentiment[px]
            jaccard_score, _ = calculate_jaccard_score(
                original_tweet=tweet,
                target_string=selected_tweet,
                sentiment_val=tweet_sentiment,
                idx_start=np.argmax(outputs_start[px, :]),
                idx_end=np.argmax(outputs_end[px, :]),
                offsets=offsets[px]
            )
            jaccard_scores.append(jaccard_score)
        jaccards.update(np.mean(jaccard_scores), ids.size(0))
        losses.update(loss.item(), ids.size(0))
        tk0.set_postfix(loss=losses.avg, jaccard=jaccards.avg)
```

You can download complete code from my Github link-https://github.com/178shivam178/kaggle_problems/blob/master/Bert%20Model%20For%20Text%20Extraction.ipynb

And download pre-trained weights from-https://www.kaggle.com/shivam17818/bertbaseuncaseds