## напиши мне список кнги со ссылками по python FastAPI

Вот список книг по FastAPI на Python:

1. "FastAPI: Web Development with Python and FastAPI" автора Michael Herman (https://www.manning.com/books/fastapi-web-development-with-python-and-fastapi)

2. "FastAPI Quick Start Guide: Build and Deploy Your Web Applications using Python and FastAPI" автора Kaviraj K (https://www.packtpub.com/product/fastapi-quick-start-guide/9781801077641)

3. "Building REST APIs with Python: Using Flask, Connexion, and SQLAlchemy" автора Daniel Gaspar (https://www.amazon.com/Building-REST-APIs-Python-Connexion/dp/1484250212)

4. "Flask Web Development: Developing Web Applications with Python" автора Miguel Grinberg (https://www.amazon.com/Flask-Web-Development-Developing-Applications/dp/1491991739)

5. "Django 3 By Example: Build powerful and reliable Python web applications from scratch" автора Antonio Mele (https://www.packtpub.com/product/django-3-by-example/9781838981952)

Хотя эти книги не посвящены исключительно FastAPI, они могут предоставить ценную информацию о создании веб-приложений на Python в целом. Кроме того, FastAPI имеет документацию, которая является отличным источником информации и примеров кода. Она доступна на сайте https://fastapi.tiangolo.com/.

## я хочу чтобы ты подготовил 20 вопросов для экзамена по тему "python fastapi" (пиши вопрос и развернутый ответ к нему с примерами кода)

Конечно, я могу подготовить для вас 20 вопросов по теме "Python FastAPI". Вот они:

1. Что такое FastAPI? Какие преимущества он предоставляет?

Ответ: FastAPI - это фреймворк для создания веб-приложений с высокой производительностью и быстрой разработкой. Он предоставляет множество преимуществ, таких как поддержка асинхронности, автоматическая документация API, автоматическая проверка запросов и многое другое.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```


2. Как создать новый проект FastAPI?

Ответ: Чтобы создать новый проект FastAPI, нужно сначала установить FastAPI с помощью pip. Затем можно создать новый файл Python и импортировать FastAPI. После этого можно определить функции-обработчики запросов, добавить маршруты и запустить приложение.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

3. Как добавить обработчик для POST-запроса в FastAPI?

Ответ: Для добавления обработчика POST-запроса в FastAPI нужно использовать декоратор @app.post(). Внутри декоратора можно определить функцию-обработчик, который будет выполняться при POST-запросах.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    return item
```


4. Как добавить параметры запроса в FastAPI?

Ответ: Для добавления параметров запроса в FastAPI нужно использовать декоратор @app.get() или @app.post() и определить параметры внутри функции-обработчика с помощью аннотаций типа. Эти параметры будут автоматически извлекаться из запроса.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```


5. Что такое зависимости в FastAPI?

Ответ: Зависимости в FastAPI - это объекты, которые можно использовать в функциях-обработчиках, чтобы получать доступ к внешним ресурсам, таким как базы данных, кеш или конфигурационные файлы.

Пример кода:
```python
from fastapi import Depends, FastAPI

app = FastAPI()

def fake_dependency():
    return "fake_dependency"

@app.get("/")
async def root(dependency: str = Depends(fake_dependency)):
    return {"dependency": dependency}
```


6. Как добавить авторизацию в FastAPI?

Ответ: Для добавления авторизации в FastAPI можно использовать зависимости и проверять токены доступа внутри функций-обработчиков. Также можно использовать дополнительные инструменты, такие как JWT.

Пример кода:
```python
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def fake_user():
    return {"username": "johndoe", "password": "secret"}

async def authenticate_user(username: str, password: str):
    user = await fake_user()
    if username == user["username"] and password == user["password"]:
        return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user["username"], "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

7. Что такое OpenAPI и как его использовать в FastAPI?

Ответ: OpenAPI - это спецификация для описания REST API. FastAPI предоставляет встроенную поддержку OpenAPI, позволяя автоматически генерировать документацию API на основе аннотаций типа и декораторов.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
    
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```


8. Как обрабатывать ошибки в FastAPI?

Ответ: Для обработки ошибок в FastAPI можно использовать декоратор @app.exception_handler(). Внутри декоратора можно определить функцию-обработчик, который будет вызываться при возникновении исключения.

Пример кода:
```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )
```

9. Как добавить мидлвары в FastAPI?

Ответ: Для добавления мидлваров в FastAPI можно использовать метод app.middleware(). Внутри метода можно определить функцию-обработчик, который будет вызываться при каждом запросе.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

async def my_middleware(request, call_next):
    # Do something before the request is processed
    response = await call_next(request)
    # Do something after the request is processed
    return response

app.middleware(my_middleware)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```


10. Как работать с базами данных в FastAPI?

Ответ: Для работы с базами данных в FastAPI можно использовать любой совместимый ORM, такой как SQLAlchemy или Tortoise-ORM. Также можно использовать нативный драйвер базы данных.

Пример кода:
```python
from fastapi import FastAPI
from tortoise import Model, fields
from tortoise.contrib.fastapi import register_tortoise

app = FastAPI()

class Todo(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(50)
    completed = fields.BooleanField(default=False)

register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["main"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

@app.get("/todos/")
async def list_todos():
    todos = await Todo.all().values()
    return todos
```


11. Как отправлять электронные письма в FastAPI?

Ответ: Для отправки электронных писем в FastAPI можно использовать сторонние библиотеки, такие как SendGrid или SMTP. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
from fastapi import FastAPI
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.background import BackgroundTask
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = FastAPI()

@app.post("/send-email/")
async def send_email(request: Request):
    data = await request.json()
    message = Mail(
        from_email=data["from"],
        to_emails=data["to"],
        subject=data["subject"],
        html_content=data["content"],
    )
    sendgrid = SendGridAPIClient(api_key="YOUR_API_KEY")
    response = sendgrid.send(message)
    return JSONResponse(status_code=response.status_code, content={"message": "Email sent"})

def send_email_task(request: Request, data: dict):
    message = Mail(
        from_email=data["from"],
        to_emails=data["to"],
        subject=data["subject"],
        html_content=data["content"],
    )
    sendgrid = SendGridAPIClient(api_key="YOUR_API_KEY")
    response = sendgrid.send(message)

@app.post("/send-email-async/")
async def send_email_async(request: Request, background_tasks: BackgroundTask):
    data = await request.json()
    background_tasks.add_task(send_email_task, request, data)
    return JSONResponse(status_code=202, content={"message": "Email sent asynchronously"})
```


12. Как создать WebSocket-сервер в FastAPI?

Ответ: Для создания WebSocket-сервера в FastAPI можно использовать сторонние библиотеки, такие как websockets. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
from fastapi import FastAPI
from starlette.websockets import WebSocket

app = FastAPI()

@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message received: {data}")
```

13. Как добавить кеширование в FastAPI?

Ответ: Для добавления кеширования в FastAPI можно использовать сторонние библиотеки, такие как `cachetools` или `aiocache`. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
from fastapi import FastAPI
from starlette.responses import JSONResponse
from starlette.requests import Request
from cachetools import TTLCache

app = FastAPI()

cache = TTLCache(maxsize=100, ttl=30)

@app.get("/cache/")
async def cache_endpoint(request: Request):
    key = request.query_params["key"]
    if key in cache:
        return JSONResponse(status_code=200, content=cache[key])
    else:
        value = {"message": "Hello World"}
        cache[key] = value
        return JSONResponse(status_code=200, content=value)
```

14. Как добавить логирование в FastAPI?

Ответ: Для добавления логирования в FastAPI можно использовать стандартную библиотеку Python `logging`. Также можно использовать сторонние библиотеки, такие как `loguru`.

Пример кода:
```python
from fastapi import FastAPI
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)

@app.get("/")
async def root():
    logging.info("Hello World")
    return {"message": "Hello World"}
```

15. Как использовать FastAPI в Docker-контейнере?

Ответ: Для использования FastAPI в Docker-контейнере нужно сначала создать образ Docker с помощью Dockerfile. Внутри Dockerfile нужно определить базовый образ, скопировать файлы приложения и установить зависимости. Затем можно собрать образ и запустить контейнер.

Пример Dockerfile:
```
FROM python:3.9

COPY ./app /app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

16. Как использовать FastAPI с Kubernetes?

Ответ: Для использования FastAPI с Kubernetes нужно сначала создать манифесты Kubernetes, такие как Deployment и Service. Внутри манифестов нужно определить образ Docker, порт и другие конфигурационные параметры. Затем можно применить манифесты и запустить приложение в Kubernetes.

Пример манифеста Deployment:
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fastapi
  template:
    metadata:
      labels:
        app: fastapi
    spec:
      containers:
        - name: fastapi
          image: myregistry/fastapi:latest
          ports:
            - containerPort: 80
```

Пример манифеста Service:
```
apiVersion: v1
kind: Service
metadata:
  name: fastapi
spec:
  selector:
    app: fastapi
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: LoadBalancer
```

17. Как добавить метрики в FastAPI?

Ответ: Для добавления метрик в FastAPI можно использовать сторонние библиотеки, такие как `prometheus-fastapi-instrumentator`. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
from fastapi import FastAPI
from starlette_exporter import PrometheusMiddleware, handle_metrics

app = FastAPI()

app.add_middleware(PrometheusMiddleware)
app.add_route("/metrics/", handle_metrics)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

18. Как использовать FastAPI с GraphQL?

Ответ: Для использования FastAPI с GraphQL можно использовать сторонние библиотеки, такие как `ariadne` или `graphene`. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
from fastapi import FastAPI
from ariadne import QueryType, gql, make_executable_schema, graphql_sync
from ariadne.asgi import GraphQL

app = FastAPI()

type_defs = gql("""
    type Query {
        hello(name: String): String!
    }
""")

query = QueryType()

@query.field("hello")
def resolve_hello(_, info, name):
    return f"Hello {name or 'World'}!"

schema = make_executable_schema(type_defs, query)

@app.post("/graphql/")
async def graphql(request: Request):
    data = await request.json()
    success, result = graphql_sync(schema, data["query"], context_value=request, variables=data.get("variables"))
    status_code = 200 if success else 400
    return JSONResponse(status_code=status_code, content=result)
```

19. Как создать RESTful API в FastAPI?

Ответ: FastAPI поддерживает создание RESTful API через декораторы `@app.get()`, `@app.post()`, `@app.put()`, `@app.delete()` и другие. Внутри декораторов можно определить функции-обработчики запросов, которые будут выполняться при соответствующих HTTP-методах.

Пример кода:
```python
from fastapi import FastAPI

app = FastAPI()

items = []

@app.get("/items/")
async def list_items():
    return items

@app.post("/items/")
async def create_item(item: dict):
    items.append(item)
    return item

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return items[item_id]

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: dict):
    items[item_id] = item
    return item

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    item = items[item_id]
    items.pop(item_id)
    return item
```

20. Как тестировать FastAPI-приложения?

Ответ: Для тестирования FastAPI-приложений можно использовать стандартную библиотеку Python `unittest` или сторонние библиотеки, такие как `pytest`. Также можно использовать встроенную поддержку фреймворка Starlette.

Пример кода:
```python
import unittest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestApp(unittest.TestCase):
    def test_root(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})

    def test_create_item(self):
        response = client.post("/items/", json={"id": 1, "name": "item"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"id": 1, "name": "item"})

    def test_read_item(self):
        response = client.get("/items/1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"id": 1, "name": "item"})

    def test_update_item(self):
```

