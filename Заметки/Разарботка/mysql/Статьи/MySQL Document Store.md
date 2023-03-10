https://www.mysql.com/products/enterprise/document_store.html
# Магазин документов MySQL

MySQL Document Store позволяет разработчикам работать с реляционными таблицами SQL и коллекциями JSON без схемы. Чтобы сделать это возможным, MySQL создал X Dev API, который уделяет большое внимание CRUD, предоставляя гибкий API, позволяющий вам работать с документами JSON естественным образом. X-протокол обладает широкими возможностями расширения и оптимизирован как для CRUD, так и для операций SQL API.

## NoSQL + SQL = MySQL

Хранилище документов MySQL предоставляет пользователям максимальную гибкость при разработке традиционных реляционных приложений SQL и приложений базы данных документов без схемы NoSQL. Это устраняет необходимость в отдельной базе данных документов NoSQL. Разработчики могут смешивать и сопоставлять реляционные данные и документы JSON в одной и той же базе данных и в одном приложении. Например, в одном и том же приложении можно запрашивать обе модели данных, а результаты могут быть в табличном, табличном или JSON-формате.

[![Магазин документов MySQL](https://www.mysql.com/common/images/enterprise/mysql_document_store_architecture.png)](https://www.mysql.com/common/images/enterprise/mysql_document_store_architecture.png)

Архитектура хранилища документов MySQL

## Высокая надежность, полная согласованность

Хранилище документов MySQL обеспечивает поддержку транзакций с несколькими документами и полное соответствие ACID для документов JSON без схемы. Используя InnoDB в качестве механизма хранения хранилища документов, вы получаете те же гарантии данных и преимущества в производительности, что и для реляционных данных. Это гарантирует пользователям надежность данных с полной согласованностью данных. Это также упрощает управление хранилищем документов MySQL.

## Высокая доступность

MySQL Document Store использует все преимущества MySQL Group Replication и InnoDB Cluster для масштабирования приложений и достижения высокой доступности. Документы реплицируются между всеми членами группы высокой доступности, а транзакции фиксируются синхронно между мастерами. Любой исходный сервер может заменить другой исходный сервер в случае сбоя одного из них без простоев.

## Онлайн-горячее резервное копирование

Так же, как Document Store использует Group Replication и InnoDB Cluster, он также прозрачно работает с MySQL Enterprise Backup. Пользователи могут выполнять полное, инкрементное и частичное резервное копирование документов. Все данные документа непротиворечивы на момент завершения резервного копирования. Пользователи также могут выполнять восстановление на момент времени, чтобы восстановить конкретную транзакцию с помощью бинарного журнала MySQL.

## Безопасность

MySQL и хранилище документов защищены по умолчанию. Кроме того, все расширенные функции безопасности MySQL Enterprise Edition, такие как прозрачное шифрование данных (TDE), аудит, расширенная аутентификация и брандмауэр, помогают максимально повысить безопасность.

## Отчетность и аналитика

MySQL Document Store обеспечивает простоту выполнения операций CRUD, а также возможности SQL для извлечения данных из документов JSON. Доступны мощь SQL и все популярные инструменты отчетности и аналитики.

## Легко использовать

MySQL Document Store предоставляет простые в использовании и плавные API-интерфейсы CRUD, поддерживаемые на многих языках, чтобы организации могли разрабатывать приложения на основе документов, используя выбранный ими язык.

## Архитектура

Архитектура хранилища документов MySQL состоит из следующих компонентов:

-   **Собственное хранилище документов JSON** . MySQL предоставляет собственный тип данных JSON, который эффективно хранится в двоичном формате с возможностью создания виртуальных столбцов, которые можно индексировать. Документы JSON автоматически проверяются.
-   **Подключаемый модуль X.** Подключаемый модуль X позволяет MySQL использовать протокол X и использовать соединители и оболочку для работы в качестве клиентов сервера.
-   **Протокол X. Протокол** X — это новый клиентский протокол, основанный на библиотеке Protobuf и работающий как для операций CRUD, так и для операций SQL.
-   **X DevAPI** — X DevAPI — это новый современный асинхронный API-интерфейс разработчика для операций CRUD и SQL поверх протокола X. Он представляет коллекции как новые объекты схемы. Документы хранятся в коллекциях и имеют свой выделенный набор операций CRUD.
-   **MySQL Shell** . MySQL Shell представляет собой интерактивный интерфейс Javascript, Python или SQL, поддерживающий разработку и администрирование сервера MySQL. Вы можете использовать MySQL Shell для выполнения запросов и обновлений данных, а также для различных операций администрирования.
-   **Соединители MySQL** . Следующие соединители MySQL поддерживают протокол X и позволяют использовать X DevAPI на выбранном вами языке.
    -   Соединитель MySQL/Node.js
    -   Соединитель MySQL/PHP
    -   Соединитель MySQL/Python
    -   Соединитель MySQL/J
    -   Соединитель MySQL/NET
    -   Соединитель MySQL/С++