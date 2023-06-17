::: v-pre
https://habr.com/ru/articles/337046/

Порой при разработке API случается так, что необходимо не только лишь получать данные, но и вносить определенные изменения. Именно для этой цели существует то, что в GraphQL называется странным словом ["мутация"](http://graphql.org/learn/queries/#mutations).

  

## Сервер

  

Вдоволь наигравшись с клиентской частью, вернемся таки к нашему серверу и добавим несколько мутаций. Для мутаций нам необходимо иметь отдельную от query точку входа (MutationType), а сам функционал реализуется через параметры полей args и resolve.

  

_Вопрос: Могу ли я реализовать мутации через поля секции query?_ Хороший вопрос. Дело в том, что гипотетически это возможно, но архитектурно неправильно. А еще библиотека Apollo любит делать корневой запрос, т.е. имея всю структуру, запрашивает все, что возможно. Зачем она это делает, я не знаю, но предположительно, если засунуть в query методы вроде delete(), можете случайно лишиться ценного.

  

### Шаг 1. Создадим необходимые типы

  

/schema/mutations/UserMutationType.php:

  

```
<?php

namespace app\schema\mutations;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use app\models\User;

class UserMutationType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    // для теста реализуем здесь
                    // один метод для изменения данных
                    // объекта User
                    'update' => [
                        // какой должен быть возвращаемый тип
                        // здесь 2 варианта - либо
                        // булев - удача / неудача
                        // либо же сам объект типа User.
                        // позже мы поговорим о валидации
                        // тогда всё станет яснее, а пока
                        // оставим булев для простоты
                        'type' => Type::boolean(),
                        'description' => 'Update user data.',
                        'args' => [
                            // сюда засунем все то, что
                            // разрешаем изменять у User.
                            // в примере оставим все поля необязательными
                            // но просто если нужно, то можно
                            'firstname' => Type::string(),
                            'lastname' => Type::string(),
                            'status' => Type::int(),
                        ],
                        'resolve' => function(User $user, $args) {
                            // ну а здесь всё проще простого,
                            // т.к. библиотека уже все проверила за нас:
                            // есть ли у нас юзер, правильные ли у нас
                            // аргументы и всё ли пришло, что необходимо
                            $user->setAttributes($args);
                            return $user->save();
                        }
                    ],
                ];
            }
        ];

        parent::__construct($config);
    }
}
```

  

_Совет. Старайтесь делать ваши функции resolve() как можно менее нагруженными. Как видите, GraphQL позволяет это сделать максимально. Переносите максимально всю логику в модели. Схема и API это лишь связующее звено между клиентом и сервером. Этот принцип касается не только GraphQL, а и любой серверной архитектуры._

  

Аналогично /schema/mutations/AddressMutationType.php:

  

```
<?php

namespace app\schema\mutations;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use app\models\Address;
use app\schema\Types;

class AddressMutationType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    'update' => [
                        'type' => Type::boolean(),
                        'description' => 'Update address.',
                        'args' => [
                            'street' => Type::string(),
                            'zip' => Type::string(),
                            'status' => Type::int(),
                        ],
                        'resolve' => function(Address $address, $args) {
                            $address->setAttributes($args);
                            return $address->save();
                        },
                    ],

                    // так как у нас адрес имеет поле 
                    // user, то можем позволить редактировать
                    // его прямо отсюда
                    // как именно, посмотрим на этапе тестирования
                    'user' => [
                        'type' => Types::userMutation(),
                        'description' => 'Edit user directly from his address',
                        // а вот поле relove должно возвращать
                        // что, как думаете?
                        'resolve' => function(Address $address) {
                            // именно!
                            // юзера из связки нашего адреса
                            // (кстати, если связка окажется пуста -
                            // не страшно, GraphQL, все это корректно
                            // кушает, а вот если она окажется типа
                            // отличного от User, тогда он скажет, что мол
                            // что-то пошло не так)
                            return $address->user;
                        }
                    ],
                ];
            }
        ];

        parent::__construct($config);
    }
}
```

  

Во время разработки своего сервера, внимательно следите за тем, чтоб не использовать мутацию для выборки, или query для изменения данных, потому что жесткой привязки, как таковой нет.

  

Ну и корневой тип: /schema/MutationType.php:

  

```
<?php

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use app\models\User;
use app\models\Address;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    'user' => [
                        'type' => Types::userMutation(),
                        'args' => [
                            'id' => Type::nonNull(Type::int()),
                        ],
                        'resolve' => function($root, $args) {
                            return User::find()->where($args)->one();
                        },
                    ],
                    'address' => [
                        'type' => Types::addressMutation(),
                        'args' => [
                            'id' => Type::nonNull(Type::int()),
                        ],
                        'resolve' => function($root, $args) {
                            return Address::find()->where($args)->one();
                        },
                    ],
                ];
            }
        ];

        parent::__construct($config);
    }
}
```

  

### Шаг 2. Добавим созданные типы Types.php

  

Если вы заметили, на прошлом шаге мы уже использовали кастомные типы из Types, хотя еще и не создали их. Этим собственно сейчас и займемся.

  

```
... 

// т.к. наши мутации в другом неймспейсе
// необходимо их подключить
use app\schema\mutations\UserMutationType;
use app\schema\mutations\AddressMutationType;

... 

    private static $userMutation;
    private static $addressMutation;

... 

    public static function mutation()
    {
        return self::$mutation ?: (self::$mutation = new MutationType());
    }

    public static function userMutation()
    {
        return self::$userMutation ?: (self::$userMutation = new UserMutationType());
    }

    public static function addressMutation()
    {
        return self::$addressMutation ?: (self::$addressMutation = new AddressMutationType());
    }

... 
```

  

### Шаг 3. Добавим корневой тип в точку входа GraphqlController.php

  

```
... 
        $schema = new Schema([
            'query' => Types::query(),
            'mutation' => Types::mutation(),
        ]);
... 
```

  

### Шаг 4. Тестируем

  

Откроем же наш GraphiQL (а в соседней вкладке наш новосозданный клиент, чтобы убедиться, что данные таки меняются) и посмотрим на результат:

  

Запрос:

  

```
mutation {
  user(id:1) {
    update(firstname:"Stan")
  }
}
```

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/81e/238/112/81e2381129bfe4fe7b01319ade1ae98a.png)

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/c52/762/592/c52762592c250e00128c9e124668b437.png)

  

