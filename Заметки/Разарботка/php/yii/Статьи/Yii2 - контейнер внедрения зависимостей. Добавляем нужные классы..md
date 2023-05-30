https://klisl.com/yii2-dependency_injection.html

Внедрение зависимостей (_dependency injection_) позволяет получить экземпляр нужного класса из специального объекта «контейнера» с автоматической передачей аргументов его конструктору, вместо того, что бы создавать его самому. Кроме того, контейнер позволяет реализовать шаблон проектирования «**Singleton**».  
В случае фреймворка **Yii**, данный служебный объект называется «Контейнер внедрения зависимостей». В **Laravel** – «Сервис-контейнер».  
  
Нужный пользователю объект создается контейнером, при этом все зависимости этого объекта (аргументы) передаются ему автоматически в виде экземпляров указанных классов (или классов реализующих указанные интерфейсы):  

```
public function __construct(EmployeeRepository $employees, EventDispatcher $dispatcher)
```
  
Таким образом, вместо (например):  

```
$repository = new YiiEmployeeRepository($db);
$dispatcher = new MailEventDispatcher();

$employeeService = new EmployeeService($repository, $dispatcher);
```

достаточно прописать:  

```
$employeeService = Yii::$container->get('EmployeeService');
```

  
Для того, что бы работало внедрение зависимостей, в контейнере должны быть зарегистрированы и класс, объект которого мы хотим получить, и классы, которые указаны в его конструкторе (зависимости). Таким образом будут созданы и объекты этих классов. Если эти классы так же имеют какие-либо зависимости в своих конструкторах, то и те зависимости должны быть зарегистрированны в контейнере. Все основные классы Yii (например Request или Db) там регистрируются автоматически. Поэтому следить нужно только за пользовательскими.  
  
Если вы создаете объект какого-либо своего класс, например сервиса или репозитория, то их нужно добавить в контейнер, если желаете воспользоваться внедрением зависимостей.  
  
  

##### Добаление класса в контейнер внедрения зависимостей.

  
**1.** В Yii, это можно сделать прямо добавив секцию **container** в конфигурационные файлы web.php, console.php и test.php (если работать с yii2-app-basic) или в common/config/main.php (в yii2-app-advanced):  

```
$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'container' => [
        'singletons' => [
            'app\repositories\EmployeeRepository' => ['class' => 'app\repositories\YiiEmployeeRepository'],
            'app\dispatchers\EventDispatcher' => ['class' => 'app\dispatchers\MailEventDispatcher'],
            'EmployeeService' => ['class' => 'app\services\EmployeeService'],
        ],
    ],    'components' => [
        ...
    ],
],
```

  
Тут регистрируется класс сервиса - 'EmployeeService' и две его зависимости из примера выше. Для самого сервиса указываю его короткое название – алиас, чтобы получать его из контейнера по данному алиасу.  
  
Вместо свойства **singletons** можно было бы указать свойство **definitions**. singletons указывается, если мы хотим работать всегда только с одним экземпляром указанных классов, а не создавать, каждый раз, новый объект. Каждый раз, когда у контейнера вызывается метод get(), возвращается тот же экземпляр указанного класса.  
  
  
  
