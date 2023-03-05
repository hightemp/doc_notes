## напиши код универсального scrapping инструмента, который переходил бы страницами и скачивал html в отдельную папку и мог распознавать pagination

Для написания универсального скрапинг инструмента, который может переходить по страницам и скачивать HTML в отдельную папку, а также распознавать пагинацию, можно использовать многие библиотеки, такие как Beautiful Soup, Requests, и Selenium.

Вот пример кода на Python, использующего Requests и Beautiful Soup для скрапинга и скачивания HTML:

``` python
import os
import requests
from bs4 import BeautifulSoup

def scrape(url, folder_name):
    if not os.path.isdir(folder_name):
        os.mkdir(folder_name)

    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    with open(os.path.join(folder_name, 'page_1.html'), 'w') as f:
        f.write(str(soup))

    pagination = soup.find('div', {'class': 'pagination'})
    if pagination is None:
        return

    page_num = 2
    while True:
        next_page = pagination.find('a', {'class': 'next'})
        if next_page is None:
            break

        url = next_page['href']
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        with open(os.path.join(folder_name, f'page_{page_num}.html'), 'w') as f:
            f.write(str(soup))

        pagination = soup.find('div', {'class': 'pagination'})
        if pagination is None:
            break

        page_num += 1
```

Этот код создаст папку с заданным именем и загрузит HTML страницу с указанного URL-адреса в файл `page_1.html`. Затем он найдет элемент пагинации и, если он присутствует, продолжит загрузку страниц до тех пор, пока не будет найден последний элемент пагинации. Каждая загруженная страница будет сохранена в отдельный файл в папке с заданным именем, используя нумерацию страниц.

## реши туже задачу только с помощью selenium, учти что на странице есть javascript, на сайте много статей и их надо сохранить в каждую отдельный html файл

Конечно! Вот пример кода на Python, который использует Selenium:

``` python
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    if not os.path.exists('pages'):
        os.makedirs('pages')

    page_num = 1
    while True:
        articles = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//div[@class="articles"]/article')))
        for i, article in enumerate(articles):
            with open(f'pages/page_{page_num}_{i+1}.html', 'w') as f:
                f.write(driver.page_source)

        next_button = driver.find_element(By.XPATH, '//a[@rel="next"]')
        if not next_button.is_enabled():
            break

        next_button.click()
        page_num += 1

    driver.quit()
```

Этот код использует Selenium для запуска браузера Chrome в безголовом режиме и открытия страницы по указанному URL-адресу. Затем он создает папку `pages` для сохранения HTML-файлов каждой статьи.

Далее код находит все статьи на странице и сохраняет их содержимое в отдельные файлы в папке `pages`. Код затем находит кнопку "Следующая страница" и продолжает скроллинг через страницы до тех пор, пока кнопка не будет отключена.

Надеюсь, это поможет вам решить задачу!

## реши туже задачу только с помощью scrappy

Конечно, вот пример кода, который решает эту задачу с помощью фреймворка Scrapy:

```python
import scrapy
import os

class ArticleSpider(scrapy.Spider):
    name = "articles"
    start_urls = [
        "https://example.com/articles/",
    ]
    custom_settings = {
        'FEED_FORMAT': 'html',
        'FEED_URI': 'file:///path/to/output/directory/%(name)s/%(time)s.html',
    }

    def parse(self, response):
        articles = response.css('.article')
        for article in articles:
            title = article.css('h2::text').get()
            content = article.css('.content::text').get()
            filename = f"{title}.html"
            path = os.path.join('output', self.name, filename)
            with open(path, 'w') as f:
                f.write(content)

        next_page = response.css('a.next-page::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
```

В этом примере мы создаем `ArticleSpider`, который начинает свой поиск на странице `https://example.com/articles/`. Затем мы находим все статьи на странице с помощью CSS-селектора `.article`. Для каждой статьи мы находим заголовок и содержимое, а затем сохраняем это в отдельный файл в папке `output/articles` с именем, соответствующим заголовку статьи.

Затем мы проверяем, есть ли на странице кнопка "Следующая страница". Если есть, мы переходим на следующую страницу и продолжаем поиск, вызывая метод `self.parse` для каждой страницы, пока не пройдем все страницы.

Настройки `custom_settings` позволяют нам сохранять результаты в формате HTML в папку с именем `articles` внутри указанной директории вывода.

