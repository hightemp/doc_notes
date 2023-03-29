https://www.tutorialspoint.com/laravel/laravel_installation.htm

For managing dependencies, Laravel uses **composer**. Make sure you have a Composer installed on your system before you install Laravel. In this chapter, you will see the installation process of Laravel.

You will have to follow the steps given below for installing Laravel onto your system −

**Step 1** − Visit the following URL and download composer to install it on your system.

[https://getcomposer.org/download/](https://getcomposer.org/download/)

**Step 2** − After the Composer is installed, check the installation by typing the Composer command in the command prompt as shown in the following screenshot.

![Composer](https://www.tutorialspoint.com/laravel/images/composer.jpg)

**Step 3** − Create a new directory anywhere in your system for your new Laravel project. After that, move to path where you have created the new directory and type the following command there to install Laravel.

composer create-project laravel/laravel –-prefer-dist

Now, we will focus on installation of version 5.7. In Laravel version 5.7, you can install the complete framework by typing the following command −

composer create-project laravel/laravel test dev-develop

The output of the command is as shown below −

![Composer Create Project](https://www.tutorialspoint.com/laravel/images/composer_create_project%20.jpg)

The Laravel framework can be directly installed with develop branch which includes the latest framework.

**Step 4** − The above command will install Laravel in the current directory. Start the Laravel service by executing the following command.

php artisan serve

**Step 5** − After executing the above command, you will see a screen as shown below −

![Administrator](https://www.tutorialspoint.com/laravel/images/administrator.jpg)

**Step 6** − Copy the URL underlined in gray in the above screenshot and open that URL in the browser. If you see the following screen, it implies Laravel has been installed successfully.

![Laravel Installed](https://www.tutorialspoint.com/laravel/images/laravel_installed.jpg)