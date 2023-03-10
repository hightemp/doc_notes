https://www.ylsoftware.com/news/727

Протокол SSH будучи достаточно функционален сам по себе часто становится основой других решений. Одно из таких решение это [sshuttle](https://github.com/sshuttle/sshuttle) - простой VPN сервис, ограничения которого компенсируются простотой в использовании. Если у вас есть SSH-аккаунт на каком либо сервере с возможностью запуска python то вы уже можете использовать этот сервер в качестве VPN-сервера.

### Установка

Установить sshuttle в Ubuntu 18.04 можно командой:

```
apt install sshuttle
```

### Возможности и ограничения

Важно понимать что всё-таки sshuttle это не полноценный VPN. В самом простом случае в туннель "заворачивается" только TCP-трафик. После некоторых манипуляций можно "завернуть" ещё и UDP, но всё остальные протоколы всё равно "пойдут" через ваше основное соединение. Поэтому sshuttle пригоден для доступа в закрытую сеть с целью администрирования, но никак не подходит для сокрытия оригинального IP-адреса.

### Базовое использование

Типовая команда запуска sshuttle выглядит примерно так:

```
sshuttle --remote=user@some.host 192.168.200.0/24
```

Здесь параметры означают следующее:

-   **--remote=user@some.host**: подключаемся к серверу "some.host" с логином "user".
-   **192.168.200.0/24**: подсеть, трафик на которую мы завернём в наш туннель.

Подключившись таким образом к офисному шлюзу можно свободно подключаться к компьютерам в офисной локальной сети по SSH или RDP. Важно: для того чтобы всё прошло успешно нужно запускать sshuttle от имени суперпользователя или иметь настроенный sudo, который необходим sshuttle для внесения изменений в файрволл.

В ряде случаев может возникнуть потребность пустить весь TCP-трафик через туннель. В этом случае недостаточно указать в качестве подсети "0.0.0.0/0", но ещё и необходимо с помощью опции --exclude сохранить нетронутым машрут до сервера. В итоге команда запуска будет выглядеть примерно так:

```
sshuttle --exclude=some.host --remote=user@some.host 0.0.0.0/0
```

Если вы не доверяете DNS-серверам своего провайдера то можете настроить перехват DNS-трафика с помощью опции **--dns**. А если вы хотите видеть подробную информацию о работе сервиса то вам поможет опция **--verbose**.

![Запуск sshuttle в терминале KDE](https://www.ylsoftware.com/images/2018/10/sshuttle.jpg "Запуск sshuttle в терминале KDE")

### Дополнительно

Если кроме протокола TCP необходимо перенаправить ещё и UDP или есть потребность в поддержке IPv6 то понадобится некоторая подготовка. Надо создать новую таблицу маршрутизации и "завернуть" в неё трафик, который будет промаркирован с помощью sshuttle. Для этого последовательно от имени суперпользователя надо выполнить команды:

```
# Новая таблица для IPv4
ip route add local default dev lo table 100

# Заворачиваем маркированный IPv4-трафик с меткой 1
ip rule add fwmark 1 lookup 100

# Новая таблица для IPv6
ip -6 route add local default dev lo table 100

# Заворачиваем маркированный IPv6-трафик с меткой 1
ip -6 rule add fwmark 1 lookup 100
```

После этого надо запустить sshuttle с опцией --method=tproxy. В этом режиме запуск возможен только от имени суперпользователя. Итоговая команда будет выглядеть примерно так:

```
sudo sshuttle --exclude=some.host --remote=user@some.host --dns --method=tproxy 0.0.0.0/0
```

### Заключение

Sshuttle хотя и не является полноценным VPN, однако способен в ряде случаев его заменить. А благодаря [подробной документации](https://sshuttle.readthedocs.io/) с ним справится даже начинающий пользователь. Из минусов можно отметить отсутствие возможности привычным способом управлять сетевыми маршрутами.