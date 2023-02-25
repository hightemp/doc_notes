https://github.com/svinota/pyroute2

Pyroute2 — это чистая библиотека **сетевых ссылок** Python . Для ядра требуется только стандартная библиотека Python, никаких сторонних библиотек. Библиотека была запущена как реализация протокола RTNL, поэтому имя — **pyroute2** , но теперь она поддерживает множество протоколов netlink. Некоторые поддерживаемые семейства и протоколы netlink:

-   **rtnl** , сетевые настройки --- адреса, маршруты, управление трафиком
-   **nfnetlink** --- API сетевого фильтра
-   **ipq** --- простейшая фильтрация пакетов пользовательского пространства, цель iptables QUEUE
-   **devlink** --- управление и мониторинг оборудования с поддержкой devlink
-   **generic** --- общие семейства netlink
-   **uevent** --- те же сообщения uevent, что и в udev

API сетевого фильтра:

-   **ipset** --- наборы IP
-   **nftables** --- фильтрация пакетов
-   **nfct** --- отслеживание соединения

Общая сетевая ссылка:

-   **ethtool** --- низкоуровневая настройка сетевого интерфейса
-   **wireguard** --- настройка VPN
-   **nl80211** --- API беспроводных функций (базовая поддержка)
-   **taskstats** --- расширенная статистика процесса
-   **acpi_events** --- мониторинг событий ACPI
-   **Thermal_events** --- мониторинг тепловых событий
-   **VFS_DQUOT** --- мониторинг событий дисковой квоты

На низком уровне библиотека предоставляет объекты сокетов с расширенным API. Дополнительный функционал направлен на:

-   Помогите открыть/привязать сокеты netlink
-   Откройте для себя общие протоколы netlink и группы многоадресной рассылки
-   Создание, кодирование и декодирование сообщений netlink и PF_ROUTE.

## Поддерживаемые системы

Pyroute2 изначально работает в Linux и эмулирует некоторое ограниченное подмножество RTNL netlink API в системах BSD поверх уведомлений PF_ROUTE и стандартных системных инструментов.

Другие платформы не поддерживаются.

## [](https://github.com/svinota/pyroute2#ndb----high-level-rtnl-api)NDB -- высокоуровневый API RTNL

Ключевая особенность:

-   Целостность данных
-   Транзакции с фиксацией/откатом изменений
-   Синхронизация состояний
-   Несколько источников, включая netns и удаленные системы

Пример "Привет, мир":

```python
from pyroute2 import NDB

with NDB() as ndb:
    with ndb.interfaces['eth0'] as eth0
        # set one parameter
        eth0.set(state='down')
        eth0.commit()  # make sure that the interface is down
        # or multiple parameters at once
        eth0.set(ifname='hello_world!', state='up')
        eth0.commit()  # rename, bring up and wait for success
    # --> <-- here you can be sure that the interface is up & renamed
```

Еще примеры:


```python
from pyroute2 import NDB

ndb = NDB(log='debug')

for record in ndb.interfaces.summary():
    print(record.ifname, record.address, record.state)

if_dump = ndb.interfaces.dump()
if_dump.select_records(state='up')
if_dump.select_fields('index', 'ifname', 'kind')
for line in if_dump.format('json'):
    print(line)

addr_summary = nsb.addresses.summary()
addr_summary.select_records(ifname='eth0')
for line in addr_summary.format('csv'):
    print(line)

with ndb.interfaces.create(ifname='br0', kind='bridge') as br0:
    br0.add_port('eth0')
    br0.add_port('eth1')
    br0.add_ip('10.0.0.1/24')
    br0.add_ip('192.168.0.1/24')
    br0.set(
        br_stp_state=1,  # set STP on
        br_group_fwd_mask=0x4000,  # set LLDP forwarding
        state='up',  # bring the interface up
    )
# --> <-- commit() will be run by the context manager

# operate on netns:
ndb.sources.add(netns='testns')  # connect to a namespace

with (
    ndb.interfaces.create(
        ifname='veth0',  # create veth
        kind='veth',
        peer={
            'ifname': 'eth0',  # setup peer
            'net_ns_fd': 'testns',  # in a namespace
        },
        state='up',
    )
) as veth0:
    veth0.add_ip(address='172.16.230.1', prefixlen=24)

with ndb.interfaces.wait(
    target='testns', ifname='eth0'
) as peer:  # wait for the peer
    peer.set(state='up')  # bring it up
    peer.add_ip('172.16.230.2/24')  # add address
```


