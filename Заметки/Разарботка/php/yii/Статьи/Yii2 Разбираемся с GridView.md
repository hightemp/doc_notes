https://p0vidl0.info/yii2-razbiraemsya-s-gridview.html

# Yii2: Разбираемся с GridView

 [nix](https://p0vidl0.info/author/nix)    2015-06-19    [42 комментарияк записи Yii2: Разбираемся с GridView](https://p0vidl0.info/yii2-razbiraemsya-s-gridview.html#comments)

[![Картинка в gridview yii2](https://nix-tips.ru/wp-content/uploads/2015/06/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0-%D0%B2-gridview-yii2.jpg)](https://nix-tips.ru/wp-content/uploads/2015/06/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0-%D0%B2-gridview-yii2.jpg)

Специально для данной заметки, я подготовил [пример](https://nix-tips.ru/examples/simplegridview/index) использованием разных параметров **[GridView](https://nix-tips.ru/yii2-api-guides/guide-ru-output-data-widgets.html#gridview)**. Исходники модуля и всего приложения, доступны на [битбакете](https://bitbucket.org/p0vidl0/yii2-examples).

За основу взять код, полученный при помощи генератора **[Gii](https://nix-tips.ru/yii2-api-guides/ext-gii-index.html)**. Типичный код **GridView** после автоматической генерации:

```php
<?= GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'parent_id',
            'name:ntext',
            'url:ntext',
            'category_image:ntext',
            // 'created_at',
            // 'updated_at',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
```

В результате получается вполне годный вид:

[![yii2 gridview category](https://nix-tips.ru/wp-content/uploads/2015/06/yii2-gridview-category.jpg)](https://nix-tips.ru/wp-content/uploads/2015/06/yii2-gridview-category.jpg)

Однако, всем не угодишь и первоначальный скелет можно очень сильно преобразить, даже не влезая в дебри написания своего **GridView**.

## Настройки таблицы gridview в yii2

По-умолчанию, генерируемая виджетом таблица, имеет класс class=»table table-striped table-bordered». Переопределить класс можно через свойство tableOptions:

```php
<?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,,
        'tableOptions' => [
            'class' => 'table table-striped table-bordered'
        ],
...
```

## Настройки строк gridview yii 2.0

Добавить класс строкам можно через свойство rowOptions. Рассмотрим вариант с использованием анонимной функции.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'rowOptions'=>function ($model, $key, $index, $grid){
        $class=$index%2?'odd':'even';
        return [
            'key'=>$key,
            'index'=>$index,
            'class'=>$class
        ];
    },
]); ?>
```

## Шаблон GridView в yii2

По-умолчанию, шаблон **GridView** содержит информацию об общем количестве записей и отображенных записей summary , саму таблицу с данными items и блок постраничной навигации pager. Настраивается шаблон gridview через свойство layout. Простой пример:

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
'layout'=>"{sorter}\n{pager}\n{summary}\n{items}",
...
]); ?>
```

Свойство summary позволяет переопределить соответствующее поле.

Свойства showFooter и showHeader управляют отображением заголовка и футера **GridView**.

Свойство showOnEmpty разрешает отображение пустой таблицы, в случае отсутствия данных для отображения.

## Замена пустых данных в GridView

emptyCell позволяет задать значение для отображения в пустых ячейках.

## Отображение управляющих кнопок в GridView

Настройка вывода и вида кнопок в **GridView** осуществляется указанием класса, шаблона и других параметров столбца.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
         ['class' => 'yii\grid\SerialColumn'],
...
         [
            'class' => 'yii\grid\ActionColumn',
            'header'=>'Действия', 
            'headerOptions' => ['width' => '80'],
            'template' => '{view} {update} {delete}{link}',
        ],
    ],
]); ?>
```

Вывести нестандартные кнопки можно при помощи анонимных функций.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
        ...
        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{view} {update} {delete} {link}',
            'buttons' => [
                'update' => function ($url,$model) {
                    return Html::a(
                    '<span class="glyphicon glyphicon-screenshot"></span>', 
                    $url);
                },
                'link' => function ($url,$model,$key) {
                    return Html::a('Действие', $url);
                },
            ],
        ],
    ],
]); ?>
```

## Формат данных в столбцах **GridView**

Для установки своих атрибутов ячейкам таблицы **GridView** в **[Yii 2.0](https://nix-tips.ru/yii2-api-guides/)**, достаточно указать их в параметре contentOptions. Атрибуты могут быть определены как массивом, так и анонимной функцией function ($model, $key, $index, $column), которая может вычислять и возвращать массив атрибутов, таких как class, style, data-key и других.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
        ...
        // Один вариант
        [
            'attribute'=>'parent_id',
            'label'=>'Родительская категория',
            'contentOptions' =>function ($model, $key, $index, $column){
                return ['class' => 'name'];
            },
            'content'=>function($data){
                return "value";
            }
        ],
        // Другой вариант
        [
            'attribute'=>'category_image',
            'contentOptions' =>['class' => 'table_class','style'=>'display:block;'],
            'content'=>function($data){
                return "value";
            }
        ],
        ...
        ['class' => 'yii\grid\ActionColumn'],
    ],
]); ?>
```

### Сокращенный формат

**Yii 2.0** **GridView** позволяет сократить код настройки поля до вида  ‘attribute:format:label’, где attribute — данные из модели, format — шаблон вывода данных (‘raw’ , ‘text’ , ‘html’ , ‘image’, ‘datetime’,  ‘time’, ‘date’, [‘date’, ‘php:Y-m-d’]  и другие), label — заголовок столбца. В итоге, код

```php
'columns' => [
    ['class' => SerialColumn::className()],
    [
        'class' => DataColumn::className(), // Не обязательно
        'attribute' => 'name',
        'format' => 'text',
        'label' => 'Name',
    ],
    ['class' => CheckboxColumn::className()],
]
```

можно сократить до

```php
'columns' => [
    ['class' => SerialColumn::className()],
    'name:text:Name',
    ['class' => CheckboxColumn::className()],
]
```

Класс DataColumn::className() присваивается автоматически, если он не указан.  Формат данных обрабатывается formatter, используемым **GridView**. По-умолчанию это [yii\i18n\Formatter](https://nix-tips.ru/yii2-api-guides/guide-ru-tutorial-i18n.html).

### Картинка в Yii 2.0 GridView

[![Картинка в gridview yii2](https://nix-tips.ru/wp-content/uploads/2015/06/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0-%D0%B2-gridview-yii2.jpg)](https://nix-tips.ru/wp-content/uploads/2015/06/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0-%D0%B2-gridview-yii2.jpg)

Отобразить картинку в **GridView** можно несколькими способами:

Самый простой: указать тип поля после двоеточия ‘categoryImagePath:image’. Второй вариант — расширенная настройка поля.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
    ...
        // Простой вариант. Автоматическое формирование изображения
        'category_image:image',
        // Второй вариант. Формирование изображения и его параметров через анонимную функцию
        [
            'label' => 'Картинка',
            'format' => 'raw',
            'value' => function($data){
                return Html::img(Url::toRoute($data->category_image),[
                    'alt'=>'yii2 - картинка в gridview',
                    'style' => 'width:15px;'
                ]);
            },
        ],
    ...
    ],
]); ?>
```

