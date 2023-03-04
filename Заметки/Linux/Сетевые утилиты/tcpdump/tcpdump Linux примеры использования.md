https://wiki.dieg.info/tcpdump
# tcpdump

Homepage:  [Official web site of tcpdump](http://www.tcpdump.org/ "http://www.tcpdump.org")

Утилита  **tcpdump**  относится к числу так называемых «снифферов» — программ предназначенных для перехвата сетевого трафика. Одним словом, tcpdump предназначен для подслушивания. Разрабо­тан Группой сетевых исследований (Network Reseach Group, NRG) Отдела инфор­мационных и вычислительных технологий (Information and Computing Sciences Division, ICSD) в Национальной лаборатории Лоренс Беркли (Lawrence Berkeley National Laboratory, LBNL).

tcpdump не единственный  [Сетевые анализаторы снифферы](https://wiki.dieg.info/sniffer "sniffer"), которым может пользоваться администратор. Кроме tcpdump можно обратить внимание на такие программы, как:

- [Wireshark](https://wiki.dieg.info/wireshark "wireshark")  (бывший ethereal) —  [Сетевые анализаторы снифферы](https://wiki.dieg.info/sniffer "sniffer")  с графическим интерфейсом, который может обрабатывать дампы сделанные программой tcpdump
    
- [ngrep](https://wiki.dieg.info/ngrep "ngrep")
    

tcpdump работает при помощи интерфейса bpf (Berkeley Packet Filter). Если поддержку этого устройства отключить, сниффинг в  [BSD](https://wiki.dieg.info/bsd "bsd")  окажется невозможен. Права на запуск программы tcpdump определяются правами доступа к устройсву bpf (/dev/bpf0). Эти права можно регулировать через devfs. Если вы предоставляете, например, группе operator права на чтение из этого устройства, то это значит, что все члены этой группы смогут перехватывать любой трафик, в том числе трафик суперпользователя.

Если программа tcpdump вызвана для прослушивания некоторого интерфейса, она переводит его в «promiscuous mode» — «неразборчивый режим». В этом режиме интерфейс ловит вообще все пакеты, которые до него добрались, а не только пакеты адресованные непосредственно ему. Таким образом, если сеть собрана не на коммураторах (switch), а на репитерах (hub), то tcpdump позволит перехватить трафик между посторонними машинами, т.е. подслушать разговор двух сторонних машин. Сказанное не означает, что перехват трафика невозможен в сети собранной на коммутаторах. Впрочем, интерфейс можно и не переводить в promiscous mode, если передать программе аргумент -p.

## tcpdump для VoIP SIP H.323

Ключ -w применяется для записи данных в отдельный файл. Прочитать это файл можно применяя ключи -r и -X(показать заголовки), например:

```
# tcpdump -r tcpdumplog
# tcpdump -X -r tcpdumplog
```

```
# tcpdump -i eth0 -n port 5060 -w mbill
or
# tcpdump -i eth0 -n -s 0 port 5060 -vvv -w /home/capture_file_name
or 
# tcpdump -i eth0 -n host 89.31.241.2 -vvv -w /home/textcall
```

Анализирует траффик удаленно через SSH с помощью  [Wireshark](https://wiki.dieg.info/wireshark "wireshark")

```
ssh root@HOST tcpdump -U -s0 -w - 'not port 22' | wireshark -k -i -
```

UDP трафик с и на IP xxx.xxx.xxx.251 destined for port 5060:

```
# tcpdump -nnvvS udp and host xxx.xxx.xxx.251 and dst port 5060
```

Записать в файл mbill251 весь трафик с хоста xxx.xxx.xxx.251 за исключением трафика ssh

```
# tcpdump -n -i eth0 host xxx.xxx.xxx.251 -vvv and not port 22 -w /home/mbill251
```

Прослушать порт 5060 с ip xxx.xxx.xxx.251

```
tcpdump -i eth0 -n -s 0 port 5060 and host xxx.xxx.xxx.251 -vvv -w /usr/local/tcpdumplog/log
```

```
tcpdump -i eth0 -n -s 0 port 1720 and host xxx.xxx.xxx.251 -vvv -w /usr/local/tcpdumplog
```

H.323 сигналинг ловим с двух IP. В таком виде с двух IP отказалось снимать, мож**ет быть OR нужно бы**ло поставить.

```
# tcpdump -i eth0 -n -s 0 port 1720 and host xxx.xxx.164.1 and host xxx.xxx.107.1 -vvv -w /usr/local/tcpdumplog/logfile
```

## tcpdump Packet Filter Firewall (PF)

Просмотреть лог  [Packet Filter Firewall (PF) (обновление 2018.08)](https://wiki.dieg.info/packet_filter_firewall_pf "packet_filter_firewall_pf")

```
# tcpdump -nettti pflog0
# tcpdump -netttr /var/log/pflog
```

## Примеры использования tcpdump

перечислить доступные интерфейсы (которые можно прослушивать при помощи опции -i)

```
tcpdump -D
```

посмотреть трафик одного хоста:

```
tcpdump host 1.2.3.4
```

посмотреть трафик на порте:

```
tcpdump src port 80
```

посмотреть IP трафик на хост:

```
tcpdump ip host 1.2.3.4
```

посмотреть ARP трафик на хост:

```
tcpdump arp host 1.2.3.4
```

посмотреть RARP трафик на хост:

```
tcpdump rarp host 1.2.3.4
```

посмотреть трафик, кроме хоста unixserver:

```
tcpdump not host unixserver
```

посмотреть трафик на server1 и server2

```
tcpdump host server1 or host server2
```

посмотреть содержимое пакетов на интерфейсе tun0 на хост ya.ru

```
tcpdump -X -i tun0 host ya.ru
```

подсмотреть номера и пароли к icq

```
tcpdump -X -i fxp1 port aol
```

посмотреть содержимое пакетов на интерфейсе tun0 на хост ya.ru, при этом прочитать из каждого пакета по 1500 байт и не преобразовывать IP в имя хоста

```
tcpdump -X -s 1500 -n -i tun0 host ya.ru
```

## Примеры использования tcpdump AND OR EXCEPT

```
AND 
and or &&
OR 
or or ||
EXCEPT 
not or !
```

TCP traffic from 10.5.2.3 destined for port 3389:

```
# tcpdump -nnvvS tcp and src 10.5.2.3 and dst port 3389
```

Traffic originating from the 192.168 network headed for the 10 or 172.16 networks:

```
# tcpdump -nvX src net 192.168.0.0/16 and dst net 10.0.0.0/8 or 172.16.0.0/16
```

Non-ICMP traffic destined for 192.168.0.2 from the 172.16 network:

```
# tcpdump -nvvXSs 1514 dst 192.168.0.2 and src net 172.16.0.0/16 and not icmp
```

```
# tcpdump -nvvvpi rl0 tcp and not port ssh and not port smtp
```

## Проблема +arplookup 0.0.0.0 failed: host is not on local network

Лечение: запускаем команду и ищем MAC c ошибкой

```
# tcpdump -vvv -n -l -e arp | grep 0.0.0.0
...
16:43:57.407018 00:0e:89:1d:cc:87 > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 60: arp who-has 86.90.285.175 (00:50:fc:f0:3e:e9) tell 0.0.0.0
...
```

[arplookup 0.0.0.0 failed: host is not on local network](http://www.mail-archive.com/freebsd-questions@freebsd.org/msg191545.html)

[Default route 0.0.0.0](http://en.wikipedia.org/wiki/0.0.0.0)

```
# tcpdump -vvv -n -l -e arp
# tcpdump -i rl1 -vvv -n -l -e arp
```

**arpdig**  – dig an interface for arp responses. Выводит соответствие между IP и MAC. Пример использования:

```
# arpdig 195.143.151.1/28
```

gratuitous arp - самообращенные запросы. При таком запросе инициатор формирует пакет, где в качестве IP используется его собственный адрес.

[Использование утилиты arping](https://wiki.dieg.info/arping "arping")  -  [Работа с ARP протоколом: очистка таблицы](https://wiki.dieg.info/arp "arp")  level "ping" utility Пример использования:

```
for /l %i in (1,1,254) do ping -n 1 -w 1 192.168.1.%i
arp -a | find "арп"
```

## Wireshark: Packet size limited during capture

Файлы tcpdump совместимы с  [Wireshark](https://wiki.dieg.info/wireshark "wireshark"). Запуская ее с параметром -w filename, мы получаем файл, содержащий нужный нам сетевой трафик. К сожалению, по умолчанию в tcpdump каждый пакет ограничивается 96ю байтами (которых, как правило, достаточно для анализа любых пакетов). Однако если нужно залезть глубже и смотреть всё содержимое пакетов, нужно использовать команду -s size (где size - размер пакетов, которые нужно ловить). Для обычного ethernet'а размер пакетов равен 1500, для "разогнанного" гигабитного etherneta - порой до 65к.

Итого, имеем следующую команду:

```
# tcpdump -s 1500 -w filename
```

И используем ее для того, чтобы можно было создать полный дамп сетевого трафика, который можно смотреть в Wireshark без сообщений вида  **Packet size limited during capture**