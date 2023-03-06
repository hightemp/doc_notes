## я хочу сделать свой репозиторий docker образов как это сделать

Для создания своего репозитория Docker образов можно использовать Docker Registry. Это открытое программное обеспечение, которое позволяет создавать и хранить свои собственные Docker образы на локальном сервере или в облаке.

Вот как создать свой репозиторий Docker образов с помощью Docker Registry:

1. Установите Docker Registry на вашем сервере или в облаке. Вы можете использовать официальный образ Docker Registry из Docker Hub.

2. Запустите Docker Registry в контейнере Docker:

```
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

3. Создайте Docker образ, который вы хотите загрузить в свой репозиторий.

4. Пометьте свой Docker образ для загрузки в Docker Registry:

```
docker tag myimage localhost:5000/myimage
```
Здесь `myimage` - это название вашего образа.

5. Загрузите свой Docker образ в Docker Registry:

```
docker push localhost:5000/myimage
```

После этого, ваш Docker образ будет загружен в Docker Registry и будет доступен для загрузки на другие компьютеры. Чтобы загрузить образ, нужно использовать команду `docker pull`.

Примечание: Если вы хотите создать закрытый репозиторий Docker, то вам нужно будет настроить аутентификацию и авторизацию для Docker Registry.

## как клонировать образы из списка в свой docker репозиторий

Чтобы скопировать (клонировать) Docker образы из списка в свой Docker Registry, необходимо выполнить следующие действия:

1. Запустить локальный Docker Registry:

```
docker run -d -p 5000:5000 --name registry registry:2
```

2. Загрузить Docker образ из списка:

```
docker pull repository_name/image_name:tag
```

3. Пометить загруженный Docker образ для загрузки в локальный Docker Registry:

```
docker tag repository_name/image_name:tag localhost:5000/image_name:tag
```

4. Загрузить Docker образ в локальный Docker Registry:

```
docker push localhost:5000/image_name:tag
```

5. Проверить, что Docker образ успешно загружен в локальный Docker Registry:

```
curl http://localhost:5000/v2/_catalog
```

В ответе должен быть список доступных Docker образов в локальном Docker Registry.

Примечание: убедитесь, что у вас есть права на копирование Docker образов из указанного репозитория.

## напиши скрипт который делает это беря названия образов из файла images.txt

Вот пример скрипта на языке bash, который читает названия Docker образов из файла images.txt, клонирует их в локальный Docker Registry и удаляет их из локального хранилища:

```bash
#!/bin/bash

# Указываем путь к файлу со списком образов
IMAGES_FILE="images.txt"

# Указываем адрес локального Docker Registry
LOCAL_REGISTRY="localhost:5000"

# Проверяем, что Docker запущен и работает
if ! command -v docker &> /dev/null
then
    echo "Docker не установлен"
    exit
fi

# Проверяем, что локальный Docker Registry запущен и работает
if ! docker ps | grep -q "registry"; then
    echo "Локальный Docker Registry не запущен"
    exit
fi

# Читаем названия Docker образов из файла и клонируем их в локальный Docker Registry
while read image; do
    echo "Клонирую образ $image в локальный Docker Registry"
    docker pull $image
    docker tag $image $LOCAL_REGISTRY/$image
    docker push $LOCAL_REGISTRY/$image
    docker rmi $image
done < "$IMAGES_FILE"

echo "Готово"
```

Примечание: убедитесь, что у вас есть права на копирование Docker образов из указанного репозитория. Также не забудьте изменить адрес локального Docker Registry и путь к файлу со списком образов, если они отличаются от указанных в скрипте.

