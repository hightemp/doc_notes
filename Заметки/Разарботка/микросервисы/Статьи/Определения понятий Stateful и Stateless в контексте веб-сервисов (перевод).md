https://medium.com/@ermakovichdmitriy/%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE%D0%BD%D1%8F%D1%82%D0%B8%D0%B9-stateful-%D0%B8-stateless-%D0%B2-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B5-%D0%B2%D0%B5%D0%B1-%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BE%D0%B2-%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4-18a910a226a1

_Оригинал статьи:_ [_https://nordicapis.com/defining-stateful-vs-stateless-web-services/_](https://nordicapis.com/defining-stateful-vs-stateless-web-services/)

Как и другие отрасли, отрасль проектирования API имеет свой собственный жаргон. Многие термины используются так часто, что довольно распространено предположение о том, что собеседник сразу поймет, о чем говорит профессионал. Но для новичков эти тонкие определения могут быть не такими очевидными.

Представим разницу между stateless и stateful: существует большое различие в разработке API и сервисов, основанных на этих системах. Соответственно, в этом фрагменте мы кратко обсудим, что на самом деле означают эти термины. Мы рассмотрим, что делает концепции stateful и stateless настолько отличными друг от друга, и что на самом деле они означают с точки зрения API.

# Stateful

Чтобы понять концепцию stateless, нужно сначала понимать концепцию stateful. Когда мы говорим о компьютерных системах, «состояние»(state) — это просто положение или качество объекта в определенный момент времени, и, чтобы быть в соответствии с концепцией stateful, нужно полагаться на состояние объекта во времени и изменять результат, учитывая определенные входные данные и состояние.

Если все еще не понятно, не волнуйтесь — это сложная концепция, и ее вдвойне сложнее понять в контексте разработки API. Мы можем развить эту концепцию — рассмотрим бинарный язык единиц(1) и нулей(0). Значения функционально представляют либо “включить” либо “выключить” — состояние не может быть одновременно и 1 и 0, эти значения являются взаимоисключающими.

Теперь рассмотрим теоретическую ситуацию, когда вам дается лист бумаги с этими простыми инструкциями — «если число равно 0, то скажите нет, если же равно 1, скажите да». Вы попали в комнату с бинарным дисплеем, который изменялся между цифрами 0 и 1 каждые пять секунд.

Это система с сохранением состояния. Ваш ответ будет полностью зависеть от того, указывают ли часы на «0» или «1» — вы не можете отвечать независимо от состояния крупной машины. Это пример концепции statefulness (наличие состояния).

# Веб-сервисы, сохраняющие состояние

Имея вышеописанное в виду, как выглядит веб-сервис с сохранением состояния? Допустим, вы входите в ресурс, и при этом вы передаете свой пароль и имя пользователя. Если веб-сервис хранит эти данные в серверной части и использует его для идентификации вас как постоянно подключенного клиента, то это stateful сервис. Имейте в виду, что это очень частный пример, который существует в других формах, поэтому то, что кажется stateful, может не обязательно быть stateful — рассмотрим это подробнее в дальнейшем.

Когда вы используете веб-сервис, все, что вы делаете, отражается в сохраненном состоянии. Когда вы запрашиваете сводку учетной записи, веб-сервис запрашивает две вещи:

-   Кто делает этот запрос?
-   Используя сохраненный ID того, кто делает этот запрос, как должна выглядеть веб-страница?

В таком веб-сервисе, как этот, ответ, сформированный из простого запроса **GET**, полностью зависит от состояния, зарегистрированного сервером. Без знания этого состояния ответ на ваш запрос не может быть возвращен должным образом.

Еще один замечательный пример — FTP. Когда пользователь входит на традиционный FTP-сервер, он подключается к активному соединению с сервером. Каждое изменение состояния пользователя, например запись об активном каталоге, хранится на сервере как состояние клиента. Каждое изменение, внесенное на сервер, регистрируется как изменение состояния, и когда пользователь отключается, его состояние дополнительно изменяется на отсоединенное.

Пока все хорошо, правда? Ну, не совсем. Программирование с сохранением состояния хорошая практика только в некоторых очень ограниченных приложениях, такой подход **может создавать много проблем**. Прежде всего, когда вам нужно ссылаться на состояние, у вас появляется множество незавершенных сессий и транзакций. Предположим, вы отправляете запрос, чтобы получить определенную часть данных. Как долго сервис должен оставлять ваше соединение открытым, в системе, где состояние определяется клиентом? Как проверить, был ли клиент «разбит» или отключен? Как мы отслеживаем действия пользователя, сохраняя при этом возможность документировать изменения и откатываться, когда это необходимо?

Хотя существуют обходные пути для всех этих вопросов, чаще всего, сохранение состояния реально полезно, только если сами функции зависят от состояния. Большинство пользователей могут взаимодействовать с веб-сервисом различными способами, и поэтому сохранение состояния сервера не зависит от приложения-клиента, так как если клиент не может реализовать функционал сервиса, то и **в сохранении состояния** **нет никакой необходимости**.

Читайте также: [Designing a True REST State Machine](http://nordicapis.com/designing-a-true-rest-state-machine/)

# Stateless

Ответ на эти вопросы — отсутствие состояния. Stateless — это противоположность stateful, в которой любой ответ сервера **не зависит от какого-либо состояния**.

Вернемся к этой бинарной теореме. Вам даются те же двоичные часы, только на этот раз на бумаге просто написано имя — «Джек» — и инструкция велит произносить это имя, когда кто-то говорит пароль — «рыба». Вы сидите, наблюдая, как часы медленно изменяются, и каждый раз, когда кто-то говорит специальный пароль, вы произносите имя «Джек».

Это пример отсутствия сохранения состояния (**statelessness**) — нет необходимости даже ссылаться на часы, потому что информация хранится локально таким образом, чтобы **запросы были автономными** — это зависит только от данных, которые вы предоставляете. Спикер мог легко сказать секретное слово, сказать вам изменить имя, а затем уйти. Он может вернуться через час, сказать секретный пароль и получить новое имя — все содержится в запросе и обрабатывается в двух отдельных этапах, с «запросом» и с «ответом».

Это система без сохранения состояния. Ваш ответ не зависит от «0» или «1», и каждый запрос является автономным.

# Веб-сервисы без сохранения состояния

**Statelessness** является фундаментальным аспектом современного Интернета настолько, что каждый день вы используете целый перечень различных служб и приложений без сохранения состояния. Когда вы читаете новости, вы используете протокол HTTP для подключения в манере отсутствия состояния, используя сообщения, которые могут быть проанализированы и обработаны изолированно друг от друга и вашего состояния.

Если у вас есть Twitter на телефоне, вы постоянно используете stateless сервис. Когда сервис запрашивает список последних личных сообщений, используя Twitter REST API, он формирует следующий запрос:

GET [https://api.twitter.com/1.1/direct_messages.json?since_id=240136](https://api.twitter.com/1.1/direct_messages.json?since_id=240136)

Ответ, который вы получите, полностью независим от любого хранилища состояний на сервере, и все хранится на стороне клиента в виде кеша.

Давайте посмотрим на другой пример. В приведенном ниже примере мы формируем POST запрос, создавая запись в HypotheticalService:

В этом примере мы создаем запись, но однако она **не зависит от какого-либо состояния**. Имейте в виду, что это простой вариант использования, поскольку он не передает никаких данных авторизации/аутентификации, а сам POST запрос содержит только очень простые данные.

Даже имея в виду все это, вы можете ясно видеть, что выполнение POST без учета состояния означает, что вам не нужно ждать синхронизации сервера, чтобы обеспечить надлежащее завершение процесса, как с FTP или другими службами с сохранением состояния. Вы получаете подтверждение запроса от сервера, но это подтверждение — просто положительный ответ, а не взаимно разделяемое состояние.

Вкратце можно сказать, что [REST](http://nordicapis.com/top-specification-formats-for-rest-apis/) специально разработан как **функционально не имеющий состояния**. Вся концепция «передачи репрезентативного состояния» (из которой стиль REST получил свое название) зависит от идеи передачи всех данных для обработки запроса таким образом, чтобы передавать необходимые данные в самом запросе. Таким образом, **REST следует считать stateless** (и, на самом деле, это одно из основных соображений относительно того, является ли что-то RESTful или нет в соответствии с [оригинальной диссертацией Роя Филдинга, в которой подробно изложена концепция](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)).

Также можете сверить: [Common Instances of unRESTful APIs, and What Really Matters](http://nordicapis.com/the-api-that-defied-rest-most-common-instances-of-unrestful-apis-and-what-really-matters/)

# Обман и неразбериха

Мы должны быть несколько осторожны, когда мы говорим о веб-сервисах как о примерах stateful или stateless, поскольку то, что, по-видимому, относится к одной категории, на самом деле может быть не так. Это в значительной степени связано с тем, что stateless сервисы сумели скопировать поведение, присущее stateful сервисам без, технически, «пересечения линии».

Statelessness, как и наш пример выше, относится к внутреннему состоянию клиента и ссылке, а не к внешнему хранению состояния. Разница между этой концепцией и ее противоположностью statefulness — это то, где хранится состояние. Когда мы читаем что-нибудь в Интернете или проверяем свою почту, мы генерируем состояние, и это состояние будет куда-то отсылаться.

Когда состояние хранится на сервере, оно генерирует сессию. Это — stateful. Когда состояние хранится клиентом, оно генерирует какие-то данные, которые будут использоваться для различных систем — в то время как, технически, это «stateful» в том, что существует состояние, однако состояние хранится клиентом, поэтому мы называет это stateless.

Это кажется запутанным, но на самом деле это лучший способ обойти ограничения концепции stateless. В чистой stateless системе мы, по существу, взаимодействуем с **ограниченной системой** — когда мы планировали бы заказать что-нибудь онлайн, система не хранила бы наш адрес, наши способы оплаты, даже запись нашего заказа, она просто обрабатывала бы наши платежи, и мы бы не думали, насколько это касается сервера.

Это, очевидно, не лучший сценарий, и поэтому мы сделали некоторые уступки. В клиентском куки(cookie) мы храним некоторые базовые данные аутентификации. На стороне сервера мы создаем временные данные клиента или сохраняем в базе данных и ссылаемся на такой внешний фрагмент данных. Когда мы возвращаемся, чтобы сделать еще один платеж, для идентификации состояния используется наш файл cookie, а не несуществующая сессия.

# Что плохого в сессиях?

Что касается веб-сервисов, общепринятая парадигма заключается в том, чтобы **избегать сессий** любой ценой. Хотя это, безусловно, не относится ко всем вариантам использования, использование сессий как метода для передачи состояния обычно является тем, чего вы хотите избежать.

Начнем с того, что сессии добавляют большое количество сложности, принося очень небольшую выгоду. Сессии затрудняют воспроизведение и исправление ошибок. В системе с использованием сессий нельзя добавить некоторые страницы в закладки, так как все хранится на стороне сервера. Все это важные проблемы, но они блекнут по сравнению с простым фактом, что **сессии не масштабируемы**.

Грегор Риглер в BeABetterDeveloper дал прекрасное объяснение, почему так в его этюде [«Sessions, a Pitfall»](http://www.beabetterdeveloper.com/2013/11/sessions-pitfall.html):

> Допустим, вы профессиональный игрок в шахматы, и вы хотели бы сыграть одновременно против нескольких людей. Если вы попытаетесь запомнить каждую игру и свою стратегию на ней, вы довольно быстро достигните своего порога запоминания информации. Теперь представьте, что вы не помнили ничего из этих игр, и вы просто перечитывали шахматную доску на каждом шагу. В то же время вы могли играть буквально против 1.000.000 человек, и это не имело бы для вас никакого значения.
> 
> Теперь нарисуйте аналогию с вашим сервером. Если ваше приложение перегружено, вам, возможно, придется распространять его на разные серверы. Если вы использовали сессии, вам вдруг пришлось реплицировать все сессии на все серверы. Система станет еще более сложной и подверженной ошибкам.

Проще говоря, сессии не делают то, для чего они предназначены, без тонны накладных расходов(**overhead**), и их функциональность может быть легко реплицирована с помощью файлов cookie, кэширования клиентов и других подобных решений. Есть, конечно, ситуации, в которых сессии имеют смысл, особенно когда серверы хотели сохранить состояние, не имея даже незначительной возможности изменения данных клиента во время выполнения.

Например, FTP является stateful по очень веской причине, поскольку он реплицирует изменения как на стороне клиента, так и на стороне сервера, обеспечивая повышенную безопасность из-за характера запрашиваемого доступа. Это выполнимо, потому что одному человеку требуется доступ к одному серверу для одного заявленного переноса данных, даже если передача включает в себя несколько папок, файлов и каталогов.

Это не так с чем-то вроде группового Dropbox, в котором stateful сессии могут вызвать дополнительную сложность без добавления какого-либо преимущества. В этом случае, концепция stateless будет гораздо лучшим выбором.

# Заключение

Мы надеемся, что это прояснило разницу между концепциями stateful и stateless, когда дело доходит до API. Понимание этой простой концепции — фундамент, на котором основано большинство архитектур и конструкций. Такая концепция, как RESTful design, основана на этих идеях, поэтому наличие концептуального понимания данных идей чрезвычайно важно для современного разработчика.