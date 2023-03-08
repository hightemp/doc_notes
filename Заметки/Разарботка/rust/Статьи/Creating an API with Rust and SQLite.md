https://www.developer.com/languages/creating-an-api-with-rust-and-sqlite/

As we’ve already seen in our previous introductory [article](https://www.developer.com/languages/introduction-rust-programming-language/) about the Rust programming language, other than fast it is also versatile. It means that a ton of different programs with broad objectives can be created with Rust.

If you need more sophisticated stuff, like web applications and APIs, well, you’re in the right place. Like all major languages, Rust has grown in a rich community that embraces the open-source creation of frameworks and tools to enhance its development experience.

Among them, we can find frameworks like [Actix Web](https://actix.rs/) for web development, and [Diesel](https://diesel.rs/) for integrating your applications with databases in an easier way.

In this article, we’re going to explore these frameworks in action through the implementation of a CRUD application of users, made with Actix, Diesel, and SQLite. Let’s dive in!

## Setup

First of all, you need to make sure that Rust is installed in your machine. You can find proper instructions for that in our [previous article](https://www.developer.com/languages/introduction-rust-programming-language/).

Since we’re going to use SQLite as the default database, you don’t have to install anything, except for the proper drivers for your computer. If you’re on Mac, for example, you’d need to run the following:

$ brew install sqlite

Once you’ve installed Rust, you’ll get along the [Cargo](https://doc.rust-lang.org/cargo/) (Rust’s package manager) commands who will be responsible for the scaffolding of our new project.

So, within a folder of your choice, run the following command to create a new Rust project:

$ cargo new rust-sqlite-api

This will create some folders and files containing the main.rs with a Hello World example, and the Cargo.tom file which defines the list of dependencies of the current Rust project.

Regarding the dependencies we’ll need to add, let’s sum them up below:

-   Actix’s [web](https://github.com/actix/actix-web) and [rt](https://docs.rs/actix-rt/1.1.1/actix_rt/): the main dependency for Actix web development and a runtime implementation that runs everything on the current thread, respectively.
-   Diesel’s main dependency allowing both SQLite and r2d2 features. [R2d2](https://github.com/sfackler/r2d2) is a good connection pool for Rust, which will be useful for our example.
-   dotenv for environment variables management.
-   [Serde](https://serde.rs/): a framework for serializing and deserializing Rust data structures efficiently and generically.

And this is how your Cargo.toml dependencies section should look like:

[dependencies]
actix-web = "2.0"
actix-rt = "1.1.1"
diesel = { version = "1.4.5", features = ["sqlite", "r2d2"]}
dotenv = "0.15.0"
serde = "1.0"
serde_derive = "1.0"
serde_json = "1.0"
anyhow = "1.0"
chrono = "0.4.15"

Don’t worry about them for now. When we first start up the project, all the dependencies will be automatically downloaded by Rust. Database Setup

As we’ve seen, the persistence will be handled by Diesel. It also allows a super cool feature of migration, which provides cli commands to continuously upgrade your database and the ability to go back and forth through the versions.

While we won’t make use of the migration itself, we’ll take advantage of some of its features that help with the schema generation.

First, make sure to install the diesel_cli, the command-line tool for Diesel commands:

cargo install diesel_cli --no-default-features

Then, create a new file called .env at the root folder of your app and add the following:

DATABASE_URL=crud.db

This is the name of our SQLite database. Yes, the whole database is a local file.

Then, run the following commands to set up the local database and create our initial migration files:

diesel setup
diesel migration generate create_users

This will auto-create a root-folder called migrations. Inside of it, you may find the migration files called _up.sql_ and _down.sql_, for back and forth migrations.

Open the up.sql and place the content below:

-- Your SQL goes here
CREATE TABLE "users" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    date_created TEXT NOT NULL
);

INSERT INTO
    "users"(name, address, date_created)
VALUES
("John", "123 Av Q", "Today");

This will ensure that the user’s table as well as some initial input data we’ll be there in our database. Finally, run the command below to commit the changes:

diesel migration run

After that, a file called schema.rs will be generated into the src folder. Make sure its contents are equal to the following:

table! {
    users (id) {
        id -> Integer,
        name -> Text,
        address -> Text,
        date_created -> Text,
    }
}

This is our table schema, one important step for Diesel to recognize the bindings between table columns and model properties.

## The User Model

Like many other frameworks out there, Rust also encourages the use of models to deal with the system’s data.

Within the src folder, create a new one called models.rs and place the following content:

use crate::schema::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub address: String,
    pub date_create: String,
}

#[derive(Debug, Insertable)]
#[table_name = "users"]
pub struct UserNew<'a> {
    pub name: &'a str,
    pub address: &'a str,
    pub date_created: &'a str,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserJson {
    pub name: String,
    pub address: String,
}

A few important notes here. First, take a look at how we’re importing Serde’s serializing and deserializing dependencies to make use of them below. For each different CRUD operation, we’d need a different struct to be deserialized when receiving requests and deserialized when sending the responses back.

## The Routing System

Rust, through Actix, also provides a routing system to facilitate the job of routing incoming requests to the proper methods.

Create a new file called routes.rs into the src folder and place the following into it:

```rust

use crate::models::{User, UserJson, UserNew};
use crate::Pool;

use actix_web::http::StatusCode;
use actix_web::{web, Error, HttpResponse};
use anyhow::Result;
use diesel::dsl::insert_into;
use diesel::prelude::*;
use diesel::RunQueryDsl;

pub async fn root() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::build(StatusCode::OK).body("Hello World, Rust!"))
}

pub async fn create_user(
    pool: web::Data,
    item: web::Json,
) -> Result<HttpResponse, Error> {
    Ok(web::block(move || new_user(pool, item))
        .await
        .map(|user| HttpResponse::Created().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

fn new_user(
    pool: web::Data,
    item: web::Json,
) -> Result<User, diesel::result::Error> {
    use crate::schema::users::dsl::*;
    let db_connection = pool.get().unwrap();

    match users
        .filter(name.eq(&item.name))
        .first::(&db_connection)
    {
        Ok(result) => Ok(result),
        Err(_) => {
            let new_user = UserNew {
                name: &item.name,
                address: &item.address,
                date_created: &format!("{}", chrono::Local::now().naive_local()),
            };

            insert_into(users)
                .values(&new_user)
                .execute(&db_connection)
                .expect("Error");

            let result = users.order(id.desc()).first(&db_connection).unwrap();
            Ok(result)
        }
    }
}

pub async fn get_users(pool: web::Data) -> Result<HttpResponse, Error> {
    Ok(list_users(pool)
        .await
        .map(|users| HttpResponse::Ok().json(users))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

async fn list_users(pool: web::Data) -> Result<Vec, diesel::result::Error> {
    use crate::schema::users::dsl::*;
    let db_connection = pool.get().unwrap();
    let result = users.load::(&db_connection)?;
    Ok(result)
}
```

Note that our methods here are async. It’s a good feature that helps to let the flow of the code a bit smoother.

This is only possible due to adding the following line to your Cargo.toml file:

edition = "2018"

Before that edition, async features are not enabled. Back to the code listing, the routing mechanism is pretty simple: each route needs a corresponding method mapped under the right HTTP method. Within each route config, you get to set up both request incoming and response outcoming. The responses resume themselves to choose the proper HTTP status and return message.

The request, however, may contain parameters, headers and body data to be considered. Our example is more simple: we’re converting the request’s data right into the model object to perform the respective routines further down, which includes calling the database and serializing/deserializing the results.

## The Controller

The controller is the entry point of requests for Actix. In our example, one single method is enough to map all of them.

This method must be annotated with the #[actix_rt::main] annotation. So, replace the current main.rs contents to the following:

```rust

#[macro_use]
extern crate diesel;

mod models;
mod routes;
mod schema;

use actix_web::{web, App, HttpServer};
use diesel::r2d2::{self, ConnectionManager};
use diesel::SqliteConnection;

pub type Pool = r2d2::Pool<ConnectionManager>;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("NOT FOUND");
    let database_pool = Pool::builder()
        .build(ConnectionManager::::new(database_url))
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .data(database_pool.clone())
            .route("/", web::get().to(routes::root))
            .route("/users", web::post().to(routes::create_user))
            .route("/getusers", web::get().to(routes::get_users))
    })
    .bind("localhost:8080")?
    .run()
    .await
}
```

First, we’re setting up the database by calling its pool builder. Then, we send it directly to the new App created. It provides us with a data() method that acts by feeding the HTTP server with a data source to look at. Then, you might define the routes individually, only this way Actix will know how to apply the routing methods we’ve created before.

Finally, inform the address for this server to bind at (localhost + port) and run it.

Let’s execute the example now. To start the project, you need to run the following command:

cargo run

As simple as that! When you access the endpoint http://localhost:8080/getusers (the GET), you may see the following:

![rust api](https://devcomprd.wpengine.com/wp-content/uploads/2021/03/Figure01-2.png)

This refers to the database we’ve imputed at the beginning of the article.

## Conclusion

As homework, I’ll ask you to test the rest of the endpoints out. Remember to respect each one of the CRUD’s HTTP verbs.

Rust is a vast and rich ecosystem, filled with great frameworks that will help you to optimize your projects and gain a lot in productivity. Like any other major web framework from other platforms and languages, Actix is complete, robust, and easy-to-use.

Don’t forget to give a good read over its [official documentation](https://actix.rs/docs/). It’s the most complete reference you may find to enrich even more your knowledge on the framework. Best of luck!