(window.webpackJsonp=window.webpackJsonp||[]).push([[273],{546:function(e,t,r){"use strict";r.r(t);var n=r(14),a=Object(n.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("div",{pre:!0},[t("p",[e._v("https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/")]),e._v(" "),t("p",[e._v("{% raw %}")]),e._v(" "),t("h2",{pre:!0,attrs:{id:"отображает-шаблон-с-заданным-контекстом"}},[t("a",{pre:!0,attrs:{class:"header-anchor",href:"#отображает-шаблон-с-заданным-контекстом"}},[e._v("#")]),e._v(" Отображает шаблон с заданным контекстом.")]),e._v(" "),t("h4",{pre:!0,attrs:{id:"синтаксис"}},[t("a",{pre:!0,attrs:{class:"header-anchor",href:"#синтаксис"}},[e._v("#")]),e._v(" Синтаксис:")]),e._v(" "),t("p",[e._v("from flask import render_template")]),e._v(" "),t("p",[e._v("render_template(template_name_or_list, **context)\nrender_template_string(source, **context)")]),e._v(" "),t("h4",{pre:!0,attrs:{id:"параметры"}},[t("a",{pre:!0,attrs:{class:"header-anchor",href:"#параметры"}},[e._v("#")]),e._v(" Параметры:")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("template_name_or_list")]),e._v(" - имя шаблона, который будет отрисован, или список имен шаблонов, из которых первый существующий будет отрисован.")]),e._v(" "),t("li",[t("code",[e._v("source")]),e._v(" - HTML-код шаблона для рендеринга.")]),e._v(" "),t("li",[t("code",[e._v("**context")]),e._v(" - переменные, которые должны быть доступны в контексте шаблона. Обычно используется "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-dict-slovar/",title:"Словарь dict в Python.",target:"_blank",rel:"noopener noreferrer"}},[e._v("словарь"),t("OutboundLink",{pre:!0})],1),e._v(".")])]),e._v(" "),t("h4",{pre:!0,attrs:{id:"возвращаемое-значение"}},[t("a",{pre:!0,attrs:{class:"header-anchor",href:"#возвращаемое-значение"}},[e._v("#")]),e._v(" Возвращаемое значение:")]),e._v(" "),t("ul",[t("li",[t("a",{pre:!0,attrs:{href:"https://docs-python.ru/tutorial/osnovnye-vstroennye-tipy-python/tip-dannyh-str-tekstovye-stroki/",title:"Текстовые строки str в Python.",target:"_blank",rel:"noopener noreferrer"}},[e._v("строка"),t("OutboundLink",{pre:!0})],1),e._v(".")])]),e._v(" "),t("h4",{pre:!0,attrs:{id:"описание"}},[t("a",{pre:!0,attrs:{class:"header-anchor",href:"#описание"}},[e._v("#")]),e._v(" Описание:")]),e._v(" "),t("p",[e._v("Функция "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/",title:"Функция render_template() модуля flask в Python.",target:"_blank",rel:"noopener noreferrer"}},[t("code",[e._v("render_template()")]),t("OutboundLink",{pre:!0})],1),e._v(" модуля "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/",title:"Веб фреймворк Flask в Python.",target:"_blank",rel:"noopener noreferrer"}},[t("code",[e._v("flask")]),t("OutboundLink",{pre:!0})],1),e._v(" отображает "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/rabota-shablonami-prilozhenii-flask/",title:"Использование шаблонизатора Jinja2 в приложении Flask Python.",target:"_blank",rel:"noopener noreferrer"}},[e._v("шаблон"),t("OutboundLink",{pre:!0})],1),e._v(" "),t("code",[e._v("template_name_or_list")]),e._v(" из "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/primer-struktury-prilozhenija-flask-paketa/",title:"Пример структуры приложения Flask как пакета Python.",target:"_blank",rel:"noopener noreferrer"}},[e._v("папки шаблонов"),t("OutboundLink",{pre:!0})],1),e._v(" с заданным контекстом "),t("code",[e._v("context")]),e._v(". Переменные шаблона будут автоматически экранированы.")]),e._v(" "),t("p",[e._v("Обычно в качестве контекста "),t("code",[e._v("context")]),e._v(" используется словарь, который создается в начале "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/predstavlenija-veb-prilozhenii-flask/",title:"Представления в веб-приложении на Flask Python.",target:"_blank",rel:"noopener noreferrer"}},[e._v("функции-представления"),t("OutboundLink",{pre:!0})],1),e._v(" и дополняется по ходу обработки поступившего запроса.")]),e._v(" "),t("p",[e._v("Смотрим пример:")]),e._v(" "),t("div",{pre:!0,attrs:{class:"language- extra-class"}},[t("pre",{pre:!0,attrs:{"v-pre":"",class:"language-text"}},[t("code",[e._v("@app.route(/salary/all/)\ndef user_salary()\n        # создаем словарь с переменными \n        # контекста и их значениями\n        context = {}\n        context['title'] = 'Все сотрудники (оклад):'\n        # переменная контекста `users` - это список\n        # словарей с данными по каждому сотруднику\n        context['users'] = []\n        # здесь например вытаскиваются данные сотрудников из базы \n        # и происходит какая- то дополнительная обработка\n        # ...\n        # в процессе список контекста 'users' пополняется данными\n        context['users'].append({'name': 'Маша', 'status': 'Менеджер', 'salary': 1500}) \n        context['users'].append({'name': 'Света', 'status': 'Дизайнер', 'salary': 1000}) \n        context['users'].append({'name': 'Игорь', 'status': 'Программист', 'salary': 2000}) \n        # передаем словарь `context` в `render_template()`\n        return render_template('user_salary.html', context=context)\n")])])]),t("p",[e._v("В связанном шаблоне с функцией-представления переданный контекст будет обрабатываться следующим образом:")]),e._v(" "),t("div",{pre:!0,attrs:{class:"language- extra-class"}},[t("pre",{pre:!0,attrs:{"v-pre":"",class:"language-text"}},[t("code",[e._v('{# шаблон `templates/user_salary.html`#}\n{# наследуемся от базового шаблона #}\n{% extends "base.html" %}\n{# переопределяем блок `title` базового шаблона #}\n{% block title %}{{ context.title }}{% endblock %}\n{# переопределяем блок `content` базового шаблона #}\n{% block content %}\n<ol>\n{# в цикле проходимся по контексту `context.users` #}\n{% for user in context.users %}\n<li>{{ user.name }} - должность: {{ user.status }}, оклад: ${{ user.salary }}</li>\n{% endfor %}\n</ol>\n{% endblock %}\n')])])]),t("hr"),e._v(" "),t("p",[e._v("Функция "),t("a",{pre:!0,attrs:{href:"https://docs-python.ru/packages/veb-frejmvork-flask-python/funktsija-render-template/",title:"Функция render_template() модуля flask в Python.",target:"_blank",rel:"noopener noreferrer"}},[t("code",[e._v("render_template_string()")]),t("OutboundLink",{pre:!0})],1),e._v(" отображает шаблон из заданной исходной строки "),t("code",[e._v("source")]),e._v(" с заданным контекстом "),t("code",[e._v("context")]),e._v(". Переменные шаблона будут автоматически экранированы.")]),e._v(" "),t("p",[e._v("Пример:")]),e._v(" "),t("div",{pre:!0,attrs:{class:"language- extra-class"}},[t("pre",{pre:!0,attrs:{"v-pre":"",class:"language-text"}},[t("code",[e._v('# mini-flask.py\nfrom flask import Flask, render_template_string\napp = Flask(__name__)\n\n@app.route(\'/\')\ndef index():\n    title = "Главная страница"\n    source = """<html><body>\n        <h1>{{h1}}</h1>\n        <h3><a href="{{url_for(\'hello\')}}">Страница с приветом...</a></h3>\n        </body></html>"""\n    return render_template_string(source, h1=title)\n\n@app.route(\'/hello/\')\n@app.route(\'/hello/<name>/\')\ndef hello(name=None):\n    if name is None:\n        name = \'Flask\'\n    source = """<html><body>\n        <h1>Привет {{name}}!</h1>\n        <h3><a href="{{url_for(\'index\')}}">Главная страница...</a></h3>\n        </body></html>"""\n    return render_template_string(source, name=name)\n\nif __name__ == \'__main__\':\n    app.run(host=\'localhost\', port=5000, debug=True)\n')])])]),t("p",[e._v("{% endraw %}")])])])}),[],!1,null,null,null);t.default=a.exports}}]);