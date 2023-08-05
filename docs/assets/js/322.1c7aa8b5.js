(window.webpackJsonp=window.webpackJsonp||[]).push([[322],{590:function(e,t,o){"use strict";o.r(t);var n=o(14),r=Object(n.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("ul",[t("li",[e._v("Your First Extension https://code.visualstudio.com/api/get-started/your-first-extension")]),e._v(" "),t("li",[e._v("api https://code.visualstudio.com/api")])]),e._v(" "),t("h2",{attrs:{id:"как-создавать-расширения"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#как-создавать-расширения"}},[e._v("#")]),e._v(" "),t("a",{attrs:{href:"https://code.visualstudio.com/api#how-to-build-extensions",target:"_blank",rel:"noopener noreferrer"}},[e._v("Как создавать расширения?"),t("OutboundLink")],1)]),e._v(" "),t("p",[e._v("Создание хорошего расширения может занять много времени и усилий. Вот чем может помочь каждый раздел документации по API:")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("Начало работы")]),e._v(" обучает основным понятиям создания расширений с помощью примера "),t("a",{attrs:{href:"https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample",target:"_blank",rel:"noopener noreferrer"}},[e._v("Hello World"),t("OutboundLink")],1),e._v(" .")]),e._v(" "),t("li",[t("strong",[e._v("Возможности расширений")]),e._v(" разбивают обширный API VS Code на более мелкие категории и указывают на более подробные темы.")]),e._v(" "),t("li",[t("strong",[e._v("Руководства по расширениям")]),e._v(" включают руководства и примеры кода, поясняющие особенности использования VS Code Extension API.")]),e._v(" "),t("li",[t("strong",[e._v("Рекомендации по пользовательскому интерфейсу")]),e._v(" демонстрируют лучшие практики для обеспечения удобного взаимодействия с пользователем в расширении.")]),e._v(" "),t("li",[t("strong",[e._v("Language Extensions")]),e._v(" иллюстрирует, как добавить поддержку языка программирования с помощью руководств и примеров кода.")]),e._v(" "),t("li",[t("strong",[e._v("Testing and Publishing")]),e._v(" включает в себя подробные руководства по различным темам разработки расширений, таким как "),t("a",{attrs:{href:"https://code.visualstudio.com/api/working-with-extensions/testing-extension",target:"_blank",rel:"noopener noreferrer"}},[e._v("тестирование"),t("OutboundLink")],1),e._v(" и "),t("a",{attrs:{href:"https://code.visualstudio.com/api/working-with-extensions/publishing-extension",target:"_blank",rel:"noopener noreferrer"}},[e._v("публикация"),t("OutboundLink")],1),e._v(" расширений.")]),e._v(" "),t("li",[t("strong",[e._v("Дополнительные темы")]),e._v(" объясняют расширенные концепции, такие как "),t("a",{attrs:{href:"https://code.visualstudio.com/api/advanced-topics/extension-host",target:"_blank",rel:"noopener noreferrer"}},[e._v("узел расширения"),t("OutboundLink")],1),e._v(" , "),t("a",{attrs:{href:"https://code.visualstudio.com/api/advanced-topics/remote-extensions",target:"_blank",rel:"noopener noreferrer"}},[e._v("поддержка удаленной разработки и кодовых пространств GitHub"),t("OutboundLink")],1),e._v(" , а также "),t("a",{attrs:{href:"https://code.visualstudio.com/api/advanced-topics/using-proposed-api",target:"_blank",rel:"noopener noreferrer"}},[e._v("предлагаемый API"),t("OutboundLink")],1),e._v(" .")]),e._v(" "),t("li",[t("strong",[e._v("References")]),e._v(" содержит исчерпывающие справочные материалы по "),t("a",{attrs:{href:"https://code.visualstudio.com/api/references/vscode-api",target:"_blank",rel:"noopener noreferrer"}},[e._v("VS Code API"),t("OutboundLink")],1),e._v(" , "),t("a",{attrs:{href:"https://code.visualstudio.com/api/references/contribution-points",target:"_blank",rel:"noopener noreferrer"}},[e._v("Contribution Points"),t("OutboundLink")],1),e._v(" и многим другим темам.")])]),e._v(" "),t("h2",{attrs:{id:"архитектура-и-виды-расширении"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#архитектура-и-виды-расширении"}},[e._v("#")]),e._v(" "),t("a",{attrs:{href:"https://code.visualstudio.com/api/advanced-topics/remote-extensions#architecture-and-extension-kinds",target:"_blank",rel:"noopener noreferrer"}},[e._v("Архитектура и виды расширений"),t("OutboundLink")],1)]),e._v(" "),t("p",[e._v("Чтобы сделать работу с Remote Development или Codespaces максимально прозрачной для пользователей, VS Code различает два типа расширений:")]),e._v(" "),t("ul",[t("li",[t("p",[t("strong",[e._v("Расширения пользовательского интерфейса")]),e._v(" : эти расширения вносят свой вклад в пользовательский интерфейс VS Code и всегда запускаются на локальном компьютере пользователя. Расширения пользовательского интерфейса не могут напрямую обращаться к файлам в удаленной рабочей области или запускать сценарии/инструменты, установленные в этой рабочей области или на компьютере. Примеры расширений пользовательского интерфейса включают в себя: темы, фрагменты, языковые грамматики и раскладки клавиш.")])]),e._v(" "),t("li",[t("p",[t("strong",[e._v("Расширения рабочей области")]),e._v(" : эти расширения запускаются на том же компьютере, где находится рабочая область. В локальной рабочей области расширения рабочей области запускаются на локальном компьютере. В удаленной рабочей области или при использовании Codespaces расширения рабочей области запускаются на удаленной машине/в удаленной среде. Расширения рабочей области могут обращаться к файлам в рабочей области для предоставления многофункциональных языковых служб с несколькими файлами, поддержки отладчика или выполнения сложных операций с несколькими файлами в рабочей области (либо напрямую, либо путем вызова сценариев/инструментов). Хотя расширения рабочей области не фокусируются на изменении пользовательского интерфейса, они также могут добавлять проводники, представления и другие элементы пользовательского интерфейса.")])])]),e._v(" "),t("p",[e._v("Когда пользователь устанавливает расширение, VS Code автоматически устанавливает его в нужное место в зависимости от его типа. Если расширение может работать как любой тип, VS Code попытается выбрать оптимальное для ситуации. Расширения пользовательского интерфейса запускаются на "),t("a",{attrs:{href:"https://code.visualstudio.com/api/advanced-topics/extension-host",target:"_blank",rel:"noopener noreferrer"}},[e._v("локальном хосте расширений"),t("OutboundLink")],1),e._v(" VS Code , а расширения рабочей области запускаются на "),t("strong",[e._v("удаленном хосте расширений")]),e._v(" , который находится на небольшом "),t("strong",[e._v("сервере VS Code.")]),e._v(". Чтобы обеспечить доступность последних функций клиента VS Code, сервер должен точно соответствовать версии клиента VS Code. Таким образом, сервер автоматически устанавливается (или обновляется) расширениями Remote Development или GitHub Codespaces, когда вы открываете папку в контейнере, на удаленном узле SSH, используя Codespaces или в подсистеме Windows для Linux (WSL). (VS Code также автоматически управляет запуском и остановкой сервера, поэтому пользователи не знают о его присутствии.)")]),e._v(" "),t("p",[e._v("![[Pasted image 20230220070648.png]]")]),e._v(" "),t("p",[e._v("API-интерфейсы VS Code предназначены для автоматического запуска на правильном компьютере (локальном или удаленном) при вызове как из пользовательского интерфейса, так и из расширений рабочей области. Однако если ваше расширение использует API-интерфейсы, не предоставляемые VS Code, например, использующие API-интерфейсы Node или запускающие сценарии оболочки, оно может работать неправильно при удаленном запуске. Мы рекомендуем проверить правильность работы всех функций вашего расширения как в локальной, так и в удаленной рабочей области.")])])}),[],!1,null,null,null);t.default=r.exports}}]);