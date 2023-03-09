https://blog.logrocket.com/top-3-templating-libraries-for-rust/

In this guide, we’ll compare a few of these crates and show you how to get started with each.

## 1. Handlebars

[Handlebars](https://handlebarsjs.com/) is a minimal templating system originally developed for JavaScript. With the [Handlebars crate](https://crates.io/crates/handlebars), we can use the same system in Rust. This crate is among one of the most production-ready templating crates for Rust and is even used to render [rust-lang.org](https://www.rust-lang.org/). Despite this, the handlebars crate is not 100 percent compatible with the JavaScript implementation, so keep the following differences in mind.

1.  Mustache blocks aren’t supported
2.  [Chained else](https://github.com/sunng87/handlebars-rust/issues/12) isn’t implemented yet

If these limitations aren’t deal-breakers, Handlebars could be a good choice for you.

Let’s take a look at how to use this crate.

First, create a new project with cargo and add it to your dependencies.

[dependencies]
handlebars = "3"

We can start with a hello world example.

use handlebars::Handlebars;
use std::collections::HashMap;

fn main() {
    let mut handlebars = Handlebars::new();
    let source = "Hello {{ name }}";
    handlebars
        .register_template_string("hello", source)
        .unwrap();

    let mut data = HashMap::new();
    data.insert("name", "Rust");

    println!("{}", handlebars.render("hello", &data).unwrap());
}

Here we register a template using a string and supply the required data as a key-value pair in a `HashMap`. This code outputs “Hello Rust.” Try replacing the “name” key in the hash map with something else and running the code again. You should see it output “Hello,” since the “name” field is never provided to the template when rendering.

Sometimes this isn’t what we want; the template expects to be given a name but silently skips it if not given. Fortunately, the handlebars crate has a strict mode that will produce a `[RenderError](https://docs.rs/handlebars/3.4.0/handlebars/struct.RenderError.html)` when trying to access fields that don’t exist, something not available in the JavaScript version. We can enable strict mode with the following line before rendering.

handlebars.set_strict_mode(true);

Now the above example will panic when no “name” field is given to the template when rendering.

For longer templates, it may be a good idea to move them into their own files. One way to do this is with the [`include_str`](https://doc.rust-lang.org/std/macro.include_str.html) macro.

handlebars
    .register_template_string("hello", include_str!("templates/hello.hbs"))
    .unwrap();

`template/hello.hbs` is the location of the template file, relative to the Rust source file. The cool thing about this macro is that it includes the content of the file at compile time, yielding a `&'static str`. This means the template strings will be included in the compiled binary and we won’t need to load files at runtime.

However, in cases where we want to load the templates at runtime, Handlebars provides some utility functions to help us.

---

[

![](https://blog.logrocket.com/wp-content/uploads/2022/11/Screen-Shot-2022-09-22-at-12.55.13-PM.png)

## Over 200k developers use LogRocket to create better digital experiences

![](https://blog.logrocket.com/wp-content/uploads/2022/08/rocket-button-icon.png)Learn more →





](https://lp.logrocket.com/blg/learn-more)

---

To load and register a single template from a file:

handlebars.register_template_file("template_name", "templates/index.hbs");

To load and register an entire directory of template files:

handlebars.register_templates_directory(".hbs", "path/to/templates");

The first argument (`.hbs`) is the file extension that will be looked for. In this case, the names of the registered templates will be the relative path of the template from the templates directory, without the extension. For example, `path/to/templates/blog/hello.hbs` would have a name `blog/hello` with the above code. Note that loading directories of templates this way requires the `dir_source` feature.

[dependencies]
handlebars = { version = "3", features = ["dir_source"] }

One final thing to be aware of is that the `render` method accepts any data that implements [Serde’s `Serialize` trait](https://docs.rs/serde/1.0.115/serde/ser/trait.Serialize.html). Earlier we used a `HashMap`, but feel free to use something else when appropriate.

Overall, I would recommend the Handlebars crate if you want as little logic as possible embedded in the templates. It’s widely used in both the Rust and JavaScript communities and the Rust implementation is rock-solid stable.

## 2. Tera

[Tera](https://tera.netlify.com/) is a templating language inspired by [Jinja2](http://jinja.pocoo.org/) and the [Django template language](https://docs.djangoproject.com/en/1.9/topics/templates). Unlike Handlebars, this crate isn’t a direct port and doesn’t aim to be 100 percent compatible with them. Also unlike Handlebars, the Tera templating language allows for complex logic within the templates and is more featureful.

To get started, add the `tera` dependency to `Cargo.toml`.

[dependencies]
tera = "1"

An equivalent “hello world” to what we used in the Handlebars example looks like the following.

use tera::{Context, Tera};

fn main() {
    let mut tera = Tera::default();

    let source = "Hello {{ name }}";
    tera.add_raw_template("hello", source).unwrap();

    let mut context = Context::new();
    context.insert("name", "Rust");

    println!("{}", tera.render("hello", &context).unwrap());
}

As you can see, it is very similar. First, we register a template string, then define some data `context`, and, finally render an output string using the template and data. One important difference here is that the second argument to `Tera::render` takes `&Context`, a type provided by the Tera crate. Fortunately, we don’t lose the flexibility of Serde’s `Serialize` because the `Context` type itself can be built from any value that implements `Serialize`.

let value = // something that implements `Serialize`
let context = Context::from_serialize(value);

Just like we saw before, the `include_str` macro can be used to include external template files at compile time. Reading templates at runtime can be done manually or with the helper methods provided by Tera, the one we would normally use being `Tera::new`.

let tera = Tera::new("templates/**/*").unwrap();

This takes a glob then loads and registers every template that matches the expanded glob.

### **Tera templating language**

Since the Tera templating language has a lot of features and doesn’t really exist outside of Rust, we will go over the basics of using it. For a full reference, check out the excellent [Tera documentation](https://tera.netlify.app/docs).

Tera templates have three kinds of special delimiters:

1.  `{{` and `}}` for expressions
2.  `{%` and `%}` for statements (`{%-` and `-%}` can be used to strip leading / trailing whitespace respectively)
3.  `{#` and `#}` for comments

They support math and comparisons.

<h1>Flower shop</h1>
{% if visit_count % 10000 == 0 %}
<p>Congratulations lucky visitor! You win a flower!</p>
{% else %}
<p>Welcome to the flower shop.</p>
{% endif %}

This example also demonstrates the syntax for conditional control structures with `if` and `else`. In addition to this, you can use the logical operators `and`, `or`, and `not` in template conditionals.

---

### More great articles from LogRocket:

-   Don't miss a moment with [The Replay](https://lp.logrocket.com/subscribe-thereplay), a curated newsletter from LogRocket
-   [Learn](https://blog.logrocket.com/rethinking-error-tracking-product-analytics/) how LogRocket's Galileo cuts through the noise to proactively resolve issues in your app
-   Use React's useEffect [to optimize your application's performance](https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/)
-   Switch between [multiple versions of Node](https://blog.logrocket.com/switching-between-node-versions-during-development/)
-   [Discover how to animate](https://blog.logrocket.com/animate-react-app-animxyz/) your React app with AnimXYZ
-   [Explore Tauri](https://blog.logrocket.com/rust-solid-js-tauri-desktop-app/), a new framework for building binaries
-   Compare [NestJS vs. Express.js](https://blog.logrocket.com/nestjs-vs-express-js/)

---

{% if month == 1 and day == 1 %}
<p>Happy new year!</p>
{% endif %}

Tera includes a concept called filters that can be used to modify data from within a template. Filters can be chained and you can register your own custom filters.

tera.register_filter("upper", string::upper);

This can then be used in templates similar to the following.

<h2>Hello, {{ name | upper }}!</h2>

Although we can create our own filters, Tera has some [built-in filters](https://tera.netlify.app/docs/#built-in-filters) for some of the common things people want to do, which may often be enough.

For iterating over arrays and structs, Tera provides for loops.

{% for student in students %}
<div>
  <h3>{{ student.name }}</h3>
  <p>{{ student.score }}</p>
</div>
{% endfor %}

<ul>
  {% for key, value in books %}
  <li>{{ key }} - {{ value.author }}</li>
  {% endfor %}
</ul>

Lastly, we can compose templates by using `include`.

{% include "header.html" %}
<h1>Blog</h1>
<p>Welcome to my blog</p>
{% include "footer.html" %}

This is just scratching the surface of what you can do with Tera templates. They also support functions, macros, inheritance, and more, but for the sake of brevity, I won’t go over them here.

Tera can be considered stable and production-ready. I believe it’s usually best not to include too much logic in templates themselves, but when the extra flexibility is needed, Tera is one of the best options available for Rust today.

## 3. Liquid

The last crate we will look at is [liquid](https://crates.io/crates/liquid), a port of the popular [Liquid template language](https://shopify.github.io/liquid) originally written in Ruby. One of the explicit goals of this crate is 100 percent compatibility with [Shopify/liquid](https://github.com/Shopify/liquid).

As always, we can get started by adding liquid to our dependencies.

[dependencies]
liquid = "0.21"

Again, the equivalent “hello world” example looks like this:

use liquid::ParserBuilder;

fn main() {
    let source = "Hello {{ name }}";
    let template = ParserBuilder::with_stdlib()
        .build()
        .unwrap()
        .parse(source)
        .unwrap();

    let globals = liquid::object!({
        "name": "Rust"
    });

    println!("{}", template.render(&globals).unwrap());
}

Instead of having a struct containing all our templates, as was the case with `Handlebars` and `Tera`, we create a single template struct at a time. This time, our data `globals` is defined with the `liquid::object` macro, but we could have also used a familiar `HashMap`-like API by working with the `liquid::Object` type directly. Like the other crates, the data object can be directly created from types that implement `Serialize`.

let value = // something that implements `Serialize`
let globals = liquid::to_object(&value).unwrap();

The liquid crate doesn’t have much [public API surface](https://docs.rs/liquid/0.21.1/liquid) in general and lacks utility functions for things like loading templates from files. That said, loading files into a string at runtime is something you can easily do yourself.

Liquid templates have many similarities to the Tera templates. They share the same delimiters for expressions and statements and also have filters with a similar syntax.

<p>{{ "rust!" | capitalize | prepend: "Hello " }}</p>

This template will render the string `"<p>Hello Rust!</p>"`.

Of the three crates we looked at, liquid is least production-ready, a fact supported by its lack of a version 1.0. Nevertheless, it may still be a good option for people coming from the Ruby version of liquid or people who just like the templating language itself.

## Conclusion

Having looked at three of the most popular templating crates, it is easy to say that templates will not be an issue for web projects written in Rust and that Rust has great support for them already. Both Handlebars and Tera are stable, production-ready crates, and while liquid may not be at the same level just yet, it is still a solid choice.

It’s worth noting that there are plenty more than these three crates for doing templating in Rust, but most of the other options are less popular and don’t yet have a stable release. No matter which crate you decide to use, you will be able to reap the performance and reliability benefits of writing web applications in Rust.