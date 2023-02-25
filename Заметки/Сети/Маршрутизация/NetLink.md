**Netlink** — это семейство [сокетов](https://en.wikipedia.org/wiki/Network_socket "Сетевой разъем") , используемое для [межпроцессного взаимодействия](https://en.wikipedia.org/wiki/Inter-process_communication "Межпроцессного взаимодействия") (IPC) между процессами ядра и [пользовательского пространства](https://en.wikipedia.org/wiki/Userspace "Пользовательское пространство") , а также между различными процессами пользовательского пространства, аналогично [сокетам домена Unix](https://en.wikipedia.org/wiki/Unix_domain_socket "Сокет домена Unix") , доступным в некоторых Unix-подобных [операционных системах](https://en.wikipedia.org/wiki/Operating_system "Операционная система") , включая его исходное воплощение. как [интерфейс ядра Linux](https://en.wikipedia.org/wiki/Linux_kernel_interface "Интерфейс ядра Linux") , а также в виде более поздней реализации на [FreeBSD](https://en.wikipedia.org/wiki/FreeBSD "FreeBSD") . [[3]](https://en.wikipedia.org/wiki/Netlink#cite_note-freebsd-3) Подобно [сокетам домена Unix](https://en.wikipedia.org/wiki/Unix_domain_sockets "Сокеты домена Unix") и в отличие от [сокетов INET](https://en.wikipedia.org/wiki/Network_socket "Сетевой разъем") , связь Netlink не может пересекать границы хоста. Однако, хотя сокеты домена Unix используют [файловую систему](https://en.wikipedia.org/wiki/File_system "Файловая система")namespace, сокеты Netlink обычно адресуются [идентификаторами процессов](https://en.wikipedia.org/wiki/Process_identifier "Идентификатор процесса") (PID). [[4]](https://en.wikipedia.org/wiki/Netlink#cite_note-4)

Netlink разработан и используется для передачи различной сетевой информации между процессами [пространства ядра](https://en.wikipedia.org/wiki/Kernel_space "Пространство ядра") и пространства пользователя. Сетевые утилиты, такие как семейство [iproute2](https://en.wikipedia.org/wiki/Iproute2 "Iproute2") и утилиты, используемые для настройки беспроводных драйверов на базе [mac80211](https://en.wikipedia.org/wiki/Mac80211 "Mac80211") , используют Netlink для связи с [ядром Linux](https://en.wikipedia.org/wiki/Linux_kernel "ядро Linux") из пользовательского пространства. Netlink предоставляет стандартный интерфейс на основе [сокетов](https://en.wikipedia.org/wiki/Internet_socket "Интернет-розетка") для процессов пользовательского пространства и [API](https://en.wikipedia.org/wiki/Application_programming_interface "Интерфейс прикладного программирования") на стороне ядра для внутреннего использования [модулями ядра](https://en.wikipedia.org/wiki/Kernel_module "Модуль ядра") . Первоначально Netlink использовал `AF_NETLINK`семейство сокетов.

Netlink разработан как более гибкий преемник [ioctl](https://en.wikipedia.org/wiki/Ioctl "Октл") ; [RFC 3549](https://tools.ietf.org/html/rfc3549) подробно описывает протокол.

## История

Netlink был создан Алексеем Кузнецовым [[5]](https://en.wikipedia.org/wiki/Netlink#cite_note-5) как более гибкая альтернатива сложному, но неудобному [`ioctl`](https://en.wikipedia.org/wiki/Ioctl "Октл")методу связи, используемому для установки и получения параметров внешнего сокета. Ядро Linux продолжает поддерживать `ioctl`обратную совместимость.

Netlink впервые появился в ядре Linux версии 2.0 и реализован как [символьное устройство](https://en.wikipedia.org/wiki/Character_device "Устройство персонажа") . К 2013 году этот интерфейс устарел, но по-прежнему представляет собой метод связи [ioctl ;](https://en.wikipedia.org/wiki/Ioctl "Октл") сравните использование `rtnetlink`. [[6]](https://en.wikipedia.org/wiki/Netlink#cite_note-6) Интерфейс сокета Netlink появился в ядре Linux версии 2.2.

В 2022 году во FreeBSD была добавлена ​​экспериментальная поддержка протокола Netlink. Первоначально поддерживается только подмножество семейства NETLINK_ROUTE и NETLINK_GENERIC. [[3]](https://en.wikipedia.org/wiki/Netlink#cite_note-freebsd-3)

В отличие от [сокетов BSD](https://en.wikipedia.org/wiki/Berkeley_sockets "Сокеты Беркли") , использующих интернет-протоколы, такие как [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol "Протокол управления передачей") , где заголовки сообщений генерируются автоматически, заголовок сообщения Netlink (доступный как `struct nlmsghdr`) должен быть подготовлен вызывающей стороной. Сокет Netlink обычно работает в `SOCK_RAW`режиме -like, даже если `SOCK_DGRAM`он использовался для его создания.

Затем часть данных содержит специфичное для подсистемы сообщение, которое может быть дополнительно вложено.

## Семейства сокетов Netlink 

Семейство `AF_NETLINK`предлагает несколько подмножеств протоколов. Каждый из них взаимодействует с другим компонентом ядра и имеет разное подмножество обмена сообщениями. На подмножество ссылается поле протокола в вызове сокета:

сокет int (AF_NETLINK, SOCK_DGRAM _или_ SOCK_RAW, _протокол_ )

Отсутствует стандарт, `SOCK_DGRAM`и `SOCK_RAW`не гарантируется их реализация в данной версии Linux (или другой ОС). В некоторых источниках утверждается, что оба параметра допустимы, а в приведенной ниже ссылке от [Red Hat](https://en.wikipedia.org/wiki/Red_Hat "Красная Шапка") указано, что этот `SOCK_RAW`параметр всегда является параметром. Однако iproute2 использует оба взаимозаменяемо.

## Протоколы Netlink 

Ниже приводится неисчерпывающий список поддерживаемых записей _протокола_ :

NETLINK_ROUTE

`NETLINK_ROUTE`предоставляет информацию о маршрутизации и связи. Эта информация используется главным образом для демонов маршрутизации в пользовательском пространстве. [Linux](https://en.wikipedia.org/wiki/Linux "линукс") реализует большое подмножество сообщений:

-   Ссылочный уровень: _RTM_NEWLINK_ , _RTM_DELLINK_ , _RTM_GETLINK_ , _RTM_SETLINK_
-   Настройки адреса: _RTM_NEWADDR_ , _RTM_DELADDR_ , _RTM_GETADDR._
-   Таблицы маршрутизации: _RTM_NEWROUTE_ , _RTM_DELROUTE_ , _RTM_GETROUTE_
-   Кэш соседей: _RTM_NEWNEIGH_ , _RTM_DELNEIGH_ , _RTM_GETNEIGH_
-   Правила маршрутизации: _RTM_NEWRULE_ , _RTM_DELRULE_ , _RTM_GETRULE._
-   Настройки дисциплины очереди: _RTM_NEWQDISC_ , _RTM_DELQDISC_ , _RTM_GETQDISC_
-   Классы трафика, используемые с очередями: _RTM_NEWTCLASS_ , _RTM_DELTCLASS_ , _RTM_GETTCLASS._
-   Фильтры трафика: _RTM_NEWTFILTER_ , _RTM_DELTFILTER_ , _RTM_GETTFILTER._
-   Другие: _RTM_NEWACTION_ , _RTM_DELACTION_ , _RTM_GETACTION_ , _RTM_NEWPREFIX_ , _RTM_GETPREFIX_ , _RTM_GETMULTICAST_ , _RTM_GETANYCAST_ , _RTM_NEWNEIGHTBL_ , _RTM_GETNEIGHTBL_ , _RTM_SETNEIGHTBL_

NETLINK_брандмауэр

`NETLINK_FIREWALL`предоставляет интерфейс для приложения пользовательского пространства для получения пакетов от [брандмауэра](https://en.wikipedia.org/wiki/Firewall_(computing) "Брандмауэр (вычислительный)") .

NETLINK_NFLOG

`NETLINK_NFLOG`предоставляет интерфейс, используемый для связи между [Netfilter](https://en.wikipedia.org/wiki/Netfilter "Сетевой фильтр") и [iptables](https://en.wikipedia.org/wiki/Iptables "Iptables") .

NETLINK_ARPD

`NETLINK_ARPD`предоставляет интерфейс для управления таблицей [ARP](https://en.wikipedia.org/wiki/Address_Resolution_Protocol "Протокол разрешения адресов") из пользовательского пространства.

NETLINK_AUDIT

`NETLINK_AUDIT`предоставляет интерфейс для подсистемы аудита, присутствующей в ядрах Linux версии 2.6.6 и более поздних.

NETLINK_IP6_FW

`NETLINK_IP6_FW`предоставляет интерфейс для передачи пакетов из сетевого фильтра в пользовательское пространство.

NETLINK_ROUTE6

NETLINK_TAPBASE

NETLINK_NETФИЛЬТР

NETLINK_TCPDIAG

NETLINK_XFRM

`NETLINK_XFRM`предоставляет интерфейс для управления [ассоциацией безопасности](https://en.wikipedia.org/wiki/Security_association "Ассоциация безопасности") [IPsec](https://en.wikipedia.org/wiki/IPsec "IPsec") и базами данных политик безопасности, которые в основном используются демонами диспетчера ключей, использующими протокол [Internet Key Exchange](https://en.wikipedia.org/wiki/Internet_Key_Exchange "Обмен ключами через Интернет") .[](https://en.wikipedia.org/wiki/Security_association "Ассоциация безопасности")[](https://en.wikipedia.org/wiki/Internet_Key_Exchange "Обмен ключами через Интернет")

NETLINK_KOBJECT_UEVENT

`NETLINK_KOBJECT_UEVENT`предоставляет интерфейс, в котором ядро ​​​​транслирует события uevent, обычно используемые [udev](https://en.wikipedia.org/wiki/Udev "Удев") .

NETLINK_GENERIC

Одним из недостатков протокола Netlink является то, что количество семейств протоколов ограничено 32 ( `MAX_LINKS`). Это одна из основных причин создания универсального семейства Netlink — обеспечить поддержку добавления большего числа семейств. Он действует как мультиплексор Netlink и работает с одним семейством Netlink `NETLINK_GENERIC`. Общий протокол Netlink основан на протоколе Netlink и использует его API.

### Определяемый пользователем протокол Netlink 

Пользователи могут добавить обработчик Netlink в свои собственные подпрограммы ядра. Это позволяет разрабатывать дополнительные протоколы Netlink для работы с новыми модулями ядра. [[7]](https://en.wikipedia.org/wiki/Netlink#cite_note-7)

## Смотрите также

-   [![икона](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/24px-Octicons-terminal.svg.png)](https://en.wikipedia.org/wiki/File:Octicons-terminal.svg)[Портал компьютерного программирования](https://en.wikipedia.org/wiki/Portal:Computer_programming "Портал:Компьютерное программирование")
-   ![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Free_and_open-source_software_logo_%282009%29.svg/28px-Free_and_open-source_software_logo_%282009%29.svg.png)[Портал бесплатного программного обеспечения с открытым исходным кодом](https://en.wikipedia.org/wiki/Portal:Free_and_open-source_software "Портал: Бесплатное программное обеспечение с открытым исходным кодом")
-   [![икона](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/NewTux.svg/23px-NewTux.svg.png)](https://en.wikipedia.org/wiki/File:NewTux.svg)[Портал Linux](https://en.wikipedia.org/wiki/Portal:Linux "Портал:Линукс")

-   [Сравнение беспроводных драйверов с открытым исходным кодом](https://en.wikipedia.org/wiki/Comparison_of_open-source_wireless_drivers "Сравнение беспроводных драйверов с открытым исходным кодом") — драйверы на базе [mac80211](https://web.archive.org/web/20150117035401/http://wireless.kernel.org/en/developers/Documentation/mac80211/) полагаются на Netlink в качестве API для пользовательского пространства.
-   [POSIX](https://en.wikipedia.org/wiki/POSIX "POSIX")

## Ссылки

1.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-wikidata-7227bdbc312cdff3d351069061809462e7b230ef-v3_1-0 "Подпрыгнуть")** [«Линукс 6.2»](https://lkml.org/lkml/2023/2/19/309) . 19 февраля 2023 г. . Проверено 19 февраля 2023 г.
2.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-wikidata-578abdbfe81e1cfdaf93ef4f2ecbe028d9bce9cc-v3_2-0 "Подпрыгнуть")** [https://lore.kernel.org/lkml/CAHk-=wjB5XBk4obhMPfrU3mnOakV9VgHAYOo-ZGJnB2X0DnBWA@mail.gmail.com/](https://lore.kernel.org/lkml/CAHk-=wjB5XBk4obhMPfrU3mnOakV9VgHAYOo-ZGJnB2X0DnBWA@mail.gmail.com/) .
3.  ^[Перейти к:_**a**_](https://en.wikipedia.org/wiki/Netlink#cite_ref-freebsd_3-0) [_**b**_](https://en.wikipedia.org/wiki/Netlink#cite_ref-freebsd_3-1) ["netlink: добавить поддержку netlink"](https://cgit.freebsd.org/src/commit/?id=7e5bf68495cc0a8c9793a338a8a02009a7f6dbb6).[](https://cgit.freebsd.org/src/commit/?id=7e5bf68495cc0a8c9793a338a8a02009a7f6dbb6)
4.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-4 "Подпрыгнуть")** [«netlink (7) - страница руководства Linux»](https://man7.org/linux/man-pages/man7/netlink.7.html) . _man7.org_ .[](https://man7.org/linux/man-pages/man7/netlink.7.html)
5.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-5 "Подпрыгнуть")** ["kernel/git/torvalds/linux.git: root/net/core/rtnetlink.c"](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/net/core/rtnetlink.c) . _Дерево исходников ядра Linux_ . [ядро.org](https://en.wikipedia.org/wiki/Kernel.org "Kernel.org") . Проверено 27 мая 2014 г. .[](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/net/core/rtnetlink.c)[](https://en.wikipedia.org/wiki/Kernel.org "Kernel.org")
6.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-6 "Подпрыгнуть")** [Кроукрофт, Джон](https://en.wikipedia.org/wiki/Jon_Crowcroft "Jon Crowcroft") ; Филлипс, Иэн, ред. (2002). [_Реализация протокола TCP/IP и Linux: системный код для Linux Internet_](https://books.google.com/books?id=qOdSAAAAMAAJ) . Серия Wiley Networking Council. [Уайли](https://en.wikipedia.org/wiki/John_Wiley_%26_Sons "John Wiley & Sons") . п. 624. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier) "ISBN (identifier)") [](https://en.wikipedia.org/wiki/Jon_Crowcroft "Джон Кроукрофт")[](https://books.google.com/books?id=qOdSAAAAMAAJ)[](https://en.wikipedia.org/wiki/John_Wiley_%26_Sons "Джон Уайли и сыновья")[](https://en.wikipedia.org/wiki/ISBN_(identifier) "ISBN (идентификатор)") [9780471408826](https://en.wikipedia.org/wiki/Special:BookSources/9780471408826 "Специальный:BookSources/9780471408826"). Проверено 21 мая 2013 г. . Все сообщения rtnetlink состоят из заголовка сообщения netlink и добавленных атрибутов.
7.  **[^](https://en.wikipedia.org/wiki/Netlink#cite_ref-7 "Подпрыгнуть")** [«Kernel Korner - Почему и как использовать сокет Netlink | Linux Journal»](https://www.linuxjournal.com/article/7356) . _www.linuxjournal.com_ .[](https://www.linuxjournal.com/article/7356)

## Внешние ссылки 

-   [Пабло Нейра Аюсо, Рафаэль М. Гаска, Лоран Лефевр. Связь между ядром и пользовательским пространством в Linux с использованием сокетов Netlink. Программное обеспечение: практика и опыт, 40(9):797-810, август 2010 г.](https://web.archive.org/web/20110902031641/http://1984.lsi.us.es/~pablo/docs/spae.pdf)
-   [Зачем и как использовать сокеты Netlink](https://www.linuxjournal.com/article/7356)
-   [RFC 3549](https://www.ietf.org/rfc/rfc3549.txt)
-   [Домашняя страница проекта netfilter/iptables — проект netfilter.org «libmnl»](https://netfilter.org/projects/libmnl/) — минималистская библиотека для Netlink — библиотека пользовательского пространства для построения и анализа сообщений Netlink
-   [libnl — Netlink Protocol Library Suite](https://www.infradead.org/~tgr/libnl) — Netlink Protocol Library Suite — полнофункциональная библиотека, охватывающая практически все аспекты работы с сокетами Netlink
-   [Управление сетевой средой с помощью RTNETLINK](https://www.linuxjournal.com/article/8498)
-   [Сокеты Netlink — обзор](https://web.archive.org/web/20170428010447/https://qos.ittc.ku.edu/netlink/html/index.html)
-   [Набор библиотек протоколов Netlink](http://www.carisma.slowglass.com/~tgr/libnl/)
-   [«Linux Kernel Networking», Рами Розен, Apress 2013: Chapter 2, Netlink Sockets](https://www.apress.com/gp/book/9781430261964)