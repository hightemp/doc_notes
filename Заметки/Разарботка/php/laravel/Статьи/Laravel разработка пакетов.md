https://habr.com/ru/articles/659443/

Каждый разработчик рано или поздно сталкивается с необходимостью повторного использования собственного кода. В проектах PHP для этих целей создаются пакеты, устанавливаемые с помощью Composer. При этом пакеты могут быть абстрагированы от каких-либо фреймворков, либо могут быть предназначены для использования в конкретном PHP-фреймворке. В данной статье рассказывается о том, как создать PHP-пакеты для фреймворка Laravel, но материал будет полезен и тем, кто собирается разрабатывать любые другие PHP-пакеты (как публичные, так и приватные).

Для лучшего понимания данного материала рекомендуется ознакомиться с разделом о разработке пакетов в официальной документации [Laravel](https://laravel.com/docs/9.x/packages). А для более детального изучения темы будет полезен данный [ресурс](https://laravelpackage.com/#reasons-to-develop-a-package).

Данная статья в большей мере ориентирована на начинающих разработчиков.

## Разработка пакета

Для разработки Laravel-пакета будем использовать пакет [orchestral/testbench](https://github.com/orchestral/testbench). Данный инструмент позволяет разрабатывать Laravel-пакеты по методологии TDD ([Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development#:~:text=Test%2Ddriven%20development%20(TDD),software%20against%20all%20test%20cases)). В своих зависимостях он содержит ядро фреймворка Laravel и предоставляет доступ ко всем возможностям функциональных (Feature) тестов Laravel.

С применением **orchestral/testbench** написаны официальные пакеты Laravel ([sanctum](https://github.com/laravel/sanctum), [telescope](https://github.com/laravel/telescope), [horizon](https://github.com/laravel/horizon) и т.д.), а также многие другие Laravel-пакеты от комьюнити, например пакеты от компании [Spatie](https://spatie.be/) ([laravel-permission](https://github.com/spatie/laravel-permission), [laravel-query-builder](https://github.com/spatie/laravel-query-builder)). Чтобы понять, как пользоваться **orchestral/testbench**, достаточно ознакомиться с кодом тестов перечисленных пакетов. Если вы имеете достаточный опыт в написании тестов в Laravel, можете прямо сейчас переходить по ссылкам и изучать код тестов указанных пакетов.

В рамках данного туториала разрабатывается пакет **laravel-example**. Его код можно найти [здесь](https://github.com/yuraplohov/laravel-example). Это демонстрационный пакет, в котором мы задействуем такие основные компоненты фреймворка Laravel, как миграции, модели, файлы конфигурации, роуты, контроллеры, консольные команды.

Для разработки потребуются интерпретатор PHP и Composer.

Приступим к разработке пакета и первым делом создадим директорию **laravel-example**.

В этой директории необходимо создать файл **composer.json**. Его можно создать двумя способами.

**Первый способ** - создать файл с помощью Composer. Для этого необходимо выполнить консольную команду `composer init`, после чего Composer попросит ввести в консоль ответы на вопросы относительно создаваемого пакета.

**Второй способ** - создать файл **composer.json** вручную и затем поместить в него некий заготовленный шаблон конфигурации, например такой:

```
{
  "name": "yuraplohov/laravel-example",
  "description": "Laravel package example",
  "license": "MIT",
  "authors": [
    {
      "name": "Yuriy PLokhov",
      "email": "yurii.plohov@gmail.com"
    }
  ],
  "require": {
    "php": "^8.1"
  },
  "require-dev": {
    "orchestra/testbench": "^7.2",
    "phpunit/phpunit": "^9.5"
  },
  "autoload": {
    "psr-4": {
      "Yuraplohov\\LaravelExample\\": "src/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "Yuraplohov\\LaravelExample\\Test\\": "tests/"
    }
  }
}
```

Со всеми директивами файла **composer.json**, можно ознакомиться [здесь](https://getcomposer.org/doc/04-schema.md). В рамках данного материала будут упомянуты лишь некоторые из них.

В директиве **name** необходимо указать название создаваемого пакета. Название состоит из имени вендора и имени самого пакета, разделенных слешем ("/"). В качестве имени вендора можете использовать никнейм вашего аккаунта в git-репозитории, в котором будет храниться пакет.

Далее в **laravel-example** создаем директории **src** и **tests**. В нашем файле **composer.json** в директивах **autoload** и **autoload-dev** указаны пространства имен, ассоциируемые именно с этими директориями. Имена пространств имен для пакетов принято создавать на основе названия пакета в CamelCase. Так, в нашем примере для пакета с названием **"yuraplohov/laravel-example"** мы создаем основное пространство имен **"Yuraplohov\LaravelExample"**, а для пространства имен с тестами добавляем "**\Test**".

Чтобы разместить в пакете все эти компоненты, в директории **laravel-example** необходимо создать структуру директорий, аналогичную структуре Laravel-проекта. Обратите внимание, что в Laravel-проекте основное пространство имен направлено на директорию **app**, а в нашем пакете - на **src**. Это значит, что **src** соответствует **app**, и дальнейшую структуру пакета мы создаем, учитывая это соответствие. Например, директории **config**, **database**, **routes** мы помещаем на один уровень с **src**, а в саму **src** помещаем **Console/Commands**, **Http/Controllers**, **Models**, **Providers**.

В результате структура директории **laravel-example** выглядит так:

-   laravel-example
    
    -   config
        
    -   database
        
        -   migrations
            
    -   routes
        
    -   src
        
        -   Console
            
            -   Commands
                
        -   Http
            
            -   Controllers
                
        -   Models
            
        -   Providers
            
    -   tests
        

Для разработки пакета нам потребуются две dev-зависимости. Чтобы установить их выполняем последовательно следующие команды:

```
composer require --dev phpunit/phpunit

composer require --dev orchestra/testbench
```

Обратите внимание, что таким образом мы устанавливаем последнюю версию пакета **orchestra/testbench**, но надо иметь ввиду, что конкретные мажорные версии **orchestra/testbench** совместимы с конкретными версиями фреймворка Laravel. С таблицей соответствия версий можно ознакомиться [здесь](https://laravelpackage.com/02-development-environment.html#orchestra-testbench). На момент написания статьи последней версией **testbench** является 7.x, которая соответствует версии 9.x фреймворка Laravel.

В том случае, если вы указываете зависимости пакета вручную, редактируя файл **composer.json**, то версии зависимостей рекомендуется указывать в формате, обеспечивающем обратную совместимость загружаемых пакетов. Например, с кареткой и номерами мажорной и минорной версий: "^x.y". Чтобы проверить корректность указываемых ограничений вы можете воспользоваться данным [сервисом](https://jubianchi.github.io/semver-check/#/).

После установки зависимостей создаем в корне пакета файл **phpunit.xml**. Данный файл предназначен для конфигурирования фреймворка PHPUnit. Помещаем в него следующий код:

```
<?xml version="1.0" encoding="UTF-8"?>
<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         beStrictAboutTestsThatDoNotTestAnything="false"
         bootstrap="vendor/autoload.php"
         colors="true"
         convertDeprecationsToExceptions="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false"
>
  <testsuites>
    <testsuite name="Example Test Suite">
      <directory suffix="Test.php">./tests/</directory>
    </testsuite>
  </testsuites>
</phpunit>
```

Со всеми элементами файла **phpunit.xml** можно ознакомиться [здесь](https://phpunit.readthedocs.io/en/9.5/configuration.html). В данный момент лишь обратите внимание на элемент **directory**, в котором указан относительный путь к директории с тестами (**./tests/**), а также суффикс **Test.php**, на который должно оканчиваться название каждого файла с тестами.

Для того чтобы выполнить тестирование необходимо запустить файл **vendor/bin/phpunit**. При этом запуск тестов можно упростить, добавив в файл **composer.json** следующий параметр:

```
"scripts": {
		"test": [
	  		"vendor/bin/phpunit"
		]
},
```

Теперь тесты можно запустить так:

```
composer test
```

Переходим непосредственно к написанию кода. Создадим в нашем пакете некоторые компоненты фреймворка Laravel.

Для начала создадим файл миграции, в котором описывается схема некой таблицы **items**:

```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('items');
    }
}
```

Каждый класс миграций в Laravel зависит от нескольких классов фреймворка. Речь идет о трех классах, подключаемых с помощью ключевого слова **use**. Создав класс миграции мы делаем наш пакет зависящим от двух пакетов (**Illuminate\Database**, **Illuminate\Support**), в которых находятся указанные три класса. Данные пакеты уже были скачаны в нашу директорию **vendor** в момент установки **orchestra/testbench**, и мы можем их использовать в коде. Но, кроме того, данные зависимости необходимо явно указать в файле **composer.json** разрабатываемого пакета. Для этого в директиве require мы добавляем следующие строки:

```
"illuminate/database": "^9.0",
"illuminate/support": "^9.0"
```

Для созданной таблицы **items** мы добавляем модель **src/Models/Item.php**:

```
<?php

namespace Yuraplohov\LaravelExample\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{

}
```

Создаем файл контроллера **src/Http/Controllers/ItemsController.php** с методом **index()**:

```
<?php

namespace Yuraplohov\LaravelExample\Http\Controllers;

use Yuraplohov\LaravelExample\Models\Item;

class ItemsController
{
    public function index()
    {
        $items = Item::select(['name'])->get();

        return response()->json([
            'items' => $items,
        ]);
    }
}
```

Создаем файл роутов **routes/api.php** с вызовом нашего контроллера:

```
<?php

use Illuminate\Support\Facades\Route;
use Yuraplohov\LaravelExample\Http\Controllers\ItemsController;

Route::get('items', [ItemsController::class, 'index']);
```

Создаем файл конфигурации **config/example.php**:

```
<?php

return [
    'param' => env('EXAMPLE_PARAM', 100),
];
```

Создаем консольную команду в файле **src/Console/Commands/ExampleCommand.php**. В данной команде мы используем наш файл конфигурации **config/example.php**:

```
<?php

namespace Yuraplohov\LaravelExample\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class ExampleCommand extends Command
{
    protected $signature = 'example-command';

    protected $description = 'Example Command';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->info("Command executed with config param value " . Config::get('example.param'));

        return 0;
    }
}
```

Консольная команда требует еще одну зависимость, а именно **Illuminate\Console**. Добавляем ее в директиву require файла **composer.json**:

```
"illuminate/console": "^9.0",
```

Также создадим в пакете некий сервисный класс в файле **src/ExampleService.php**, который не зависит от фреймворка Laravel:

```
<?php

namespace Yuraplohov\LaravelExample;

class ExampleService
{
    public function getSomeResult()
    {
        return 'bar';
    }
}
```

Создаем сервис-провайдер нашего пакета в файле **src/Providers/LaravelExampleServiceProvider.php**. Это обязательный компонент каждого Laravel-пакета:

```
<?php

namespace Yuraplohov\LaravelExample\Providers;

use Illuminate\Support\ServiceProvider;
use Yuraplohov\LaravelExample\Console\Commands\ExampleCommand;

class LaravelExampleServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');

            $this->publishes([
                __DIR__ . '/../../config/example.php' => config_path('example.php'),
            ]);

            $this->commands([
                ExampleCommand::class,
            ]);
        }

        $this->loadRoutesFrom(__DIR__ . '/../../routes/api.php');
    }
}
```

Сервис провайдер связывает наш пакет с Laravel-приложением. В методе **boot()** сервис-провайдера происходит загрузка компонентов пакета в Laravel-приложение, а также указываются те ресурсы пакета, которые требуют публикации (копирования) из пакета в структуру приложения. Подробно о сервис-провайдерах в Laravel можно прочитать [здесь](https://laravel.com/docs/9.x/providers) и [здесь](https://laravel.com/docs/9.x/packages#service-providers).

В нашем примере в методе **boot()** загружаются миграции, консольные команды и роуты пакета. Кроме того, в методе **boot()** для публикации в приложение подготовлен файл конфигурации **example.php**. После того, как разработчик установит наш пакет ему потребуется опубликовать файл **example.php** в структуру проекта. Для этого необходимо выполнить следующую команду, в которой по неймспейсу указан путь к сервис-провайдеру пакета:

```
php artisan vendor:publish --provider="Yuraplohov\LaravelExample\Providers\LaravelExampleServiceProvider\"
```

В результате выполнения данной команды файл **example.php** из пакета будет скопирован в директорию **config** проекта, и именно созданная копия будет использоваться пакетом в качестве файла конфигурации. Данную команду надо указать в файле **README.md** пакета в разделе описания процесса установки.

Обратите внимание на условную конструкцию `if ($this->app->runningInConsole())` в методе **boot()**. Данное условие выполняется, когда приложение запущено с помощью CLI (Command-Line Interface), и не выполняется когда запрос приходит с web-сервера. Таким образом, код, доступ к которому необходим только в режиме CLI, не будет выполняться при обработке приложением web-запроса. Этой оптимизацией не стоит пренебрегать, так как методы **boot()** всех сервис-провайдеров выполняются при каждом запросе к приложению.

Переходим к написанию тестов.

Для начала попробуем написать обычный Unit-тест. Тестировать будем сервисный класс **ExampleService**.

Данный класс не зависит от фреймворка Laravel. В нем не используются ни фасады, ни модели, ни файлы конфигурации и никакие другие компоненты Laravel. То есть тестирование этого класса не требует запуска Laravel-приложения. Это значит, что его можно протестировать обычным Unit-тестом. В директории **tests** создадим файл **ExampleServiceTest.php** с тестом метода **getSomeResult()**.

```
<?php

namespace Yuraplohov\LaravelExample\Test;

use PHPUnit\Framework\TestCase;
use Yuraplohov\LaravelExample\ExampleService;

class ExampleServiceTest extends TestCase
{
    /**
     * @test
     */
    public function it_gets_some_result()
    {
        $sut = new ExampleService;
        $this->assertEquals('bar', $sut->getSomeResult());
    }
}
```

Тестовый класс мы наследуем от **PHPUnit\Framework\TestCase**. Таким образом мы можем писать обычные Unit-тесты для тех классов пакета, которые не зависят от фреймворка.

Теперь перейдем к функциональным (Feature) тестам, которые тестируют код, зависящий от фреймворка Laravel.

Создаем абстрактный класс **FeatureTestCase**, от которого в дальнейшем будем наследовать все классы функциональных тестов. При этом сам абстрактный **FeatureTestCase** наследуем от класса **Orchestra\Testbench\TestCase**.

```
<?php

namespace Yuraplohov\LaravelExample\Test;

use Orchestra\Testbench\TestCase;

class FeatureTestCase extends TestCase
{

}
```

Прежде всего в данном классе мы переопределяем метод **setUp()**, который выполняется перед каждым тестом.

```
public function setUp(): void
{
    parent::setUp();
}
```

В данном методе мы лишь вызываем его родительскую реализацию. После этого вызова можно выполнить дополнительные настройки приложения, чем мы воспользуемся позже.

Для того чтобы в функциональных тестах мы имели доступ ко всем компонентам разрабатываемого пакета, нам необходимо загрузить его сервис-провайдер. Для этого в **Testbench** предусмотрен метод **getPackageProviders()**. Переопределяем его в нашем **FeatureTestCase**.

```
<?php

protected function getPackageProviders($app)
{
    return [
        'Yuraplohov\LaravelExample\Providers\LaravelExampleServiceProvider',
    ];
}
```

В данном методе необходимо вернуть массив сервис-провайдеров, используемых пакетом. Прежде всего, это сервис-провайдеры самого разрабатываемого пакета, но кроме того, если в числе своих зависимостей пакет имеет другие Laravel-пакеты, то их сервис-провайдеры также необходимо указать в этом методе. При этом сервис-провайдеры указываются по их пространствам имен.

После загрузки сервис-провайдера, загружаемые в его методе boot компоненты (у нас это миграции, команды и роуты) становятся доступны в наших тестах.

Так как наш пакет предоставляет класс миграции, для его тестирования потребуется база данных. В качестве СУБД мы будем использовать SQLite. SQLite - это встраиваемая кроссплатформенная СУБД, реализованная в виде библиотеки на языке С, и которая присутствует в любом дистрибутиве интерпретатора PHP. Данный вариант драйвера идеально подходит для тестирования Laravel-пакетов, использующих базу данных.

При работе с Laravel-проектом, для того, чтобы иметь доступ к SQLite нам бы потребовалось внести соответствующие настройки в файл **config/database.php**. Пакет **Orchestra\Testbench** предоставляет метод **getEnvironmentSetUp()** для настройки конфигурации.

Переопределяем данный метод в нашем классе **FeatureTestCase**, и настраиваем в нем доступ к SQLite.

```
<?php

protected function getEnvironmentSetUp($app)
{
    $app['config']->set('database.default', 'sqlite');
    $app['config']->set('database.connections.sqlite', [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
    ]);
}
```

В данном методе вы можете устанавливать любые значения параметров конфигурации Laravel-приложения (файлы **config/app.php**, **config/auth.php** и т. д.), конфигурации разрабатываемого пакета, а также конфигураций Laravel-пакетов, указанных в качестве зависимостей разрабатываемого пакета.

После настройки базы данных нам необходимо выполнить миграции, предоставляемые нашим пакетом. Так как миграции уже загружены в приложение сервис-провайдером, нам необходимо лишь выполнить Artisan-команду **'migrate'**. Создадим метод **setUpDatabase()** с вызовом Artisan-команды для запуска миграций:

```
<?php

protected function setUpDatabase()
{
    $this->artisan('migrate')->run();
}
```

Вызовем этот метод в нашем методе **setUp()** после вызова его родительской реализации.

```
<?php

public function setUp(): void
{
    parent::setUp();

    $this->setUpDatabase();
}
```

Теперь каждый наш функциональный тест будет иметь доступ к базе данных с готовой структурой таблиц. Если таблицы необходимо наполнить тестовыми данными, сделать это можно как в самих тестовых методах, так и в методе **setUpDatabase()** сразу после запуска миграций.

Для запуска миграций в пакете **Testbench** предусмотрен альтернативный вариант. Он подходит в том случае, если миграции пакета в сервис-провайдере не загружаются, а подготавливаются к публикации. То есть если в методе **boot()** сервис-провайдера к миграциям применяется не метод **loadMigrationsFrom()**, а метод **publishes()**. Такие миграции по Artisan-команде не выполнятся, их необходимо сначала загрузить в приложение, а затем выполнить. Для этого в пакете **Testbench** предусмотрен метод с уже знакомым именем **loadMigrationsFrom()**. Этот метод не только загружает миграции в приложение, но и тут же выполняет их. Таким образом, вместо вызова Artisan-команды в методе **setUpDatabase()** мы могли бы использовать следующий код:

```
<?php

$this->loadMigrationsFrom(__DIR__ . '/../database/migrations/0000_00_00_000000_create_items_table.php');
```

Если разрабатываемый вами пакет имеет в своих зависимостях Laravel-пакеты с собственными публикуемыми миграциями, запустить их можно также методом **loadMigrationsFrom()**, указав путь к файлу миграции через директорию vendor.

После того как в базе данных созданы необходимые таблицы их можно наполнить тестовыми данными. Сделать это можно как в методе **setUpDatabase()** сразу после запуска миграций, так и непосредственно в самих тестовых методах. Воспользуемся вторым вариантом.

Сначала напишем тест для нашего контроллера. Создаем файл **tests/ItemsTest.php**:

```
<?php

namespace Yuraplohov\LaravelExample\Test;

use Yuraplohov\LaravelExample\Models\Item;

class ItemsTest extends FeatureTestCase
{
    /**
     * @test
     */
    public function it_gets_all_items()
    {
        Item::forceCreate(['name' => 'Name 1']);
        Item::forceCreate(['name' => 'Name 2']);

        $response = $this->get('items');

        $response->assertStatus(200);

        $response->assertExactJson([
            'items' => [
                ['name' => 'Name 1'],
                ['name' => 'Name 2'],
            ]
        ]);
    }
}
```

Класс теста мы наследуем от созданного абстрактного класса **FeatureTestCase**. В данном тесте мы наполняем базу данных тестовыми данными; вызываем роут **'items'**, предоставляемый пакетом и проверяем код http-ответа и содержимое тела ответа.

Теперь напишем тест для консольной команды, предоставляемой нашим пакетом. Создаем файл **tests/CommandTest.php**:

```
<?php

namespace Yuraplohov\LaravelExample\Test;

class CommandTest extends FeatureTestCase
{
    protected function getEnvironmentSetUp($app)
    {
        parent::getEnvironmentSetUp($app);

        $app['config']->set('example.param', 200);
    }

    /**
     * @test
     */
    public function it_executes_example_command()
    {
        $output = $this->artisan('example-command');

        $output->assertExitCode(0);

        $output->expectsOutput("Command executed with config param value 200");
    }
}
```

Так как наша консольная команда использует файл конфигурации **config/example.php**, нам необходимо установить тестовое значение его параметров. В классе **CommandTest** мы переопределяем метод **getEnvironmentSetUp()** и после вызова его родительской реализации устанавливаем тестовое значение параметра **example.param**. В самом тестовом методе мы вызываем консольную команду и проверяем код завершения команды, а также выведенный в консоль текст.

Таким образом, мы покрыли тестами функционал нашего пакета.

В завершение работы над кодом пакета добавим в файл **composer.json** следующую директиву для упрощения процесса установки пакета:

```
"extra": {
  "laravel": {
    "providers": [
      "Yuraplohov\\LaravelExample\\Providers\\EloquentFilterServiceProvider"
    ]
  }
}
```

Данная директива позволяет использовать механизм автоматического обнаружения пакетов Laravel. Без этого кода при установке пакета потребуется вручную добавлять наш сервис-провайдер в массив **providers** в файле **config/app.php** проекта, а с наличием этого кода сервис-провайдер будет загружен автоматически и все объявленные в нем компоненты станут доступны в приложении.

Разработку пакета будем считать завершенной. После завершения разработки пакета настоятельно рекомендуется создать файл **README.md**. В этом файле должны быть описаны шаги установки пакета, а также варианты использования функционала, предоставляемого пакетом. При составлении **README.md** может быть полезен данный [ресурс](https://www.makeareadme.com/).

Файлом **README.md** не стоит пренебрегать ни только в публичных пакетах, но и в приватных. Один раз задокументировав функционал пакета, вы облегчите жизнь себе и своим коллегам.

## Выпуск релиза пакета

Перед тем, как загрузить пакет в git-репозиторий, в корне пакета создаем файл **.gitignore**. В него добавляем следующее содержимое:

```
vendor
composer.lock
.phpunit.result.cache
```

Данные директории и файлы не будут добавлены в git-репозиторий.

Обратите внимание, что файл **composer.lock** добавляется в **.gitignore** только при разработке пакета. При разработке проекта файл **composer.lock** в **.gitignore** не добавляется и должен быть помещен в git-репозиторий. В процессе развертывания проекта при выполнении команды `composer install` все зависимости проекта будут скачаны согласно версиям, указанным в **composer.lock**. В пакете же **composer.lock** не нужен. При установке пакета в проект, все зависимости пакета будут скачаны согласно версиям, указанным в **composer.json**. Даже если **composer.lock** добавлен в репозиторий пакета, его содержимое никак не повлияет на установку зависимостей пакета.

После того, как вы загрузили свой пакет в git-репозиторий и убедились, что в основной ветке (обычно это ветка **master** либо **main**) находится версия кода, готовая к установке в проект, вам необходимо создать тэг. Тэг в данном случае - это версия релиза пакета, которая традиционно указывается согласно правилам семантического версионирования.

Объяснение правил семантического версионирования выходит за рамки данного туториала. Ознакомиться с этими правилами можно [здесь](https://semver.org/lang/ru/). В рамках же текущего материала стоит отметить, что соблюдение правил семантического версионирования при разработке пакетов строго обязательно. Необходимо следовать им не только в публичных пакетах, но и в приватных. Это избавит вас и вашу команду от многих проблем.

Чтобы создать тэг и залить его в git-репозиторий, необходимо выполнить следующие команды:

```
git tag 1.0.0
git push --tags
```

Теперь в вашем пакете создан релиз с версией 1.0.0, и ему соответствует состояние основной ветки, зафиксированное перед созданием тега.

Для просмотра существующих тегов (версий) пакета необходимо выполнить команду:

```
git tag
```

Если вы создаете публичный пакет, его необходимо добавить в реестр [packagist.org](https://packagist.org/). Сделать это несложно. Для этого необходимо создать аккаунт и указать путь к git-репозиторию через соответствующую [форму](https://packagist.org/packages/submit).

## Установка пакета

Для того, чтобы установить в проект публичный, зарегистрированный на [packagist.org](http://packagist.org/) пакет, достаточно выполнить команду `composer require`:

```
composer require yuraplohov/laravel-example
```

Для того, чтобы установить приватный пакет сначала необходимо указать его репозиторий в файле **composer.json** проекта.

```
"repositories": [
    {
        "type": "vcs",
        "url": "git@github.com:yuraplohov/laravel-example.git"
    }
]
```

Далее выполняем привычную команду:

```
composer require yuraplohov/laravel-example
```

При этом Сomposer попросит вас ввести логин и пароль вашего аккаунта в git-репозитории. После авторизации пакет будет установлен.

Если в процессе разработки пакета появилась необходимость протестировать его в реальном проекте, то вам не обязательно создавать новый релиз, чтобы затем установить его. Пакет можно установить по названию ветки и идентификатору конкретного коммита в этой ветке. Для этого при установке пакета вместо тэга версии указывается название ветки с префиксом "**dev-**", а через символ решетки (#) можно указать идентификатор коммита. Например, так можно установить версию пакета, соответствующую текущему состоянию ветки master.

```
composer require yuraplohov/laravel-example:dev-master
```

А так можно установить версию пакета, соответствующую конкретному коммиту в ветке **master**:

```
composer require yuraplohov/laravel-example:dev-master#ecb50b62a5ca4edd4f74ba94792660631277a779
```

Подробнее о способах установки пакетов можно прочитать [здесь](https://getcomposer.org/doc/05-repositories.md).

Код демонстрационного пакета, разработанного в рамках данного туториала, можно найти [здесь](https://github.com/yuraplohov/laravel-example).