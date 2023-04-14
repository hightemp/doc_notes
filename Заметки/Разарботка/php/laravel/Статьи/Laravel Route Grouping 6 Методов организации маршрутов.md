https://habr.com/ru/articles/671018/

В процессе работы программисту всегда полезно иметь структурированные записи для последующего к ним возвращения. Это позволяет не терять нужные знания и разгрузить память. Вашему вниманию предлагается полезная в работе запись, к которой можно всегда обращаться для организации (рефакторинга) роутов. Перевод статьи известного в кругах Ларавел [PovilasKorop](https://laravel-news.com/laravel-route-organization-tips)

Laravel Routing - это функция, которую разработчики изучают с самого начала. Но по мере роста проектов становится все труднее управлять постоянно растущими файлами маршрутов, прокручивая их, чтобы найти нужное `Route::get()` объявление. К счастью, существуют методы, позволяющие сделать файлы маршрутов короче и читабельнее, группируя маршруты и их настройки по-разному. Давайте посмотрим.

Здесь мы не будем говорить только об общем простом `Route::group()`- это начальный уровень. Давайте погрузимся немного глубже.

### Группировка 1. Route::resource и Route::ApiResource

Начнем со "слона в комнате": это, пожалуй, самая известная группировка. Если у вас есть типичный набор CRUD-действий вокруг одной модели, стоит сгруппировать их в контроллер [ресурсов](https://laravel.com/docs/9.x/controllers#resource-controllers)

Такой контроллер может состоять [до 7 методов](https://laravel.com/docs/9.x/controllers#actions-handled-by-resource-controller) (но может иметь и меньше):

-   index()
    
-   create()
    
-   store()
    
-   show()
    
-   edit()
    
-   update()
    
-   destroy()
    

Поэтому, если ваш набор маршрутов соответствует этим методам, вместо кода:

```
Route::get('books', [BookController::class, 'index'])->name('books.index');
Route::get('books/create', [BookController::class, 'create'])->name('books.create');
Route::post('books', [BookController::class, 'store'])->name('books.store');
Route::get('books/{book}', [BookController::class, 'show'])->name('books.show');
Route::get('books/{book}/edit', [BookController::class, 'edit'])->name('books.edit');
Route::put('books/{book}', [BookController::class, 'update'])->name('books.update');
Route::delete('books/{book}', [BookController::class, 'destroy'])->name('books.destroy');
```

.. у вас может быть только одна строка:

```
Route::resource('books', BookController::class);
```

Если вы работаете с проектом API, вам не нужны визуальные маршруты для для создания / редактирования (роуты edit и create), поэтому у вас может быть другой синтаксис. `apiResource()` он будет охватывать 5 методов из 7:

```
Route::apiResource('books', BookController::class);
```

Кроме того, я советую вам рассмотреть контроллеры ресурсов, даже если у вас есть 2-4 метода, а не полные 7. Просто потому, что он соблюдает стандартное соглашение об именах - для URL-адресов, методов и имен маршрутов.

Например, в этом случае вам не нужно указывать имена вручную:

```
Route::get('books/create', [BookController::class, 'create'])->name('books.create');
Route::post('books', [BookController::class, 'store'])->name('books.store');
// Instead, here names "books.create" and "books.store" are assigned automatically
Route::resource('books', BookController::class)->only(['create', 'store']);
```

### Группировка 2. Группа внутри группы

Конечно, все знают об общей [Route grouping](https://laravel.com/docs/9.x/routing#route-groups). Но для более сложных проектов одного уровня группировки может быть недостаточно.

Реальный пример: вы хотите, чтобы авторизованные маршруты были сгруппированы с `auth` middleware, но внутри вам нужно разделить больше подгрупп, таких как администратор и простой пользователь.

```
Route::middleware('auth')->group(function() {
    Route::middleware('is_admin')->prefix('admin')->group(function() {
    	Route::get(...) // administrator routes
    });


    Route::middleware('is_user')->prefix('user')->group(function() {
    	Route::get(...) // user routes
    });
});
```

---

### Группировка 3. Повторение middleware в группу

Что делать, если у вас довольно много middleware, некоторые из которых повторяются в нескольких группах маршрутов?

```
Route::prefix('students')->middleware(['auth', 'check.role', 'check.user.status', 'check.invoice.status', 'locale'])->group(function () {
    // ... student routes
});


Route::prefix('managers')->middleware(['auth', 'check.role', 'check.user.status', 'locale'])->group(function () {
    // ... manager routes
});
```

Как видите, существует 5 middleware, 4 из которых повторяются. Таким образом, мы можем переместить эти 4 в отдельную группу middleware в файле `app/Http/Kernel.php`:

```
protected $middlewareGroups = [
    // This group comes from default Laravel
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    // This group comes from default Laravel
    'api' => [
        // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    // THIS IS OUR NEW MIDDLEWARE GROUP
    'check_user' => [
        'auth',
        'check.role',
        'check.user.status',
        'locale'
    ],
];
```

Так мы назвали нашу группу `check_user`, и теперь мы можем сократить маршруты:

```
Route::prefix('students')->middleware(['check_user', 'check.invoice.status'])->group(function () {
    // ... student routes
});

Route::prefix('managers')->middleware(['check_user'])->group(function () {
    // ... manager routes
});
```

---

### Группировка 4. Контроллеры с одинаковыми именами, разные пространства имен

Довольно распространенная ситуация - это иметь, например, `HomeController` для разных ролей пользователей, например `Admin/HomeController` и `User/HomeController` И если вы используете полный путь в своих маршрутах, это выглядит примерно так:

```
Route::prefix('admin')->middleware('is_admin')->group(function () {
    Route::get('home', [\App\Http\Controllers\Admin\HomeController::class, 'index']);
});

 

Route::prefix('user')->middleware('is_user')->group(function () {
    Route::get('home', [\App\Http\Controllers\User\HomeController::class, 'index']);
});
```

Довольно много кода для ввода с этими полными путями, не так ли? Вот почему многие разработчики предпочитают иметь только `HomeController::class` в списке маршрутов и добавьте что-то вроде этого сверху:

```
use App\Http\Controllers\Admin\HomeController;
```

Но проблема здесь в том, что у нас одно и то же имя класса контроллера! Так что это не сработает:

```
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\User\HomeController;
```

Какой из них будет "официальным"? Ну, один из способов - изменить имя и назначить псевдоним одному из них:

```
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\User\HomeController;
```

```
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\User\HomeController;

 
Route::prefix('admin')->middleware('is_admin')->group(function () {
    Route::get('home', [AdminHomeController::class, 'index']);
});


Route::prefix('user')->middleware('is_user')->group(function () {
    Route::get('home', [HomeController::class, 'index']);
});
```

Но лично для меня изменение имени класса сверху довольно запутанно, мне нравится другой подход: добавить `namespace()` для подпапок Контроллеров:

```
Route::prefix('admin')->namespace('App\Http\Controllers\Admin')->middleware('is_admin')->group(function () {
    Route::get('home', [HomeController::class, 'index']);
    // ... other controllers from Admin namespace
});

 
Route::prefix('user')->namespace('App\Http\Controllers\User')->middleware('is_user')->group(function () {
    Route::get('home', [HomeController::class, 'index']);
    // ... other controllers from User namespace
});
```

Hidden text

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b0f/bba/815/b0fbba815986dd8935191608846abd84.png)

[](https://laravel.com/docs/8.x/routing#route-group-namespaces)

---

### Группировка 5. Отдельные файлы маршрутов

Если вы чувствуете, что ваш главный `routes/web.php` или `routes/api.php` становится слишком большим, вы можете взять некоторые маршруты и поместить их в отдельный файл, назвать их так, как вы хотите, например `routes/admin.php`.

Затем, чтобы включить этот файл, у вас есть два способа: Я называю это "Laravel way" и "PHP way".

Если вы хотите следовать структуре того, как Laravel структурирует свои файлы маршрутов по умолчанию, это происходит в **app/Providers/RouteServiceProvider.php** :

```
public function boot()
{
    $this->configureRateLimiting();
    $this->routes(function () {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    });
}

```

Как видите, и то, и другое `routes/api.php` и `routes/web.php` находятся здесь, с немного другими настройками. Итак, все, что вам нужно сделать, это добавить сюда свой файл администратора:

```
$this->routes(function () {
    Route::middleware('api')
        ->prefix('api')
        ->group(base_path('routes/api.php'));
 
    Route::middleware('web')
        ->group(base_path('routes/web.php'));

    Route::middleware('is_admin')
        ->group(base_path('routes/admin.php'));
});
```

Но если вы не хотите погружаться в [поставщиков услуг](https://laravel-news.com/service-providers) , есть более короткий путь - просто включите / требуйте файл routes в другой файл, как вы сделали бы в любом PHP-файле, вне рамок Laravel.

На самом деле это сделал сам Тейлор Отуэлл, потребовав `routes/auth.php` файл непосредственно в [маршруты Laravel Breeze](https://github.com/laravel/breeze/blob/1.x/stubs/default/routes/web.php) :

**routes/web.php** :

```
Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
```

---

### Группировка 6. Новое в Laravel 9: Route::controller()

Если у вас есть несколько методов в контроллере, но они не соответствуют стандартной структуре ресурсов, вы все равно можете сгруппировать их, не повторяя имя контроллера для каждого метода.

Вместо:

```
Route::get('profile', [ProfileController::class, 'getProfile']);
Route::put('profile', [ProfileController::class, 'updateProfile']);
Route::delete('profile', [ProfileController::class, 'deleteProfile']);
```

Вы можете сделать:

```
Route::controller(ProfileController::class)->group(function() {
    Route::get('profile', 'getProfile');
    Route::put('profile', 'updateProfile');
    Route::delete('profile', 'deleteProfile');
});
```

Эта функция доступна в Laravel 9 и последних младших версиях Laravel 8.

---

Вот и все, это методы группировки, которые, надеюсь, помогут вам организовать и поддерживать ваши маршруты, независимо от того, насколько велик ваш проект.