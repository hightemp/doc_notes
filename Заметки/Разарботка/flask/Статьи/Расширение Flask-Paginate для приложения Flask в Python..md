## Простая пагинация страниц в приложении Flask.

{% raw %}

Проблему разбивки выводимых записей на несколько страниц хорошо решает расширение Flask [`Flask-SQLAlchemy`](https://docs-python.ru/packages/veb-frejmvork-flask-python/flask-sqlalchemy/ "Расширение Flask-SQLAlchemy для приложения Flask в Python."). Это расширение поставляется с очень хорошим классом `flask_sqlalchemy.Pagination()`.

Но как быть разработчикам, которые не хотят замедлять работу приложения, увеличивать потребление оперативной памяти сервера и повышать нагрузку на базу данных внедрением дополнительных абстракций, таких как ORM SQLAlchemy? Как быть с пагинацией разработчикам, которые используют в своих проектах "_ванильный_" SQL. Ответ прост, необходимо разработать свой класс пагинации или воспользоваться расширением `flask-paginate`, которое не имеет зависимостей от ORM.

[Модуль `flask-paginate`](https://docs-python.ru/packages/veb-frejmvork-flask-python/flask-paginate/ "Расширение Flask-Paginate для приложения Flask в Python.") представляет собой простое расширение [фреймворка `flask`](https://docs-python.ru/packages/veb-frejmvork-flask-python/ "Веб фреймворк Flask в Python.") для разбивки выводимых записей на несколько страниц, которое поддерживает разметку пагинации нескольких популярных CSS-фреймворков.

> Разбивка на страницы (пагинация) в шаблоне [`jinja2`](https://docs-python.ru/packages/modul-jinja2-python/ "Модуль jinja2 в Python, язык шаблонов.") выводится одним тегом `{{ pagination.links }}`.

![Скриншот ссылок на страницы](https://flask-paginate.readthedocs.io/en/master/_images/paginate-links.png "Внешний вид flask-paginate ссылок на страницы")

### Поддерживаемые CSS-фреймворки:

-   `Bootstrap 5`;
-   `Bootstrap 4`;
-   `Bootstrap 3`;
-   `Bootstrap 2`;
-   `Bulma`;
-   `Foundation`;
-   `SemanticUI`;
-   `Materialize framework`;

### Установка `flask-paginate` в виртуальное окружение.

```
# создаем виртуальное окружение, если нет
$ python3 -m venv .venv --prompt VirtualEnv
# активируем виртуальное окружение 
$ source .venv/bin/activate
# обновляем `pip`
(VirtualEnv):~$ python3 -m pip install -U pip
# ставим модуль `flask-paginate`
(VirtualEnv):~$ python3 -m pip install -U flask-paginate
```

## Информация о разбивке на странице.

![Скриншот информации о разбивке на страницы](https://flask-paginate.readthedocs.io/en/master/_images/paginate-info2.png "Внешний вид информации о разбивке на страницы")

Если нужно отобразить информацию о разбивке на страницы (например "_всего 100 записей, отображаются с 20 по 30_") необходимо разместить [`jinja2`](https://docs-python.ru/packages/modul-jinja2-python/ "Модуль jinja2 в Python, язык шаблонов.") тег `{{ pagination.info }}` в шаблоне страницы в требуемом месте и добавить следующие строки CSS-разметки в файл проекта:

```
.pagination-page-info {
    padding: .6em;
    padding-left: 0;
    width: 40em;
    margin: .5em;
    margin-left: 0;
    font-size: 12px;
}
.pagination-page-info b {
    color: black;
    background: #6aa6ed;
    padding-left: 2px;
    padding: .1em .25em;
    font-size: 150%;
}
```

## Как использовать?

Пример будет а чистом SQL (чтобы было понятнее, что происходит) с использованием драйвера БД MySQLdb. Думаем, что перевести SQL-запросы в ORM [`Flask-SQLAlchemy`](https://docs-python.ru/packages/veb-frejmvork-flask-python/flask-sqlalchemy/ "Расширение Flask-SQLAlchemy для приложения Flask в Python.") не составит труда.

И так, в файле представлений Flask (например, `user_search.py`):

```
from flask import Blueprint
from flask_paginate import Pagination, get_page_parameter
from MySQLdb import connect, Error
from contextlib import closing

mod = Blueprint('users', __name__)

@mod.route('/search/', methods=['GET'])
def search():
    # словарь для передачи в шаблон
    content = {}
    # если в URL присутствует параметр запроса 'q'
    q = request.args.get('q')
    if q:
        # открываем соединение с БД 
        db = connect(**MYSQLCONF)
        # определяем текущую страницу пагинации
        page = request.args.get(get_page_parameter(), type=int, default=1)
        # количество записей на странице 
        limit = 20
        # определяем `offset` записей для основного запроса 
        offset = 0 if page == 1 else (page-1) * limit
        # общее кол-во строк для пагинации
        total = 0
        with closing(db.cursor()) as cursor:
            cursor.execute("SELECT id FROM user WHERE nickname RLIKE %s", (q,))
            total = cursor.rowcount
        # создаем информацию о пагинации
        content['pagination'] = Pagination(page=page, total=total, search=True, 
                                           per_page=limit, bs_version=4)
        # `page` это номер текущей страницы, параметр URL (по умолчанию 'page') из которого
        #  он будет извлекаться. Его можно настроить, например Pagination(page_parameter='p', ...)
        # или установить `PAGE_PARAMETER` в файле конфигурации.
        # Также можно настроить параметр URL, который будет передавать количество выводимых  
        # записей на одной странице, например Pagination(per_page_parameter='pp') или установить 
        # параметр `PER_PAGE` в файле конфигурации

        if total: 
            # собственно сам поисковый запрос
            with closing(db.cursor()) as cursor:
                try:
                    cursor.execute("SELECT id, nickname, name, last_name FROM user "
                                   "WHERE nickname RLIKE %s LIMIT %s, %s", (q, offset, limit,))
                except Error as e:
                    # print(f'{e.args[0]} ==> {e.args[1]}')
                    abort(404)

                # данные для отображения найденных пользователей
                content['user_search'] = []
                for row in cursor.fetchall():
                    content['user_search'].append((row[0], row[1], row[2], row[3]))
        else:
            abort(404)

    if db:
        # закрываем соединение с БД
        db.close()
    # возвращаем результат для шаблона 'user_search.html'
    return render_template('user_search.html', content=content)
```

И в шаблоне `user_search.html`:

```
{# вывод информации о разбивке #}
{{ content.pagination.info }}
{# вывод самой пагинации #}
{{ content.pagination.links }}

{# Здесь выводится информация #}
{# о найденных записях пользователей #}

{# вывод самой пагинации #}
{{ content.pagination.links }}
```

> Примечание. Модуль `flask-paginate` очень хорошо работает с ЧПУ URL. Например:
> 
```
@app.route('/<section>/', methods=['GET'])
@app.route('/<section>/<int:cur_page>/', methods=['GET'])
def home(section, cur_page=1):
    ...
    limit = DISPLAY_ROWS
    offset = 0 if cur_page == 1 else (cur_page-1)*limit
    Pagination(page_parameter='cur_page', cur_page=cur_page, total=total, per_page=limit)
    ...

Этот код будет обслуживать URL:
 
-   первая страница - http://somesite.ru/section/ (можно назначить как `canonical`)
-   вторая страница - http://somesite.ru/section/2/
-  и т.д.
```

## Принимаемые аргументы конструктором `Pagination()`.

-   `page_parameter`: имя ([строка](https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-str-tekstovye-stroki/ "Текстовые строки str в Python.")) параметра URL в GET запросе (например `/?page=2&q=vasya` ), для извлечения из запроса индекса текущей страницы (по умолчанию `'page'`);
-   `page`: номер текущей страницы. Имя этого аргумента зависит от `page_parameter`. Если задан `page_parameter='p'`, то имя этого аргумента становиться `p`;

```
# по умолчанию
Pagination(page=page, total=total, per_page=15)
# переопределим `page_parameter`, в этом случае имя 
# аргумента `page` трансформируется в имя `p`
Pagination(page_parameter='p', p=page, total=total, per_page=15)
```

-   `per_page_parameter`: имя ([строка](https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-str-tekstovye-stroki/ "Текстовые строки str в Python.")) параметра URL в GET запросе (например `/?per_page=15&page=2&q=vasya` ), для извлечения из запроса количества отображаемых записей на одной странице (по умолчанию `'per_page'`);
    
-   `per_page`: сколько записей нужно отображать на одной странице. Имя этого аргумента зависит от `per_page_parameter`. Если задан `per_page_parameter='pp'`, то имя этого аргумента становиться `pp`;
    
```
# по умолчанию
    Pagination(page=page, total=total, per_page=15)
    # переопределим `per_page_parameter`, в этом случае имя 
    # аргумента `per_page` трансформируется в имя `pp`
    Pagination(p=page, total=total, per_page_parameter='pp', pp=15)
```
    
-   `inner_window`: количество отображаемых ссылок пагинации вокруг текущей страницы;
    
-   `outer_window`: количество отображаемых ссылок пагинации рядом с первой и последней страницей;
    
-   `prev_label`: текст для предыдущей страницы, по умолчанию `'&laquo;'`
    
-   `next_label`: текст для следующей страницы, по умолчанию `'&raquo;'`
    
-   `total`: общее количество записей для разбивки на страницы;
    
-   `css_framework`: используемый CSS-фреймворк, по умолчанию `'bootstrap'`, принимаемые строки: `'bootstrap'`, `'semantic'`, `'foundation'`, `'bulma'`, `'materialize'`;
    
-   `bs_version`: версия CSS-фреймворка `bootstrap`, по умолчанию 2;
    
-   `display_msg`: настройка строки информации о разбивке на страницы, по умолчанию `"displaying <b>{start} - {end}</b> {record_name} in total <b>{total}</b>"` ;
    
-   `search`: если `True`, то показывает строку с сообщением аргумента `search_msg`, иначе будет выведено сообщение аргумента `display_msg`;
    
-   `found`: количество найденных записей при поиске `{found}` в строке аргумента `search_msg` (по умолчанию равно аргументу `total`);
    
-   `record_name`: текст {record_name}, отображаемый в строке аргумента `search_msg` и `display_msg`;
    
-   `search_msg`: настройка строки при поиске, по умолчанию `"found <b>{found}</b> {record_name}, displaying <b>{start} - {end}</b>"`;
    
-   `link_size`: размер шрифта ссылок пагинации на страницы;
    
-   `alignment`: выравнивание ссылок по страницам;
    
-   `href`: добавляет пользовательский `href` для ссылок пагинации - поддерживает формы с методом `POST`. Строка URL должна содержать `{0}` (см. [`str.format()`](https://docs-python.ru/tutorial/operatsii-tekstovymi-strokami-str-python/metod-str-format/ "Метод str.format() в Python, форматирует строку.")) для форматирования номера страницы;
    
-   `show_single_page`: если `True`, то будет выводить пагинацию даже для одной страницы;
    
-   `anchor`: параметр привязки, добавляется к `href` URL-страницы;
    
-   `format_total`: общий числовой формат, если `True`, то `1,234`, по умолчанию `False` (без запятой);
    
-   `format_number`: числовой формат начала и конца пагинации, если `True`, то `1,234`, по умолчанию `False` (без запятой);
    
-   `url_coding`: кодировка для кодировки URL, по умолчанию utf-8;
    
-   `bulma_style`: стиль ссылки на страницу для CSS-фреймворка `bulma`.

{% endraw %}