### Ссылка в **GridView**

Настроим поле для вывода ссылки из модели.

```php
...
[
    'label' => 'Ссылка',
    'format' => 'raw',
    'value' => function($data){
        return Html::a(
            'Перейти',
            $data->url,
            [
                'title' => 'Смелей вперед!',
                'target' => '_blank'
            ]
        );
    }
],
...
```

### Данные из связанных моделей в **GridView**

Связанные данные выводятся аналогично данным самой модели.

```php
// Простой вариант, но без возможности сортировки по полю
 'parent.name',
// Вариант с возможностью сортировки по полю
[
    'attribute'=>'parent_id',
    'label'=>'Родительская категория',
    'format'=>'text', // Возможные варианты: raw, html
    'content'=>function($data){
        return $data->getParentName();
    },
    'filter' => Category::getParentsList()
],
```

В модели Category  описаны соответствующие методы.

```php
public function getParent()
{
    return $this->hasOne(Category::className(), ['id' => 'parent_id']);
}

public function getParentName()
{
    $parent = $this->parent;

    return $parent ? $parent->name : '';
}
```

### Вывод даты и времени в GridView

Отобразить данные в формате [даты/времени](https://nix-tips.ru/yii2-api-guides/guide-ru-output-formatting.html#formatirovanie-znacenij-daty-i-vremeni) можно либо прямым указанием типа данных для вывода ‘created_at:datetime’, ‘created_at:date’, ‘created_at:time’ или с использованием расширенного варианта.

```php
// Самый простой вариант. Доступные модификаторы - date:datetime:time
'created_at:time',
// Расширенный вариант с использованием стандартных шаблонов вывода даты/времени
[
    'attribute'=>'created_at',
    'label'=>'Создано',
    'format'=>'datetime', // Доступные модификаторы - date:datetime:time
    'headerOptions' => ['width' => '200'],
],
// Вариант с явным указанием формата вывода даты/времени
[
    'attribute' => 'updated_at',
    'format' =>  ['date', 'HH:mm:ss dd.MM.YYYY'],
    'options' => ['width' => '200']
],
```

### DropDownList в фильтре GridView Yii 2.0

По-умолчанию, **GridView** использует текстовый фильтр. Для создания фильтра в виде [выпадающего меню](https://nix-tips.ru/yii2-api-guides/yii-bootstrap-html.html), достаточно указать массив значений, по которым будет производиться фильтрация в параметре filter. Сортировка и фильтр данных по связанным полям уже описана в [соответствующей заметке](https://nix-tips.ru/yii2-sortirovka-i-filtr-gridview-po-svyazannym-i-vychislyaemym-polyam.html).

Массив можно задать вручную или получать из модели.

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
...
        [
            'attribute'=>'isactive',
            'filter'=>array("1"=>"Активно","2"=>"Не активно"),
        ],
...
        ['class' => 'yii\grid\ActionColumn'],
    ],
]); ?>
```

Второй вариант

```php
<?= GridView::widget([
    'dataProvider' => $dataProvider,
    'filterModel' => $searchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],
...
        [
            'attribute'=>'parent_id',
            'label'=>'Родительская категория',
            'format'=>'text', // Возможные варианты: raw, html
            'content'=>function($data){
                return $data->getParentName();
            },
            'filter' => Category::getParentsList()
        ],
...
        ['class' => 'yii\grid\ActionColumn'],
    ],
]); ?>
```

Получение списка категорий, имеющих дочерние, организовано в модели.

```php
public static function getParentsList()
{
    // Выбираем только те категории, у которых есть дочерние категории
    $parents = Category::find()
        ->select(['c.id', 'c.name'])
        ->join('JOIN', 'category c', 'category.parent_id = c.id')
        ->distinct(true)
        ->all();

    return ArrayHelper::map($parents, 'id', 'name');
}
```

## Заключение

Стандартный виджет **Yii2** фреймворка **GridView** имеет богатые возможности для отображения данных. Возможно как отображение «сырых» данных, так и вычисление их на лету, при помощи анонимных функций. Размещение активного содержимого в ячейках **GridView** будет описано в другом материале.