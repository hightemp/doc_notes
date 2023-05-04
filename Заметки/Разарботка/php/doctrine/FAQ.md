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

## Опиши создание модели на Doctrine

Для создания модели на Doctrine необходимо выполнить несколько шагов:

1. Определить сущность - это класс, который представляет таблицу в базе данных. Его поля соответствуют столбцам таблицы, а методы - операциям, которые можно производить над записями таблицы.

```php
<?php
// src/Entity/Product.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 */
class Product
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     */
    private $price;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }
}
```


2. Задать маппинг - это процесс связывания сущности с таблицей в базе данных. Маппинг выполняется с помощью аннотаций, которые указывают на соответствие между полями сущности и столбцами таблицы.

3. Создать репозиторий - это класс, который предоставляет методы для выполнения запросов к базе данных. Репозиторий может быть создан вручную или автоматически с помощью Doctrine.

```php
<?php
// src/Repository/ProductRepository.php
namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }
}
```


4. Создать сервис - это класс, который предоставляет доступ к репозиторию и другим зависимостям, связанным с моделью. Сервис может быть создан вручную или автоматически с помощью Symfony.

```php
# config/services.yaml
services:
    App\Service\ProductService:
        arguments: ['@doctrine.orm.entity_manager']


<?php
// src/Service/ProductService.php
namespace App\Service;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;

class ProductService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createProduct($name, $price)
    {
        $product = new Product();
        $product->setName($name);
        $product->setPrice($price);

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    public function getProduct($id)
    {
        return $this->entityManager->getRepository(Product::class)->find($id);
    }

    public function updateProduct($id, $name, $price)
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw $this->createNotFoundException('No product found for id '.$id);
        }

        $product->setName($name);
        $product->setPrice($price);

        $this->entityManager->flush();

        return $product;
    }

    public function deleteProduct($id)
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw $this->createNotFoundException('No product found for id '.$id);
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();
    }
}
```
 

Теперь вы можете использовать созданную модель для выполнения операций с базой данных.

