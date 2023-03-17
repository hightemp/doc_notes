https://django.fun/ru/articles/tutorials/usovershenstvovannoe-otobrazhenie-form-bootstrap-4-s-pomoshyu-django-crispy-forms/

{% raw %}

Версии ПО, используемые в данной статье: Django 2.1.3, Python 3.6.5, Bootstrap 4.1.3.

В этом уроке мы собираемся изучить некоторые функции [Django Crispy Forms](https://django.fun/docs/crispy-forms/ru/stable/) для обработки расширенных/пользовательских форм с использованием Bootstrap 4.

## Введение

#### В этом уроке мы собираемся реализовать следующую форму Bootstrap 4 с использованием API Django:

![](https://django.fun/media/2019/09/20/form.png)

Взято из официальной документации Bootstrap 4 как пример использования строчные формы.

**Примечание!**

Приведенные ниже примеры относятся к шаблону `base.html`. Рассмотрим код ниже:

**base.html**

```django
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    {% block content %}
    {% endblock %}
  </div>
</body>
</html>
```

## Установка

Для установки используем pip:

```undefined
pip install django-crispy-forms
```

Добавьте приложение в `INSTALLED_APPS` и укажите, какой стиль использовать:

**settings.py**

```bash
INSTALLED_APPS = [
    ...

    'crispy_forms',
]

CRISPY_TEMPLATE_PACK = 'bootstrap4'
```

Детальные инструкции по установке `django-crispy-forms` смотрите в статье [Django и формы Bootstrap 4](https://django.fun/tutorials/django-i-formy-bootstrap-4/).

## Рендеринг основной формы

Код Python, необходимый для представления формы выше:

```python
from django import forms

STATES = (
    ('', 'Choose...'),
    ('MG', 'Minas Gerais'),
    ('SP', 'Sao Paulo'),
    ('RJ', 'Rio de Janeiro')
)

class AddressForm(forms.Form):
    email = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput())
    address_1 = forms.CharField(
        label='Address',
        widget=forms.TextInput(attrs={'placeholder': '1234 Main St'})
    )
    address_2 = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': 'Apartment, studio, or floor'})
    )
    city = forms.CharField()
    state = forms.ChoiceField(choices=STATES)
    zip_code = forms.CharField(label='Zip')
    check_me_out = forms.BooleanField(required=False)
```

В этом случае я использую обычную форму, но это также может быть `ModelForm`, основанная на модели Django с похожими полями. Поле состояния и выбор `STATES` могут быть внешним ключом или чем-то еще. Здесь я просто использую простой статический пример с тремя бразильскими штатами.

**Шаблон:**

```django
{% extends 'base.html' %}

{% block content %}
  <form method="post">
    {% csrf_token %}
    <table>{{ form.as_table }}</table>
    <button type="submit">Sign in</button>
  </form>
{% endblock %}
```

Готовый HTML:

![](https://django.fun/media/2019/09/20/form1.png)

Визуализированный HTML с состоянием проверки:

![](https://django.fun/media/2019/09/20/form1-error.png)

## Основной рендеринг Crispy Form

Тот же код формы, что и в предыдущем примере.

**Шаблон:**

```django
{% extends 'base.html' %}

{% load crispy_forms_tags %}

{% block content %}
  <form method="post">
    {% csrf_token %}
    {{ form|crispy }}
    <button type="submit" class="btn btn-primary">Sign in</button>
  </form>
{% endblock %}
```

Готовый HTML:

![](https://django.fun/media/2019/09/20/form2.png)

Визуализированный HTML с состоянием проверки:

![](https://django.fun/media/2019/09/20/form2-error.png)

## Размещение пользовательских полей с Crispy Forms

Тот же код формы, что и в первом примере.

**Шаблон:**

```django
{% extends 'base.html' %}

{% load crispy_forms_tags %}

{% block content %}
  <form method="post">
    {% csrf_token %}
    <div class="form-row">
      <div class="form-group col-md-6 mb-0">
        {{ form.email|as_crispy_field }}
      </div>
      <div class="form-group col-md-6 mb-0">
        {{ form.password|as_crispy_field }}
      </div>
    </div>
    {{ form.address_1|as_crispy_field }}
    {{ form.address_2|as_crispy_field }}
    <div class="form-row">
      <div class="form-group col-md-6 mb-0">
        {{ form.city|as_crispy_field }}
      </div>
      <div class="form-group col-md-4 mb-0">
        {{ form.state|as_crispy_field }}
      </div>
      <div class="form-group col-md-2 mb-0">
        {{ form.zip_code|as_crispy_field }}
      </div>
    </div>
    {{ form.check_me_out|as_crispy_field }}
    <button type="submit" class="btn btn-primary">Sign in</button>
  </form>
{% endblock %}
```

Готовый HTML:

![](https://django.fun/media/2019/09/20/form3.png)

Визуализированный HTML с состоянием проверки:

![](https://django.fun/media/2019/09/20/form3-error.png)

## Расширение Crispy Forms

Мы могли бы использовать хелперы Crispy Forms для достижения того же результата, что и выше. Реализация выполняется внутри метода формы `__init__`:

**forms.py**

```python
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column

STATES = (
    ('', 'Choose...'),
    ('MG', 'Minas Gerais'),
    ('SP', 'Sao Paulo'),
    ('RJ', 'Rio de Janeiro')
)

class AddressForm(forms.Form):
    email = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput())
    address_1 = forms.CharField(
        label='Address',
        widget=forms.TextInput(attrs={'placeholder': '1234 Main St'})
    )
    address_2 = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': 'Apartment, studio, or floor'})
    )
    city = forms.CharField()
    state = forms.ChoiceField(choices=STATES)
    zip_code = forms.CharField(label='Zip')
    check_me_out = forms.BooleanField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('email', css_class='form-group col-md-6 mb-0'),
                Column('password', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'address_1',
            'address_2',
            Row(
                Column('city', css_class='form-group col-md-6 mb-0'),
                Column('state', css_class='form-group col-md-4 mb-0'),
                Column('zip_code', css_class='form-group col-md-2 mb-0'),
                css_class='form-row'
            ),
            'check_me_out',
            Submit('submit', 'Sign in')
        )
```

Реализация шаблона очень минимальна:

```django
{% extends 'base.html' %}

{% load crispy_forms_tags %}

{% block content %}
  {% crispy form %}
{% endblock %}
```

Конечный результат такой же.

Готовый HTML:

![](https://django.fun/media/2019/09/20/form3-1.png)

Визуализированный HTML с состоянием проверки:

![](https://django.fun/media/2019/09/20/form3-error-1.png)

## Пользовательские поля Crispy Field

Вы также можете настроить шаблон поля и легко использовать его в своем приложении. Допустим, мы хотим использовать пользовательский флажок Bootstrap 4:

![](https://django.fun/media/2019/09/20/bs_custom_checkbox.png)

Из официальной документации необходим HTML для вывода:

```django
<div class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input" id="customCheck1">
  <label class="custom-control-label" for="customCheck1">Check this custom checkbox</label>
</div>
```

Используя API Crispy Forms, мы можем создать новый шаблон для этого настраиваемого поля в нашей папке «templates»:

**custom_checkbox.html**

```django
{% load crispy_forms_field %}

<div class="form-group">
  <div class="custom-control custom-checkbox">
    {% crispy_field field 'class' 'custom-control-input' %}
    <label class="custom-control-label" for="{{ field.id_for_label }}">{{ field.label }}</label>
  </div>
</div>
```

Теперь мы можем создать новое поле Crispy Forms, либо в нашем модуле `forms.py`, либо в новом модуле Python с именем `fields.py` или чем-то еще.

**forms.py**

```python
from crispy_forms.layout import Field

class CustomCheckbox(Field):
    template = 'custom_checkbox.html'
```

Теперь мы можем использовать его в нашем классе формы:

**forms.py**

```sql
class CustomFieldForm(AddressForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('email', css_class='form-group col-md-6 mb-0'),
                Column('password', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'address_1',
            'address_2',
            Row(
                Column('city', css_class='form-group col-md-6 mb-0'),
                Column('state', css_class='form-group col-md-4 mb-0'),
                Column('zip_code', css_class='form-group col-md-2 mb-0'),
                css_class='form-row'
            ),
            CustomCheckbox('check_me_out'),  # <-- Here
            Submit('submit', 'Sign in')
        )
```

Конечный результат:

![](https://django.fun/media/2019/09/20/form5.png)

## Итоги

Как видите,  можно не только использовать базовые возможности Django Crispy Forms для отображения формы Bootstrap 4, но и настроить собсвтенный рендеринг отдельных полей формы.

_Перевод статьи https://simpleisbetterthancomplex.com/tutorial/2018/11/28/advanced-form-rendering-with-django-crispy-forms.html_

{% endraw %}