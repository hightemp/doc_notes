https://www.sitepoint.com/rust-global-variables/

# How to Idiomatically Use Global Variables in Rust

**Declaring and using global variables in Rust can be tricky. Typically for this language, Rust ensures robustness by forcing us to be very explicit.**

In this article, I’ll discuss the pitfalls the Rust compiler wants to save us from. Then I’ll show you the best solutions available for different scenarios.

## Overview

There are many options for implementing global state in Rust. If you’re in a hurry, here’s a quick overview of my recommendations.

![A Flowchart for finding the best solution for global variables](https://uploads.sitepoint.com/wp-content/uploads/2021/06/1624192569flowchart.png)

You can jump to specific sections of this article via the following links:

-   No globals: [Refactor to Arc / Rc](https://www.sitepoint.com/rust-global-variables/#refactortheexample)
-   Compile-time initialized globals: [const T / static T](https://www.sitepoint.com/rust-global-variables/#whenthevalueisknownatcompiletime)
-   Use an external library for easy runtime initialized globals: [lazy_static / once_cell](https://www.sitepoint.com/rust-global-variables/#externallibraries)
-   Implement your own runtime initialization: [std::sync::Once + static mut T](https://www.sitepoint.com/rust-global-variables/#multithreadedglobalswithruntimeinitialization)
-   Specialized case for single-threaded runtime initialization: [thread_local](https://www.sitepoint.com/rust-global-variables/#singlethreadedglobalswithruntimeinitialization)

## A Naive First Attempt at Using Global Variables in Rust

Let’s start with an example of how not to use global variables. Assume I want to store the starting time of the program in a global string. Later, I want to access the value from multiple threads.

A Rust beginner might be tempted to declare a global variable exactly like any other variable in Rust, using `let`. The full program could then look like this:

```rust
use chrono::Utc;

let START_TIME = Utc::now().to_string();

pub fn main() {
    let thread_1 = std::thread::spawn(||{
        println!("Started {}, called thread 1 {}", START_TIME.as_ref().unwrap(), Utc::now());
    });
    let thread_2 = std::thread::spawn(||{
        println!("Started {}, called thread 2 {}", START_TIME.as_ref().unwrap(), Utc::now());
    });

    // Join threads and panic on error to show what went wrong
    thread_1.join().unwrap();
    thread_2.join().unwrap();
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=51f73323b3d86ebbb1a89376d9235850)!

This is invalid syntax for Rust. The `let` keyword can’t be used in the global scope. We can only use `static` or `const`. The latter declares a true constant, not a variable. Only `static` gives us a global variable.

The reasoning behind this is that `let` allocates a variable on the stack, at runtime. Note that this remains true when allocating on the heap, as in `let t = Box::new();`. In the generated machine code, there is still a pointer into the heap which gets stored on the stack.

Global variables are stored in the [data segment](https://en.wikipedia.org/wiki/Data_segment) of the program. They have a fixed address that doesn’t change during execution. Therefore, the [code segment](https://en.wikipedia.org/wiki/Data_segment#Text) can include constant addresses and requires no space on the stack at all.

Okay, so we can understand why we need a different syntax. Rust, as a modern systems programming language, wants to be very explicit about memory management.

Let’s try again with `static`:

```rust
use chrono::Utc;

static START_TIME: String = Utc::now().to_string();

pub fn main() {
    // ...
}
```

The compiler isn’t happy, yet:

```rust
error[E0015]: calls in statics are limited to constant functions, tuple structs and tuple variants
 --> src/main.rs:3:24
  |
3 | static start: String = Utc::now().to_string();
  |                        ^^^^^^^^^^^^^^^^^^^^^^
```

Hm, so the initialization value of a static variable can’t be computed at runtime. Then maybe just let it be uninitialized?

```rust
use chrono::Utc;

static START_TIME;

pub fn main() {
    // ...
}
```

This yields a new error:

```rust
Compiling playground v0.0.1 (/playground)
error: free static item without body
 --> src/main.rs:21:1
  |
3 | static START_TIME;
  | ^^^^^^^^^^^^^^^^^-
  |                  |
  |                  help: provide a definition for the static: `= <expr>;`
```

So that doesn’t work either! All static values must be fully initialized and valid before any user code runs.

If you’re coming over to Rust from another language, such as JavaScript or Python, this might seem unnecessarily restrictive. But any C++ guru can tell you stories about the [static initialization order fiasco](https://en.cppreference.com/w/cpp/language/siof), which can lead to an undefined initialization order if we’re not careful.

For example, imagine something like this:

```rust
static A: u32 = foo();
static B: u32 = foo();
static C: u32 = A + B;

fn foo() -> u32 {
    C + 1
}

fn main() {
    println!("A: {} B: {} C: {}", A, B, C);
}
```

In this code snippet, there’s no safe initialization order, due to circular dependencies.

If it were C++, which doesn’t care about safety, the result would be `A: 1 B: 1 C: 2`. It zero-initializes before any code runs and then the order is defined from top-to-bottom within each compilation unit.

At least it’s defined what the result is. However, the “fiasco” starts when the static variables are from different `.cpp` files, and therefore different compilation units. Then the order is undefined and usually depends on the order of the files in the compilation command line.

In Rust, zero-initializing is not a thing. After all, zero is an invalid value for many types, such as `Box`. Furthermore, in Rust, we don’t accept weird ordering issues. As long as we stay away from `unsafe`, the compiler should only allow us to write sane code. And that’s why the compiler prevents us from using straightforward runtime initialization.

But can I circumvent initialization by using `None`, the equivalent of a null-pointer? At least this is all in accordance with the Rust type system. Surely I can just move the initialization to the top of the main function, right?

```rust
static mut START_TIME: Option<String> = None;

pub fn main() {
    START_TIME = Some(Utc::now().to_string());
    // ...
}
```

Ah, well, the error we get is…

```rust
error[E0133]: use of mutable static is unsafe and requires unsafe function or block
  --> src/main.rs:24:5
  |
6 |     START_TIME = Some(Utc::now().to_string());
  |     ^^^^^^^^^^ use of mutable static
  |
  = note: mutable statics can be mutated by multiple threads: aliasing violations or data races will cause undefined behavior
```

At this point, I could wrap it in an `unsafe{...}` block and it would work. Sometimes, this is a valid strategy. Maybe to test if the remainder of the code works as expected. But it’s not the idiomatic solution I want to show you. So let’s explore solutions that are guaranteed to be safe by the compiler.

[![Coding Assessments](https://cdn.sanity.io/images/708bnrs8/production/d180ba38e23695957375f9440f3800f8eb941d5e-766x314.png?w=766&h=314&auto=format)](https://featured.sitepoint.com/coding-assessments?utm_source=blog&utm_campaign=article-banner&ref_source=article-banner)

## Refactor the Example

You may already have noticed that this example doesn’t require global variables at all. And more often than not, if we can think of a solution without global variables, we should avoid them.

The idea here is to put the declaration inside the main function:

```rust
pub fn main() {
    let start_time = Utc::now().to_string();
    let thread_1 = std::thread::spawn(||{
        println!("Started {}, called thread 1 {}", &start_time, Utc::now());
    });
    let thread_2 = std::thread::spawn(||{
        println!("Started {}, called thread 2 {}", &start_time, Utc::now());
    });

    // Join threads and panic on error to show what went wrong
    thread_1.join().unwrap();
    thread_2.join().unwrap();
}
```

The only problem is the borrow-checker:

```rust
error[E0373]: closure may outlive the current function, but it borrows `start_time`, which is owned by the current function
  --> src/main.rs:42:39
   |
42 |     let thread_1 = std::thread::spawn(||{
   |                                       ^^ may outlive borrowed value `start_time`
43 |         println!("Started {}, called thread 1 {}", &start_time, Utc::now());
   |                                                     ---------- `start_time` is borrowed here
   |
note: function requires argument type to outlive `'static`
```

This error is not exactly obvious. The compiler is telling us that the spawned thread may live longer than the value `start_time`, which lives in the stack frame of the main function.

Technically, we can see that this is impossible. The threads are joined, thus the main thread won’t exit before the child threads have finished.

But the compiler isn’t smart enough to figure out this particular case. In general, when a new thread is spawned, the provided closure can only borrow items with a static lifetime. In other words, the borrowed values must be alive for the full program lifetime.

For anyone just learning about Rust, this could be the point where you want to reach out to global variables. But there are at least two solutions that are much easier than that. The simplest is to clone the string value and then move ownership of the strings into the closures. Of course, that requires an extra allocation and some extra memory. But in this case, it’s just a short string and nothing performance-critical.

But what if it was a much larger object to share? If you don’t want to clone it, wrap it behind a reference-counted smart pointer. [Rc](https://doc.rust-lang.org/std/rc/struct.Rc.html) is the single-threaded reference-counted type. [Arc](https://doc.rust-lang.org/std/sync/struct.Arc.html) is the atomic version that can safely share values between threads.

So, to satisfy the compiler, we can use `Arc` as follows:

```rust
/* Final Solution */
pub fn main() {
    let start_time = Arc::new(Utc::now().to_string());
    // This clones the Arc pointer, not the String behind it
    let cloned_start_time = start_time.clone();
    let thread_1 = std::thread::spawn(move ||{
        println!("Started {}, called thread 1 {}", cloned_start_time, Utc::now());
    });
    let thread_2 = std::thread::spawn(move ||{
        println!("Started {}, called thread 2 {}", start_time, Utc::now());
    });

    // Join threads and panic on error to show what went wrong
    thread_1.join().unwrap();
    thread_2.join().unwrap();
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=d2f6ba289c511d6708879409f632541d)!

This has been a quick rundown on how to share state between threads while avoiding global variables. Beyond what I’ve shown you so far, you might also need [interior mutability](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html) to modify the shared state. Full coverage of interior mutability is outside the scope of this article. But in this particular example, I would pick `Arc<Mutex<String>>` to add thread-safe interior mutability to `start_time`.

## When the Global Variable Value Is Known at Compile Time

In my experience, the most common use cases for global state are not variables but constants. In Rust, they come in two flavors:

-   Constant values, defined with `const`. These are inlined by the compiler. Interior mutability is never allowed.
-   Static variables, defined with `static`. They receive a fixed space in the data segment. Interior mutability is possible.

Both of them can be initialized with [compile-time constants](https://doc.rust-lang.org/std/keyword.const.html#compile-time-constants). These could be simple values, such as `42` or `"hello world"`. Or it could be an expression involving several other compile-time constants and functions marked as `const`. As long as we avoid circular dependencies. (You can find more details on constant expressions in [The Rust Reference](https://doc.rust-lang.org/reference/const_eval.html).)

```rust
use std::sync::atomic::AtomicU64;
use std::sync::{Arc,Mutex};

static COUNTER: AtomicU64 = AtomicU64::new(TI_BYTE);

const GI_BYTE: u64 = 1024 * 1024 * 1024;
const TI_BYTE: u64 = 1024 * GI_BYTE;
```

Usually, `const` is the better choice — unless you need interior mutability, or you specifically want to avoid inlining.

Should you require interior mutability, there are several options. For most primitives, there’s a corresponding atomic variant available in [std::sync::atomic](https://doc.rust-lang.org/std/sync/atomic/). They provide a clean API to load, store, and update values atomically.

In the absence of atomics, the usual choice is a lock. Rust’s standard library offers a [read-write lock](https://doc.rust-lang.org/std/sync/struct.RwLock.html) (`RwLock`) and a [mutual exclusion lock](https://doc.rust-lang.org/std/sync/struct.Mutex.html) (`Mutex`).

However, if you need to calculate the value at runtime, or need heap-allocation, then `const` and `static` are of no help.

[![Build Your Own Developer Portfolio](https://cdn.sanity.io/images/708bnrs8/production/651c75b1c729fdf1705fe27681229cf23f3943d8-768x260.png?w=768&h=260&auto=format)](https://www.sitepoint.com/premium/books/build-your-own-developer-portfolio-in-react/?ref_source=bpp)

## Single-threaded Global Variables in Rust with Runtime Initialization

Most applications I write only have a single thread. In that case, a locking mechanism isn’t necessary.

However, we shouldn’t use `static mut` directly and wrap accesses in `unsafe`, just because there’s only one thread. This way, we could end up with serious memory corruption.

For example, borrowing unsafely from the global variable could give us multiple mutable references simultaneously. Then we could use one of them to iterate over a vector and another to remove values from the same vector. The iterator could then go beyond the valid memory boundary, a potential crash that safe Rust would have prevented.

But the standard library has a way to “globally” store values for safe access within a single thread. I’m talking about [thread locals](https://doc.rust-lang.org/std/thread/struct.LocalKey.html). In the presence of many threads, each thread gets an independent copy of the variable. But in our case, with a single thread, there’s only one copy.

Thread locals are created with the `thread_local!` macro. Accessing them requires the use of a closure, as shown in the following example:

```rust
use chrono::Utc;

thread_local!(static GLOBAL_DATA: String = Utc::now().to_string());

fn main() {
    GLOBAL_DATA.with(|text| {
        println!("{}", *text);
    });
}
```

It’s not the simplest of all solutions. But it allows us to perform arbitrary initialization code, which will run just in time when the first access to the value occurs.

Thread-locals are really good when it comes to interior mutability. Unlike all the other solutions, it doesn’t require [Sync](https://doc.rust-lang.org/std/marker/trait.Sync.html). This allows using [RefCell](https://doc.rust-lang.org/std/cell/struct.RefCell.html) for interior mutability, which avoids the locking overhead of [Mutex](https://doc.rust-lang.org/std/sync/struct.Mutex.html).

The absolute performance of thread-locals is highly dependent on the platform. But I did some [quick tests on my own PC](https://github.com/jakmeier/globals-in-rust/blob/main/globals_benchmarks/summary.md) comparing it to interior mutability relying on locks and found it to be 10x faster. I don’t expect the result to be flipped on any platform, but make sure to run your own benchmarks if you deeply care about performance.

Here’s an example of how to use `RefCell` for interior mutability:

```rust
thread_local!(static GLOBAL_DATA: RefCell<String> = RefCell::new(Utc::now().to_string()));

fn main() {
    GLOBAL_DATA.with(|text| {
        println!("Global string is {}", *text.borrow());
    });

    GLOBAL_DATA.with(|text| {
        *text.borrow_mut() = Utc::now().to_string();
    });

    GLOBAL_DATA.with(|text| {
        println!("Global string is {}", *text.borrow());
    });
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=b14e53d011da0b9300ffbadc83dfa535)!

As a side note, even though threads in WebAssembly are different from threads on an x86_64 platform, this pattern with `thread_local!` + `RefCell` is also applicable when compiling Rust to run in the browser. Using an approach that’s safe for multi-threaded code would be overkill in that case. (If the idea of running Rust inside the browser is new to you, feel free to read a previous article I wrote called “[Rust Tutorial: An Introduction to Rust for JavaScript Devs](https://www.sitepoint.com/rust-tutorial-introduction-javascript-devs/)”.)

One caveat about thread-locals is that their implementation depends on the platform. Usually, this is nothing you’d notice, but be aware that the [drop-semantics are platform-dependent](https://doc.rust-lang.org/std/thread/struct.LocalKey.html#platform-specific-behavior) because of that.

All that said, the solutions for multi-threaded globals obviously also work for the single-threaded cases. And without interior mutability, those seem to be just as fast as thread-locals.

So let’s have a look at that next.

## Multi-threaded Global Variables with Runtime Initialization

The standard library currently has no great solution for safe global variables with runtime initialization. However, using [std::sync::Once](https://doc.rust-lang.org/std/sync/struct.Once.html), it’s possible to build something that uses `unsafe` safely, if you know what you’re doing.

The [example in the official documentation](https://doc.rust-lang.org/std/sync/struct.Once.html#examples-1) is a good starting point. Should you also need interior mutability, you’d have to combine that approach with a read-write lock or a mutex. Here’s how that might look:

```rust
static mut STD_ONCE_COUNTER: Option<Mutex<String>> = None;
static INIT: Once = Once::new();

fn global_string<'a>() -> &'a Mutex<String> {
    INIT.call_once(|| {
        // Since this access is inside a call_once, before any other accesses, it is safe
        unsafe {
            *STD_ONCE_COUNTER.borrow_mut() = Some(Mutex::new(Utc::now().to_string()));
        }
    });
    // As long as this function is the only place with access to the static variable,
    // giving out a read-only borrow here is safe because it is guaranteed no more mutable
    // references will exist at this point or in the future.
    unsafe { STD_ONCE_COUNTER.as_ref().unwrap() }
}
pub fn main() {
    println!("Global string is {}", *global_string().lock().unwrap());
    *global_string().lock().unwrap() = Utc::now().to_string();
    println!("Global string is {}", *global_string().lock().unwrap());
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=54b65ae08be815dcbe8515d3890af86f)!

If you’re looking for something simpler, I can highly recommend one of two crates, which I’ll discuss in the next section.

[![Coding Assessments](https://cdn.sanity.io/images/708bnrs8/production/d180ba38e23695957375f9440f3800f8eb941d5e-766x314.png?w=766&h=314&auto=format)](https://featured.sitepoint.com/coding-assessments?utm_source=blog&utm_campaign=article-banner&ref_source=article-banner)

## External Libraries for Managing Global Variables in Rust

Based on popularity and personal taste, I want to recommend two libraries that I think are the best choice for easy global variables in Rust, as of 2021.

[Once Cell](https://crates.io/crates/once_cell) is currently considered for the standard library. (See this [tracking issue](https://github.com/rust-lang/rust/issues/74465).) If you’re on a nightly compiler, you can already use the unstable API for it by adding `#![feature(once_cell)]` to your project’s `main.rs`.

Here’s an example using `once_cell` on a stable compiler, with the extra dependency:

```rust
use once_cell::sync::Lazy;

static GLOBAL_DATA: Lazy<String> = Lazy::new(||Utc::now().to_string());

fn main() {
    println!("{}", *GLOBAL_DATA);
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=da7b3377df1c0cf522ce36e4466bf510)!

Finally, there’s also [Lazy Static](https://crates.io/crates/lazy_static), currently the most popular crate for initialization of global variables. It uses a macro with a small syntax extension (`static ref`) to define global variables.

Here’s the same example again, translated from `once_cell` to `lazy_static`:

```rust
#[macro_use]
extern crate lazy_static;

lazy_static!(
    static ref GLOBAL_DATA: String = Utc::now().to_string();
);

fn main() {
    println!("{}", *GLOBAL_DATA);
}
```

Try it for yourself on the [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=e3a938e2d286620c48316de06d6ef7da)!

The decision between `once_cell` and `lazy_static` essentially boils down to which syntax you like better.  
Also, both support interior mutability. Just wrap the `String` in a `Mutex` or `RwLock`.

## Conclusion

These have been all the (sensible) ways to implement global variables in Rust that I’m aware of. I wish it were simpler. But global state is inherently complex. In combination with Rust’s memory safety guarantees, a simple catch-them-all solution seems to be impossible. But I hope this write-up has helped you to see through the plethora of available options.

In general, the Rust community tends to give maximum power to the user — which makes things more complicated as a side-effect.

It can be hard to keep track of all the details. As a result, I spend a lot of my free time playing around with Rust features to explore the possibilities. In the process, I usually implement smaller or larger hobby projects — such as video games — and upload them to [my GitHub profile](https://github.com/jakmeier). Then, if I find something interesting in my experimentation with the language, I write about it on my [private blog](https://www.jakobmeier.ch/). Check that out if you’d like to read more in-depth Rust content!