**2.** Кроме указания в конфигурационных файлах Yii, добавить классы в контейнер можно с помощью его методов, в данном случае **setSingleton()**. Делать это, желательно, на этапе загрузки приложения, а не где-то в контроллере. Для этого как раз предназначен класс **Bootstrap**. Моя статья про предзагрузку в Yii [http://klisl.com/yii2-bootstrap.html](http://klisl.com/yii2-bootstrap.html)  
  
Создаем класс **Bootstrap** (если нету), реализующий интерфейс **BootstrapInterface** и регистрируем в нем классы:  

```
<?php

namespace app;

use app\dispatchers\EventDispatcher;
use app\dispatchers\MailEventDispatcher;
use app\repositories\EmployeeRepository;
use app\repositories\YiiEmployeeRepository;
use app\services\EmployeeService;
use yii\base\BootstrapInterface;

class Bootstrap implements BootstrapInterface
{
    public function bootstrap($app)
    {
        $container = \Yii::$container;
        $container->setSingleton(EventDispatcher::class, MailEventDispatcher::class);
        $container->setSingleton(EmployeeRepository::class, YiiEmployeeRepository::class);
        $container->setSingleton('EmployeeService', EmployeeService::class);
    }
}
```

  
В качестве второго аргумента можно передать массив для заполнения значений публичных свойств создаваемого объекта:  

```
$container->setSingleton('yii\db\Connection', [
 'dsn' => 'mysql:host=127.0.0.1;dbname=demo',
 'username' => 'root',
 'password' => '',
 'charset' => 'utf8',
]);
```

Можно передавать анонимную функцию, которая будет выполнена при обращении к контейнеру (т.е. при запросе объекта):  

```
$container->setSingleton(MailerInterface::class, function () use ($app) {
 return $app->mailer;
});
```

  
В качестве третьего аргумента можно передать массив параметров для конструктора создаваемого объекта:  

```
$container->setSingleton(ContactService::class, [], [
    $app->params['adminEmail']
]);
```

  

---

  
Если не нужно использовать шаблон проектирования Singleton, регистрируем используя метод set:  

$container->set(ContactService::class, [], [
            $app->params['adminEmail']
        ]);

  
Можно настроить несколько компонентов сразу передав массив в метод setDefinitions() или setSingletons(). Фреймворк обойдёт массив и вызовет для каждого элемента set() или setSingleton() соответственно. Например:  

$container->setDefinitions([
  EventDispatcher::class => MailEventDispatcher::class,
  'yii\web\Response' => [
     'class' => 'app\components\Response',
     'format' => 'json'
  ],
]);

  

---

  
Кроме регистрации класса в контейнере по имени данного класса или его интерфейса можно зарегистрировать псевдоним:  

$container->setSingleton('super_mailer', function () use ($app) {
    return $app->mailer;
});

Если конструктор одного из последующих классов для регистрации в контейнере будет нуждаться в классе зарегистрированном с помощью псевдонима, используется вызов Instance::of, например:  

$container->setSingleton(ContactService::class, [], [
    $app->params['adminEmail'],
    Instance::of('super_mailer')
]);

  

---

  
Класс Bootstrap так же нужно зарегистрировать, чтобы он загрузился при запуске приложения. Для этого в нужном конфигурационном файле (backend\config\main.php, console\config\main.php или frontend\config\main.php но не в common\config\main.php) добавляем строку с название класса и пространством имен:  

'bootstrap' => [
    'log',
    'app\Bootstrap'
    ],

  
В данном случае я разместил класс в корне приложения **Yii2** (**basic**). Для **Advanced** это стоило бы делать, например, в каталоге **common**.  
  
В зависимости от места создания файла **Bootstrap**, может потребоваться обновить автозагрузчик **Composera**:  

composer dump-autoload –o

  
Контейнер, автоматически, создает экземпляры зависимых объектов, вставляя их в создаваемый объект, настраивает и, наконец, возвращает вновь созданный объект.  
  
  

##### Пример использования контейнера внедрения зависимостей с контроллером.

  
Допустим у нас есть свои классы-сервисы:  
common/services/MyClass1.php:  

<?php

namespace app\services;

class MyClass1
{

}

и common/services/MyClass2.php:  

<?php

namespace app\services;

class MyClass2
{
    public $param;

    public function __construct($param)
    {
        $this->param = $param;
    }

}

  
В каком-то контроллере понадобился доступ к данным классам. Для этого создаем конструктор нужного класса, указываем обязательные аргументы ($id, $module, array $config = []) (IDE сама пропишет на основе родительского конструктора) и перед массивом $config прописываем нужные зависимости:  

class SiteController extends Controller
{

    protected $my1;
    protected $my2;

    public function __construct
    (
        $id, 
        $module, 
        MyClass1 $my1, 
        MyClass2 $my2, 
        array $config = []
    )
    {
        parent::__construct($id, $module, $config);
        $this->my1 = $my1;
        $this->my2 = $my2;
    }

  
В данном примере, экземпляр класса MyClass1 будет найден и создан автоматически, специально регистрировать его в контейнере не надо. А класс MyClass2 имеет конструктор, которому необходимо передать параметр при создании объекта. Поэтому данный класс нужно зарегистрировать в контейнере вручную с указанием данного параметра (и если надо – других зависимостей):  

$container->setSingleton(MyClass2::class, [], ['any_parameters']);

  
Посмотреть методы для работы с контейнером (+ примеры использования) можно в файле vendor\yiisoft\yii2\di\Container.php.