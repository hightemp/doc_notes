https://blog.miguelgrinberg.com/post/beautiful-interactive-tables-for-your-flask-templates

Rendering a table with data in a Flask template is a relatively simple task when the table is short, but can be incredibly hard for larger tables that require features such as sorting, pagination and searching. In this article I'm going to show you how to integrate the [dataTables.js](https://datatables.net/) library in your templates, which will allow you to create fully featured tables with ease!

## How to Get the Code

All the code presented in this article comes from my [flask-tables repository](https://github.com/miguelgrinberg/flask-tables) on GitHub. I will only be showing the interesting snippets here, so if you intend to run the code locally you should clone this repository, create a virtual environment and install the _requirements.txt_ file in it.

**Update**: I have now released an update to this article, including support for editing table cells. Check it out [here](https://blog.miguelgrinberg.com/post/beautiful-flask-tables-part-2)!

## How to Render a Table in Flask

I am going to start from the beginning, so the first step is to create a small Flask application that renders a plain table.

The table is going to contain contain information about users. Here is the SQLAlchemy model that I'm going to use for the database:

```
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True)
    age = db.Column(db.Integer, index=True)
    address = db.Column(db.String(256))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120), index=True)
```

The application is going to have a single route, which passes the query with all the users stored in the database to a Jinja template for rendering:

```
@app.route('/')
def index():
    users = User.query
    return render_template('bootstrap_table.html', title='Bootstrap Table',
                           users=users)
```

The template name is _bootstrap_table.html_ because I will be using the [Bootstrap](https://getbootstrap.com/) CSS framework to provide the basic table styling. This is entirely optional, but in my case it makes sense because I use Bootstrap in most of my projects, and I want my tables to have a look that is consistent with the rest of the page.

Here is the _bootstrap_table.html_ template:

```
{% extends "base.html" %}

{% block content %}
  <table id="data" class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Address</th>
        <th>Phone Number</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {% for user in users %}
        <tr>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
{% endblock %}
```

I hope you agree that there isn't much going on in this template. The `<table>` element is created with two sections: a header (inside the `<thead>` element) and a body (inside `<tbody>`). The contents in both sections are rows of data, either table headers or actual users. The table body is generated with a Jinja for-loop that iterates over the query object that was passed in as an argument in the `render_template()` call.

From looking at the first line in the template, you know that I'm using template inheritance. This is because I want to keep the boilerplate of the page from complicating the template file. The _base.html_ template from which _bootstrap_table.html_ inherits from is copied below:

```
<!doctype html>
<html>
  <head>
    <title>{{ title }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1>{{ title }}</h1>
      <hr>
      {% block content %}{% endblock %}
    </div>
    {% block scripts %}{% endblock %}
  </body>
</html>
```

This base template includes the Bootstrap CSS file from a CDN, accepts a `title` argument that is inserted both in the `<head>` section and as a `<h1>` element at the top of the page, and creates two blocks `content` and `scripts` for the derived template to use.

### Running the Bootstrap Table

To be able to test the application, I needed to generate some random content for the database table, The _create_fake_users.py_ script shown below achieves that:

```
import random
import sys
from faker import Faker
from bootstrap_table import db, User


def create_fake_users(n):
    """Generate fake users."""
    faker = Faker()
    for i in range(n):
        user = User(name=faker.name(),
                    age=random.randint(20, 80),
                    address=faker.address().replace('\n', ', '),
                    phone=faker.phone_number(),
                    email=faker.email())
        db.session.add(user)
    db.session.commit()
    print(f'Added {n} fake users to the database.')


if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('Pass the number of users you want to create as an argument.')
        sys.exit(1)
    create_fake_users(int(sys.argv[1]))
```

This script uses the [Faker](https://faker.readthedocs.io/en/master/) package to generate fake (yet realistic) information.

An interesting little trick that I'm using here is to "steal" the `db` object and the `User` model from the Flask application. This actually works quite well and eliminates the need to duplicate the database and model definitions for use outside of the Flask application.

If you have cloned the [flask-tables](https://github.com/miguelgrinberg/flask-tables) repository and set up a virtual environment with all the dependencies, you can now create a database with a handful of random users with the following command:

```
python create_fake_users.py 5
```

And then you can run the Bootstrap table application:

```
python bootstrap_table.py
```

If you navigate to _http://localhost:5000_ on your web browser, you should see a nice table with five rows.

![Bootstrap table](https://blog.miguelgrinberg.com/static/images/tables-bootstrap.png)

## Adding dataTables.js

While the table above looks nice, it is only practical to use it when the number of rows is very small. In general you will find that users expect larger tables to have interactive features, such as pagination, searching and sorting, and the Bootstrap table has none of that.

So here is where the [dataTables.js](https://datatables.net//) library enters the picture. This library runs in the browser and attaches to a `<table>` element to enhance it.

Before I show you how to apply _dataTables.js_ to the Bootstrap table above, the library needs to be included in the _base.html_ template, so that it is available to use. Below you can find the updated base template that includes _dataTables.js_:

```
<!doctype html>
<html>
  <head>
    <title>{{ title }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.25/css/dataTables.bootstrap5.css">
  </head>
  <body>
    <div class="container">
      <h1>{{ title }}</h1>
      <hr>
      {% block content %}{% endblock %}
    </div>
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.25/js/dataTables.bootstrap5.js"></script>
    {% block scripts %}{% endblock %}
  </body>
</html>
```

In the `<head>` section I've added the _dataTables.bootstrap5.css_ stylesheet. The _dataTables.js_ library provides styles that are compatible with several CSS frameworks, so you have to use the correct CSS file here. For Bootstrap, there are styles for versions 3, 4 and 5. If you don't use Bootstrap, it also provides styles for tables built with [Foundation](https://get.foundation/), [jQuery UI](https://jqueryui.com/), [Bulma](https://bulma.io/) and [a few other](https://cdn.datatables.net/) CSS frameworks. If you don't use any CSS frameworks, it also provides a set of standalone styles.

At the bottom of the `<body>` element I have added a few scripts. First there's the [jQuery](https://jquery.com/) library, which is a required dependency of _dataTables.js_. Next is the core _dataTables.js_ library, which is called _jquery.dataTables.js_. The third and last script is called _dataTables.bootstrap5.js_, and provides the custom logic that applies to my chosen Bootstrap 5 integration. If you use a different styling framework you will need to change this last script accordingly.

At the very end of the body the base template keeps the `scripts` block, included there to give derived templates the chance to add their own scripts. This is going to be how the templates can initialize and configure the _dataTables.js_ library.

## A Basic Table

In its most basic implementation, all that is needed to enhance a table is to call the `DataTable()` function on it. Using the Bootstrap table example as a starting point, the only change that needs to be made is to add a short script in the template to call this function:

```
{% block scripts %}
  <script>
    $(document).ready(function () {
      $('#data').DataTable();
    });
  </script>
{% endblock %}
```

The `$(document).ready()` function comes from jQuery and is used to tell the browser to execute the function passed as an argument after the page finished loading. The `$('#data')` expression is a jQuery selector that retrieves the element with the `id` attribute set to `data`, in other words, the table that is rendered in the Jinja template. The `DataTable()` function from _dataTables.js_ modifies this table in place, as you will see in a moment.

### Running the Basic Table

Before you try this example out, it would be a good idea to add a few more users to the database. Let's add 100 more:

```
python create_fake_users.py 100
```

There should now be 105 users in the database, which is a nice size to experience the pagination feature. If you have the [flask-tables](https://github.com/miguelgrinberg/flask-tables) repository cloned, this example is called _basic_table.py_ and you can start it as follows:

```
python basic_table.py
```

If you now navigate to _http://localhost:5000_ on your browser, you should see a much nicer table:

![Bootstrap table](https://blog.miguelgrinberg.com/static/images/tables-basic.png)

This table implements all the features you would expect, including pagination (bottom right corner of the table), searching (top-right) and sorting (table headers). In addition, in the top-left there is a dropdown where you can select how many rows are displayed per page, and in the bottom-left corner you can see the range of rows that are currently displayed, and how many rows there are in total. This is all managed by _dataTables.js_, without having to do any additional work besides rendering the table!

The `DataTable()` function accepts an options object that the application can use to customize the way the table is enhanced. The [number of options](https://datatables.net/reference/option/) that are available covers a wide range of customizations.

To demonstrate how this customization works, I'm going to change the way the sorting and searching works using the `columns` option:

```
{% block scripts %}
  <script>
    $(document).ready(function () {
      $('#data').DataTable({
        columns: [
          null,
          {searchable: false},
          {orderable: false, searchable: false},
          {orderable: false, searchable: false},
          null],
      });
    });
  </script>
{% endblock %}
```

The `columns` option accepts an array of sub-options for each column in the table. For the columns that do not need customization the `null` value is given. I've made two customizations, first I set the `searchable` column option to `false` for the Age, Address and Phone Number columns. This will remove these columns when the library looks for matches to a search string given in the search box. The second change is to set the `orderable` option to `false` for the Address and Phone Number columns, which removes the clickable sorting headers on these two columns.

## Adding an Ajax Data Source

You may be wondering why I called the above table the "basic" table, given that it has all the features you may wish to have in a table. The problem with this way of using _dataTables.js_ is that you have to render the entire table to the page before the library takes over and applies its enhancements. If the table is large, Jinja may take a considerable amount of time rendering it, and then the browser may spend some more time downloading all that HTML content, and all of this will happen while the user is waiting for the page to display. For long tables, when the page completes to load in the browser you may see the original table rendered on the page for a short moment before the enhancements are applied, just because of the number of rows that need to be hidden as a result of the pagination.

While the basic solution from the previous section is conveniently simple, it only works for tables that are not very long. A better approach would be to render the table without any rows, and then have the browser request the data that goes in the table asynchronously through a separate request.

This obviously requires a more involved integration, but it is still relatively low effort. The first change I'm going to make is to expand the `User` model with a `to_dict()` method that can return a user as a Python dictionary that can be serialized to JSON:

```
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True)
    age = db.Column(db.Integer, index=True)
    address = db.Column(db.String(256))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))

    def to_dict(self):
        return {
            'name': self.name,
            'age': self.age,
            'address': self.address,
            'phone': self.phone,
            'email': self.email
        }
```

The main endpoint in the application will now render an empty table, so there is no need to pass the user query to the template anymore:

```
@app.route('/')
def index():
    return render_template('ajax_table.html', title='Ajax Table')
```

A second endpoint needs to be added for the table data. This endpoint will return a JSON payload in the following format:

```
{
    "data": [
        { ... user dict ... },
        { ... user dict ... },
        ...
    ]
}
```

I've decided to put the second endpoint on the _/api/data_ URL. The implementation of this second endpoint is shown below:

```
@app.route('/api/data')
def data():
    return {'data': [user.to_dict() for user in User.query]}
```

The template that renders the table does not need the for-loop that renders all the users anymore, the table is now rendered without any data rows.

```
{% block content %}
  <table id="data" class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Address</th>
        <th>Phone Number</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
{% endblock %}
```

And finally, the script that attaches _dataTables.js_ to the table needs to pass the `ajax` option with the URL of the data endpoint, and each column needs the `data` sub-option that indicates which of the keys in each element's dictionary should be used for that column:

```
{% block scripts %}
  <script>
    $(document).ready(function () {
      $('#data').DataTable({
        ajax: '/api/data',
        columns: [
          {data: 'name'},
          {data: 'age', searchable: false},
          {data: 'address', orderable: false, searchable: false},
          {data: 'phone', orderable: false, searchable: false},
          {data: 'email'}
        ],
      });
    });
  </script>
{% endblock %}
```

### Running the Ajax Table

In the [flask-tables](https://github.com/miguelgrinberg/flask-tables) repository, the ajax solution described above is defined in the _ajax_table.py_ and _templates/ajax_table.html_ files. You can run this version of the table as follows:

```
python ajax_table.py
```

As before, you can view the table by navigating to _http://localhost:5000_ on your browser.

## Server-Driven Tables

The ajax table is better than the basic table because the data is downloaded in the background, after the page has been loaded. But like the basic solution, this method has the problem that the data is downloaded all in a single request, so it is still not something you can use for a very large table set because the data would take too long to download and nothing will display until all the data is downloaded. For really large tables the data may not even fit in the memory of the browser all at once.

The perfect solution, which would work for tables of any size, is for the browser to download rows of the table on demand, as they are needed. With a solution of this type, a table with thousands, or even millions of rows would still work with good performance because the client would be downloading only the few rows it needs to display. And when the user navigates to a different page, a new request would download the new rows that become visible.

It is a great solution, but has a big disadvantage. In the basic and ajax tables, the _dataTables.js_ library was able to implement searching and sorting on its own, because it had access to the entire data set. If the library will download the data one page at a time, then it won't be able to manage the search filter or the clickable sorting headers. This solution is the hardest of the three to implement, because searching and sorting needs to be moved to the server on the _/api/data_ endpoint.

The _dataTables.js_ calls this method [server-side processing](https://datatables.net/manual/server-side), because it passes the control of the pagination, searching and sorting to the server.

Starting from the ajax solution, the changes in the template to enable the server-side option are actually very simple. All that needs to be done is add the `serverSide: true` option to the table:

```
{% block scripts %}
  <script>
    $(document).ready(function () {
      $('#data').DataTable({
        ajax: '/api/data',
        serverSide: true,
        columns: [
          {data: 'name'},
          {data: 'age'},
          {data: 'address', orderable: false},
          {data: 'phone', orderable: false},
          {data: 'email'}
        ],
      });
    });
  </script>
{% endblock %}
```

When the `serverSide` option is enabled, the library will disable its own processing of the data and will instead send the pagination, searching and sorting requirements as query string arguments to the ajax endpoint.

### Server-Side Pagination

In my first attempt at server-side processing I'm going to show you how to implement pagination. The _dataTables.js_ library will send the `start` and `length` query string arguments indicating the range of rows that it needs.

Here is the paginated endpoint:

```
@app.route('/api/data')
def data():
    query = User.query

    total_filtered = query.count()

    # pagination
    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # response
    return {
        'data': [user.to_dict() for user in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': User.query.count(),
        'draw': request.args.get('draw', type=int),
    }
```

I hope this is not too hard to follow. The endpoint takes the `start` and `length` arguments from the request object, and it then applies them as `offset` and `limit` filters on the SQLAlchemy query object.

The response that is sent back to _dataTables.js_ consists of a JSON object with four keys:

-   `data`: a list of the paginated results. These are obtained by running the query, after it was modified to account for pagination.
-   `recordsFiltered`: the total number of rows that match the current search filter. Since searching isn't implemented yet, I'm setting the `total_filtered` variable to `query.count()` before the pagination is applied. For now this is going to be the total number of rows in the table.
-   `recordsTotal`: the total number of rows in the table, without considering any filters. I'm calculating this simply by running `User.query.count()` which just returns the total count of rows in the database table.
-   `draw`: an opaque value that _dataTables.js_ sends to the server. It needs to be returned exactly as sent, so that the client can match a response to the corresponding request.

This endpoint is functional and can be used, but because searching and sorting aren't implemented, those options are going appear as if they are not working.

### Server-Side Searching

The implementation for search is a bit more involved. The _dataTables.js_ library will send what the user types in the search box in the `search[value]` query string argument (the brackets are part of the argument name).

In a relational database, a good option to perform searches is the `LIKE` operator, which searches using a simple pattern. Luckily this is integrated with SQLAlchemy. If you want to search for names that begin with "Chris", the query would be:

```
User.query.filter(User.name.like('Chris%'))
```

The `%` acts as a placeholder, so this query will match users named Chris, Christian and Christina. A `%` can be added at the start as well:

```
User.query.filter(User.name.like('%ar%'))
```

Now the text in between the percent signs can appear anywhere in the name, so the above query will match users named Aaron, Arnold and any others with "ar" anywhere in their names.

In the previous two table implementations the search was not only done in the Name column, the table configuration had both the Name and Email columns as searchable. This can be implemented in SQLAlchemy using the `or_` operator:

```
User.query.filter(db.or_(
    User.name.like('%ar%'),
    User.email.like('%ar%'),
))
```

This query can be added to the _/api/data_ endpoint right above the `total_filtered` variable:

```
@app.route('/api/data')
def data():
    query = User.query

    # search filter
    search = request.args.get('search[value]')
    if search:
        query = query.filter(db.or_(
            User.name.like(f'%{search}%'),
            User.email.like(f'%{search}%')
        ))
    total_filtered = query.count()

    # pagination
    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # response
    return {
        'data': [user.to_dict() for user in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': User.query.count(),
        'draw': request.args.get('draw', type=int),
    }
```

With this version of the endpoint, the `total_filtered` variable will be calculated after the search is applied, but before pagination, so it will tell the client how many records match the search. As you recall, this information is shown in the bottom-left corner of the table.

### Server-Side Sorting

The last bit of logic that needs to be added to the _/api/data_ endpoint is the sorting. The client will send the sorting requirements in the following query string arguments:

-   `order[0][column]`: the column index to sort by, zero based.
-   `order[0][dir]`: the string `asc` if sorting in ascending order, or `desc` if sorting in descending order.

The table supports sorting by multiple columns as well. As a user, you can select additional sorting columns by shift-clicking on the sorting headers. The server receives the additional columns with increasing index numbers in the order arguments. For example, a secondary sorting column will be given in the `order[1][column]` and `order[1][dir]` arguments.

The client also sends the configuration of the columns to the server and this is actually handy because it can be used to transform the column indexes into column names. For the table configuration used in this project, the following arguments would be sent also as query string arguments:

-   `columns[0][data]`: set to `name`
-   `columns[1][data]`: set to `age`
-   `columns[2][data]`: set to `address`
-   `columns[3][data]`: set to `phone`
-   `columns[4][data]`: set to `email`

Using the above elements from the query string, here is a Python snippet that calculates the first sorting column:

```
        col_index = request.args.get('order[0][column]')
        col_name = request.args.get(f'columns[{col_index}][data]')
        if col_name not in ['name', 'age', 'email']:
            col_name = 'name'
        descending = request.args.get(f'order[0][dir]') == 'desc'
        col = getattr(User, col_name)
        if descending:
            col = col.desc()
```

This logic is non-trivial, so you may need to read it carefully to understand everything that goes on. The `col_index` variable is imported from the query string, and then used as an index to get the column name into the `col_name` variable.

Just as a matter of security, I make sure that the column name is one of the three columns that has the `orderable` option set. If the server receives any column name that is not one of these, then the name is reset back to `name`. This is as a precaution, as it is not a good idea to allow the client to request sorting by an arbitrary column without any validation.

The `descending` variable is then set to a boolean value of `True` or `False` according to the sorting direction.

The last three lines in the snippet obtain the selected column of the `User` model using `getattr`, and apply the `desc()` sorting qualifier if the descending direction was requested. When sorting by name ascending, the value of `col` at the end would be `User.name`. If sorting by age descending, the value of `col` would be `User.age.desc()`. This is exactly what the `order_by()` filter from SQLAlchemy requires as an argument.

Below you can see how the sorting snippet above is incorporated into the _/api/data_ endpoint. You will notice that there is a little bit more complexity introduced by a while-loop that deals with multiple sorting columns:

```
@app.route('/api/data')
def data():
    query = User.query

    # search filter
    search = request.args.get('search[value]')
    if search:
        query = query.filter(db.or_(
            User.name.like(f'%{search}%'),
            User.email.like(f'%{search}%')
        ))
    total_filtered = query.count()

    # sorting
    order = []
    i = 0
    while True:
        col_index = request.args.get(f'order[{i}][column]')
        if col_index is None:
            break
        col_name = request.args.get(f'columns[{col_index}][data]')
        if col_name not in ['name', 'age', 'email']:
            col_name = 'name'
        descending = request.args.get(f'order[{i}][dir]') == 'desc'
        col = getattr(User, col_name)
        if descending:
            col = col.desc()
        order.append(col)
        i += 1
    if order:
        query = query.order_by(*order)

    # pagination
    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # response
    return {
        'data': [user.to_dict() for user in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': User.query.count(),
        'draw': request.args.get('draw', type=int),
    }
```

### Running the Server-Driven Table

If you made it all the way here you can congratulate yourself, because this is the end, the more advanced implementation of the table is now complete.

Before you try this out, it would be a good idea to add more users to the database, because this advanced implementation really shines when there is a lot of data:

```
python create_fake_users.py 1000
```

Using the [flask-tables](https://github.com/miguelgrinberg/flask-tables) repository, you can run this version of the table as follows:

```
python server_table.py
```

And once again navigate to _http://localhost:5000_ on your browser and appreciate how nice and performant your table is!

If you want to stress-test this implementation, you are welcome to add as many more users as you want to the table. The performance of this solution is now driven by how fast your database can perform the required queries.

## Conclusion

I hope this article was as fun to read as it was for me to write it!

The _dataTables.js_ library has an extensive list of features, many of which I have not covered, so you should read [their documentation](https://datatables.net/) to learn about everything this library has to offer.

**Update**: I have now switched to grid.js as my favorite table library to use with Flask. I have written an article about it [here](https://blog.miguelgrinberg.com/post/beautiful-flask-tables-part-2).

Have you used a different method to generate your tables? I'd love to know so leave a comment below.