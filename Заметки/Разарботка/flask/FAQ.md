# Redirecting to URL in Flask

You have to return a redirect:

```python
import os
from flask import Flask,redirect

app = Flask(__name__)

@app.route('/')
def hello():
    return redirect("http://www.example.com", code=302)

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

See [the documentation on flask docs.](https://flask.palletsprojects.com/api/#flask.redirect) The default value for code is 302 so `code=302` can be omitted or replaced by other redirect code (one in 301, 302, 303, 305, and 307).

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route('/')
def hello():
    return redirect(url_for('foo'))

@app.route('/foo')
def foo():
    return 'Hello Foo!'

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

Take a look at the [example in the documentation](http://flask.pocoo.org/docs/quickstart/#redirects-and-errors).

# Changing the active class of a link with the twitter bootstrap css in python/flask

Have you looked at this ? [https://jinja.palletsprojects.com/en/3.0.x/tricks/#highlighting-active-menu-items](https://jinja.palletsprojects.com/en/3.0.x/tricks/#highlighting-active-menu-items)

## Highlighting Active Menu Items

Often you want to have a navigation bar with an active navigation item. This is really simple to achieve. Because assignments outside of blocks in child templates are global and executed before the layout template is evaluated it’s possible to define the active menu item in the child template:

```python
{% extends "layout.html" %}
{% set active_page = "index" %}
```

The layout template can then access `active_page`. Additionally it makes sense to define a default for that variable:

```python
{% set navigation_bar = [
    ('/', 'index', 'Index'),
    ('/downloads/', 'downloads', 'Downloads'),
    ('/about/', 'about', 'About')
] -%}

{% set active_page = active_page|default('index') -%}
...
<ul id="navigation">
    {% for href, id, caption in navigation_bar %}
    <li{% if id == active_page %} class="active"{% endif
    %}><a href="{{ href|e }}">{{ caption|e }}</a>
    </li>
{% endfor %}
</ul>
```

Here is another simpler way if you have menus distributed all over the page. This way uses inline if statements to print out the class **active**.

```python
<ul>

<li class="{{ 'active' if active_page == 'menu1' else '' }}">
<a href="/blah1">Link 1</a>
</li>

<li class="{{ 'active' if active_page == 'menu2' else '' }}">
<a href="/blah2"> Link 2 </a>
</li>

</ul>
```

> Class active is for highlighting

You still need to set the variable on every page to mark them

```python
{% extends "master.html" %}
{% set active_page = "menu1" %}
```

or

```python
{% set active_page = "menu2" %}
```

we can make class active by using jinja if statements

```python
<ul class="nav navbar-nav">
     <li class="{% if request.endpoint=='home' %}active{%endif %}"><a href="{{  url_for('home') }}">home</a></li>
     <li class="{% if request.endpoint=='add_client' %}active{%endif %}"><a href="{{  url_for('add_client') }}">Add Report</a></li>
    </li>
  </ul>
```

# What is an 'endpoint' in Flask?

## How Flask Routing Works

The entire idea of Flask (and the underlying Werkzeug library) is to map URL paths to some logic that you will run (typically, the "view function"). Your basic view is defined like this:

```python
@app.route('/greeting/<name>')
def give_greeting(name):
    return 'Hello, {0}!'.format(name)
```

Note that the function you referred to (add_url_rule) achieves the same goal, just without using the decorator notation. Therefore, the following is the same:

```python
# No "route" decorator here. We will add routing using a different method below.
def give_greeting(name):
    return 'Hello, {0}!'.format(name)

