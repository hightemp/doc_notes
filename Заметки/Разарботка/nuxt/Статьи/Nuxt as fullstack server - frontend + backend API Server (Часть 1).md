::: v-pre
https://habr.com/ru/post/501652/

# Nuxt as fullstack server: frontend + backend API Server (Часть 1)  

-   **Часть 1: Nuxt as fullstack server: frontend + backend API Server**
-   [Часть 2: Additional SSR performance with Nuxt fullstack server](https://habr.com/ru/post/501688/)

  
Разработчики **Nuxt** предлагают 3 метода доступа к API:  
  

1.  Встроенный в **Nuxt** сервер [Connect](https://github.com/senchalabs/connect) и использование [serverMiddleware](https://nuxtjs.org/api/configuration-servermiddleware/)
2.  [Интегрированные фреймворки](https://nuxtjs.org/guide/installation#using-code-create-nuxt-app-code-) (**Express, Koa, Hapi** и т.д.)
3.  Внешние API сервера

  
Я покажу на простом примере как организовать API сервер с использованием **serverMiddleware** на том же инстансе **Nuxt**, который у нас отвечает за frontend.  
  
Какие преимущества даёт этот подход:  
  

-   Быстрый старт и минимизация стека технологий, нужен только **Nuxt**, который будет **fullstack server**: рендерить **frontend** странички и выступать в роли **backend API сервера**
-   Минимизация архитектуры, необходим только 1 инстанс **Node** на котором работает **Nuxt**, для полноценного приложения нет необходимости разворачивать, поддерживать и администрировать множество промежуточных архитектурных звеньев (**Nginx, php** и т.д.). Для полноценного веб-приложения минимально необходим **Nuxt** и какая-либо база данных (**MySQL, PostgreSQL, MongoDB** и т.д.)
-   И серверный, и клиентский код может быть написан на одном языке. Кода меньше и вся логика, серверная и клиентская хранится в одном месте, и в одном репозитарии.
-   Встроенный в **Nuxt** сервер **Connect**, один из самых быстрых **Node** серверов ([ссылка](https://github.com/fastify/benchmarks#benchmarks)) может обрабатывать более 55 тысяч запросов в секунду. В случае если понадобится расширенный функционал, то всегда можно подключить к **Nuxt**'у более полнофункциональные интегрированные фремворки (**Express, Koa, Hapi** и т.д.) или расширить функционал пакетами.
-   Несмотря на минимализм, мы имеем полную свободу в масштабировании нашего приложения, легко можно развернуть несколько **fullstack Nuxt серверов**, которые взаимодействуют с одной базой данных, плюс развернуть **nginx**, для балансировки нагрузки между несколькими **fullstack Nuxt серверами**. Также с небольшими доработками каждый инстанс **Nuxt**'а может выступать в роли только API сервера (only backend server), так и только фронтэнд сервера (only frontend server).
-   **И огромный бонус!!!** При использовании одного инстанса для **frontend**'а и **backend**'а можно существенно ускорить серверный рендеринг страниц (**SSR**), об этом расскажу в **Части 2**

  
Итак, приступим.  
  

## Часть 1: Nuxt as API Server

  

1.  Создадим папку **/api/** в корне нашего проекта, тут будут лежать контроллеры нашего API которые будут возвращать данные
2.  **API Server** для обработки внешних клиентских запросов:  
      
    /serverMiddleware/api-server.js  
    
    ```
    export default async (req, res, next) => {
      let url = req._parsedUrl.pathname.replace(/^\/+|\/+$|\.+/g, "");
      url = url.split("/");
      let method = url.pop();
      let controller = url.slice(1).join("/");
      let api = require("../api/" + controller);
      let result = await api[method](req.params);
      res.end(JSON.stringify(result));
    };
    ```
    
3.  Подключим наш **API Server** к **Nuxt** через **serverMiddleware**  
      
    /nuxt.config.js  
    
    ```
      serverMiddleware: [
        { path: "/api", handler: require("body-parser").json() },
        {
          path: "/api",
          handler: (req, res, next) => {
            const url = require("url");
            req.query = url.parse(req.url, true).query;
            req.params = { ...req.query, ...req.body };
            next();
          }
        },
        { path: "/api", handler: "~/serverMiddleware/api-server.js" }
      ],
    ```
    
      
    Теперь все запросы вида http://<server_name>/api/controller_name/method_name будут искать в папке **/api/** файл **controller_name.js**, который экспортирует функцию с именем **method_name** и запускать её с параметрами первым аргументом  
    
4.  Создадим контроллер **users**  
      
    /api/users.js  
    
    ```
    // we can get data from any DB
    async function getDataFromDB() {
      return (await require("axios").get(`https://reqres.in/api/users?page=1`))
        .data;
    }
    
    async function index() {
      let res = await getDataFromDB();
    
      // some business logic
      let ret = res.data.map(el => {
        return {
          id: el.id,
          full_name: el.first_name + " " + el.last_name,
          highlight: el.first_name.charAt(0) === "J"
        };
      });
      ret = ret.sort(() => 0.5 - Math.random());
    
      return ret;
    }
    
    export { index };
    ```
    
      
    Сейчас можем посмотреть, что получилось  
      
    [3gzhl.sse.codesandbox.io/api/users/index](https://3gzhl.sse.codesandbox.io/api/users/index)  
    
    ```
    [
      {
        "id": 3,
        "full_name": "Emma Wong",
        "highlight": false
      },
      {
        "id": 5,
        "full_name": "Charles Morris",
        "highlight": false
      },
      {
        "id": 1,
        "full_name": "George Bluth",
        "highlight": false
      },
      {
        "id": 2,
        "full_name": "Janet Weaver",
        "highlight": true
      },
      {
        "id": 4,
        "full_name": "Eve Holt",
        "highlight": false
      },
      {
        "id": 6,
        "full_name": "Tracey Ramos",
        "highlight": false
      }
    ]
    ```
    
5.  Теперь на странице **index.vue** выведем результаты API  
      
    /pages/index.vue  
    
    ```
    <template>
      <div>
        <h1 class="title">NUXT as API Server</h1>
        <h2 class="subtitle">Users</h2>
        <button type="button" @click="$fetch">Refresh</button>
        <ol>
          <li
            v-for="user in users"
            :class="{'highlight': user.highlight}"
            :key="user.id"
          >{{ user.full_name }}</li>
        </ol>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          users: []
        };
      },
      async fetch() {
        try {
          this.users = await this.$axios.$get("/api/users/index");
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
    };
    </script>
    
    <style scoped>
    .highlight {
      color: green;
      font-weight: bold;
    }
    </style>
    ```
    
      
    Вот результат — [3gzhl.sse.codesandbox.io](https://3gzhl.sse.codesandbox.io/)  
      
    ![](https://habrastorage.org/r/w1560/webt/wl/hb/np/wlhbnpm7hou1gmg6pwqxo8b26vq.png)  
      
    функция **fetch** отрабатывает при серверном рендеренге, запрашивает по **HTTP данные** (https://3gzhl.sse.codesandbox.io/api/users/index), снова попадает на наш же сервер в API и сервер отдаёт результат **json**, который принимается и парсится.  
      
    Если же мы нажмём кнопку **Refresh**, то браузер опять запросит данные через **http** у нашего API сервера и обновит список.  
    
6.  Давайте добавим немного функционала:  
      
    Создадим новый метод API для получения информации по **users** (/api/users.js)  
      
    
    ```
    ...
    async function show({ id }) {
      let res = await getDataFromDB();
    
      return res.data.filter(el => el.id == id)[0];
    }
    
    export { index, show };
    ```
    
      
    При клике на users отобразим эту информацию  
      
    /pages/index.vue  
    
    ```
    <template>
      <div>
        <h1 class="title">NUXT as API Server</h1>
        <h2 class="subtitle">Users</h2>
        <button type="button" @click="$fetch">Refresh</button>
        <ol>
          <li
            v-for="user in users"
            :class="{'highlight': user.highlight}"
            :key="user.id"
            @click="getUserInfo(user.id)"
          >{{ user.full_name }}</li>
        </ol>
        <div v-if="userInfo">
          <hr>
          <h3>{{ userInfo.first_name }} {{ userInfo.last_name }}</h3>
          <div>Email: {{ userInfo.email }}</div>
          <img :src="userInfo.avatar" alt="avatar">
        </div>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          users: [],
          userInfo: null
        };
      },
      async fetch() {
        try {
          this.users = await this.$axios.$get("/api/users/index");
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      methods: {
        async getUserInfo(id) {
          try {
            this.userInfo = await this.$axios.$post("/api/users/show", {
              id: id
            });
          } catch (e) {
            console.error(e);
            throw e;
          }
        }
      }
    };
    </script>
    
    <style scoped>
    li {
      cursor: pointer;
    }
    .highlight {
      color: green;
      font-weight: bold;
    }
    </style>
    ```
    
      
    Теперь при клике по Users, с браузера пользователя по HTTP уходит запрос [3gzhl.sse.codesandbox.io/api/users/show?id=4](https://3gzhl.sse.codesandbox.io/api/users/show?id=4) мы получаем доп данные по клиенту  
      
    
    ```
    {"id":4,"email":"eve.holt@reqres.in","first_name":"Eve","last_name":"Holt","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"}
    ```
    
      
    и отображаем их  
    
7.  Т.к. мы часто будем пользоваться нашим API, то давайте немного улучшим код. Создадим плагин для использования нашего API  
      
    /plugins/api-context.js  
    
    ```
    export default (context, inject) => {
        inject('api', async (controller, method, params) => {
            try {
                return await context.$axios['$' + (params ? 'post' : 'get')]('/api/' + controller + '/' + method, params);
            } catch (e) {
                console.error(e);
                throw e;
            }
        })
    }
    ```
    
      
    Подключим плагин  
      
    nuxt.config.js  
    
    ```
    export default {
      ...
      plugins: ["~/plugins/api-context.js"]
    }
    ```
    
      
    теперь все вызовы на странице (и в компонентах) можно заменить на простой вызов:  
      
    /pages/index.vue  
    
    ```
    ...
    <script>
    export default {
      ...
      async fetch() {
        this.users = await this.$api("users", "index");
      },
      methods: {
        async getUserInfo(id) {
          this.userInfo = await this.$api("users", "show", {id: id});
        }
      }
    };
    </script>
    ```
    
      
    

  

### Итого Часть 1

  
У нас получился **Nuxt** c полноценным API сервером.  
  

-   контроллеры нашего сервера лежат в папке **/api/**
-   логика обработки запросов API сервером лежит  
    **/serverMiddleware/api-server.js**
-   легко можем расширить функционал **API сервера**, добавив новые middleware в **/serverMiddleware/** и подключив их в **nuxt.config.js**

  
→ Финальную версию данного примера можно посмотреть [здесь](https://3gzhl.sse.codesandbox.io/)  
→ Песочница [здесь](https://codesandbox.io/s/codesandbox-nuxt-3gzhl)
:::
