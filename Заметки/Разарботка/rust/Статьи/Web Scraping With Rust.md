https://www.scrapingbee.com/blog/web-scraping-rust/
#нуженперевод
# Web Scraping With Rust

Let’s say you want to get some information from a website, like stock prices, the latest advertisements, or newest posts. The easiest way of doing this is to connect to an API. If the website has a free-to-use API, you can just request the information you need.

If not, though, there’s always the second option: web scraping.

Instead of connecting to an “official” resource, you can use a bot to crawl the contents of the website and parse them to find the things you need.

In this article, you’ll learn how to implement web scraping with the Rust programming language. You’ll use two Rust libraries, `reqwest` and `scraper`, to scrape the top one hundred movies list from IMDb.

## Implementing a Web Scraper in Rust

You’re going to set up a fully functioning web scraper in Rust. Your target for scraping will be [IMDb](https://www.imdb.com/), a database of movies, TV series, and other media.

In the end, you’ll have a Rust program that can scrape the [top one hundred movies by user rating](https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc&count=100) at any given moment.

This tutorial assumes you already have Rust and Cargo (Rust’s package manager) installed. If you don’t, follow [the official documentation](https://www.rust-lang.org/tools/install) to install them.

### Creating the Project and Adding Dependencies

To start off, you need to create a basic Rust project and add all the dependencies you’ll be using. This is best done with Cargo.

To generate a new project for a Rust binary, run:

```scala
cargo new web_scraper
```

Next, add the required libraries to the dependencies. For this project, you’ll use `reqwest` and `scraper`.

Open the `web_scraper` folder in your favorite code editor and open the `cargo.toml` file. At the end of the file, add the libraries:

```csharp
[dependencies]

reqwest = {version = "0.11", features = ["blocking"]}
scraper = "0.12.0"
```

Now you can move to `src/main.rs` and start creating your web scraper.

### Getting the Website HTML

Scraping a page usually involves getting the HTML code of the page and then parsing it to find the information you need. Therefore, you’ll need to make the code of the IMDb page available in your Rust program. To do that, you first need to understand how browsers work, because they’re your usual way of interacting with web pages.

To display a web page in the browser, the browser (client) sends an HTTP request to the server, which responds with the source code of the web page. The browser then renders this code.

HTTP has various different types of requests, such as GET (for getting the contents of a resource) and POST (for sending information to the server). To get the code of an IMDb web page in your Rust program, you’ll need to mimic the behavior of browsers by sending an HTTP GET request to IMDb.

In Rust, you can use [`reqwest`](https://docs.rs/reqwest/latest/reqwest/) for that. This commonly used Rust library provides the features of an HTTP client. It can do a lot of the things that a regular browser can do, such as open pages, log in, and store cookies.

To request the code of a page, you can use the `reqwest::blocking::get` method:

```rust
fn main() {

    let response = reqwest::blocking::get(
        "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc&count=100",
    )
    .unwrap()
    .text()
    .unwrap();

}
```

`response` will now contain the full HTML code of the page you requested.

### Extracting Information from HTML

The hardest part of a web scraping project is usually getting the specific information you need out of the HTML document. For this purpose, a commonly used tool in Rust is the [`scraper`](https://docs.rs/scraper/0.12.0/scraper/) library. It works by parsing the HTML document into a tree-like structure. You can use [CSS selectors](https://www.w3schools.com/cssref/css_selectors.asp) to query the elements you’re interested in.

The first step is to parse your entire HTML document using the library:

```rust
    let document = scraper::Html::parse_document(&response);
```

Next, find and select the parts you need. To do that, you need to check the website’s code and find a collection of CSS selectors that uniquely identifies those items.

The simplest way to do this is via your regular browser. Find the element you need, then check the code of that element by inspecting it:

![How to inspect an element](https://i.imgur.com/qaM1KG2.png)

In the case of IMDb, the element you need is the name of the movie. When you check the element, you’ll see that it’s wrapped in an `<a>` tag:

```html
<a href="/title/tt0111161/?ref_=adv_li_tt">The Shawshank Redemption</a>
```

Unfortunately, this tag is not unique. Since there are a lot of `<a>` tags on the page, it wouldn’t be a smart idea to scrape them all, as most of them won’t be the items you need. Instead, find the tag unique to movie titles and then navigate to the `<a>` tag inside that tag.

In this case, you can pick the `lister-item-header` class:

```html
<h3 class="lister-item-header">
    <span class="lister-item-index unbold text-primary">1.</span>
    <a href="/title/tt0111161/?ref_=adv_li_tt">The Shawshank Redemption</a>
    <span class="lister-item-year text-muted unbold">(1994)</span>
</h3>
```

Now you need to create a query using the `scraper::Selector::parse` method.

You’ll give it a `h3.lister-item-header>a` selector. In other words, it finds `<a>` tags that have as a parent an `<h3>` tag that is of a `lister-item-header` class.

Use the following query:

```rust
    let title_selector = scraper::Selector::parse("h3.lister-item-header>a").unwrap();
```

Now you can apply this query to your parsed document with the `select` method. To get the actual titles of movies instead of the HTML elements, you’ll map each HTML element to the HTML that’s inside it:

```csharp
    let titles = document.select(&title_selector).map(|x| x.inner_html());
```

`titles` is now an iterator holding the names of all the top one hundred titles.

All you need to do now is to print out these names. To do that, first `zip` your title list with the numbers 1 to 100. Then call the `for_each` method on the resulting iterator, which will print each item of the iterator on a separate line:

```python
    titles
        .zip(1..101)
        .for_each(|(item, number)| println!("{}. {}", number, item));
```

Your web scraper is now done.

Here’s the complete code of the scraper:

```rust
fn main() {
    let response = reqwest::blocking::get(
        "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc&count=100",
    )
    .unwrap()
    .text()
    .unwrap();

    let document = scraper::Html::parse_document(&response);

    let title_selector = scraper::Selector::parse("h3.lister-item-header>a").unwrap();

    let titles = document.select(&title_selector).map(|x| x.inner_html());

    titles
        .zip(1..101)
        .for_each(|(item, number)| println!("{}. {}", number, item));
}
```

If you save the file and run it with `cargo run`, you should get the list of top one hundred movies at any given moment:

```markdown
1. The Shawshank Redemption
2. The Godfather
3. The Dark Knight
4. The Lord of the Rings: The Return of the King
5. Schindler's List
6. The Godfather: Part II
7. 12 Angry Men
8. Pulp Fiction
9. Inception
10. The Lord of the Rings: The Two Towers
...
```

## Conclusion

In this tutorial, you learned how to use Rust to create a simple web scraper. Rust isn’t a popular language for scripting, but as you saw, it gets the job done quite easily.

This is just the starting point in Rust web scraping. There are many ways you could upgrade this scraper, depending on your needs.

Here are some options you can try out as an exercise:

-   **Parse data into a custom struct:** You can create a typed Rust struct that holds movie data. This will make it easier to print the data and work with it further inside your program.
-   **Save data in a file:** Instead of printing out movie data, you can instead save it in a file.
-   **Create a [`Client`](https://docs.rs/reqwest/latest/reqwest/blocking/struct.Client.html) that logs into an IMDb account:** You might want IMDb to display movies according to your preferences before you parse them. For example, IMDb shows film titles in the language of the country you live in. If this is an issue, you will need to configure your IMDb preferences and then create a web scraper that can log in and scrape with preferences.

However, sometimes working with CSS selectors isn’t enough. You might need a more advanced solution that simulates actions taken by a real browser. In that case, you can use [`thirtyfour`](https://docs.rs/thirtyfour/latest/thirtyfour/), Rust’s UI testing library, for more powerful web scraping action.

If you love low-level languages you might also like our [Web scraping with C++](https://www.scrapingbee.com/blog/web-scraping-c++/).