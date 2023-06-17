::: v-pre
https://www.educba.com/laravel-components/

## Introduction to Laravel Components

Laravel Components are used to build reliable and extensible systems. They let us build large applications which are made up of reusable, independent and decoupled components. Laravel provides us so many tools to help building reliable web applications and cutting down the development time to significant levels. Laravel is magnificently composed of components that are reusable and are efficiently defined and compiled together to bring up the whole system.

### What are the Components of Laravel?

Almost all the modern systems are composed of self-contained, independent, reusable small entities. Each of these entities has a specific functionality provided to the system as a whole. The Laravel components are a small entity with an interface that is well defined. These serve as the building block for a large software system. All the related data is encapsulated in the reusable unit.

Let us make it more clear by taking an example. Suppose you wish to create some kind of button that will be used at various places within your application. So what you can do here is build the button as a component and then it can be called whenever you want a button in the application.

#### 1. Building a Component

In order to understand the concept of building components more clearly, let’s learn it in small chunks. So we have divided the whole process into some easily understandable small steps which are as follows:

**Step 1:** Firstly, we will need to create our new directory. This new directory will be residing in the Resources directory. A structure like the one written below will be there on your side:

**resources/views/layouts/components**

**Step 2:** Now you have to create a new file that you have to save under the ‘components’ directory which was created in the previous step. We will call it ‘navbar.blade.php’.

**Step 3:** Now write the following code for Navbar to navbar.blade.php file. Any IDE can be used(like sublime).

##### Example #1

**Code:**

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
<a class="navbar-brand" href="#">Navbar</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
<div class="navbar-nav">
<a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
<a class="nav-item nav-link" href="#">Features</a>
<a class="nav-item nav-link" href="#">Pricing</a>
<a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
</div>
</div>
</nav>
```

This code will yield a navigation bar as shown below:

**Output:**

![Laravel Components-1.1](https://cdn.educba.com/academy/wp-content/uploads/2020/03/Laravel-Components-1.1.png.webp "Laravel Components-1.1")

##### Example #2

Let’s look into another navbar example as follows:

**Code:**

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
<a class="navbar-brand" href="#">Navbar</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNavDropdown">
<ul class="navbar-nav">
<li class="nav-item active">
<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
</li>
<li class="nav-item">
<a class="nav-link" href="#">Features</a>
</li>
<li class="nav-item">
<a class="nav-link" href="#">Pricing</a>
</li>
<li class="nav-item dropdown">
<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
Dropdown link
</a>
<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
<a class="dropdown-item" href="#">Action</a>
<a class="dropdown-item" href="#">Another action</a>
<a class="dropdown-item" href="#">Something else here</a>
</div>
</li>
</ul>
</div>
</nav>
```

This code will yield a navigation bar as shown below:

**Output:**

![Laravel Components-1.2](https://cdn.educba.com/academy/wp-content/uploads/2020/03/Laravel-Components-1.2.png.webp "Laravel Components-1.2")

#### 2. Using a Component

So far we have created our directory ‘components’, created a new file ‘navbar’ and written code into navbar.blade.php. Finally, we are going to use this component. Inside directory ‘views’, let’s suppose a page of your application like index.blade.php, use the blade directive as shown below:

```php
@component('layouts.components.navbar')
@endcomponent
```

You have used your very first component. But this is a hardcoded navbar. And it is not a good idea to use this while building a modern dynamic application project. Let’s do a bit of modification in navbar tags in file navbar.blade.php.

Now we will add brandName variable into the navbar code, keep an eye on the modifications done in the previous code we wrote for the navbar. We are just showing the part of the coding where modifications have been performed.

```html
<nav class="navbar navbar-light bg-light">
<a class="navbar-brand" href="#"> {{$brandName}} </a>
</nav>
```

If you wish to pass values to your component, you can do so by injecting a variable with the help of blade-directive. Let’s see the coding showing the use of directive ‘@slot’ as follows:

```php
@component('layouts.components.navbar')
@slot('brandName')
value and it could be anything
@endslot
@endcomponent
```

##### Example

```php
@component('alert')
@slot('title')
Forbidden
@endslot
You are not allowed to access this resource!
@endcomponent
```

Here the content which is not in directive @slot will be passed through variable $slot to the component.

**A better way to use components is described as follows:**

What if we can call our component just by using directive @navbar? Wouldn’t it be much easier? Yes, it will be a lot more readable and easier at the same time. Let’s roll. For this to be implemented, we just have to define that @navbar means the same as navbar.blade.php, the file which you just created. Once we have successfully done this, Laravel will automatically take navbar.blade.php when we will call @navbar.

For this to work, we have to add the below-mentioned code to ‘boot()’ function in file

**app/providers/appServiceProvider.php.**

```php
Blade::component('layouts.components.navbar','navbar');
```

Here in the code, the first parameter is the location of the component and the second parameter is the new name you want to give to it (navbar in our case). You might have heard about this process before which is known as aliasing. Now you just have to call @navbar in order to call your component.

You can exclude the parameters of the component if there are no added slots.

```php
@alert
You are not allowed to access this resource!
@endalert
```

**Note:** You have to either add the following line of code before your class name or import Blade Facade in appServicesProvider.php use Illuminate\Support\Facades\Blade.

Your component has been renamed now and you are free to call your component from any point in your application project using just @navbar.

Let’s see how you will call your component as below:

```php
@navbar(['brandName'=>'Insert any value'])
@endnavbar
```

You have now successfully called the component navbar and passed data to it.

**Note:** Here we have passed data in associative array like [‘Name’]=>[‘value’] pairs. Remember that name/key pairs should be written as they are in the component. If your component contains more variables, they can be added to the array as shown ahead:  
[‘variable1’=>’value1’, ‘variable2’=>’value2’,..]

Now, this component can be reused whenever and wherever you want in your application development project.
:::
