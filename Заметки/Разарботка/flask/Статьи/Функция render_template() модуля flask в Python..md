https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/

{% raw %}

## Отображает шаблон с заданным контекстом.

#### Синтаксис:

from flask import render_template

render_template(template_name_or_list, **context)
render_template_string(source, **context)

#### Параметры:

-   `template_name_or_list` - имя шаблона, который будет отрисован, или список имен шаблонов, из которых первый существующий будет отрисован.
-   `source` - HTML-код шаблона для рендеринга.
-   `**context` - переменные, которые должны быть доступны в контексте шаблона. Обычно используется [словарь](https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-dict-slovar/ "Словарь dict в Python.").

#### Возвращаемое значение:

-   [строка](https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-str-tekstovye-stroki/ "Текстовые строки str в Python.").

#### Описание:

Функция [`render_template()`](https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/ "Функция render_template() модуля flask в Python.") модуля [`flask`](https://docs-python.ru/packages/veb-frejmvork-flask-python/ "Веб фреймворк Flask в Python.") отображает [шаблон](https://docs-python.ru/packages/veb-frejmvork-flask-python/rabota-shablonami-prilozhenii-flask/ "Использование шаблонизатора Jinja2 в приложении Flask Python.") `template_name_or_list` из [папки шаблонов](https://docs-python.ru/packages/veb-frejmvork-flask-python/primer-struktury-prilozhenija-flask-paketa/ "Пример структуры приложения Flask как пакета Python.") с заданным контекстом `context`. Переменные шаблона будут автоматически экранированы.

Обычно в качестве контекста `context` используется словарь, который создается в начале [функции-представления](https://docs-python.ru/packages/veb-frejmvork-flask-python/predstavlenija-veb-prilozhenii-flask/ "Представления в веб-приложении на Flask Python.") и дополняется по ходу обработки поступившего запроса.

Смотрим пример:

```
@app.route(/salary/all/)
def user_salary()
        # создаем словарь с переменными 
        # контекста и их значениями
        context = {}
        context['title'] = 'Все сотрудники (оклад):'
        # переменная контекста `users` - это список
        # словарей с данными по каждому сотруднику
        context['users'] = []
        # здесь например вытаскиваются данные сотрудников из базы 
        # и происходит какая- то дополнительная обработка
        # ...
        # в процессе список контекста 'users' пополняется данными
        context['users'].append({'name': 'Маша', 'status': 'Менеджер', 'salary': 1500}) 
        context['users'].append({'name': 'Света', 'status': 'Дизайнер', 'salary': 1000}) 
        context['users'].append({'name': 'Игорь', 'status': 'Программист', 'salary': 2000}) 
        # передаем словарь `context` в `render_template()`
        return render_template('user_salary.html', context=context)
```
В связанном шаблоне с функцией-представления переданный контекст будет обрабатываться следующим образом:

```
{# шаблон `templates/user_salary.html`#}
{# наследуемся от базового шаблона #}
{% extends "base.html" %}
{# переопределяем блок `title` базового шаблона #}
{% block title %}{{ context.title }}{% endblock %}
{# переопределяем блок `content` базового шаблона #}
{% block content %}
<ol>
{# в цикле проходимся по контексту `context.users` #}
{% for user in context.users %}
<li>{{ user.name }} - должность: {{ user.status }}, оклад: ${{ user.salary }}</li>
{% endfor %}
</ol>
{% endblock %}
```

---

Функция [`render_template_string()`](https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/ "Функция render_template() модуля flask в Python.") отображает шаблон из заданной исходной строки `source` с заданным контекстом `context`. Переменные шаблона будут автоматически экранированы.

Пример:

```
# mini-flask.py
from flask import Flask, render_template_string
app = Flask(__name__)

@app.route('/')
def index():
    title = "Главная страница"
    source = """<html><body>
        <h1>{{h1}}</h1>
        <h3><a href="{{url_for('hello')}}">Страница с приветом...</a></h3>
        </body></html>"""
    return render_template_string(source, h1=title)

@app.route('/hello/')
@app.route('/hello/<name>/')
def hello(name=None):
    if name is None:
        name = 'Flask'
    source = """<html><body>
        <h1>Привет {{name}}!</h1>
        <h3><a href="{{url_for('index')}}">Главная страница...</a></h3>
        </body></html>"""
    return render_template_string(source, name=name)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
```

{% endraw %}