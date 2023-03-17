https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn

{% raw %}

# Day12:Write web app with actix-web - 100DayOfRust

The reason I chose `actix-web` over `rocket` is 1) it doesn't rely on the nightly version 2) it support web socket

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#1-hello-world-with-actixweb)1, Hello world with actix-web

1) Create a empty project, `cargo new actixtest`  
2) Edit `Cargo.toml` to add `actix-web`, at time of writing this article, the latest version is 1.0.9  

```
[dependencies]
actix-web = "1.0.9"
```

3) Edit `main.rs` to code the server:  

```
use actix_web::{web, App, HttpServer, HttpResponse, Responder};

fn index() -> impl Responder {
    HttpResponse::Ok().body("hello world!")
}

fn main() {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(index))
    })
    .bind("127.0.0.1:7000")
    .unwrap()
    .run()
    .unwrap();
}
```

The code is quite straightforward: create new app and setup routes (route url to handler), and put app inside a http server instance.  
4) Build and run: `cargo run`  
5) Now visit [http://127.0.0.1:7000/](http://127.0.0.1:7000/), you can see "hello world!"

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#2-restful-url)2, RESTful URL

When we want to provide RESTful API, we might align several methods to the same resource url, for example, align method get and put to "/users". Here we use `web::resource` to rewrite the routing part code:  

```
use actix_web::{web, App, HttpServer, HttpResponse, Responder};

fn index() -> impl Responder {
    HttpResponse::Ok().body("hello world!")
}

fn get_users() -> impl Responder {
    HttpResponse::Ok().body("[Alice, Bob]")
}

fn put_users() -> impl Responder {
    // here do some logic to put a new user
    HttpResponse::Ok().body("success")
}

fn main() {
    HttpServer::new(|| {
        App::new()
            .service(
                web::resource("/")
                    .route(web::get().to(index))
            )
            .service(
                web::resource("/users")
                    .route(web::get().to(get_users))
                    .route(web::put().to(put_users))
            )
    })
    .bind("127.0.0.1:7000")
    .unwrap()
    .run()
    .unwrap();
}
```

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#3-pass-parameter-from-url)3, Pass parameter from URL

Now we want to support when user visit "/hello/{name}", let the page print "hello {name}", for example, "/hello/alice" will print out "hello alice"

First let's import another class `HttpRequest` from the actix_web package, so change the first line to:  

```
use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, Responder};
```

Now let's add the URL routing part:  

```
...
            .service(
                web::resource("/hello/{name}")
                    .route(web::get().to(say_hello))
            )
...
```

Last let's add the `say_hello` handler function:  

```
fn say_hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap();
    let resp = format!("hello {}", name);
    HttpResponse::Ok().body(resp)
}
```

We get the `name` value from req's match info, then format the return string and return the response.

Now visit [http://127.0.0.1:7000/hello/alice](http://127.0.0.1:7000/hello/alice), you will see "hello alice", visit [http://127.0.0.1:7000/hello/bob](http://127.0.0.1:7000/hello/bob), you will see "hello bob"

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#4-render-page-from-template-file)4, Render page from template file

To render html out, we are going to use a template engine called `tera`, so first let's add `tera` to `Cargo.toml`  

```
[dependencies]
actix-web = "1.0.9"
tera = "0.11"
```

Now let's create our template files. Let's first create a folder called `templates`, put it at the same level with file `Cargo.toml`, so like this:

actixtest  
|- Cargo.toml  
|- templates  
|- src

Inside templates folder, create 2 files: `base.html` and `index.html`:

base.html  

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Actix Web</title>
    </head>
    <body>
        {% block content %}
        {% endblock content %}
    </body>
</html>
```

Then in `index.html`, we will inherit the `base.html` and overwrite the `content` block:  

```
{% extends "base.html" %}

{% block content %}
<h1>hello {{name}}</h1>
{% endblock content %}
```

Ok, now our template files are ready, let's setup tera in our main.rs.

First import it:  

```
use tera::{Tera, Context};
```

Then in `HttpServer::new` closure function, before the line `App::new()`, let's setup the tera instance:  

```
        let tera =
            Tera::new(
                concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")
            ).unwrap();
```

You can see here we pass the "templates" folder path to Tera, Tera will find all files under that folder and compile them.

Now let's create a data struct to save all the data for the App Context  

```
struct AppData {
    tmpl: Tera
}
```

Around the line `App::new()`, add:  

```
        App::new()
            .data(AppData {tmpl: tera})
```

Ok, now we have the tera instance and passed this instance to app data in the app context. Let's setup a new route url to test template rendering:  

```
        .service(
                web::resource("/tmpl/{name}")
                    .route(web::get().to(render_tmpl))
            )
```

Last we define this `render_tmpl` handler:  

```
fn render_tmpl(data: web::Data<AppData>, req:HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap();
    let mut ctx = Context::new();
    ctx.insert("name", name);
    let rendered = data.tmpl.render("index.html", &ctx).unwrap();
    HttpResponse::Ok().body(rendered)
}
```

Now `cargo run`, visit [http://127.0.0.1:7000/tmpl/bob](http://127.0.0.1:7000/tmpl/bob) you will see the html version "hello bob" inside a `h1` tag from our `index.html` template.

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#final-code)Final code

Here is our final complete code:  

```
use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, Responder};
use tera::{Tera, Context};

fn index() -> impl Responder {
    HttpResponse::Ok().body("hello world!")
}

fn get_users() -> impl Responder {
    HttpResponse::Ok().body("[Alice, Bob]")
}

fn put_users() -> impl Responder {
    // here do some logic to put a new user
    HttpResponse::Ok().body("success")
}

fn say_hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap();
    let resp = format!("hello {}", name);
    HttpResponse::Ok().body(resp)
}

fn render_tmpl(data: web::Data<AppData>, req:HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap();
    let mut ctx = Context::new();
    ctx.insert("name", name);
    let rendered = data.tmpl.render("index.html", &ctx).unwrap();
    HttpResponse::Ok().body(rendered)
}

struct AppData {
    tmpl: Tera
}


fn main() {
    HttpServer::new(|| {
        let tera =
            Tera::new(
                concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")
            ).unwrap();

        App::new()
            .data(AppData {tmpl: tera})
            .service(
                web::resource("/")
                    .route(web::get().to(index))
            )
            .service(
                web::resource("/users")
                    .route(web::get().to(get_users))
                    .route(web::put().to(put_users))
            )
            .service(
                web::resource("/hello/{name}")
                    .route(web::get().to(say_hello))
            )
            .service(
                web::resource("/tmpl/{name}")
                    .route(web::get().to(render_tmpl))
            )
    })
    .bind("127.0.0.1:7000")
    .unwrap()
    .run()
    .unwrap();
}
```

### [](https://dev.to/0xbf/day11-write-web-app-with-actix-web-100dayofrust-1lkn#reference)Reference

-   [https://actix.rs/docs/url-dispatch/](https://actix.rs/docs/url-dispatch/)
-   [https://tera.netlify.com/](https://tera.netlify.com/)
-   [http://siciarz.net/24-days-rust-tera/](http://siciarz.net/24-days-rust-tera/)
-   [https://github.com/actix/examples/blob/master/template_tera/src/main.rs](https://github.com/actix/examples/blob/master/template_tera/src/main.rs)

{% endraw %}