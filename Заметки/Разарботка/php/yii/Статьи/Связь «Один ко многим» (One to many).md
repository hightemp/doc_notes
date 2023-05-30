https://know-online.com/post/yii-2-one-to-many

Создание таблиц

Сначала надо создать таблицы post и comment.

```php
yii migrate/create create_posts_table --fields="title:string:notNull,content:text"
yii migrate/create create_comment_table --fields="comment:text:notNull,post_id:integer:foreignKey(post)"
yii migrate
```

Для поля «post_id» будет создан внешний ключ (foreign key). Он позволяет при удалении поста автоматически удалять все его комментарии на стороне MySQL.

Также надо создать модели Post и Comment.

```php
# models/Post.php
namespace app\models;
use Yii;

class Post extends \yii\db\ActiveRecord
{
}
```

```php
# models/Comment.php
namespace app\models;
use Yii;

class Comment extends \yii\db\ActiveRecord
{
}
```

Вывод комментариев

В файле **models/Post.php** надо добавить следующий код:

```php
# models/Post.php

class Post extends \yii\db\ActiveRecord
{
    public function getComments()
    {
        return $this->hasMany(Comment::classname(), ['post_id' => 'id']);
    }
}
```

Теперь можно выбирать комментарии:

```php
# controllers/PostController.php

class PostController extends Controller
{
    public function actionView()
    {
        // выборка комментариев поста
        $post = Post::findOne(1);
        $comments = $post->comments;
    }
}
```

Когда идёт обращение к свойству `comments`, происходит дополнительный SQL-запрос для выборка комментариев. Такое поведение называется «Lazy load», т.е. данные загружается тогда, когда они нужны.

Но при выборке нескольких страниц, для каждой страницы будет происходить дополнительный запрос в базу данных. Чтобы такого не происходило, рекомендуется использовать метод `with()`, который сразу выберет нужные комментарии при выборки страниц.

```php
# controllers/PostController.php

class PostController extends Controller
{
    public function actionIndex()
    {
        $posts = Post::find()->with('comments')->all();
        foreach ($posts as $post) {
            // здесь SQL-запросов не будет, т.к. данные загрузились при выборке постов
            $post->comments;
        }
    }
}
```

Параметры

В модели можно указать параметры для выборки комментариев.

```php
# models/Post.php

class Post extends \yii\db\ActiveRecord
{
    public function getComments()
    {
        return $this->hasMany(Comment::classname(), ['post_id' => 'id'])
            ->where(['active' => 1])->orderBy(['rating' => SORT_DESC]);
    }
}
```

Добавление комментария

Комментарий добавляется как обычное добавление записи.

```php
$comment = new Comment();
$comment->comment = 'Комментарий';
$comment->post_id = 4; // ИД поста, к которому будет привязан комментарий
$comment->save();
```

## напиши как добавить запись в связь один ко многим

Чтобы добавить запись в связь «один ко многим» в Yii2, сначала необходимо создать экземпляр родительской модели и сохранить его в базе данных. Затем создайте экземпляр дочерней модели и присвойте ей значение внешнего ключа, соответствующего родительской модели. Затем сохраните экземпляр дочерней модели в базе данных.

В данном примере у нас есть две модели: User и Order. Отношение между ними - «один ко многим», т.е. у одного пользователя может быть несколько заказов. Мы хотим создать новый заказ для пользователя с ID = 1.

1. Создайте экземпляр родительской модели User и найдите ее в базе данных:

```
$user = User::findOne(1);
```


2. Создайте экземпляр дочерней модели Order и присвойте ей значение внешнего ключа, соответствующего родительской модели:

```
$order = new Order();
$order->user_id = $user->id;
$order->item = 'New order';
$order->price = 100.00;
```


Здесь мы создали экземпляр модели Order и присвоили ей значение внешнего ключа user_id, соответствующего родительской модели.

3. Сохраните экземпляр дочерней модели в базе данных:

```
$order->save();
```


Здесь мы сохраняем экземпляр модели Order в базе данных.

Теперь мы добавили новую запись в связь «один ко многим» между моделями User и Order.

