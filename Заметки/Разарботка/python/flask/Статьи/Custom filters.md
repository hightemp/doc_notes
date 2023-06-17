::: v-pre
https://uniwebsidad.com/libros/explore-flask/chapter-8/custom-filters

{% raw %}

Jinja filters are functions that can be applied to the result of an expression in the `{{ ... }}` delimeters. It is applied before that result is printed to the template.

```
<h2>{{ article.title|title }}</h2>
```

In this code, the `title` filter will take `article.title` and return a title-cased version, which will then be printed to the template. This looks and works a lot like the UNIX practice of "piping" the output of one program to another.

**Note**There are loads of built-in filters like `title`. See [the full list](http://jinja.pocoo.org/docs/templates/#builtin-filters) in the Jinja docs.

We can define our own filters for use in our Jinja templates. As an example, we'll implement a simple `caps` filter to capitalize all of the letters in a string.

**Note**Jinja already has an `upper` filter that does this, and a `capitalize` filter that capitalizes the first character and lowercases the rest. These also handle unicode conversion, but we'll keep our example simple to focus on the concept at hand.

We're going to define our filter in a module located at _myapp/util/filters.py_. This gives us a `util` package in which to put other miscellaneous modules.

```
# myapp/util/filters.py

from .. import app

@app.template_filter()
def caps(text):
    """Convert a string to all caps."""
    return text.uppercase()
```

In this code we are registering our function as a Jinja filter by using the `@app.template_filter()` decorator. The default filter name is just the name of the function, but you can pass an argument to the decorator to change that.

```
@app.template_filter('make_caps')
def caps(text):
    """Convert a string to all caps."""
    return text.uppercase()
```
Now we can call `make_caps` in the template rather than `caps`: `{{ "hello world!"|make_caps }}`.

To make our filter available in the templates, we just need to import it in our top-level _**init.py**_.

```
# myapp/__init__.py

# Make sure app has been initialized first to prevent circular imports.
from .util import filters
```

{% endraw %}
:::
