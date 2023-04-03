https://habr.com/ru/post/235485/

#### Задача

  
Настроить использование RBAC в Yii2.  
  

#### Условия

  
Список возможных ролей:  

-   **guest** — не авторизованный юзер;
-   **BRAND** — авторизованный юзер, наследует разрешения роли **guest** и имеет свои уникальные разрешения;
-   **TALENT** — авторизованный юзер, наследует разрешения роли **guest** и имеет свои уникальные разрешения;
-   **admin** — авторизованный юзер, наследует разрешения ролей **guest**, **BRAND** и **TALENT** и имеет свои уникальные разрешения.
-   Роль определяется полем **group** в модели **UserExt**;
-   Роли имеют вложенную структуру — одна роль может наследовать разрешения другой;
-   Используется **yii\rbac\PhpManager**;
-   Не использовать назначение роли юзеру по его ID — вместо этого использовать несколько предустановленных ролей (**defaultRoles**);
-   Генерирование конфига «роль-разрешения» будет делать консольная команда **yii**;
-   Будут использованы расширенные правила (**Rules**) для разрешений.

  
  

#### Предварительная настройка

  
_`app/config/console.php`_  

```
'components' => [
    // ...
    'authManager' => [
        'class' => 'yii\rbac\PhpManager',
    ],
    // ...
],
```

  
  
_`app/config/web.php`_  

```
'components' => [
    // ...
    'authManager' => [
        'class' => 'yii\rbac\PhpManager',
        'defaultRoles' => ['admin', 'BRAND', 'TALENT'], // Здесь нет роли "guest", т.к. эта роль виртуальная и не присутствует в модели UserExt
    ],
    // ...
],
```

  
  
Создать директорию _`@app/rbac`_ — именно в ней будут находиться разрешения и правила.  
  

#### Создание разрешений

  
В директории _`@app/commands`_ создать контроллер, который будет генерировать массив разрешений:  
_`app/commands/RbacController.php`_  

```
<?php
namespace app\commands;
 
use Yii;
use yii\console\Controller;
use \app\rbac\UserGroupRule;
 
class RbacController extends Controller
{
    public function actionInit()
    {
        $authManager = \Yii::$app->authManager;
 
        // Create roles
        $guest  = $authManager->createRole('guest');
        $brand  = $authManager->createRole('BRAND');
        $talent = $authManager->createRole('TALENT');
        $admin  = $authManager->createRole('admin');
 
        // Create simple, based on action{$NAME} permissions
        $login  = $authManager->createPermission('login');
        $logout = $authManager->createPermission('logout');
        $error  = $authManager->createPermission('error');
        $signUp = $authManager->createPermission('sign-up');
        $index  = $authManager->createPermission('index');
        $view   = $authManager->createPermission('view');
        $update = $authManager->createPermission('update');
        $delete = $authManager->createPermission('delete');
 
        // Add permissions in Yii::$app->authManager
        $authManager->add($login);
        $authManager->add($logout);
        $authManager->add($error);
        $authManager->add($signUp);
        $authManager->add($index);
        $authManager->add($view);
        $authManager->add($update);
        $authManager->add($delete);
 
 
        // Add rule, based on UserExt->group === $user->group
        $userGroupRule = new UserGroupRule();
        $authManager->add($userGroupRule);
 
        // Add rule "UserGroupRule" in roles
        $guest->ruleName  = $userGroupRule->name;
        $brand->ruleName  = $userGroupRule->name;
        $talent->ruleName = $userGroupRule->name;
        $admin->ruleName  = $userGroupRule->name;
 
        // Add roles in Yii::$app->authManager
        $authManager->add($guest);
        $authManager->add($brand);
        $authManager->add($talent);
        $authManager->add($admin);
 
        // Add permission-per-role in Yii::$app->authManager
        // Guest
        $authManager->addChild($guest, $login);
        $authManager->addChild($guest, $logout);
        $authManager->addChild($guest, $error);
        $authManager->addChild($guest, $signUp);
        $authManager->addChild($guest, $index);
        $authManager->addChild($guest, $view);
 
        // BRAND
        $authManager->addChild($brand, $update);
        $authManager->addChild($brand, $guest);
 
        // TALENT
        $authManager->addChild($talent, $update);
        $authManager->addChild($talent, $guest);
 
        // Admin
        $authManager->addChild($admin, $delete);
        $authManager->addChild($admin, $talent);
        $authManager->addChild($admin, $brand);
    }
}
```

  
  
Класс **UserGroupRule** отвечает за проверку равенства роли текущего юзера, роли прописанной в массиве разрешений. Этим мы избегаем проблемы с назначением роли юзеру по его ID.  
_`app/rbac/UserGroupRule.php`_  

```
<?php
namespace app\rbac;
 
use Yii;
use yii\rbac\Rule;
 
class UserGroupRule extends Rule
{
    public $name = 'userGroup';
 
    public function execute($user, $item, $params)
    {
        if (!\Yii::$app->user->isGuest) {
            $group = \Yii::$app->user->identity->group;
            if ($item->name === 'admin') {
                return $group == 'admin';
            } elseif ($item->name === 'BRAND') {
                return $group == 'admin' || $group == 'BRAND';
            } elseif ($item->name === 'TALENT') {
                return $group == 'admin' || $group == 'TALENT';
            }
        }
        return true;
    }
}
```

  
  
