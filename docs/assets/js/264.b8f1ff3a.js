(window.webpackJsonp=window.webpackJsonp||[]).push([[264],{536:function(e,r,t){"use strict";t.r(r);var n=t(14),a=Object(n.a)({},(function(){var e=this,r=e._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[e._v("https://backendinterview.ru/architecture/architecturesPatterns")]),e._v(" "),r("h2",{attrs:{id:"onion-architecture-hexagonal-architecture"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#onion-architecture-hexagonal-architecture"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#onion-architecture--hexagonal-architecture",target:"_blank",rel:"noopener noreferrer"}},[e._v("Onion architecture / Hexagonal Architecture"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Если мы делим код приложения на слои, то получаем слоистую архитектуру. Если применим к ней инверсию зависимости, то получим луковую. Гексагональная - это то же самое что и луковая, но с акцентом на разделение ответственностей внутри одного слоя.")]),e._v(" "),r("p",[e._v('Ниже пример "классического"(это не значит что он является единственно верным) способа разделения кода приложения на слои:')]),e._v(" "),r("h3",{attrs:{id:"domain-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#domain-layer"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#domain-layer",target:"_blank",rel:"noopener noreferrer"}},[e._v("Domain layer"),r("OutboundLink")],1)]),e._v(" "),r("p",[r("strong",[e._v("Domain layer")]),e._v(" — модель бизнес-логики приложения. В идеале вся бизнес логика(понятия и операции которым оперирует бизнес) должна находиться в этом слое. Задача остальных слоев, это инкапсуляция бизнес логики от объектов реального мира(бд, сети, файлов, пользователей, и т.д).")]),e._v(" "),r("h3",{attrs:{id:"application-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#application-layer"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#application-layer",target:"_blank",rel:"noopener noreferrer"}},[e._v("Application layer"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v('Слой ответственный за "связь" доменной модели и инфраструктурными сервисами. Никакие другие классы, кроме классов данного слоя не могут дергать объекты доменного. В терминологии Фаулера, называется service layer.')]),e._v(" "),r("h3",{attrs:{id:"infrastructure-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#infrastructure-layer"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#infrastructure-layer",target:"_blank",rel:"noopener noreferrer"}},[e._v("Infrastructure layer"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Инфраструктурный слой, содержащий всё необходимое для общения приложения с внешним миром(пользователями, сторонними сервисами, железом и т.д). быстро может стать очень жирным. Как я уже говорил, обычно, этот код сложен и нестабилен. Инфраструктурный код соединяет ядро нашего драгоценного приложения с:")]),e._v(" "),r("ul",[r("li",[e._v("Файловой системой")]),e._v(" "),r("li",[e._v("Сетью")]),e._v(" "),r("li",[e._v("Орм")]),e._v(" "),r("li",[e._v("Фреймворком")]),e._v(" "),r("li",[e._v("Сторонними библиотеками")])]),e._v(" "),r("p",[e._v("Очень важно понимать что здесь не может быть НИКАКОЙ бизнес логики.")]),e._v(" "),r("h3",{attrs:{id:"presentation-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#presentation-layer"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#presentation-layer",target:"_blank",rel:"noopener noreferrer"}},[e._v("Presentation layer"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("По сути, представляет собой подмножество слоя Infrastructure для работы с пользовательским вводом/выводом. Многие не выделяют этот слой в отдельный. Содержит в себе веб контроллеры, вьюхи, обработчики консольных команд и т.д")]),e._v(" "),r("h2",{attrs:{id:"command-and-query-responsibility-segregation-cqrs"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#command-and-query-responsibility-segregation-cqrs"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#command-and-query-responsibility-segregation-cqrs",target:"_blank",rel:"noopener noreferrer"}},[e._v("Command and Query Responsibility Segregation (CQRS)"),r("OutboundLink")],1)]),e._v(" "),r("p",[r("em",[r("strong",[e._v("CQRS")])]),e._v(" – подход проектирования программного обеспечения, при котором код, изменяющий состояние, отделяется от кода, просто читающего это состояние. Подобное разделение может быть логическим и основываться на разных уровнях. Кроме того, оно может быть физическим и включать разные звенья (tiers), или уровни.")]),e._v(" "),r("p",[e._v("В основе этого подхода лежит принцип "),r("strong",[e._v("Command-query separation")]),e._v(" (CQS). Основная идея CQS в том, что в объекте методы могут быть двух типов:")]),e._v(" "),r("ul",[r("li",[r("em",[e._v("Commands")]),e._v(": Методы изменяют состояние объекта, не возвращая значение.")]),e._v(" "),r("li",[r("em",[e._v("Queries")]),e._v(": Методы возвращают результат, не изменяя состояние объекта. Другими словами, у Query не никаких побочных эффектов.")])]),e._v(" "),r("h2",{attrs:{id:"event-driven"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#event-driven"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#event-driven",target:"_blank",rel:"noopener noreferrer"}},[e._v("Event Driven"),r("OutboundLink")],1)]),e._v(" "),r("p",[r("strong",[e._v("Архитектура, управляемая событиями")]),e._v(" (event-driven architecture, EDA) архитектура, в основе которой лежит создание, определение, потребление и реакции на события. Т.е любое изменение в системы должно выбрасывать событие, на которое могут реагировать другие части системы.")]),e._v(" "),r("h2",{attrs:{id:"event-sourcing"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#event-sourcing"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#event-sourcing",target:"_blank",rel:"noopener noreferrer"}},[e._v("Event Sourcing"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Идея "),r("code",[e._v("Event sourcing (ES)")]),e._v("заключается в том, что любому изменению модели можно сопоставить какое-то бизнес-событие, и сохранение всех событий является достаточным для того, чтобы каждый раз заново воспроизвести то же состояние модели.")]),e._v(" "),r("p",[e._v("В качестве примера можно привести риплеи игр: любой риплей обязан как минимум хранить в каком-то виде набор событий, которые генерировали сами игроки (отправил персонажа в такую-то точку, выстрелил в такую-то, купил такой-то предмет и т.д.), а уже последствия от этих действий всегда могут быть заново вычислены при условии, что игра детерминирована, т.е. она гарантирует, что игра будет развиваться точно также, как изначально (для псевдослучайных внутриигровых событий сохраняется seed и «случайный» элемент выполняется вполне себе неслучайно). С этой точки зрения всё, что происходит в игре — это заново вычисляемое состояние, включая смерти персонажей от потери здоровья. Также примером может служить баланс счета на банковском аккаунте, который формируется из совокупности всех операций зачисления и снятия денег со счёта.")]),e._v(" "),r("p",[e._v("Из-за ряда особенностей данного подхода использовать его повсеместно не получится. Event Sourcing не является серебряной пулей. Его использование оправдано там, где есть вероятность множества изменений, которые надо как-то контролировать.")]),e._v(" "),r("h4",{attrs:{id:"поток-событии"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#поток-событии"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#%D0%9F%D0%BE%D1%82%D0%BE%D0%BA-%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B9",target:"_blank",rel:"noopener noreferrer"}},[e._v("Поток событий"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Поток событий - это упорядоченный список событий, которые были применены в рамках агерата. Каждое новое событие увеличивает версию потока на 1.")]),e._v(" "),r("h4",{attrs:{id:"проблемы"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#проблемы"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B",target:"_blank",rel:"noopener noreferrer"}},[e._v("Проблемы"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Существует несколько проблем данного подхода. Во-первых, это избыточность данных. Мы храним огромное кол-во ненормализованных данных (событий). Во-вторых, необходимо затратить ресурсы на конвертацию потока событий в агрегат. В-третьих, у нас нет возможности искать по каким-либо полям (ведь полей у нас нет, есть лишь сериализованное представление события)")]),e._v(" "),r("h4",{attrs:{id:"снимки-snapshot"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#снимки-snapshot"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#%D0%A1%D0%BD%D0%B8%D0%BC%D0%BA%D0%B8-snapshot",target:"_blank",rel:"noopener noreferrer"}},[e._v("Снимки (Snapshot)"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Для решения проблемы, связанной с необходимостью накладывать множество событий на агрегат используются снимки. Снимок - сериализованное представление агрегата какой-либо версии (например, 10) Когда в следующий раз мы захотим получить текущее состояние агрегата для версии 20, нам необязательно накладывать все предшествующие 20 событий. Достаточно получить снимок 10-ой версии и применить к нему недостающие события (т.е. ещё 10)")]),e._v(" "),r("h4",{attrs:{id:"представления-projections"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#представления-projections"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#%D0%9F%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-projections",target:"_blank",rel:"noopener noreferrer"}},[e._v("Представления (Projections)"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Эффективная работа с Event Sourcing предполагает разделение на 2 интерфейса: write model (наш агрегат) и read model (представление). Представление - это то, с чем будут работать клиенты (например, через API). Оно формируется на основании изменений и в том виде, в котором необходимо. По сути представление - это просто ключ и набор данных, которые были собраны специально под тип запроса. Данный подход позволяет полностью исключить из работы все запросы с соединениями, группировками и т.д., ибо данные уже сохранены в том виде, в котором необходимы для использования.")]),e._v(" "),r("h4",{attrs:{id:"индексы"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#индексы"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#%D0%98%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D1%8B",target:"_blank",rel:"noopener noreferrer"}},[e._v("Индексы"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Для решения проблемы, связанной с фильтрацией данных, можно взять любое key\\value хранилище для реализации маппинга. Например, нам необходимо обеспечить уникальность email пользователя. В классической Event Sourcing имплементации это если и возможно, то весьма затратно. Но можно поступить иначе: когда мы создаём пользователя, мы записываем его идентификатор и email в специальное хранилище. Когда мы будем создавать другого пользователя, мы можем проверить, используется ли у кого-либо данный email, или нет")]),e._v(" "),r("h2",{attrs:{id:"saga"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#saga"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#saga",target:"_blank",rel:"noopener noreferrer"}},[e._v("Saga"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Шаблон “Saga” используется для моделирования long-running (Как это будет по-русски? Долгосрочные? Долгоиграющие?) бизнес-процессов. Фактически, мы можем сказать, что Saga представляет собой Workflow для какого-то определённого сценария.")]),e._v(" "),r("p",[e._v("Long-running не следует понимать в терминах секундной стрелки и задаваться вопросом: 200 миллисекунд – это long-running или нет? В системах с архитектурой, построенной на событиях и сообщениях подобные вопросы вряд ли имеют смысл.")]),e._v(" "),r("p",[e._v("Идея, которую реализует шаблон “Saga” проста: после каждого успешно выполненного шага мы имеем некоторое состояние, с которого можно будет продолжить исполнение процесса. Шагом является выполнение какого-то действия, реакция на какое-то событие и т.д. То есть, если мы не смогли подтвердить транзакцию в базу данных, или если вызов второго веб-сервиса завершился неудачей, у нас имеется состояние, валидное на момент до его вызова. Наш бизнес-процесс остановлен – это да, но он и не потерян. Мы можем предпринять какие-то действия и "),r("em",[e._v("продолжить")]),e._v(" процесс. Как результат – процесс просто выполнялся дольше.")]),e._v(" "),r("p",[e._v("Кроме того, имея такое состояние, мы можем легко моделировать процессы, “управляемые” событиями!")]),e._v(" "),r("h2",{attrs:{id:"inversion-of-control-dependency-inversion-dependency-injection"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#inversion-of-control-dependency-inversion-dependency-injection"}},[e._v("#")]),e._v(" "),r("a",{attrs:{href:"https://backendinterview.ru/architecture/architecturesPatterns#inversion-of-control-dependency-inversion-dependency-injection",target:"_blank",rel:"noopener noreferrer"}},[e._v("Inversion of Control, Dependency Inversion, Dependency Injection"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Инверсия управления ("),r("strong",[e._v("IoC, Inversion of Control)")]),e._v(" – это достаточно общее понятие, которое отличает библиотеку от фреймворка. Классическая модель подразумевает, что вызывающий код контролирует внешнее окружение и время и порядок вызова библиотечных методов. Однако в случае фреймворка обязанности меняются местами: фреймворк предоставляет некоторые точки расширения, через которые он вызывает определенные методы пользовательского кода.")]),e._v(" "),r("p",[e._v("Инверсия управления в ооп, иначе инверсия зависимостей("),r("strong",[e._v("DI, dependency inversion")]),e._v(")— важный принцип объектно-ориентированного программирования, используемый для уменьшения coupling в компьютерных программах. Есть два паттерна реализации DI:")]),e._v(" "),r("ul",[r("li",[e._v("Суть паттерна "),r("strong",[e._v("Service Locator")]),e._v(" сводится к тому, что вместо создания конкретных объектов («сервисов») напрямую с помощью ключевого слова "),r("strong",[e._v("new")]),e._v(", мы будем использовать специальный «фабричный» объект, который будет отвечать за инициализацию и предоставление всех сервисов.")]),e._v(" "),r("li",[r("strong",[e._v("Внедрение зависимости")]),e._v(" (Dependency injection, DI) — Внедрение зависимостей (DI, Dependency Injection) – это механизм передачи классу его зависимостей. Существует несколько конкретных видов или паттернов внедрения зависимостей: внедрение зависимости через конструктор ("),r("a",{attrs:{href:"http://sergeyteplyakov.blogspot.com/2012/12/di-constructor-injection.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Constructor Injection"),r("OutboundLink")],1),e._v("), через метод ("),r("a",{attrs:{href:"http://sergeyteplyakov.blogspot.com/2013/02/di-method-injection.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Method Injection"),r("OutboundLink")],1),e._v(") и через свойство ("),r("a",{attrs:{href:"http://sergeyteplyakov.blogspot.com/2013/01/di-property-injection.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Property Injection"),r("OutboundLink")],1),e._v("). В полном соответствии с принципом единой обязанности объект отдаёт заботу о построении требуемых ему зависимостей внешнему, специально предназначенному для этого общему механизму, и не дергает никаких контейнеров/фабрик/реестров для получения нужных сервисов самостоятельно(в этом ключевое отличие от "),r("strong",[e._v("Service Locator")]),e._v(").")])]),e._v(" "),r("p",[r("strong",[e._v("Dependency Inversion Principe(DIP)")])]),e._v(" "),r("p",[e._v("Модули верхнего уровня не должны зависеть от модулей нижнего уровня. И те, и другие должны зависеть от абстракции. Абстракции не должны зависеть от деталей. Детали должны зависеть от абстракций.")])])}),[],!1,null,null,null);r.default=a.exports}}]);