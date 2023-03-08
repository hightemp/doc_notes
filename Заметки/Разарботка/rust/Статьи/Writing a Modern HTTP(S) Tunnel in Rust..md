https://xnuter.medium.com/writing-a-modern-http-s-tunnel-in-rust-56e70d898700

# Writing a Modern HTTP(S) Tunnel in Rust.

## A step-by-step guide on how to create an async I/O app in Rust.

## Overview

This post is for anyone interested in writing performant and safe applications in Rust quickly. It walks the reader through designing and implementing an HTTP Tunnel and basic, language-agnostic, principles of creating robust, scalable, observable, and evolvable network applications.

## Rust: performance, reliability, productivity. Pick three.

About a year ago, I started to learn Rust. The first two weeks were quite painful. Nothing compiled, I didn’t know how to do basic operations, I couldn’t make a simple program run. But step by step, I started to understand what the compiler wanted. Even more, I realized that it forces the right thinking and correct behaviour.

Yes, sometimes, you have to write seemingly redundant constructs. But it’s better not to compile a correct program than to compile an incorrect one. This makes making mistakes more difficult.

Anyway, soon after, I became more or less productive and finally could do what I wanted. Well, most of the time.

Recently out of curiosity, I decided to take on a slightly more complex challenge: implement an [HTTP Tunnel](https://en.wikipedia.org/wiki/HTTP_tunnel) in Rust. It turned out to be surprisingly easy to do and took about a day, which is quite impressive. Basically, I stitched together [tokio](https://tokio.rs/), [clap](https://github.com/clap-rs/clap), [serde](https://serde.rs/), and several other very useful crates. Okay, enough of the introduction. Let me share the knowledge I gained during this exciting challenge and elaborate on why I organized the app this way. I hope you’ll enjoy it.

# What is an HTTP Tunnel?

Simply put, it’s a lightweight VPN that you can set up with your browser so your Internet provider cannot block or track your activity, and web-servers won’t see your IP address.

If you’d like, you can test it with your browser locally, e.g., with Firefox (otherwise just skip this section for now).

1.  Install the app using [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html):

$ cargo install http-tunnel

2. Start:

$ http-tunnel --bind 0.0.0.0:8080 http

You can also check the http-tunnel GitHub [repository](https://github.com/xnuter/http-tunnel) for build/installation instructions.

Now you can go to your browser and set the `HTTP Proxy` to `localhost:8080`. For instance, in [Firefox](https://support.mozilla.org/en-US/kb/connection-settings-firefox) just search for `proxy` in the preferences section:

![](https://miro.medium.com/v2/resize:fit:700/1*3JVz5hArvpZz3T0p6diBew.png)

Finding the proxy settings

and then specify it for `HTTP Proxy` and also check it for `HTTPS:`

![](https://miro.medium.com/v2/resize:fit:700/1*77Tn80rhPu5ItAeVoLkOSw.png)

Setting the proxy to just built `http_tunnel`

You can visit several web-pages and check the `./logs/application.log` file — all your traffic was going via the tunnel. For example:

![](https://miro.medium.com/v2/resize:fit:700/1*QOVnG7P0N7YGO8z3qOQG9A.png)

Okay, let’s walk through the process from the beginning.

# Design the app

Each application starts with design, which means we need to define the following:

1.  Functional requirements.
2.  Non-functional requirements.
3.  Application abstractions and components.

## Step 1. Functional requirements

We need to follow the specification outlined here: [https://en.wikipedia.org/wiki/HTTP_tunnel](https://en.wikipedia.org/wiki/HTTP_tunnel) :

Negotiate target with an `HTTP CONNECT` request. E.g., if the client wants to create a tunnel to [www.wikipedia.org,](http://www.wikipedia.org%2C/) the request will look like:

CONNECT www.wikipedia.org:443 HTTP/1.1  
...

followed by a response, e.g.

HTTP/1.1 200 OK

After this point, just relay TCP traffic both ways until one of the sides closes it, or an I/O error happens.

The HTTP Tunnel should work for both HTTP and HTTPS.

We also should be able to manage access/block targets (e.g., to block-list trackers).

## Step 2. Non-functional requirements

The service shouldn’t log any information that identifies users.

It should have high throughput and low-latency (it should be unnoticeable for users and relatively cheap to run).

Ideally, we want it to be resilient to traffic spikes, provide noisy neighbor isolation, and resist basic DDoS attacks.

Error messaging should be developer-friendly. We want the system to be observable to troubleshoot and tune it in production at a massive scale.

## Step 3. Components

When designing components, we need to first breakdown the app to a set of responsibilities. First, let’s see how our flow diagram looks like:

![](https://miro.medium.com/v2/resize:fit:484/1*4zycGeu6OZxf1AucAnqG8A.png)

To implement this, we can introduce the following main components:

1.  TCP/TLS Acceptor
2.  HTTP CONNECT Negotiator
3.  Target Connector
4.  Full-Duplex Relay

# Implementation

## TCP/TLS Acceptor

When we roughly know how to organize the app, it’s time to decide which dependencies we should use. For Rust, the best I/O library I know is [tokio](https://crates.io/crates/tokio). In the `tokio` family, there are many libraries, including `tokio-tls`, which makes things much simpler. So the [TCP acceptor code](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/main.rs#L127-L148) would look like:

And then the whole acceptor loop + launching asynchronous connection handlers would be:

Let’s break down what’s happening [here](https://github.com/xnuter/http-tunnel/blob/30b1a69db0171c5aa8834feb9d27612b6c8fac2f/src/main.rs#L132-L146). We accept a connection. If the operation was successful, use `tokio::spawn` to create a new task that will handle that connection. Memory/thread-safety management happens behind the scenes. Handling futures is hidden by `async/await` syntax sugar.

However, there is one question. `TcpStream` and `TlsStream` are different objects, but handling both is precisely the same. Can we re-use the same code? In Rust, abstraction is achieved via `Traits`, which are super handy:

The stream must implement:

-   `AsyncRead /Write`— so we can read/write it [asynchronously](https://xnuter.medium.com/distributed-systems-and-asynchronous-i-o-ef0f27655ce5)
-   `Send`— to be able to send between threads
-   `Unpin`— to be moveable (otherwise we won’t be able to do `async move` and `tokio::spawn` to create an `async` task)
-   `'static` —to denote that it may live until application shutdown and doesn’t depend on any other object’s destruction.

Which our `TCP/TLS` streams exactly are. However, now we can see that it doesn’t have to be `TCP/TLS` streams. This code would work for `UDP` or `QUIC` or `ICMP`. I.e., it can wrap any protocol within any other protocol, or itself.  
In other words, this code is reusable, extendable, and ready for migration (which happens sooner or later).

## HTTP Connect Negotiator

Let’s pause for a second and think at a higher level. What if we can abstract from HTTP Tunnel, and just need to implement a generic tunnel?

![](https://miro.medium.com/v2/resize:fit:420/1*85IWIDW1NIIkFYT6LXG_Uw.png)

1.  We need to establish some transport-level connections (L4).
2.  Negotiate a target (doesn’t really matter how: HTTP, PPv2, etc.).
3.  Establish an L4 connection to the target.
4.  Report success and start relaying data.

A target could be, for instance, another tunnel. Also, we can support different protocols. The core would stay the same.

We already saw that `tunnel_stream` method already works with any L4 `Client<->Tunnel` connection.

[Here](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/proxy_target.rs#L27-L37), we specify two abstractions:

1.  `TunnelTarget` is just something that has an `Addr` — whatever it is.
2.  `TargetConnector` — can connect to that `Addr` and needs to return a stream that supports async I/O.

Okay, but what about the target negotiation? The `tokio-utils` crate already has an abstraction for that, named `Framed` streams (with corresponding `Encoder/Decoder` traits). We need to implement them for `HTTP CONNECT` (or any other proxy protocol). You can find the implementation [here](https://github.com/xnuter/http-tunnel/blob/30b1a69db0171c5aa8834feb9d27612b6c8fac2f/src/http_tunnel_codec.rs#L48-L102).

## Relay

We only have one major component remaining — that which relays data after the tunnel negotiation is done. `tokio` provides a method to split a stream into two halves: `ReadHalf` and `WriteHalf`. We can split both client and target connections and [relay](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/tunnel.rs#L137-L164) them in both directions:

Where the `relay_data(…)` definition requires nothing more than implementing abstractions mentioned above. I.e., it can connect any two halves of a stream:

And finally, instead of a simple HTTP Tunnel, we have an [engine](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/main.rs#L186-L223) that can be used to build any type of tunnels or a chain of tunnels (e.g., for onion routing), over any transport and proxy protocols:

The [implementation](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/tunnel.rs#L121-L172) is almost trivial in basic cases, but we want our app to handle failures, and that’s the focus of the next section.

# Dealing with failures

The amount of time engineers deal with failures is proportional to the scale of a system. It’s easy to write happy-case code. Still, if it enters an irrecoverable state on the very first error, it’s painful to use. Besides that, your app will be used by other engineers, and there are very few things more irritating than cryptic/misleading error messages. If your code runs as a part of a large service, some people need to monitor and support it (e.g., SREs or DevOps), and it should be a pleasure for them to deal with your service.

What kind of failures may an HTTP Tunnel encounter?

It’s a good idea to enumerate all error codes that your app returns to the client. So it’s clear why a request failed if the operation can be tried again (or shouldn’t), if it’s an integration bug or just network noise.

Dealing with delays is crucial for a network app. If your operations don’t have timeouts, it’s a matter of time until all of your threads will be [Waiting for Godot](https://en.wikipedia.org/wiki/Waiting_for_Godot), or your app will exhaust all available resources and become unavailable. Here we delegate timeout definition to `RelayPolicy`:

Relay policy can be configured like this:

relay_policy:  
  idle_timeout: 10s  
  min_rate_bpm: 1000  
  max_rate_bps: 10000  
  max_lifetime_:_ 100s  max_total_payload_:_ 100mb

So we can limit activity per connection with `max_rate_bps` and detecting idle clients with `min_rate_bpm` (so they don’t consume system resources than can be utilized more productively). A connection lifetime and total traffic may be bounded as well.

It goes without saying that each failure mode needs to be [tested](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/relay.rs#L389-L536). It’s straightforward to do that in Rust in general and with `tokio-test` in particular:

The same goes for I/O errors:

## Logging and metrics

I haven’t seen an application that failed only in ways anticipated by its developers. I’m not saying there are no such applications. Still, chances are that your app is going to encounter something you didn’t expect: data races, specific traffic patterns, dealing with traffic bursts, legacy clients.

But probably one of the most common types of failures is human failures, such as pushing bad code or configuration, which are inevitable in large projects. Anyway, we need to be able to deal with something we didn’t foresee. So we emit enough information that would allow us to detect failures and troubleshoot.

So we’d better log every error and important events with meaningful information and relevant context as well as statistics.

Please note the `tunnel_ctx: TunnelCtx` field, which can be used to correlate metric records with log messages:

error!(  
    "{} failed to write {} bytes. Err = {:?}, **CTX={}**",  
    self.name, n, e, **self.tunnel_ctx**  
);

# Configuration and parameters

Last but not least. We’d like to be able to run our tunnel in different modes with different parameters. Here’s where `serde` and `clap` become handy.

In my opinion, `clap` makes [dealing with command line parameters](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/configuration.rs#L59) pleasant. Extraordinarily expressive and easy to maintain.

[Configuration](https://github.com/xnuter/http-tunnel/blob/master/config/config.yaml) files can be easily handled with `serde-yaml`:

target_connection:  
  dns_cache_ttl: 60s  
  allowed_targets: "(?i)(wikipedia|rust-lang)\\.org:443$"  
  connect_timeout: 10s  
  relay_policy:  
    idle_timeout: 10s  
    min_rate_bpm: 1000  
    max_rate_bps: 10000

Which just corresponds to Rust [structs](https://github.com/xnuter/http-tunnel/blob/997570b8a2b237cd9d55562780c053c91b596d5f/src/configuration.rs#L18-L40):

It doesn’t need any additional comments to make it readable and maintainable, and that is beautiful.

# Conclusion

As you could see from this quick overview, the Rust ecosystem already provides many building blocks so you can focus on _what_ you need to do rather than _how_. You didn’t see any memory/resources management or explicit thread-safety (which often comes at the expense of concurrency) with impressive [performance](https://github.com/xnuter/perf-gauge/wiki/Benchmarking-TCP-Proxies-written-in-different-languages:-C,-CPP,-Rust,-Golang,-Java,-Python). Abstraction mechanisms are fantastic, so your code can be highly reusable. This task was a lot of fun, so I’ll try to take on the next challenge.