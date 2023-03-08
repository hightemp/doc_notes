https://nuancesprog.ru/p/8787/

В этой статье мы рассмотрим, как использовать SQLite (вместе с Diesel) и Rust как в файловом режиме, так и в режиме памяти.

## Необходимые условия

Кроме Rust и Diesel CLI, понадобится установить SQLite для вашей платформы:

```
# Linux
$ sudo apt install sqlite3 libsqlite3-0 libsqlite3-dev

# OSX
$ brew install sqlite3
```

## Создаём проект ([коммит](https://github.com/ukchukx/diesel-sqlite/commit/bd1f5209c522c9df1540cc1806821a4268870e7d))

```
$ cargo new diesel-sqlite
$ cd diesel-sqlite
```

Добавляем следующие зависимости:

-   Diesel, предоставляющую средства объектно-реляционного отображения.
-   Actix web для уровня обработки запросов по протоколу HTTP.
-   Dotenv для работы с переменными окружения.
-   Uuid для генерирования ID.

```
[dependencies]
actix-rt = "1.0"
actix-web = "2.0"
chrono = { version = "0.4.11", features = ["serde"] }
diesel = { version = "1.4.4", features = ["sqlite", "uuidv07", "chrono"] }
dotenv = "0.15.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
uuid = { version = "0.8", features = ["serde", "v4"] }
```

Далее создаём файл `.env` с `DATABASE_URL`:

```
DATABASE_URL=users.db
```

## Инициализируем Diesel и создаём скрипт миграции ([коммит](https://github.com/ukchukx/diesel-sqlite/commit/4c06113bb82a3ac66910f430e4274a154c3c02d2))

```
$ diesel setup
$ diesel migration generate create_users
```

Добавляем следующие инструкции SQL в сгенерированные файлы миграции `up` и `down`:

```
-- migrations/xxxx_create_users/up.sql

CREATE TABLE IF NOT EXISTS users (
  id CHARACTER(36) NOT NULL PRIMARY KEY,
  email VARCHAR(60),
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER IF NOT EXISTS UpdateTimestamps AFTER UPDATE ON users
  FOR EACH ROW WHEN NEW.updated_at <= OLD.updated_at 
BEGIN 
  update users set updated_at=CURRENT_TIMESTAMP where id=OLD.id;  
END;

-- migrations/xxxx_create_users/down.sql

DROP TRIGGER IF EXISTS UpdateTimestamps;

DROP TABLE IF EXISTS users;
```

Создаём таблицу `users`, запустив:

```
$ diesel migration run
```

После запуска Diesel должен создать для вас схему в `src/schema.rs`.

Давайте реорганизуем файлы в нашей базе данных:

-   Создадим каталог `db` внутри каталога `src`.
-   Переместим `src/schema.rs` в каталог `db`.
-   Обновим переменную `file` в `diesel.toml` из `src/schema.rs` в `src/db/schema.rs`.
-   Создадим файл `models.rs` в каталоге `db`.

После этого создаём файл `src/db.rs` вот с таким содержимым:

```
// src/db.rs
pub mod models;
pub mod schema;
```

## Создаём модель ([коммит](https://github.com/ukchukx/diesel-sqlite/commit/537b998b7ce67197f07ab1cd6cc82b55d170d63a))

Первым делом встроим наши миграции, так как для тестов понадобится использовать режим памяти SQLite. Кроме того, плюсом миграций является то, что они компилируются в наше приложение, создавая один исполняемый файл и удаляя эту зависимость в файловой системе.

Добавим `diesel_migrations` к нашим зависимостям:

```
# Cargo.toml

[dependencies]
# ...
diesel_migrations = "1.4.0"
```

Добавим их в начало `main.rs`:

```
// src/main.rs
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

mod db;
// ...
```

В `src/db.rs` вставим:

```
// src/db.rs

// ...
embed_migrations!();

pub fn establish_connection() -> SqliteConnection {
    if cfg!(test) {
        let conn = SqliteConnection::establish(":memory:")
          .unwrap_or_else(|_| panic!("Error creating test database"));
        
        let _result = diesel_migrations::run_pending_migrations(&conn);        conn
    } else {
        dotenv().ok();
    
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    
        SqliteConnection::establish(&database_url)
          .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
    }
}
```

В `establish_connection()` используем средства условной компиляции Rust для возврата соединения в памяти для тестов и подключения к файлу для обычных запусков.

