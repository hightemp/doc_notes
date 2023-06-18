(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{372:function(t,s,e){"use strict";e.r(s);var a=e(14),n=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Конечно! Вот некоторые часто задаваемые вопросы и ответы по systemd:")]),t._v(" "),s("h2",{attrs:{id:"что-такое-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#что-такое-systemd"}},[t._v("#")]),t._v(" Что такое systemd?")]),t._v(" "),s("p",[t._v("systemd - это система инициализации для операционных систем Linux. Он управляет запуском и остановкой служб, контролирует журналы, управляет устройствами и монтирует файловые системы. systemd заменяет старую систему инициализации SysV и предоставляет более мощный и гибкий способ управления системой.")]),t._v(" "),s("h2",{attrs:{id:"как-запустить-службу-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-запустить-службу-в-systemd"}},[t._v("#")]),t._v(" Как запустить службу в systemd?")]),t._v(" "),s("p",[t._v("Для запуска службы в systemd вы можете использовать команду "),s("code",[t._v("systemctl start <имя службы>")]),t._v(". Например, для запуска службы Apache вы можете использовать команду "),s("code",[t._v("systemctl start httpd")]),t._v(".")]),t._v(" "),s("h2",{attrs:{id:"как-остановить-службу-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-остановить-службу-в-systemd"}},[t._v("#")]),t._v(" Как остановить службу в systemd?")]),t._v(" "),s("p",[t._v("Чтобы остановить службу в systemd, вы можете использовать команду "),s("code",[t._v("systemctl stop <имя службы>")]),t._v(". Например, для остановки службы Apache вы можете использовать команду "),s("code",[t._v("systemctl stop httpd")]),t._v(".")]),t._v(" "),s("h2",{attrs:{id:"как-перезапустить-службу-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-перезапустить-службу-в-systemd"}},[t._v("#")]),t._v(" Как перезапустить службу в systemd?")]),t._v(" "),s("p",[t._v("Для перезапуска службы в systemd вы можете использовать команду "),s("code",[t._v("systemctl restart <имя службы>")]),t._v(". Например, для перезапуска службы Apache вы можете использовать команду "),s("code",[t._v("systemctl restart httpd")]),t._v(".")]),t._v(" "),s("h2",{attrs:{id:"как-проверить-статус-службы-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-проверить-статус-службы-в-systemd"}},[t._v("#")]),t._v(" Как проверить статус службы в systemd?")]),t._v(" "),s("p",[t._v("Для проверки статуса службы в systemd вы можете использовать команду "),s("code",[t._v("systemctl status <имя службы>")]),t._v(". Например, для проверки статуса службы Apache вы можете использовать команду "),s("code",[t._v("systemctl status httpd")]),t._v(".")]),t._v(" "),s("h2",{attrs:{id:"как-добавить-новую-службу-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-добавить-новую-службу-в-systemd"}},[t._v("#")]),t._v(" Как добавить новую службу в systemd?")]),t._v(" "),s("p",[t._v("Для добавления новой службы в systemd вы должны создать файл конфигурации службы в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(". Затем вы должны запустить команду "),s("code",[t._v("systemctl daemon-reload")]),t._v(", чтобы systemd перечитал файлы конфигурации. Наконец, вы можете запустить команду "),s("code",[t._v("systemctl start <имя службы>")]),t._v(" для запуска новой службы.")]),t._v(" "),s("h2",{attrs:{id:"как-удалить-службу-из-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-удалить-службу-из-systemd"}},[t._v("#")]),t._v(" Как удалить службу из systemd?")]),t._v(" "),s("p",[t._v("Для удаления службы из systemd вы должны удалить файл конфигурации службы из каталога "),s("code",[t._v("/etc/systemd/system")]),t._v(". Затем вы должны запустить команду "),s("code",[t._v("systemctl daemon-reload")]),t._v(", чтобы systemd обновил свои файлы конфигурации. Наконец, вы можете запустить команду "),s("code",[t._v("systemctl reset-failed")]),t._v(", чтобы удалить записи о службе из журналов systemd.")]),t._v(" "),s("p",[t._v("Надеюсь, эти ответы помогут вам лучше понимать и использовать systemd!")]),t._v(" "),s("h2",{attrs:{id:"как-настроить-автозапуск-службы-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-настроить-автозапуск-службы-в-systemd"}},[t._v("#")]),t._v(" Как настроить автозапуск службы в systemd?")]),t._v(" "),s("p",[t._v("Для настройки автозапуска службы в systemd вы можете использовать команду "),s("code",[t._v("systemctl enable <имя службы>")]),t._v(". Это создаст символическую ссылку на файл конфигурации службы в каталоге "),s("code",[t._v("/etc/systemd/system/multi-user.target.wants")]),t._v(", что позволит systemd автоматически запускать службу при загрузке системы.")]),t._v(" "),s("h2",{attrs:{id:"как-остановить-или-выключить-службу-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-остановить-или-выключить-службу-в-systemd"}},[t._v("#")]),t._v(" Как остановить или выключить службу в systemd?")]),t._v(" "),s("p",[t._v("Для остановки службы в systemd вы можете использовать команду "),s("code",[t._v("systemctl stop <имя службы>")]),t._v(". Для выключения службы вы можете использовать команду "),s("code",[t._v("systemctl poweroff")]),t._v(". Обратите внимание, что эта команда выключит всю систему, а не только определенную службу.")]),t._v(" "),s("h2",{attrs:{id:"как-перезагрузить-систему-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-перезагрузить-систему-в-systemd"}},[t._v("#")]),t._v(" Как перезагрузить систему в systemd?")]),t._v(" "),s("p",[t._v("Для перезагрузки системы в systemd вы можете использовать команду "),s("code",[t._v("systemctl reboot")]),t._v(". Это перезагрузит всю систему, включая все службы, запущенные в systemd.")]),t._v(" "),s("h2",{attrs:{id:"как-просмотреть-список-всех-служб-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-просмотреть-список-всех-служб-в-systemd"}},[t._v("#")]),t._v(" Как просмотреть список всех служб в systemd?")]),t._v(" "),s("p",[t._v("Для просмотра списка всех служб в systemd вы можете использовать команду "),s("code",[t._v("systemctl list-unit-files --type=service")]),t._v(". Это выведет список всех файлов конфигурации служб в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(" и "),s("code",[t._v("/usr/lib/systemd/system")]),t._v(".")]),t._v(" "),s("p",[t._v("Надеюсь, эти ответы помогли вам лучше понимать и использовать systemd. Если у вас есть дополнительные вопросы, не стесняйтесь спрашивать!")]),t._v(" "),s("h2",{attrs:{id:"что-такое-unit-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#что-такое-unit-в-systemd"}},[t._v("#")]),t._v(" Что такое Unit в systemd?")]),t._v(" "),s("p",[t._v("Unit - это основной элемент конфигурации в systemd. Это абстракция, которая представляет системный ресурс, такой как служба, монтирование, сокет или таймер. Каждый Unit определяет, как и когда systemd будет управлять ресурсом.")]),t._v(" "),s("h2",{attrs:{id:"какие-типы-unit-существуют-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#какие-типы-unit-существуют-в-systemd"}},[t._v("#")]),t._v(" Какие типы Unit существуют в systemd?")]),t._v(" "),s("p",[t._v("В systemd существует несколько типов Unit:")]),t._v(" "),s("ul",[s("li",[t._v("Service Unit: определяет службу, которую systemd будет управлять.")]),t._v(" "),s("li",[t._v("Mount Unit: определяет точку монтирования файловой системы.")]),t._v(" "),s("li",[t._v("Socket Unit: определяет сокет, который может быть использован для связи между процессами.")]),t._v(" "),s("li",[t._v("Target Unit: определяет группу служб, которые должны быть запущены вместе.")]),t._v(" "),s("li",[t._v("Timer Unit: определяет таймер, который может запускать службы в указанное время.")])]),t._v(" "),s("h2",{attrs:{id:"как-создать-новыи-unit-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-создать-новыи-unit-в-systemd"}},[t._v("#")]),t._v(" Как создать новый Unit в systemd?")]),t._v(" "),s("p",[t._v("Для создания нового Unit в systemd вы должны создать новый файл конфигурации в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(". Название файла должно соответствовать имени Unit с расширением "),s("code",[t._v(".service")]),t._v(", "),s("code",[t._v(".mount")]),t._v(", "),s("code",[t._v(".socket")]),t._v(", "),s("code",[t._v(".target")]),t._v(" или "),s("code",[t._v(".timer")]),t._v(". В файле конфигурации вы можете определить параметры Unit, такие как пути к файлам, команды запуска и зависимости.")]),t._v(" "),s("h2",{attrs:{id:"как-запустить-новыи-unit-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-запустить-новыи-unit-в-systemd"}},[t._v("#")]),t._v(" Как запустить новый Unit в systemd?")]),t._v(" "),s("p",[t._v("Для запуска нового Unit в systemd вы должны запустить команду "),s("code",[t._v("systemctl daemon-reload")]),t._v(", чтобы systemd обновил свои файлы конфигурации. Затем вы можете использовать команду "),s("code",[t._v("systemctl start <имя Unit>")]),t._v(" для запуска нового ресурса.")]),t._v(" "),s("p",[t._v("Как создать новый Unit в systemd?")]),t._v(" "),s("p",[t._v("Для создания нового Unit в systemd вы должны создать файл конфигурации службы в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(" (или "),s("code",[t._v("/usr/lib/systemd/system")]),t._v(" для глобальных служб). Файл конфигурации должен иметь расширение "),s("code",[t._v(".service")]),t._v(" и содержать информацию о том, как systemd должен управлять новым ресурсом. В файле конфигурации вы можете указать такие параметры, как имя службы, команды для запуска и остановки службы, зависимости от других сервисов и многое другое.")]),t._v(" "),s("p",[t._v("Пример простого файла конфигурации службы, который запускает скрипт "),s("code",[t._v("/usr/local/bin/my_script.sh")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language-ini extra-class"},[s("pre",{pre:!0,attrs:{class:"language-ini"}},[s("code",[s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Unit")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("Description")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("My custom service")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Service")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("ExecStart")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("/usr/local/bin/my_script.sh")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("Restart")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("always")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Install")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("WantedBy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("multi-user.target")]),t._v("\n")])])]),s("p",[t._v("После создания файла конфигурации вы должны запустить команду "),s("code",[t._v("systemctl daemon-reload")]),t._v(", чтобы systemd обновил свои файлы конфигурации. Затем вы можете использовать команду "),s("code",[t._v("systemctl start <имя службы>")]),t._v(" для запуска новой службы.")]),t._v(" "),s("h3",{attrs:{id:"как-остановить-и-перезапустить-unit-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-остановить-и-перезапустить-unit-в-systemd"}},[t._v("#")]),t._v(" Как остановить и перезапустить Unit в systemd?")]),t._v(" "),s("p",[t._v("Чтобы остановить Unit в systemd, используйте команду "),s("code",[t._v("systemctl stop <имя Unit>")]),t._v(". Чтобы перезапустить Unit, используйте команду "),s("code",[t._v("systemctl restart <имя Unit>")]),t._v(". Вы также можете использовать команду "),s("code",[t._v("systemctl reload <имя Unit>")]),t._v(" для перезагрузки конфигурации Unit без остановки и запуска службы.")]),t._v(" "),s("h3",{attrs:{id:"как-проверить-статус-unit-в-systemd"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-проверить-статус-unit-в-systemd"}},[t._v("#")]),t._v(" Как проверить статус Unit в systemd?")]),t._v(" "),s("p",[t._v("Вы можете использовать команду "),s("code",[t._v("systemctl status <имя Unit>")]),t._v(" для проверки статуса Unit в systemd. Эта команда выведет информацию о том, работает ли конкретный Unit, остановлен ли он, была ли ошибка при запуске и т.д.")]),t._v(" "),s("h3",{attrs:{id:"как-автоматически-запускать-unit-в-systemd-при-загрузке-системы"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#как-автоматически-запускать-unit-в-systemd-при-загрузке-системы"}},[t._v("#")]),t._v(" Как автоматически запускать Unit в systemd при загрузке системы?")]),t._v(" "),s("p",[t._v("Чтобы автоматически запускать Unit в systemd при загрузке системы, вы можете использовать команду "),s("code",[t._v("systemctl enable <имя Unit>")]),t._v(". Это создаст символическую ссылку на файл конфигурации службы в каталоге "),s("code",[t._v("/etc/systemd/system/multi-user.target.wants")]),t._v(", что позволит systemd автоматически запускать службу при загрузке системы.")]),t._v(" "),s("p",[t._v("Конфигурационный файл mount unit в systemd позволяет автоматически монтировать файловые системы при запуске системы. Вот некоторые часто задаваемые вопросы о mount unit в systemd:")]),t._v(" "),s("p",[s("strong",[t._v("1. Как создать mount unit в systemd?")])]),t._v(" "),s("p",[t._v("Для создания mount unit в systemd нужно создать файл конфигурации в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(". Вот пример файла конфигурации для монтирования файловой системы в "),s("code",[t._v("/mnt/mountpoint")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Mount Unit\n# Зависимости от других юнитов\nRequires=local-fs.target\nAfter=local-fs.target\n\n[Mount]\nWhat=/dev/sdb1\nWhere=/mnt/mountpoint\nType=ext4\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[s("strong",[t._v("2. Как запустить mount unit в systemd?")])]),t._v(" "),s("p",[t._v("Вы можете запустить mount unit в systemd с помощью команды "),s("code",[t._v("systemctl start <имя mount unit>")]),t._v(". Например, для запуска mount unit "),s("code",[t._v("my-mount-unit.mount")]),t._v(", используйте команду:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("systemctl start my-mount-unit.mount\n")])])]),s("p",[s("strong",[t._v("3. Как проверить статус mount unit в systemd?")])]),t._v(" "),s("p",[t._v("Вы можете проверить статус mount unit в systemd с помощью команды "),s("code",[t._v("systemctl status <имя mount unit>")]),t._v(". Например, для проверки статуса mount unit "),s("code",[t._v("my-mount-unit.mount")]),t._v(", используйте команду:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("systemctl status my-mount-unit.mount\n")])])]),s("p",[s("strong",[t._v("4. Как автоматически монтировать файловую систему при загрузке системы?")])]),t._v(" "),s("p",[t._v("Чтобы автоматически монтировать файловую систему при загрузке системы, необходимо добавить mount unit в целевой юнит загрузки. Например, чтобы автоматически монтировать mount unit "),s("code",[t._v("my-mount-unit.mount")]),t._v(", необходимо добавить его в целевой юнит "),s("code",[t._v("multi-user.target")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("systemctl enable my-mount-unit.mount\n")])])]),s("p",[s("strong",[t._v("5. Как удалить mount unit в systemd?")])]),t._v(" "),s("p",[t._v("Чтобы удалить mount unit в systemd, необходимо удалить файл конфигурации в каталоге "),s("code",[t._v("/etc/systemd/system")]),t._v(". Например, чтобы удалить mount unit "),s("code",[t._v("my-mount-unit.mount")]),t._v(", необходимо удалить файл "),s("code",[t._v("/etc/systemd/system/my-mount-unit.mount")]),t._v(".")]),t._v(" "),s("p",[t._v("Вот несколько часто задаваемых вопросов о systemd timer unit с примерами:")]),t._v(" "),s("p",[s("strong",[t._v("Q: Что такое systemd timer unit?")])]),t._v(" "),s("p",[t._v("A: systemd timer unit - это файл конфигурации systemd, который позволяет запускать сервисы, скрипты и другие задачи по расписанию. Timer unit работает подобно крону, но с более точным контролем над временем выполнения задач.")]),t._v(" "),s("p",[s("strong",[t._v("Q: Как создать systemd timer unit?")])]),t._v(" "),s("p",[t._v("A: Создание systemd timer unit включает в себя создание двух файлов: "),s("code",[t._v(".timer")]),t._v(" и "),s("code",[t._v(".service")]),t._v(". Вот пример "),s("code",[t._v(".timer")]),t._v(" файла:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=Run my script every 30 minutes\n\n[Timer]\nOnCalendar=*:0/30\nUnit=my-script.service\n\n[Install]\nWantedBy=timers.target\n")])])]),s("p",[t._v("В этом примере мы создаем таймер, который запускает сервис "),s("code",[t._v("my-script.service")]),t._v(" каждые 30 минут. Мы также указываем, что таймер должен быть установлен в "),s("code",[t._v("timers.target")]),t._v(".")]),t._v(" "),s("p",[s("strong",[t._v("Q: Как создать "),s("code",[t._v(".service")]),t._v(" файл для systemd timer unit?")])]),t._v(" "),s("p",[t._v("A: Вот пример "),s("code",[t._v(".service")]),t._v(" файла для таймера, который запускает скрипт Python:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=Run my Python script\n\n[Service]\nType=simple\nExecStart=/usr/bin/python /path/to/my/script.py\n")])])]),s("p",[t._v("В этом примере мы создаем сервис, который запускает скрипт Python. Мы указываем путь к интерпретатору Python и путь к нашему скрипту.")]),t._v(" "),s("p",[s("strong",[t._v("Q: Как запустить systemd timer unit вручную?")])]),t._v(" "),s("p",[t._v("A: Вы можете использовать команду "),s("code",[t._v("systemctl start <имя таймера>")]),t._v(" для запуска таймера вручную. Например, чтобы запустить таймер "),s("code",[t._v("my-timer.timer")]),t._v(", необходимо выполнить следующую команду:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("systemctl start my-timer.timer\n")])])]),s("p",[s("strong",[t._v("Q: Как проверить статус systemd timer unit?")])]),t._v(" "),s("p",[t._v("A: Вы можете использовать команду "),s("code",[t._v("systemctl status <имя таймера>")]),t._v(" для проверки статуса таймера. Например, чтобы проверить статус таймера "),s("code",[t._v("my-timer.timer")]),t._v(", необходимо выполнить следующую команду:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("systemctl status my-timer.timer\n")])])]),s("p",[s("strong",[t._v("Q: Как удалить systemd timer unit?")])]),t._v(" "),s("p",[t._v("A: Вы можете удалить файлы "),s("code",[t._v(".timer")]),t._v(" и "),s("code",[t._v(".service")]),t._v(" из каталога "),s("code",[t._v("/etc/systemd/system")]),t._v(". Например, чтобы удалить таймер "),s("code",[t._v("my-timer.timer")]),t._v(", необходимо удалить файлы "),s("code",[t._v("/etc/systemd/system/my-timer.timer")]),t._v(" и "),s("code",[t._v("/etc/systemd/system/my-script.service")]),t._v(".")]),t._v(" "),s("p",[t._v("Конфигурационные файлы для systemd называются Unit файлами и имеют расширение "),s("code",[t._v(".service")]),t._v(", "),s("code",[t._v(".socket")]),t._v(", "),s("code",[t._v(".timer")]),t._v(", "),s("code",[t._v(".mount")]),t._v(", "),s("code",[t._v(".path")]),t._v(", "),s("code",[t._v(".device")]),t._v(" и т.д. Вот несколько примеров Unit файлов для systemd:")]),t._v(" "),s("ol",[s("li",[t._v("Unit файл "),s("code",[t._v(".service")]),t._v(":")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Service\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/my-service\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[t._v("Этот Unit файл описывает службу, которая запускает программу "),s("code",[t._v("/usr/bin/my-service")]),t._v(" после того, как сеть загружена. В качестве типа сервиса указан "),s("code",[t._v("simple")]),t._v(", что означает, что сервис выполняется в фоновом режиме и не отслеживается systemd.")]),t._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[t._v("Unit файл "),s("code",[t._v(".timer")]),t._v(":")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Timer\n\n[Timer]\nOnCalendar=*-*-* 10:30:00\nUnit=my-service.service\n\n[Install]\nWantedBy=timers.target\n")])])]),s("p",[t._v("Этот Unit файл описывает таймер, который запускает службу "),s("code",[t._v("my-service.service")]),t._v(" каждый день в 10:30 утра. Таймер устанавливается в "),s("code",[t._v("timers.target")]),t._v(", который автоматически запускается при загрузке системы.")]),t._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[t._v("Unit файл "),s("code",[t._v(".mount")]),t._v(":")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Mount\nRequires=network-online.target\nAfter=network-online.target\n\n[Mount]\nWhat=//server/share\nWhere=/mnt/share\nType=cifs\nOptions=username=user,password=pass\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[t._v("Этот Unit файл описывает точку монтирования, которая монтирует удаленный ресурс с сервера в локальную папку "),s("code",[t._v("/mnt/share")]),t._v(". Точка монтирования зависит от службы "),s("code",[t._v("network-online.target")]),t._v(", что означает, что она будет запущена только после того, как сеть загрузится.")]),t._v(" "),s("p",[t._v("Конфигурационные файлы для systemd имеют различные расширения в зависимости от типа юнита:")]),t._v(" "),s("ol",[s("li",[s("p",[s("code",[t._v(".service")]),t._v(": Этот файл определяет юнит-сервис, который запускает определенное приложение или службу и управляет ею. Пример: "),s("code",[t._v("/etc/systemd/system/nginx.service")]),t._v(".")])]),t._v(" "),s("li",[s("p",[s("code",[t._v(".socket")]),t._v(": Этот файл определяет Unix-сокет, который слушает входящие подключения на определенном адресе. Пример: "),s("code",[t._v("/etc/systemd/system/my-socket.socket")]),t._v(".")])]),t._v(" "),s("li",[s("p",[s("code",[t._v(".timer")]),t._v(": Этот файл определяет таймер, который позволяет запускать задачи с определенной периодичностью. Пример: "),s("code",[t._v("/etc/systemd/system/my-timer.timer")]),t._v(".")])]),t._v(" "),s("li",[s("p",[s("code",[t._v(".mount")]),t._v(": Этот файл определяет точку монтирования, которая может быть автоматически смонтирована при загрузке системы. Пример: "),s("code",[t._v("/etc/systemd/system/my-mount.mount")]),t._v(".")])]),t._v(" "),s("li",[s("p",[s("code",[t._v(".path")]),t._v(": Этот файл определяет файловый путь, который может быть мониторингом на наличие изменений. Пример: "),s("code",[t._v("/etc/systemd/system/my-path.path")]),t._v(".")])]),t._v(" "),s("li",[s("p",[s("code",[t._v(".device")]),t._v(": Этот файл определяет устройство, которое может быть автоматически создано при загрузке системы. Пример: "),s("code",[t._v("/etc/systemd/system/my-device.device")]),t._v(".")])])]),t._v(" "),s("p",[t._v("Конфигурация файла .service:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Service\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/my_service\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[t._v("Конфигурация файла .socket:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Socket\n\n[Socket]\nListenStream=127.0.0.1:8080\nAccept=yes\n\n[Install]\nWantedBy=sockets.target\n")])])]),s("p",[t._v("Конфигурация файла .timer:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Timer\n\n[Timer]\nOnBootSec=10min\nOnUnitActiveSec=1h\nUnit=my_service.service\n\n[Install]\nWantedBy=timers.target\n")])])]),s("p",[t._v("Конфигурация файла .mount:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Mount\nRequires=network-online.target\nAfter=network-online.target\n\n[Mount]\nWhat=/dev/sdb1\nWhere=/mnt/my_mount\nType=ext4\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[t._v("Конфигурация файла .path:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Unit]\nDescription=My Path\n\n[Path]\nPathExists=/etc/my_config.conf\n\n[Install]\nWantedBy=multi-user.target\n")])])]),s("p",[t._v("Конфигурация файла .device:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("[Device]\nType=oneshot\nExecStart=/bin/mkdir /mnt/my_device\n")])])])])}),[],!1,null,null,null);s.default=n.exports}}]);