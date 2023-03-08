https://habr.com/ru/post/501688/

# Additional SSR performance with Nuxt fullstack server (Часть 2)

-   [Часть 1: Nuxt as fullstack server: frontend + backend API Server](https://habr.com/ru/post/501652/)
-   **Часть 2: Additional SSR performance with Nuxt fullstack server**

  
В Части 1 я рассказал как легко организовать **API Server** в **Nuxt**. В Части 2 я хочу рассказать какие дополнительные преимущества можно извлечь из **Nuxt fullstack server**.  
  

## Часть 2: ускоряем серверный рендериг!

  
Давайте подумаем сейчас как работает наш сервер из примера [codesandbox.io/s/codesandbox-nuxt-3gzhl](https://codesandbox.io/s/codesandbox-nuxt-3gzhl)  
  

1.  Клиент запрашивает главную страницу [3gzhl.sse.codesandbox.io](https://3gzhl.sse.codesandbox.io/)
2.  **Nuxt** начинает рендерить на сервере страницу **/pages/index.vue**
3.  Доходит до  
      
    
    ```
      async fetch() {
        this.users = await this.$api("users", "index");
      },
    ```
    
4.  Через **axios** делает **http запрос**, по адресу [3gzhl.sse.codesandbox.io/api/users/index](https://3gzhl.sse.codesandbox.io/api/users/index) т.е. сам на себя
5.  Устанавливается соединение, создаётся новая сессия на сервере и выделяется память для обработки **http запроса**
6.  Принимается входящий запрос по протоколу **http**, парсится url, обрабатываются параметры
7.  Отрабатывает **серверное middleware**
8.  **Nuxt** запускает наш **API Server**
9.  Парсинг параметров в **JSON**
10.  Вызывается искомый контроллер **users.index()**, который возвращает данные **JSON**
11.  **JSON** данные преобразовываются в строку и отправляются по протоколу **http**
12.  Данные принимаются библиотекой **axios** и парсятся в **JSON**
13.  Сессия API завершается

  
Теперь представим, что у нас на странице находится 20 компонентов которые запрашивают данные через **API**, таким образом за один запрос страницы c **Nuxt** сервером будет установлено 20 дополнительных внутренних **http** соединений и пункты 4-13 будут выполнены 20 раз. **Nuxt HTTP сервер** может обрабатывать более 55 тысяч запросов в секунду, однако создавая внутренние HTTP запросы, мы уменьшаем потенциальные ресурсы сервера в десятки раз.  
  
Но ведь когда мы рендерим страницу на сервере, у нас есть прямой доступ до всех контроллеров в папке **/api/**  
  
Давайте изменим логику таким образом, чтобы при рендеренге на сервере код контроллера вызывался напрямую, а при вызове из браузера запрос шёл по **http**  
  

1.  Переименуем файл **/plugins/api-context.js** в **/plugins/api-context.client.js**
2.  изменим имя файла в настройках /nuxt.config.js  
      
    
    ```
      plugins: ["~/plugins/api-context.client.js"]
    ```
    
      
    Теперь контекст **this.$api** доступен только для клиентского кода  
    
3.  создадим контекст **this.$api** для прямого вызова контроллеров на сервере  
      
    /plugins/api-context.server.js  
    
    ```
    export default (context, inject) => {
      inject("api", async (controller, method, params) => {
        try {
          let api = require("../api/" + controller.replace(/^\/+|\/+$|\.+/g, ""));
          return await api[method](params);
        } catch (e) {
          console.error(e);
          throw e;
        }
      });
    };
    ```
    
4.  подключим серверный плагин  
      
    /nuxt.config.js  
    
    ```
      plugins: [
        "~/plugins/api-context.client.js",
        "~/plugins/api-context.server.js"
      ]
    ```
    

  
Теперь функция **this.$api** на сервере будет напрямую вызывать метод контроллера, а на клиенте **this.$api** отправлять **http запрос** через **axios**.  
  
Код  
  

```
  async fetch() {
    this.users = await this.$api("users", "index");
  },
```

  
при рендере на сервере, не будет выполнять **http запрос** на себя же, а просто подключит через **require** файл **/api/users.js** и вызовет метод **index()**, т.е. не будут выполняться пункты с 4-13, а выполнится только 10.  
  
Однако когда клиент в браузере нажмёт кнопку **Refresh**, то те же самые данные запросятся через **http**.  
  
Вот полный код: [codesandbox.io/s/codesandbox-nuxt-pbriw](https://codesandbox.io/s/codesandbox-nuxt-pbriw)  
  

### Тестирование производительности

  
[codesandbox.io/s/codesandbox-nuxt-rzdyw](https://codesandbox.io/s/codesandbox-nuxt-rzdyw)  
  

1.  Для исключения влияния скорости внешних соединений, я заменил получение данных, на статичные данные:  
      
    /api/users.js  
    
    ```
    // we can get data from any DB
    async function getDataFromDB() {
      return {
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          {
            id: 1,
            email: "george.bluth@reqres.in",
            first_name: "George",
            last_name: "Bluth",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
          },
          {
            id: 2,
            email: "janet.weaver@reqres.in",
            first_name: "Janet",
            last_name: "Weaver",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
          },
          {
            id: 3,
            email: "emma.wong@reqres.in",
            first_name: "Emma",
            last_name: "Wong",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
          },
          {
            id: 4,
            email: "eve.holt@reqres.in",
            first_name: "Eve",
            last_name: "Holt",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
          },
          {
            id: 5,
            email: "charles.morris@reqres.in",
            first_name: "Charles",
            last_name: "Morris",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
          },
          {
            id: 6,
            email: "tracey.ramos@reqres.in",
            first_name: "Tracey",
            last_name: "Ramos",
            avatar:
              "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
          }
        ],
        ad: {
          company: "StatusCode Weekly",
          url: "http://statuscode.org/",
          text:
            "A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."
        }
      };
      /*
      return (await require("axios").get(`https://reqres.in/api/users?page=1`))
        .data;
      */
    }
    ....
    ```
    
2.  Изменим вызов api на сервере, добавим возможность получения данных принудительно через **http** и признак серверных данных  
      
    /plugins/api-context.server.js  
    
    ```
    export default (context, inject) => {
      inject("server", () => true);
      inject("api", async (controller, method, params) => {
        try {
          if (params && params.httpcall) {
            return await context.$axios["$" + (params ? "post" : "get")](
              "/api/" + controller + "/" + method,
              params
            );
          }
          let api = require("../api/" + controller.replace(/^\/+|\/+$|\.+/g, ""));
          return await api[method](params);
        } catch (e) {
          console.error(e);
          throw e;
        }
      });
    };
    ```
    
3.  На странице **index.vue** в методе **fetch** асинхронно вызовем api 50 раз внутренним способом  
      
    /pages/index.vue  
    
    ```
      async fetch() {
        let start = new Date();
        let promises = [];
        let callNum = 50;
        for (let i = 0; i < callNum; i++) {
          promises.push(this.$api("users", "index"));
        }
    
        let arr = await Promise.all(
          promises.map(async p => {
            return await p;
          })
        );
    
        let res = [];
        for (let r of arr) {
          res = res.concat(r);
        }
    
        this.users = res;
        this.fetchType =
          (this.$server && this.$server() ? "Server internal" : "Client http") +
          " API call";
        this.fetchTime = new Date() - start;
      },
    ```
    
4.  А на странице **httpcall.vue** в методе **fetch** асинхронно вызовем api 50 раз через http  
      
    /pages/httpcall.vue  
    
    ```
    ...
          promises.push(this.$api("users", "index", { httpcall: true }));
    ...
        this.fetchType =
          (this.$server && this.$server() ? "Server http" : "Client http") +
          " API call";
    ...
    ```
    
5.  Теперь сравним время выполнения [rzdyw.sse.codesandbox.io](https://rzdyw.sse.codesandbox.io/)  
      
    Server internal API call rendering fetch time: 1ms  
    время от 0ms до максимум 2ms  
      
    [rzdyw.sse.codesandbox.io/httpcall](https://rzdyw.sse.codesandbox.io/httpcall)  
    Server http API call rendering fetch time: 71ms  
    время от 46ms до максимум 1059ms  
    и несколько раз сервер вообще падал с ошибкой  
      
    `RangeError   Maximum call stack size exceeded   `

  
Вот полный пример — [codesandbox.io/s/codesandbox-nuxt-rzdyw](https://codesandbox.io/s/codesandbox-nuxt-rzdyw)  
  

### Итого Часть 2

  

-   Минимальными изменениями можно ускорить серверный рендеринг более чем в 50 раз, на живом примере рендеринг страницы у меня ускорялся в ~1.7 раза
-   Существенно сократился расход ресурсов Node HTTP сервера
-   В оптимизированном виде единственный инстанс Nuxt'а должен выдержать нагрузку небольших и средних проектов