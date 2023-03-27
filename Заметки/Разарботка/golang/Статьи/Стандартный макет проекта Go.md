https://github.com/golang-standards/project-layout

### `/cmd`

Основные приложения для этого проекта.

Имя каталога для каждого приложения должно совпадать с именем исполняемого файла, который вы хотите иметь (например, `/cmd/myapp`).

Не помещайте много кода в каталог приложения. Если вы считаете, что код можно импортировать и использовать в других проектах, то он должен находиться в `/pkg`каталоге. Если код нельзя использовать повторно или если вы не хотите, чтобы другие использовали его повторно, поместите этот код в `/internal`каталог. Вы будете удивлены тем, что сделают другие, так что прямо говорите о своих намерениях!

Обычно используется небольшая `main`функция, которая импортирует и вызывает код из `/internal`каталогов `/pkg`и и ничего больше.

[`/cmd`](https://github.com/golang-standards/project-layout/blob/master/cmd/README.md)Примеры смотрите в каталоге.

### [](https://github.com/golang-standards/project-layout#internal)`/internal`

Частное приложение и код библиотеки. Это код, который вы не хотите, чтобы другие импортировали в свои приложения или библиотеки. Обратите внимание, что этот шаблон компоновки применяется самим компилятором Go. См. Go 1.4 [`release notes`](https://golang.org/doc/go1.4#internalpackages)для более подробной информации. Обратите внимание, что вы не ограничены каталогом верхнего уровня `internal`. Вы можете иметь более одного `internal`каталога на любом уровне дерева вашего проекта.

При желании вы можете добавить немного дополнительной структуры к своим внутренним пакетам, чтобы разделить общий и не общий внутренний код. Это не обязательно (особенно для небольших проектов), но приятно иметь визуальные подсказки, показывающие предполагаемое использование пакета. Фактический код вашего приложения может находиться в `/internal/app`каталоге (например, `/internal/app/myapp`), а код, используемый этими приложениями, — в `/internal/pkg`каталоге (например, `/internal/pkg/myprivlib`).

### [](https://github.com/golang-standards/project-layout#pkg)`/pkg`

Код библиотеки, который можно использовать во внешних приложениях (например, `/pkg/mypubliclib`). Другие проекты будут импортировать эти библиотеки, ожидая, что они будут работать, поэтому подумайте дважды, прежде чем размещать что-либо здесь :-) Обратите внимание, что каталог `internal`— это лучший способ гарантировать, что ваши частные пакеты не будут импортированы, потому что это обеспечивается Go. Каталог `/pkg`по-прежнему является хорошим способом явно сообщить, что код в этом каталоге безопасен для использования другими. Сообщение [`I'll take pkg over internal`](https://travisjeffery.com/b/2019/11/i-ll-take-pkg-over-internal/)в блоге Трэвиса Джеффри дает хороший обзор каталогов `pkg`и `internal`и того, когда может иметь смысл их использовать.

Это также способ сгруппировать код Go в одном месте, когда ваш корневой каталог содержит множество компонентов и каталогов, не относящихся к Go, что упрощает запуск различных инструментов Go (как упоминалось в этих докладах: из GopherCon EU 2018, GopherCon 2018: Kat [`Best Practices for Industrial Programming`](https://www.youtube.com/watch?v=PTE4VJIdHPg)Zien [- How Do You Structure Your Go Apps](https://www.youtube.com/watch?v=oL6JBUk6tj0) and [GoLab 2018 — Massimiliano Pippi — Шаблоны компоновки проектов в Go](https://www.youtube.com/watch?v=3gQa1LWwuzk) ).

См. [`/pkg`](https://github.com/golang-standards/project-layout/blob/master/pkg/README.md)каталог, если вы хотите узнать, какие популярные репозитории Go используют этот шаблон макета проекта. Это распространенный шаблон компоновки, но он не является общепринятым, и некоторые члены сообщества Go не рекомендуют его.

Можно не использовать его, если проект вашего приложения действительно мал и дополнительный уровень вложенности не добавляет большой ценности (если вы действительно этого не хотите :-)). Подумайте об этом, когда он становится достаточно большим, а ваш корневой каталог становится довольно занятым (особенно если у вас много компонентов приложения, отличного от Go).

Происхождение каталога `pkg`: старый исходный код Go использовался `pkg`для его пакетов, а затем различные проекты Go в сообществе начали копировать шаблон ( [`this`](https://twitter.com/bradfitz/status/1039512487538970624)дополнительный контекст см. в твите Брэда Фитцпатрика).

### [](https://github.com/golang-standards/project-layout#vendor)`/vendor`

Зависимости приложения (управляемые вручную или с помощью вашего любимого инструмента управления зависимостями, такого как новая встроенная [`Go Modules`](https://github.com/golang/go/wiki/Modules)функция). Команда `go mod vendor`создаст `/vendor`для вас каталог. Обратите внимание, что вам может понадобиться добавить `-mod=vendor`флаг в свою `go build`команду, если вы не используете Go 1.14, где он включен по умолчанию.

Не фиксируйте зависимости вашего приложения, если вы создаете библиотеку.

Обратите внимание, что поскольку [`1.13`](https://golang.org/doc/go1.13#modules)Go также включил функцию прокси-сервера модуля ( [`https://proxy.golang.org`](https://proxy.golang.org/)по умолчанию используется в качестве прокси-сервера модуля). Узнайте больше о нем, [`here`](https://blog.golang.org/module-mirror-launch)чтобы узнать, соответствует ли он всем вашим требованиям и ограничениям. `vendor`Если это так, то вам вообще не понадобится каталог.

## [](https://github.com/golang-standards/project-layout#service-application-directories)Каталоги сервисных приложений

### [](https://github.com/golang-standards/project-layout#api)`/api`

Спецификации OpenAPI/Swagger, файлы схемы JSON, файлы определения протокола.

[`/api`](https://github.com/golang-standards/project-layout/blob/master/api/README.md)Примеры смотрите в каталоге.

## [](https://github.com/golang-standards/project-layout#web-application-directories)Каталоги веб-приложений

### [](https://github.com/golang-standards/project-layout#web)`/web`

Специальные компоненты веб-приложений: статические веб-активы, шаблоны на стороне сервера и SPA.

## [](https://github.com/golang-standards/project-layout#common-application-directories)Общие каталоги приложений

### [](https://github.com/golang-standards/project-layout#configs)`/configs`

Шаблоны файлов конфигурации или конфигурации по умолчанию.

Поместите сюда свои файлы `confd`или `consul-template`файлы шаблонов.

### [](https://github.com/golang-standards/project-layout#init)`/init`

Конфигурации инициализации системы (systemd, upstart, sysv) и менеджера процессов/супервизора (runit, supervisord).

### [](https://github.com/golang-standards/project-layout#scripts)`/scripts`

Скрипты для выполнения различных операций сборки, установки, анализа и т. д.

Эти сценарии делают Makefile корневого уровня небольшим и простым (например, [`https://github.com/hashicorp/terraform/blob/master/Makefile`](https://github.com/hashicorp/terraform/blob/master/Makefile)).

[`/scripts`](https://github.com/golang-standards/project-layout/blob/master/scripts/README.md)Примеры смотрите в каталоге.

### [](https://github.com/golang-standards/project-layout#build)`/build`

Упаковка и непрерывная интеграция.

Поместите конфигурацию вашего облака (AMI), контейнера (Docker), ОС (deb, rpm, pkg) и сценарии в каталог `/build/package`.

Поместите свои конфигурации и сценарии CI (travis, Circle, Drone) в `/build/ci`каталог. Обратите внимание, что некоторые инструменты CI (например, Travis CI) очень требовательны к расположению своих конфигурационных файлов. Попробуйте поместить файлы конфигурации в `/build/ci`каталог, связав их с местом, где их ожидают инструменты CI (когда это возможно).

### [](https://github.com/golang-standards/project-layout#deployments)`/deployments`

Конфигурации и шаблоны развертывания IaaS, PaaS, системы и контейнера (docker-compose, kubernetes/helm, mesos, terraform, bosh). Обратите внимание, что в некоторых репозиториях (особенно в приложениях, развернутых с помощью kubernetes) этот каталог называется `/deploy`.

### [](https://github.com/golang-standards/project-layout#test)`/test`

Дополнительные внешние тестовые приложения и тестовые данные. Не стесняйтесь структурировать `/test`каталог так, как вы хотите. Для больших проектов имеет смысл иметь подкаталог данных. Например, вы можете `/test/data`или, `/test/testdata`если вам нужно, Go игнорировать то, что находится в этом каталоге. Обратите внимание, что Go также игнорирует каталоги и файлы, начинающиеся с "." или "_", так что у вас будет больше гибкости с точки зрения того, как вы называете свой каталог тестовых данных.

[`/test`](https://github.com/golang-standards/project-layout/blob/master/test/README.md)Примеры смотрите в каталоге.

## [](https://github.com/golang-standards/project-layout#other-directories)Другие каталоги

### [](https://github.com/golang-standards/project-layout#docs)`/docs`

Проектная и пользовательская документация (в дополнение к документации, созданной вашим godoc).

[`/docs`](https://github.com/golang-standards/project-layout/blob/master/docs/README.md)Примеры смотрите в каталоге.

### [](https://github.com/golang-standards/project-layout#tools)`/tools`

Вспомогательные инструменты для этого проекта. Обратите внимание, что эти инструменты могут импортировать код из каталогов `/pkg`и `/internal`.

[`/tools`](https://github.com/golang-standards/project-layout/blob/master/tools/README.md)Примеры смотрите в каталоге.

### [](https://github.com/golang-standards/project-layout#examples)`/examples`

Примеры для ваших приложений и/или публичных библиотек.

[`/examples`](https://github.com/golang-standards/project-layout/blob/master/examples/README.md)Примеры смотрите в каталоге.

### [](https://github.com/golang-standards/project-layout#third_party)`/third_party`

Внешние вспомогательные инструменты, разветвленный код и другие сторонние утилиты (например, Swagger UI).

### [](https://github.com/golang-standards/project-layout#githooks)`/githooks`

Гит хуки.

### [](https://github.com/golang-standards/project-layout#assets)`/assets`

Другие активы, которые можно использовать вместе с вашим репозиторием (изображения, логотипы и т. д.).

### [](https://github.com/golang-standards/project-layout#website)`/website`

Это место для размещения данных веб-сайта вашего проекта, если вы не используете страницы GitHub.

[`/website`](https://github.com/golang-standards/project-layout/blob/master/website/README.md)Примеры смотрите в каталоге.

## [](https://github.com/golang-standards/project-layout#directories-you-shouldnt-have)Каталоги, которых у вас не должно быть

### [](https://github.com/golang-standards/project-layout#src)`/src`

В некоторых проектах Go есть `src`папка, но обычно это происходит, когда разработчики пришли из мира Java, где это распространенный шаблон. Если вы можете помочь себе, попробуйте не использовать этот шаблон Java. Вы действительно не хотите, чтобы ваш код Go или проекты Go выглядели как Java :-)

Не путайте `/src`каталог уровня проекта с `/src`каталогом, который Go использует для своих рабочих областей, как описано в [`How to Write Go Code`](https://golang.org/doc/code.html). Переменная среды `$GOPATH`указывает на вашу (текущую) рабочую область (по умолчанию она указывает на `$HOME/go`системы, отличные от Windows). Это рабочее пространство включает в себя верхний уровень `/pkg`и каталоги. Ваш фактический проект оказывается подкаталогом в , поэтому, если у вас есть каталог в вашем проекте, путь к проекту будет выглядеть так: . Обратите внимание, что с Go 1.11 ваш проект может быть за пределами вашего , но это все равно не означает, что использование этого шаблона макета является хорошей идеей.`/bin``/src``/src``/src``/some/path/to/workspace/src/your_project/src/your_code.go``GOPATH`