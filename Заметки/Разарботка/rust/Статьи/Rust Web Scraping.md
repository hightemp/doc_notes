https://www.gkbrk.com/wiki/rust_web_scraping/

# Rust Web Scraping

Tags: _[rust](https://www.gkbrk.com/tag/rust.html)_ _[web-scraping](https://www.gkbrk.com/tag/web-scraping.html)_

**Reading time:** about 5 minutes

-   [HTTP requests / Getting the page contents](https://www.gkbrk.com/wiki/rust_web_scraping/#http-requests--getting-the-page-contents)
    -   [ureq](https://www.gkbrk.com/wiki/rust_web_scraping/#ureq)
    -   [curl](https://www.gkbrk.com/wiki/rust_web_scraping/#curl)
    -   [Reqwest](https://www.gkbrk.com/wiki/rust_web_scraping/#reqwest)
    -   [Hyper](https://www.gkbrk.com/wiki/rust_web_scraping/#hyper)
-   [Extracting the data](https://www.gkbrk.com/wiki/rust_web_scraping/#extracting-the-data)
    -   [Regular Expressions](https://www.gkbrk.com/wiki/rust_web_scraping/#regular-expressions)
    -   [HTML parsers](https://www.gkbrk.com/wiki/rust_web_scraping/#html-parsers)
    -   [JSON parsers](https://www.gkbrk.com/wiki/rust_web_scraping/#json-parsers)
-   [Browser automation](https://www.gkbrk.com/wiki/rust_web_scraping/#browser-automation)
    -   [Using Selenium / WebDriver with Rust](https://www.gkbrk.com/wiki/rust_web_scraping/#using-selenium--webdriver-with-rust)
-   [Data storage](https://www.gkbrk.com/wiki/rust_web_scraping/#data-storage)
    -   [SQLite](https://www.gkbrk.com/wiki/rust_web_scraping/#sqlite)
    -   [PostgreSQL](https://www.gkbrk.com/wiki/rust_web_scraping/#postgresql)
    -   [MongoDB](https://www.gkbrk.com/wiki/rust_web_scraping/#mongodb)
-   [Code examples](https://www.gkbrk.com/wiki/rust_web_scraping/#code-examples)
    -   [Getting the Hacker News Front page](https://www.gkbrk.com/wiki/rust_web_scraping/#getting-the-hacker-news-front-page)
    -   [Pipelines with Iterators](https://www.gkbrk.com/wiki/rust_web_scraping/#pipelines-with-iterators)
    -   [GET request with Reqwest](https://www.gkbrk.com/wiki/rust_web_scraping/#get-request-with-reqwest)

Rust is very useful as a performant systems-programming language, but it can also be used for data mining and web scraping. It’s type system and memory safety makes it a great tool to write reliable data extractors.

On this page, I will write about a few Rust libraries that are useful for this purpose and show some example code.

# HTTP requests / Getting the page contents

Perhaps the most important part of scraping a web page is getting the page HTML. Rust has a few choices for this, the right choice depends on your priorities.

When this page was originally written, most clients had blocking APIs. Now Rust has support for asynchronous and synchronous I/O.

For most “client” applications, it is much easier to go with synchronous options as the benefits of async IO are mostly useful on servers.

## ureq

[ureq](https://crates.io/crates/ureq) is a simple HTTP client that doesn’t have the bloat of async runtimes. This is a synchronous client library, and doesn’t require another runtime.

## curl

While it is not written in Rust, and there are excellent alternatives that are, you always have the option of using the libcurl bindings. You can find the [curl](https://crates.io/crates/curl).

## Reqwest

A new library that surfaced after this page was originally written is [Reqwest](https://crates.io/crates/reqwest). Reqwest tries to cover the common use cases with sensible defaults and relatively good performance. It could be seen as the Rust version of Python’s _requests_. It really simplifies the whole process of making HTTP requests, so unless you need absolute control over every part of your requests, you should give _reqwest_ a try.

## Hyper

[Hyper](https://crates.io/crates/hyper) is a fast and modern HTTP client (and server) library that leverages Rust’s type system to make zero-cost, safe abstractions over the protocol.

In general, Hyper is pretty low-level and not the best choice for scrapers. There are libraries, such as [Reqwest](https://www.gkbrk.com/wiki/rust_web_scraping/#reqwest), that use Hyper internally but expose a simpler interface.

# Extracting the data

## Regular Expressions

While we know using Regexes to parse HTML is a Bad Idea™, and know that it’s [not even possible](https://stackoverflow.com/a/1732454) to do so; we also know that at some point everybody will use them for this purpose for one reason or another. Rust has us covered for this use-case with it’s excellent [Regex](https://doc.rust-lang.org/regex/regex/index.html) library.

It’s useful for when the page layout is known not to change, or for when you’re dealing with incorrect HTML. Still, it’s a good idea to give actual HTML parsers a go, they can be much more durable with changing layouts.

## HTML parsers

Depending on the page you’re scraping, HTML parsers will probably be more reliable than regular expressions.

[Select](https://github.com/utkarshkukreti/select.rs) uses html5ever, a fast HTML parser written in Rust, in order to make navigating the page tags and extracting the data you need easy. It server a similar purpose to Java’s jsoup and Python’s BeautifulSoup.

Another library that can be used to parse HTML is [scraper](https://crates.io/crates/scraper).

## JSON parsers

If you are lucky, you can find an endpoint that produces JSON data. This is usually the case when the website you are trying to scrape is a JavaScript app that fetches its data dynamically. In these cases, you can use the Network tab of the Developer Tools to determine how you need to make a request to get the JSON data.

After you find the endpoint and fetch the content using the HTTP Clients above, you need to use a JSON parser in order to extract the data you need. The most popular JSON parser in the Rust ecosystem is [serde_json](https://crates.io/crates/serde_json).

# Browser automation

## Using Selenium / WebDriver with Rust

In Python, it is common to spawn a real browser and interact with it through the [WebDriver protocol](https://www.w3.org/TR/webdriver2/) using [Selenium](https://www.selenium.dev/). If you come across a website that is inconvenient to scrape with the usual methods, you can use a web browser to help you.

Some Rust crates that implement this protocol are [fantoccini](https://github.com/jonhoo/fantoccini) and [thirtyfour](https://crates.io/crates/thirtyfour).

# Data storage

Every day Rust is getting more and more options for interfacing with databases. Depending on your preference you can either write the raw SQL queries yourself, or you can use a ORM library that will map Rust structures into SQL data types for you.

## SQLite

One of the simplest options is to use [SQLite](https://sqlite.org/index.html). SQLite is a well known embeddable database. It is written in C, and it has bindings for lots of different languages including Java, Python, Ruby and Rust. You can use the [rusqlite](https://github.com/jgallagher/rusqlite) crate for interacting with SQLite databases. It lets you update and query the database while taking advantage of the type system.

## PostgreSQL

If you prefer to use [PostgreSQL](https://www.postgresql.org/), you can use the [postgres](https://crates.io/crates/postgres) crate to interact with it. The [documentation](https://docs.rs/postgres/0.17.4/postgres/) has useful examples to get started quickly.

## MongoDB

[MongoDB](https://crates.io/crates/mongodb) publishes an official database driver for Rust, aptly called [mongodb](https://crates.io/crates/mongodb).

# Code examples

## Getting the Hacker News Front page

As an example, let’s grab the HN Front page with _reqwest_ and _regex_. First of all, let’s get the HTML of the page using _reqwest_.

```
let url = "https://news.ycombinator.com/";
let html = reqwest::get(url)?.text()?;
```

After this, we need to construct our regex matcher. If you look at the Hacker News HTML, you will see that the posts are shown like this.

```
<td class="title"><a href="https://blog.mozilla.org/addons/2018/01/26/extensions-firefox-59/" class="storylink">Extensions in Firefox 59</a>
```

Here’s how you can turn this into a regular expression in Rust.

```
let re = Regex::new("<td class=\"title\"><a href=\"(.*?)\" class=\"storylink\">(.*?)</a>").unwrap();
```

Let’s iterate over the matches in the HTML and print them to the console.

```
for cap in re.captures_iter(&content) {
    let link = &cap[1];
    let title = &cap[2];
    println!("{}: {}", title, link);
}
```

## Pipelines with Iterators

Rust has excellent support for iterators, and with a little functional-programming magic, you can make your scrapers really modular and maintainable.

```
fn get_links(html: &str) -> Vec<String> {
    let re = Regex::new("<td class=\"title\"><a href=\"(.*?)\" class=\"storylink\">.*?</a>").unwrap();
    re.captures_iter(html)
        .map(|story| {
            story[1].to_string()
        }).collect()
}

fn get_page_size(r: Response) -> usize {
    r.bytes().count()
}

let mut resp = reqwest::get("https://news.ycombinator.com/")?;
let html = resp.text()?;

let a = get_links(&html).iter()
    .map(|link| reqwest::get(&*link))
    .filter_map(|res| res.ok())
    .map(get_page_size)
    .collect::<Vec<usize>>();

println!("{:?}", a);
```

## GET request with Reqwest

```
let mut resp = reqwest::get("https://gkbrk.com/feed.xml")?;
let content = resp.text()?;

println!("{}", content);
```

### Citation

If you find this work useful, please cite it as:

@article{yaltirakliwikirustwebscraping,
  title   = "Rust Web Scraping",
  author  = "Yaltirakli, Gokberk",
  journal = "gkbrk.com",
  year    = "2023",
  url     = "https://www.gkbrk.com/wiki/rust_web_scraping/"
}

Not using BibTeX? Click here for more citation styles.

**IEEE Citation**  

Gokberk Yaltirakli, "Rust Web Scraping", March, 2023. [Online]. Available: https://www.gkbrk.com/wiki/rust_web_scraping/. [Accessed Mar. 03, 2023].

**APA Style**  

Yaltirakli, G. (2023, March 03). Rust Web Scraping. https://www.gkbrk.com/wiki/rust_web_scraping/

**Bluebook Style**  

Gokberk Yaltirakli, _Rust Web Scraping_, GKBRK.COM (Mar. 03, 2023), https://www.gkbrk.com/wiki/rust_web_scraping/

### Comments

Comment 

Name 

Comment by admin  
[_2019-03-20 at 14:17_](https://www.gkbrk.com/wiki/rust_web_scraping/#comment-545e773e-7d55-4fc6-99ca-346b9f818ef0)  
_Spam probability: 0.0%_

Hey @IT, Curl might be more lightweight. You can check it out on https://crates.io/crates/curl.

Comment by IT  
[_2019-03-06 at 09:18_](https://www.gkbrk.com/wiki/rust_web_scraping/#comment-248a0ca4-d4b1-4cd7-8b91-e795947b50ce)  
_Spam probability: 0.0%_

reqwest pulls in 100MB of crates and builds 138 of them, taking minutes, just to do one lousy GET. There really should be a more simple and sane crate that just does this one thing properly.

Comment by admin  
[_2019-01-30 at 23:41_](https://www.gkbrk.com/wiki/rust_web_scraping/#comment-6adc7c2c-9ff7-495d-a9ae-4ff37896d02e)  
_Spam probability: 0.0%_

Hi, I don't use VBA at all; but from what I can gather from that StackOverflow link, you're trying to use a proxy. That should be pretty easy to do with the libraries above.

Comment by TahorSuiJuris  
[_2019-01-30 at 16:13_](https://www.gkbrk.com/wiki/rust_web_scraping/#comment-c1dd3263-dae2-4ead-9e35-247609d56e0c)  
_Spam probability: 0.0%_

Any experiences to share in the conversion of an Excel VBA data extraction script conversion to Rust? https://stackoverflow.com/questions/54444427/modify-from-xmlhttp-to-serverxmlhttp-for-enabling-proxy-use#54444427

Comment by TahorSuiJuris  
[_2019-01-28 at 23:08_](https://www.gkbrk.com/wiki/rust_web_scraping/#comment-feafc3e5-cc03-49bf-8f43-2645cae3ab09)  
_Spam probability: 0.0%_

Are there any new MySQL integrations with Rust that you may be aware?

### Follow me around

-   📡 [RSS](https://www.gkbrk.com/feed.xml)
-   💼 [LinkedIn](https://www.linkedin.com/in/gokberk-yaltirakli)
-   💻 [GitHub](https://github.com/gkbrk)
-   📧 [Email](mailto:website@gkbrk.com)
-   🔁 [Mastodon](https://raru.re/@leo)
-   🐦 [Twitter](https://twitter.com/0xGKBRK)

### Support my work

Thanks for checking out my website.

If you want to support me and help me produce more free content, you can buy me a coffee.

[☕ Buy me a coffee](https://www.buymeacoffee.com/gkbrk)

Get notified of new posts

 

(or use [RSS](https://www.gkbrk.com/feed.xml))

### Search

### More links

-   [Projects](https://www.gkbrk.com/projects.html)
-   [Videos](https://www.gkbrk.com/video/)
-   [List of tags](https://www.gkbrk.com/tags.html)

### Recent comments

**Guest** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-03-02

**Cheerio** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-28

**C** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-28

**Guest** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-25

**noone** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-25

**Guest** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-25

**Hotel Guest** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-25

**Vince** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-25

**JW** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-24

**Yomom** on [Reverse Engineering A Mysterious UDP Stream in My Hotel](https://www.gkbrk.com/2016/05/hotel-music/) @ 2023-02-24

This page is valid HTML. [Click to validate.](https://validator.w3.org/nu/?doc=https://www.gkbrk.com/wiki/rust_web_scraping/)

_It's not actually valid? Send me an email._

The content for this website is licensed under [CC-BY-SA-4.0](http://creativecommons.org/licenses/by-sa/4.0/).  
© 2023 Gökberk Yaltıraklı

Have you seen [the log](https://www.gkbrk.com/log/)?

![.](https://crates.io/api/v1/crates/cedict/0.3.1/download)