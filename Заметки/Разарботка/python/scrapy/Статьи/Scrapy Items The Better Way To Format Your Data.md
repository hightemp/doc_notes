## What Are Scrapy Items & Why Should We Use Them?[​](https://scrapeops.io/python-scrapy-playbook/scrapy-items/#what-are-scrapy-items--why-should-we-use-them "Direct link to heading")

[Scrapy Items](https://docs.scrapy.org/en/latest/topics/items.html) are a predefined data structure that holds your data.

Instead of yielding your scraped data in the form of a dictionary for example, you define a Item schema beforehand in your `items.py` file and use this schema when scraping data.

This enables you to quickly and easily check what structured data you are collecting in your project, it will raise exceptions if you try and create incorrect data with your Item.

Because of this, using Scrapy Items have a number of advantages:

-   Structures your data and gives it a clear schema.
-   Enables you to easily clean and process your scraped data.
-   Enables you to validate, deduplicate and monitor your data feeds.
-   Enables you to easily store and export your data with [Scrapy Feed Exports](https://docs.scrapy.org/en/1.8/topics/feed-exports.html).
-   Makes using [Scrapy Item Pipelines](https://docs.scrapy.org/en/latest/topics/item-pipeline.html) & [Item Loaders](https://docs.scrapy.org/en/latest/topics/loaders.html).

Scrapy supports multiple types of data formats that are automatically converted into Scrapy Items when yielded:

-   [Dictionaries](https://docs.scrapy.org/en/latest/topics/items.html#dict-items)
-   [Dataclass Objects](https://docs.scrapy.org/en/latest/topics/items.html#dataclass-items)
-   [Attrs Objects](https://docs.scrapy.org/en/latest/topics/items.html#attrs-items)

However, defining your own [**Item object**](https://docs.scrapy.org/en/latest/topics/items.html#item-objects) in your `items.py` file is normally the best option.

---

## How To Integrate Items Into Your Spiders[​](https://scrapeops.io/python-scrapy-playbook/scrapy-items/#how-to-integrate-items-into-your-spiders "Direct link to heading")

Creating an **Item** in Scrapy is very straight forward. Simply open your `items.py` file and define the data you would like to scrape by inheriting from the Scrapy Item class.

```python
# items.py  
  
from scrapy.item import Item, Field  
  
class QuoteItem(Item):  
text = Field()  
tags = Field()  
author = Field()
```

Then inside in your spider, instead of yielding a dictionary you would create a new Item with the scraped data before yielding it.

```python
# items.py  
  
import scrapy  
from items_demo.items import QuoteItem  
  
  
class QuotesSpider(scrapy.Spider):  
name = 'quotes'  
  
def start_requests(self):  
url = 'https://quotes.toscrape.com/'  
yield scrapy.Request(url, callback=self.parse)  
  
def parse(self, response):  
quote_item = QuoteItem()  
for quote in response.css('div.quote'):  
quote_item['text'] = quote.css('span.text::text').get()  
quote_item['author'] = quote.css('small.author::text').get()  
quote_item['tags'] = quote.css('div.tags a.tag::text').getall()  
yield quote_item
```

Now, all your scraped data will be contained in the structured `QuoteItem` we created which can then be sent through any active **Item Pipelines** to clean, validate and store your data.

---