Вставляем это в `src/db/models.rs`:

```
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use diesel::prelude::*;

use super::schema::users;
use super::schema::users::dsl::users as user_dsl;

#[derive(Debug, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users"]
pub struct User {
    pub id: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

impl User {
    pub fn list(conn: &SqliteConnection) -> Vec<Self> {
        user_dsl.load::<User>(conn).expect("Error loading users")
    }  

    pub fn by_id(id: &str, conn: &SqliteConnection) -> Option<Self> {
        if let Ok(record) = user_dsl.find(id).get_result::<User>(conn) {
            Some(record)
        } else {
            None
        }
    }   

    pub fn by_email(email_str: &str, conn: &SqliteConnection) -> Option<Self> {
        use super::schema::users::dsl::email; 
        if let Ok(record) = user_dsl.filter(email.eq(email_str)).first::<User>(conn) {
            Some(record)
        } else {
            None
        }
    }

    pub fn by_phone(phone_str: &str, conn: &SqliteConnection) -> Option<Self> {
        use super::schema::users::dsl::phone;

        if let Ok(record) = user_dsl.filter(phone.eq(phone_str)).first::<User>(conn) {
            Some(record)
        } else {
            None
        }
    }

    pub fn create(email: Option<&str>, phone: Option<&str>, conn: &SqliteConnection) -> Option<Self> {
        let new_id = Uuid::new_v4().to_hyphenated().to_string();
        
        if email.is_none() && phone.is_none() {
            return None
        } 
                
        if phone.is_some() {
            if let Some(user) = Self::by_phone(&phone.unwrap(), conn) {
                return Some(user)
            } 
        }
        
        if email.is_some() {
            if let Some(user) = Self::by_email(&email.unwrap(), conn) {
                return Some(user)
            } 
        }

        let new_user = Self::new_user_struct(&new_id, phone, email);       

        diesel::insert_into(user_dsl)
            .values(&new_user)
            .execute(conn)
            .expect("Error saving new user");
 
        Self::by_id(&new_id, conn)
    }

    fn new_user_struct(id: &str, phone: Option<&str>, email: Option<&str>) -> Self {
        User {
            id: id.into(),
            email: email.map(Into::into),
            phone: phone.map(Into::into),
            created_at: chrono::Local::now().naive_local(),
            updated_at: chrono::Local::now().naive_local(),
        }
    }
}

#[cfg(test)]
mod user_test;
```

Сначала объявляем импорт и нашу пользовательскую структуру `User`.  
Каждый из методов `User` принимает аргумент `SqliteConnection`, поэтому мы можем передать любое соединение (тестовое или другое), не меняя метода.

