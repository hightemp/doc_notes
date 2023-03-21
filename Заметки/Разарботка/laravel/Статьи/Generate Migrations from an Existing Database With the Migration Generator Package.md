https://laravel-news.com/migration-generator-for-laravel

# Laravel Migration Generator

Migration Generator for Laravel is a package by [Bennett Treptow](https://github.com/bennett-treptow) to generate migrations from existing database structures:

> A primary use case for this package would be a project that has many migrations that alter tables using ->change() from doctrine/dbal that SQLite doesn't support and need a way to get table structures updated for SQLite to use in tests. Another use case would be taking a project with a database and no migrations and turning that database into base migrations.

This package could be helpful if you are porting an existing application into Laravel and want to re-create the database migrations for the application to help with development and testing.

**Related** Creating a [Password Generator](https://laravel-news.com/creating-a-password-generator) with Laravel.

To visualize how this process works, the readme has [example usage](https://github.com/bennett-treptow/laravel-migration-generator?ref=laravelnews#example-usage) which defines the following `users` table:

```sql
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'America/New_York',
  `location_id` int(10) unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_username_index` (`username`),
  KEY `users_first_name_index` (`first_name`),
  KEY `users_last_name_index` (`last_name`),
  KEY `users_email_index` (`email`),
  KEY `fk_users_location_id_index` (`location_id`)
  CONSTRAINT `users_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

Using this package, you can run the following command to generate a blueprint class based on the table definition:

```
php artisan generate:migrations
```

And the derived blueprint from the `users` table would look as follows according to the example:

```php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
 
class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username', 128)->nullable()->index();
            $table->string('email', 255)->index();
            $table->string('password', 255);
            $table->string('first_name', 45)->nullable()->index();
            $table->string('last_name', 45)->index();
            $table->string('timezone', 45)->default('America/New_York');
            $table->unsignedInteger('location_id');
            $table->softDeletes();
            $table->string('remember_token', 255)->nullable();
            $table->timestamps();
            $table->foreign('location_id', 'users_location_id_foreign')->references('id')->on('locations')->onUpdate('cascade')->onDelete('cascade');
        });
    }
 
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

The package also comes with various table and view migration stubs and configuration settings. For example, a configuration defining the filename patterns used to generate table schema:

```php
return [
    'table_naming_scheme' => '[Timestamp]_create_[TableName]_table.php',
    // ...
];
```

At the time of writing the package supports MySQL, but could also support Postgres, SQLite, and SQL Server according the the readme.

You can learn more about this package, get full installation instructions, and view the [source code](https://github.com/bennett-treptow/laravel-migration-generator?ref=laravelnews) on GitHub.