Теперь в контроллере из метода **behaviors** можно убрать правило **access**:  
_`app/controllers/SiteController.php`_  

```
public function behaviors()
{
    return [
        
        // ...
        'access' => [
            'class' => AccessControl::className(),
            'only' => ['logout'],
            'rules' => [
                [
                    'actions' => ['logout'],
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ],
        // ...
         
    ];
}
```

  
  

#### Проверка доступа

  
Способ 1 — в методе контроллера:  
_`app/controllers/SiteController.php`_  

```
public function actionAbout()
{
    if (!\Yii::$app->user->can('about')) {
        throw new ForbiddenHttpException('Access denied');
    }
    return $this->render('about');
}
```

  
  
Способ 2 — прописать **beforeAction**, чтобы не писать _`"if !\Yii::$app->user->can"`_ в каждом методе:  
_`app/controllers/SiteController.php`_  

```
public function beforeAction($action)
{
    if (parent::beforeAction($action)) {
        if (!\Yii::$app->user->can($action->id)) {
            throw new ForbiddenHttpException('Access denied');
        }
        return true;
    } else {
        return false;
    }
}
```

  
  

#### Генерирование файлов разрешений

  
Чтобы сгенерировать файл с массивом разрешений нужно в корне проекта выполнить команду:  

> **Внимание!**  
> Перед выполнением этой команды нужно удалить файлы _`@app/rbac/items.php`_ и _`@app/rbac/rules.php`_ чтобы избежать конфликтов слияния  

  

```
./yii rbac/init
```

  
  
В директории _`@app/rbac`_ должны появиться два файла:  
_`app/rbac/items.php`_  

```
<?php
return [
    'login' => [
        'type' => 2,
    ],
    'logout' => [
        'type' => 2,
    ],
    'error' => [
        'type' => 2,
    ],
    'sign-up' => [
        'type' => 2,
    ],
    'index' => [
        'type' => 2,
    ],
    'view' => [
        'type' => 2,
    ],
    'update' => [
        'type' => 2,
    ],
    'delete' => [
        'type' => 2,
    ],
    'guest' => [
        'type' => 1,
        'ruleName' => 'userGroup',
        'children' => [
            'login',
            'logout',
            'error',
            'sign-up',
            'index',
            'view',
        ],
    ],
    'BRAND' => [
        'type' => 1,
        'ruleName' => 'userGroup',
        'children' => [
            'update',
            'guest',
        ],
    ],
    'TALENT' => [
        'type' => 1,
        'ruleName' => 'userGroup',
        'children' => [
            'update',
            'guest',
        ],
    ],
    'admin' => [
        'type' => 1,
        'children' => [
            'delete',
            'TALENT',
            'BRAND',
        ],
    ],
];
```

  
  
_`app/rbac/rules.php`_  

```
<?php
return [
    'userGroup' => 'O:22:"app\\rbac\\UserGroupRule":3:{s:4:"name";s:9:"userGroup";s:9:"createdAt";N;s:9:"updatedAt";N;}',
];
```

  
  

#### Расширенное правило (**Rule**) для разрешений

  
Например, нужно запретить юзерам редактировать (**update**) не свой профиль. Для этого нужно расширенное правило:  
_`app/rbac/UserProfileOwnerRule.php`_  

```
<?php
namespace app\rbac;
 
use yii\rbac\Rule;
use yii\rbac\Item;
 
class UserProfileOwnerRule extends Rule
{
    public $name = 'isProfileOwner';
 
    /**
     * @param string|integer $user   the user ID.
     * @param Item           $item   the role or permission that this rule is associated with
     * @param array          $params parameters passed to ManagerInterface::checkAccess().
     *
     * @return boolean a value indicating whether the rule permits the role or permission it is associated with.
     */
    public function execute($user, $item, $params)
    {
        if (\Yii::$app->user->identity->group == 'admin') {
            return true;
        }
        return isset($params['profileId']) ? \Yii::$app->user->id == $params['profileId'] : false;
    }
}
```

  
  
В файл _`@app/rbac/RbacController.php`_ добавить:  
_`app/rbac/RbacController.php`_  

```
use \app\rbac\UserProfileOwnerRule;
 
// add the rule
$userProfileOwnerRule = new UserProfileOwnerRule();
$authManager->add($userProfileOwnerRule);
 
$updateOwnProfile = $authManager->createPermission('updateOwnProfile');
$updateOwnProfile->ruleName = $userProfileOwnerRule->name;
$authManager->add($updateOwnProfile);
 
$authManager->addChild($brand, $updateOwnProfile);
$authManager->addChild($talent, $updateOwnProfile);
```

  
  
Проверка доступа в методе контроллера:  
_`app/controllers/UsersController.php`_  

```
public function actionUpdate($id)
{
    if (!\Yii::$app->user->can('updateOwnProfile', ['profileId' => \Yii::$app->user->id])) {
        throw new ForbiddenHttpException('Access denied');
    }
    // ...
} 
```