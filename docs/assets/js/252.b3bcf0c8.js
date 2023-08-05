(window.webpackJsonp=window.webpackJsonp||[]).push([[252],{519:function(e,a,n){"use strict";n.r(a);var t=n(14),i=Object(t.a)({},(function(){var e=this,a=e._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[e._v("https://anart.ru/yii2/2016/04/11/yii2-rbac-ponyatno-o-slozhnom.html")]),e._v(" "),a("h1",{attrs:{id:"как-настроить-rbac-в-yii2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#как-настроить-rbac-в-yii2"}},[e._v("#")]),e._v(" Как настроить RBAC в Yii2")]),e._v(" "),a("p",[e._v("11 апреля 2016")]),e._v(" "),a("p",[a("img",{attrs:{src:"https://anart.ru/img/2016/04/yii-rbac.jpg",alt:"Как настроить RBAC в Yii2"}})]),e._v(" "),a("p",[e._v("RBAC - это просто! В этом посте я постараюсь понятно объяснить как настроить "),a("strong",[e._v("RBAC в Yii2")]),e._v(". Напомню, "),a("strong",[e._v("RBAC - Role Based Access Control, что означает - Контроль доступа на основе ролей")]),e._v(". Программисты, которые не разобрались с RBAC, «впихивают» в модель юзера константы, типа "),a("code",[e._v("ROLE_ADMIN")]),e._v(", "),a("code",[e._v("ROLE_USER")]),e._v(", "),a("code",[e._v("ROLE_MANAGER")]),e._v(". В таблице юзера хранят роль… Потом в коде сравнивают эту самую роль… Я и сам писал подобный шлак, пока в один прекрасный момент не разобрался с примитивныи использованием RBAC.")]),e._v(" "),a("p",[e._v("Без моих пояснений понятно, что каждому пользователю назначается роль (role)/много ролей/разрешения (permissions)/правила (rules)… Роль может включать какие то разрешения. Она может наследовать разрешения от другой роли или нескольких ролей и т.д. Уверен, вы это уже миллион раз перечитали, пережевали… И всё равно вам непонятно, как же это работает, и как всё таки заставить в своем проекте работать этот «непонятный» RBAC.")]),e._v(" "),a("h2",{attrs:{id:"почему-так-все-запутано"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#почему-так-все-запутано"}},[e._v("#")]),e._v(" Почему так всё запутано?")]),e._v(" "),a("p",[e._v("Да потому что, «умники» пишут ствои статьи, полагая, что вы уже и без них всё знаете! Авторы кидают копипасты, воруя тексты друг у друга. И никто из них не пытается объяснить сути работы RBAC. Одни пишут о каких то файлах, которых хранят все данные. Другие пишут, что можно хранить конфигурацию в БД. При этом, всё равно, нужны какие то файлы, которые нужно запускать в консоли. У одних файлы лежат в одном месте, у других - в другом. Ну да ладно, поехали дальше…")]),e._v(" "),a("h2",{attrs:{id:"так-как-работает-rbac-в-yii2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#так-как-работает-rbac-в-yii2"}},[e._v("#")]),e._v(" Так как работает RBAC в Yii2?")]),e._v(" "),a("p",[e._v("Я глубоко не изучал, как работает RBAC в Yii1, потому что использовал модули "),a("em",[e._v("yii-user")]),e._v(" и "),a("em",[e._v("rights")]),e._v(". Но уверен, что в Yii2 изменилось немного.")]),e._v(" "),a("p",[e._v("Суть работы RBAC следующая: вы создаете экшены. Каждый экшн по сути - это какая то операция. Нужно проверить, имеет ли право текущий пользователь выполнять эту операцию. Пользователь имеет право её выполнять, если ему присвоено разрешение непосредственно для этой операции, либо роли пользователя присвоено такое разрешение. Так же возможно, что роль пользователя наследует другую роль, а той, в свою очередь, присвоено разрешение на проверяемую операцию. Глубина наследований практически не имеет границ.")]),e._v(" "),a("p",[e._v("Определиться с тем, какие роли будут в вашем проекте вы должны еще на стадии проектирования. В простом исполнении для каждого экшена нужно будет создавать именованное разрешение. Имя разрешения должно раскрывать его суть. По имени разрешения вы должны понять, в каком экшене оно используется. В коде экшенов вы вызываете проверку разрешений с помощью "),a("code",[e._v("Yii::$app->user->can('имя_разрешения_или_роли')")]),e._v(".")]),e._v(" "),a("p",[e._v("Разрешения, роли, назначения можно хранить в базе данных, а можно и в файлах. Ниже я буду описывать вариант хранения данных в БД.")]),e._v(" "),a("h2",{attrs:{id:"ближе-к-коду"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ближе-к-коду"}},[e._v("#")]),e._v(" Ближе к коду…")]),e._v(" "),a("p",[e._v("Базовые шаги, которые необходимо пройти:")]),e._v(" "),a("ul",[a("li",[e._v("Конфигурируем RBAC так, что бы данные хранились в БД. Приводим часть конфига (например, "),a("code",[e._v("common/config/main.php")]),e._v(" для advanced application template или "),a("code",[e._v("config/console.php")]),e._v(" и "),a("code",[e._v("config/web.php")]),e._v(" одновременно для basic application template), к следующему виду:")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n...\nreturn [\n    // ...\n    'components' => [\n        'authManager' => [\n            'class' => 'yii\\rbac\\DbManager',\n        ],\n        // ...\n    ],\n];\n")])])]),a("ul",[a("li",[e._v("Теперь в БД нужно создать необходимые таблицы, в которых будут храниться разрешения, роли, назначения… Для этого можно выполнить миграции, которые лежат в «коробке». В консоли выполняем:")])]),e._v(" "),a("p",[a("code",[e._v("php yii migrate --migrationPath=@yii/rbac/migrations")])]),e._v(" "),a("p",[e._v("Это создаст 4 таблицы в БД:")]),e._v(" "),a("p",[a("code",[e._v("auth_item")]),e._v(" - эта таблица хранит роли и разрешения.")]),e._v(" "),a("p",[a("code",[e._v("auth_item_child")]),e._v(" - здесь задаются наследования.")]),e._v(" "),a("p",[a("code",[e._v("auth_assignment")]),e._v(" - тут пользователям назначаются позиции из "),a("code",[e._v("auth_item")]),e._v(". Т.е. пользователю (по user ID) можем назначить роль/разрешение (по названиям).")]),e._v(" "),a("p",[a("code",[e._v("auth_rule")]),e._v(" - здесь хранятся имена классов правил, которые хранятся в php файлах.")]),e._v(" "),a("p",[e._v("Сейчас эти таблицы пустые.")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("Создаем пользователя, если до сих пор его не было. Например, у нас будет пользователь с ID 1 - это админ. С ID 2 - редактор новостей.")])]),e._v(" "),a("li",[a("p",[e._v("Теперь необходмо создать роли. Думаю будет достаточно двух ролей, например роль админа и роль редактора новостей. Так же необходимо создать разрешения, а затем назначить их ролям, а роли - пользователям. Можно это сделать руками в БД, а можно написать консольный скрипт, который всё добавит и назначит. Скрипт нужно выполнить один раз всего лишь для инициализации нашей задумки.")])])]),e._v(" "),a("p",[e._v("Сделаем первоначальную инициализацию с помощью консольного скрипта: в корне проекта по следущей вложенности создаем файл "),a("code",[e._v("console/controllers/MyRbacController.php")]),e._v(" (для basic шаблона файл должен быть "),a("code",[e._v("commands/MyRbacController.php")]),e._v(")")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n\nnamespace console\\controllers;\n\nuse Yii;\nuse yii\\console\\Controller;\n/**\n * Инициализатор RBAC выполняется в консоли php yii my-rbac/init\n */\nclass MyRbacController extends Controller {\n\n    public function actionInit() {\n        $auth = Yii::$app->authManager;\n        \n        $auth->removeAll(); //На всякий случай удаляем старые данные из БД...\n        \n        // Создадим роли админа и редактора новостей\n        $admin = $auth->createRole('admin');\n        $editor = $auth->createRole('editor');\n        \n        // запишем их в БД\n        $auth->add($admin);\n        $auth->add($editor);\n        \n        // Создаем разрешения. Например, просмотр админки viewAdminPage и редактирование новости updateNews\n        $viewAdminPage = $auth->createPermission('viewAdminPage');\n        $viewAdminPage->description = 'Просмотр админки';\n        \n        $updateNews = $auth->createPermission('updateNews');\n        $updateNews->description = 'Редактирование новости';\n        \n        // Запишем эти разрешения в БД\n        $auth->add($viewAdminPage);\n        $auth->add($updateNews);\n        \n        // Теперь добавим наследования. Для роли editor мы добавим разрешение updateNews,\n        // а для админа добавим наследование от роли editor и еще добавим собственное разрешение viewAdminPage\n        \n        // Роли «Редактор новостей» присваиваем разрешение «Редактирование новости»\n        $auth->addChild($editor,$updateNews);\n\n        // админ наследует роль редактора новостей. Он же админ, должен уметь всё! :D\n        $auth->addChild($admin, $editor);\n        \n        // Еще админ имеет собственное разрешение - «Просмотр админки»\n        $auth->addChild($admin, $viewAdminPage);\n\n        // Назначаем роль admin пользователю с ID 1\n        $auth->assign($admin, 1); \n        \n        // Назначаем роль editor пользователю с ID 2\n        $auth->assign($editor, 2);\n    }\n}\n")])])]),a("p",[e._v("Теперь выполним этот скрипт")]),e._v(" "),a("p",[a("code",[e._v("php yii my-rbac/init")])]),e._v(" "),a("p",[e._v("Если выполнилось без ошибок, то в таблицах БД вы увидите результат работы. Он просто добавил туда записи. По мере добавления новых экшенов, возможно вам придется создавать для них новые разрешения и назначать ролям или пользователям.")]),e._v(" "),a("p",[e._v("Если не критично потерять назначения имеющихся пользователей, то можно обновлять код MyRbacController и запускать его, что бы он пересоздал записи. Возможно, если убрать "),a("code",[e._v("$auth->removeAll()")]),e._v(" из MyRbacController, то новые роли/разрешения просто добавятся без потери старых данных. Лично я не проверял.")]),e._v(" "),a("p",[e._v("Вы можете вручную вносить новые записи ролей/разрешений через ваш менеджер баз данных. Так же можно установить расширение, которое для этих четырех таблиц реализует визуальный интерфейс. Оно называется "),a("a",{attrs:{href:"http://www.yiiframework.com/extension/yii2-rbac-plus/",target:"_blank",rel:"noopener noreferrer"}},[e._v("yii2-rbac-plus"),a("OutboundLink")],1),e._v(". Правда в composer файле этого расширения не указано, что оно требует виджеты от "),a("a",{attrs:{href:"https://github.com/kartik-v/",target:"_blank",rel:"noopener noreferrer"}},[e._v("kartik-v"),a("OutboundLink")],1),e._v(" и их придется установить заранее.")]),e._v(" "),a("ul",[a("li",[e._v("Теперь, для того что бы проверить, имеет ли пользователь какое то разрешение, мы в нужном месте кода (хоть в экшене, хоть в фильтре доступа в поведениях) можем запросить проверку так:")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n...\nif (!\\Yii::$app->user->can('updateNews')) {\n    throw new ForbiddenHttpException('Access denied');\n}\n...\n")])])]),a("p",[e._v("Дословно это значит, что если пользователь НЕ может "),a("code",[e._v("updateNews")]),e._v(", то выдается ошибка. При этом система проверит, какие роли или разрешения назначены в таблице "),a("code",[e._v("auth_assignment")]),e._v(" текущему пользователю. Сначала проверит присвоенные разрешения (вы же помните, что пользователю можно присвоить не только роль но и разрешение). Если разрешение "),a("code",[e._v("updateNews")]),e._v(" не будет найдено, то RBAC пройдет по каждой назначенной роли и проверит разрешения для ролей. Если хоть одной роли будет назначено разрешение "),a("code",[e._v("updateNews")]),e._v(", то "),a("code",[e._v("Yii::$app->user->can('updateNews')")]),e._v(" вернет true;")]),e._v(" "),a("h2",{attrs:{id:"как-быть-с-новыми-пользователями-которые-добавляются-в-систему-динамически"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#как-быть-с-новыми-пользователями-которые-добавляются-в-систему-динамически"}},[e._v("#")]),e._v(" Как быть с новыми пользователями, которые добавляются в систему динамически?")]),e._v(" "),a("p",[e._v("Если у вас в проекте присутствует автоматическая регистрация пользователей или админ вносит юзеров через админку, то в модели юзера, после сохранения "),a("em",[e._v("новой")]),e._v(" записи можно выполнить назначение новому юзера роли:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n...\n\n// Назначаем роль в методе afterSave модели User\n$auth = Yii::$app->authManager;\n$editor = $auth->getRole('editor'); // Получаем роль editor\n$auth->assign($editor, $this->id); // Назначаем пользователю, которому принадлежит модель User\n\n...        \n")])])]),a("p",[e._v("Вот в принципе и вся суть. Ниже я распишу, как создать правила с параметрами, например для того, что бы проверить, является ли пользователь автором новости или нет.")]),e._v(" "),a("h2",{attrs:{id:"правила-rbac-rules"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#правила-rbac-rules"}},[e._v("#")]),e._v(" Правила / RBAC Rules")]),e._v(" "),a("p",[e._v("RBAC дает возможность очень гибко работать с разрешениями и ролями с помощью правил. Правила добавляют ролям и разрешениям "),a("em",[e._v("дополнительные ограничения")]),e._v(". В RBAC Yii1 эти правила хранились непосредственно в разрешениях и назывались Business rules.")]),e._v(" "),a("p",[e._v("В Yii2 правила являются классами (php файлами), которые наследуются от "),a("code",[e._v("yii\\rbac\\Rule")]),e._v(" и должны содержать в себе единственный метод "),a("code",[e._v("execute()")]),e._v(".")]),e._v(" "),a("p",[e._v("Создадим правило, которое позволяет проверять, является ли пользователь автором новости. Файл "),a("code",[e._v("common\\rbac\\AuthorRule.php")]),e._v(". Путь может быть любой. Мне удобно хранить правила в "),a("code",[e._v("common\\rbac")]),e._v(".")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\nnamespace common\\rbac;\n\nclass AuthorRule extends yii\\rbac\\Rule\n{\n    public $name = 'isAuthor';\n\n    /**\n     * @param string|integer $user ID пользователя.\n     * @param Item $item роль или разрешение с которым это правило ассоциировано\n     * @param array $params параметры, переданные в ManagerInterface::checkAccess(), например при вызове проверки\n     * @return boolean a value indicating whether the rule permits the role or permission it is associated with.\n     */\n    public function execute($user, $item, $params)\n    {\n        return isset($params['news']) ? $params['news']->createdBy == $user : false;\n    }\n}\n")])])]),a("p",[e._v("Таким образом, мы проверяем, что поле "),a("code",[e._v("createdBy")]),e._v(" у новости совпадает или нет с user id. Файл правила мы создали. Теперь его нужно добавть в RBAC. Для этого мы модернизируем наш инициализатор MyRbacController и выполним его еще раз. Старые данные сотрем:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n\nnamespace console\\controllers;\n\nuse Yii;\nuse yii\\console\\Controller;\n/**\n * Инициализатор RBAC выполняется в консоли php yii my-rbac/init\n */\nclass MyRbacController extends Controller {\n\n    public function actionInit() {\n        $auth = Yii::$app->authManager;\n        \n        $auth->removeAll(); //На всякий случай удаляем старые данные из БД...\n        \n        // Создадим роли админа и редактора новостей\n        $admin = $auth->createRole('admin');\n        $editor = $auth->createRole('editor');\n        \n        // запишем их в БД\n        $auth->add($admin);\n        $auth->add($editor);\n        \n        // Создаем наше правило, которое позволит проверить автора новости\n        $authorRule = new \\app\\rbac\\AuthorRule;\n        \n        // Запишем его в БД\n        $auth->add($authorRule);\n        \n        // Создаем разрешения. Например, просмотр админки viewAdminPage и редактирование новости updateNews\n        $viewAdminPage = $auth->createPermission('viewAdminPage');\n        $viewAdminPage->description = 'Просмотр админки';\n        \n        $updateNews = $auth->createPermission('updateNews');\n        $updateNews->description = 'Редактирование новости';\n        \n        // Создадим еще новое разрешение «Редактирование собственной новости» и ассоциируем его с правилом AuthorRule\n        $updateOwnNews = $auth->createPermission('updateOwnNews');\n        $updateOwnNews->description = 'Редактирование собственной новости';\n        \n        // Указываем правило AuthorRule для разрешения updateOwnNews.\n        $updateOwnNews->ruleName = $authorRule->name;\n        \n        // Запишем все разрешения в БД\n        $auth->add($viewAdminPage);\n        $auth->add($updateNews);\n        $auth->add($updateOwnNews);\n        \n        // Теперь добавим наследования. Для роли editor мы добавим разрешение updateOwnNews (редактировать собственную новость),\n        // а для админа добавим собственные разрешения viewAdminPage и updateNews (может смотреть админку и редактировать любую новость)\n        \n        // Роли «Редактор новостей» присваиваем разрешение «Редактирование собственной новости»\n        $auth->addChild($editor,$updateOwnNews);\n\n        // админ имеет собственное разрешение - «Редактирование новости»\n        $auth->addChild($admin, $updateNews);\n        \n        // Еще админ имеет собственное разрешение - «Просмотр админки»\n        $auth->addChild($admin, $viewAdminPage);\n\n        // Назначаем роль admin пользователю с ID 1\n        $auth->assign($admin, 1); \n        \n        // Назначаем роль editor пользователю с ID 2\n        $auth->assign($editor, 2);\n    }\n}\n")])])]),a("p",[e._v("Теперь, что бы вызвать проверку прав на редактирование собственной новости, в экшене редактирования производим проверку:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\n...\nif (!\\Yii::$app->user->can('updateOwnNews', ['news' => $newsModel])) {\n    throw new ForbiddenHttpException('Access denied');\n}\n...\n")])])]),a("p",[e._v("Здесь мы вызываем проверку updateOwnNews и передаем в правило этого разрешения параметр news (модель новости) в виде ассоциативного массива.")]),e._v(" "),a("h2",{attrs:{id:"использование-проверки-в-фильтре-доступа-accesscontrol"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#использование-проверки-в-фильтре-доступа-accesscontrol"}},[e._v("#")]),e._v(" Использование проверки в фильтре доступа AccessControl")]),e._v(" "),a("p",[e._v("Использовать проверку в фильтре доступа "),a("code",[e._v("AccessControl")]),e._v(" выгодно по причине того, что, если пользователь не авторизован и не имеет разрешения, то yii перекинет его на страницу авторизации. А если пользователь был авторизован и не имеет разрешения, то получает страницу ошибки. Пример ниже проверяет разрешение "),a("code",[e._v("viewAdminModule")]),e._v(" для всех экшенов контроллера:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("<?php\npublic function behaviors() {\n        return [\n            'access' => [\n                'class' => \\yii\\filters\\AccessControl::className(),\n                'rules' => [\n                    [\n                        'allow' => true,\n                        'roles' => ['viewAdminModule']\n                    ],\n                ],\n            ],\n        ];\n    }\n")])])]),a("p",[e._v("Здесь параметру "),a("code",[e._v("roles")]),e._v(" передается массив ролей или разрешений, что в свою очередь в недрах системы вызывает проверку Yii::$app->user->can(‘viewAdminModule’)).")]),e._v(" "),a("p",[e._v("Кстати, с помощью Yii::$app->user->can() мы можем проверять не только наличие разрешения у роли, но и наличие роли. "),a("code",[e._v("Yii::$app->user->can('editor'))")]),e._v(" вернет "),a("code",[e._v("true")]),e._v(", если текущему пользователю назначена роль "),a("code",[e._v("editor")]),e._v(". Получить массив ролей мы можем так: "),a("code",[e._v("Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId())")]),e._v(".")]),e._v(" "),a("p",[e._v("Имейте в виду, что если роль админа наследует роль редактора новостей, то для админа "),a("code",[e._v("Yii::$app->user->can('editor'))")]),e._v(" вернет "),a("em",[e._v("true")]),e._v(".")])])}),[],!1,null,null,null);a.default=i.exports}}]);