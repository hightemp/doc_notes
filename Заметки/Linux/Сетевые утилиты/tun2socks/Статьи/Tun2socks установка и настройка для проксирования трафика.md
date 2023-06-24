https://chast.in/tun2socks-install-and-setup-proxy.html

Как показала практика, TCP тунель OpenVPN через proxy на мобильном интернете работает, мягко говоря, плохо. Поэтому я решил попробовать еще один способ проксирования — tun2socks. Как оказалось, через него можно пробрасывать тоже только TCP трафик, ssh подключение, ICMP через такой туннель не передается.

В общем-то, здесь все просто, за исключением того, что нужно собрать пакет вручную под мою платформу — ARM. Конечно же, это подойдет под любой linux.
1. Устанавливаем нужный soft:

```
apt install cmake git -y
```
2. Клонируем исходники с github и собираем:

```
git clone https://github.com/ambrop72/badvpn
mkdir /root/badvpn-build; cd /root/badvpn-build
cmake /root/badvpn/ -DBUILD_NOTHING_BY_DEFAULT=1 -DBUILD_TUN2SOCKS=1
make
Теперь у нас есть badvpn-tun2socks по адресу /root/badvpn-build/tun2socks/badvpn-tun2socks
```
3. Выполним настройку sock5 proxy через ssh:

```
# создаем ключи
mkdir ~/.pub
ssh-keygen
# копируем ключи на сервер
ssh-copy-id diman@video.37xxx.ru -p22022
# подключаем прокси video.37xxx.ru
ssh diman@video.37xxx.ru -p 22022 -D 127.0.0.1:4444 -N -f
```
4.

```
# Конфигурируем интерфейс tun1 и создаем подключение через прокси
ip tuntap add dev tun1 mode tun user root
ifconfig tun1 10.0.0.1 netmask 255.255.255.0
/root/badvpn-build/tun2socks/badvpn-tun2socks --tundev tun1 --netif-ipaddr 10.0.0.2 --netif-netmask 255.255.255.0 --socks-server-addr localhost:4444
```
5. Добавляем роуты на новое подключение, не забывая выпустить путь к прокси и dns через старый gw

```
# 192.168.8.1 - действующий gw
# video.37xxx.ru - адрес proxy
route add video.37xxx.ru gw 192.168.8.1 metric 5
route add 8.8.8.8 gw 192.168.8.1 metric 5
route add 8.8.4.4 gw 192.168.8.1 metric 5
route del default gw 192.168.8.1
route add default gw 10.0.0.2 metric 6

# Маскарадим tun1 в локальную сеть, если требуется: 
iptables  -t nat -A POSTROUTING -o tun1 -j MASQUERADE
```
