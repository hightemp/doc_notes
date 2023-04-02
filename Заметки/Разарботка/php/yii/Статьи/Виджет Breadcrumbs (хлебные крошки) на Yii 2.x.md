http://www.webapplex.ru/vizdzhet-breadcrumbs-(xlebnyie-kroshki)-na-yii-2.x

# Виджет Breadcrumbs (хлебные крошки) на Yii 2.x

Сегодня рассмотрим примеры использования виджета Breadcrumbs "Хлебные крошки" на Yii 2. Хлебные крошки это навигационная цепочка представляющая собой путь от корня сайта до текущей категории

Название «Хлебные крошки» относится к сленгу и берут свое начало в немецкой сказке «Hänsel und Gretel», в которой дети, когда их завели в лес во второй раз, не смогли найти обратную дорогу, так как на этот раз вместо маленьких камешков они оставляли за собой хлебные крошки, впоследствии склёванные лесными птицами.

В самом начале файла представления подключаем класс breadcrumbs

```
use yii\widgets\Breadcrumbs;
```

Далее задаем массив нужных нам ссылок:

```php
$this->params['breadcrumbs'][] = [
                                    'template' => "<li><b>{link}</b></li>\n", //  шаблон для этой ссылки  'label' => 'Категория', // название ссылки 'url' => ['/category'] // сама ссылка
                                 ];
$this->params['breadcrumbs'][] = ['label' => 'Подкатегория', 'url' => ['/category/subcategory']];
```

Для вывода на экран цепочки ссылок используем следующий код:

```php
/* Если существует параметр хлебных крошек выводим хлебные крошки, иначе ни чего не выводим */
echo Breadcrumbs::widget(['links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [], ]);
```

Теперь рассмотрим более конкретный пример и приведем куски кода, относящиеся к хлебным крошкам. Предположим, что у нас есть 3 таблицы (3 класса): категория организаций, подкатегория организаций и сами организации

Шаг первый, выведем хлебные крошки в категории организации. Рассмотрим программный код контроллера

```php
public function actionCategory()
{
    // получаем название категории
    $request = Yii::$app->request->get('namecategory');
    // выполяем запрос к таблице категории и выбираем конкретную категорию организаций в которую мы зашли
    $compcatname = Categories::find()->where(['alias' => $reguest])->one();
    // отправляем наши данные в представление 'category' с массивом данных по этой категории
    return $this->render('category', ['compcatname' => $compcatname]); 
}
```
Выводим хлебные крошки в представление

```php
// подключаем класс
use yii\widgets\Breadcrumbs;
//Добавляем название категории 
$this->params['breadcrumbs'][] = $compcatname->name;
//.......
// Выводим цепочку навигации
echo Breadcrumbs::widget(['links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],]);
```

За основу статьи взяты куски кода с сайта [Визитосы.рф](http://xn--b1akcb4asf8e.xn--p1ai/)

![](http://www.webapplex.ru/blog/04092015/category.png)

Шаг второй, выведем навигационную цепочку в подкатегории организации. Таблицы в базе имею связь один ко многим. Категория организаций->подкатегория организаций-> организации

Опишем в модели подкатегории организации связь один ко многим к таблице категории организации

```php
public function getCategories()
{
    return $this->hasOne(Categories::className(), ['id' =>'categories_id']);
}
```

Связь мы будем использовать для обращения к таблици категории организаций в представлении. В контроллере напишем следующий код:

```php
public function actionSubcategory()
{
    // Получаем алиас выбранной подкатегории
    $request = Yii::$app->request->get('namesubcategory');
    // Выполняем запрос к таблице подкатегории
    $compsubcatname = SubCategory::find()->where(['alias' => $request])->one();
    //........
    // Передаем массив данных в представление
    return $this->render('subcategory', ['compsubcatname' => $compsubcatname, ]);
}
```

Выводим хлебные крошки в представление

```php
// Подключаем класс
use yii\widgets\Breadcrumbs;
// Ссылка на категорию организаций, через связь
$this->params['breadcrumbs'][] = ['label' => $compsubcatname->categories->name, 'url'=> ['/companies/'.$compsubcatname->categories->alias]];
// имя подкатегории
$this->params['breadcrumbs'][] = $compsubcatname->name;

// Вывод виджета
echo Breadcrumbs::widget(['links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],]);
```

![](http://www.webapplex.ru/blog/04092015/subcategory.png)

Шаг третий, выведем навигацию в выбранной организации. Здесь все по аналогии с предыдущими шагами, приведем примеры программного кода

Связь модели организации с подкатегорией организаций

```php
public function getSubCategory()
{
    return $this->hasOne(SubCategory::className(), ['id' => 'id_comp_category']);
}
```

В контроллере запрашиваем информацию по организации

```php
public function actionView() 
{
    $request = Yii::$app->request->get('namecompany');
    $models = Companies::find()->where(['alias' => $request])->one();
    return $this->render('view', ['models' => $models,]);
}
```

В представлении выводим навигацию

```php
use yii\widgets\Breadcrumbs;
// категория организаций
$this->params['breadcrumbs'][] = ['label' => $models->subCategory->categories->name, 'url'=> '/companies/'.$models->subCategory->categories->alias];
// подкатегория организаций
$this->params['breadcrumbs'][] = ['label' => $models->subCategory->name, 'url'=> '/companies/'.$models->subCategory->categories->alias.'/'.$models->idCompCategory->alias];
// название организации
$this->params['breadcrumbs'][] = $models->title; 

// Вывод виджета
echo Breadcrumbs::widget(['links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],]);
```

![](http://www.webapplex.ru/blog/04092015/company.png)