Теперь попробуем изменить адрес и привязанного к нему юзера одним запросом:

  

Запрос:

  

```
mutation {
  address(id:0) {
    update(zip: "56844")
    user {
        update(firstname:"Michael")
    }
  }
}
```

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/982/61f/c2c/98261fc2cf7ede5125f335f1be4ddea2.png)

  

Чтобы увидеть изменения адреса, немного изменим наш шаблон:

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/712/0f0/7a0/7120f07a08b98f6059c109913aeb04e2.png)

  

Сразу попытаемся представить и сравнить с тем, как нужно изощриться, чтоб провернуть что-то подобное в RESTful архитектуре. А вообще, подобные вещи, насколько мне известно, перечат концепции REST-а, а в GraphQL это изначально заложено архитектурно.

  

## Переменные

  

Пока мы не перешли к клиенту разберемся что такое [variables в GraphQL](http://graphql.org/learn/queries/#variables). С практическим их применением вы познакомитесь при использовании в мутациях в клиенте, а пока не заморачивайтесь над этим, т.к. изначально их польза не так заметна.

  

Изменим немного нашу мутацию с использованием переменных:

  

Запрос:

  

```
mutation ($id:Int, $zip: String, $firstname: String) {
  address(id: $id) {
    update(zip: $zip)
    user {
        update(firstname: $firstname)
    }
  }
}
```

  

Переменные:

  

```
{
  "id": 1,
  "zip": "87444",
  "firstname": "Steve"
}
```

  

_Примечание. Технически, переменные приходят отдельным POST-параметром variables._

  

Окно GraphiQL (поле для ввода переменных нужно просто вытянуть снизу, да, оно у вас тоже есть):

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/417/87d/24a/41787d24a70b32a82d0792e9c83dc361.png)

  

