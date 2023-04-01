http://bologer.ru/yii2-basic-registraciya-i-avtorizaciya-cherez-bazu-menyaem-user-klass/

# Yii2 basic: Регистрация и авторизация через базу, меняем User класс

10 сентября 2017 · [Yii2 basic](http://bologer.ru/kursy/yii2-basic/ "Показать все записи этой категории") · 17 мин чтения

В этой записи мы создадим страницу регистрации пользователей, миграцию для таблицы user, сделаем авторизацию через базу данных и внесем новые изменения в User класс. 

> Эта запись относится к [курсу Yii2 basic](http://bologer.ru/yii2-basic-soderzhanie-kursa/).

План действий:

-   создать новую миграцию и запустить её (мы это уже умеем)
-   переписать models/User класс на использование ActiveRecord
-   создать форму регистрации, модель для проверки полей формы

### Миграция для таблицы user

Для начала перейдем в папку проекта и создадим новую миграцию с названием «create_user_table»:

```
$ cd /var/www/yii-dev/
$ php yii migrate/create create_user_table
```

Открываем файл m170903_114309_create_user_table внутри папки migrations и заменяем все что там есть внутри на следующее:

```php
<?php

use yii\db\Migration;

/**
 * Handles the creation of table `user`.
 */
class m170903_114309_create_user_table extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'username' => $this->string()->notNull()->unique(),
            'auth_key' => $this->string(32)->notNull(),
            'password_hash' => $this->string()->notNull(),
            'password_reset_token' => $this->string()->unique(),
            'email' => $this->string()->notNull()->unique(),
            
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ], $tableOptions);
    }

    public function down()
    {
        $this->dropTable('{{%user}}');
    }
}
```

Далее нам нужно запустить миграцию:

```
$ php yii migrate/up
```

Вводите «yes» и нажимаете «Enter».

У вас должно вывестись следующее:

```
*** applying m170903_114309_create_user_table
    > create table {{%user}} ... done (time: 0.013s)
*** applied m170903_114309_create_user_table (time: 0.022s)


1 migration was applied.

Migrated up successfully.
```

Значить все окей. Теперь нужно изменить User класс.

### Изменения в User классе

Новый вариант класса User :

> Под кодом ниже будет подробное описание изменений, которые были сделаны в нём.

```php
<?php
namespace app\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

/**
 * User model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
class User extends ActiveRecord implements IdentityInterface
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user}}';
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }


    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id]);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        throw new NotSupportedException('"findIdentityByAccessToken" is not implemented.');
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        return static::findOne(['username' => $username]);
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token)
    {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne(['password_reset_token' => $token]);
    }

    /**
     * Finds out if password reset token is valid
     *
     * @param string $token password reset token
     * @return bool
     */
    public static function isPasswordResetTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }

        $timestamp = (int) substr($token, strrpos($token, '_') + 1);
        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        return $timestamp + $expire >= time();
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    /**
     * Generates new password reset token
     */
    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Removes password reset token
     */
    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }
}
```

Во-первых, я удалил приватное статическое свойство $user , которые использовалось вместо ActiveRecord:

```php
private static $users = [
    '100' => [
        'id' => '100',
        'username' => 'admin',
        'password' => 'admin',
        'authKey' => 'test100key',
        'accessToken' => '100-token',
    ],
    '101' => [
        'id' => '101',
        'username' => 'demo',
        'password' => 'demo',
        'authKey' => 'test101key',
        'accessToken' => '101-token',
    ],
];
```

Теперь User класс использует ActiveRecord, а так же IdentityInterface, который обязывает вас указать следующие методы внутри класса User, иначе выдаст ошибку:

```php
public static function findIdentity($id);

public static function findIdentityByAccessToken($token, $type = null);

public function getId();

public function getAuthKey();

public function validateAuthKey($authKey);
```

В обновленном формате User класса они (выше) уже добавлены, поэтому вам лично добавлять ничего не нужно.

```php
/**
 * User model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
```

В дополнении, я добавил описание свойств этого класса (id, username и др.), чтобы помочь PhpStorm понимать структура класса, иначе он будет писать, что параметр взят откуда-то используя «магию» :D. Это лишь означает, что IDE не имеет малейшего понимаю откуда вы могли взять некоторые атрибуты. Также,  благодаря статическому методу  tableName() мы указываем какая таблица будет использоваться _ActiveRecord_‘ом:

```php
public static function tableName()
{
    return '{{%user}}';
}
```

Если бы вы его не указали, тогда класс все равно бы работал, но бралось бы название класса (User), конвертировалось в нижний регистр и получилось бы название таблицы, НО если ваша таблица в базе называлась  users, тогда точно пришлось бы  tableName()
или переименовать класс в Users.
Так же были добавлены методы помощники, например как этот:

```php
public static function findByUsername($username)
{
    return static::findOne(['username' => $username]);
}
```

Для быстрого поиска пользователя по его логину.

И конечно же, данные теперь все берутся из таблицы, выгружаются в наш User класс, где выполняется остальная логика (сравнение и т.д.). Например, метод validatePassword() сравнивает $password с вариантом в базе:

```php
public function validatePassword($password)
{
    return Yii::$app->security->validatePassword($password, $this->password_hash);
}
```

В остальном, все изменения были сделаны в поддержку ActiveRecord, чтобы не использовать статическое свойство — $user.

После того как класс готов, нужно сделать страницу регистрацию, чтобы пользователи могли регистрироваться и входить в систему.

## Регистрация

Создайте новый файл signup.php в views/site со следующим содержимым:

```php
<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\SignupForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Регистрация';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-signup">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>Please fill out the following fields to signup:</p>

    <div class="row">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'form-signup']); ?>

                <?= $form->field($model, 'username')->textInput(['autofocus' => true]) ?>

                <?= $form->field($model, 'email') ?>

                <?= $form->field($model, 'password')->passwordInput() ?>

                <div class="form-group">
                    <?= Html::submitButton('Регистрация', ['class' => 'btn btn-primary', 'name' => 'signup-button']) ?>
                </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>
</div>
```

Создайте новый файл SignupForm.php внутри папки models со следующим содержимым:

```php
<?php
namespace app\models;

use yii\base\Model;
use app\models\User;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $username;
    public $email;
    public $password;


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required'],
            ['username', 'unique', 'targetClass' => '\app\models\User', 'message' => 'Такое логин уже занят.'],
            ['username', 'string', 'min' => 2, 'max' => 255],

            ['email', 'trim'],
            ['email', 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'unique', 'targetClass' => '\app\models\User', 'message' => 'Такая почта уже занята.'],

            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return User|null the saved model or null if saving fails
     */
    public function signup()
    {
        if (!$this->validate()) {
            return null;
        }
        
        $user = new User();
        $user->username = $this->username;
        $user->email = $this->email;
        $user->setPassword($this->password);
        $user->generateAuthKey();
        
        return $user->save() ? $user : null;
    }
}
```

Это будет использоваться для проверки формы.

Теперь нужно зайти в controllers/SiteController.php и после actionLogin() вставить добавить actionSignup():

```php
...

/**
 * Форма регистрации.
 *
 * @return mixed
 */
public function actionSignup()
{
    $model = new SignupForm();
    if ($model->load(Yii::$app->request->post())) {
        if ($user = $model->signup()) {
            if (Yii::$app->getUser()->login($user)) {
                return $this->goHome();
            }
        }
    }

    return $this->render('signup', [
        'model' => $model,
    ]);
}

...
```

И еще, добавим ссылка на регистрацию в верхнем меню и переведем все на русский. Для этого, заходим в views/layouts/main.php:

И заменяем это:

```php
echo Nav::widget([
    'options' => ['class' => 'navbar-nav navbar-right'],
    'items' => [
        ['label' => 'Home', 'url' => ['/site/index']],
        ['label' => 'About', 'url' => ['/site/about']],
        ['label' => 'Contact', 'url' => ['/site/contact']],
        Yii::$app->user->isGuest ? (
            ['label' => 'Login', 'url' => ['/site/login']]
        ) : (
            '<li>'
            . Html::beginForm(['/site/logout'], 'post')
            . Html::submitButton(
                'Logout (' . Yii::$app->user->identity->username . ')',
                ['class' => 'btn btn-link logout']
            )
            . Html::endForm()
            . '</li>'
        )
    ],
]);
```

На это:

```php
echo Nav::widget([
    'options' => ['class' => 'navbar-nav navbar-right'],
    'items' => [
        ['label' => 'Главная', 'url' => ['/site/index']],
        ['label' => 'О нас', 'url' => ['/site/about']],
        ['label' => 'Контакты', 'url' => ['/site/contact']],
        ['label' => 'Машины', 'url' => ['car/index'], 'visible' => !Yii::$app->user->isGuest],
        ['label' => 'Регистрация', 'url' => ['site/signup'], 'visible' => Yii::$app->user->isGuest],
        Yii::$app->user->isGuest ? (
        ['label' => 'Войти', 'url' => ['/site/login']]
        ) : (
            '<li>'
            . Html::beginForm(['/site/logout'], 'post')
            . Html::submitButton(
                'Выйти (' . Yii::$app->user->identity->username . ')',
                ['class' => 'btn btn-link logout']
            )
            . Html::endForm()
            . '</li>'
        )
    ],
]);
```

Так же я добавил ссылку на все машины, чтобы было удобнее заходить на эту страницу.

Теперь обновите главную страницу и меню должно быть на русском языке. Ссылка «Регистрация» будет отображаться только для не авторизованных пользователей.

> По ссылкам: авторизация — site/login, выход — site/logout и регистрация — site/signup.

Меню в Yii2 управляется используя виджет yii\bootstrap\Nav. Вы конечно же можете написать собственный виджет или использовать Nav за основу и дописать к нему дополнительные функции, если это потребуется.

## Послесловие

На этом изменения касательно User класса заканчиваются. Теперь вы можете регистрироваться на сайте и входить в систему использую базу данных.