напиши скрипт:

запускающий http прокси pproxy, который передает весь внешний траффик с 0.0.0.0 на порт ssh socks прокси запускающий ssh socks прокси добавь проверку на работоспособность http прокси pproxy и ssh socks прокси добавь перезапуск http прокси pproxy и ssh socks прокси если они не работают


```bash
#!/bin/bash

function check_connection() {
    # Check HTTP proxy connection
    curl -s -o /dev/null http://localhost:8080 || restart_pproxy

    # Check SSH SOCKS proxy connection
    nc -z localhost 1080 || restart_socks_proxy
}

function restart_pproxy() {
    echo "Restarting pproxy..."
    pkill -f pproxy
    sleep 1
    pproxy -l http+socks4+socks5://0.0.0.0:8080 -r socks5://127.0.0.1:1080 &
}

function restart_socks_proxy() {
    echo "Restarting SSH SOCKS proxy..."
    pkill -f "ssh -D 1080"
    sleep 1
    ssh -D 1080 -f -C -q -N user@your_server &
}

echo "Starting SOCKS proxy..."
ssh -D 1080 -f -C -q -N user@your_server

echo "Starting pproxy..."
pproxy -l http+socks4+socks5://0.0.0.0:8080 -r socks5://127.0.0.1:1080 &

# Check connection every minute
while true; do
    check_connection
    sleep 60
done
```

Этот скрипт будет запускать HTTP-прокси pproxy на порту 8080, который будет передавать весь внешний траффик на порт SSH SOCKS-прокси на локальном хосте. Кроме того, скрипт будет запускать SSH SOCKS-прокси на порту 1080. Если один из прокси перестанет работать, скрипт автоматически перезапустит его.
