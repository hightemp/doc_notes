https://laravel.demiart.ru/graphql-laravel/

В этой статье я расскажу вам, как создать свой собственный сервер GraphQL при помощи Laravel. Мы используем Lighthouse и научимся использовать встроенные директивы, создавать запросы и мутации, а также обрабатывать авторизацию и аутентификацию.

GraphQL — это язык запросов для API, который обеспечивает определенные преимущества по сравнению с альтернативными архитектурами, такими как REST. GraphQL чрезвычайно удобен, когда используется в качестве конечной точки для мобильных и одностраничных приложений. Он позволяет с относительной легкостью запрашивать вложенные и связанные данные в запросе, что позволяет разработчикам получать именно те данные, которые им нужны, за одно обращение на сервер.

Хотя сообщества GraphQL и Laravel значительно выросли с момента их появления, но документации, объясняющей, как использовать эти две технологии вместе, все еще мало.

### Обзор проекта

![](https://laravel.demiart.ru/wp-content/uploads/2019/10/GraphQL1-1024x167.png)

Прежде чем начнем, давайте ознакомимся с проектом, который мы будем делать. Мы определим наши ресурсы и создадим схему GraphQL, которую позже будем использовать для обслуживания нашего API.

#### РЕСУРСЫ ПРОЕКТА

Наше приложение будет состоять из двух ресурсов: `Articles` (Статьи) и `Users` (Пользователи). Эти ресурсы будут определены как объекты в схеме GraphQL:

type User {

id: ID!

name: String!

email: String!

articles: [Article!]!

}

type Article {

id: ID!

title: String!

content: String!

author: User!

}

На схеме мы видим, что между двумя нашими объектами существует отношение один ко многим. Пользователи могут написать много статей, а для статьи назначен автор (пользователь).

Теперь, когда у нас определены типы объектов, нам понадобится способ создания и запроса данных, поэтому давайте определим наши объекты запроса и мутации:

type Query {

user(id: ID!): User

users: [User!]!

article(id: ID!): Article

articles: [Article!]!

}

type Mutation {

createUser(name: String!, email: String!, password: String!): User

createArticle(title: String!, content: String!): Article

}

### Создание проекта Laravel

После того, как мы определили нашу схему GraphQL, давайте запустим наш приложение. Начнем с создания нового проекта Laravel через Composer:

composer create-project --prefer-dist laravel/laravel laravel-graphql

Для того, чтобы убедиться, что все работает, давайте загрузим наш сервер и посмотрим на дефолтную страницу:

cd laravel-graphql

php artisan serve

Laravel development server started: <http://127.0.0.1:8000>

### Модели базы данных и миграции

Для этой статьи мы будем использовать SQLite. Давайте внесем в файл .env следующие изменения:

```
DB_CONNECTION=sqlite

# DB_HOST=

# DB_PORT=

# DB_DATABASE=database.sqlite

# DB_USERNAME=

# DB_PASSWORD=
```

Создадим файл нашей базы данных:

```
touch ./database/database.sqlite
```

Laravel уже поставляется с моделью User и основными файлами миграции. Добавим столбец `api_token` в миграцию `CreateUsersTable`:

```
// /database/migrations/XXXX_XX_XX_000000_create_users_table.php

use Illuminate\Database\Migrations\Migration;

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration

{

/**

* Run the migrations.

*/

public function up()

{

Schema::create('users', function (Blueprint $table) {

$table->bigIncrements('id');

$table->string('name');

$table->string('email')->unique();

$table->timestamp('email_verified_at')->nullable();

$table->string('password');

$table->string('api_token', 80)->unique()->nullable()->default(null);

$table->rememberToken();

$table->timestamps();

});

}

/**

* Reverse the migrations.

*/

public function down()

{

Schema::dropIfExists('users');

}

}
```

Мы вернемся к этому столбцу позже, когда займемся авторизацией. Продолжим и создадим модель `Article` и файл миграции для неё:

php artisan make:model Article -m

_Примечание. Параметр `-m` создает файл миграции для создаваемой модели._

Кое-что изменим в миграции:

public function up()

{

Schema::create('articles', function (Blueprint $table) {

$table->bigIncrements('id');

$table->unsignedBigInteger('user_id');

$table->string('title');

$table->text('content');

$table->timestamps();

$table->foreign('user_id')->references('id')->on('users');

});

}

Мы добавили внешний ключ, указывающий на `id` в таблице `users`, а также столбцы `title` и `content`, которые мы определили в схеме GraphQL.

Теперь, когда у нас есть файлы миграции, давайте их запустим:

php artisan migrate

Обновим наши модели, задав необходимые отношения:

//app/User.php

namespace App;

use Illuminate\Notifications\Notifiable;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable

{

use Notifiable;

/**

* The attributes that are mass assignable.

*

* @var array

*/

protected $fillable = [

'name', 'email', 'password',

];

// ...

/**

* @return \Illuminate\Database\Eloquent\Relations\HasMany

*/

public function articles()

{

return $this->hasMany(Article::class);

}

}

//app/Article.php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model

{

/**

* The attributes that are mass assignable.

*

* @var array

*/

protected $fillable = [

'title', 'content',

];

/**

* @return \Illuminate\Database\Eloquent\Relations\BelongsTo

*/

public function user()

{

return $this->belongsTo(User::class);

}

}

### Заполнение базы данных

Теперь, когда настроены модели и миграции, давайте заполним нашу базу данных. Начнем с создания сидеров для таблиц `articles` и `users`:

php artisan make:seeder UsersTableSeeder

php artisan make:seeder ArticlesTableSeeder

Настроим их для добавления фиктивных данных в SQLite:

//database/seeds/UsersTableSeeder.php

use App\User;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder

{

/**

* Run the database seeds.

*/

public function run()

{

\App\User::truncate();

$faker = \Faker\Factory::create();

$password = bcrypt('secret');

\App\User::create([

'name' => $faker->name,

'email' => 'graphql@test.com',

'password' => $password,

]);

for ($i = 0; $i < 10; ++$i) {

\App\User::create([

'name' => $faker->name,

'email' => $faker->email,

'password' => $password,

]);

}

}

}

// database/seeds/ArticlesTableSeeder.php

use App\Article;

use Illuminate\Database\Seeder;

class ArticlesTableSeeder extends Seeder

{

/**

* Run the database seeds.

*/

public function run()

{

\App\Article::truncate();

\App\Article::unguard();

$faker = \Faker\Factory::create();

\App\User::all()->each(function ($user) use ($faker) {

foreach (range(1, 5) as $i) {

\App\Article::create([

'user_id' => $user->id,

'title' => $faker->sentence,

'content' => $faker->paragraphs(3, true),

]);

}

});

}

}

// database/seeds/DatabaseSeeder.php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder

{

/**

* Seed the application's database.

*

* @return void

*/

public function run()

{

$this->call(UsersTableSeeder::class);

$this->call(ArticlesTableSeeder::class);

}

}

Запустим наши сидеры и заполним базу данных:

php artisan db:seed

### Laravel Lighthouse и сервер GraphQL

Теперь, когда у нас есть настроенная база данных и модели, пришло время приступить к созданию сервера GraphQL. Для Laravel существует несколько вариантов, в этой статье мы будем использовать [Lighthouse](https://github.com/nuwave/lighthouse).

Lighthouse — это пакет, который я создал несколько лет назад. Недавно он получил удивительную поддержку со стороны растущего вокруг него сообщества. Он позволяет разработчикам быстро настроить сервер GraphQL, используя Laravel с небольшим количеством кода. При этом пакет достаточно гибкий и настраивается для использования в практически любом проекте.

![GraphQL и Laravel](https://laravel.demiart.ru/wp-content/uploads/2019/10/GraphQL2-1024x310.png)

Установим пакет в наш проект:

composer require nuwave/lighthouse:"3.1.*"

Опубликуем файл конфигурации Lighthouse:

php artisan vendor:publish --provider="Nuwave\Lighthouse\LighthouseServiceProvider" --tag=config

_Примечание. Вы также можете опубликовать дефолтную схему Lighthouse, просто удалив параметр `--tag=config`. Но в этой статье мы будем создавать схему с нуля._

Если вы посмотрите в файл `config/lighthouse.php`, то увидите настройку, используемую для регистрации нашего файла схемы в Lighthouse:

'schema' => [

'register' => base_path('graphql/schema.graphql'),

],

Давайте создадим файл схемы `/graphql/schema.graphql` и настроим тип объекта пользователя и запроса:

type User {

id: ID!

name: String!

email: String!

}

type Query {

user(id: ID! @eq): User @find

users: [User!]! @all

}

Скорей всего вы заметили, что наша схема выглядит так же как и та, которую мы сделали раньше, за исключением того, что мы добавили некоторые идентификаторы, называемые [директивами схемы](https://www.apollographql.com/docs/graphql-tools/schema-directives).

Разберем схему. Наше первое определение — это тип объекта `User`, который имеет отношение к eloquent модели `App\User`. Мы определили поля `id`, `name` и `email`, которые могут быть запрошены в модели `User`. Это также означает, что к полям `password`, `created_at`, и `updated_at` нельзя обращаться из API.

Далее у нас есть тип `Query`, являющийся точкой входа в наш API и использующийся для запроса данных. Наше первое поле — `users`, возвращающее массив типов объектов `User`. Директива `@all` сообщает Lighthouse, что нужно выполнить запрос Eloquent, используя модель `User` и получить все результаты. Тоже самое, что и:

$users = \App\User::all();

_Примечание: Lighthouse знает, что модель нужно искать в пространстве имен `\App\User` по опции `namespaces` в файле конфигурации._

Второе поле в типе запроса — это вызов `user`, который принимает `id` в качестве аргумента и возвращает один тип объекта `User`. Мы также добавили две директивы, которые помогут Lighthouse автоматически построить запрос и вернуть один результат. Директива `@eq` сообщает Lighthouse, что нужно добавить `where` по `id`, а директива `@find` указывает на возврат одного результата. Если написать этот запрос, используя построитель запросов Laravel, то он будет выглядеть так:

$user = \App\User::where('id', $args['id'])->first();

### Работаем с API GraphQL

Теперь, когда у нас есть представление о том, как Lighthouse использует нашу схему для создания запросов, давайте запустим наш сервер и запросим данные. Начнем с запуска нашего сервера:

php artisan serve

Laravel development server started: <http://127.0.0.1:8000>

Чтобы запросить конечную точку GraphQL, вы можете запустить команду cURL в терминале или стандартном клиенте, например в Postman. Однако, для того, чтобы получить все преимущества GraphQL (такие как автозаполнение, выделение ошибок, документация и т.д.), мы будем использовать [GraphQL Playground](https://github.com/prisma/graphql-playground) ([скачать](https://github.com/prisma/graphql-playground/releases)).

При запуске Playground, нажмите на вкладку «URL Endpoint» и введите `http://localhost:8000/graphql`, чтобы указать GraphQL Playground наш сервер. В левой части редактора мы можем запрашивать наши данные. Давайте начнем с того, что запросим всех пользователей, которых мы добавили в базу данных:

{

users {

id

email

name

}

}

Когда вы нажмете кнопку play в середине IDE (или Ctrl+Enter), то увидите ответ JSON от сервера с правой стороны, который будет выглядеть примерно так:

{

"data": {

"users": [

{

"id": "1",

"email": "graphql@test.com",

"name": "Carolyn Powlowski"

},

{

"id": "2",

"email": "kheaney@yahoo.com",

"name": "Elouise Raynor"

},

{

"id": "3",

"email": "orlando.sipes@yahoo.com",

"name": "Mrs. Dejah Wiza"

},

...

]

}

}

_Примечание. Поскольку мы использовали Faker для заполнения базы данных, то данные в полях `email` и `name` будут отличаться._

Давайте попробуем запросить одного пользователя:

{

user(id: 1) {

email

name

}

}

И получим следующий ответ:

{

"data": {

"user": {

"email": "graphql@test.com",

"name": "Carolyn Powlowski"

}

}

}

С запроса таких данных приятно начинать, но маловероятно, что вы окажетесь в проекте, где нужно будет запрашивать все данные разом. Поэтому добавим пагинацию. Если посмотреть на широкий спектр встроенных директив Lighthouse, то можно увидеть директиву `@paginate`. Обновим объект запроса нашей схемы следующим образом:

type Query {

user(id: ID! @eq): User @find

users: [User!]! @paginate

}

Если перезагрузить GraphQL Playground через Ctrl/Cmd+R и попробовать выполнить запрос пользователей еще раз, то вы получите ошибку «_Cannot query field «id» on type «UserPaginator»_». Что же случилось? Lighthouse манипулирует нашей схемой, чтобы мы могли получить постраничный вывод результатов, и делает это, изменяя тип возвращаемого поля `users`.

Давайте подробнее рассмотрим нашу схему на вкладке Docs в GraphQL Playground. Посмотрите на поле `users` — оно возвращает `UserPaginator`, который возвращает массив пользователей и заданный Lighthouse’ом тип `PaginatorInfo`:

type UserPaginator {

paginatorInfo: PaginatorInfo!

data: [User!]!

}

type PaginatorInfo {

count: Int!

currentPage: Int!

firstItem: Int

hasMorePages: Boolean!

lastItem: Int

lastPage: Int!

perPage: Int!

total: Int!

}

Если вы знакомы со встроенной пагинацией в Laravel, то поля, доступные в типе `PaginatorInfo`, вам уже знакомы. Итак, чтобы запросить двух пользователей, получить общее количество пользователей и проверить, что у нас есть страницы для цикла, мы бы отправили следующий запрос:

{

users(count:2) {

paginatorInfo {

total

hasMorePages

}

data {

id

name

email

}

}

}

Который вернет нам следующий ответ:

{

"data": {

"users": {

"paginatorInfo": {

"total": 11,

"hasMorePages": true

},

"data": [

{

"id": "1",

"name": "Carolyn Powlowski",

"email": "graphql@test.com"

},

{

"id": "2",

"name": "Elouise Raynor",

"email": "kheaney@yahoo.com"

},

]

}

}

}

### Отношения

Как правило, при разработке приложений большая часть данных связана. В нашем случае `User` может написать много `Articles`, поэтому давайте добавим это отношение к типу `User` и определим тип `Article`:

type User {

id: ID!

name: String!

email: String!

articles: [Article!]! @hasMany

}

type Article {

id: ID!

title: String!

content: String!

}

Здесь мы используем директиву `@hasMany`, которая сообщает Lighthouse, что модель `User` имеет отношение `\Illuminate\Database\Eloquent\Relations\HasMany` с моделью `Article`.

Давайте запросим свежеопределенные отношения:

{

user(id:1) {

articles {

id

title

}

}

}

Мы получим такой ответ:

{

"data": {

"user": {

"articles": [

{

"id": "1",

"title": "Aut velit et temporibus ut et tempora sint."

},

{

"id": "2",

"title": "Voluptatem sed labore ea voluptas."

},

{

"id": "3",

"title": "Beatae sit et maxime consequatur et natus totam."

},

{

"id": "4",

"title": "Corrupti beatae cumque accusamus."

},

{

"id": "5",

"title": "Aperiam quidem sit esse rem sed cupiditate."

}

]

}

}

}

Теперь добавим отношение `author` к нашему типу объекта `Article` используя директиву `@belongsTo` и обновим `Query`:

type Article {

id: ID!

title: String!

content: String!

author: User! @belongsTo(relation: "user")

}

type Query {

user(id: ID! @eq): User @find

users: [User!]! @paginate

article(id: ID! @eq): Article @find

articles: [Article!]! @paginate

}

Как вы видите, мы добавили опциональный аргумент `relation` в директиву `@belongsTo`. Он говорит Lighthouse использовать отношение `user` модели `Articles` и назначать его в полю `author`.

Давайте запросим список статей с их авторами:

{

articles(count:2) {

paginatorInfo {

total

hasMorePages

}

data {

id

title

author {

name

email

}

}

}

}

Мы должны получить следующий ответ от сервера:

{

"data": {

"articles": {

"paginatorInfo": {

"total": 55,

"hasMorePages": true

},

"data": [

{

"id": "1",

"title": "Aut velit et temporibus ut et tempora sint.",

"author": {

"name": "Carolyn Powlowski",

"email": "graphql@test.com"

}

},

{

"id": "2",

"title": "Voluptatem sed labore ea voluptas.",

"author": {

"name": "Carolyn Powlowski",

"email": "graphql@test.com"

}

}

]

}

}

}

### GraphQL Мутация

Теперь, когда мы можем запрашивать данные, давайте напишем мутации для создания новых пользователей и статей. Начнем с пользовательской модели:

type Mutation {

createUser(

name: String!

email: String! @rules(apply: ["email", "unique:users"])

password: String! @bcrypt @rules(apply: ["min:6"])

): User @create

}

Разберем эту схему. Мы создали мутацию под именем `createUser`, которая принимает три аргумента (`name`, email и `password`). Мы применили директиву `@rules` к аргументам `email` и `password` . Это может показаться вам знакомым, так как это похоже на [валидацию в Laravel](https://laravel.com/docs/5.8/validation#quick-writing-the-validation-logic).

Затем мы применяем директиву `@bcrypt` к полю `password`. Это зашифрует пароль, прежде чем он будет передан во вновь созданную модель.

Наконец, чтобы помочь нам создать новые модели, Lighthouse предоставляет директиву `@create`, которая будет принимать заданные нами аргументы и создавать новую модель. Выполнение той же логики в контроллере будет выглядеть следующим образом:

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller

{

/**

* Create a new user.

*

* @param \Illuminate\Http\Request $request

* @return \Illuminate\Http\Response

*/

public function store(Request $request)

{

$data = $this->validate($request, [

'email' => ['email', 'unique:users'],

'password' => ['min:6']

]);

$user = \App\User::create($data);

return response()->json(['user' => $user]);

}

}

Поле мутации `createUser` настроили, давайте запустим его в GraphQL Playground:

mutation {

createUser(

name:"John Doe"

email:"john.doe@example.com"

password: "secret"

) {

id

name

email

}

}

Мы должны получить следующий ответ:

{

"data": {

"createUser": {

"id": "12",

"name": "John Doe",

"email": "john.doe@example.com"

}

}

}

### GraphQL Аутентификация и Авторизация

Поскольку нам нужно добавить `user_id` к моделям `Article`, сейчас самое время перейти к аутентификации и авторизации в GraphQL/Lighthouse.

![GraphQL и Laravel](https://laravel.demiart.ru/wp-content/uploads/2019/10/GraphQL3-1024x396.png)

Чтобы аутентифицировать пользователя, нам нужно предоставить ему `api_token`. Давайте создадим для этого мутацию и добавим директиву `@field`, указывающую Lighthouse на отдельный `resolver`, который будет обрабатывать эту логику. И настроим его как [обычный контроллер в Laravel](https://laravel.com/docs/5.8/controllers#basic-controllers), используя аргумент `resolver`.

Директивой `@field,` определенной ниже, мы сообщаем Lighthouse, что когда запускается мутация `login`, то использовать метод `createToken` в `App\GraphQL\Mutations\AuthMutator`:

type Mutation {

# ...

login(

email: String!

password: String!

): String @field(resolver: "AuthMutator@resolve")

}

_Примечание. Вам не нужно здесь использовать пространство имен. Для мутаций оно уже определено как `App\\GraphQL\\Mutations` в конфигурационном файле `lighthouse.php`. Однако вы можете использовать полное пространство имен, если хотите._

Давайте используем генератор Lighthouse для создания нового класса преобразователя (mutator):

php artisan lighthouse:mutation AuthMutator

Обновим нашу функцию resolver следующим образом:

namespace App\GraphQL\Mutations;

use Illuminate\Support\Arr;

use Illuminate\Support\Str;

use Illuminate\Support\Facades\Auth;

use GraphQL\Type\Definition\ResolveInfo;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class AuthMutator

{

/**

* Return a value for the field.

*

* @param null $rootValue Usually contains the result returned from the parent field. In this case, it is always `null`.

* @param mixed[] $args The arguments that were passed into the field.

* @param \Nuwave\Lighthouse\Support\Contracts\GraphQLContext $context Arbitrary data that is shared between all fields of a single query.

* @param \GraphQL\Type\Definition\ResolveInfo $resolveInfo Information about the query itself, such as the execution state, the field name, path to the field from the root, and more.

* @return mixed

*/

public function resolve($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)

{

$credentials = Arr::only($args, ['email', 'password']);

if (Auth::once($credentials)) {

$token = Str::random(60);

$user = auth()->user();

$user->api_token = $token;

$user->save();

return $token;

}

return null;

}

}

Теперь, когда `resolver` настроен, давайте его проверим и попробуем получить токен API, используя следующую мутацию в GraphQL Playground:

mutation {

login(email:"graphql@test.com", password:"secret")

}

Мы должны получить токен:

{

"data": {

"login": "VJCz1DCpmdvB9WatqvWbXBP2RN8geZQlrQatUnWIBJCdbAyTl3UsdOuio3VE"

}

}

_Примечание. Обязательно скопируйте присланный токен для того, чтобы его можно было использовать позже._

Для того, чтобы убедиться, что наша логика работает, давайте добавим поле запроса, которое вернет аутентифицированного пользователя. Поле под названием `me` и с директивой `@auth`. Установим аргумент `guard` равным `api`, поскольку именно так мы будем аутентифицировать пользователя.

Выполним запрос. В GraphQL Playground вы можете устанавливать заголовки ваших запросов, дважды кликнув на вкладку «Http Headers» внизу. Мы добавили заголовки с JSON объектом, поэтому для добавления bearer токена в каждый запрос надо добавить следующее:

{

"Authorization": "Bearer VJCz1DCpmdvB9WatqvWbXBP2RN8geZQlrQatUnWIBJCdbAyTl3UsdOuio3VE"

}

_Примечание. Замените bearer токен на тот, который вы получили при логине._

Давайте выполним запрос `me`:

{

me {

email

articles {

id

title

}

}

}

В результате мы должны получить следующее:

{

"data": {

"me": {

"email": "graphql@test.com",

"articles": [

{

"id": "1",

"title": "Rerum perspiciatis et quos occaecati exercitationem."

},

{

"id": "2",

"title": "Placeat quia cumque laudantium optio voluptatem sed qui."

},

{

"id": "3",

"title": "Optio voluptatem et itaque sit animi."

},

{

"id": "4",

"title": "Excepturi in ad qui dolor ad perspiciatis adipisci."

},

{

"id": "5",

"title": "Qui nemo blanditiis sed fugit consequatur."

}

]

}

}

}

### Мидлвар

Теперь мы знаем, что наша аутентификация работает правильно. Пора написать нашу последнюю мутацию для создания статьи для аутентифицированного пользователя. Мы будем использовать директиву `@field`, чтобы указывать Lighthouse на наш `resolver`, а также включим директиву `@middleware` для гарантии, что пользователь залогинен.

type Mutation {

# ...

createArticle(title: String!, content: String!): Article

@field(resolver: "ArticleMutator@create")

@middleware(checks: ["auth:api"])

}

Во-первых, давайте сгенерируем класс преобразователя:

php artisan lighthouse:mutation ArticleMutator

И добавим в него следующую логику:

namespace App\GraphQL\Mutations;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ArticleMutator

{

/**

* Return a value for the field.

*

* @param null $rootValue

* @param mixed[] $args

* @param \Nuwave\Lighthouse\Support\Contracts\GraphQLContext $context

* @return mixed

*/

public function create($rootValue, array $args, GraphQLContext $context)

{

$article = new \App\Article($args);

$context->user()->articles()->save($article);

return $article;

}

}

_Примечание. Мы переименовали дефолтную функцию `resolve` в `create`. Но не нужно создавать новый класс для каждого resolver, вы просто можете группировать логику._

Запустим нашу новую мутацию и проверим результат. Не забудьте сохранить заголовок `Authorization` из нашего предыдущего запроса на вкладке «HTTP Headers»:

mutation {

createArticle(

title:"Building a GraphQL Server with Laravel"

content:"In case you're not currently familiar with it, GraphQL is a query language used to interact with your API..."

) {

id

author {

id

email

}

}

}

Должны получить:

{

"data": {

"createArticle": {

"id": "56",

"author": {

"id": "1",

"email": "graphql@test.com"

}

}

}

}

### Завершение

Напомню, мы использовали Lighthouse для создания сервера GraphQL для нашего проекта на Laravel. Использовали встроенные директивы, создавали запросы и мутации, а также обрабатывали авторизацию и аутентификацию.

Lighthouse позволяет  делать гораздо больше (например, создавать собственные директивы), но в этой статье мы остановились на основах и смогли установить и запустить сервер GraphQL с небольшой шаблонной структурой.

В следующий раз, когда вам нужно настроить API для мобильного или одностраничного приложения, обязательно рассмотрите GraphQL как способ запроса ваших данных!