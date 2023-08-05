(window.webpackJsonp=window.webpackJsonp||[]).push([[56],{329:function(t,a,s){"use strict";s.r(a);var r=s(14),e=Object(r.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("https://itsecforu.ru/2020/07/27/%F0%9F%90%A7-%D0%BA%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0-%D1%86%D0%B5%D0%BB%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-utmp-wtmp-%D0%B8-btmp-%D0%BD%D0%B0-linux/")]),t._v(" "),a("h1",{attrs:{id:"какова-цель-фаилов-utmp-wtmp-и-btmp-на-linux"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#какова-цель-фаилов-utmp-wtmp-и-btmp-на-linux"}},[t._v("#")]),t._v(" Какова цель файлов utmp, wtmp и btmp на Linux")]),t._v(" "),a("p",[t._v("АВТОРcryptopartyНА ЧТЕНИЕ2 минОПУБЛИКОВАНО27.07.2020")]),t._v(" "),a("p",[t._v("В системе Linux все записывается в файлы логов в каталоге /var/log.")]),t._v(" "),a("p",[t._v("Этот каталог содержит логи, связанные с различными сервисами и приложениями.")]),t._v(" "),a("p",[t._v("В этом каталоге у нас есть несколько файлов, таких как utmp, wtmp и btmp.")]),t._v(" "),a("p",[t._v("В отличие от файлов syslog и файлов auth.log, все эти файлы являются двоичными файлами (бинарники).")]),t._v(" "),a("p",[t._v("Таким образом, мы не можем использовать наши обычные текстовые инструменты, такие как less или grep, чтобы читать их или извлекать из них информацию.")]),t._v(" "),a("p",[t._v("Вместо этого мы будем использовать некоторые специальные инструменты, которые могут читать эти двоичные файлы.")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("utmp предоставляет вам полное представление о входе пользователей в систему, в каких терминалах, выходах из системы, системных событиях и текущем состоянии системы, времени загрузки системы (используется uptime) и т. д.")])]),t._v(" "),a("li",[a("p",[t._v("wtmp предоставляет исторические данные utmp.")])]),t._v(" "),a("li",[a("p",[t._v("btmp записывает только неудачные попытки входа в систему.")])])]),t._v(" "),a("p",[t._v("Содержание")]),t._v(" "),a("ol",[a("li",[a("a",{attrs:{href:"https://itsecforu.ru/2020/07/27/%F0%9F%90%A7-%D0%BA%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0-%D1%86%D0%B5%D0%BB%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-utmp-wtmp-%D0%B8-btmp-%D0%BD%D0%B0-linux/#komandy-w-i-who",target:"_blank",rel:"noopener noreferrer"}},[t._v("Команды w и who"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://itsecforu.ru/2020/07/27/%F0%9F%90%A7-%D0%BA%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0-%D1%86%D0%B5%D0%BB%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-utmp-wtmp-%D0%B8-btmp-%D0%BD%D0%B0-linux/#komanda-last",target:"_blank",rel:"noopener noreferrer"}},[t._v("Команда last"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://itsecforu.ru/2020/07/27/%F0%9F%90%A7-%D0%BA%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0-%D1%86%D0%B5%D0%BB%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-utmp-wtmp-%D0%B8-btmp-%D0%BD%D0%B0-linux/#komanda-lastb",target:"_blank",rel:"noopener noreferrer"}},[t._v("Команда lastb"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://itsecforu.ru/2020/07/27/%F0%9F%90%A7-%D0%BA%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0-%D1%86%D0%B5%D0%BB%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-utmp-wtmp-%D0%B8-btmp-%D0%BD%D0%B0-linux/#komanda-utmpdump",target:"_blank",rel:"noopener noreferrer"}},[t._v("Команда utmpdump"),a("OutboundLink")],1)])]),t._v(" "),a("h3",{attrs:{id:"команды-w-и-who"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#команды-w-и-who"}},[t._v("#")]),t._v(" Команды w и who")]),t._v(" "),a("p",[t._v("Команды w и who извлекают информацию о том, кто вошел в систему и что они делают, из файла /var/run/utmp.")]),t._v(" "),a("p",[t._v("Если вы хотите увидеть список пользователей, которые в данный момент вошли в систему, используйте who:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ who\ngeek    console  Jul  1 23:27\ngeek    ttys000  Jul  7 13:13\ngeek    ttys001  Jul 18 18:34\n")])])]),a("h3",{attrs:{id:"команда-last"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#команда-last"}},[t._v("#")]),t._v(" Команда last")]),t._v(" "),a("p",[t._v("Команда last предоставляет информацию о том, как пользователи вошли в систему, когда они вошли в систему, когда они вышли из системы, и т.д. :")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# last\n")])])]),a("p",[t._v("Мы также можем использовать команду last для чтения содержимого файлов wtmp, utmp и btmp.")]),t._v(" "),a("p",[t._v("Например:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# last -f /var/log/wtmp    ### \n# last -f /var/run/utmp    ### \n# last -f /var/log/btmp    ### \n")])])]),a("h3",{attrs:{id:"команда-lastb"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#команда-lastb"}},[t._v("#")]),t._v(" Команда lastb")]),t._v(" "),a("p",[t._v("Вы можете просмотреть текущую историю зарегистрированных сеансов, содержащихся в /var/run/btmp, набрав:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# lastb\n")])])]),a("h3",{attrs:{id:"команда-utmpdump"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#команда-utmpdump"}},[t._v("#")]),t._v(" Команда utmpdump")]),t._v(" "),a("p",[t._v("Теперь, учитывая, что двоичные файлы нельзя просматривать с помощью базовых команд чтения, таких как cat, less и more, и в тоже время не просто полагаться на базовые команды, такие как last, who, lastb и другие, другой подход заключается в использовании команды utmpdump:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# utmpdump /path/to/binary\n")])])]),a("p",[t._v("Поэтому, если вы хотите прочитать содержимое двоичных файлов wtmp, utmp или btmp, используйте команду:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# utmpdump /var/run/utmp\n# utmpdump /var/log/wtmp\n# utmpdump /var/log/btmp\n")])])])])}),[],!1,null,null,null);a.default=e.exports}}]);