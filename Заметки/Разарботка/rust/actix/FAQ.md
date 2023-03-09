## Сделать редирект

```rust
use actix_web::{web, App, HttpResponse, HttpServer, Responder};

async fn redirect() -> impl Responder {
    let new_url = "/new_page";
    Ok(HttpResponse::Found()
        .header("Location", new_url)
        .finish())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/old_page", web::get().to(redirect))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

## как в actix получить данные post запроса

Чтобы получить данные POST-запроса в Actix-Web, можно использовать структуру `web::Form` в сочетании с атрибутом `#[post()]` для метода обработки запроса. Например, вот пример обработчика POST-запроса, который получает данные из формы и отправляет их обратно в качестве ответа:

```rust
use actix_web::{web, App, HttpResponse, HttpServer};

#[derive(serde::Deserialize)]
struct FormData {
    name: String,
    age: u8,
}

#[post("/submit")]
async fn submit_form(form: web::Form<FormData>) -> HttpResponse {
    let response_body = format!("Hello, {}! You are {} years old.", form.name, form.age);
    HttpResponse::Ok().body(response_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(submit_form)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

В этом примере мы определяем структуру `FormData` для хранения данных из формы. Затем мы определяем функцию `submit_form` с атрибутом `#[post("/submit")]`, которая использует `web::Form<FormData>` для получения данных из POST-запроса. Внутри функции мы используем полученные данные для формирования ответа, который отправляется обратно клиенту.

Для передачи JSON объекта в POST-запросе в Actix-Web, нужно воспользоваться структурой, которая будет сериализоваться/десериализоваться с помощью serde. Затем использовать `Json::<MyStruct>` для извлечения тела запроса, которое уже будет храниться в MyStruct типа. Пример обработки JSON в POST-запросе:

```rust
use actix_web::{web, App, HttpResponse, HttpServer};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Person {
```