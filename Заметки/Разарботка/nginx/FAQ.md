## как включить в проект на nginx + php http/2

Для того, чтобы включить протокол HTTP/2 в проект на Nginx + PHP, необходимо выполнить следующие шаги:

1. Убедитесь, что версия Nginx, которую вы используете, поддерживает протокол HTTP/2. Для этого проверьте версию командой:

```
nginx -V
```

2. В файле конфигурации Nginx (обычно это файл /etc/nginx/nginx.conf) добавьте следующий блок:

```
http {
  ...
  server {
    listen 443 ssl http2;
    ...
  }
  ...
}
```

В этом блоке мы указываем, что сервер должен слушать на порту 443 и использовать протокол HTTP/2.

3. Настройте SSL-сертификат для вашего сервера, чтобы обеспечить защищенное соединение HTTPS. Для этого можно использовать сертификат от Let's Encrypt или купить удостоверенный SSL-сертификат у провайдера.

4. Перезапустите Nginx, чтобы применить настройки:

```
sudo systemctl restart nginx
```

Теперь ваш проект на Nginx + PHP будет использовать протокол HTTP/2 для передачи данных между клиентом и сервером. Это позволит ускорить загрузку страниц и уменьшить задержки при обмене данными.