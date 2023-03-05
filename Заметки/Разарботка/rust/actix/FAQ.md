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