Как на сегодня написано в [ОФИЦИАЛЬНОЙ РЕПЕ](https://github.com/raboof/nethogs), NetHogs - это небольшая утилита а'ля "net top", удобен для мониторинга трафика по процессам (видно PID процесса, пользователя, программу, количество отправляемых / получаемых пакетов), эта утилита не зависит от загружаемых модулей ядра, все работает "из коробки", помогает быстро определить какая программа "жрет" трафик.

### Установка NetHogs

Ставится из стандартных реп в RPM / DEB дистрах (`apt` / `yum` / `dnf` и даже `brew` соответственно):

dnf install nethogs

### Запуск NetHogs

Запускается в терминале:

nethogs

Где сразу все видно и понятно:

![nethogs 1](https://www.sys-adm.in/images/MyArticles/nix/nethogs/nethogs-1.jpg)

Параметрами запуска можно манипулировать, можно указать конкретный сетевой (или сетевые) интерфейс(ы):

nethogs enp0s3

По умолчанию интервал мониторинга составляет 1 секунду, при необходимости этот интервал можно изменить, допустим на интервал в 3 секунды:

nethogs -d 3

Можно указать в каких единицах отображать получаемые / отправляемые пакеты, например в мегабайтах:

nethogs -v 3

После запуска, можно сортировать отображение по получаемому / отправляемому трафику используя клавиши:

 s: sort by SENT traffic
 r: sort by RECEIVE traffic

Собственно все есть в хелпе, который достаточно лаконичен и прост:

-V : prints version.
-h : prints this help.
-b : bughunt mode - implies tracemode.
-d : delay for update refresh rate in seconds. default is 1.
-v : view mode (0 = KB/s, 1 = total KB, 2 = total B, 3 = total MB). default is 0.
-c : number of updates. default is 0 (unlimited).
-t : tracemode.
-p : sniff in promiscious mode (not recommended).
-s : sort output by sent column.
-a : monitor all devices, even loopback/stopped ones.

Команды, если уже nethog запущен:

When nethogs is running, press:
 q: quit
 s: sort by SENT traffic
 r: sort by RECEIVE traffic
 m: switch between total (KB, B, MB) and KB/s mode

-   [](https://www.sys-adm.in/systadm/nix/841-linux-kak-posmotret-istoriyu-logonov-na-server.html)