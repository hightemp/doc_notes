## напиши таблицу список хоткеев для i3wm

Хорошо, вот таблица со списком хоткеев для i3wm:

| Хоткей                  | Описание                                                    |
|------------------------|-------------------------------------------------------------|
| `mod+Enter`            | Открыть терминал                                             |
| `mod+d`                | Запустить приложение dmenu для запуска других программ       |
| `mod+Shift+q`          | Закрыть текущее окно                                         |
| `mod+Shift+c`          | Закрыть все окна                                             |
| `mod+Shift+r`          | Перезагрузить конфигурацию i3wm                              |
| `mod+r`                | Режим изменения размеров и расположения окон                |
| `mod+1-9`              | Переключение на рабочий стол с соответствующим номером       |
| `mod+Shift+1-9`        | Переместить текущее окно на соответствующий рабочий стол    |
| `mod+Shift+space`      | Переключение между горизонтальной и вертикальной ориентацией |
| `mod+Left/Right/Up/Down` | Фокусировка на соседнем окне слева/справа/вверху/внизу   |
| `mod+Shift+Left/Right/Up/Down` | Перемещение текущего окна слева/справа/вверх/вниз |

`mod` обычно соответствует клавише `Win` или `Super`. 

Кроме того, i3wm поддерживает множество других хоткеев и комбинаций клавиш для управления окнами и рабочими столами. Чтобы узнать больше, вы можете посмотреть документацию i3wm или выполнить команду `man i3` в терминале.

## напиши плагин для i3wm который при нажатии определнных клавиш отображал  в отдельном окне список всех привязанных комбинаций клавиш к коммандам в i3wm

Для создания плагина для i3wm, который при нажатии определенных клавиш будет отображать список всех привязанных комбинаций клавиш к командам в i3wm, нужно выполнить следующие шаги:

1. Установить необходимые зависимости
Для создания плагина для i3wm нужно установить необходимые зависимости, такие как i3ipc-python и PyGObject. Их можно установить в терминале, выполнив следующую команду:
```
sudo pip install i3ipc PyGObject
```

2. Создать скрипт Python
Создайте новый файл с именем i3-keybindings.py и добавьте следующий код:

```python
#!/usr/bin/env python3

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk
import i3ipc

class KeybindingsWindow(Gtk.Window):

    def __init__(self):

        Gtk.Window.__init__(self, title="i3 Keybindings")
        self.set_default_size(500, 300)

        # Create a TreeView
        self.treeview = Gtk.TreeView()

        # Create a ListStore with two columns: keybinding and command
        self.liststore = Gtk.ListStore(str, str)

        # Set the data source of the TreeView to the ListStore
        self.treeview.set_model(self.liststore)

        # Create a CellRendererText for each column
        renderer_keybinding = Gtk.CellRendererText()
        renderer_command = Gtk.CellRendererText()

        # Create a TreeViewColumn for each column
        column_keybinding = Gtk.TreeViewColumn("Keybinding", renderer_keybinding, text=0)
        column_command = Gtk.TreeViewColumn("Command", renderer_command, text=1)

        # Add the columns to the TreeView
        self.treeview.append_column(column_keybinding)
        self.treeview.append_column(column_command)

        # Add the TreeView to the window
        self.add(self.treeview)

        # Connect to i3ipc
        self.i3 = i3ipc.Connection()
        self.i3.on('binding', self.on_binding)

    def on_binding(self, i3, event):
        # Add the keybinding and command to the ListStore
        self.liststore.append([event.binding.symbol, event.binding.command])

# Create a new instance of the KeybindingsWindow
win = KeybindingsWindow()

# Show the window
win.show_all()

# Start the Gtk main loop
Gtk.main()
```

3. Добавить плагин в i3wm
Добавьте следующую строку в конфигурационный файл i3wm (~/.config/i3/config):
```
bindsym $mod+Shift+k exec /path/to/i3-keybindings.py
```
Где $mod - это модификатор, установленный в i3wm (обычно это Mod4 или Super).

После этого, при нажатии сочетания клавиш $mod+Shift+k будет запускаться скрипт i3-keybindings.py, который отобразит список всех привязанных комбинаций клавиш к командам в i3wm.