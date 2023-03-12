https://habr.com/ru/post/546208/

В этой статье я покажу как создать GraphQL сервер, используя Rust и его экосистему; будут приведены примеры реализации наиболее часто встречающихся задач при разработке GraphQL API. В итоге API трёх микросервисов будут объединены в единую точку доступа с помощью Apollo Server и [Apollo Federation](https://www.apollographql.com/docs/federation/). Это позволит клиентам запрашивать данные одновременно из нескольких источников без необходимости знать какие данные приходят из какого сервиса.

## Введение

### Обзор

С точки зрения функциональности описываемый проект довольно похож на представленный в моей [предыдущей статье](https://romankudryashov.com/blog/2020/02/how-to-graphql/), но в этот раз с использованием стэка Rust. Архитектурно проект выглядит так:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9c7/3ab/c80/9c73abc80275f109b3b7fb98edaff10a.png)

Каждый компонент архитектуры освещает несколько вопросов, которые могут возникнуть при реализации GraphQL API. Доменная модель включает данные о планетах Солнечной системы и их спутниках. Проект имеет многомодульную структуру (или монорепозиторий) и состоит из следующих модулей:

-   [planets-service](https://github.com/rkudryashov/graphql-rust-demo/tree/master/planets-service) (Rust)
    
-   [satellites-service](https://github.com/rkudryashov/graphql-rust-demo/tree/master/satellites-service) (Rust)
    
-   [auth-service](https://github.com/rkudryashov/graphql-rust-demo/tree/master/auth-service) (Rust)
    
-   [apollo-server](https://github.com/rkudryashov/graphql-rust-demo/tree/master/apollo-server) (JS)
    

Существуют две основных библиотеки для разработки GraphQL сервера на Rust: [Juniper](https://github.com/graphql-rust/juniper) и [Async-graphql](https://github.com/async-graphql/async-graphql), но только последняя поддерживает Apollo Federation, поэтому она была выбрана для реализации проекта (есть также открытый [запрос](https://github.com/graphql-rust/juniper/issues/376) на реализацию поддержки Federation в Juniper). Обе библиотеки предлагают [code-first](https://blog.logrocket.com/code-first-vs-schema-first-development-graphql/) подход.

Помимо этого использованы PostgreSQL — для реализации слоя данных, [JWT](https://jwt.io/) — для аутентификации и Kafka — для асинхронного обмена сообщениями.

### Стэк технологий

В следующей таблице показан стэк основных технологий, использованных в проекте:

Тип

Название

Сайт

GitHub

Язык программирования

Rust

[link](https://www.rust-lang.org/)

[link](https://github.com/rust-lang/rust)

GraphQL библиотека

Async-graphql

[link](https://async-graphql.github.io/async-graphql/en/index.html)

[link](https://github.com/async-graphql/async-graphql)

Единая GraphQL точка доступа

Apollo Server

[link](https://www.apollographql.com/docs/apollo-server/)

[link](https://github.com/apollographql/apollo-server)

Web фреймворк

actix-web

[link](https://actix.rs/)

[link](https://github.com/actix/actix-web)

База даных

PostgreSQL

[link](https://www.postgresql.org/)

[link](https://github.com/postgres/postgres)

Брокер сообщений

Apache Kafka

[link](https://kafka.apache.org/)

[link](https://github.com/apache/kafka)

Оркестрация контейнеров

Docker Compose

[link](https://docs.docker.com/compose/)

[link](https://github.com/docker/compose)

Также некоторые использованные Rust библиотеки:

Тип

Название

Сайт

GitHub

ORM

Diesel

[link](https://diesel.rs/)

[link](https://github.com/diesel-rs/diesel)

Kafka клиент

rust-rdkafka

[link](https://crates.io/crates/rdkafka)

[link](https://github.com/fede1024/rust-rdkafka)

Хэширование паролей

argonautica

[link](https://crates.io/crates/argonautica)

[link](https://github.com/bcmyers/argonautica)

JWT библиотека

jsonwebtoken

[link](https://crates.io/crates/jsonwebtoken)

[link](https://github.com/Keats/jsonwebtoken)

Библиотека для тестирования

Testcontainers-rs

[link](https://crates.io/crates/testcontainers)

[link](https://github.com/testcontainers/testcontainers-rs)

### Необходимое ПО

Чтобы запустить проект локально, вам нужен только Docker Compose. В противном случае вам может понадобиться следующее:

-   [Rust](https://www.rust-lang.org/tools/install)
    
-   [Diesel CLI](https://diesel.rs/guides/getting-started/) (для установки выполните `cargo install diesel_cli --no-default-features --features postgres`)
    
-   [LLVM](https://releases.llvm.org/download.html) (это нужно для работы крэйта `argonautica`)
    
-   [CMake](https://cmake.org/install/) (это нужно для работы крэйта `rust-rdkafka`)
    
-   [PostgreSQL](https://www.postgresql.org/download/)
    
-   [Apache Kafka](https://kafka.apache.org/quickstart)
    
-   [npm](https://www.npmjs.com/get-npm)
    

## Реализация

В `Cargo.toml` в корне проекта указаны три приложения и одна библиотека:

_Root_ [_Cargo.toml_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/Cargo.toml)

```
[workspace]
members = [
    "auth-service",
    "planets-service",
    "satellites-service",
    "common-utils",
]
```

Начнём с `planets-service`.

### Зависимости

`Cargo.toml` выглядит так:

[_Cargo.toml_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/Cargo.toml)

```
[package]
name = "planets-service"
version = "0.1.0"
edition = "2018"

[dependencies]
common-utils = { path = "../common-utils" }
async-graphql = "2.4.3"
async-graphql-actix-web = "2.4.3"
actix-web = "3.3.2"
actix-rt = "1.1.1"
actix-web-actors = "3.0.0"
futures = "0.3.8"
async-trait = "0.1.42"
bigdecimal = { version = "0.1.2", features = ["serde"] }
serde = { version = "1.0.118", features = ["derive"] }
serde_json = "1.0.60"
diesel = { version = "1.4.5", features = ["postgres", "r2d2", "numeric"] }
diesel_migrations = "1.4.0"
dotenv = "0.15.0"
strum = "0.20.0"
strum_macros = "0.20.1"
rdkafka = { version = "0.24.0", features = ["cmake-build"] }
async-stream = "0.3.0"
lazy_static = "1.4.0"

[dev-dependencies]
jsonpath_lib = "0.2.6"
testcontainers = "0.9.1"
```

`async-graphql` — это GraphQL библиотека, `actix-web` — web фреймворк, а `async-graphql-actix-web` обеспечивает интеграцию между ними.

### Ключевые функции

Начнём с `main.rs`:

[_main.rs_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/main.rs)

```
#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let pool = create_connection_pool();
    run_migrations(&pool);

    let schema = create_schema_with_context(pool);

    HttpServer::new(move || App::new()
        .configure(configure_service)
        .data(schema.clone())
    )
        .bind("0.0.0.0:8001")?
        .run()
        .await
}
```

Здесь окружение и HTTP сервер конфигурируются с помощью функций, определённых в `lib.rs`:

[_lib.rs_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/lib.rs)

```
pub fn configure_service(cfg: &mut web::ServiceConfig) {
    cfg
        .service(web::resource("/")
            .route(web::post().to(index))
            .route(web::get().guard(guard::Header("upgrade", "websocket")).to(index_ws))
            .route(web::get().to(index_playground))
        );
}

async fn index(schema: web::Data<AppSchema>, http_req: HttpRequest, req: Request) -> Response {
    let mut query = req.into_inner();

    let maybe_role = common_utils::get_role(http_req);
    if let Some(role) = maybe_role {
        query = query.data(role);
    }

    schema.execute(query).await.into()
}

async fn index_ws(schema: web::Data<AppSchema>, req: HttpRequest, payload: web::Payload) -> Result<HttpResponse> {
    WSSubscription::start(Schema::clone(&*schema), &req, payload)
}

async fn index_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/").subscription_endpoint("/")))
}

pub fn create_schema_with_context(pool: PgPool) -> Schema<Query, Mutation, Subscription> {
    let arc_pool = Arc::new(pool);
    let cloned_pool = Arc::clone(&arc_pool);
    let details_batch_loader = Loader::new(DetailsBatchLoader {
        pool: cloned_pool
    }).with_max_batch_size(10);

    let kafka_consumer_counter = Mutex::new(0);

    Schema::build(Query, Mutation, Subscription)
        .data(arc_pool)
        .data(details_batch_loader)
        .data(kafka::create_producer())
        .data(kafka_consumer_counter)
        .finish()
}
```

Эти функции делают следующее:

-   `index` — обрабатывает GraphQL [запросы (query) и мутации](https://graphql.org/learn/queries/)
    
-   `index_ws` — обрабатывает GraphQL [подписки](https://www.apollographql.com/docs/react/data/subscriptions/)
    
-   `index_playground` — предоставляет Playground GraphQL IDE
    
-   `create_schema_with_context` — создаёт GraphQL схему с глобальным контекстом доступным в рантайме, например, пул соединений с БД
    

### Определение GraphQL запроса и типа

Рассмотрим как определить запрос:

[_Определение запроса_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[Object]
impl Query {
    async fn get_planets(&self, ctx: &Context<'_>) -> Vec<Planet> {
        repository::get_all(&get_conn_from_ctx(ctx)).expect("Can't get planets")
            .iter()
            .map(|p| { Planet::from(p) })
            .collect()
    }

    async fn get_planet(&self, ctx: &Context<'_>, id: ID) -> Option<Planet> {
        find_planet_by_id_internal(ctx, id)
    }

    #[graphql(entity)]
    async fn find_planet_by_id(&self, ctx: &Context<'_>, id: ID) -> Option<Planet> {
        find_planet_by_id_internal(ctx, id)
    }
}

fn find_planet_by_id_internal(ctx: &Context<'_>, id: ID) -> Option<Planet> {
    let id = id.to_string().parse::<i32>().expect("Can't get id from String");
    repository::get(id, &get_conn_from_ctx(ctx)).ok()
        .map(|p| { Planet::from(&p) })
}
```

Эти запросы получают данные из БД используя слой репозитория. Полученные сущности конвертируются в GraphQL DTO (это позволяет соблюсти принцип единственной ответственности для каждой структуры). Запросы `get_planets` и `get_planet` могут быть выполнены из любой GraphQL IDE например так:

_Пример использования запроса_

```
{
  getPlanets {
    name
    type
  }
}
```

Структура `Planet` определена так:

[_Определение GraphQL типа_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[derive(Serialize, Deserialize)]
struct Planet {
    id: ID,
    name: String,
    planet_type: PlanetType,
}

#[Object]
impl Planet {
    async fn id(&self) -> &ID {
        &self.id
    }

    async fn name(&self) -> &String {
        &self.name
    }

    /// From an astronomical point of view
    #[graphql(name = "type")]
    async fn planet_type(&self) -> &PlanetType {
        &self.planet_type
    }

    #[graphql(deprecation = "Now it is not in doubt. Do not use this field")]
    async fn is_rotating_around_sun(&self) -> bool {
        true
    }

    async fn details(&self, ctx: &Context<'_>) -> Details {
        let loader = ctx.data::<Loader<i32, Details, DetailsBatchLoader>>().expect("Can't get loader");
        let planet_id = self.id.to_string().parse::<i32>().expect("Can't convert id");
        loader.load(planet_id).await
    }
}
```

В `impl` определяется резолвер для каждого поля. Также для некоторых полей определены описание (в виде Rust комментария) и deprecation reason. Это будет отображено в GraphQL IDE.

### Проблема N+1

В случае _наивной_ реализации функции `Planet.details` выше возникла бы проблема N+1, то есть, при выполнении такого запроса:

_Пример возможного ресурсоёмкого GraphQL запроса_

```
{
  getPlanets {
    name
    details {
      meanRadius
    }
  }
}
```

для поля `details` каждой из планет был бы сделан отдельный SQL запрос, т. к. `Details` — отдельная от `Planet` сущность и хранится в собственной таблице.

Но с помощью [DataLoader](https://github.com/graphql/dataloader), реализованного в Async-graphql, резолвер `details` может быть определён так:

[_Определение резолвера_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
async fn details(&self, ctx: &Context<'_>) -> Result<Details> {
    let data_loader = ctx.data::<DataLoader<DetailsLoader>>().expect("Can't get data loader");
    let planet_id = self.id.to_string().parse::<i32>().expect("Can't convert id");
    let details = data_loader.load_one(planet_id).await?;
    details.ok_or_else(|| "Not found".into())
}
```

`data_loader` — это объект в контектсе приложения, определённый так:

[_Определение DataLoader'а_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/lib.rs)

```
let details_data_loader = DataLoader::new(DetailsLoader {
    pool: cloned_pool
}).max_batch_size(10);
```

`DetailsLoader` реализован следующим образом:

[_DetailsLoader definition_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
pub struct DetailsLoader {
    pub pool: Arc<PgPool>
}

#[async_trait::async_trait]
impl Loader<i32> for DetailsLoader {
    type Value = Details;
    type Error = Error;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        let conn = self.pool.get().expect("Can't get DB connection");
        let details = repository::get_details(keys, &conn).expect("Can't get planets' details");

        Ok(details.iter()
            .map(|details_entity| (details_entity.planet_id, Details::from(details_entity)))
            .collect::<HashMap<_, _>>())
    }
}
```

Такой подход позволяет предотвратить проблему N+1, т. к. каждый вызов `DetailsLoader.load` выполняет только один SQL запрос, возвращающий пачку `DetailsEntity`.

### Определение интерфейса

GraphQL интерфейс и его реализации могут быть определены следующим образом:

[_Определение GraphQL интерфейса_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[derive(Interface, Clone)]
#[graphql(
    field(name = "mean_radius", type = "&CustomBigDecimal"),
    field(name = "mass", type = "&CustomBigInt"),
)]
pub enum Details {
    InhabitedPlanetDetails(InhabitedPlanetDetails),
    UninhabitedPlanetDetails(UninhabitedPlanetDetails),
}

#[derive(SimpleObject, Clone)]
pub struct InhabitedPlanetDetails {
    mean_radius: CustomBigDecimal,
    mass: CustomBigInt,
    /// In billions
    population: CustomBigDecimal,
}

#[derive(SimpleObject, Clone)]
pub struct UninhabitedPlanetDetails {
    mean_radius: CustomBigDecimal,
    mass: CustomBigInt,
}
```

Здесь вы также можете видеть, что если в структуре нет ни одного поля со "сложным" резолвером, то она может быть реализована с использованием атрибута `SimpleObject`.

### Определение кастомного скалярного типа

Кастомные скаляры позволяют определить как представлять и как парсить значения определённого типа. Проект содержит два примера определения кастомных скаляров; оба являются обёртками для числовых структур (т. к. невозможно определить внешний трейт на внешней структуре из-за [_orphan rule_](https://doc.rust-lang.org/book/ch10-02-traits.html#implementing-a-trait-on-a-type)). Эти обёртки определены так:

[_Кастомный скаляр: обёртка для BigInt_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[derive(Clone)]
pub struct CustomBigInt(BigDecimal);

#[Scalar(name = "BigInt")]
impl ScalarType for CustomBigInt {
    fn parse(value: Value) -> InputValueResult<Self> {
        match value {
            Value::String(s) => {
                let parsed_value = BigDecimal::from_str(&s)?;
                Ok(CustomBigInt(parsed_value))
            }
            _ => Err(InputValueError::expected_type(value)),
        }
    }

    fn to_value(&self) -> Value {
        Value::String(format!("{:e}", &self))
    }
}

impl LowerExp for CustomBigInt {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let val = &self.0.to_f64().expect("Can't convert BigDecimal");
        LowerExp::fmt(val, f)
    }
}
```

[_Кастомный скаляр: обёртка для BigDecimal_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[derive(Clone)]
pub struct CustomBigDecimal(BigDecimal);

#[Scalar(name = "BigDecimal")]
impl ScalarType for CustomBigDecimal {
    fn parse(value: Value) -> InputValueResult<Self> {
        match value {
            Value::String(s) => {
                let parsed_value = BigDecimal::from_str(&s)?;
                Ok(CustomBigDecimal(parsed_value))
            }
            _ => Err(InputValueError::expected_type(value)),
        }
    }

    fn to_value(&self) -> Value {
        Value::String(self.0.to_string())
    }
}
```

В первом примере также показано, как представить гигантское число в виде экспоненциальной записи.

### Определение мутации

Мутация может быть определена следующим образом:

[_Определение мутации_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
pub struct Mutation;

#[Object]
impl Mutation {
    #[graphql(guard(RoleGuard(role = "Role::Admin")))]
    async fn create_planet(&self, ctx: &Context<'_>, planet: PlanetInput) -> Result<Planet, Error> {
        let new_planet = NewPlanetEntity {
            name: planet.name,
            planet_type: planet.planet_type.to_string(),
        };

        let details = planet.details;
        let new_planet_details = NewDetailsEntity {
            mean_radius: details.mean_radius.0,
            mass: BigDecimal::from_str(&details.mass.0.to_string()).expect("Can't get BigDecimal from string"),
            population: details.population.map(|wrapper| { wrapper.0 }),
            planet_id: 0,
        };

        let created_planet_entity = repository::create(new_planet, new_planet_details, &get_conn_from_ctx(ctx))?;

        let producer = ctx.data::<FutureProducer>().expect("Can't get Kafka producer");
        let message = serde_json::to_string(&Planet::from(&created_planet_entity)).expect("Can't serialize a planet");
        kafka::send_message(producer, message).await;

        Ok(Planet::from(&created_planet_entity))
    }
}
```

Чтобы использовать объект как входной параметр мутации, надо определить структуру следующим образом:

[_Определение input type_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[derive(InputObject)]
struct PlanetInput {
    name: String,
    #[graphql(name = "type")]
    planet_type: PlanetType,
    details: DetailsInput,
}
```

Мутация защищена `RoleGuard`'ом, который гарантирует что только пользователи с ролью `Admin` могут выполнить её. Таким образом, для выполнения, например, следующей мутации:

_Пример использования мутации_

```
mutation {
  createPlanet(
    planet: {
      name: "test_planet"
      type: TERRESTRIAL_PLANET
      details: { meanRadius: "10.5", mass: "8.8e24", population: "0.5" }
    }
  ) {
    id
  }
}
```

вам нужно указать заголовок `Authorization` с JWT, полученным из `auth-service` (это будет описано далее).

### Определение подписки

В определении мутации выше вы могли видеть что при добавлении новой планеты отправляется сообщение:

[_Отправка сообщения в Kafka_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
let producer = ctx.data::<FutureProducer>().expect("Can't get Kafka producer");
let message = serde_json::to_string(&Planet::from(&created_planet_entity)).expect("Can't serialize a planet");
kafka::send_message(producer, message).await;
```

Клиент API может быть уведомлен об этом событии с помощью подписки, слушающей Kafka consumer:

[_Определение подписки_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
pub struct Subscription;

#[Subscription]
impl Subscription {
    async fn latest_planet<'ctx>(&self, ctx: &'ctx Context<'_>) -> impl Stream<Item=Planet> + 'ctx {
        let kafka_consumer_counter = ctx.data::<Mutex<i32>>().expect("Can't get Kafka consumer counter");
        let consumer_group_id = kafka::get_kafka_consumer_group_id(kafka_consumer_counter);
        let consumer = kafka::create_consumer(consumer_group_id);

        async_stream::stream! {
            let mut stream = consumer.start();

            while let Some(value) = stream.next().await {
                yield match value {
                    Ok(message) => {
                        let payload = message.payload().expect("Kafka message should contain payload");
                        let message = String::from_utf8_lossy(payload).to_string();
                        serde_json::from_str(&message).expect("Can't deserialize a planet")
                    }
                    Err(e) => panic!("Error while Kafka message processing: {}", e)
                };
            }
        }
    }
}
```

Подписка может быть использована так же, как запросы и мутации:

_Пример использования подписки_

```
subscription {
  latestPlanet {
    id
    name
    type
    details {
      meanRadius
    }
  }
}
```

Подписки должны отправляться на `ws://localhost:8001`.

### Интеграционные тесты

Тесты запросов и мутаций можно написать так:

[_Тест запроса_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/tests/query_tests.rs)

```
#[actix_rt::test]
async fn test_get_planets() {
    let docker = Cli::default();
    let (_pg_container, pool) = common::setup(&docker);

    let mut service = test::init_service(App::new()
        .configure(configure_service)
        .data(create_schema_with_context(pool))
    ).await;

    let query = "
        {
            getPlanets {
                id
                name
                type
                details {
                    meanRadius
                    mass
                    ... on InhabitedPlanetDetails {
                        population
                    }
                }
            }
        }
        ".to_string();

    let request_body = GraphQLCustomRequest {
        query,
        variables: Map::new(),
    };

    let request = test::TestRequest::post().uri("/").set_json(&request_body).to_request();

    let response: GraphQLCustomResponse = test::read_response_json(&mut service, request).await;

    fn get_planet_as_json(all_planets: &serde_json::Value, index: i32) -> &serde_json::Value {
        jsonpath::select(all_planets, &format!("$.getPlanets[{}]", index)).expect("Can't get planet by JSON path")[0]
    }

    let mercury_json = get_planet_as_json(&response.data, 0);
    common::check_planet(mercury_json, 1, "Mercury", "TERRESTRIAL_PLANET", "2439.7");

    let earth_json = get_planet_as_json(&response.data, 2);
    common::check_planet(earth_json, 3, "Earth", "TERRESTRIAL_PLANET", "6371.0");

    let neptune_json = get_planet_as_json(&response.data, 7);
    common::check_planet(neptune_json, 8, "Neptune", "ICE_GIANT", "24622.0");
}
```

Если часть запроса может быть переиспользована в другом запросе, вы можете использовать [фрагменты](https://graphql.org/learn/queries/#fragments):

[_Тест запроса с использованием фрагмента_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/tests/query_tests.rs)

```
const PLANET_FRAGMENT: &str = "
    fragment planetFragment on Planet {
        id
        name
        type
        details {
            meanRadius
            mass
            ... on InhabitedPlanetDetails {
                population
            }
        }
    }
";

#[actix_rt::test]
async fn test_get_planet_by_id() {
    ...

    let query = "
        {
            getPlanet(id: 3) {
                ... planetFragment
            }
        }
        ".to_string() + PLANET_FRAGMENT;

    let request_body = GraphQLCustomRequest {
        query,
        variables: Map::new(),
    };

    ...
}
```

Чтобы использовать [переменные](https://graphql.org/learn/queries/#variables), запишите тест так:

[_Тест запроса с использованием фрагмента и переменной_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/tests/query_tests.rs)

```
#[actix_rt::test]
async fn test_get_planet_by_id_with_variable() {
    ...

    let query = "
        query testPlanetById($planetId: String!) {
            getPlanet(id: $planetId) {
                ... planetFragment
            }
        }".to_string() + PLANET_FRAGMENT;

    let jupiter_id = 5;
    let mut variables = Map::new();
    variables.insert("planetId".to_string(), jupiter_id.into());

    let request_body = GraphQLCustomRequest {
        query,
        variables,
    };

    ...
}
```

В этом проекте используется библиотека `Testcontainers-rs`, что позволяет подготовить тестовое окружение, то есть, создать временную БД PostgreSQL.

### Клиент к GraphQL API

Вы можете использовать код из предыдущего раздела для создания клиента к внешнему GraphQL API. Также для этого существуют специальные библиотеки, например, [graphql-client](https://github.com/graphql-rust/graphql-client), но я их не использовал.

### Безопасность API

Существуют различные угрозы безопасности GraphQL API (см. [список](https://leapgraph.com/graphql-api-security)); рассмотрим некоторые из них.

#### Ограничения глубины и сложности запроса

Если бы структура `Satellite` содержала поле `planet`, был бы возможен такой запрос:

_Пример тяжёлого запроса_

```
{
  getPlanet(id: "1") {
    satellites {
      planet {
        satellites {
          planet {
            satellites {
              ... # more deep nesting!
            }
          }
        }
      }
    }
  }
}
```

Сделать такой запрос невалидным можно так:

[_Пример ограничения глубины и сложности запроса_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/lib.rs)

```
pub fn create_schema_with_context(pool: PgPool) -> Schema<Query, Mutation, Subscription> {
    ...

    Schema::build(Query, Mutation, Subscription)
        .limit_depth(3)
        .limit_complexity(15)

    ...
}
```

Стоит отметить, что при указании ограничений выше может перестать отображаться документация сервиса в GraphQL IDE. Это происходит потому, что IDE пытается выполнить introspection query, который имеет заметные глубину и сложность.

#### Аутентификация

Эта функциональность реализована в `auth-service` с использованием крэйтов `argonautica` и `jsonwebtoken`. Первый отвечает за хэширование паролей пользователей с использованием алгоритма [Argon2](https://en.wikipedia.org/wiki/Argon2). Аутентификация и авторизация показаны исключительно в демонстрационных целях; пожалуйста, изучите вопрос более тщательно перед использованием в продакшене.

Рассмотрим как реализован вход в систему:

[_Реализация входа в систему_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/auth-service/src/graphql.rs)

```
pub struct Mutation;

#[Object]
impl Mutation {

    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<String, Error> {
        let maybe_user = repository::get_user(&input.username, &get_conn_from_ctx(ctx)).ok();

        if let Some(user) = maybe_user {
            if let Ok(matching) = verify_password(&user.hash, &input.password) {
                if matching {
                    let role = AuthRole::from_str(user.role.as_str()).expect("Can't convert &str to AuthRole");
                    return Ok(common_utils::create_token(user.username, role));
                }
            }
        }

        Err(Error::new("Can't authenticate a user"))
    }
}

#[derive(InputObject)]
struct SignInInput {
    username: String,
    password: String,
}
```

Посмотреть реализацию функции `verify_password` можно в [модуле](https://github.com/rkudryashov/graphql-rust-demo/blob/master/auth-service/src/utils.rs) `utils`, `create_token` в [модуле](https://github.com/rkudryashov/graphql-rust-demo/blob/master/common-utils/src/lib.rs) `common_utils`. Как вы могли бы ожидать, функция `sign_in` возвращает JWT, который в дальнейшем может быть использован для авторизации в других сервисах.

Для получения JWT выполните следующую мутацию:

_Получение JWT_

```
mutation {
  signIn(input: { username: "john_doe", password: "password" })
}
```

Используйте параметры _john_doe/password_. Включение полученного JWT в последующие запросы позволит получить доступ к защищённым ресурсам (см. следующий раздел).

#### Авторизация

Чтобы запросить защищённые данные, добавьте заголовок в HTTP запрос в формате `Authorization: Bearer $JWT`. Функция `index` извлечёт роль пользователя из HTTP запроса и добавит её в параметры GraphQL запроса/мутации:

[_Получение роли_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/lib.rs)

```
async fn index(schema: web::Data<AppSchema>, http_req: HttpRequest, req: Request) -> Response {
    let mut query = req.into_inner();

    let maybe_role = common_utils::get_role(http_req);
    if let Some(role) = maybe_role {
        query = query.data(role);
    }

    schema.execute(query).await.into()
}
```

К ранее показанной мутации `create_planet` применён следующий атрибут:

[_Использование гарда_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
#[graphql(guard(RoleGuard(role = "Role::Admin")))]
```

Сам гард реализован так:

[_Реализация гарда_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs)

```
struct RoleGuard {
    role: Role,
}

#[async_trait::async_trait]
impl Guard for RoleGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        if ctx.data_opt::<Role>() == Some(&self.role) {
            Ok(())
        } else {
            Err("Forbidden".into())
        }
    }
}
```

Таким образом, если вы не укажете токен, сервер ответит сообщением "Forbidden".

### Определение перечисления

GraphQL перечисление может быть определено так:

[_Определение перечисления_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/satellites-service/src/graphql.rs)

```
#[derive(SimpleObject)]
struct Satellite {
    ...
    life_exists: LifeExists,
}

#[derive(Copy, Clone, Eq, PartialEq, Debug, Enum, EnumString)]
#[strum(serialize_all = "SCREAMING_SNAKE_CASE")]
pub enum LifeExists {
    Yes,
    OpenQuestion,
    NoData,
}
```

### Работа с датами

Async-graphql поддерживает типы даты/времени из библиотеки `chrono`, поэтому вы можете определить такие поля как обычно:

[_Определение поля с датой_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/satellites-service/src/graphql.rs)

```
#[derive(SimpleObject)]
struct Satellite {
    ...
    first_spacecraft_landing_date: Option<NaiveDate>,
}
```

### Поддержка Apollo Federation

Одна из целей `satellites-service` — продемонстрировать как распределённая GraphQL [_сущность_](https://www.apollographql.com/docs/federation/entities/) (`Planet`) может резолвиться в двух (или более) сервисах и затем запрашиваться через Apollo Server.

Тип `Planet` был ранее определён в `planets-service` так:

[_Определение типа_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs) `Planet` в `planets-service`

```
#[derive(Serialize, Deserialize)]
struct Planet {
    id: ID,
    name: String,
    planet_type: PlanetType,
}
```

Также в `planets-service` тип `Planet` является сущностью:

[_Определение сущности_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/planets-service/src/graphql.rs) `Planet`

```
#[Object]
impl Query {
    #[graphql(entity)]
    async fn find_planet_by_id(&self, ctx: &Context<'_>, id: ID) -> Option<Planet> {
        find_planet_by_id_internal(ctx, id)
    }
}
```

`satellites-service` расширяет сущность `Planet` путём добавления поля `satellites`:

[_Расширение типа_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/satellites-service/src/graphql.rs) `Planet` в `satellites-service`

```
struct Planet {
    id: ID
}

#[Object(extends)]
impl Planet {
    #[graphql(external)]
    async fn id(&self) -> &ID {
        &self.id
    }

    async fn satellites(&self, ctx: &Context<'_>) -> Vec<Satellite> {
        let id = self.id.to_string().parse::<i32>().expect("Can't get id from String");
        repository::get_by_planet_id(id, &get_conn_from_ctx(ctx)).expect("Can't get satellites of planet")
            .iter()
            .map(|e| { Satellite::from(e) })
            .collect()
    }
}
```

Также вам нужно реализовать функцию поиска для расширяемого типа. В примере ниже функция просто создаёт новый инстанс `Planet`:

[_Функция поиска для типа_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/satellites-service/src/graphql.rs) `Planet`

```
#[Object]
impl Query {

    #[graphql(entity)]
    async fn get_planet_by_id(&self, id: ID) -> Planet {
        Planet { id }
    }
}
```

Async-graphql генерирует два дополнительных запроса (`_service` and `_entities`), которые будут использованы Apollo Server'ом. Эти запросы — внутренние, то есть они не будут отображены в API Apollo Server'а. Конечно, сервис с поддержкой Apollo Federation по-прежнему может работать автономно.

### Apollo Server

Apollo Server и Apollo Federation позволяют достичь две основные цели:

-   создать единую точку доступа к нескольким GraphQL API
    
-   создать единый граф данных из распределённых сущностей
    

Таким образом, даже если вы не используете распределённые сущности, для frontend разработчиков удобнее использовать одну точку доступа, чем несколько.

Существует и другой способ создания единой GraphQL схемы, [schema stitching](https://www.graphql-tools.com/docs/schema-stitching/), но пока что я его не использовал.

Модуль включает следующий исходный код:

[_Мета-информация и зависимости_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/apollo-server/package.json)

```
{
  "name": "api-gateway",
  "main": "gateway.js",
  "scripts": {
    "start-gateway": "nodemon gateway.js"
  },
  "devDependencies": {
    "concurrently": "5.3.0",
    "nodemon": "2.0.6"
  },
  "dependencies": {
    "@apollo/gateway": "0.21.3",
    "apollo-server": "2.19.0",
    "graphql": "15.4.0"
  }
}
```

[_Определение Apollo Server_](https://github.com/rkudryashov/graphql-rust-demo/blob/master/apollo-server/gateway.js)

```
const {ApolloServer} = require("apollo-server");
const {ApolloGateway, RemoteGraphQLDataSource} = require("@apollo/gateway");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({request, context}) {
        if (context.authHeaderValue) {
            request.http.headers.set('Authorization', context.authHeaderValue);
        }
    }
}

let node_env = process.env.NODE_ENV;

function get_service_url(service_name, port) {
    let host;
    switch (node_env) {
        case 'docker':
            host = service_name;
            break;
        case 'local': {
            host = 'localhost';
            break
        }
    }

    return "http://" + host + ":" + port;
}

const gateway = new ApolloGateway({
    serviceList: [
        {name: "planets-service", url: get_service_url("planets-service", 8001)},
        {name: "satellites-service", url: get_service_url("satellites-service", 8002)},
        {name: "auth-service", url: get_service_url("auth-service", 8003)},
    ],
    buildService({name, url}) {
        return new AuthenticatedDataSource({url});
    },
});

const server = new ApolloServer({
    gateway, subscriptions: false, context: ({req}) => ({
        authHeaderValue: req.headers.authorization
    })
});

server.listen({host: "0.0.0.0", port: 4000}).then(({url}) => {
    console.log(`? Server ready at ${url}`);
});
```

Если код выше может быть упрощён, не стесняйтесь поправить.

Авторизация в `apollo-service` работает так же, как было показано ранее для Rust сервисов (вам надо указать заголовок `Authorization` и его значение).

Приложение, написанное на любом языке или фреймворке, может быть добавлено в качестве нижележащего сервиса под Apollo Server, если оно реализует [спецификацию Federation](https://www.apollographql.com/docs/federation/federation-spec/); список библиотек, добавляющих поддержку этой спецификации доступен в [документации](https://www.apollographql.com/docs/federation/other-servers/).

При реализации модуля я столкнулся со следующими ограничениями:

-   Apollo Gateway [не поддерживает](https://github.com/apollographql/apollo-server/issues/3357) подписки (но они по-прежнему работают в standalone Rust сервисе)
    
-   сервису, пытающемуся расширить GraphQL интерфейс [требуется информация о его конкретных имплементациях](https://github.com/apollographql/apollo-server/issues/2849)
    

### Взаимодействие с БД

Уровень хранения реализован с помощью PostgreSQL and Diesel. Если вы не используете Docker при локальном запуске, то нужно выполнить `diesel setup`, находясь в директории каждого из сервисов. Это создаст пустую БД, к которой далее будут применены миграции, создающие таблицы и инициализирующие данные.

### Запуск проекта и тестирование API

Как было отмечено ранее, проект можно запустить двумя способами:

-   с использованием Docker Compose ([docker-compose.yml](https://github.com/rkudryashov/graphql-rust-demo/blob/master/docker-compose.yml))
    
    Здесь, в свою очередь, также возможны два варианта:
    
    -   режим разработки (используя локально собранные образы)
        
        `docker-compose up --build`
        
    -   production mode (используя релизные образы)
        
        `docker-compose -f docker-compose.yml up`
        
-   без Docker
    
    Запустите каждый Rust сервис с помощью `cargo run`, потом запустите Apollo Server:
    
    -   `cd` в папку `apollo-server`
        
    -   определите переменную среды `NODE_ENV`, например, `set NODE_ENV=local` (для Windows)
        
    -   `npm install`
        
    -   `npm run start-gateway`
        

Успешный запуск `apollo-server` должен выглядеть так:

_Лог запуска Apollo Server_

```
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node gateway.js`
Server ready at http://0.0.0.0:4000/
```

Вы можете перейти на `http://localhost:4000` в браузере и использовать встроенную Playground IDE:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/fdf/52c/53b/fdf52c53bf8835a98aaab0f5ef04256c.png)

Здесь возможно выполнять запросы, мутации и подписки, определённые в нижележащих сервисах. Кроме того, каждый из этих сервисов имеет собственную Playground IDE.

### Тест подписки

Чтобы убедиться в том, что подписка работает, откройте две вкладки любой GraphQL IDE; в первой подпишитесь таким образом:

_Пример подписки_

```
subscription {
  latestPlanet {
    name
    type
  }
}
```

Во второй укажите заголовок `Authorization` как было описано ранее и выполните мутацию:

_Пример мутации_

```
mutation {
  createPlanet(
    planet: {
      name: "Pluto"
      type: DWARF_PLANET
      details: { meanRadius: "1188", mass: "1.303e22" }
    }
  ) {
    id
  }
}
```

Подписанный клиент будет уведомлен о событии:

![](https://habrastorage.org/getpro/habr/upload_files/2df/bcf/421/2dfbcf4219935882b3ad6c3483bcb53e.gif)

### CI/CD

CI/CD сконфигурирован с помощью GitHub Actions ([workflow](https://github.com/rkudryashov/graphql-rust-demo/blob/master/.github/workflows/workflow.yml)), который запускает тесты приложений, собирает их Docker образы и разворачивает их на Google Cloud Platform.

Вы можете посмотреть на описанные API [здесь](http://demo.romankudryashov.com/).

**Замечание:** На "продакшн" среде пароль отличается от указанного ранее, чтобы предотвратить изменение данных.

## Заключение

В этой статье я рассмотрел как решать наиболее частые вопросы, которые могут возникнуть при разработке GraphQL API на Rust. Также было показано как объединить API Rust GraphQL микросервисов для получения единого GraphQL интерфейса; в подобной архитектуре сущность может быть распределена среди нескольких микросервисов. Это достигается за счёт использования Apollo Server, Apollo Federation и библиотеки Async-graphql. Исходный код рассмотренного проекта доступен на [GitHub](https://github.com/rkudryashov/graphql-rust-demo). Не стесняйтесь написать мне, если найдёте ошибки в статье или исходном коде. Благодарю за внимание!

## Полезные ссылки

-   [graphql.org](https://graphql.org/)
    
-   [spec.graphql.org](https://spec.graphql.org/)
    
-   [graphql.org/learn/best-practices](https://graphql.org/learn/best-practices/)
    
-   [howtographql.com](https://www.howtographql.com/)
    
-   [Async-graphql](https://github.com/async-graphql/async-graphql)
    
-   [Async-graphql book](https://async-graphql.github.io/async-graphql/en/index.html)
    
-   [Awesome GraphQL](https://github.com/chentsulin/awesome-graphql)
    
-   [Public GraphQL APIs](https://github.com/APIs-guru/graphql-apis)
    
-   [Apollo Federation demo](https://github.com/apollographql/federation-demo)