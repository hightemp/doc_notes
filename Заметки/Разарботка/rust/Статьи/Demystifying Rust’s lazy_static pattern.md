https://blog.logrocket.com/rust-lazy-static-pattern/

# Demystifying Rust’s `lazy_static` pattern

Static data is a fundamental concept in computer programming, referring to data that is stored in the global memory space and persists for the entire lifetime of a program. In Rust, static data is used to store values that are shared among all threads in a program and are guaranteed to be initialized before use. However, there are various forms of static data in Rust, and one of them is called `lazy_static`.

`lazy_static` is a pattern in Rust where a value is only initialized when it is first accessed. This is in contrast to regular static data, which is initialized at compile time, and lazily initialized statics, which are initialized on the first thread-safe access. Lazy static values are initialized in a thread-safe manner and can be used to store global variables or shared constant data.

In this article, we will explore the concept of `lazy_static` in Rust and its various uses. We will look at how `lazy_static` works, the advantages and disadvantages of using it, and some practical examples of how it can be used in Rust projects.

We’ll cover:

-   [How `lazy_static` works](https://blog.logrocket.com/rust-lazy-static-pattern/#how-lazy-static-works)
-   [Uses of `lazy_static`](https://blog.logrocket.com/rust-lazy-static-pattern/#uses-lazy-static)
    -   [Thread-safe global variables](https://blog.logrocket.com/rust-lazy-static-pattern/#thread-safe-global-variables)
    -   [Shared constant data](https://blog.logrocket.com/rust-lazy-static-pattern/#shared-constant-data)
    -   [Performance optimization](https://blog.logrocket.com/rust-lazy-static-pattern/#performance-optimization)
-   [Advantages and disadvantages of using `lazy_static`](https://blog.logrocket.com/rust-lazy-static-pattern/#advantages-disadvantages-using-lazy-static)
-   [Alternatives to `lazy_static`](https://blog.logrocket.com/rust-lazy-static-pattern/#alternatives-lazy-static)
-   [Differences between `lazy_static`, `OnceCell`, and `LazyLock`](https://blog.logrocket.com/rust-lazy-static-pattern/#differences-between-lazy-static-oncecell-lazylock)

## How `lazy_static` works

To use `lazy_static` in Rust, you need to include the `lazy_static` crate in your project. This crate provides a macro called `lazy_static!` that allows you to define a `lazy_static` variable. Here’s an example of how to declare a `lazy_static` variable:

use lazy_static::lazy_static;

lazy_static! {
    static ref MY_VAR: String = "some value".to_string();
}

As you can see, the `lazy_static!` macro takes a block of code that defines `lazy_static`. In this case, we are defining a static variable called `MY_VAR` that is of type `String` and initialized with the value `"some value"`.

When `MY_VAR` is first accessed, it will be initialized with the value `"some value"`. Subsequent accesses will return the initialized value without re-initializing it. This is what makes `lazy_static` values different from regular static data, which is initialized at compile time and cannot be changed at runtime.

To access a `lazy_static` value, you can use the same syntax as you would for any other static variable. For example:

fn main() {
    println!("My lazy static value is: {}", *MY_VAR);
}

It’s important to note that `lazy_static` values are stored in the heap rather than the stack. This means that they are subject to the same rules as heap-allocated data, such as needing to be deallocated when they are no longer needed. However, because `lazy_static` values are only initialized once and are shared among all threads, they can be accessed efficiently without the need for repeated allocation and deallocation.

## Using `lazy_static` in Rust

Now that we’ve seen how `lazy_static` works, let’s explore some of the ways it can be used in Rust projects.

### Thread-safe global variables

One of the main benefits of using `lazy_static` is the ability to store thread-safe global variables. Because lazy static values are initialized in a thread-safe manner, they can be safely accessed from multiple threads without the need for additional synchronization. This can be especially useful in cases where you want to avoid the overhead of locking and unlocking shared resources.

For example, consider a program that has multiple threads that need to access a shared counter variable. Without `lazy_static`, you would need to use a mutex to synchronize access to the counter:

use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
    println!("Result: {}", *counter.lock().unwrap());
}

In this example, we use an Arc (atomic reference count) and a mutex to synchronize access to `counter`. This works fine, but it adds overhead to the program in the form of locking and unlocking the mutex every time the counter is accessed.

Alternatively, we can use `lazy_static` to store the counter as a global variable and avoid the need for synchronization:

use lazy_static::lazy_static;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

lazy_static! {
    static ref COUNTER: AtomicUsize = AtomicUsize::new(0);
}

fn main() {
    let mut handles = Vec::new();

    for _ in 0..10 {
        let handle = thread::spawn(|| {
            COUNTER.fetch_add(1, Ordering::SeqCst);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", COUNTER.load(Ordering::SeqCst));
}

In this example, we use `AtomicUsize` as the `lazy_static` variable to store the counter. This allows us to perform atomic operations on the counter, such as `fetch_add`, which increments the `counter` by a given value in a thread-safe manner. Because the counter is stored as a global variable and accessed through the `lazy_static` macro, we don’t need to worry about synchronization or the overhead of locking and unlocking a mutex.

---

[

![](https://blog.logrocket.com/wp-content/uploads/2022/11/Screen-Shot-2022-09-22-at-12.55.13-PM.png)

## Over 200k developers use LogRocket to create better digital experiences

![](https://blog.logrocket.com/wp-content/uploads/2022/08/rocket-button-icon.png)Learn more →





](https://lp.logrocket.com/blg/learn-more)

---

### Shared constant data

Lazy static is also useful for storing shared constant data. Because the value is only initialized once, it can be accessed efficiently without the need for repeated computation. This can improve the performance of your program, especially if the value is expensive to compute.

For example, consider a program that needs to compute the value of pi to a high degree of accuracy. This can be a computationally expensive task, especially if the program needs to compute the value of pi multiple times. To avoid this overhead, we can use `lazy_static` to store the computed value of pi as a global constant:

use lazy_static::lazy_static;

lazy_static! {
    static ref PI: f64 = compute_pi();
}

fn compute_pi() -> f64 {
    // expensive computation to determine the value of pi
    3.14159265358979323846
}

fn main() {
    println!("The value of pi is: {}", *PI);
}

In this example, the value of pi is only computed once when the `lazy_static` variable is first accessed. Subsequent accesses to the value of pi will return the initialized value without re-computing it. This can improve the performance of the program by avoiding the need to perform the expensive computation of pi multiple times.

### Performance optimization

In addition to storing thread-safe global variables and shared constant data, `lazy_static` can also be used as a performance optimization technique in Rust. By avoiding the initialization of data until it is actually needed, `lazy_static` can help reduce the memory and computational overhead of a program.

For example, consider a program that has a large data structure that is only needed in certain circumstances. Without `lazy_static`, we might initialize the data structure at the beginning of the program, even if it is not needed for the majority of the program’s execution:

fn main() {
    let data = initialize_data();

    if condition {
        use_data(&data);
    }
}

fn initialize_data() -> Vec<i32> {
    // expensive operation to initialize data structure
    vec![1, 2, 3, 4, 5]
}

fn use_data(data: &Vec<i32>) {
    // use the data structure
}

In this example, the data structure is initialized at the beginning of the program, even if it is not needed. This can be wasteful if the data structure is large and the condition is not met, as it adds unnecessary memory and computational overhead to the program.

To avoid this overhead, we can use `lazy_static` to delay the initialization of the data structure until it is actually needed:

use lazy_static::lazy_static;

lazy_static! {
    static ref DATA: Vec<i32> = initialize_data();
}

fn main() {
    if condition {
        use_data(&*DATA);
    }
}

fn initialize_data() -> Vec<i32> {
    // expensive operation to initialize data structure
    vec![1, 2, 3, 4, 5]
}

fn use_data(data: &Vec<i32>) {
    // use the data structure
}

In this example, the data structure is only initialized when the condition is met and the `DATA` variable is accessed. This can help reduce the memory and computational overhead of the program by avoiding the unnecessary initialization of the data structure.

## Advantages and disadvantages of using `lazy_static`

While `lazy_static` can be a useful tool in Rust, it is important to understand both the advantages and disadvantages of using it.

One of the main advantages of `lazy_static` is the ability to store thread-safe global variables and shared constant data. As we saw in the previous examples, `lazy_static` can help improve the performance of a program by avoiding the overhead of synchronization and repeated computation. It is also relatively simple to use, with a straightforward syntax that is easy to understand.

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

However, there are also some limitations to using `lazy_static`. One potential issue is the possibility of initialization race conditions, where multiple threads may try to initialize the same `lazy_static` value simultaneously. To avoid this, you can use the `once_cell` crate, which provides a thread-safe cell that can only be initialized once.

Another disadvantage of `lazy_static` is the added complexity it introduces to a program. By using it, you are adding an additional layer of abstraction to your program that may not be immediately obvious to other developers. This can make it more difficult to understand and debug the program, especially if you are not familiar with the `lazy_static` crate.

## Alternatives to `lazy_static`

As mentioned earlier, one potential issue with `lazy_static` is the possibility of initialization race conditions, where multiple threads may try to initialize the same `lazy_static` value simultaneously. To avoid this, we can use the `once_cell` crate, which provides a thread-safe cell that can only be initialized once.

### `once_cell` **crate**

The `once_cell` crate provides a type called `OnceCell`, which is a container for a single value that can only be initialized once. Once a value has been initialized in `OnceCell`, it can be safely accessed from multiple threads without the need for additional synchronization.

Here’s an example of how to use `OnceCell` in Rust:

use once_cell::sync::OnceCell;

static DATA: OnceCell<Vec<i32>> = OnceCell::new();

fn main() {
    let data = DATA.get_or_init(|| vec![1, 2, 3, 4, 5]);
    println!("Data: {:?}", data);
}

In this example, we use the `get_or_init` method of `OnceCell` to initialize the `DATA` variable with the value of a vector of integers. If `DATA` has already been initialized, `get_or_init` will simply return the initialized value. This ensures that `DATA` is only initialized once, even if it is accessed from multiple threads.

### `LazyLock` **crate**

Another alternative to `lazy_static` is `LazyLock`, which is a crate that provides a thread-safe lazy initializer. Like `lazy_static`, `LazyLock` allows you to define a value that is only initialized when it is first accessed. However, unlike `lazy_static`, `LazyLock` uses a lock to synchronize access to the value, ensuring that it is only initialized once, even in the presence of multiple threads.

Here’s an example of how to use `LazyLock` in Rust:

use lazy_lock::LazyLock;

lazy_lock::lazy_lock! {
    static DATA: Vec<i32> = vec![1, 2, 3, 4, 5];
}

fn main() {
    let data = DATA.lock().unwrap();
    println!("Data: {:?}", data);
}

In this example, we use the `lazy_lock!` macro to define a `LazyLock` variable called `DATA`. When the `DATA` variable is accessed, it is locked using a mutex to ensure that it is only initialized once. This helps to avoid initialization race conditions and allows `DATA` to be safely accessed from multiple threads.

## Differences between `lazy_static`, `OnceCell`, and `LazyLock`

One key difference between these variables is the way that they handle initialization race conditions. `lazy_static` does not provide any synchronization mechanisms, so it is possible for multiple threads to try to initialize the same `lazy_static` value simultaneously. This can lead to race conditions and undefined behavior. On the other hand, both `OnceCell` and `LazyLock` use synchronization mechanisms to ensure that values are only initialized once, even in the presence of multiple threads.

Another difference is the level of control you have over the initialization process. With `lazy_static`, you define the initialization value using a macro, and the value is automatically initialized when it is first accessed. With `OnceCell`, you have more control over the initialization process, as you can specify a closure that is called to initialize the value if it has not already been initialized. This can be useful if the initialization process is more complex or involves expensive computation. `LazyLock` also allows you to specify a closure for initialization, similar to `OnceCell`.

In terms of performance, `lazy_static` may have an advantage over the other two options due to the lack of synchronization overhead. Because `lazy_static` does not use locks or other synchronization mechanisms, it can potentially be faster than `OnceCell` and `LazyLock` in some cases. However, it is important to note that this will depend on the specific use case and the overhead of the initialization process.

Overall, the choice between `lazy_static`, `OnceCell`, and `LazyLock` will depend on your specific needs and the requirements of your program. If you need to store a thread-safe global variable or shared constant data and are willing to accept the potential risks of initialization race conditions, then `lazy_static` may be a good choice. On the other hand, if you need to ensure that values are only initialized once and are willing to accept the added overhead of synchronization, then `OnceCell` or `LazyLock` may be a better fit.

## Conclusion

In conclusion, `lazy_static` is a useful tool in Rust for storing thread-safe global variables and shared constant data. It can improve the performance of your program by avoiding repeated computation and the overhead of locking and unlocking shared resources. However, it is important to be aware of the potential for initialization race conditions and use the appropriate measures to avoid them.

Overall, whether or not to use `lazy_static` in a Rust program is a trade-off between the benefits of improved performance and the added complexity it introduces. If you are working on a project that requires thread-safe global variables or shared constant data, then `lazy_static` may be a useful tool to consider. On the other hand, if you are working on a simple program where the benefits of `lazy_static` are not necessary, then it may be best to stick with regular static data.

As with any programming tool, it is important to understand the capabilities and limitations of `lazy_static` and use it appropriately in your projects. By demystifying the concept of `lazy_static` and its uses, we can make informed decisions about when and how to use it in our Rust programs.

## [LogRocket](https://lp.logrocket.com/blg/rust-signup): Full visibility into web frontends for Rust apps

Debugging Rust applications can be difficult, especially when users experience issues that are difficult to reproduce. If you’re interested in monitoring and tracking performance of your Rust apps, automatically surfacing errors, and tracking slow network requests and load time, [try LogRocket](https://lp.logrocket.com/blg/rust-signup). [![LogRocket Dashboard Free Trial Banner](https://blog.logrocket.com/wp-content/uploads/2017/03/1d0cd-1s_rmyo6nbrasp-xtvbaxfg.png)](https://lp.logrocket.com/blg/rust-signup)

[LogRocket](https://lp.logrocket.com/blg/rust-signup) is like a DVR for web and mobile apps, recording literally everything that happens on your Rust app. Instead of guessing why problems happen, you can aggregate and report on what state your application was in when an issue occurred. LogRocket also monitors your app’s performance, reporting metrics like client CPU load, client memory usage, and more.

Modernize how you debug your Rust apps — [start monitoring for free](https://lp.logrocket.com/blg/rust-signup).