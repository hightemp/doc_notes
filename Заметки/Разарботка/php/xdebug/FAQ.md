## Базовые настройки

```
# ДО 3 ВЕРСИИ
zend_extension = xdebug.so
xdebug.remote_enable=1
xdebug.remote_host=host.docker.internal
xdebug.remote_port=9003
xdebug.idekey=PHPSTORM
xdebug.remote_autostart=1
```

```
# ПОСЛЕ 3 ВЕРСИИ
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
```

