`tcpdump` - это утилита командной строки, которая позволяет захватывать и анализировать сетевой трафик в реальном времени. Она доступна на большинстве дистрибутивов Linux и может быть использована для отладки сетевых проблем, анализа протоколов и многого другого.

Основная команда для запуска `tcpdump` выглядит следующим образом:

`tcpdump [опции] [фильтр]`

Опции позволяют настроить параметры захвата, такие как интерфейс, формат вывода и т.д. Фильтр позволяет настроить условия захвата, такие как IP-адрес и порт.

Некоторые наиболее часто используемые опции `tcpdump`:

-   `-i`: выбор интерфейса для захвата трафика
-   `-n`: отображение IP-адресов в числовом формате
-   `-v`: отображение более подробной информации о пакетах
-   `-c`: ограничение количества пакетов, которые будут захвачены

Пример использования `tcpdump` для захвата трафика на интерфейсе `eth0` с фильтром по IP-адресу `192.168.1.1`:

`sudo tcpdump -i eth0 host 192.168.1.1`

`tcpdump` может быть сложной утилитой для новичков, но она предоставляет мощные возможности для анализа сетевого трафика и отладки сетевых проблем.