Может показаться, что переменные удобны, когда в нескольких местах используется одно и то же значение, но на самом деле, на практике это редкая ситуация, и нет, это не основное их предназначение.

  

Более полезным является возможность сразу же произвести валидацию поля. Если попытаться в переменную передать неверный тип и/или если вовсе не передать, в случае когда поле обязательное, запрос на сервер не уйдет.

  

Но основное удобство (я бы даже сказал необходимость) использования вы ощутите в клиенте.

  

## Клиент

  

### Шаг 1. Добавим мутацию в models/user.js

  

Как вы помните, все наши GraphQL-запросы мы договорились хранить в models (не почти все, а все-все), посему добавим нашу новую мутацию.

  

models/user.js:

  

```
... 

// не забываем присваивать алиасы
// мутациям они тоже необходимы
export const updateAddressAndUserMutation = gql`
    mutation updateAddressAndUser(
        $id: Int!, 
        $zip: String, 
        $street: String, 
        $firstname: String, 
        $lastname: String
    ) {
        address(id: $id) {
            update(zip: $zip, street: $street)
            user {
                update(
                    firstname: $firstname, 
                    lastname: $lastname
                )
            }
        }
    }
`;
```

  

### Шаг 2. Компонент

  

Чтобы было интереснее, создадим новый компонент, заодно посмотрим как работаем механизм событий для общения между компонентами (никакого отношения к GraphQL, поэтому без энтузиазма).

  

Создаем директорию /src/update-user-address и ложим туда традиционно 2 файла: update-user-address.html и update-user-address.js.

  

_Примечание. Если хотите назвать свой компонент как-нибудь по-другому, имейте ввиду, что существует неочевидное требование к именованию. Дело в том, что кастомный компонент в имени должен обязательно содержать "-". Вот так._

  

/src/update-user-address/update-user-address.js:

  

```
import { PolymerApolloMixin } from 'polymer-apollo';
import { apolloClient } from '../client';
// не забываем заимпортить все необходимые запросы
import { 
    getUserInfoQuery,
    updateAddressAndUserMutation
} from '../models/user';

class UpdateAddressUser extends PolymerApolloMixin({ apolloClient }, Polymer.Element) {

    static get is() { return 'update-address-user'; }

    static get properties() {
        return {
            user: {
                type: Object,
                value: {},
                // observer это метод
                // что будет вызываться при изменении
                // свойства
                // зачем это нужно читаем ниже
                observer: "_updateProperties",
            },

            // перечислим тут все наши поля
            // данные свойства работают в обе
            // стороны, т.е. при изменении полей
            // в шаблоне, они будут изменяться
            // в объекте
            zip: { type: String, value: "" },
            street: { type: String, value: "" },
            firstname: { type: String, value: "" },
            lastname: { type: String, value: "" },
        };
    }

    get apollo() {
        return {
            getUserInfo: {
                query: getUserInfoQuery
            }
        };
    }

    _updateProperties() {
        // все что делаем в этом методе
        // это парсим все необходимые значения
        // из объекта в отдельные
        // свойства.
        // нужно это по той причине
        // что изменить из шаблона
        // аттрибуты внутри объекта
        // (user = {...}) невозможно
        if (this.user.firstname != undefined) {
            // использовать индексы плохая практика
            // не делайте так
            this.zip = this.user.addresses[0].zip;
            this.street = this.user.addresses[0].street;
            this.firstname = this.user.firstname;
            this.lastname = this.user.lastname;
        }
    }

    // ну и собственно наш виновник торжества
    // (вариант очень базовый, за более широкими
    // возможностями почитайте документацию к polymer-apollo
    // (https://github.com/aruntk/polymer-apollo#mutations)
    _sendAddressUserMutation() {
        this.$apollo.mutate({
            mutation: updateAddressAndUserMutation,
            // то, чего вы так ждали
            // да, это они
            variables: {
                id: 1,
                zip: this.zip,
                street: this.street,
                firstname: this.firstname,
                lastname: this.lastname,
            },
        }).then((data) => {
            // тут можно проверить что же нам пришло
            // но мы этого делать, конечно же,
            // не будем

            // вызовем обновление компонента
            // который выведет наши изменения
            document.getElementById('view-block').dispatchEvent(new CustomEvent('refetch'));
        })
    }

}

window.customElements.define(UpdateAddressUser.is, UpdateAddressUser);
```

  

