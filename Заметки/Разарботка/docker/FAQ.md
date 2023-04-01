## как запустить приложение под определенным пользователем, а потом зайти по ним в контейнер

```yml
version: '2'  
services:  
  php:  
	...
    user: "1000:1000"
```

```bash
docker-compose exec --user 1000 php /bin/bash
```

