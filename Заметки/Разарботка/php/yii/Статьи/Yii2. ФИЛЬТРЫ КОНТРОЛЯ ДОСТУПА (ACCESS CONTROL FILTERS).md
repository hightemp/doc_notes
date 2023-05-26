https://itreviewchannel.ru/yii2-filtry-kontrolya-dostupa-access-control-filters/

При разработке сайтов часто встречается задача по ограничению доступа части пользователей в доступе к различным страницам и целым модулям сайта, например, к личному кабинету пользователя. Для решения этой задачи в Yii2 имеются фильтры контроля доступа (ACF) — простой и гибкий механизм, который крепится к контроллерам и модулям в виде поведения.

```php
<?php
 
use yii\web\Controller;
use yii\filters\AccessControl;
 
class TestController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only'  => ['secret'],
                'rules' => [
                    [
                        'allow'   => true,
                        'actions' => ['secret'],
                        'roles'   => ['@'],
                    ],
                ],
            ],
        ];
    }
 
    public function actionSecret()
    {
        return 'Secret page.';
    }
}
```
Код выше блокирует доступ к странице «test/secret» для всех пользователей не прошедших аутентификацию.

```php
<?php
 
use yii\base\Module;
use yii\filters\AccessControl;
 
class ModuleOffice extends Module
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
        ];
    }
}
```

Код выше блокирует доступ ко всему модулю для всех пользователей не прошедших аутентификацию.

> Аутентификация — процесс проверки подлинности пользователя. Обычно осуществляется путем поиска в базе данных пары логина и хеша пароля. [Документация по аутентификации в Yii2](https://github.com/yiisoft/yii2/blob/master/docs/guide-ru/security-authentication.md). Пользователи прошедшие аутентификацию обозначаются символом ‘**@**‘, а не прошедшие (гости) обозначаются символом «**?**«.
> 
> Авторизация — процесс проверки прав доступа пользователей к какому-либо функционалу или модулю. [Документация по авторизации в Yii2](https://github.com/yiisoft/yii2/blob/master/docs/guide-ru/security-authorization.md). Если гость (?) попадает на страницу с доступом только для аутентифицированных (@) пользователей, то его автоматически перебросит (редирект) на страницу аутентификации (форму входа).

Класс [AccessControl](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessControl.php) позволяет задавать следующие параметры:

-   only — массив идентификаторов действий (action’ов) контроллера, к которым будут применяться правила. Если этот параметр не задан, то правила будут применяться ко всем действиям контроллера.

```php
[
    'class' => AccessControl::class,
    'only' => ['index', 'login', 'logout', 'products'],
    'rules' => [
        // Массив правил.
    ]
]
```

-   denyCallback — функцию обратного вызова (callback) при запрете доступа по одному из правил из массива rules. Эта функция при необходимости может принимать два параметра: $rule и $action.

```php
[
    'class' => AccessControl::class,
    'denyCallback' => function () {
        die('Доступ запрещен!');
    },
    'rules' => [
        // Массив правил.
    ]
]
```

-   ruleConfig — массив с правилами по умолчанию, можно сказать, что это общие настройки для всех правил из массива rules. Правила доступа из этого массива сливаются с массивом rules и ставятся в начало списка.

```php
'access' => [
    'class' => AccessControl::class,
    'ruleConfig' => [
        'class' => 'yii\filters\AccessRule',
        'roles' => ['?'], // Для всех гостей системы.
    ],
    'rules' => [
        // Разрешаем доступ к странице "actionIndex".
        [
            'allow'   => true,
            'actions' => ['index'],
        ],
        // Запрещаем доступ к странице "actionSecret".
        [
            'allow'   => false,
            'actions' => ['secret'],
        ],
    ],
],
```

-   rules — массив с правилами доступа к действиям (action’ам). Каждое правило доступа можно назвать объектом (оно в него преобразуется) класса [AccessRule](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessRule.php), который имеет несколько свойств (публичных полей). Настраивая и комбинируя эти поля можно построить гибкую систему доступа.

### Настройки «rules»

-   allow — тип правила, true — разрешение, false — запрет.

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'allow' => true,
            // Другие параметры.
        ],
    ],
],
```

-   actions — массив идентификаторов действий (action’ов).

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'actions' => ['index', 'users', 'products'],
            // Другие параметры.
        ],
    ],
],
```

-   controllers — массив идентификаторов контроллеров. Обычно применяется при конфигурации модулей. Если свойство не указано, то оно действует на все контроллеры.

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'controllers' => ['site', 'products', 'users'],
            // Другие параметры.
        ],
    ],
],
```

-   roles — роли пользователя.

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'roles' => ['?'], // Правило для гостей.
            // Другие параметры.
        ],
        [
            'roles' => ['@'], // Правило для аутентифицированных пользователей.
            // Другие параметры.
        ],
    ],
],
```

-   ips — массив IP-адресов.

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'ips' => ['127.0.0.1'],
            // Другие параметры.
        ],
    ],
],
```

-   verbs — HTTP метод (GET, POST, OPTIONS, HEAD, PUT, DELETE, TRACE, CONNECT или PATCH).

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'verbs' => ['GET', 'POST', 'PUT'],
            // Другие параметры.
        ],
    ],
],
```

