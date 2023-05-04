## что такое EntityManager в Doctrine

EntityManager в Doctrine - это основной класс, который управляет жизненным циклом объектов и взаимодействием с базой данных через ORM (Object-Relational Mapping). Он предоставляет методы для выполнения операций CRUD (create, read, update, delete) с объектами, а также для управления транзакциями.

EntityManager отвечает за выполнение следующих функций:

- Создание, загрузка, изменение и удаление объектов.
- Отслеживание изменений объектов и сохранение их в базе данных.
- Управление связями между объектами.
- Контроль транзакций.

EntityManager получает информацию о сущностях и их свойствах из метаданных, которые определены в аннотациях или конфигурационных файлах. Он также отвечает за создание объектов QueryBuilder для выполнения сложных запросов к базе данных.

Пример использования EntityManager для сохранения нового объекта в базе данных:

```php
use Doctrine\ORM\EntityManager;
use MyApp\Entity\User;

// Получение EntityManager из контейнера зависимостей
$entityManager = $container->get(EntityManager::class);

// Создание нового объекта User
$user = new User();
$user->setName('John Doe');
$user->setEmail('john.doe@example.com');

// Добавление объекта в EntityManager
$entityManager->persist($user);

// Сохранение изменений в базе данных
$entityManager->flush();
```

В этом примере мы создаем новый объект User и добавляем его в EntityManager с помощью метода persist(). Затем мы сохраняем изменения в базе данных с помощью метода flush(). Если во время сохранения происходит ошибка, то EntityManager откатывает транзакцию и выбрасывает исключение.

## Опиши все процессы CRUD в Doctrine

Doctrine предоставляет инструменты для выполнения CRUD операций (Create, Read, Update, Delete) с помощью ORM (Object-Relational Mapping). Вот как эти операции выглядят в Doctrine:

## Create (Создание)

Создание нового объекта в Doctrine выполняется с помощью конструктора класса сущности. Затем, используя EntityManager, мы добавляем объект в контекст персистентности и сохраняем его в базе данных с помощью метода flush().

```php
use MyApp\Entity\User;

$user = new User();
$user->setName('John Doe');
$user->setEmail('john.doe@example.com');

$entityManager->persist($user);
$entityManager->flush();
```


## Read (Чтение)

Чтение объектов в Doctrine выполняется с помощью методов find() и findBy() класса EntityManager, которые используют идентификатор объекта или критерии поиска, соответственно.

```php
use MyApp\Entity\User;

// Чтение объекта по идентификатору
$user = $entityManager->find(User::class, 1);

// Чтение объектов по критериям поиска
$users = $entityManager->getRepository(User::class)->findBy([
    'name' => 'John Doe',
]);
```


## Update (Обновление)

Обновление объекта в Doctrine выполняется путем изменения свойств объекта и сохранения изменений в базе данных с помощью метода flush().

```php
use MyApp\Entity\User;

$user = $entityManager->find(User::class, 1);
$user->setName('Jane Doe');
$entityManager->flush();
```


## Delete (Удаление)

Удаление объекта в Doctrine выполняется путем удаления объекта из контекста персистентности и сохранения изменений в базе данных с помощью метода flush().

```php
use MyApp\Entity\User;

$user = $entityManager->find(User::class, 1);
$entityManager->remove($user);
$entityManager->flush();
```


Это основные операции CRUD, которые могут использоваться с ORM Doctrine. При использовании ORM все операции с базой данных выполняются через EntityManager и объекты сущностей.