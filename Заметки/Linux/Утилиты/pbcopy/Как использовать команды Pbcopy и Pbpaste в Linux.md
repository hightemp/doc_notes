Поскольку Linux и Mac OS X являются системами на основе Nix, многие команды будут работать на обеих платформах.

Однако некоторые команды могут отсутствовать на обеих платформах, например pbcopy и pbpaste.

Эти команды доступны исключительно на платформе Mac OS X.

Команда Pbcopy скопирует стандартный ввод в буфер обмена.

Затем вы можете вставить содержимое буфера обмена, используя команду Pbpaste везде, где хотите.

Конечно, могут быть некоторые альтернативы Linux для вышеупомянутых команд, например Xclip. Xclip будет делать то же самое, что и Pbcopy.

Но дистрибутор-хопперы, которые перешли на Linux из Mac OS, пропустили бы эту командную пару и по-прежнему предпочитают использовать их.

В этом кратком руководстве описывается использование команд Pbcopy и Pbpaste в Linux.

### Установите Xclip / Xsel

Как я уже сказал, команды Pbcopy и Pbpaste недоступны в Linux.

Однако мы можем реплицировать функции команд pbcopy и pbpaste с помощью команд Xclip и / или Xsel с помощью сглаживания оболочки.

Оба пакета Xclip и Xsel доступны в репозиториях по умолчанию для большинства дистрибутивов Linux.

Обратите внимание, что вам не нужно устанавливать обе утилиты.

Просто установите любую из указанных выше утилит.

Чтобы установить их на Arch Linux и ее производные, запустите:

$ sudo pacman xclip xsel

На Fedora:

$ sudo dnf xclip xsel

На Debian, Ubuntu, Linux Mint:

$ sudo apt install xclip xsel

После установки вам необходимо создать псевдонимы для команд pbcopy и pbpaste. Для этого отредактируйте файл ~ / .bashrc:

$ vi ~/.bashrc

Если вы хотите использовать Xclip, вставьте следующие строки:

alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'

Если вы хотите использовать xsel, вставьте следующие строки в файл ~ / .bashrc.

alias pbcopy='xsel --clipboard --input'
alias pbpaste='xsel --clipboard --output'

Сохраните и закройте файл.

Затем запустите следующую команду, чтобы обновить изменения в файле ~ / .bashrc.

$ source ~/.bashrc

Пользователи ZSH вставляют вышеуказанные строки в файл ~ / .zshrc.

### Использование команды Pbcopy и Pbpaste в Linux

Рассмотрим некоторые примеры.

Команда pbcopy скопирует текст из stdin в буфер буфера обмена.

Например, посмотрите на следующий пример.

$ echo "Welcome To itisgood!" | pbcopy

Вышеупомянутая команда скопирует текст “welcome to itisgood” в буфер обмена.

Вы можете получить доступ к этому контенту позже и вставить их в любом месте, используя команду Pbpaste, как показано ниже.

$ echo \`pbpaste\`
Welcome To itisgood!

<img class="alignnone  wp-image-1737" src=":/6b33e1b882ce4986881c3db9286114f6" alt="" width="728" height="376" srcset="https://itisgood.ru/wp-content/uploads/2018/07/1-62-300x154.png 300w, https://itisgood.ru/wp-content/uploads/2018/07/1-62-585x301.png 585w" sizes="(max-width: 728px) 100vw, 728px" style="user-select: text !important; box-sizing: border-box; outline: none; margin: 5px 20px 20px 0px; padding: 0px; height: auto; max-width: 100%; border: 0px; vertical-align: top;">

Вот некоторые другие варианты использования.

У меня есть файл с именем file.txt со следующим содержимым.

**$ cat file.txt** 
Welcome To itisgood!

Вы можете напрямую скопировать содержимое файла в буфер обмена, как показано ниже.

$ pbcopy < file.txt

Теперь содержимое файла доступно в буфере обмена, если вы обновили содержимое другого файла.

Чтобы получить содержимое из буфера обмена, просто введите:

**$ pbpaste** 
Welcome To itisgood!

Вы также можете отправить вывод любой команды Linux на клипбоард с использованием символа конвейера

Посмотрите следующий пример.

$ ps aux | pbcopy

Теперь введите команду «pbpaste» в любое время, чтобы отобразить вывод команды «ps aux» из буфера обмена.

$ pbpaste

<img class="alignnone  wp-image-1738" src=":/39e00dad35d14515acb348c8b97223a7" alt="" width="866" height="453" srcset="https://itisgood.ru/wp-content/uploads/2018/07/2-12-300x157.png 300w, https://itisgood.ru/wp-content/uploads/2018/07/2-12-1024x537.png 1024w, https://itisgood.ru/wp-content/uploads/2018/07/2-12-768x403.png 768w, https://itisgood.ru/wp-content/uploads/2018/07/2-12-1170x614.png 1170w, https://itisgood.ru/wp-content/uploads/2018/07/2-12-585x307.png 585w" sizes="(max-width: 866px) 100vw, 866px" style="user-select: text !important; box-sizing: border-box; outline: none; margin: 5px 20px 20px 0px; padding: 0px; height: auto; max-width: 100%; border: 0px; vertical-align: top;">

Существует гораздо больше возможностей с командами Pbcopy и Pbpaste.

Надеюсь, теперь у вас есть общее представление об этих командах.