-   matchCallback — это функция обратного вызова (callback), которая определяет будет ли применяться правило или нет. Он должна вернуть true (правило сработает) или false (правило будет проигнорировано).

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'matchCallback' => function () {
                // Метод isAdministrator() вернет true или false в зависимости от роли пользователя.
                return \Yii::$app->user->identity->isAdministrator();
            },
            // Другие параметры.
        ],
    ],
],
```

-   denyCallback — это функция обратного вызова (callback), которая будет вызвана при запрете доступа из текущего правила. Обычно генерируют исключение, переадресуют пользователя на другую страницу или завершают работу скрипта как в примере ниже.

```php
'access' => [
    'class' => AccessControl::class,
    'rules' => [
        [
            'denyCallback' => function () {
                die('Доступ закрыт!');
            }
            // Другие параметры.
        ],
    ],
],
```

Через комбинирование свойств классов [AccessControl](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessControl.php) и [AccessRule](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessRule.php) можно выстроить практически любую логику доступа к модулям, контроллерам и их действиям. Для наглядности добавлю еще один пример:

```php
<?php
 
namespace app\controllers;
 
use Yii;
use yii\web\Controller;
use yii\filters\AccessControl;
use app\models\User;
 
class SiteController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only'  => ['user', 'admin'], // Устанавливаем правила только для site/user и site/admin. К site/index имеют доступ все.
                'rules' => [
                    [
                        'allow'        => true,
                        'actions'      => ['user'],
                        'roles'        => ['@'],
                        'denyCallback' => function () {
                            die('Эта страница доступна только аутентифицированным пользователям!');
                        },
                    ],
                    [
                        'allow'         => true, // Разрешаем доступ.
                        'actions'       => ['admin'], // К действию site/admin
                        'roles'         => ['@'], // Только аутентифицированному пользователю.
                        'ips'           => ['127.0.0.1'], // С IP-адресом "127.0.0.1".
                        'verbs'         => ['GET', 'POST', 'PUT'], // Через HTTP методы GET, POST и PUT.
                        'matchCallback' => function () {
                            // Если пользователь имеет полномочия администратора, то правило доступа сработает.
                            return Yii::$app->user->identity->role == User::ROLE_ADMIN;
                        },
                        'denyCallback'  => function () {
                            // Если пользователь не подпадает под все условия, то завершаем работы и выдаем своё сообщение.
                            die('Эта страница доступна только администратору!');
                        },
                    ],
                ],
            ],
        ];
    }
 
    public function actionIndex()
    {
        return 'Страница для всех посетителей сайта.';
    }
 
    public function actionUser()
    {
        return 'Страница только для аутентифицированных посетителей сайта.';
    }
 
    public function actionAdmin()
    {
        return 'Страница только для администратора сайта.';
    }
}
```

Yii2 из коробки предоставляет еще один способ авторизации — на основе ролей (RBAC — role based access control), который является более гибким механизмом, но эта гибкость может привести к излишней сложности кода. Для большинства проектов достаточно использования ACF, даже если в системе присутствуют несколько ролей. Контролировать и совмещать доступ нескольких пользователей с разными ролями можно через matchCallback, например:

```php
<?php
 
namespace app\controllers;
 
use Yii;
use yii\web\Controller;
use yii\filters\AccessControl;
use app\models\User;
 
class SiteController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only'  => ['common', 'staff', 'admin'],
                'rules' => [
                    [
                        'allow'        => true,
                        'actions'      => ['common'],
                        'roles'        => ['@'],
                        'denyCallback' => function () {
                            die('Эта страница для всех аутентифицированных пользователей!');
                        },
                    ],
                    [
                        'allow'         => true,
                        'actions'       => ['staff'],
                        'roles'         => ['@'],
                        'matchCallback' => function () {
                            return in_array(Yii::$app->user->identity->role, [
                                User::ROLE_ADMINISTRATOR,
                                User::ROLE_MANAGER,
                            ]);
                        },
                        'denyCallback'  => function () {
                            die('Страница для персонала: модератора и администратора.');
                        },
                    ],
                    [
                        'allow'         => true,
                        'actions'       => ['admin'],
                        'roles'         => ['@'],
                        'matchCallback' => function () {
                            return Yii::$app->user->identity->role == User::ROLE_ADMINISTRATOR;
                        },
                        'denyCallback'  => function () {
                            die('Страница только для администратора.');
                        },
                    ],
                ],
            ],
        ];
    }
 
    public function actionCommon()
    {
        return 'Страница для всех пользователей.';
    }
 
    public function actionStaff()
    {
        return 'Страница для персонала: модератора и администратора.';
    }
 
    public function actionAdmin()
    {
        return 'Страница только для администратора.';
    }
}
```

### Полезные ссылки по работе с ACF:

-   [Официальная документация](https://github.com/yiisoft/yii2/blob/master/docs/guide-ru/security-authorization.md).
-   [AccessControl](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessControl.php).
-   [AccessRule](https://github.com/yiisoft/yii2/blob/master/framework/filters/AccessRule.php).