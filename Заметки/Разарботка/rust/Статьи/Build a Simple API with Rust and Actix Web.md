https://codevoweb.com/build-a-simple-api-with-rust-and-actix-web/

In this comprehensive guide, you’ll build a simple CRUD API in Rust using the Actix Web framework and an in-memory database. To summarise, we’ll create a RESTful API with the Actix Web framework that supports CRUD functionalities for handling **Create**, **Read**, **Update**, and **Delete** operations against a centralized data store.

What is Actix Web in Rust? Actix Web is an HTTP web framework written in Rust. It is built on top of the [Actix actor framework](https://docs.rs/actix/latest/actix/) and is designed to be extremely fast, secure, scalable, performant, flexible, and easy to use. Also, it has a built-in HTTP server which is fully asynchronous, making it well-suited for building high-performance and high-concurrency web applications.

Actix web has features like routing, logging, middleware, WebSockets, and static file serving support. Its design was inspired by [Flask](https://flask.palletsprojects.com/), [FastAPI](https://fastapi.tiangolo.com/), [Rails](https://rubyonrails.org/), [Bottle](https://bottlepy.org/docs/dev/), and [Express.js](https://expressjs.com/). So you’ll feel at home when already have some experience with those frameworks.

More practice:

-   [Build a Simple API in Rust](https://codevoweb.com/build-a-simple-api-in-rust)
-   [Build a Simple API with Rust and Rocket](https://codevoweb.com/build-a-simple-api-with-rust-and-rocket)
-   [Build a CRUD API with Node.js and Sequelize](https://codevoweb.com/build-a-crud-api-with-nodejs-and-sequelize)
-   [Build a CRUD App with FastAPI and SQLAlchemy](https://codevoweb.com/build-a-crud-app-with-fastapi-and-sqlalchemy)
-   [Build a CRUD App with FastAPI and PyMongo](https://codevoweb.com/build-a-crud-app-with-fastapi-and-pymongo)
-   [Build CRUD API with Django REST framework](https://codevoweb.com/build-crud-api-with-django-rest-framework)
-   [Build CRUD RESTful API Server with Golang, Gin, and MongoDB](https://codevoweb.com/crud-restful-api-server-with-golang-and-mongodb)

## Prerequisites

To fully grasp the concepts presented in this tutorial, these prerequisites are needed.

-   Basic experience with Rust
-   Basic knowledge of REST architecture
-   Prior knowledge of creating an API in Rust or other languages will be beneficial.

## Run the Rust Actix Web API Locally

-   Download or clone the Rust Actix Web API project from [https://github.com/wpcodevo/simple-api-actix-web](https://github.com/wpcodevo/simple-api-actix-web) and open the source code in a code editor.
-   Run `cargo r -r` in the console of the root directory to install the required crates and start the Actix Web HTTP server.
-   Open Postman or Thunder Client VS Code extension and import the `Todo.postman_collection.json` file provided in the project’s root folder to have access to the collection used in testing the API.
-   Once you have access to the Postman collection, test the individual endpoints of the Actix Web API.

## Initialize the Rust Project

At the end of this tutorial, you’ll have a folder structure that looks like the screenshot below excluding the **Makefile** and **Todo.postman_collection.json files**.


To begin, navigate to a desired location on your machine and run the following commands.

```

mkdir simple-api-actix-web
cd simple-api-actix-web && code .
```

This will create a new directory called `simple-api-actix-web` , navigate into the newly-created folder, and open the folder in VS Code. Feel free to use any IDE or text editor you are more comfortable with.

Now open the integrated terminal in your code editor and run [Cargo’s init function](https://doc.rust-lang.org/cargo/commands/cargo-init.html) to initialize the Rust project in the current directory.

```

cargo init
```

In the console of the root directory, run these commands to add the following dependencies to the `Cargo.toml` manifest file.

```

cargo add actix-web
cargo add actix-cors
cargo add serde --features derive
cargo add chrono --features serde
cargo add env_logger
cargo add uuid --features v4
```

-   `[actix-web](https://crates.io/crates/actix-web)` – A web framework for Rust.
-   `[actix-cors](https://crates.io/crates/actix-cors)` – This crate provides CORS (Cross-Origin Resource Sharing) support for the Actix web framework.
-   `[serde](https://crates.io/crates/serde)` – This crate provides a framework to convert Rust data structures to and from various formats such as JSON, YAML, TOML, and more.
-   `[chrono](https://crates.io/crates/chrono)` – This crate provides a set of types for representing and manipulating dates, times, durations, and time zones in Rust.
-   `[env_logger](https://crates.io/crates/env_logger)` – This crate is built on top of the `[log](https://crates.io/crates/log)` crate and it allows you to initialize and configure a logger via environment variables.
-   `[uuid](https://crates.io/crates/uuid)` – This crate provides a simple and efficient way to generate and parse UUIDs in Rust.

In case the latest versions of the above dependencies break your app, you can replace the content of your `Cargo.toml` file with the code below.

**Cargo.toml**

```

[package]
name = "simple-api-actix-web"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
actix-cors = "0.6.4"
actix-web = "4.2.1"
chrono = { version = "0.4.23", features = ["serde"] }
env_logger = "0.10.0"
serde = { version = "1.0.152", features = ["derive"] }
uuid = { version = "1.2.2", features = ["v4"] }
```

Now let’s create a simple HTTP server with Actix web to get our hands dirty. To do this, open the `src/main.rs` file and replace its content with the following code snippets.

**src/main.rs**

```

use actix_web::middleware::Logger;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;

#[derive(Serialize)]
pub struct GenericResponse {
    pub status: String,
    pub message: String,
}

#[get("/api/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "Build Simple CRUD API with Rust and Actix Web";

    let response_json = &GenericResponse {
        status: "success".to_string(),
        message: MESSAGE.to_string(),
    };
    HttpResponse::Ok().json(response_json)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    env_logger::init();

    println!("🚀 Server started successfully");

    HttpServer::new(move || {
        App::new()
            .service(health_checker_handler)
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
```

In the above code, we created a `GenericResponse` struct that implements the **Serialize** trait of the Serde crate. Then, we created a `/api/healthchecker` route to respond with a JSON object containing a “_message_” property with the value “Build Simple CRUD API with Rust and Actix Web“.

If you have a Node.js background, you may be familiar with the Nodemon package which restarts the server when files change. Well, in Rust, we have a command-line tool called `[cargo-watch](https://crates.io/crates/cargo-watch)` that can watch the source code for changes and hot-reload the server.

You can install `cargo-watch` with this command:

```

cargo install cargo-watch 
```

Once installed, you can run this command to start the Actix Web HTTP server and restart the server when a file in the **src** directory changes. Feel free to use the Cargo CLI instead.

```

cargo watch -q -c -w src/ -x run
```

Now that the Actix Web server is up and running, send a **GET** request to `http://localhost:8000/api/healthchecker` and you should receive a JSON object with the message “Build Simple CRUD API with Rust and Actix Web“.

![testing the health checker route of the actix web api](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22977%22%20height=%22316%22%3E%3C/svg%3E)

## Setup the Database Model

Let me clear the air first. We won’t use a real database in this project to keep things simple. However, you’ll create a centralized data store that will be shared across the route handlers using a Mutex, vector, and Rust’s smart pointer called Arc.

[Arc](https://doc.rust-lang.org/std/sync/struct.Arc.html) will allow the in-memory database to be shared across multiple threads and [Mutex](https://doc.rust-lang.org/std/sync/struct.Mutex.html) will enable safe access to the data store even if multiple threads are accessing it at the same time.

To set up the in-memory database, create a `model.rs` file in the **src** directory and add the following code.

**src/model.rs**

```

use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Todo {
    pub id: Option<String>,
    pub title: String,
    pub content: String,
    pub completed: Option<bool>,
    pub createdAt: Option<DateTime<Utc>>,
    pub updatedAt: Option<DateTime<Utc>>,
}

pub struct AppState {
    pub todo_db: Arc<Mutex<Vec<Todo>>>,
}

impl AppState {
    pub fn init() -> AppState {
        AppState {
            todo_db: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct QueryOptions {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
pub struct UpdateTodoSchema {
    pub title: Option<String>,
    pub content: Option<String>,
    pub completed: Option<bool>,
}
```

Above, we defined a **Todo** struct to represent the structure of a Todo item. Then, we created an **AppState** struct which has a `Arc<Mutex<Vec<Todo>>>` field called `todo_db` that stores the data.

The **AppState** struct has an **init** function that creates a new instance of the **AppState** struct and initializes it with an empty vector. At the bottom, we created `QueryOptions` and `UpdateTodoSchema` structs to help us deserialize the incoming request bodies into structs.

## Create the API Response Structs

Now that we’ve set up the data store, let’s create structs that implement Serde’s **Serialize** trait. This is required because Actix-web’s `HttpResponseBuilder` function experts structs that implement the **Serialize** trait.

**src/response.rs**

```

use serde::Serialize;

use crate::model::Todo;

#[derive(Serialize)]
pub struct GenericResponse {
    pub status: String,
    pub message: String,
}

#[derive(Serialize, Debug)]
pub struct TodoData {
    pub todo: Todo,
}

#[derive(Serialize, Debug)]
pub struct SingleTodoResponse {
    pub status: String,
    pub data: TodoData,
}

#[derive(Serialize, Debug)]
pub struct TodoListResponse {
    pub status: String,
    pub results: usize,
    pub todos: Vec<Todo>,
}
```

## Add the CRUD Functionalities

When building APIs, it is common to add CRUD functionalities to interact with the data. This can be done by creating higher-level CRUD functions that implement the lower-level CRUD functions provided by an ORM or a database driver.

Implementing CRUD functionalities can be a complex task, but it is a fundamental aspect of any API that needs to persist data. In this section, we’ll create route handlers to add CRUD functionalities to the Actix Web API. Below is the list of routes the API will have.

-   `#[get("/healthchecker")]` – This route will send a JSON object that contains a message field.
-   `#[get("/todos")]` – This route will retrieve a list of Todo items from the data store and send them in the JSON response.
-   `#[post("/todos")]` – This route will add a new Todo item to the data store and return the newly-created item in the JSON response.
-   `#[get("/todos/{id}")]` – This route will find a Todo item by ID and return the found item in the JSON response.
-   `#[patch("/todos/{id}")]` – This route will find a Todo item by ID and edit the fields of the found item based on the request payload.
-   `#[delete("/todos/{id}")]` – This route will find a Todo item by ID and delete it from the data store.

To begin, go into the **src** directory and create a `handler.rs` file. Within the `handler.rs` file, add the following modules and dependencies.

**src/handler.rs**

```

use crate::{
    model::{AppState, QueryOptions, Todo, UpdateTodoSchema},
    response::{GenericResponse, SingleTodoResponse, TodoData, TodoListResponse},
};
use actix_web::{delete, get, patch, post, web, HttpResponse, Responder};
use chrono::prelude::*;
use uuid::Uuid;
```

### Health Checker Route

This route controller will be called to return a simple JSON object when the Actix Web server receives a **GET** request on the `/api/healthchecker` path.

**src/handler.rs**

```

#[get("/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "Build Simple CRUD API with Rust and Actix Web";

    let response_json = &GenericResponse {
        status: "success".to_string(),
        message: MESSAGE.to_string(),
    };
    HttpResponse::Ok().json(response_json)
}
```

The `HttpResponse::Ok().json(response_json)` method will serialize the **GenericResponse** struct, set the correct headers, and return the JSON object to the client.

### Fetch All Records

The first CRUD functionality we’ll implement is **READ**. This route function will be called to return a list of Todo items when the Actix Web server receives a **GET** request on the `/api/todos` path.

The route handler will have a pagination feature where the user can request a selected list of records. This will improve the performance of the API when dealing with large datasets.

**src/handler.rs**

```

#[get("/todos")]
pub async fn todos_list_handler(
    opts: web::Query<QueryOptions>,
    data: web::Data<AppState>,
) -> impl Responder {
    let todos = data.todo_db.lock().unwrap();

    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    let todos: Vec<Todo> = todos.clone().into_iter().skip(offset).take(limit).collect();

    let json_response = TodoListResponse {
        status: "success".to_string(),
        results: todos.len(),
        todos,
    };
    HttpResponse::Ok().json(json_response)
}
```

Above, we fetched the list of Todo items from the data store, skipped a number of elements based on the `offset` value, limited the number of results based on the `limit` value, and returned the resulting list of Todo items in the JSON response.

### Create a Record

The next CRUD functionality is **CREATE**. Actix Web will call this route function to add a Todo item to the data store when a **POST** request is made to the `/api/todos` endpoint.

To prevent duplicates in the data store, we’ll first check if a record with that **title** already exists. If a Todo item with that title already exists, a **409 Conflict error** will be sent to the client.

Otherwise, a **UUID** will be generated for the new record and persisted in the in-memory database. After that, the newly-added record will be returned in the JSON response.

**src/handler.rs**

```

#[post("/todos")]
async fn create_todo_handler(
    mut body: web::Json<Todo>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let todo = vec.iter().find(|todo| todo.title == body.title);

    if todo.is_some() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with title: '{}' already exists", body.title),
        };
        return HttpResponse::Conflict().json(error_response);
    }

    let uuid_id = Uuid::new_v4();
    let datetime = Utc::now();

    body.id = Some(uuid_id.to_string());
    body.completed = Some(false);
    body.createdAt = Some(datetime);
    body.updatedAt = Some(datetime);

    let todo = body.to_owned();

    vec.push(body.into_inner());

    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo },
    };

    HttpResponse::Ok().json(json_response)
}
```

### Retrieve a Single Record

Now let’s perform the second **READ** operation. To do this, we’ll create a route function that Actix Web will use to retrieve a single record by **ID** from the data store and return the found record to the client.

This route handler will be called when a **GET** request hits the server at the`/api/todos/{id}` endpoint. If no record with that **ID** was found, a **404 Not Found error** will be sent to the client.

**src/handler.rs**

```

#[get("/todos/{id}")]
async fn get_todo_handler(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    let todo = todo.unwrap();
    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo: todo.clone() },
    };

    HttpResponse::Ok().json(json_response)
}
```

Otherwise, the Todo item that matches the query will be returned to the client in the JSON response.

### Edit a Record

It’s now time to perform the **UPDATE** operation. When a **PATCH** request is made to the `/api/todos/{id}` endpoint, Actix Web will evoke this route handler to process the request.

When Actix Web delegates the **PATCH** request to this route function, it will query the data store to find the record by the provided **ID** and update its fields based on the data available in the request body.

If no record with that ID exists in the in-memory database, a **404 Not Found error** will be returned to the client.

**src/handler.rs**

```

#[patch("/todos/{id}")]
async fn edit_todo_handler(
    path: web::Path<String>,
    body: web::Json<UpdateTodoSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter_mut().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    let todo = todo.unwrap();
    let datetime = Utc::now();
    let title = body.title.to_owned().unwrap_or(todo.title.to_owned());
    let content = body.content.to_owned().unwrap_or(todo.content.to_owned());
    let payload = Todo {
        id: todo.id.to_owned(),
        title: if !title.is_empty() {
            title
        } else {
            todo.title.to_owned()
        },
        content: if !content.is_empty() {
            content
        } else {
            todo.content.to_owned()
        },
        completed: if body.completed.is_some() {
            body.completed
        } else {
            todo.completed
        },
        createdAt: todo.createdAt,
        updatedAt: Some(datetime),
    };
    *todo = payload;

    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo: todo.clone() },
    };

    HttpResponse::Ok().json(json_response)
}
```

Otherwise, the newly-updated record will be sent to the client in the JSON response.

### Delete a Record

Finally, let’s perform the last CRUD operation which is **DELETE**. When the Actix Web server receives a **DELETE** request on the `/api/todos/{id}` endpoint, it will call this route function to remove the record that matches the provided **ID** from the data store.

If no record was found, a **404 Not Found error** will be returned to the client. Otherwise a 204 No Content response will be sent.

**src/handler.rs**

```

#[delete("/todos/{id}")]
async fn delete_todo_handler(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter_mut().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    vec.retain(|todo| todo.id != Some(id.to_owned()));
    HttpResponse::NoContent().finish()
}
```

### Merge the Routes

Now that we’ve defined all the route functions, let’s use Actix-web’s `web::scope("")` function to group them under a `/api` prefix.

**src/handler.rs**

```

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(todos_list_handler)
        .service(create_todo_handler)
        .service(get_todo_handler)
        .service(edit_todo_handler)
        .service(delete_todo_handler);

    conf.service(scope);
}
```

### Complete Route Controllers

**src/handler.rs**

```

use crate::{
    model::{AppState, QueryOptions, Todo, UpdateTodoSchema},
    response::{GenericResponse, SingleTodoResponse, TodoData, TodoListResponse},
};
use actix_web::{delete, get, patch, post, web, HttpResponse, Responder};
use chrono::prelude::*;
use uuid::Uuid;

#[get("/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "Build Simple CRUD API with Rust and Actix Web";

    let response_json = &GenericResponse {
        status: "success".to_string(),
        message: MESSAGE.to_string(),
    };
    HttpResponse::Ok().json(response_json)
}

#[get("/todos")]
pub async fn todos_list_handler(
    opts: web::Query<QueryOptions>,
    data: web::Data<AppState>,
) -> impl Responder {
    let todos = data.todo_db.lock().unwrap();

    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    let todos: Vec<Todo> = todos.clone().into_iter().skip(offset).take(limit).collect();

    let json_response = TodoListResponse {
        status: "success".to_string(),
        results: todos.len(),
        todos,
    };
    HttpResponse::Ok().json(json_response)
}

#[post("/todos")]
async fn create_todo_handler(
    mut body: web::Json<Todo>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let todo = vec.iter().find(|todo| todo.title == body.title);

    if todo.is_some() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with title: '{}' already exists", body.title),
        };
        return HttpResponse::Conflict().json(error_response);
    }

    let uuid_id = Uuid::new_v4();
    let datetime = Utc::now();

    body.id = Some(uuid_id.to_string());
    body.completed = Some(false);
    body.createdAt = Some(datetime);
    body.updatedAt = Some(datetime);

    let todo = body.to_owned();

    vec.push(body.into_inner());

    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo },
    };

    HttpResponse::Ok().json(json_response)
}

#[get("/todos/{id}")]
async fn get_todo_handler(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    let todo = todo.unwrap();
    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo: todo.clone() },
    };

    HttpResponse::Ok().json(json_response)
}

#[patch("/todos/{id}")]
async fn edit_todo_handler(
    path: web::Path<String>,
    body: web::Json<UpdateTodoSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter_mut().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    let todo = todo.unwrap();
    let datetime = Utc::now();
    let title = body.title.to_owned().unwrap_or(todo.title.to_owned());
    let content = body.content.to_owned().unwrap_or(todo.content.to_owned());
    let payload = Todo {
        id: todo.id.to_owned(),
        title: if !title.is_empty() {
            title
        } else {
            todo.title.to_owned()
        },
        content: if !content.is_empty() {
            content
        } else {
            todo.content.to_owned()
        },
        completed: if body.completed.is_some() {
            body.completed
        } else {
            todo.completed
        },
        createdAt: todo.createdAt,
        updatedAt: Some(datetime),
    };
    *todo = payload;

    let json_response = SingleTodoResponse {
        status: "success".to_string(),
        data: TodoData { todo: todo.clone() },
    };

    HttpResponse::Ok().json(json_response)
}

#[delete("/todos/{id}")]
async fn delete_todo_handler(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let mut vec = data.todo_db.lock().unwrap();

    let id = path.into_inner();
    let todo = vec.iter_mut().find(|todo| todo.id == Some(id.to_owned()));

    if todo.is_none() {
        let error_response = GenericResponse {
            status: "fail".to_string(),
            message: format!("Todo with ID: {} not found", id),
        };
        return HttpResponse::NotFound().json(error_response);
    }

    vec.retain(|todo| todo.id != Some(id.to_owned()));
    HttpResponse::NoContent().finish()
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(todos_list_handler)
        .service(create_todo_handler)
        .service(get_todo_handler)
        .service(edit_todo_handler)
        .service(delete_todo_handler);

    conf.service(scope);
}
```

## Add CORS to the Actix Web Server

Now that we’ve created the route handlers, in-memory database, and response structs, let’s import their respective files as modules into the `src/main.rs` file and add CORS headers to the Actix Web server.

To add CORS headers, we’ll use the `Cors` struct middleware provided by the `actix_cors` crate to define the headers and wrap them around the routes. So, open the **src/main.rs** file and replace its content with the following code.

**src/main.rs**

```

mod handler;
mod model;
mod response;

use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{http::header, web, App, HttpServer};
use model::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    env_logger::init();

    let todo_db = AppState::init();
    let app_data = web::Data::new(todo_db);

    println!("🚀 Server started successfully");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:3000/")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();
        App::new()
            .app_data(app_data.clone())
            .configure(handler::config)
            .wrap(cors)
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
```

With that out of the way, run the command below to start the Actix Web HTTP server again.

```

cargo watch -q -c -w src/ -x run
```

## Test the Actix Web CRUD API

Now that the Actix Web HTTP server is ready to accept requests, clone the project, import the `Todo.postman_collection.json` file into Postman, and test the endpoints.

### Add a New Todo Item

To create a new Todo item, add a JSON object that contains “**title**” and “**content**” fields to the request body and make a **POST** request to the `http://localhost:8000/api/todos` endpoint.

```

{
    "title": "Learn how to build a CRUD API with Actix Web framework in Rust",
    "content": "Rust a system programming language"
}
```

The Actix Web server will call the appropriate route handler to add the new item to the data store and return the newly-added item in the JSON response.

![actix web crud api add a new record](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221024%22%20height=%22926%22%3E%3C/svg%3E)

### Edit a Todo Item

To edit the fields of a Todo item in the data store, add the edited JSON object to the request body and make a **PATCH** request to the `http://localhost:8000/api/todos/{id}` endpoint.

```

{
    "title": "New title for the Actix Web CRUD API ✅🚀",
    "completed": true
}
```

The Actix web server will call the appropriate route handler to edit the fields of the item that matches the ID parameter and return the newly-updated item in the JSON response.

![actix web crud api edit a record](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221024%22%20height=%22893%22%3E%3C/svg%3E)

### Retrieve a Todo Item

Here, you can append the ID of a record to the URL parameter and make a **GET** request to the `http://localhost:8000/api/todos/{id}` endpoint. This will return the Todo item that matches the ID in the JSON response.

![actix web crud api retrieve a single record](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221024%22%20height=%22908%22%3E%3C/svg%3E)

### Retrieve All Todo Items

Now let’s perform the **READ** operation of CRUD to retrieve a paginated list of Todo items from the in-memory database. To do that, add **limit** and **page** query parameters to the request URL and make a **GET** request to the `http://localhost:8000/api/todos?page=1&limit=10` endpoint.

If the **limit** and **page** query parameters are absent in the URL, the Actix Web server will only return the first 10 results.

![actix web crud api fetch all records](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221024%22%20height=%22963%22%3E%3C/svg%3E)

### Delete a Todo Item

Finally, let’s perform the **DELETE** operation of CRUD. So, add the Todo item’s ID to the URL parameter and make a **DELETE** request to the `http://localhost:8000/api/todos/{id}` endpoint. The Actix web server will find the Todo item by ID and delete it from the data store.

![actix web crud api delete a record](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22886%22%20height=%22670%22%3E%3C/svg%3E)

## Conclusion

Congrats on making it to the end. In this article, you learned how to build a simple CRUD API in Rust using the Actix Web framework. In addition, you learned how to set up an in-memory database with a struct, Arc, and Mutex.

You can find the complete source code of the Actix Web API on [GitHub](https://github.com/wpcodevo/simple-api-actix-web).