## [](https://github.com/svinota/pyroute2#iproute----low-level-rtnl-api)IPRoute -- низкоуровневый RTNL API

Низкоуровневая утилита **IPRoute** --- конфигурация сети Linux. Класс IPRoute представляет собой сопоставление RTNL 1-к-1 **.** Нет неявного поиска интерфейса и так далее.

Получайте уведомления об изменении сетевых настроек с помощью IPRoute:

```python
from pyroute2 import IPRoute
with IPRoute() as ipr:
    # With IPRoute objects you have to call bind() manually
    ipr.bind()
    for message in ipr.get():
        print(message)
```
Еще примеры:

```python
from socket import AF_INET
from pyroute2 import IPRoute

# get access to the netlink socket
ipr = IPRoute()
# no monitoring here -- thus no bind()

# print interfaces
for link in ipr.get_links():
    print(link)

# create VETH pair and move v0p1 to netns 'test'
ipr.link('add', ifname='v0p0', peer='v0p1', kind='veth')
# wait for the devices:
peer, veth = ipr.poll(
    ipr.link, 'dump', timeout=5, ifname=lambda x: x in ('v0p0', 'v0p1')
)
ipr.link('set', index=peer['index'], net_ns_fd='test')

# bring v0p0 up and add an address
ipr.link('set', index=veth['index'], state='up')
ipr.addr('add', index=veth['index'], address='10.0.0.1', prefixlen=24)

# release Netlink socket
ip.close()
```

## [](https://github.com/svinota/pyroute2#network-namespace-examples)Примеры сетевых пространств имен

Манипуляции с сетевым пространством имен:

```
from pyroute2 import netns
# create netns
netns.create('test')
# list
print(netns.listnetns())
# remove netns
netns.remove('test')
```

Создайте пару интерфейсов **veth** и перейдите к **netns** :

```
from pyroute2 import IPRoute

with IPRoute() as ipr:

    # create interface pair
    ipr.link('add', ifname='v0p0', kind='veth',  peer='v0p1')

    # wait for the peer
    (peer,) = ipr.poll(ipr.link, 'dump', timeout=5, ifname='v0p1')

    # move the peer to the 'test' netns:
    ipr.link('set', index=peer['index'], net_ns_fd='test')
```

Список интерфейсов в некоторых **netns** :

```
from pyroute2 import NetNS
from pprint import pprint

ns = NetNS('test')
pprint(ns.get_links())
ns.close()
```

Подробнее и примеры смотрите в документации.

## [](https://github.com/svinota/pyroute2#installation)Монтаж

Использование pip:

```
pip install pyroute2
```

Использование git:

```
pip install git+https://github.com/svinota/pyroute2.git
```

Использование источника требует make и nox

```
git clone https://github.com/svinota/pyroute2.git
cd pyroute2
make install
```

## [](https://github.com/svinota/pyroute2#requirements)Требования

Питон >= 3.6

## [](https://github.com/svinota/pyroute2#links)Ссылки

-   домашняя страница: [https://pyroute2.org/](https://pyroute2.org/)
-   источник: [https://github.com/svinota/pyroute2](https://github.com/svinota/pyroute2)
-   ошибки: [https://github.com/svinota/pyroute2/issues](https://github.com/svinota/pyroute2/issues)
-   Пипи: [https://pypi.python.org/pypi/pyroute2](https://pypi.python.org/pypi/pyroute2)
-   документы: [http://docs.pyroute2.org/](http://docs.pyroute2.org/)