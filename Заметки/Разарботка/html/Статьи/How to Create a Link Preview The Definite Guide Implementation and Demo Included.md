When you add a link in chat message or share it on social networks such as Facebook, Twitter, LinkedIn, you can see a small visual preview and brief description of the link. The main benefit of link previews is that users have some expectations of what they’re going to get before they open the link.

In this blog post, we will build a solution, which turns a link:

![social media link](https://andrejgajdos.com/wp-content/uploads/2019/11/social-media-link-1024x507.png)

Into this:

![link preview result](https://andrejgajdos.com/wp-content/uploads/2019/11/link-preview-result-1024x478.png)

I released this solution as [**npm packaged**](https://www.npmjs.com/package/link-preview-generator). You can check the source code on [**Github**](https://github.com/AndrejGajdos/link-preview-generator#readme) and deployed demo on [**Heroku**](https://link-preview-generator.herokuapp.com/).

Nowadays, we can see link preview feature in almost every social network or chat application, where users can send or share url links. In this blog post, I want to share with you, how to create a link preview feature without third-party APIs. I am going to describe the whole strategy of creating link previews, including implementation using open-source libraries in node.js.

**Why I decided to write this blog post?**

When I needed to create preview link feature, I found a lot of misleading or outdated information on this topic. If I found a solution which worked, it relied on some paid third-party APIs. Hope, this article will save you a lot of time figuring out how to build this feature with open-source libraries in any back-end language.

## What should be included in a link preview?

A preview of url link usually contains the title, a description, the domain name and an image. You can create link previews even more rich by providing other information. For more details check [Bonus Tips](https://andrejgajdos.com/how-to-create-a-link-preview/#bonus_tips).

![preview link elements](https://andrejgajdos.com/wp-content/uploads/2019/11/preview-link-elements-1024x450.png)

### How to get data for a link preview?

Facebook launched Open Graph protocol in 2010, which is now managed by the Open Web Foundation. The main purpose is easier integration between Facebook and other websites. With that being said, Open Graph Protocol allows to control what information is used when a website is shared. If websites want to use Open Graph Protocol, they need to have Open Graph meta tags in the `<head>` part of the website’s code.

![og meta tags](https://andrejgajdos.com/wp-content/uploads/2019/11/og-meta-tags-1024x654.png)

Other social networks take into account Open Graph Protocol as well. However, Twitter created own tags for Twitter Cards, which are called Twitter card tags. They are based on the same conventions as the Open Graph protocol. When the Twitter card processor looks for tags on a page, it first checks for the Twitter-specific property, and if not present, falls back to the supported Open Graph property. You can find more information on [Twitter documentation](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started).

![twitter meta tags](https://andrejgajdos.com/wp-content/uploads/2019/11/twitter-meta-tags-1024x654.png)

The following Open Graph tags are used for creating link previews:

**Open Graph Title**

This tag works the same as the meta `<title>` tag. It allows you to define content’s title. If Facebook doesn’t find the `og:title` tag, it uses the meta `<title>` instead. This tag is very important, because `<title>` is usually shown in bold.

There is no limit on number of characters, but the title should be between 60-90 characters as meta title. Otherwise, it can be shortened or truncated. For example Facebook will truncate it to 88 characters.

**Open Graph Description**

This tag is again similar to meta tag description. This is where you describe website’s content. Similar rules applies to this tag as for title tag. If a social network robot cannot find `og:description` tag, it uses meta description and there is no limit on numbers of characters. In this case, you should use around 200 letters.

**Open Graph Image**

An image is probably the most eye-catching element in link preview. You can define image with `og:image` title. Recommended resolution is 1200 pixels x 627 pixels (1.91/1 ratio) and image size shouldn’t exceed 5MB.

**Open Graph Url**

This tag defines the canonical URL for your page. URL provided is not shown on Facebook newsfeed, only domain is visible.

A complete list of og tags available can be found on the [Open Graph website](https://ogp.me/).

## How to get data without meta and og tags?

There are a lot of websites without basic meta tags and og tags. What data should we preview in this case?

We can use data in document’s body.

**The Title**

If website doesn’t contain meta title tag or `og:title` tag, we can consider a heading in document’s body as main title. The most important heading in body document is `<h1>`. If website doesn’t contain `<h1>` tag, we can look for `<h2>` tags.

**The Description**

The strategy for getting website description is similar as getting the title. If document doesn’t contain meta description or `og:description`, we can consider the main text of the document as the website description.

**The Domain Name**

We will look for `<link rel="canonical">` or `og:url`. If document doesn’t contain one of these, we will use the url parameter.

**The Image**

From all of the mentioned attributes, image is the most tricky element.

**What image should represent website url, if html document doesn’t contain `og:image` tag?**

There is another way how to specify website image. There is link tag with attribute `rel=”image_src”` in the following format:

<link rel="image_src" href="image url" />

However, we can find a lot of websites without `og:image` or `<link rel="image_src">` tag. In this case, we need to parse images from document’s body.

Raymond Camden described in his [blog post](https://www.raymondcamden.com/2011/07/26/How-are-Facebook-and-Google-creating-link-previews) from 2011 how Facebook and Google+ used to determine what image should be used for link preview. Facebook used `og:image` and `<link rel="image_src">` tags and Google+ used first `<img>` tag in html body. None of these strategies seem right, because Facebook didn’t consider images in document’s body and Google+ chose the first image, which could be an image for layout.

Slack published a [blog post](https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254), how they create link previews, but they don’t consider images in html body.

Someone asked similar question on Quora:

> _How does Facebook determine which images to show as thumbnails when posting a link?_

Facebook employee answered in 2010, what’s the strategy for choosing image from html body:

> _The candidate images are filtered by javascript that removes all images less than 50 pixels in height or width and all images with a ratio of longest dimension to shortest dimension greater than 3:1. The filtered images are then sorted by area and users are given a selection if multiple images exist._

[quora.com](https://www.quora.com/How-does-Facebook-determine-which-images-to-show-as-thumbnails-when-posting-a-link)

This answer is currently not accurate, because Facebook doesn’t allow to customize link metada:

> _By removing the ability to customize link metadata (i.e. headline, description, image) from all link sharing entry points on Facebook, we are eliminating a channel that has been abused to post false news._

[developers.facebook.com](https://developers.facebook.com/blog/post/2017/06/27/API-Change-Log-Modifying-Link-Previews/)

I think described strategy works well. Images less than 50 pixels in height or width are perhaps icons, images with the aspect ratio greater than 3:1 don’t fit in previews well. Images with greater area are perhaps more important for the website content than smaller images.

## Implementation

You can find several attempts for creating a library which implements link preview feature.

There is a node.js [“solution”](https://mustansirzia.com/posts/link-preview/) on AWS Lambda. Unfortunately, the main library and it’s repository of the source code are not available anymore.

Then, you can find only solutions, which parse only meta and og tags [[1](http://www.99points.info/2010/07/facebook-like-extracting-url-data-with-jquery-ajax-php/), [2](https://www.codementor.io/codeforgeek/extract-link-information-using-nodejs-angularjs-du107t197), [3](https://github.com/e-oj/grabity), [4](https://github.com/teamSolutionAnalysts/link-preview), [5](https://github.com/sbkwgh/preview-link), [6](https://github.com/Ekito/bootstrap-linkpreview)].

> _Is there open-source code for making ‘link preview’ text and icons, like in facebook?_

[stackoverflow.com](https://stackoverflow.com/questions/4646147/is-there-open-source-code-for-making-link-preview-text-and-icons-like-in-face)

I didn’t find any open-source implementation, so let’s build one.

### Used libraries

If you want to implement the whole strategy for creating link previews, you need to use a library, which allows you to access DOM structure of html document. In node.js environment, I found three libraries, which allow accessing DOM:

-   [JSDom](https://github.com/jsdom/jsdom) simulates a web browser environment in node.js and allows you to access DOM structure
-   [Puppeteer](https://github.com/GoogleChrome/puppeteer) enables you to control headless Chrome from Node.js
-   [PhantomJS](https://phantomjs.org/) a headless web browser scriptable with JavaScript

JSDom doesn’t work well, because we need to get [visible elements](https://andrejgajdos.com/how-to-create-a-link-preview/#visible_elements) from the url and JSDom doesn’t parse css styles well [[1](https://github.com/jsdom/jsdom/issues/2160), [2](https://github.com/jsdom/jsdom/issues/1922)].

If you need to choose between Puppeteer and PhantomJS, I would recommend using Puppeteer, because PhantomJS [development stopped](https://github.com/ariya/phantomjs/issues/15344) and Puppeteer is [faster and less memory intensive](https://hackernoon.com/benchmark-headless-chrome-vs-phantomjs-e7f44c6956c).

### Configuring Puppeteer for Web Scraping

Puppeteer has a lot of options and it allows you to configure Chrome with various settings. Thus, using Puppeteer for the first time is not so straightforward. Before you open websites in Puppeteer, you should configure it to scrape data from websites.

Some websites don’t want you to scrape data. In this case, you can use [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth), which uses various techniques to make detection of headless puppeteer harder.

If you want to interact with the website in Puppeteer, you need to use [page.evaluate()](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageevaluatepagefunction-args) function, where Puppeteer runs the script in the browser not in node.js. If you have some other modules or functions, which you want to use in evaluate function, you need to use [page.exposeFunction()](https://github.com/GoogleChrome/puppeteer/blob/v1.19.0/docs/api.md#pageexposefunctionname-puppeteerfunction). Imported modules in node.js are not accessible in Puppeteer browser and `exposeFunction` allows you to expose functions into the browser.

When browser makes a request to a website, it sends a HTTP Header called “User Agent”. The User Agent contains information about web browser. Some websites don’t provide meta tags for common user agents. In Puppeteer, you can set up [Facebook crawler user agent](https://developers.facebook.com/docs/sharing/webmasters/crawler/), because in most cases websites want to provide meta data for Facebook.

### Strategy for getting individual elements for link preview

We are going to implement the following strategy in node.js, which should be applicable in every back-end language.

**The Title**

Find `og:title` in document’s header. If `og:title` doesn’t exists, find meta title tag in document’s header. If meta title doesn’t exist, find `<h1>` tag in document’s body. If `<h1>` doesn’t exist, find the first occurrence of `<h2>` tag in document body.

```js

const getTitle = async page => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1 = document.querySelector("h1").innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2 = document.querySelector("h1").innerHTML;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};
```

Source: [github.com](https://github.com/AndrejGajdos/link-preview-generator/blob/faf5ce15cecc1db978ba503d23b71d175bcf07ab/index.js#L74)

**The description**

Find `og:description` in document’s header. If `og:description` doesn’t exists, find meta description tag in document’s header. If meta description tag doesn’t exist, parse the text of the document body. Find first visible paragraph, which text is site description.

```js

const getDescription = async page => {
  const description = await page.evaluate(() => {
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription != null && ogDescription.content.length > 0) {
      return ogDescription.content;
    }
    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription != null && twitterDescription.content.length > 0) {
      return twitterDescription.content;
    }
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription != null && metaDescription.content.length > 0) {
      return metaDescription.content;
    }
    paragraphs = document.querySelectorAll("p");
    let fstVisibleParagraph = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (
        // if object is visible in dom
        paragraphs[i].offsetParent !== null &&
        !paragraphs[i].childElementCount != 0
      ) {
        fstVisibleParagraph = paragraphs[i].textContent;
        break;
      }
    }
    return fstVisibleParagraph;
  });
  return description;
};
```

Source: [github.com](https://github.com/AndrejGajdos/link-preview-generator/blob/master/index.js#L101)

**The domain name**

Find `<link rel="canonical">` or `og:url`. If document doesn't contain one of these, use the url parameter.

```js

const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};
```

Source: [github.com](https://github.com/AndrejGajdos/link-preview-generator/blob/faf5ce15cecc1db978ba503d23b71d175bcf07ab/index.js#L136)

**The Image**

Find `og:image` in document header. If `og:image` doesn’t exists, find `<link rel="image_src">` tag in header. If `<link rel="image_src">` tag doesn’t exist, find all images in document body. Remove all images less than 50 pixels in height or width and all images with a ratio of longest dimension to shortest dimension greater than 3:1. Return image with the greatest area.

```js

const util = require("util");
const request = util.promisify(require("request"));
const getUrls = require("get-urls");

const urlImageIsAccessible = async url => {
  const correctedUrls = getUrls(url);
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers["content-type"];
    return new RegExp("image/*").test(contentType);
  }
};

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]');
    if (
      twitterImg != null &&
      twitterImg.content.length > 0 &&
      (await urlImageIsAccessible(twitterImg.content))
    ) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach(img =>
        img.src.indexOf("//") === -1
          ? (img.src = `${new URL(uri).origin}/${src}`)
          : img.src
      );
      return imgs[0].src;
    }
    return null;
  });
  return img;
};
```

Source: [github.com](https://github.com/AndrejGajdos/link-preview-generator/blob/faf5ce15cecc1db978ba503d23b71d175bcf07ab/index.js#L17)

## Testing

If you want to test your link preview implementation, you can use [Facebook’s Sharing Debugger](https://developers.facebook.com/tools/debug/). This is a free tool, which scrapes any web page hosted on a public server and display how it would look when shared.

## Bonus Tips

Your link previews can be even more rich and provide more insights for users. For example, if the website contains `og:video` tag, you can replace image by video. There are other information, which you can use in previews. There are specific tags for [articles](https://ogp.me/#type_article), [books](https://ogp.me/#type_book) or [profiles](https://ogp.me/#type_profile).

Consider setting proxy or using IP rotation for your server, because some websites try to detect web scraping and block you. Some websites block users from specific countries. If you need to check more tips for avoiding web scraping detection, you can check [this](https://www.scraperapi.com/blog/5-tips-for-web-scraping) article.

## Conclusion

In this article, we described how social networks and chat applications create link previews. Then we described implementation, which can be used in any back-end language. As an example, we implemented whole solution in node.js. The result is open-source node.js [**library**](https://www.npmjs.com/package/link-preview-generator) and demo is deployed on [**Heroku**](https://link-preview-generator.herokuapp.com/).

As you can see, creating link preview feature is easy if you use the correct approach. You don’t need to rely on third-party API's and pay for similar services.