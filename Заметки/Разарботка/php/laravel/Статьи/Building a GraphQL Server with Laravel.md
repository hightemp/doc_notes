https://www.toptal.com/graphql/laravel-graphql-server-tutorial

In case you’re still not familiar with it, GraphQL is a query language used to interact with your API which [provides some benefits](https://www.toptal.com/api-development/graphql-vs-rest-tutorial) compared to alternative architectures such as REST. GraphQL is extremely handy when used to serve as an endpoint for mobile and single-page applications. GraphQL allows you to query nested and related data in a request with relative ease, allowing developers to obtain the exact data they need in a single round trip to the server.

[Laravel](https://laravel.com/) is a popular, opinionated PHP web framework. It provides numerous built-in tools to get applications up and running quickly, but it also allows developers to swap out their own implementations for Laravel’s built-in interfaces when preferred.

Although the communities surrounding both GraphQL and Laravel have grown dramatically since they were open-sourced, documentation explaining how to use these two technologies together is still somewhat scarce.

So, in this tutorial, I will show you how to create your own GraphQL server using Laravel.

## Project Overview

[![GraphQL server overview illustration](https://assets.toptal.io/images?url=https://uploads.toptal.io/blog/image/129751/toptal-blog-image-1558175797581-6141ca718b94392caef461d23116f8f9.png)](https://uploads.toptal.io/blog/image/129751/toptal-blog-image-1558175797581-6141ca718b94392caef461d23116f8f9.png)

Before we get started, we’ll need to get familiar with the project we are attempting to build. To do that, we will define our resources and create our GraphQL schema, which we will later use to serve our API.

### Project Resources

Our application will consist of two resources: _Articles_ and _Users_. These resources will be defined as object types in our GraphQL schema:

```php
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
```

Looking at the schema, we can see that we have a one-to-many relationship between our two objects. Users can write many articles, and an article has an author (user) assigned to it.

Now that we have our object types defined, we’ll need a way to create and query our data, so let’s define our query and mutation objects:

```php
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
```

## Setting Up Our Laravel Project

Now that we’ve defined our GraphQL schema, let’s get our Laravel project up and running. Let’s start by creating a new Laravel via Composer project:

```php
$ composer create-project --prefer-dist laravel/laravel laravel-graphql
```

Just to make sure we have everything working, let’s boot up our server and make sure we see Laravel’s default page:

```php
$ cd laravel-graphql
$ php artisan serve
Laravel development server started: <http://127.0.0.1:8000>
```

### Database Models and Migrations

For the purposes of this article, we will be using SQLite. So, let’s make the following changes to the default `.env` file:

```php
DB_CONNECTION=sqlite
# DB_HOST=
# DB_PORT=
# DB_DATABASE=database.sqlite
# DB_USERNAME=
# DB_PASSWORD=
```

Next, let’s create our database file:

```php
$ touch ./database/database.sqlite
```

Laravel ships with a user model and some basic migration files. Let’s quickly add an `api_token` column to our in our `CreateUsersTable` migration file provided to us by Laravel:

```php
/database/migrations/XXXX_XX_XX_000000_create_users_table.php
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

We’ll circle back to this additional column later on in the article when we get to authorization. Now let’s go ahead and create our article model and a migration file to create the associated table:

```php
$ php artisan make:model Article -m
```

**Note:** _The -m option creates a migration file for our newly created article model._

Let’s make some adjustments to the generated migration file:

```php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
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

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}

```

We’ve added a foreign key pointing to the `id` on our `users` table as well as the `title` and `content` columns we defined in our GraphQL schema.

Now that we have our migration files defined, let’s go ahead and run them against our database:

```php
$ php artisan migrate
```

Next, let’s update our models by defining the necessary relationships:

```php
app/User.php
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
```

```php
app/Article.php
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

```

### Database Seeding

Now that we have our models and migrations set up, let’s seed our database. We’ll start by creating some seeder classes for our `articles` and `users` tables:

```php
$ php artisan make:seeder UsersTableSeeder 
$ php artisan make:seeder ArticlesTableSeeder
```

Next, let’s set them up to insert some dummy data into our SQLite database:

```php
database/seeds/UsersTableSeeder.php
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
            'name'     => $faker->name,
            'email'    => 'graphql@test.com',
            'password' => $password,
        ]);

        for ($i = 0; $i < 10; ++$i) {
            \App\User::create([
                'name'     => $faker->name,
                'email'    => $faker->email,
                'password' => $password,
            ]);
        }
    }
}
```

```php
database/seeds/ArticlesTableSeeder.php
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
                    'title'   => $faker->sentence,
                    'content' => $faker->paragraphs(3, true),
                ]);
            }
        });
    }
}
```

```php
/database/seeds/DatabaseSeeder.php
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
```

Finally, let’s go ahead and run our database seeders to get some data into our database:

```php
$ php artisan db:seed
```

## Laravel Lighthouse and GraphQL Server

Now that we have our database and models set up, it’s time to start building out our GraphQL server. Currently, there are several solutions available for Laravel, but for this article, we’re going to use [Lighthouse](https://github.com/nuwave/lighthouse).

Lighthouse is a package I created a few years ago and has recently seen some amazing support from the growing community around it. It allows developers to quickly set up a GraphQL server using Laravel with little boilerplate while also being flexible enough to allow developers to customize it to fit the needs of just about any project.

[![Laravel Lighthouse and GraphQL Server illustration](https://assets.toptal.io/images?url=https://uploads.toptal.io/blog/image/129752/toptal-blog-image-1558175833847-73781ef1a1cab2d92f04ef4cb0709e85.png)](https://uploads.toptal.io/blog/image/129752/toptal-blog-image-1558175833847-73781ef1a1cab2d92f04ef4cb0709e85.png)

Let’s start by pulling the package into our project:

```php
$ composer require nuwave/lighthouse:"3.1.*"
```

Next, let’s publish Lighthouse’s configuration file:

```php
$ php artisan vendor:publish --provider="Nuwave\Lighthouse\LighthouseServiceProvider" --tag=config
```

**Note:** _You can also choose to publish Lighthouse’s default schema file by simply removing the `--tag=config` option. But for the purposes of this article, we are going to create our schema file from scratch._

If we take a look at the `config/lighthouse.php` file you’ll notice a setting used to register our schema file with Lighthouse:

```php
'schema' => [
    'register' => base_path('graphql/schema.graphql'),
],
```

So let’s go ahead and create our schema file and set up our user object type and query:

```php
$ mkdir graphql
$ touch ./graphql/schema.graphql

