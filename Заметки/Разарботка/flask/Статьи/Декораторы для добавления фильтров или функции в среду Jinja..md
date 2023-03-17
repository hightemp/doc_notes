https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.contextfilter

{% raw %}

Приведенные в материале [вспомогательные функции и классы модуля `jinja2`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/ "Вспомогательные декораторы и функции модуля jinja2 в Python.") полезны, если добавляются свои собственные фильтры или функции в среду модуля [`jinja2`](https://docs-python.ru/packages/modul-jinja2-python/ "Модуль jinja2 в Python, язык шаблонов.").

### Содержание:

-   `jinja2.pass_context()` [передает `Context` в качестве первого аргумента декорированной функции](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_context),
-   `jinja2.pass_environment()` [передает `Environment` в качестве первого аргумента декорированной функции](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_environment),
-   `jinja2.environmentfilter()` [маркирует фильтры, зависящие от `Environment`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.environmentfilter),
-   `jinja2.environmentfunction()` [маркирует функцию или метод как вызываемые из `Environment`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.environmentfunction),
-   `jinja2.contextfilter()` [маркирует фильтры, зависящие от `Context`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.contextfilter),
-   `jinja2.contextfunction()` [маркирует функцию или метод как вызываемые из `Context`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.contextfunction),
-   `jinja2.escape()` [преобразует `&`, `<`, `>`, `'` и `"` в HTML-сущности](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.escape),
-   `jinja2.clear_caches()` [очищает кэши среды окружения и лексеров](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.clear_caches),
-   `jinja2.is_undefined()` [проверяет, не определен ли переменная контекста](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.is_undefined).

---

#### _`jinja2.pass_context(f)`_:

Декоратор `jinja2.pass_context()` передает [контекст `Context`](https://docs-python.ru/packages/modul-jinja2-python/klass-context/ "Класс Context() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции при вызове во время рендеринга шаблона.

Может использоваться в функциях, фильтрах и тестах.

Если нужен только `Context.eval_ctx`, используйте `jinja2.pass_eval_context()`. Если требуется только `Context.environment`, используйте `jinja2.pass_environment()`.

Новое в версии 3.0: заменяет контекстную функцию [`jinja2.contextfunction`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.contextfunction) и контекстный фильтр [`jinja2.contextfilter`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.contextfilter).

#### _`jinja2.pass_environment(f)`_:

Декоратор `jinja2.pass_environment()` передает [`Environment`](https://docs-python.ru/packages/modul-jinja2-python/klass-environment/ "Класс Environment() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции при вызове во время рендеринга шаблона.

Может использоваться в функциях, фильтрах и тестах.

Новое в версии 3.0: заменяет функцию [`jinja2.environmentfunction()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.environmentfunction) и фильтр [`jinja2.environmentfilter()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.environmentfilter).

#### _`jinja2.environmentfilter(f)`_:

Декоратор `jinja2.environmentfilter()` передает [среду `Environment`](https://docs-python.ru/packages/modul-jinja2-python/klass-environment/ "Класс Environment() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции.

Устарело с версии 3.0: будет удалено в Jinja 3.1. Вместо этого используйте [`jinja2.pass_environment()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_environment).

#### _`jinja2.environmentfunction(f)`_:

Декоратор `jinja2.environmentfunction()` передает [среду `Environment`](https://docs-python.ru/packages/modul-jinja2-python/klass-environment/ "Класс Environment() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции.

Устарело с версии 3.0: будет удалено в Jinja 3.1. Вместо этого используйте [`jinja2.pass_environment()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_environment).

#### _`jinja2.contextfilter(f)`_:

Декоратор `jinja2.contextfilter()` передает [контекст `Context`](https://docs-python.ru/packages/modul-jinja2-python/klass-context/ "Класс Context() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции.

Устарело с версии 3.0: будет удалено в Jinja 3.1. Вместо этого используйте [`jinja2.pass_context()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_context).

#### _`jinja2.contextfunction(f)`_:

Декоратор `jinja2.contextfunction()` передает [контекст `Context`](https://docs-python.ru/packages/modul-jinja2-python/klass-context/ "Класс Context() модуля jinja2 в Python.") в качестве первого аргумента декорированной функции.

Такое поведение полезно, если функция хочет получить доступ к контексту или функциям, предоставленным в [объекте контекста](https://docs-python.ru/packages/modul-jinja2-python/klass-context/ "Класс Context() модуля jinja2 в Python."). Пример функции, которая возвращает отсортированный список переменных шаблона, экспортируемых текущим шаблоном:

@contextfunction
def get_exported_names(context):
    return sorted(context.exported_vars)

Устарело с версии 3.0: будет удалено в Jinja 3.1. Вместо этого используйте [`jinja2.pass_context()`](https://docs-python.ru/packages/modul-jinja2-python/vspomogatelnye-funktsii-klassy-modulja-jinja2/#jinja2.pass_context).

#### _`jinja2.escape(s)`_:

Функция `jinja2.escape()` преобразует символы `&`, `<`, `>`, `'` и `"` в строках `s` в безопасные для HTML последовательности. Используйте эту функцию, если необходимо отобразить текст, который может содержать такие символы в HTML.

Эта функция не будет экранировать объекты, которые имеют представление HTML, например, уже экранированные данные.

Возвращаемое значение представляет собой [объект `Markup`](https://docs-python.ru/packages/modul-jinja2-python/funktsija-markup/ "Класс Markup() модуля jinja2 в Python.").

>>> import jinja2
>>> m = jinja2.escape('&, <, >')
>>> m
# Markup('&amp;, &lt;, &gt;')
>>> str(m)
# '&amp;, &lt;, &gt;'

#### _`jinja2.clear_caches()`_:

Jinja хранит внутренние кэши для среды окружения и лексеров. Они используются для того, чтобы Jinja не приходилось их постоянно воссоздавать. Обычно, не нужно об этом заботиться, но если необходимо измерить потребление памяти, то можно очистить кэши при помощи функции `jinja2.clear_caches()`.

#### _`jinja2.is_undefined(obj)`_:

Функция `jinja2.is_undefined()` проверяет, не определен ли переданный объект. Это не что иное, как проверка экземпляра на `Undefined`, но выглядит лучше.

Функцию можно использовать для настраиваемых фильтров или тестов, которые должны реагировать на неопределенные `Undefined` переменные.

Например, настраиваемый фильтр по умолчанию может выглядеть так:

def default(var, default=''):
    if is_undefined(var):
        return default
    return var

{% endraw %}