/src/update-user-address/update-user-address.html:

  

```
<dom-module id="update-address-user">
    <template>
        <!-- поля со свойствами из компонента
        (работают в обе стороны) -->
        ZIP Code: <input value="{{zip::input}}"><br>
        Street: <input value="{{street::input}}"><br>
        First Name: <input value="{{firstname::input}}"><br>
        Last Name: <input value="{{lastname::input}}"><br>

        <!-- по нажатию на кнопку шлём данные
        на сервер -->
        <button on-click="_sendAddressUserMutation">Send</button>
    </template>
</dom-module>
```

  

### Шаг 3. Добавим event listener в основной компонент

  

Чтобы мы могли тут же обновить данные в соседнем компоненте для их вывода после изменения, добавим в него event listener и метод для обновления GraphQL-запроса.

  

src/graphql-client-demo-app/graphql-client-demo-app.js:

  

```
...

    // добавим eventListener для 
    // внешних компонентов

    ready() {
        super.ready();
        this.addEventListener('refetch', e => this._refetch(e));
    }

...

    // метод для обновления данных сервера
    _refetch() {
        this.$apollo.refetch('getUserInfo');
    }

...
```

  

### Шаг 4. Подключаем новосозданный компонент

  

index.html:

  

```
...

    <link rel="import" href="/src/graphql-client-demo-app/graphql-client-demo-app.html">
    <link rel="import" href="/src/update-address-user/update-address-user.html">

    <script src="bundle.js"></script>
  </head>
  <body>
    <graphql-client-demo-app id="view-block"></graphql-client-demo-app>
    <update-address-user></update-address-user>
  </body>
</html>
```

  

entry.js:

  

```
import './src/client.js';
import './src/graphql-client-demo-app/graphql-client-demo-app.js';
import './src/update-address-user/update-address-user.js';
```

  

### Шаг 5. Тестируем

  

Ну и для начала соберем webpack (если вы все еще не избавились от него):

  

```
$> webpack
```

  

Открываем браузер и получаем что-то подобное:

  

![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/31c/7a9/69f/31c7a969f522eba978d8ece992b4edf3.png)

  

Конечно же картинка не позволяет доказать, что данные в верхней части меняются сразу же после нажатия на кнопку Send, но вам ничего не стоит попробовать это самому. К слову, все изменения предусмотрительно залиты на github: [клиент](https://github.com/timur560/graphql-client-demo) и [сервер](https://github.com/timur560/graphql-server-demo).

  

Говоря откровенно, данная архитектура совсем не оптимальна, т.к. необходимо доработать ее таким образом, чтобы выполнялся один запрос и данные подтягивались во все места интерфейса. Но это уже проблема не GraphQL.

  

В следующей (заключительной) части статьи мы рассмотрим, как реализовать валидацию в мутациях, и наконец сделаем выводы по преимуществам и недостатками перехода на GraphQL на основе полученного опыта.
:::