app.add_url_rule('/greeting/<name>', 'give_greeting', give_greeting)
```

Let's say your website is located at 'www.example.org' and uses the above view. The user enters the following URL into their browser:

```python
http://www.example.org/greeting/Mark
```

The job of Flask is to take this URL, figure out what the user wants to do, and pass it on to one of your many python functions for handling. It takes the **path**:

```python
/greeting/Mark
```

...and matches it to the list of routes. In our case, we defined this path to go to the `give_greeting` function.

However, while this is the typical way that you might go about creating a view, it actually abstracts some extra info from you. Behind the scenes, Flask did not make the leap directly from URL to the view function that should handle this request. It does not simply say...

```python
URL (http://www.example.org/greeting/Mark) should be handled by View Function (the function "give_greeting")
```

Actually, it there is another step, where it maps the URL to an endpoint:

```python
URL (http://www.example.org/greeting/Mark) should be handled by Endpoint "give_greeting".
Requests to Endpoint "give_greeting" should be handled by View Function "give_greeting"
```

Basically, **the "endpoint" is an identifier that is used in determining what logical unit of your code should handle the request**. Normally, an endpoint is just the name of a view function. However, you can actually change the endpoint, as is done in the following example.

```python
@app.route('/greeting/<name>', endpoint='say_hello')
def give_greeting(name):
    return 'Hello, {0}!'.format(name)
```

Now, when Flask routes the request, the logic looks like this:

```python
URL (http://www.example.org/greeting/Mark) should be handled by Endpoint "say_hello".
Endpoint "say_hello" should be handled by View Function "give_greeting"
```

## How You Use the Endpoint

The endpoint is commonly used for the "reverse lookup". For example, in one view of your Flask application, you want to reference another view (perhaps when you are linking from one area of the site to another). Rather than hard-code the URL, you can use [`url_for()`](http://flask.pocoo.org/docs/api/#flask.url_for). Assume the following

```python
@app.route('/')
def index():
    print url_for('give_greeting', name='Mark') # This will print '/greeting/Mark'

@app.route('/greeting/<name>')
def give_greeting(name):
    return 'Hello, {0}!'.format(name)
```

This is advantageous, as now we can change the URLs of our application without needing to change the line where we reference that resource.

## Why not just always use the name of the view function?

One question that might come up is the following: "Why do we need this extra layer?" Why map a path to an endpoint, then an endpoint to a view function? Why not just skip that middle step?

The reason is because it is more powerful this way. For example, [Flask Blueprints](http://flask.pocoo.org/docs/blueprints/) allow you to split your application into various parts. I might have all of my admin-side resources in a blueprint called "admin", and all of my user-level resources in an endpoint called "user".

Blueprints allow you to separate these into namespaces. For example...

main.py:

```python
from flask import Flask, Blueprint
from admin import admin
from user import user

app = Flask(__name__)
app.register_blueprint(admin, url_prefix='admin')
app.register_blueprint(user, url_prefix='user')
```

admin.py:

```python
admin = Blueprint('admin', __name__)

@admin.route('/greeting')
def greeting():
    return 'Hello, administrative user!'
```

user.py:

```python
user = Blueprint('user', __name__)
@user.route('/greeting')
def greeting():
    return 'Hello, lowly normal user!'
```

Note that in both blueprints, the '/greeting' route is a function called "greeting". If I wanted to refer to the admin "greeting" function, I couldn't just say "greeting" because there is also a user "greeting" function. Endpoints allow for a sort of namespacing by having you specify the name of the blueprint as part of the endpoint. So, I could do the following...

```python
print url_for('admin.greeting') # Prints '/admin/greeting'
print url_for('user.greeting') # Prints '/user/greeting'
```

# How do I get the different parts of a Flask request's url?

You can examine the url through several [`Request`](http://flask.pocoo.org/docs/api/#flask.Request.path) fields:

> Imagine your application is listening on the following application root:
> 
> ```python
> http://www.example.com/myapplication
> ```
> 
> And a user requests the following URI:
> 
> ```python
> http://www.example.com/myapplication/foo/page.html?x=y
> ```
> 
> In this case the values of the above mentioned attributes would be the following:
> 
> ```python
>     path             /foo/page.html
>     full_path        /foo/page.html?x=y
>     script_root      /myapplication
>     base_url         http://www.example.com/myapplication/foo/page.html
>     url              http://www.example.com/myapplication/foo/page.html?x=y
>     url_root         http://www.example.com/myapplication/
> ```

You can easily extract the host part with the appropriate splits.

An example of using this:

```python
from flask import request

@app.route('/')
def index():
    return request.base_url
```

another example:

request:

```python
curl -XGET http://127.0.0.1:5000/alert/dingding/test?x=y
```

then:

```python
request.method:              GET
request.url:                 http://127.0.0.1:5000/alert/dingding/test?x=y
request.base_url:            http://127.0.0.1:5000/alert/dingding/test
request.url_charset:         utf-8
request.url_root:            http://127.0.0.1:5000/
str(request.url_rule):       /alert/dingding/test
request.host_url:            http://127.0.0.1:5000/
request.host:                127.0.0.1:5000
request.script_root:
request.path:                /alert/dingding/test
request.full_path:           /alert/dingding/test?x=y

request.args:                ImmutableMultiDict([('x', 'y')])
request.args.get('x'):       y
```

# How to debug a Flask app

Running the app in debug mode will show an interactive traceback and console in the browser when there is an error. As of Flask 2.2, to run in debug mode, pass the `--app` and `--debug` options to the `flask` command.

```
$ flask --app example --debug run
```

---

Prior to Flask 2.2, this was controlled by the `FLASK_ENV=development` environment variable instead. You can still use `FLASK_APP` and `FLASK_DEBUG=1` instead of the options above.

For Linux, Mac, Linux Subsystem for Windows, Git Bash on Windows, etc.:

```
$ export FLASK_APP=example
$ export FLASK_DEBUG=1
$ flask run
```

For Windows CMD, use `set` instead of export:

```python
set FLASK_DEBUG=1
```

For PowerShell, use `$env`:

```python
$env:FLASK_DEBUG = "1"
```

---

If you're using the `app.run()` method instead of the `flask run` command, pass `debug=True` to enable debug mode.

Tracebacks are also printed to the terminal running the server, regardless of development mode.

If you're using PyCharm, VS Code, etc., you can take advantage of its debugger to step through the code with breakpoints. The run configuration can point to a script calling `app.run(debug=True, use_reloader=False)`, or point it at the `venv/bin/flask` script and use it as you would from the command line. You can leave the reloader disabled, but a reload will kill the debugging context and you will have to catch a breakpoint again.

You can also use pdb, pudb, or another terminal debugger by calling `set_trace` in the view where you want to start debugging.

---

Be sure not to use too-broad except blocks. Surrounding all your code with a catch-all `try... except...` will silence the error you want to debug. It's unnecessary in general, since Flask will already handle exceptions by showing the debugger or a 500 error and printing the traceback to the console.

# Disable Jinja template caching for certain filter

After lots of Googling, I finally found the real solution to this. Jinja has a special helper called [contextfilter](http://jinja.pocoo.org/docs/dev/api/#jinja2.contextfilter) that you can use to decorate your function with to make your filter context-aware (and context-dependent). The Jinja bytecode cache will not cache this computed value, even when a constant is passed as input.

In your filter in Python:

```python
from jinja2 import contextfilter

@contextfilter
def asset_url(context, url):
    return some_url_thing(url)
```

In your template:

```xml
<link rel="stylesheet" href="{{ 'styles.css' | asset_url }}" />
```

### Альтернативный вариант

```python
from jinja2 import pass_context

@pass_context
@app.template_filter('active_url_cls')
def active_url_cls(context, cls, path):
	if request.path.startswith(path):
		return cls
	else:
		return ""
```