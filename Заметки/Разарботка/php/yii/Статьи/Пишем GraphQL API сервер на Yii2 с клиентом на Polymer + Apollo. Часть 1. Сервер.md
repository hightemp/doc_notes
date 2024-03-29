https://habr.com/ru/articles/336758/

Статья рассчитана на широкий круг читателей и требует лишь базовых знаний PHP и Javascript. Если вы занимались программированием и вам знакома аббревиатура API, то вы по адресу.  
  
Изначально статья предполагала лишь описание отличительных особенностей GraphQL и RESTful API, с которыми мы столкнулись на практике, но в итоге она вылилась в объемный туториал на несколько частей.  
  
И сразу же хочу добавить, что не считаю GraphQL панацеей от всех бед и киллером RESTful API.  
  

## Кто мы?

  
Мы — компания, которая разрабатывает мобильные приложения, причем, как правило, у этих приложений существует клиент на iOS (ну понятное дело), Android и Web. Лично я в этой компании занимаюсь написанием серверной части на PHP.  
  

## Предыстория

  
Все началось с того что мы закончили разработку одного приложения (ну как закончили, закончить разработку приложения невозможно, просто его финансирование было безвременно приостановлено), и нам тут же зашел новый проект. Благо, компания не ограничивает разработчиков в выборе технологий (конечно же в разумных пределах), и было принято решение внести определенные изменения, дабы попытаться избежать проблем, возникавших в прошлом. Ведь, как известно, если продолжать делать то, что делаешь, то и продолжаешь получать то, что получаешь.  
  

## Проблемы RESTful API

  
Не то чтобы у REST’а были большие проблемы, но с одной из них я сталкивался весьма регулярно. Дело в том, что разработчики на наших проектах весьма высоко квалифицированы, и это, в свою очередь, причина того, что каждый из них считает себя на определенном уровне экспертом в своей области. API это та тонкая ниточка среди технологий которая связывает backend и frontend специалистов и является причиной многочисленных споров о том, как именно его нужно разрабатывать.  
  

### Структура проекта

  
Для примера рассмотрим типичную структуру данных:  
  
![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/99c/a6c/269/99ca6c269c08c39f3077c74da4590a39.png)  
  
Тут нужно понимать, что в реальной жизни такие таблицы могут иметь по 20+ полей, что делает использование GraphQL еще более привлекательным и оправданным. Почему именно, я попытаюсь объяснить в статье.  
  

### Какие API методы хочет создавать backend разработчик?

  
Разработчик серверной части конечно же хочет писать API методы таким образом, чтобы они максимально соответствовали целостным исчерпывающим объектам. Например:  
  
**GET /api/user/:id**  
  

```
{
	id
	email
	firstName
	lastName
	createDate
	modifyDate
	lastVisitDate
	status
}
```

  
**GET /api/address/:id**  
  

```
{
	id
	userId
	street
	zip
	cityId
	createDate
	modifyDate
	status
}
```

  
**GET /api/city/:id**  
  

```
{
	id
	name
}
```

  
… и т.д. Написание подобной архитектуры не только проще и быстрее (если не говорить о том, что это все делает за нас какой-нибудь скаффолдинг), но и архитектурно и эстетически красивее и правильнее (по крайней мере так считает сам разработчик). В лучшем случае backend соглашается на вложенные объекты, чтобы вместо addressId в респонсе возвращался вложенный объект адреса или (в случае связки “один ко многим”) массив адресов.  
  

### Какие API методы хочет вызывать разработчик UI?

  
Разработчик клиента немногим более приближен к живым людям (пользователям приложения) и их потребностям, в результате чего в приложении существует несколько (нужно читать много) мест, где необходимы разные наборы одних и тех же данных. Таким образом он хочет для каждого функционального элемента иметь по методу:  
  
**GET /api/listOfUsersForMainScreen**  
  

```
[
	{
		firstName
		lastName
		dateCreated
		city
		street
	}
	...
]
```

  
… и так далее в том же духе. Конечно же, такое желание вполне оправдано не только желанием сократить себе работу, но и улучшить производительность приложения. Во-первых UI делает один вызов вместо трёх (сначала user, затем address, а потом и city). Во вторых, такой метод избавит от получения множества (зачастую немалого) избыточных данных. При этом очень желательно чтобы dateCreated возвращалась в человеческом формате, а не в первозданном, взятом из поля в БД (а то ведь еще придется и unix time конвертировать).  
  
На этой почве и рождаются конфликты, коих я был свидетелем, а иногда и участником. Хорошие разработчики ищут и, конечно же, находят компромиссы, чтобы частично удовлетворить потребности друг друга. Но если у вас, к примеру, один frontend и два backend, то тут одиночке придется включить свою харизму на максимум и задействовать все дипломатические навыки, дабы продавить написание своих бессмысленных методов, которые будут вызываться один раз за весь жизненный цикл приложения.  
  