Для методов запроса Diesel возвращает `Result`, который мы преобразуем в `Option` с [.ok()](https://doc.rust-lang.org/std/result/enum.Result.html#method.ok) для подтверждения нашего возвращаемого типа.

Прежде чем создавать новую запись `User` в `create()`, сначала убеждаемся, что предоставленная электронная почта и/или телефон не существуют в базе данных.

В конце файла объявляем, что тесты объявлены в файле, расположенном в `src/db/models/user_test.rs` по соглашению.

Вставляем эти тесты в файл:

```
use crate::db::{establish_connection, models::User};

#[test]
fn create_user_with_phone_and_email() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = Some("123456789");

    let user = User::create(email, phone, &conn).unwrap();

    assert_eq!(user.email.unwrap().as_str(), email.unwrap());
    assert_eq!(user.phone.unwrap().as_str(), phone.unwrap());
}

#[test]
fn create_user_with_phone_only() {
    let conn = establish_connection();
    let email = None;
    let phone = Some("123456789");

    let user = User::create(email, phone, &conn).unwrap();

    assert!(user.email.is_none());
    assert_eq!(user.phone.unwrap().as_str(), phone.unwrap());
}

#[test]
fn create_user_with_email_only() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = None;

    let user = User::create(email, phone, &conn).unwrap();

    assert_eq!(user.email.unwrap().as_str(), email.unwrap());
    assert!(user.phone.is_none());
}

#[test]
fn create_user_with_existing_email() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = None;

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::create(email, phone, &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}

#[test]
fn create_user_with_existing_phone() {
    let conn = establish_connection();
    let email = None;
    let phone = Some("123456789");

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::create(email, phone, &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}

#[test]
fn list_users() {
    let conn = establish_connection();
    let email = None;
    let phone = Some("123456789");

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::by_phone(&phone.unwrap(), &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}

#[test]
fn get_user_by_email() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = None;

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::by_email(&email.unwrap(), &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}

#[test]
fn get_user_by_email() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = None;

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::by_email(&email.unwrap(), &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}

#[test]
fn get_user_by_id() {
    let conn = establish_connection();
    let email = Some("test@email.com");
    let phone = Some("123456789");

    let user = User::create(email, phone, &conn).unwrap();
    let existing_user = User::by_id(&user.id, &conn).unwrap();

    assert_eq!(user.id, existing_user.id);
}
```

## Добавляем веб-сервис ([коммит](https://github.com/ukchukx/diesel-sqlite/commit/a987f138b2e9b74d818d09fafe28c7bb76e9357c))

Обновим нашу зависимость `actix-web`, чтобы иметь средства тестирования, недоступные в версии 2.0, и добавим `r2d2` для организации набора соединений:

```
[dependencies]
# ...
actix-web = "3.0.0-alpha.1"
diesel = { version = "1.4.4", features = ["sqlite", "uuidv07", "r2d2", "chrono"] }
r2d2 = "0.8.8"
r2d2-diesel = "1.0.0"
```

Теперь выполним рефакторинг `src/db.rs` для использования набора соединений:

```
// src/db.rs
// ...
use diesel::sqlite::SqliteConnection;
use r2d2_diesel::ConnectionManager;
use r2d2::Pool;

embed_migrations!();

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

pub fn run_migrations(conn: &SqliteConnection) {
  let _ = diesel_migrations::run_pending_migrations(&*conn);
}

pub fn establish_connection() -> DbPool {
    if cfg!(test) {
        let manager = ConnectionManager::<SqliteConnection>::new(":memory:");
        let pool = r2d2::Pool::builder().build(manager).expect("Failed to create DB pool.");
        
        run_migrations(&pool.get().unwrap());        pool
    } else {
        dotenv().ok();
    
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<SqliteConnection>::new(&database_url);
        
        r2d2::Pool::builder().build(manager).expect("Failed to create DB pool.")
    }
}

```

Кроме того, отделим создание набора соединений для тестов от запуска миграций.

В каждом из наших тестов моделей мы меняем способ получения соединений с

```
let conn = establish_connection();
```

на

```
let conn = establish_connection().get().unwrap();
```

Создадим сервисный модуль `src/services.rs` и вставим:

```
// src/services.rs
pub mod user;

#[cfg(test)]
mod user_test;
```

Затем создадим сервисный файл пользователя `src/services/user.rs` и вставим:

```
// src/services/user.rs
use actix_web::{HttpResponse, web};
use serde::{Serialize, Deserialize};

use crate::db::{DbPool, models::User};

#[derive(Serialize, Deserialize)]
pub struct UserForm {
    email: Option<String>,
    phone: Option<String>,
}

pub fn create(user_form: web::Json<UserForm>, pool: web::Data<DbPool>) -> HttpResponse {
    let conn = pool.get().unwrap();

    match User::create(user_form.email.as_deref(), user_form.phone.as_deref(), &conn) {
        Some(user) => HttpResponse::Ok().json(user),
        _ => HttpResponse::InternalServerError().json("Could not create user")
    }
}

pub fn index(pool: web::Data<DbPool>) -> HttpResponse {
    let conn = pool.get().unwrap();

    HttpResponse::Ok().json(User::list(&conn))
}

pub fn get(id: web::Path<String>, pool: web::Data<DbPool>) -> HttpResponse {
    let conn = pool.get().unwrap();

    match User::by_id(&id, &conn) {
        Some(user) => HttpResponse::Ok().json(user),
        _ => HttpResponse::NotFound().json("Not Found")
    }
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    /* 
     * index: curl -i -X GET -H "Content-Type: application/json" http://localhost:5000/users
     * get: curl -i -X GET -H "Content-Type: application/json" http://localhost:5000/users/<id>
     * post: curl -i -X POST -H "Content-Type: application/json" -d '{"email":"xxx", "phone": "yyy"}' http://localhost:5000/users
     */
    
    cfg.service(
        web::resource("/users")
            .route(web::post().to(create))
            .route(web::get().to(index))
    )
    .service(
        web::scope("/users")
            .route("/{id}", web::get().to(get)),
    );
}
```

`create()`, `index()` и `get()` создают, выводят списком и получают пользователя по id. `init_routes()` добавляет наши маршруты на веб-сервер.

Затем обновим `src/main.rs`, чтобы запустить наш веб-сервер:

```
// src/main.rs

// ...
#[macro_use]
extern crate serde_json;
extern crate r2d2_diesel;

// ...
mod services;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{App, HttpServer, web::JsonConfig};

    let conn_pool = db::establish_connection();    

    HttpServer::new(move || {
        App::new()
            .data(conn_pool.clone())
            .data(JsonConfig::default().limit(4096))
            .configure(services::user::init_routes)
    })
    .bind("0.0.0.0:5000")?
    .run()
    .await
}
```

С этим обновлением наш сервис готов принимать и обслуживать запросы.

Теперь добавим тесты, чтобы убедиться в том, что сервис делает то, для чего он был создан. В `src/services/user_test.rs` вставим:

```
// src/services/user_test.rs
use actix_web::{
    App,
    test::{read_body_json, read_body, init_service, TestRequest}
};

use crate::{db::{models::User, establish_connection}, services::user::init_routes};

#[actix_rt::test]
async fn create_user_from_api() {
    let test_email   = "test@email.com";
    let test_phone   = "123456789";
    let request_body = json!({ "email": test_email, "phone": test_phone });
    let conn_pool    = establish_connection();
    let mut app      = init_service(App::new().data(conn_pool.clone()).configure(init_routes)).await;

    let resp = TestRequest::post()
      .uri("/users")
      .set_json(&request_body)
      .send_request(&mut app)
      .await;

    assert!(resp.status().is_success(), "Failed to create user");

    let user: User = read_body_json(resp).await;

    assert_eq!(user.email.unwrap(), test_email);
    assert_eq!(user.phone.unwrap(), test_phone);
}

    let user: User = read_body_json(resp).await;

    assert_eq!(user.email.unwrap(), test_email);
    assert_eq!(user.phone.unwrap(), test_phone);
}

#[actix_rt::test]
async fn get_user_from_api_by_id() {
    let test_email   = "test@email.com";
    let test_phone   = "123456789";
    let request_body = json!({ "email": test_email, "phone": test_phone });
    let conn_pool    = establish_connection();
    let mut app      = init_service(App::new().data(conn_pool.clone()).configure(init_routes)).await;

    let create_resp = TestRequest::post()
      .uri("/users")
      .set_json(&request_body)
      .send_request(&mut app)
      .await;

    assert!(create_resp.status().is_success(), "Failed to create user");

    let created_user: User = read_body_json(create_resp).await;
    println!("/users/{}", created_user.id);
    
    let resp = TestRequest::get()
      .uri(format!("/users/{}", created_user.id).as_str())
      .send_request(&mut app)
      .await;

    assert!(resp.status().is_success(), "Failed to get user");

    let retrieved_user: User = read_body_json(resp).await;

    assert_eq!(created_user.id, retrieved_user.id);
}

    let retrieved_user: User = read_body_json(resp).await;

    assert_eq!(created_user.id, retrieved_user.id);
}

#[actix_rt::test]
async fn list_users_from_api() {
    let test_email   = "test@email.com";
    let test_phone   = "123456789";
    let request_body = json!({ "email": test_email, "phone": test_phone });
    let conn_pool    = establish_connection();
    let mut app      = init_service(App::new().data(conn_pool.clone()).configure(init_routes)).await;

    let mut list_resp = TestRequest::get().uri("/users").send_request(&mut app).await;
    
    assert!(list_resp.status().is_success(), "Failed to list users");

    let mut body = read_body(list_resp).await;  
    let mut retrieved_users: Vec<User> = serde_json::from_slice::<Vec<User>>(&body).unwrap();

    assert_eq!(retrieved_users.len(), 0);

    let create_resp = TestRequest::post()
      .uri("/users")
      .set_json(&request_body)
      .send_request(&mut app)
      .await;

    assert!(create_resp.status().is_success(), "Failed to create user");
    
    list_resp = TestRequest::get().uri("/users").send_request(&mut app).await;

    assert!(list_resp.status().is_success(), "Failed to list users");

    body = read_body(list_resp).await;    
    retrieved_users = serde_json::from_slice::<Vec<User>>(&body).unwrap();

    assert_eq!(retrieved_users.len(), 1);
}
```

Полный код можно найти [здесь](https://github.com/ukchukx/diesel-sqlite).