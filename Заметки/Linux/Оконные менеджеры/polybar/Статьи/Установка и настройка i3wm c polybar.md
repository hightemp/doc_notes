https://ordanax.github.io/i3wm_polybar

# Установка и настройка i3wm c polybar

В [прошлой статье](https://ordanax.github.io/i3wm) я рассказывал об минимальной установке и настройка i3wm с i3status. В этой статье мы копнем немного глубже, установим и на строим i3wm c polybar. Так же установим необходимые скрипты. Заменим привычный pamac на упрощенный индикатор обновлений.

# Установка и настройка i3wm + polybar

## Ссылки

[Официальная документация по i3wm](https://i3wm.org/docs/userguide.html)  
[i3wm в ArchWiki](https://wiki.archlinux.org/index.php/i3_%28%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%29)  
[Wiki по Polybar](https://github.com/polybar/polybar/wiki)  
[Мой конфиг с пояснениями внутри](https://github.com/ordanax/dots/tree/master/3wm_v_3)  

**Нам понадобится:**  
1. **i3wm** — оконный менеджер или его форк (ответвление) i3-gaps  
2. **Polybar** — наша панелька  
3. **dmenu** — утилита для запуска программ  
4. **ttf-font-awesome** — шрифтовые иконки  
5. **feh** — установка обоины на рабочий стол  
6. **pcmanfm** — файловый менеджер  
7. **gvfs** и **udiskie** — для авто монтирования внешних дисков  
8. **xorg-xbacklight** — для управлением яркостью экрана. (На AMD не работает, нужно **brightnessctl**  
9. **geeqie** — для просмотра фото  
10. **tumbler** — для отображения миниатюр фото  
11. **sakura** — терминал  
12. **picom** — для прозрачности окон и для устранения тиринга (вместо compton)  
13. **ttf-weather-icons** — Иконнки для скрипта погоды  
14. **jq** — этот пакет также нужен для скрипта для отображения погоды  
15. **tlp** — для скрипта отображения количества обновлении  
16. **ttf-clear-sans** — хороший шрифт  
17. **pacman-contrib** — зависимость для скрипта по обновлениям  
18. **playerctl** — для управления горячими клавишами аудиоплеера  
19. **speedtest-cli** - для полибар скрипта, который отображает скорость интернета  
20. **networkmanager** - для Wi-fi

## Ставим необходимые пакеты.

```
#pacman -S i3-wm dmenu pcmanfm ttf-font-awesome feh gvfs udiskie xorg-xbacklight ristretto tumbler picom jq pacman-contrib sakura speedtest-cli networkmanager
```

```
$yay -S polybar ttf-weather-icons ttf-clear-sans tlp playerctl
```

**Запуск автозагрузки Wi-fi апплета**

```
systemctl enable lxdm NetworkManager
```

**Настройки тем делаем правкой файлов настройки GTK:**

1.  [~/.gtkrc-2.0](https://github.com/ordanax/dots/blob/master/3wm_v_3/gtkrc-2.0.tar.gz) и  
    
2.  [~/.config/gtk-3.0/settings.ini](https://github.com/ordanax/dots/blob/master/3wm_v_3/gtk-3.0/settings.ini)  
    

Я использовал ручную настройку, если вам больше нарвится настройка с GUI то используйте для этих целей пакет **lxappearance**

## Горячие клавиши для аудиоплеера

Чтобы работли клавиши ⏮ ⏵ ⏭ нужно не забыть поставить пакет **playerctl** и добавить в конфиг следующий код:

```
# Media player controls
bindsym XF86AudioPlay exec playerctl play
bindsym XF86AudioPause exec playerctl pause
bindsym XF86AudioNext exec playerctl next
bindsym XF86AudioPrev exec playerctl previous
```

## Подключение скриптов

В своей настройке я использовал следующие скрипты:  
1) Скрипт погоды  
![скрипт погоды](https://ordanax.github.io/img/wheather.png)  
2) Скрипт для отображения количества обновлений в системе вместо pamac.  
![скрипт погоды](https://ordanax.github.io/img/update.png)  
3) Отображения заряда батареи  
4) Отображение скорости интернета  
5) Отображение курса валют

Эти скрипты и инструкцию к ним смотрите тут [https://github.com/x70b1/polybar-scripts.git](https://github.com/x70b1/polybar-scripts.git)  
Там большое кол-во скриптов, найдете все, что вам по душе.  
Скрипт по скороси интернет [https://github.com/ShiroUsagi-san/speedtest-polybar-module](https://github.com/ShiroUsagi-san/speedtest-polybar-module)  
Скрипт корса валют в моем конфиге [https://github.com/ordanax/dots/blob/master/polybar/scripts/btc](https://github.com/ordanax/dots/blob/master/polybar/scripts/btc)

## Темы для Polybar

[Темы для Polybar](https://github.com/adi1090x/polybar-themes)  

## Видео демонстрация