## Что такое GraphQL и почему он должен решать мои проблемы?

  
Для тех, кто не знаком с GraphQL, советую потратить не более, чем 5-10 минут и посетить [эту страницу](http://graphql.org/learn/), чтобы понять с чем его едят.  
  
Почему он решает вышеописанную проблему? Потому что при использовании GraphQL, серверный разработчик описывает атомарные сущности и связи так, как ему это нравится, а UI строит кастомные запросы в зависимости от потребностей конкретного элемента. И вроде бы и овцы сыты и волки целы, но, к счастью, мы не живем в идеальном мире и подстраиваться все равно приходится. Но обо всем по-порядку.  
  

## Покажите мне код

  
На Хабре уже была [хорошая статья](https://habrahabr.ru/post/328122/) о том, как подружить PHP и GraphQL, из которой я вынес много полезного, и заранее извиняюсь за повторения, ведь основной поинт статьи не обучить основам, а показать преимущества и недостатки.  
  
_Готовый демо проект серверной части можно [посмотреть тут](https://github.com/timur560/graphql-server-demo)._  
  
Собственно, приступим к написанию сервера. Чтобы пропустить настройку фреймворка и окружения, которая не содержит никакой информации о самом GraphQL, можете сразу переходить к созданию структуры (шаг 2).  
  

### Шаг 1. Установка и настройка Yii2

  
Данный шаг никак не связан с GraphQL, но он необходим для наших дальнейших действий.  
  

**Установка и настройка Yii2**

  

### Шаг 2. Установка расширения для GraphQL

  
Для нашего проекта будем использовать базовое расширение webonyx/graphql-php (https://github.com/webonyx/graphql-php).  
  

```
$> composer require webonyx/graphql-php
```

  
Также на github можно найти уже заточенное расширение под Yii2, но на первый взгляд оно меня не вдохновило. Если же вы с ним знакомы, поделитесь своим опытом в комментариях.  
  

### Шаг 3. Создаем структуру проекта.

  
Основные элементы структуры, задействованные в реализации GraphQL сервера:  
  
**schema** — директория в корне фреймворка, которая будет хранить сущности для GraphQL сервера: типы и мутации. Название директории и расположение не принципиально, можете назвать как угодно и расположить в другом неймспейсе (например api/ или components/).  
  
**schema/QueryType.php, schema/MutationType.php** — “корневые” типы.  
  
**schema/Types.php** — некий агрегатор для инициализации наших кастомных типов.  
  
**schema/mutations** — мутации предпочтительно хранить в отдельной директории для удобства.  
  
Ну и собственно **controllers/api/GraphqlController.php** — точка входа. Все запросы к GraphQL серверу идут через одну точку входа — /api/graphql. Таким образом ничего не мешает вам параллельно содержать RESTful API (если уж на то пошло, то, грубо говоря, GraphQL сервер это один API-метод, принимающий на вход параметрами GraphQL-запросы).  
  

#### Шаг 3.1. Создадим типы для наших моделей.

  
Создадим новую директорию schema и в ней классы для наших моделей.  
  
_/schema/CityType.php:_  
  

```
<?php

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CityType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                	'name' => [
                		'type' => Type::string(),
                	],
                ];
            }
        ];

        parent::__construct($config);
    }

}
```

  
В описании поля участвуют следующие параметры:  
  
**type** — GraphQL-тип поля (Type::string(), Type::int(), т.д).  
  
**description** — описание (просто текст; будет использоваться в схеме, придает удобство при отладке запросов).  
  
**args** — принимаемые аргументы (ассоциативные массив, где ключ — имя аргумента, значение — GraphQL-тип).  
  
**resolve($root, $args)** — функция, которая возвращает значение поля. Аргументы: $root — объект соответствующего ActiveRecord (в данном случае в него будет приходить объект models\City); $args — ассоциативный массив аргументов (описанных в $args).  
  
Все поля кроме type — опциональны.  
  
_/schema/UserType.php:_  
  

```
<?php

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use app\models\User;

class UserType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    'firstname' => [
                        'type' => Type::string(),
                    ],
                    'lastname' => [
                        'type' => Type::string(),
                    ],
                    'createDate' => [
                        'type' => Type::string(),
                        
                        // текстовое описание, поясняющее
                        // что именно хранит поле
                        // немного позже вы увидите в чем его удобство
                        // (оно еще больше сократит ваше общение с юайщиком)
                        'description' => 'Date when user was created',
                        
                        // чтобы можно было форматировать дату, добавим
                        // дополнительный аргумент format
                        'args' => [
                            'format' => Type::string(),
                        ],

                        // и собственно опишем что с этим аргументом
                        // делать
                        'resolve' => function(User $user, $args) {
                            if (isset($args['format'])) {
                                return date($args['format'], strtotime($user->createDate));
                            }

                            // коли ничего в format не пришло, 
                            // оставляем как есть
                            return $user->createDate;
                        },
                    ],

                    // при необходимости с остальными датами можно
                    // произвести те же действия, но мы
                    // сейчас этого делать, конечно же, не будем
                    'modityDate' => [
                        'type' => Type::string(),
                    ],
                    'lastVisitDate' => [
                        'type' => Type::string(),
                    ],
                    'status' => [
                        'type' => Type::int(),
                    ],

                    // теперь самая интересная часть схемы - 
                    // связи
                    'addresses' => [
                        // так как адресов у нас много,
                        // то нам необходимо применить
                        // модификатор Type::listOf, который
                        // указывает на то, что поле должно вернуть
                        // массив объектов типа, указанного
                        // в скобках
                        'type' => Type::listOf(Types::address()),
                        'resolve' => function(User $user) {
                            // примечательно то, что мы можем сразу же
                            // обращаться к переменной $user без дополнительных проверок
                            // вроде, не пустой ли он, и т.п.
                            // так как если бы он был пустой, до текущего
                            // уровня вложенности мы бы просто не дошли
                            return $user->addresses;
                        },
                    ],
                ];
            }
        ];

        parent::__construct($config);
    }

}
```

  
_/schema/AddressType.php:_  
  

```
<?php

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AddressType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    'user' => [
                        'type' => Types::user(),
                    ],
                    'city' => [
                        'type' => Types::city(),
                    ],

                    // остальные поля не столь интересны
                    // посему оставляю их вам на 
                    // личное растерзание
                ];
            }
        ];

        parent::__construct($config);
    }

}
```

  
Для AddressType.php нам необходим вспомогательный класс Types.php, который описан ниже.  
  

#### Шаг 3.2. schema/Types.php

  
Дело в том, что GraphQL схема не может иметь несколько одинаковых (одноименных) типов. Именно за этим призван следить агрегатор Types.php. Название нарочно было выбрано именно Types, чтобы было похоже, и, в тоже время, отличалось от стандартного класса библиотеки GraphQL — Type. Таким образом обратиться к стандартному типу можно через Type::int(), Type::string(), а к кастомному — Types::query(), Types::user(), и т.д.  
  
_schema/Types.php:_  
  

```
<?php 

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;

class Types
{
    private static $query;
    private static $mutation;

    private static $user;
    private static $address;
    private static $city;


    public static function query()
    {
        return self::$query ?: (self::$query = new QueryType());
    }

    public static function user()
    {
        return self::$user ?: (self::$user = new UserType());
    }

    public static function address()
    {
        return self::$address ?: (self::$address = new AddressType());
    }

    public static function city()
    {
        return self::$city ?: (self::$city = new CityType());
    }

}
```

  

#### Шаг 3.3. schema/QueryType.php

  

```
<?php

namespace app\schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use app\models\User;
use app\models\Address;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'fields' => function() {
                return [
                    'user' => [
                        'type' => Types::user(),

                        // добавим сюда аргументов, дабы
                        // выбрать необходимого нам юзера
                        'args' => [
                            // чтобы агрумент сделать обязательным
                            // применим модификатор Type::nonNull()
                            'id' => Type::nonNull(Type::int()),
                        ],
                        'resolve' => function($root, $args) {
                            // таким образом тут мы уверены в том
                            // что в $args обязательно присутствет элемент с индексом
                            // `id`, и он обязательно целочисленный, иначе мы бы сюда не попали

                            // так же мы не боимся, что юзера с этим `id`
                            // в базе у нас не существует
                            // библиотека корректно это обработает
                            return User::find()->where(['id' => $args['id']])->one();
                        }
                    ],

                    // в принципе на поле user можно остановиться, в случае
                    // если нам нужно обращаться к данным лиш конкретного пользователя
                    // но если нам нужны данные с другими привязками добавим
                    // для примера еще полей

                    'addresses' => [
                        // без дополтинельных параметров
                        // просто вернет нам списох всех
                        // адресов
                        'type' => Type::listOf(Types::address()), 

                        // добавим фильтров для интереса
                        'args' => [
                            'zip' => Type::string(),
                            'street' => Type::string(),
                        ],
                        'resolve' => function($root, $args) {
                            $query = Address::find();

                            if (!empty($args)) {
                                $query->where($args);
                            }

                            return $query->all();
                        }
                    ],
                ];
            }
        ];

        parent::__construct($config);
    }
}
```

  
C MutationType.php разберемся немного позже.  
  

#### Шаг 3.4. Создаем controllers/api/GraphqlController.php

  
Теперь доделаем последнюю часть, чтобы к нашим новосозданным типам можно было достучаться.  
  
_GraphqlController.php:_  
  

```
<?php

namespace app\controllers\api;

use app\schema\Types;
use GraphQL\GraphQL;
use GraphQL\Schema;
use yii\base\InvalidParamException;
use yii\helpers\Json;

class GraphqlController extends \yii\rest\ActiveController
{
    public $modelClass = '';

    /**
     * @inheritdoc
     */
    protected function verbs()
    {
        return [
            'index' => ['POST'],
        ];
    }

    public function actions()
    {
        return [];
    }

    public function actionIndex()
    {
        // сразу заложим возможность принимать параметры
        // как через MULTIPART, так и через POST/GET

        $query = \Yii::$app->request->get('query', \Yii::$app->request->post('query'));
        $variables = \Yii::$app->request->get('variables', \Yii::$app->request->post('variables'));
        $operation = \Yii::$app->request->get('operation', \Yii::$app->request->post('operation', null));

        if (empty($query)) {
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variables = isset($input['variables']) ? $input['variables'] : [];
            $operation = isset($input['operation']) ? $input['operation'] : null;
        }

        // библиотека принимает в variables либо null, либо ассоциативный массив
        // на строку будет ругаться

        if (!empty($variables) && !is_array($variables)) {
            try {
                $variables = Json::decode($variables);
            } catch (InvalidParamException $e) {
                $variables = null;
            }
        }

        // создаем схему и подключаем к ней наши корневые типы

        $schema = new Schema([
            'query' => Types::query(),
        ]);

        // огонь!

        $result = GraphQL::execute(
            $schema,
            $query,
            null,
            null,
            empty($variables) ? null : $variables,
            empty($operation) ? null : $operation
        );

        return $result;
    }
}
```

  
Также стоит отметить, что обертывание в try-catch GraphQL::execute() для форматирования вывода ошибок ничего не даст, т.к. он уже внутри перехватывает всё возможное, а что делать с ошибками, я опишу немного позже.  
  

### Шаг 4. Тестируем.

  
Собственно, настало время осознать, увидеть и потрогать то, что у нас получилось.  
  
Проверим наш запрос в расширении для Chome — GraphiQL. Лично я больше предпочитаю «GraphiQL Feen», которое имеет более расширенный функционал (сохраненные запросы, кастомные хедеры). Правда последнее иногда имеет проблемы с выводом ошибок, а точнее просто ничего не выводит в случае ошибки на сервере.  
  
Вводим в поля необходимые данные и радуемся результату:  
  
![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/f14/2b0/ccf/f142b0ccfc3da3c894336e9c245460bb.png)  
  
Таким образом, после всего имеем:  
  

-   автокомплит по полям и аргументам (с подчеркиванием неверных параметров, конечно же)
-   вывод дескрипшна подсвеченного поля
-   автоматическая справка с серфингом в правой части
-   моментальное получение результата

  
_Примечание. Если у вас не заработал красивый URL, это значит, что вы недоконфигурили UrlManager и .htaccess, т.к. в первозданном Yii это не работает. Как это сделать гляньте в [репозитории к статье](https://github.com/timur560/graphql-server-demo)._  
  
Автокомплит аргументов:  
  
![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/366/45e/404/36645e404fed7af4726a988bf087bc37.png)  
  
Полностью кастомный запрос с полностью кастомным результатом — мечта frontend разработчика:  
  
![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/72d/6c7/a48/72d6c7a484d762bfa1385332ab3e9f91.png)  
  
Могли ли вы об этом всем мечтать разрабатывая свой RESTful, при том что вы для этого ничего и не делали? Конечно же нет.  
  
Также важно обратить внимание на то, что для того, чтобы вытащить адреса и пользователя, нам не нужно делать два отдельных запроса, а можно (и нужно) всё сделать сразу:  
  
![image](https://habrastorage.org/r/w1560/getpro/habr/post_images/f14/d4b/356/f14d4b356ef5469b66fbf017986b29c7.png)  
  
Возможность дебага запросов лично я считаю одним из весомых преимуществ GraphQL. Дело в том, что он автоматически генерирует схему, которую втягивает расширение, и у вас включается валидация и автокомплит. Таким образом имея лишь адрес точки входа в GraphQL сервер, вы можете полностью изучить его возможности. Несекьюрно? Как по мне, секьюрность реализуется немного на другом уровне. Имея доступ к документации любого API, мы точно так же имеем полную его схему. Некоторые RESTful API имеют подобные JSON или XML схемы, к сожалению не многие, а для GraphQL это стандарт, к тому они же активно используются клиентами.  
  

## To be continued…

  
В следующей(их) части(ях) статьи я опишу [как это всё по-красивому использовать в UI](https://habrahabr.ru/post/337044/), и конечно же мы затронем еще одну тему без которой API не API — это [мутации](https://habrahabr.ru/post/337046/).