/graphql/schema.graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  user(id: ID! @eq): User @find
  users: [User!]! @all
}
```

You’ll notice that our schema looks similar to the one we defined earlier except we’ve added some identifiers called [schema directives](https://www.apollographql.com/docs/graphql-tools/schema-directives).

Let’s take a moment to break down our defined schema. Our first definition is an _object type_ called `User` which has a relation to our `App\User` eloquent model. We defined the `id`, `name` and `email` as fields that can be queried off our `User` models. Alternatively, this means that the `password`, `created_at` and `updated_at` columns are fields that cannot be queried for from our API.

Next we have our `Query` type which is an entry point into our API and can be used to query for data. Our first field is the `users` field which returns an array of `User` object types. The `@all` directive tells Lighthouse to run an Eloquent query, using our `User` model and get all of the results. This would be the same as running the following:

```php
$users = \App\User::all();
```

**Note:** _Lighthouse knows to look for a model in the `\App\User` namespace because of the `namespaces` option defined in its configuration file._

Our second defined field on our query type is the call `user`, which takes an `id` as an argument and returns a single `User` object type. We’ve also added two directives to help Lighthouse automatically build a query for us and return a single `User` model. The `@eq` directive tells Lighthouse to add a where on our `id` column, and the `@find` directive instructs Lighthouse to return a single result. To write this query using Laravel’s query builder, it would look like this:

```php
$user = \App\User::where('id', $args['id'])->first();
```

### Querying Our GraphQL API

Now that we have a bit of insight into how Lighthouse uses our schema to create queries, let’s run our server and start querying data. We’ll start by running our server:

```php
$ php artisan serve
Laravel development server started: <http://127.0.0.1:8000>
```

To query a GraphQL endpoint, you could run cURL command in the terminal or a standard client such as Postman. However, to get the full benefits of GraphQL (such as autocomplete, error highlighting, documentation, etc., we’ll use [GraphQL Playground](https://github.com/prisma/graphql-playground) (release downloads [here](https://github.com/prisma/graphql-playground/releases)).

When starting up Playground, click on the “URL Endpoint” tab, and type in [http://localhost:8000/graphql](http://localhost:8000/graphql) to point GraphQL Playground to our server. On the left side of the editor, we can query for our data, so let’s start by asking for all the users that we seeded the database with:

```php
{
  users {
    id
    email
    name
  }
}
```

When you hit the play button in the middle of the IDE (or click **Ctrl+Enter**), you’ll see the JSON output of our server on the right side, which will look something like this:

```php
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
```

**Note:** _Because we used Faker to seed our database, the data in the `email` and `name` fields will be different._

Now let’s try querying for a single user:

```php
{
  user(id: 1) {
    email
    name
  }
}
```

And we’ll get the following output for a single user:

```php
{
  "data": {
    "user": {
      "email": "graphql@test.com",
      "name": "Carolyn Powlowski"
    }
  }
}
```

Querying for data like this is nice to get started with, but it’s highly unlikely you’ll be in a project where you would ever want to query for _all_ of your data, so let’s try to add in some pagination. When looking through Lighthouse’s wide range of [built-in directives](https://lighthouse-php.com/5/api-reference/directives.html), we have a `@paginate` directive readily available to us, so let’s update our schema’s query object like so:

```php
type Query {
  user(id: ID! @eq): User @find
  users: [User!]! @paginate
}
```

If we reload GraphQL Playground (**Ctrl/Cmd + R**) and try our `users` query again, you’ll notice that we get an error message stating `Cannot query field "id" on type "UserPaginator"`, so what happened? Behind the scenes, Lighthouse manipulates our schema for us to get a paginated set of results and does so by changing the return type of our `users` field.

Let’s take a closer look by inspecting our schema in GraphQL Playground’s “Docs” tab. If you take a look at the `users` field, it is returning a `UserPaginator` which returns an array of users and a Lighthouse defined `PaginatorInfo` type:

```php
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
```

If you’re familiar with Laravel’s built-in pagination, the fields available in the `PaginatorInfo` type will probably look very familiar to you. So, to query for two users, get the total number of users in the system, and check we have more pages to cycle through, we would send the following query:

```php
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
```

Which will provide us with the following response:

```php
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
```

### Relationships

Generally, when developing an application, much of your data is related. In our case, a `User` can write many `Articles`, so let’s add that relationship to our User type and define our `Article` type:

```php
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
```

Here, we’re using another Lighthouse provided schema directive `@hasMany`, which tells Lighthouse our `User` model has a `\Illuminate\Database\Eloquent\Relations\HasMany` relationship with the `Article` model.

Now let’s query our newly defined relationship:

```php
{
  user(id:1) {
    articles {
      id
      title
    }
  }
}
```

This will provide us with the following response:

```php
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
```

Finally, let’s reverse our relationship and add our `author` relationship to our `Article` object type using Lighthouse’s `@belongsTo` schema directive as well as updating our `Query`:

```php
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
```

You’ll see that we added an optional `relation` argument to the `@belongsTo` directive. This tells Lighthouse to use the `Articles` model’s `user` relationship and assign it to the `author` field.

Now let’s query for a list of articles and grab their associated author:

```php
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
```

And we should get the following from our server:

```php
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
```

## GraphQL Mutation

Now that we can query our data, let’s create some mutations to create some new users and articles. We’ll start with our user model:

```php
type Mutation {
  createUser(
    name: String!
    email: String! @rules(apply: ["email", "unique:users"])
    password: String! @bcrypt @rules(apply: ["min:6"])
  ): User @create
}
```

Now let’s break this schema definition down. We’ve created a mutation called `createUser` which takes three arguments (`name`, `email`, and `password`). We’ve applied the `@rules` directive to both our `email` and `password` arguments. This may look a bit familiar because it’s similar to the [validation logic](https://laravel.com/docs/5.8/validation#quick-writing-the-validation-logic) Laravel provides for its controllers.

Next, we’ve attached the `@bcrypt` directive to our `password` field. This will encrypt the password before it is passed to the newly created model.

Finally, to help us create new models, Lighthouse provides a `@create` schema directive which will take the arguments we defined and create a new model. Performing the same logic in a Controller would look like the following:

```php
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
```

Now that we have our createUser mutation field set up, let’s go ahead and run it in GraphQL Playground with the following:

```php
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
```

We should get the following output:

```php
{
  "data": {
    "createUser": {
      "id": "12",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### GraphQL Authentication and Authorization

Since we need to add a `user_id` to our `Article` models, now would be a great time to go over authentication and authorization in GraphQL/Lighthouse.

[![image alt text](https://assets.toptal.io/images?url=https://uploads.toptal.io/blog/image/129745/toptal-blog-image-1557973309887-185e6faa8b16526a9ad524325794d3d7.png)](https://uploads.toptal.io/blog/image/129745/toptal-blog-image-1557973309887-185e6faa8b16526a9ad524325794d3d7.png)

To authenticate a user, we need to provide them with an `api_token`, so let’s create a mutation to handle that and we’ll add the `@field` directive to point Lighthouse to a custom resolver which will handle the logic. We set the resolver in the same pattern as [defining a controller](https://laravel.com/docs/5.8/controllers#basic-controllers) in Laravel using the `resolver` argument.

With the `@field` directive defined below, we’re telling Lighthouse when the `login` mutation is run, use the `createToken` method on our `App\GraphQL\Mutations\AuthMutator` class:

```php
type Mutation {
  # ...

  login(
    email: String! 
    password: String!
  ): String @field(resolver: "AuthMutator@resolve")
}

```

**Note:** _You do not need to include the entire namespace here. In the `lighthouse.php` config file you’ll see we have the namespace defined for our mutations set as `App\\GraphQL\\Mutations` already—however, you could use the full namespace if you prefer._

Let’s use Lighthouse’s generator to create the new mutator class:

```php
$ php artisan lighthouse:mutation AuthMutator
```

Next, let’s update our resolver function like so:

```php
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
     * @param  null  $rootValue Usually contains the result returned from the parent field. In this case, it is always `null`.
     * @param  mixed[]  $args The arguments that were passed into the field.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Arbitrary data that is shared between all fields of a single query.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Information about the query itself, such as the execution state, the field name, path to the field from the root, and more.
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
```

Now that we have our resolver set up, let’s test it out and try to obtain an API token using the following mutation in GraphQL Playground:

```php
mutation {
  login(email:"graphql@test.com", password:"secret")
}
```

We should get a token sent back to us like so:

```php
{
  "data": {
    "login": "VJCz1DCpmdvB9WatqvWbXBP2RN8geZQlrQatUnWIBJCdbAyTl3UsdOuio3VE"
  }
}
```

**Note:** _Be sure to copy the token returned from the login mutation so we can use it later._

Next, let’s add a query field which will return the authenticated user to make sure our logic works. We’ll add a field called `me` and use Lighthouse’s `@auth` directive to return the currently authenticated user. We’ll also set the `guard` argument equal to `api` since that is how we will authenticate the user.

```php
type Query {
  # ...
  me: User @auth(guard: "api")
}
```

Now let’s run the query. In GraphQL Playground, you can set your request headers by double clicking the “Http Headers” tab at the bottom. We add headers with a JSON object, so to add a bearer token to each request, you would add the following:

```php
{
  "Authorization": "Bearer VJCz1DCpmdvB9WatqvWbXBP2RN8geZQlrQatUnWIBJCdbAyTl3UsdOuio3VE"
}
```

**Note:** _Replace the bearer token with the token you received when running the **login** query._

Now let’s run the `me` query:

```php
{
  me {
    email
    articles {
      id
      title
    }
  }
}
```

We should get output that looks like this:

```php
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
```

### Middleware

Now that we know our authentication is working properly, let’s create our last mutation to create an article using the currently authenticated user. We’ll use the `@field` directive to point Lighthouse to our resolver and we’ll also include a `@middleware` directive to ensure that a user is logged in.

```php
type Mutation {
  # ...

  createArticle(title: String!, content: String!): Article 
    @field(resolver: "ArticleMutator@create")
    @middleware(checks: ["auth:api"])
}
```

First, let’s generate a mutation class:

```php
$ php artisan lighthouse:mutation ArticleMutator
```

Next, let’s update the mutator with the following logic:

```php
namespace App\GraphQL\Mutations;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ArticleMutator
{
    /**
     * Return a value for the field.
     *
     * @param  null  $rootValue
     * @param  mixed[]  $args
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context 
     * @return mixed
     */
    public function create($rootValue, array $args, GraphQLContext $context)
    {
        $article = new \App\Article($args);
        $context->user()->articles()->save($article);

        return $article;
    }
}
```

**Note:** _We renamed the default `resolve` function to `create`. You don’t need to create a new class for every resolver. Instead, you can group logic together if it makes more sense._

Finally, let’s run our new mutation and check the output. Be sure to keep the `Authorization` header from our previous query in the “HTTP Headers” tab:

```php
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
```

We should get the following output:

```php
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
```

## Wrapping Up

To recap, we’ve leveraged Lighthouse to create a GraphQL server for our Laravel project. We made use of some built in schema directives, created queries and mutations, and handled authorization and Authentication.

Lighthouse allows you to do much more (such as allowing you to create your own [custom schema directives](https://lighthouse-php.com/5/api-reference/directives.html)) but for the purposes of this article we stuck to the basics and we were able to get a GraphQL server up and running with fairly little boilerplate.

The next time you need to set up an API for a mobile or single-page application, be sure to consider [GraphQL](https://www.toptal.com/graphql) as a way to query your data!