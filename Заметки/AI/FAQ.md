## напиши telegram бота на python, он должен брать новости из rss и используя huggingface summarization модель постить перексаз поста в telegram

Код для создания telegram бота на python, который берет новости из RSS и использует Hugging Face Summarization модель, чтобы постить пересказ поста в telegram:

```python
import feedparser
import telegram
from transformers import pipeline

# Set up telegram bot token
bot_token = '<your_bot_token>'
bot = telegram.Bot(token=bot_token)

# Set up Hugging Face summarization pipeline
summarizer = pipeline("summarization")

# Set up RSS feed URL
rss_url = '<your_rss_feed_url>'
feed = feedparser.parse(rss_url)

# Loop through each post in the RSS feed
for post in feed.entries:
    # Get the title and URL of the post
    post_title = post.title
    post_url = post.link

    # Get the summary of the post using Hugging Face summarization
    post_summary = summarizer(post_title, max_length=120, min_length=30, do_sample=False)[0]['summary_text']

    # Send the post summary to telegram
    bot.send_message(chat_id='<your_chat_id>', text=post_summary)
```

Вам нужно заменить `<your_bot_token>`, `<your_rss_feed_url>` и `<your_chat_id>` на соответствующие значения. Вы также можете настроить параметры Hugging Face summarization pipeline, чтобы получить более точные резюме.

## надо учесть что у rss надо сохранять id или время прочитанного, чтобы не постить это повторно

Для того, чтобы учесть, что уже прочитанные новости не будут поститься повторно, вам нужно сохранять идентификаторы или даты/время прочитанного. Это можно сделать, например, сохраняя их в базе данных или в файле.

Вот обновленный код, который сохраняет даты/время прочитанного в файле и использует их для проверки, перед публикацией новой новости:

```python
import feedparser
import telegram
from transformers import pipeline
import datetime
import os

# Set up telegram bot token
bot_token = '<your_bot_token>'
bot = telegram.Bot(token=bot_token)

# Set up Hugging Face summarization pipeline
summarizer = pipeline("summarization")

# Set up RSS feed URL
rss_url = '<your_rss_feed_url>'
feed = feedparser.parse(rss_url)

# Set up file to store the dates/times of previously read posts
read_posts_file = 'read_posts.txt'
if not os.path.exists(read_posts_file):
    with open(read_posts_file, 'w') as f:
        pass

# Read in the dates/times of previously read posts
with open(read_posts_file, 'r') as f:
    read_posts = [line.strip() for line in f.readlines()]

# Loop through each post in the RSS feed
for post in feed.entries:
    # Get the title and URL of the post
    post_title = post.title
    post_url = post.link

    # Check if this post has already been read
    post_date = datetime.datetime.strptime(post.published, '%a, %d %b %Y %H:%M:%S %z')
    if post_date.isoformat() in read_posts:
        continue

    # Get the summary of the post using Hugging Face summarization
    post_summary = summarizer(post_title, max_length=120, min_length=30, do_sample=False)[0]['summary_text']

    # Send the post summary to telegram
    bot.send_message(chat_id='<your_chat_id>', text=post_summary)

    # Add the date/time of this post to the list of read posts
    with open(read_posts_file, 'a') as f:
        f.write(post_date.isoformat() + '\n')
```

В этой версии кода мы сохраняем даты/время прочитанного в файле `read_posts.txt`. Перед отправкой новости в telegram мы проверяем, есть ли дата/время этой новости в списке прочитанных. Если есть, мы пропускаем эту новость. После отправки новости мы добавляем дату/время этой новости в список прочитанных.