https://www.toptal.com/php/choosing-between-symfony-and-laravel-frameworks

Today, when starting a new project, one of the key decisions is to pick the right framework. It’s become hard to imagine building a complex web application from scratch nowadays without one.

Many popular languages for web development have their “default” framework, such as Ruby on Rails for Ruby, or Django for Python. However, PHP has no such single default and has multiple popular options to choose from.

According to [Google trends](https://www.google.com/trends/explore?date=today%2012-m&q=%2Fm%2F09cjcl,%2Fm%2F0jwy148,Yii,%2Fm%2F0cdvjh) and [GitHub](https://github.com/trending/php?since=monthly), the most popular PHP frameworks are [Symfony with 13.7k stars](https://github.com/symfony/symfony) and [Laravel with 29k stars](https://github.com/laravel/laravel) (at the time of writing this article).

In this article, I am going to compare these two frameworks and show you how to implement simple, everyday features with each. This way, you can compare the code of real-life examples side by side.

This article presumes strong PHP skills and an understanding of the MVC architectural paradigm, but no previous experience with Symfony or Laravel is required.

## The Contenders

### Laravel

When speaking about Laravel, we are referring to Laravel version 4 and beyond. Laravel 4 was released in 2013 and represented a complete rewrite of the framework. The functionality of the framework was decoupled into separate components, which were managed with Composer, instead of everything being in one single huge code repository.

Laravel declares itself as a framework for rapid development with a simple and beautiful syntax which is easy to learn, read, and maintain. It is the most popular framework in 2016. According to [Google trends](https://www.google.com/trends/explore?date=today%2012-m&q=%2Fm%2F09cjcl,%2Fm%2F0jwy148,Yii,%2Fm%2F0cdvjh), it is three times more popular than other frameworks, and on [GitHub](https://github.com/search?o=desc&q=in%3Aname+symfony+OR+laravel+OR+Yii+OR+CodeIgniter+OR+zendframework+stars%3A%3E4000&ref=searchresults&s=stars&type=Repositories&utf8=%E2%9C%93), it has two times more stars than competitors.

### Symfony

Symfony 2 was released in 2011, but it must not be confused with Symfony 1, which was a totally different framework with different underlying principles. Fabien Potencier created Symfony 2, and the current version is 3.2, which is an incremental version of Symfony 2. Therefore, they are often called simply Symfony2/3.

Like Laravel 4, Symfony 2 is designed as a set of decoupled components. There are two benefits here: We can replace any component in a Symfony project, and we can take and use any Symfony component in a non-Symfony project. Symfony components can serve as great code examples and they are used in a lot of [open source projects](http://symfony.com/projects) such as Drupal, phpBB, and Codeception. In fact, Laravel itself uses no less than 14 Symfony components. Understanding Symfony thus gives you many benefits when working with other projects.

## Framework Installations

Both frameworks come with installers and wrappers available via the [PHP built-in web server](http://php.net/manual/en/features.commandline.webserver.php).

### Symfony Installation

Symfony installation is as simple as the following:

```bash
# Downloading Symfony installer
sudo curl -LsS https://symfony.com/installer -o /usr/local/bin/symfony
# Granting permissions to execute installer
sudo chmod a+x /usr/local/bin/symfony
# Creating new Symfony project
symfony new symfony_project
# Launching built-in server
cd symfony_project/ && php bin/console server:start
```

That’s it! Your Symfony installation is available on URL `http://localhost:8000`.

### Laravel Installation

The Laravel installation process is almost the same and as simple as that for Symfony; the only difference is that you install Laravel’s installer through Composer:

```bash
# Downloading Laravel installer using Composer
composer global require "laravel/installer"
# Creating new Laravel project
laravel new laravel_project
# Launching built-in server
cd laravel_project/ && php artisan serve
```

You can now visit `http://localhost:8000` and check your Laravel installation.

**Note:** Both Laravel and Symfony run off the same localhost port (8000) by default, so you can’t have these default instances running concurrently. Don’t forget to stop the Symfony server by running `php bin/console server:stop` before launching the Laravel server.

### About Framework Installation

These are examples of a basic installation. For more advanced usage examples, such as being able to configure projects with local domains or run multiple projects at once, both frameworks provide Vagrant boxes:

-   [Laravel Homestead](https://laravel.com/docs/5.4/homestead),
-   [Symfony Homestead](http://symfony.com/doc/current/setup/homestead.html).

## Basic Framework Configurations

### Symfony Basic Configuration

Symfony uses YAML as the syntax for specifying its configuration. The default configuration is located in the `app/config/config.yml` file, and looks like the following example:

```xml
imports:
    - { resource: parameters.yml }
    - { resource: security.yml }
    - { resource: services.yml }

framework:
    secret:          '%secret%'
    router:          { resource: '%kernel.root_dir%/config/routing.yml' }
    # ...

# Twig Configuration
twig:
    debug:            '%kernel.debug%'
    strict_variables: '%kernel.debug%'
    
# ...
```

To create an environment specific configuration, create the file `app/config/config_ENV.yml` containing the basic config parameters. Here’s an example of a `config_dev.yml` file for the development environment:

```xml
imports:
    - { resource: config.yml }
# ...
web_profiler:
    toolbar: true
# ...
```

This example turns on the `web_profiler` Symfony tool only for the development environment. This tool helps you to debug and profile your application right in the browser window.

In the configuration files, you can also notice `%secret%` constructions. They allow us to put environment-specific variables in the separate `parameters.yml` file. This file could be unique on every machine and is not stored under version control. For version control, we have a special `parameters.yml.dist` file that is the template for the `parameters.yml` file.

Here is an example of the `parameters.yml` file:

```yaml
parameters:
    database_host: 127.0.0.1
    database_port: null
    database_name: symfony
    database_user: root
    database_password: null
    secret: f6b16aea89dc8e4bec811dea7c22d9f0e55593af
```

### Laravel Basic Configuration

Laravel configuration looks very different from that of Symfony. The only one thing they have in common is that they both use files that are not stored under version control (`.env` in the Laravel case) and a template for generating this file (`.env.example`). This file has a list of keys and values, like the following example:

```ini
APP_ENV=local
APP_KEY=base64:Qm8mIaur5AygPDoOrU+IKecMLWgmcfOjKJItb7Im3Jk=
APP_DEBUG=true
APP_LOG_LEVEL=debug
APP_URL=http://localhost
```

Like the Symfony YAML file, this one for Laravel is also human readable and looks clean. You can additionally create `.env.testing` file that will be used when running PHPUnit tests.

The application configuration is stored in `.php` files in the `config` directory. Basic configuration is stored in the `app.php` file and component-specific configuration is stored in `<component>.php` files (e.g., `cache.php` or `mail.php`). Here’s an example of a `config/app.php` file:

```php
<?php

return [
    'name'     => 'Laravel',
    'env'      => env('APP_ENV', 'production'),
    'debug'    => env('APP_DEBUG', false),
    'url'      => env('APP_URL', 'http://localhost'),
    'timezone' => 'UTC',
    'locale'   => 'en',
    // ...
];
```

### Framework Configuration: Symfony vs. Laravel

Symfony’s application configuration mechanisms allow you to create different files for different environments. Additionally, it prevents you from injecting complex PHP logic in the YAML configuration.

However, you may feel more comfortable with the default PHP configuration syntax Laravel is using and you don’t have to learn YAML syntax.

## Routing and Controller

In general, a back-end web application has one primary responsibility: to read each request and create a response depending on the content of the request. The controller is a class responsible for transforming the request to the response by calling application methods, while the router is a mechanism that helps you to detect which controller class and method you should execute for a particular request.

Let’s create a controller that will show a blog post page requested from the `/posts/{id}` route.

### Routing and Controller in Laravel

_Controller_

```php
<?php

namespace App\Http\Controllers;

use App\Post;

class BlogController extends Controller
{
    /**
     * Show the blog post
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return view('post', ['post' => Post::findOrFail($id)]);
    }
}
```

_Router_

```php
Route::get('/posts/{id}', 'BlogController@show');
```

We’ve defined the route for `GET` requests. All requests with the URI matching the `/posts/{id}` will execute the `BlogController` controller’s `show` the method, and will pass the parameter `id` to that method. In the controller, we are trying to find the object of model `POST` with the passed `id`, and call Laravel helper `view()` to render the page.

### Routing and Controller in Symfony

In Symfony, `exampleController` is a little bit bigger:

```php
<?php

namespace BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PostController extends Controller
{
    /**
     * @Route("/posts/{id}")
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($id)
    {
        $repository = $this->getDoctrine()->getRepository('BlogBundle:Post');
        $post = $repository->find($id);
        if ($post === null) {
            throw $this->createNotFoundException();
        }
        return $this->render('BlogBundle:Post:show.html.twig', ['post'=>$post]);
    }
}
```

You can see we’ve already included `@Route("/posts/{id}”)` in the annotation, so we just need to include the controller in the `routing.yml` configuration file:

```xml
blog:
    resource: "@BlogBundle/Controller/"
    type:     annotation
    prefix:   /
```

The step by step logic is the same as in the Laravel case.

### Routing and Controller: Symfony vs. Laravel

At this stage, you might think Laravel is much nicer than Symfony. This is true, in the beginning. It looks way better and easier to start. However, in the real-life applications, you shouldn’t call Doctrine from the controller. Instead, you should call a service that will try to find the post or throw _HTTP 404 Exception_.

## Templates

Laravel ships with a template engine called [Blade](https://laravel.com/docs/5.4/blade) and Symfony ships with [Twig](http://twig.sensiolabs.org/). Both template engines implement two main features:

1.  Template inheritance
2.  Blocks or sections

Both features allow you to define a basic template with overridable sections and child templates that fill values of those sections.

Let’s consider the example of a blog post page again.

### Laravel Blade Template Engine

```php
// base.blade.php
<html>
<head>
    <style></style>
    <title>@section('page-title')
            Welcome to blog!
        @show
    </title>
</head>
<body>
<div class="container">
    <h1>@yield('title')</h1>
    <div class="row">
        @yield('content')
    </div>
</div>
</body>
</html>

// post.blade.php
@extends('base')

@section('page-title')Post {{ $post->title }} - read this and more in our blog.@endsection

@section('title'){{ $post->title }}@endsection

@section('content')
    {{ $post->content }}
@endsection
```

Now you can tell Laravel in your Controller to render template `post.blade.php`. Do you remember our `view(‘post’, …)` call in the previous Controller example? You don’t need to know in your code that it is inherited from some other template. It is all defined only in your templates, on the view level.

### Symfony Twig Template Engine

```php
// base.html.twig
<html>
<head>
    <style></style>
    <title>{% block page_title %}
        Welcome to blog!
        {% endblock %}
    </title>
</head>
<body>
<div class="container">
    <h1>{% block title %}{% endblock %}</h1>
    <div class="row">
        {% block content %}{% endblock %}
    </div>
</div>
</body>
</html>

// show.html.twig
{% extends '@Blog/base.html.twig' %}

{% block page_title %}Post {{ post.title }} - read this and more in our blog.{% endblock %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
    {{ post.content }}
{% endblock %}
```

### Templates: Symfony vs. Laravel

Structurally, Blade and Twig templates are quite similar. Both generate templates into PHP code and work fast, and both implement control structures, such as `if` statements and loops. The most important feature both engines have is that they escape the output by default, which helps prevents XSS attacks.

Aside from syntax, the main difference is that Blade allows you to inject PHP code directly into your templates and Twig does not. Instead, Twig allows you to use filters.

For example, if you want to capitalize a string, in Blade you would specify the following:

```php
{{ ucfirst('welcome friend') }}
```

In Twig, on the other hand, you would do the following:

```php
{{ 'welcome friend'|capitalize }}
```

In Blade, it is easier to extend some functionality, but Twig does not allow any direct PHP code in templates.

## Dependency Injection

Applications have a lot of different services and components, with various interdependencies. You need to store all the information about the created objects and their dependencies somehow.

Here comes our next component - [Service Container](http://symfony.com/doc/current/service_container.html). It is a PHP object that creates requested services and stores information about the created objects and their dependencies.

Let’s consider the following example: You are creating a class `PostService` to implement a method that is responsible for creating a new blog post. This class depends on two other services: `PostRepository`, which is responsible for storing information in the database, and `SubscriberNotifier`, which is responsible for notifying subscribed users about the new post. To get it to work, you need to pass these two services as the constructor arguments of `PostService` or, in other words, you need to inject these dependencies.

### Symfony Dependency Injection Example

First, let’s define our sample services:

```php
<?php
// src/BlogBundle/Repository/PostRepository.php
namespace BlogBundle\Repository;

use BlogBundle\Entity\Post;
use Doctrine\ORM\EntityRepository;

class PostRepository extends EntityRepository
{
    public function persist(Post $post)
    {
        // Perform save to db
    }
}
```

```php
<?php
// src/BlogBundle/Service/SubscriberNotifier.php
namespace BlogBundle\Service;

use BlogBundle\Entity\Post;

class SubscriberNotifier
{
    public function notifyCreate(Post $post)
    {
        // Notify subscribers
    }
}
```

```php
<?php
// src/BlogBundle/Service/PostService
namespace BlogBundle\Service;

use BlogBundle\Entity\Post;
use BlogBundle\Repository\PostRepository;

class PostService
{
    /** @var PostRepository */
    private $repository;
    /** @var SubscriberNotifier */
    private $notifier;

    function __construct(PostRepository $repository, SubscriberNotifier $notifier)
    {
        $this->repository = $repository;
        $this->notifier = $notifier;
    }

    public function create(Post $post)
    {
        $this->repository->persist($post);
        $this->notifier->notifyCreate($post);
    }
}
```

Next is the dependency injection configuration:

```xml
# src/BlogBundle/Resources/config/services.yml
services:
    # Our main service
    blog.post_service:
      class: BlogBundle\Service\PostService
      arguments: ['@blog.post_repository', '@blog.subscriber_notifier']

    # SubscriberNotifier service. It could also have its own dependencies, for example, mailer class.
    blog.subscriber_notifier:
      class: BlogBundle\Service\SubscriberNotifier

    # Repository. Don't dive deep into it's configuration, it is not a subject now
    blog.post_repository:
      class: BlogBundle\Repository\PostRepository
      factory: 'doctrine.orm.default_entity_manager:getRepository'
      arguments:
        - BlogBundle\Entity\Post
```

Now you can request your post service anywhere in the code from your Service Container object. For example, in the controller it could be something like this:

```php
// Controller file. $post variable defined below
$this->get('blog.post_service')->create($post);
```

Service Container is a great component, and it helps to build your application following [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) design principles.

**Related:** [True Dependency Injection with Symfony Components](https://www.toptal.com/symfony/true-dependency-injection-symfony-components)

### Laravel Dependency Injection Example

It is much easier to manage dependencies in Laravel. Let’s consider the same example:

```php
<?php
// app/Repository/PostRepository.php
namespace App\Repository;

use App\Post;

class PostRepository
{
    public function persist(Post $post)
    {
        // Perform save to db
    }
}
```

```php
<?php
// app/Service/SubscriberNotifier.php
namespace App\Service;

use App\Post;

class SubscriberNotifier
{
    public function notifyCreate(Post $post)
    {
        // Notify subscribers
    }
}
```

```php
<?php
// app/Service/PostService.php
namespace App\Service;

use App\Post;
use App\Repository\PostRepository;

class PostService
{
    /** @var PostRepository */
    private $repository;
    /** @var SubscriberNotifier */
    private $notifier;

    public function __construct(PostRepository $repository, SubscriberNotifier $notifier)
    {
        $this->repository = $repository;
        $this->notifier = $notifier;
    }

    public function create(Post $post)
    {
        $this->repository->persist($post);
        $this->notifier->notifyCreate($post);
    }
}
```

Here comes the beauty of Laravel - _you do not need to create dependency configurations_. Laravel automatically scans the dependencies for `PostService` in its constructor arguments types and automatically resolves them.

You can also use injection in your controller method to use `PostService` by “type-hinting” it in method arguments:

```php
<?php

namespace App\Http\Controllers;

use App\Post;
use App\Service\PostService;

class BlogController extends Controller
{
    public function create(PostService $service)
    {
        $post = new Post(['title' => 'Title', 'content' => 'Content']);

        $service->create($post);
        return redirect('/posts/'.$post->id);
    }
}
```

### Dependency Injection: Symfony vs. Laravel

Laravel’s autodetection works great. Symfony has a similar capability called “[autowire](http://symfony.com/doc/current/components/dependency_injection/autowiring.html)” that is turned off by default and could be turned on by adding `autowire: true` to your dependency configuration, but it requires some configuration. The Laravel way is simpler.

## Object Relational Mapping (ORM)

To work with databases, both frameworks come with Object-Relational Mapping (ORM) features. ORM maps records from the database to objects in the code. To do this, you must create models for each record type (or each table) in your database.

Symfony uses a third-party project [Doctrine](http://www.doctrine-project.org/) to interact with the database, while Laravel uses its own library [Eloquent](https://laravel.com/docs/master/eloquent).

The Eloquent ORM implements the [ActiveRecord pattern](https://en.wikipedia.org/wiki/Active_record_pattern) to work with the database. In this pattern, each model is aware of the connection to the database and can interact with it. For example, it can save data to the database, update, or delete a record.

Doctrine implements the [Data Mapper pattern](https://en.wikipedia.org/wiki/Data_mapper_pattern), where models know nothing about the database; they are only aware of the data itself. A special separate layer, `EntityManager`, stores all the information about the interaction between models and databases, and it handles all the operations.

Let’s take an example to understand the difference. Let’s say your model has a primary `id` key, title, content, and author. The _Posts_ table stores only the author `id`, so you need to create a relation to the _Users_ table.

### Doctrine

Let’s begin by defining the models:

```php
<?php
// src/BlogBundle/Entity/User.php
namespace BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity
 */
class User
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;
}
```

```php
<?php
// src/BlogBundle/Entity/Post.php
namespace BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Post
 *
 * @ORM\Table(name="post")
 * @ORM\Entity(repositoryClass="BlogBundle\Repository\PostRepository")
 */
class Post
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    protected $title;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    protected $content;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="BlogBundle\Entity\User")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    protected $author;
```

Here, we created model mapping information and can now use a helper to generate the method stubs:

```bash
php bin/console doctrine:generate:entities BlogBundle
```

Next, we define post repository methods:

```php
<?php
// src/BlobBundle/Repository/PostRepository.php
namespace BlogBundle\Repository;

use BlogBundle\Entity\Post;
use Doctrine\ORM\EntityRepository;

class PostRepository extends EntityRepository
{
    /**
     * Store post to database
     *
     * @param Post $post
     */
    public function persist(Post $post)
    {
        $this->getEntityManager()->persist($post);
        $this->getEntityManager()->flush();
    }

    /**
     * Search posts with given author's name
     *
     * @param string $name
     * @return array
     */
    public function findByAuthorName($name)
    {
        return $this->createQueryBuilder('posts')
            ->select('posts')
            ->join('posts.author', 'author')
            ->where('author.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getResult();
    }
}
```

Now you can call these methods from the service or, for example, from `PostController`:

```php
// To search for posts
$posts = $this->getDoctrine()->getRepository('BlogBundle:Post')->findByAuthorName('Karim');
// To save new post in database
$this->getDoctrine()->getRepository('BlogBundle:Post')->persist($post);
```

### Eloquent

The _User_ model ships with Laravel and it is defined by default, so you only need to define one model for the _Post_.

```php
<?php
// app/Post.php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public function author()
    {
        return $this->belongsTo('App\User', 'author_id');
    }
}
```

That’s all for models. In Eloquent, you don’t have to define model properties, as it builds them dynamically based on the database table structure. To store a new post `$post` into the database, you need to make this call (from the controller, for example):

```php
$post->save();
```

To find all posts by an author with a given name, the best approach would be to find a user with its name and request all users’ posts:

```php
$posts = Post::whereHas('author', function ($q) {
    $q->where('name', 'Karim');
})->get();
```

### ORM: Symfony vs. Laravel

With regard to ORM, Eloquent looks much more friendly for [PHP developers](https://www.toptal.com/services/php-development) and easier to learn than Doctrine.

## Event Dispatcher vs. Middleware

[![Symfony vs. Laravel Lifecycle](https://assets.toptal.io/images?url=https://uploads.toptal.io/blog/image/127685/toptal-blog-image-1543962713669-3c0bcb601d13a29f06c5c109d6da51d1.png)](https://uploads.toptal.io/blog/image/127685/toptal-blog-image-1543962713669-3c0bcb601d13a29f06c5c109d6da51d1.png)

One of the most important things to understand about a framework is its lifecycle.

### Symfony and Event Dispatcher

To convert a request into a response, Symfony uses EventDispatcher. It consequentially fires different lifecycle events and special event listeners to handle these events. In the beginning, it dispatches the `kernel.request` event that includes request information. The main default listener of this event is `RouterListener`, which invokes the router component to find a suitable route rule for the current request. After this, other events are executed step-by-step. Typical event listeners are a Security check, CSRF token verification, and a logging process. If you want to add some functionality in the request lifecycle, you need to create a custom `EventListener` and subscribe it to the necessary event.

### Laravel and Middleware

Laravel uses a different solution: middleware. I like comparing middleware to an onion: Your application has certain layers and a request passes through these layers on the way to the controller and back. So, if you want to extend your application logic and add some functionality in the request lifecycle, you need to add an additional layer to your middleware list, and Laravel will execute it.

## REST API

Let’s try to create a basic CRUD example to manage a blog post:

-   Create - `POST /posts/`
-   Read - `GET /posts/{id}`
-   Update - `PATCH /posts/{id}`
-   Delete - `DELETE /posts/{id}`

### REST API in Symfony

Symfony doesn’t have an easy out-of-the-box solution for fast REST API creation, but it has great third-party bundles `FOSRestBundle` and `JMSSerializerBundle`.

Let’s consider the minimal working example with `FOSRestBundle` and `JMSSerializerBundle`. After you installed them and turned them on in `AppKernel`, you can set in the bundle configuration that you will use JSON format and that this doesn’t have to be included in the URL requests:

```xml
#app/config/config.yml
fos_rest:
    routing_loader:
        default_format: json
        include_format: false
```

In the routing configuration, you should specify that this controller will implement a REST resource:

```xml
#app/config/routing.yml
blog:
    resource: BlogBundle\Controller\PostController
    type:     rest
```

You implemented a persist method in the repository in the previous example; now you need to add a delete method:

```php
// src/BlogBundle/Repository/PostRepository.php
public function delete(Post $post)
{
    $this->getEntityManager()->remove($post);
    $this->getEntityManager()->flush();
}
```

Next, you need to create a [form class](http://symfony.com/doc/current/forms.html#form-creating-form-classes) to accept input requests and map them to the model. You can do it by using a CLI helper:

```bash
php bin/console doctrine:generate:form BlogBundle:Post
```

You will receive a generated form type with the following code:

```php
<?php
// src/BlogBundle/Form/PostType.php
namespace BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title')->add('content');
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'BlogBundle\Entity\Post',
            'csrf_protection' => false
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'post';
    }
}
```

Now let’s implement our controller.

**Note:** the code I am going to show you is not perfect. It violates some design principles but could be easily refactored. The main purpose is to show you how to implement each method, step by step.

```php
<?php
// src/BlogBundle/Controller/PostController.php
namespace BlogBundle\Controller;

use BlogBundle\Entity\Post;
use BlogBundle\Form\PostType;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class PostController extends FOSRestController
{
    /**
     * @param $id
     * @return Response
     */
    public function getPostAction($id)
    {
        $view = new View();
        $post = $this->getDoctrine()->getRepository('BlogBundle:Post')->find($id);
        if ($post === null) {
            $view->setStatusCode(Response::HTTP_NOT_FOUND);
        } else {
            $view->setData(['post' => $post]);
        }

        return $this->handleView($view);
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function postPostAction(Request $request)
    {
        $view = new View(null, Response::HTTP_BAD_REQUEST);
        $post = new Post;
        $form = $this->createForm(PostType::class, $post, ['method' => $request->getMethod()]);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $this->getDoctrine()->getRepository('BlogBundle:Post')->persist($post);
            $view->setStatusCode(Response::HTTP_CREATED);
            $postUrl = $this->generateUrl('get_post', ['id' => $post->getId()], UrlGeneratorInterface::ABSOLUTE_URL);
            $view->setHeader('Location', $postUrl);
        } else {
            $view->setData($form->getErrors());
        }

        return $this->handleView($view);
    }

    /**
     * @param $id
     * @param Request $request
     * @return Response
     */
    public function patchPostAction($id, Request $request)
    {
        $view = new View(null, Response::HTTP_BAD_REQUEST);
        $post = $this->getDoctrine()->getRepository('BlogBundle:Post')->find($id);
        if ($post === null) {
            $view->setStatusCode(Response::HTTP_NOT_FOUND);
        } else {
            $form = $this->createForm(PostType::class, $post, ['method' => $request->getMethod()]);
            $form->handleRequest($request);
            if ($form->isValid()) {
                $this->getDoctrine()->getRepository('BlogBundle:Post')->persist($post);
                $view->setStatusCode(Response::HTTP_NO_CONTENT);
                $postUrl = $this->generateUrl('get_post', ['id' => $post->getId()], UrlGeneratorInterface::ABSOLUTE_URL);
                $view->setHeader('Location', $postUrl);
            } else {
                $view->setData($form->getErrors());
            }
        }

        return $this->handleView($view);
    }

    /**
     * @param $id
     * @return Response
     */
    public function deletePostAction($id)
    {
        $view = new View(null, Response::HTTP_NOT_FOUND);
        $post = $this->getDoctrine()->getRepository('BlogBundle:Post')->find($id);
        if ($post !== null) {
            $this->getDoctrine()->getRepository('BlogBundle:Post')->delete($post);
            $view->setStatusCode(Response::HTTP_NO_CONTENT);
        }

        return $this->handleView($view);
    }
}
```

With `FOSRestBundle`, you don’t need to declare a route for each method; just follow the convention with controller method names, and `JMSSerializerBundle` will automatically convert your models to JSON.

### REST API in Laravel

First, you need to define routes. You can do this in the `API` section of the route rules to turn off some default middleware components and turn on others. The `API` section is located in the `routes/api.php` file.

```php
<?php
// routes/api.php
Route::resource('/posts', 'BlogController');
```

In the model, you should define the `$fillable` property to pass variables in the model’s create and update methods:

```php
<?php
// app/Post.php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'content'];
    // …
```

Now let’s define the controller:

```php
<?php
// app/Http/Controllers/BlogController.php
namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BlogController extends Controller
{
    public function show(Post $post)
    {
        return $post;
    }

    public function store(Request $request)
    {
        $post = Post::create($request->get('post'));
        return response(null, Response::HTTP_CREATED, ['Location'=>'/posts/'.$post->id]);
    }

    public function update(Post $post, Request $request)
    {
        $post->update($request->get('post'));
        return response(null, Response::HTTP_NO_CONTENT, ['Location'=>'/posts/'.$post->id]);
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response(null, Response::HTTP_NO_CONTENT);
    }
}
```

In Symfony, you are using `FosRestBundle`, which wrapped errors in JSON. In Laravel, you need to do it yourself. You need to update the render method in the Exception handler to return JSON errors for expecting JSON requests:

```php
<?php
// app/Exceptions/Handler.php
namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Exception $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($request->expectsJson()) {
            $status = 400;
            if ($this->isHttpException($exception)) {
                $status = $exception->getStatusCode();
            } elseif ($exception instanceof ModelNotFoundException) {
                $status = 404;
            }

            $response = ['message' => $exception->getMessage(), 'code' => $exception->getCode()];

            return response()->json($response, $status);
        }

        return parent::render($request, $exception);
    }
    // ...
}
```

### REST API: Symfony vs. Laravel

As you can see, for a typical REST API, Laravel is much simpler than Symfony.

## Picking the Winner: Symfony or Laravel?

There’s no clear winner between Laravel and Symfony, as everything depends on your final goal.

**Laravel is a better choice if:**

-   This is your first experience with the framework, as it’s easy to learn and has a simpler syntax and better learning materials.
-   You’re building a startup product and checking your hypothesis, as it’s good for rapid application development and [Laravel developers](https://www.toptal.com/laravel) are easy to find.

**Symfony is the best option if:**

-   You’re building a complex enterprise application, as it is very scalable, maintainable, and well structured.
-   You’re building a migration of a big long-term project, as Symfony has predictable release plans for the next six years, so it’s less likely that there will be any surprises.
- 