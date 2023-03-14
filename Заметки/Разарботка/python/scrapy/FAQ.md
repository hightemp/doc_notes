## Scrape with scrapy using saved html pages

I have had great success with using [`request_fingerprint`](https://github.com/scrapy/scrapy/blob/1.5.1/scrapy/utils/request.py#L19) to inject existing HTML files into [`HTTPCACHE_DIR`](https://github.com/scrapy/scrapy/blob/1.5.1/scrapy/extensions/httpcache.py#L275) (which is almost always `.scrapy/httpcache/${spider_name}`). Then, turning on the aforementioned [http cache middleware](https://doc.scrapy.org/en/1.5/topics/downloader-middleware.html#module-scrapy.downloadermiddlewares.httpcache) which defaults to the file based cache storage, and the "Dummy Policy" which considers the on-disk file authoritative and won't make a network request if it finds the URL in the cache.

I would expect the script would something like (this is just the general idea, and not guaranteed to even run):

```xml
import sys
from scrapy.extensions.httpcache import FilesystemCacheStorage
from scrapy.http import Request, HtmlResponse
from scrapy.settings import Settings

# this value is the actual URL from which the on-disk file was saved
# not the "file://" version
url = sys.argv[1]
html_filename = sys.argv[2]
with open(html_filename) as fh:
    html_bytes = fh.read()
req = Request(url=url)
resp = HtmlResponse(url=req.url, body=html_bytes, encoding='utf-8', request=req)
settings = Settings()
cache = FilesystemCacheStorage(settings)
spider = None  # fill in your Spider class here
cache.store_response(spider, req, resp)
```

## как в scrapy при парсинге сайта сохранять html и кэшировать его?

Scrapy использует свой собственный инструмент для загрузки веб-страниц, который называется `scrapy.Request`. Вы можете использовать этот инструмент для загрузки страниц и сохранения HTML-кода в файлы.

Для сохранения HTML-кода в файлы вы можете использовать средства, предоставляемые Scrapy. Например, вы можете использовать класс `scrapy.extensions.httpcache.FilesystemCacheStorage`, чтобы кэшировать загруженные страницы на диск. Этот класс сохраняет кэшированные страницы в директории, указанной в настройке `HTTPCACHE_DIR`. Если страницы уже загружены и сохранены в кэше, Scrapy будет использовать их, вместо загрузки снова.

Вот пример кода, который загружает страницу с помощью `scrapy.Request`, сохраняет HTML-код в файл и кэширует его, если это необходимо:

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'

    def start_requests(self):
        # URL страницы для загрузки
        url = 'https://example.com/'

        # Имя файла для сохранения HTML-кода
        filename = 'example.html'

        # Загружаем страницу с помощью scrapy.Request
        yield scrapy.Request(url, callback=self.parse, meta={'filename': filename})

    def parse(self, response):
        # Получаем имя файла для сохранения HTML-кода из метаданных ответа
        filename = response.meta['filename']

        # Сохраняем HTML-код в файл
        with open(filename, 'wb') as f:
            f.write(response.body)

        # Возвращаем HTML-код в виде строки
        html = response.text

        # Теперь вы можете использовать HTML-код для парсинга страницы
        # ...

```

В этом примере, если файл уже существует, Scrapy загрузит его из кэша, вместо загрузки страницы снова. Если файла еще нет, Scrapy загрузит страницу и сохранит ее в файл, а затем сохранит ее в кэше для будущих загрузок.

Обратите внимание, что для использования кэша вам нужно настроить настройки Scrapy, связанные с кэшированием. Вы можете настроить эти настройки в файле `settings.py` вашего проекта. Например, чтобы использовать `FilesystemCacheStorage`, вы можете добавить следующие строки в `settings.py`:

```python
HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'
HTTPCACHE_ENABLED = True
HTTPCACHE_DIR = 'httpcache'
``` 

Здесь `HTTPCACHE_STORAGE` указывает класс для хранения кэшированных страниц, `HTTPCACHE_ENABLED` указывает, включено ли кэширование, а `HTTPCACHE_DIR` указывает директорию, в которой будут храниться кэшированные страницы.

## как написать для scrapy расширение для кэширования html в базу MySQL

Для написания расширения для Scrapy, которое будет кэшировать HTML-код в базе данных MySQL, вам нужно создать класс для этого расширения и зарегистрировать его в настройках Scrapy. 

Вот пример кода для создания расширения, которое будет сохранять HTML-код в базе данных MySQL:

```python
import mysql.connector
from scrapy import signals
from scrapy.exceptions import NotConfigured

class MySQLCacheStorage:

    def __init__(self, db_settings):
        self.db_settings = db_settings
        self.connection = None
        self.cursor = None
        self.create_table()

    @classmethod
    def from_crawler(cls, crawler):
        db_settings = crawler.settings.getdict('MYSQL_CACHE_SETTINGS')
        if not db_settings:
            raise NotConfigured('MYSQL_CACHE_SETTINGS is not set')

        ext = cls(db_settings)
        crawler.signals.connect(ext.spider_closed, signal=signals.spider_closed)
        return ext

    def create_table(self):
        self.connect()
        self.cursor.execute('CREATE TABLE IF NOT EXISTS cache (url varchar(255), html text)')

    def connect(self):
        self.connection = mysql.connector.connect(
            host=self.db_settings['host'],
            user=self.db_settings['user'],
            password=self.db_settings['password'],
            database=self.db_settings['database']
        )
        self.cursor = self.connection.cursor()

    def disconnect(self):
        self.connection.close()

    def spider_closed(self, spider):
        self.disconnect()

    def process_request(self, request, spider):
        self.connect()
        self.cursor.execute('SELECT html FROM cache WHERE url = %s', (request.url,))
        row = self.cursor.fetchone()
        if row is not None:
            html = row[0].decode('utf-8')
            return scrapy.http.HtmlResponse(request.url, body=html.encode('utf-8'))

    def process_response(self, request, response, spider):
        self.connect()
        self.cursor.execute('INSERT INTO cache (url, html) VALUES (%s, %s) ON DUPLICATE KEY UPDATE html = %s',
                            (request.url, response.body, response.body))
        self.connection.commit()
        return response
```

В этом коде определен класс `MySQLCacheStorage`, который реализует методы `process_request` и `process_response`, используемые Scrapy для обработки запросов и ответов. Метод `process_request` проверяет, есть ли HTML-код для данного URL в базе данных. Если HTML-код найден, он возвращает объект `scrapy.http.HtmlResponse`, содержащий сохраненный HTML-код. Метод `process_response` сохраняет HTML-код в базе данных после загрузки страницы.

Класс `MySQLCacheStorage` также имеет методы для подключения к базе данных и создания таблицы `cache`. Метод `from_crawler` используется для создания экземпляра класса из настроек Scrapy.

Чтобы использовать это расширение, вы должны добавить следующие строки в файл `settings.py` вашего проекта:

```python
MYSQL_CACHE_SETTINGS = {
    'host': 'localhost',
    'user': 'user',
    'password': 'password',
    'database': 'mydatabase',
}

EXTENSIONS = {
    'myproject.extensions.MySQLCacheStorage': 500,
}
```

Здесь `MYSQL_CACHE_SETTINGS` содержит настройки для подключения к базе данных MySQL, а `EXTENSIONS` содержит путь к классу `MySQLCacheStorage` и его приоритет. 

Обратите внимание, что для использования расширения для кэширования HTML-кода в базе данных MySQL вам нужно установить драйвер для Python, который позволяет подключаться к базе данных MySQL. Вы можете установить его с помощью команды `pip install mysql-connector-python`.