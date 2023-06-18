(window.webpackJsonp=window.webpackJsonp||[]).push([[102],{374:function(v,_,t){"use strict";t.r(_);var i=t(14),s=Object(i.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("p",[v._v("https://medium.com/geekculture/linux-networking-deep-dive-731848d791c0")]),v._v(" "),_("h1",{attrs:{id:"linux-глубокое-погружение-в-сеть"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#linux-глубокое-погружение-в-сеть"}},[v._v("#")]),v._v(" Linux — глубокое погружение в сеть")]),v._v(" "),_("p",[v._v("Вы знаете, как работает сетевой процесс Linux?")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*Fg2E4bYl1PN6gDeYvsK7Aw.png",alt:""}})]),v._v(" "),_("p",[v._v("Как и ЦП, память и ввод-вывод, сеть является основной функцией системы Linux. Сеть — это технология, которая соединяет различные компьютеры или сетевые устройства вместе.")]),v._v(" "),_("p",[v._v("По сути, это метод межпроцессного взаимодействия, особенно межпроцессное взаимодействие между системами, которое должно осуществляться через сеть.")]),v._v(" "),_("p",[v._v("С популяризацией таких технологий, как высокий параллелизм, распределение, облачные вычисления и микросервисы, хорошее понимание производительности сети становится все более и более важным.")]),v._v(" "),_("h1",{attrs:{id:"сетевая-модель"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#сетевая-модель"}},[v._v("#")]),v._v(" Сетевая модель")]),v._v(" "),_("p",[v._v("Когда дело доходит до сетей, я думаю, вы часто слышали о 7-уровневой модели OSI, 4-уровневой традиционной модели TCP/IP или 5-уровневой новой модели TCP/IP.")]),v._v(" "),_("p",[v._v("Фактически сетевая модель TCP/IP является производной от сетевой модели OSI (открытое системное взаимодействие). Чтобы решить проблему совместимости разнородных устройств в сетевом соединении и разделить сложный процесс обработки сетевых пакетов, модель OSI делит структуру сетевого соединения на следующие 7 уровней:")]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("Приложение")]),v._v(" : отвечает за предоставление унифицированного интерфейса для приложений.")]),v._v(" "),_("li",[_("strong",[v._v("Презентация")]),v._v(" : отвечает за преобразование данных в формат, совместимый с принимающей системой.")]),v._v(" "),_("li",[_("strong",[v._v("Сеанс")]),v._v(" : отвечает за поддержание коммуникационных соединений между хостами.")]),v._v(" "),_("li",[_("strong",[v._v("Транспорт")]),v._v(" : отвечает за добавление транспортного заголовка к данным для формирования пакета данных.")]),v._v(" "),_("li",[_("strong",[v._v("Сеть")]),v._v(" : отвечает за маршрутизацию и пересылку данных.")]),v._v(" "),_("li",[_("strong",[v._v("Канал передачи")]),v._v(" "),_("strong",[v._v("данных")]),v._v(" : отвечает за MAC-адресацию, обнаружение и исправление ошибок.")]),v._v(" "),_("li",[_("strong",[v._v("Физический")]),v._v(" : отвечает за передачу кадров данных в физической сети.")])]),v._v(" "),_("p",[v._v("Но модель OSI все еще слишком сложна, чтобы обеспечить достижимый подход. Итак, в Linux мы на самом деле используем другую, более практичную пятиуровневую модель (старая модель — четыре уровня), сетевую модель TCP/IP.")]),v._v(" "),_("p",[v._v("Схема отображения выглядит следующим образом:")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*LcGaDm_ZOCbrIerM2UDj0g.png",alt:""}})]),v._v(" "),_("h1",{attrs:{id:"сетевои-стек-linux"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#сетевои-стек-linux"}},[v._v("#")]),v._v(" Сетевой стек Linux")]),v._v(" "),_("p",[v._v("В модели TCP/IP во время передачи по сети пакеты данных будут обрабатываться слой за слоем в соответствии со стеком протоколов, а заголовок протокола верхнего уровня будет инкапсулирован и отправлен на следующий уровень.")]),v._v(" "),_("p",[v._v("Конечно, логика обработки сетевых пакетов на каждом уровне зависит от фактического сетевого протокола. Например, на прикладном уровне приложение, предоставляющее REST API, может использовать протокол HTTP, инкапсулировать данные JSON, необходимые для передачи, в протокол HTTP, а затем передавать их на уровень TCP.")]),v._v(" "),_("p",[v._v("Инкапсуляция очень проста, просто добавьте метаданные фиксированного формата до и после исходной загрузки, и исходные данные загрузки не будут изменены. Как показано на следующей диаграмме:")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*oX8ySayqkY9o0enLDPE_zQ.png",alt:""}})]),v._v(" "),_("p",[v._v("Как видите, новые заголовки и трейлеры увеличивают размер сетевых пакетов, но все мы знаем, что пакеты данных произвольного размера нельзя передавать по физическим каналам. Максимальная единица передачи (MTU), настроенная на сетевом интерфейсе, определяет максимальный размер IP-пакета. MTU по умолчанию обычно составляет 1500 байт.")]),v._v(" "),_("p",[v._v("Как только пакет превышает размер MTU, он будет фрагментирован на сетевом уровне, чтобы гарантировать, что размер фрагментированного IP-пакета не превышает MTU.")]),v._v(" "),_("p",[v._v("После понимания сетевой модели TCP/IP и принципа инкапсуляции сетевых пакетов вы легко можете подумать, что сетевой стек в ядре Linux на самом деле похож на пятиуровневую структуру TCP/IP. Как показано на следующем рисунке, это схематическая диаграмма общего стека IP-сети Linux:")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*GGOBF1fvc_QW3-yzpHPQGg.png",alt:""}})]),v._v(" "),_("p",[v._v("Давайте посмотрим на этот сетевой стек сверху вниз:")]),v._v(" "),_("ul",[_("li",[v._v("Приложение верхнего уровня должно взаимодействовать с интерфейсом сокета через системные вызовы.")]),v._v(" "),_("li",[v._v("Ниже сокета находится транспортный уровень, сетевой уровень")]),v._v(" "),_("li",[v._v("Нижний уровень — это драйвер сетевой карты и физическое устройство сетевой карты.")])]),v._v(" "),_("p",[v._v("Сетевая карта — это основное устройство для отправки и получения сетевых пакетов. Во время запуска системы сетевая карта регистрируется в системе через драйвер сетевой карты в ядре. В процессе сетевой передачи и приема ядро ​​взаимодействует с сетевой картой через прерывания.")]),v._v(" "),_("p",[v._v("В сочетании с упомянутым выше сетевым стеком Linux можно увидеть, что обработка сетевых пакетов очень сложна. Следовательно, аппаратное прерывание сетевой карты обрабатывает только чтение или отправку основных данных сетевой карты, и большая часть логики в стеке протоколов будет помещена в мягкое прерывание для обработки.")]),v._v(" "),_("h1",{attrs:{id:"сетевои-процесс-linux"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#сетевои-процесс-linux"}},[v._v("#")]),v._v(" Сетевой процесс Linux")]),v._v(" "),_("p",[v._v("Разобравшись с сетевым стеком Linux, давайте посмотрим, как Linux отправляет и получает сетевые пакеты.")]),v._v(" "),_("h2",{attrs:{id:"получение-сетевых-пакетов"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#получение-сетевых-пакетов"}},[v._v("#")]),v._v(" Получение сетевых пакетов")]),v._v(" "),_("p",[v._v("Когда сетевой кадр поступает на сетевую карту, сетевая карта помещает сетевой пакет в очередь приема пакетов через DMA (прямой доступ к памяти); а затем сообщить обработчику прерывания, что сетевой пакет был получен через аппаратное прерывание.")]),v._v(" "),_("p",[v._v("Далее стек протоколов ядра извлекает сетевой фрейм из буфера и обрабатывает сетевой фрейм слой за слоем снизу вверх через сетевой стек:")]),v._v(" "),_("ul",[_("li",[v._v("Проверьте достоверность пакета на канальном уровне, определите тип сетевого протокола (IPv4 или IPv6), затем удалите заголовок и трейлер кадра и передайте его на сетевой уровень.")]),v._v(" "),_("li",[v._v("Сетевой уровень извлекает заголовок IP и определяет следующее направление сетевого пакета, например, передать ли его транспортному уровню или переслать. Если пакет остается на локальном компьютере, он удаляет заголовок IP и передает его на транспортный уровень.")]),v._v(" "),_("li",[v._v("После того, как транспортный уровень извлекает заголовок TCP/UDP, он находит соответствующий сокет в соответствии с четырехкратным идентификатором <исходный IP, исходный порт, целевой IP, целевой порт>, а затем копирует данные в приемный буфер сокета.")]),v._v(" "),_("li",[v._v("Наконец, приложение может использовать интерфейс сокета для чтения данных.")])]),v._v(" "),_("p",[v._v("Я обобщил описанный выше процесс на следующем графике, чтобы помочь вам лучше понять процесс.")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*e9YmYFnsU58ZuMSmFjWySA.png",alt:""}})]),v._v(" "),_("h2",{attrs:{id:"отправка-сетевых-пакетов"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#отправка-сетевых-пакетов"}},[v._v("#")]),v._v(" Отправка сетевых пакетов")]),v._v(" "),_("p",[v._v("Поняв процесс получения сетевых пакетов, легко понять процесс отправки.")]),v._v(" "),_("ul",[_("li",[v._v("Сначала приложение вызывает API сокетов для отправки сетевых пакетов.")]),v._v(" "),_("li",[v._v("Поскольку это системный вызов, он будет перехвачен на уровне сокетов режима ядра. Уровень сокета поместит пакет данных в буфер отправки сокета.")]),v._v(" "),_("li",[v._v("Затем сетевой стек извлекает пакет данных из буфера отправки сокета, а затем обрабатывает его слой за слоем в соответствии со стеком TCP/IP.")]),v._v(" "),_("li",[v._v("Транспортный уровень добавляет к пакету TCP-заголовок.")]),v._v(" "),_("li",[v._v("Сетевой уровень добавляет к пакету IP-заголовок и выполняет фрагментацию в соответствии с размером MTU.")]),v._v(" "),_("li",[v._v("Фрагментированные сетевые пакеты отправляются на уровень канала передачи данных, который обращается к MAC-адресу и добавляет заголовок и конец кадра, кадр будет помещен в очередь отправки.")]),v._v(" "),_("li",[v._v("Затем канальный уровень инициирует мягкое прерывание, уведомляющее драйвер сетевой карты о появлении новых сетевых кадров в очереди пакетов.")]),v._v(" "),_("li",[v._v("Драйвер сетевой карты считывает сетевой кадр из очереди отправки пакетов через DMA и отправляет его через физическую сетевую карту.")])]),v._v(" "),_("h1",{attrs:{id:"заключение"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#заключение"}},[v._v("#")]),v._v(" Заключение")]),v._v(" "),_("p",[v._v("Несколько серверов соединены друг с другом через сетевые устройства, такие как сетевые карты, коммутаторы и маршрутизаторы, для формирования взаимосвязанной сети. Из-за неоднородности сетевых устройств и сложности сетевых протоколов Международная организация по стандартизации определила семиуровневую сетевую модель OSI, но эта модель слишком сложна. Стандартом де-факто на практике является более практичная модель TCP/IP.")]),v._v(" "),_("p",[v._v("Модель TCP/IP делит структуру сетевого взаимодействия на пять уровней: прикладной уровень, транспортный уровень, сетевой уровень, уровень канала передачи данных и физический уровень, которые также являются основными компонентами сетевого стека Linux:")]),v._v(" "),_("ul",[_("li",[v._v("Прикладная программа отправляет пакеты данных через интерфейс сокета, которые должны быть обработаны слой за слоем сверху вниз в стеке сетевых протоколов и, наконец, отправлены на сетевую карту для отправки.")]),v._v(" "),_("li",[v._v("При получении он также обрабатывается слой за слоем снизу вверх сетевого стека, прежде чем окончательно отправится в приложение.")])])])}),[],!1,null,null,null);_.default=s.exports}}]);