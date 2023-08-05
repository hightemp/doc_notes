(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{348:function(t,r,a){"use strict";a.r(r);var e=a(14),s=Object(e.a)({},(function(){var t=this,r=t._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("p",[t._v("https://ordanax.github.io/i3wm_polybar")]),t._v(" "),r("h1",{attrs:{id:"установка-и-настроика-i3wm-c-polybar"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#установка-и-настроика-i3wm-c-polybar"}},[t._v("#")]),t._v(" Установка и настройка i3wm c polybar")]),t._v(" "),r("p",[t._v("В "),r("a",{attrs:{href:"https://ordanax.github.io/i3wm",target:"_blank",rel:"noopener noreferrer"}},[t._v("прошлой статье"),r("OutboundLink")],1),t._v(" я рассказывал об минимальной установке и настройка i3wm с i3status. В этой статье мы копнем немного глубже, установим и на строим i3wm c polybar. Так же установим необходимые скрипты. Заменим привычный pamac на упрощенный индикатор обновлений.")]),t._v(" "),r("h1",{attrs:{id:"установка-и-настроика-i3wm-polybar"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#установка-и-настроика-i3wm-polybar"}},[t._v("#")]),t._v(" Установка и настройка i3wm + polybar")]),t._v(" "),r("h2",{attrs:{id:"ссылки"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ссылки"}},[t._v("#")]),t._v(" Ссылки")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://i3wm.org/docs/userguide.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Официальная документация по i3wm"),r("OutboundLink")],1),r("br"),t._v(" "),r("a",{attrs:{href:"https://wiki.archlinux.org/index.php/i3_%28%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%29",target:"_blank",rel:"noopener noreferrer"}},[t._v("i3wm в ArchWiki"),r("OutboundLink")],1),r("br"),t._v(" "),r("a",{attrs:{href:"https://github.com/polybar/polybar/wiki",target:"_blank",rel:"noopener noreferrer"}},[t._v("Wiki по Polybar"),r("OutboundLink")],1),r("br"),t._v(" "),r("a",{attrs:{href:"https://github.com/ordanax/dots/tree/master/3wm_v_3",target:"_blank",rel:"noopener noreferrer"}},[t._v("Мой конфиг с пояснениями внутри"),r("OutboundLink")],1)]),t._v(" "),r("p",[r("strong",[t._v("Нам понадобится:")]),r("br"),t._v("\n1. "),r("strong",[t._v("i3wm")]),t._v(" — оконный менеджер или его форк (ответвление) i3-gaps"),r("br"),t._v("\n2. "),r("strong",[t._v("Polybar")]),t._v(" — наша панелька"),r("br"),t._v("\n3. "),r("strong",[t._v("dmenu")]),t._v(" — утилита для запуска программ"),r("br"),t._v("\n4. "),r("strong",[t._v("ttf-font-awesome")]),t._v(" — шрифтовые иконки"),r("br"),t._v("\n5. "),r("strong",[t._v("feh")]),t._v(" — установка обоины на рабочий стол"),r("br"),t._v("\n6. "),r("strong",[t._v("pcmanfm")]),t._v(" — файловый менеджер"),r("br"),t._v("\n7. "),r("strong",[t._v("gvfs")]),t._v(" и "),r("strong",[t._v("udiskie")]),t._v(" — для авто монтирования внешних дисков"),r("br"),t._v("\n8. "),r("strong",[t._v("xorg-xbacklight")]),t._v(" — для управлением яркостью экрана. (На AMD не работает, нужно "),r("strong",[t._v("brightnessctl")]),r("br"),t._v("\n9. "),r("strong",[t._v("geeqie")]),t._v(" — для просмотра фото"),r("br"),t._v("\n10. "),r("strong",[t._v("tumbler")]),t._v(" — для отображения миниатюр фото"),r("br"),t._v("\n11. "),r("strong",[t._v("sakura")]),t._v(" — терминал"),r("br"),t._v("\n12. "),r("strong",[t._v("picom")]),t._v(" — для прозрачности окон и для устранения тиринга (вместо compton)"),r("br"),t._v("\n13. "),r("strong",[t._v("ttf-weather-icons")]),t._v(" — Иконнки для скрипта погоды"),r("br"),t._v("\n14. "),r("strong",[t._v("jq")]),t._v(" — этот пакет также нужен для скрипта для отображения погоды"),r("br"),t._v("\n15. "),r("strong",[t._v("tlp")]),t._v(" — для скрипта отображения количества обновлении"),r("br"),t._v("\n16. "),r("strong",[t._v("ttf-clear-sans")]),t._v(" — хороший шрифт"),r("br"),t._v("\n17. "),r("strong",[t._v("pacman-contrib")]),t._v(" — зависимость для скрипта по обновлениям"),r("br"),t._v("\n18. "),r("strong",[t._v("playerctl")]),t._v(" — для управления горячими клавишами аудиоплеера"),r("br"),t._v("\n19. "),r("strong",[t._v("speedtest-cli")]),t._v(" - для полибар скрипта, который отображает скорость интернета"),r("br"),t._v("\n20. "),r("strong",[t._v("networkmanager")]),t._v(" - для Wi-fi")]),t._v(" "),r("h2",{attrs:{id:"ставим-необходимые-пакеты"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ставим-необходимые-пакеты"}},[t._v("#")]),t._v(" Ставим необходимые пакеты.")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("#pacman -S i3-wm dmenu pcmanfm ttf-font-awesome feh gvfs udiskie xorg-xbacklight ristretto tumbler picom jq pacman-contrib sakura speedtest-cli networkmanager\n")])])]),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("$yay -S polybar ttf-weather-icons ttf-clear-sans tlp playerctl\n")])])]),r("p",[r("strong",[t._v("Запуск автозагрузки Wi-fi апплета")])]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("systemctl enable lxdm NetworkManager\n")])])]),r("p",[r("strong",[t._v("Настройки тем делаем правкой файлов настройки GTK:")])]),t._v(" "),r("ol",[r("li",[r("p",[r("a",{attrs:{href:"https://github.com/ordanax/dots/blob/master/3wm_v_3/gtkrc-2.0.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("~/.gtkrc-2.0"),r("OutboundLink")],1),t._v(" и")])]),t._v(" "),r("li",[r("p",[r("a",{attrs:{href:"https://github.com/ordanax/dots/blob/master/3wm_v_3/gtk-3.0/settings.ini",target:"_blank",rel:"noopener noreferrer"}},[t._v("~/.config/gtk-3.0/settings.ini"),r("OutboundLink")],1)])])]),t._v(" "),r("p",[t._v("Я использовал ручную настройку, если вам больше нарвится настройка с GUI то используйте для этих целей пакет "),r("strong",[t._v("lxappearance")])]),t._v(" "),r("h2",{attrs:{id:"горячие-клавиши-для-аудиоплеера"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#горячие-клавиши-для-аудиоплеера"}},[t._v("#")]),t._v(" Горячие клавиши для аудиоплеера")]),t._v(" "),r("p",[t._v("Чтобы работли клавиши ⏮ ⏵ ⏭ нужно не забыть поставить пакет "),r("strong",[t._v("playerctl")]),t._v(" и добавить в конфиг следующий код:")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("# Media player controls\nbindsym XF86AudioPlay exec playerctl play\nbindsym XF86AudioPause exec playerctl pause\nbindsym XF86AudioNext exec playerctl next\nbindsym XF86AudioPrev exec playerctl previous\n")])])]),r("h2",{attrs:{id:"подключение-скриптов"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#подключение-скриптов"}},[t._v("#")]),t._v(" Подключение скриптов")]),t._v(" "),r("p",[t._v("В своей настройке я использовал следующие скрипты:")]),t._v(" "),r("ol",[r("li",[t._v("Скрипт погоды"),r("br"),t._v(" "),r("img",{attrs:{src:"https://ordanax.github.io/img/wheather.png",alt:"скрипт погоды"}})]),t._v(" "),r("li",[t._v("Скрипт для отображения количества обновлений в системе вместо pamac."),r("br"),t._v(" "),r("img",{attrs:{src:"https://ordanax.github.io/img/update.png",alt:"скрипт погоды"}})]),t._v(" "),r("li",[t._v("Отображения заряда батареи")]),t._v(" "),r("li",[t._v("Отображение скорости интернета")]),t._v(" "),r("li",[t._v("Отображение курса валют")])]),t._v(" "),r("p",[t._v("Эти скрипты и инструкцию к ним смотрите тут "),r("a",{attrs:{href:"https://github.com/x70b1/polybar-scripts.git",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/x70b1/polybar-scripts.git"),r("OutboundLink")],1),r("br"),t._v("\nТам большое кол-во скриптов, найдете все, что вам по душе."),r("br"),t._v("\nСкрипт по скороси интернет "),r("a",{attrs:{href:"https://github.com/ShiroUsagi-san/speedtest-polybar-module",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/ShiroUsagi-san/speedtest-polybar-module"),r("OutboundLink")],1),r("br"),t._v("\nСкрипт корса валют в моем конфиге "),r("a",{attrs:{href:"https://github.com/ordanax/dots/blob/master/polybar/scripts/btc",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/ordanax/dots/blob/master/polybar/scripts/btc"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"темы-для-polybar"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#темы-для-polybar"}},[t._v("#")]),t._v(" Темы для Polybar")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://github.com/adi1090x/polybar-themes",target:"_blank",rel:"noopener noreferrer"}},[t._v("Темы для Polybar"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"видео-демонстрация"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#видео-демонстрация"}},[t._v("#")]),t._v(" Видео демонстрация")])])}),[],!1,null,null,null);r.default=s.exports}}]);