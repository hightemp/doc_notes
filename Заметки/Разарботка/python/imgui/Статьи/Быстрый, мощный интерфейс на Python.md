https://habr.com/ru/companies/skillfactory/articles/576912/

### И минимум зависимостей

![DearPyGui](https://habrastorage.org/getpro/habr/upload_files/675/d37/b8f/675d37b8fd5033fa4a4a031b847ec7d5.png "DearPyGui")

DearPyGui

Dear PyGui принципиально отличается от других фреймворков GUI Python. Рендеринг на GPU, более 70 виджетов, встроенная поддержка асинхронности — это лишь некоторые возможности Dear PyGui. Руководством по работе с этим пакетом делимся к старту курса [по разработке на Python](https://skillfactory.ru/python-developer?utm_source=habr&utm_medium=habr&utm_campaign=article&utm_content=coding_py_080921&utm_term=lead).

---

Парадигма Retained Mode позволяет создавать чрезвычайно динамичные интерфейсы. Dear PyGui не использует нативные виджеты, а рисует с помощью видеокарты компьютера, как PyQt (используя API рендеринга DirectX11, Metal и Vulkan).

## Почему Dear PyGui?

По сравнению с другими библиотеками Python GUI Dear PyGui уникален:

-   Рендеринг на GPU.
    
-   Простая встроенная поддержка асинхронных функций.
    
-   Полное управление темами и стилями.
    
-   Простое встроенное окно логирования.
    
-   70+ виджетов, сотни их комбинаций.
    
-   Подробная документация, примеры и беспрецедентная поддержка.
    

## Основные моменты

-   Темы — 10 встроенных тем и система пользовательских тем.
    
-   Graphing — API для работы с графиками (обертка ImPlot).
    
-   Canvas — низкоуровневый API для рисования.
    
-   Logging — API логирования.
    
-   Виджеты — просто прокрутите вниз, чтобы увидеть их.
    

## Установка

Убедитесь, что у вас установлен как минимум Python 3.7 (64 бит).

```
pip install dearpygui
# или
pip3 install dearpygui
```

### Зависимости

-   [Dear ImGui](https://github.com/ocornut/imgui)
    
-   [CPython](https://github.com/python/cpython)
    
-   [ImPlot](https://github.com/epezent/implot)
    
-   [CLI11](https://github.com/CLIUtils/CLI11)
    

## Начинаем писать GUI

Dear PyGui предоставляет разработчикам python простой способ создания быстрых и мощных графических интерфейсов для скриптов. Dear PyGui состоит из окна программы, окон и виджетов. Окно программы является главным окном вашей программы и создаётся в конце основного скрипта вызовом start_dearpygui().

```
from dearpygui.core import *


def save_callback(sender, data):
    print("Save Clicked")


add_text("Hello, world")
add_button("Save", callback=save_callback)
add_input_text("string", default_value="Quick brown fox")
add_slider_float("float", default_value=0.273, max_value=1)

start_dearpygui()
```

Результат:

![Вывод](https://habrastorage.org/getpro/habr/upload_files/0c9/888/3eb/0c98883eb6502cf1bf025f96ddf6d7e5.png "Вывод")

Вывод

 В приведённом ниже примере программы показано окно программы и ещё одно окно, в котором с помощью встроенной функции документации отображается документация:

```
from dearpygui.core import *

set_main_window_size(800, 800)
show_about()
show_documentation()

# when running this code please look at the about window and it will report which version of Dear PyGUI is running
# Even if you just did a pip install please ensure you your environment is using the latest package
start_dearpygui()
```

![Встроенная документация](https://habrastorage.org/getpro/habr/upload_files/74e/77a/92f/74e77a92f393d5e6f9faadbeab0fd400.png "Встроенная документация")

Встроенная документация

Dear PyGui состоит из двух модулей: dearpygui.core и dearpygui.simple.

-   dearpygui.core содержит базовую функциональность Dear PyGUI. Через ядро можно делать всё. На самом деле это расширение на языке Си, просто обёрнутое в модуль.
    
-   dearpygui.simple содержит обёртки и утилиты уже из кода ядра для удобства работы с Dear PyGui.
    

### Инструменты разработки

В Dear PyGui есть полезные инструменты разработки. Метод show_source() принимает имя входного файла Python.

```
from dearpygui.core import *

show_documentation()
show_debug()
show_about()
show_metrics()
show_source("main.py")  # replace "main.py" with your python file name
show_logger()

start_dearpygui()
```

### Встроенное логирование

Мощный инструмент разработки — Logger, он вызывается методом show_logger(). Уровней логирования 6: Trace, Debug, Info, Warning, Error, Off. Логгер выведет установленный уровень и отфильтрует все уровни ниже.

![Логирование](https://habrastorage.org/getpro/habr/upload_files/53b/a1d/0df/53ba1d0df055f122183f67b8f0fca2f0.png "Логирование")

Логирование

Уровень лога mvTRACE покажет все команды.

```
from dearpygui.core import *

show_logger()
set_log_level(mvTRACE)
log("trace message")
log_debug("debug message")
log_info("info message")
log_warning("warning message")
log_error("error message")

start_dearpygui()
```

### Пишем виджеты и контейнеры

Элементы библиотеки можно разделить на:

-   обычные предметы: поля ввода, кнопки;
    
-   контейнеры (окно, всплывающее окно, всплывающая подсказка, элемент-потомок);
    
-   элементы макета (группа, следующая колонка (next_column)).
    

Элементы добавляются командами с префиксом add_.

![Виджеты](https://habrastorage.org/getpro/habr/upload_files/8af/7c2/35b/8af7c235b8f9682dff46e0890d9237f4.png "Виджеты")

Виджеты

Каждый элемент должен иметь уникальное имя. По умолчанию, если это применимо, имя станет меткой элемента. При желании можно изменить метку:

-   Поставьте ## после имени (например displayed_name##unique_part). Всё после ## в отображаемом имени будет скрыто.
    
-   Ключевое слово label, которое отобразит метку вместо имени.
    

Некоторые имена элементов автоматически генерируются для элементов без аргументов имени в функции (т. е. same_line). Но у них есть необязательное ключевое слово name, и его можно заполнить, когда понадобится ссылка на элемент.

```
from dearpygui.core import *

add_button("Apply")
add_same_line(spacing=10)
add_button("Apply##1")
add_same_line(spacing=10, name="sameline1")
add_button("Apply2", label="Apply")
add_spacing(count=5, name="spacing1")
add_button("Apply##3")

start_dearpygui()
```

Контекстные менеджеры dearpygui.simple автоматизируют вызов функции end, позволяют сворачивать код и в самом коде показывают иерархию.

По умолчанию элементы создаются в порядке их описания в коде.

Но, указав контейнер parent, элементы можно добавлять не по порядку. parent вставляет виджет в конец списка дочерних элементов родителя. before в сочетании с ключевым словом parent помещает один элемент перед другим в списке элементов-потомков.

```
from dearpygui.core import *
from dearpygui.simple import *

add_text("First coded widget") 
add_text("This is some text on window 2", parent="window 2")  
# we can even specify the parent before it was coded
add_text("This is some text on child 1", parent="child 1")    
# we can even specify the parent before it was coded
with window("window 1"):                                      
# simple
    with child("child 1"):                                    
# simple
        add_checkbox("Checkbox")                              
# this is a input item added inside of the child
add_checkbox("Last coded widget", parent="MainWindow", before="First coded widget")
add_checkbox("Last coded widget 2", parent="child 1", before="Checkbox")

# empty window
with window("window 3"): # simple
    pass

start_dearpygui()
```

### Виджеты

Каждый виджет ввода имеет значение, которое можно задать с помощью ключевого слова default_value при создании или во время выполнения команды set_value. Для доступа к значению виджета можно использовать команду get_value. Мы также можем передавать значение виджета непосредственно в переменную python и из неё.

```
from dearpygui.core import *

my_var = True
add_checkbox("Radio Button", default_value=my_var)
print("Radio Button Value: ", get_value("Radio Button"))
print("my_var Value: ", my_var)

set_value("Radio Button", False)
print("Radio Button Value: ", get_value("Radio Button"))
print("my_var Value: ", my_var)

my_var = get_value("Radio Button")
print("Radio Button Value: ", get_value("Radio Button"))
print("my_var Value: ", my_var)

start_dearpygui()
```

### Виджеты и обратные вызовы окна

Каждый элемент ввода имеет обратный вызов, который выполняется при взаимодействии с виджетом.

Обратные вызовы добавляют виджетам функциональность. Они могут присваиваться до или после создания элемента функцией set_item_callback, как в коде ниже.

> Каждый обратный вызов должен принимать аргументы sender и data.

sender сообщает обратному вызову имя элемента, которым он вызывается.

Аргумент data применяется разными стандартными обратными вызовами для отправки дополнительных данных через определение callback_data.

Виджеты оконного типа имеют специальные обратные вызовы, которые срабатывают при таких событиях, как изменение размера или закрытие окна. Обратные вызовы для конкретных окон могут быть применены к виджету любого типа окна. on_close будет запускать обратный вызов, назначенный ключевому слову, при закрытии окна, а set_resize_callback() будет запускаться при каждом изменении размера контейнера и может быть установлен на любое конкретное окно ключевым словом handler, по умолчанию это MainWindow.

Если вы хотите, чтобы обратный вызов выполнялся на каждом фрейме, воспользуйтесь set_render_callback().

```
from dearpygui.core import *
from dearpygui.simple import *


def close_me(sender, data):
    log_debug(f"{sender} window has been closed")


def render_me(sender, data):
    log_debug(f"window {sender} has ran a render callback")


def resize_me(sender, data):
    log_debug(f"window {sender} has ran a rezise callback")


show_logger()                                      # were going to use the logger to display callback replies
with window("Tester", on_close=close_me):          # simple
    add_text('resize this window resize callback will occur')
    add_text('close this window using the "x" button and a close callback will occur')

set_render_callback(render_me)
set_resize_callback(resize_me, handler="Tester")

start_dearpygui()
```

### Добавляем и удаляем виджеты в рантайме

С помощью Dear PyGui вы можете динамически добавлять и удалять любые элементы во время выполнения программы. Это можно сделать, используя обратный вызов для выполнения команды add_* нужного элемента, указав родителя, к которому будет принадлежать элемент. По умолчанию, если не указан родительский элемент, виджет будет добавлен в MainWindow.Используя ключевое слово before при добавлении элемента, вы можете контролировать, перед каким элементом родительской группы будет находиться новый элемент. По умолчанию новый виджет помещается в конец.

### Хранилище значений и данных

Когда новый виджет добавлен, в системное хранилище добавляется некое значение. По умолчанию идентификатор этого значения — имя виджета. Значения извлекаются из системы значений с помощью get_value("source name"). Меняются значения вручную, методом set_value("source name"). Чтобы виджеты разных типов значений могли использовать одно и то же значение в системе хранения, сначала должно быть создано большее значение.

> Помните, что вы можете хранить любой объект Python в хранилище данных, даже пользовательские типы данных.

Вот так можно хранить отображение:

```
from dearpygui.core import *


def store_data(sender, data):
    custom_data = {
        "Radio Button": get_value("Radio Button"),
        "Checkbox": get_value("Checkbox"),
        "Text Input": dget_value("Text Input"),
    }
    add_data("stored_data", custom_data)


def print_data(sender, data):
    log_debug(get_data("stored_data"))


show_logger()
show_debug()
add_radio_button("Radio Button", items=["item1", "item2"])
add_checkbox("Checkbox")
add_input_text("Text Input")
add_button("Store Data", callback=store_data)
add_button("Print Data", callback=print_data)


start_dearpygui()
```

### Меню

Очень важный виджет для функциональности GUI — это бар меню. Строки меню всегда отображаются в верхней части окна и состоят в основном из:

1.  Лента главного меню.
    
2.  Выпадающие подменю.
    
3.  Конкретные элементы меню.
    

Элементы меню добавляются слева направо, а элементы подменю — сверху вниз. Они могут быть вложенными, насколько это необходимо:

```
from dearpygui.core import *
from dearpygui.simple import *


def print_me(sender, data):
    log_debug(f"Menu Item: {sender}")


show_logger()
with menu_bar("Main Menu Bar"):                    # simple

    with menu("File"):                             # simple
    
        add_menu_item("Save", callback=print_me)
        add_menu_item("Save As", callback=print_me)
        
        with menu("Settings"):                     # simple
        
            add_menu_item("Setting 1", callback=print_me)
            add_menu_item("Setting 2", callback=print_me)
            
    add_menu_item("Help", callback=print_me)
    
    with menu("Widget Items"):
    
        add_checkbox("Pick Me", callback=print_me)
        add_button("Press Me", callback=print_me)
        add_color_picker4("Color Me", callback=print_me)

start_dearpygui()
```

### Диалоги выбора файлов и каталогов

Диалог выбора каталога вызывается select_directory_dialog(), которому необходим обратный вызов.

Файловые диалоги вызываются open_file_dialog(), которому должен быть задан обратный вызов. Аргумент data возвращаемого обратного вызова будет заполнен списком строк из пути к папке и к файлу. Расширения — это дополнительное ключевое слово к диалогу файлов, которое позволяет отфильтровать файлы в диалоге по расширениям.

```
from dearpygui.core import *


def file_picker(sender, data):
    open_file_dialog(callback=apply_selected_file, extensions=".*,.py")


def apply_selected_file(sender, data):
    log_debug(data)  # so we can see what is inside of data
    directory = data[0]
    file = data[1]
    set_value("directory", directory)
    set_value("file", file)
    set_value("file_path", f"{directory}\\{file}")


show_logger()
add_button("Directory Selector", callback=file_picker)
add_text("Directory Path: ")
add_same_line()
add_label_text("##filedir", source="directory", color=[255, 0, 0])
add_text("File: ")
add_same_line()
add_label_text("##file", source="file", color=[255, 0, 0])
add_text("File Path: ")
add_same_line()
add_label_text("##filepath", source="file_path", color=[255, 0, 0])

start_dearpygui()
```

### Графики

В Dear PyGui есть «простые графики» и «графики», оба типа могут быть динамическими.

![Графики](https://habrastorage.org/getpro/habr/upload_files/083/61e/4f3/08361e4f31a1b31cbb298335256ce170.png "Графики")

Графики

Простые графики берут список и строят данные по оси y в зависимости от количества элементов в списке. Это могут быть линейные графики или гистограммы.

В «графиках» используются координаты x и y. Вызывать их нужно командой add_plot(), затем данные могут быть добавлены в виде линейного или рассеянного ряда. Вот список возможностей:

-   Клик с перетаскиванием панорамирует график.
    
-   Клик с перетаскиванием по оси панорамирует график в одном направлении.
    
-   Двойной клик масштабирует данные.
    
-   Правый клик и перетаскивание увеличивают область.
    
-   Двойной правый клик открывает настройки.
    
-   Shift + правый клик и перетаскивание масштабирует область, заполняющую текущую ось.
    
-   Прокрутка колёсика позволяет рассмотреть детали.
    
-   Прокрутка колёсика по оси увеличивает только по этой оси.
    
-   Можно переключать и скрывать наборы данных на легенде.
    

Простые графики можно сделать динамическими, изменив значение вызова plot с помощью set_value().

![Управление графиками](https://habrastorage.org/getpro/habr/upload_files/dc1/a63/6ba/dc1a636ba01e3aaaf17b748ef1a72b8e.gif "Управление графиками")

Управление графиками

Динамическая функция может очищать график и добавлять новые данные с помощью обратного вызова, например для рендеринга или обратного вызова элемента.

```
from dearpygui.core import *
from math import cos


def plot_callback(sender, data):
    # keeping track of frames
    frame_count = get_data("frame_count")
    frame_count += 1
    add_data("frame_count", frame_count)

    # updating plot data
    plot_data = get_data("plot_data")
    if len(plot_data) > 2000:
        frame_count = 0
        plot_data.clear()
    plot_data.append([3.14 * frame_count / 180, cos(3 * 3.14 * frame_count / 180)])
    add_data("plot_data", plot_data)

    # plotting new data
    clear_plot("Plot")
    add_line_series("Plot", "Cos", plot_data, weight=2)


add_plot("Plot", height=-1)
add_data("plot_data", [])
add_data("frame_count", 0)
set_render_callback(plot_callback)

start_dearpygui()
```

![Представления графиков](https://habrastorage.org/getpro/habr/upload_files/d64/5c1/e56/d645c1e5601b4316898d91e81c786e51.gif "Представления графиков")

Представления графиков

### Рисование и холст

В Dear PyGui есть низкоуровневый API, хорошо подходящий для рисования примитивов, пользовательских виджетов и даже динамических рисунков.

![](https://habrastorage.org/getpro/habr/upload_files/bee/ec5/c8d/beeec5c8d4a615a88bce3c88b45acedc.png)

Рисунок запускается вызовом add_drawing(). Начало холста — в левом нижнем углу.

Рисунки имеют масштаб, начало и размер, к которым можно получить доступ и задать их. Масштаб — это множитель значений элементов x и y. Размер указывается в пикселях. На рисунках можно отображать .png, .jpg или .bmp. Изображения рисуются с помощью функции draw_image().

Хотя рисунки можно сделать динамичными, очищая и перерисовывая всё заново, предлагается метод эффективнее: чтобы сделать рисунок динамичным, мы должны использовать ключевое слово tag для обозначения элементов, которые хотим перерисовать. Затем нужно просто вызвать команду рисования, используя тот же тег. Это позволит удалить только один элемент и перерисовать его с помощью новой команды.

```
from dearpygui.core import *


def on_render(sender, data):
    counter = get_data("counter")
    counter += 1
    modifier = get_data("modifier")
    if counter < 300:
        modifier += 1
    elif counter < 600:
        modifier -= 1
    else:
        counter = 0
        modifier = 2

    xpos = 15 + modifier*1.25
    ypos = 15 + modifier*1.25
    color1 = 255 - modifier*.8
    color3 = 255 - modifier*.3
    color2 = 255 - modifier*.8
    radius = 15 + modifier/2
    segments = round(35-modifier/10)
    draw_circle("Drawing_1", [xpos, ypos], radius, [color1, color3, color2, 255], segments, tag="circle##dynamic")
    add_data("counter", counter)
    add_data("modifier", modifier)


add_data("counter", 0)
add_data("modifier", 2)
add_drawing("Drawing_1", width=700, height=700)
set_render_callback(on_render)

start_dearpygui()
```

### Дельта-время и внутренние часы

Dear PyGui имеет встроенные часы для проверки общего времени работы. get_total_time(), возвращается общее время работы в секундах.

Также с помощью команды get_delta_time() мы можем проверить время между кадрами рендеринга в секундах.

```
from dearpygui.core import *


def on_render(sender, data):
    delta_time = str(round(get_delta_time(), 4))
    total_time = str(round(get_total_time(), 4))
    set_value("delta_time", delta_time)
    set_value("total_time", total_time)


add_text("Total Time: ")
add_same_line()
add_label_text("##total_time_text", source="total_time")
add_text("Delta Time: ")
add_same_line()
add_label_text("##delta_time_text", source="delta_time")
set_render_callback(callback=on_render)

start_dearpygui()
```

### Таблицы

Dear PyGui имеет простой API таблиц, который хорошо подходит для статических и динамических таблиц.

![Таблицы](https://habrastorage.org/getpro/habr/upload_files/487/b28/2ff/487b282ffddb314772ee7076bd3c72cc.png "Таблицы")

Таблицы

Виджет таблицы запускается вызовом add_table(). Для редактирования виджета таблицы мы можем использовать методы add_row(), add_column(), которые добавят строку/столбец к последнему слоту таблицы.

В качестве альтернативы мы можем вставить строки/столбцы с помощью insert_row(), insert_column(). Столбцы и строки вставляются в соответствии с их индексным аргументом. Если указанный индекс уже существует, то выходящие столбцы/строки будут удалены, а новая строка/столбец будет вставлена по указанному индексу.

Кроме того, при добавлении или вставке строки/столбца неуказанные ячейки по умолчанию окажутся пустыми. Кроме того, заголовки и ячейки могут быть переименованы, а их значения изменены. Ячейки можно выбирать. Это означает, что мы можем применить обратный вызов к таблице и получить через отправителя данные о том, какая ячейка была выбрана, и даже получить текст внутри ячейки.

```
from dearpygui.core import *


def table_printer(sender, data):
    log_debug(f"Table Called: {sender}")
    coord_list = get_table_selections("Table Example")
    log_debug(f"Selected Cells (coordinates): {coord_list}")
    names = []
    for coordinates in coord_list:
        names.append(get_table_item("Table Example", coordinates[0], coordinates[1]))
    log_debug(names)


show_logger()
add_table("Table Example", ["Header 0", "Header 1"], callback=table_printer)
add_row("Table Example", ["awesome row", "text"])
add_row("Table Example", ["super unique", "unique text"])
add_column("Table Example", "Header 3", ["text from column", "text from column"])
add_row("Table Example", ["boring row"])

start_dearpygui()
```

### Опрос устройств ввода

Опрос ввода в Dear PyGui делается вызовом команды опроса в функции. Функция должна быть установлена на обратный вызов рендеринга окна, чтобы опрос происходил, когда это окно активно. Обратные вызовы рендеринга выполняются каждый кадр, Dear PyGui может опрашивать на предмет ввода между кадрами.

![Опрос устройств ввода](https://habrastorage.org/getpro/habr/upload_files/336/803/40f/33680340fdf0ba2e2a4fd5a2dff108e4.png "Опрос устройств ввода")

Опрос устройств ввода

Вот список функций опроса

Подробности смотрите в [описании](https://hoffstadt.github.io/DearPyGui/) API. Чтобы добиться желаемого поведения, комбинируйте методы.

```
from dearpygui.core import *


def main_callback(sender, data):
    set_value("Mouse Position", str(get_mouse_pos()))

    if is_key_down(mvKey_A):
        set_value("A key Down", "True")
    else:
        set_value("A key Down", "False")

    if is_key_pressed(mvKey_A):
        set_value("A key Pressed", "True")
    else:
        set_value("A key Pressed", "False")

    if is_key_released(mvKey_A):
        set_value("A key Released", "True")
    else:
        set_value("A key Released", "False")

    if is_mouse_button_dragging(mvMouseButton_Left, 10):
        set_value("Left Mouse Dragging", "True")
    else:
        set_value("Left Mouse Dragging", "False")

    if is_mouse_button_clicked(mvMouseButton_Left):
        set_value("Left Mouse Clicked", "True")
    else:
        set_value("Left Mouse Clicked", "False")

    if is_mouse_button_double_clicked(mvMouseButton_Left):
        set_value("Left Mouse Double Clicked", "True")
    else:
        set_value("Left Mouse Double Clicked", "False")

    if is_key_down(mvKey_Shift) and is_mouse_button_clicked(mvMouseButton_Left):
        set_value("Shift + Left Mouse Clicked", "True")
    else:
        set_value("Shift + Left Mouse Clicked", "False")


add_label_text("A key Down", value="False", color=[0, 200, 255])
add_label_text("A key Pressed", value="False", color=[0, 200, 255])
add_label_text("A key Released", value="False", color=[0, 200, 255])
add_spacing()
add_label_text("Mouse Position", value="(0,0)", color=[0, 200, 255])
add_label_text("Left Mouse Clicked", value="False", color=[0, 200, 255])
add_label_text("Left Mouse Dragging", value="False", color=[0, 200, 255])
add_label_text("Left Mouse Double Clicked", value="False", color=[0, 200, 255])
add_label_text("Shift + Left Mouse Clicked", value="False", color=[0, 200, 255])

set_render_callback(main_callback)

start_dearpygui()
```

### Многопоточность и асинхронные функции

Для вычислений и обратных вызовов, требующих длительного времени, может быть полезно реализовать асинхронные функции или функции, выполняемые в отдельных потоках. Просто вызовите run_async_function().

> Важно отметить, что запущенные с помощью команды async функции не могут вызывать другие функции API Dear PyGui.

Асинхронные функции не могут получить доступ к add_data() или get_data(). Поэтому, когда необходимо передать данные в асинхронную функцию, вы должны использовать аргументы с ключевыми словами data и return handler. Любой объект Python можно сделать доступным для функции async, отправив его в функцию через data. Кроме того, любые возвращаемые данные из функции Async будут доступны через ввод data указанного обратного вызова.

```
from dearpygui.core import *
from time import sleep


def long_async_preparer(data, sender):
    floaty = get_value("Async Input Data")
    run_async_function(long_callback, floaty, return_handler=long_async_return)


def long_callback(sender, data):
    sleep(3)
    return data * 2


def long_async_return(sender, data):
    log_debug(data)


def long_callback2(sender, data):
    sleep(3)
    log_debug(data * 2)

show_logger()
add_text(
    "input a number and see the logger window for the output of the long callback that would normally freeze the GUI")
add_input_float("Async Input Data", default_value=1.0)
add_button("long Function", callback=long_callback2, callback_data=get_value("Async Input Data"), tip="This is the long callback that will freeze the gui")
add_button("long Asynchronous Function", callback=long_async_preparer, tip="this will not a freeze the GUI")

start_dearpygui()
```

Когда вызывается метод асинхронной функциональности, создаётся пул потоков. Настраиваются время ожидания и количество потоков.

Используя set_thread_count(), мы можем установить количество потоков в пуле, использовать set_threadpool_high_performance(), чтобы указать пулу потоков максимум потоков на компьютере пользователя. Имейте в виду, что при вызове асинхронных функций процессор будет работать на 100 %. Установить время ожидания для пула потоков можно с помощью set_threadpool_timeout(). Это уничтожит пул и освободит ресурсы через заданное время.

### Темы и стили

Темы и стилизация виджетов могут применяться к отдельному виджету или приложению в целом. Вот примеры атрибутов стиля:

-   размер шрифта;
    
-   цветовая схема приложения;
    
-   скругление углов.
    

![Темы и стили](https://habrastorage.org/getpro/habr/upload_files/bf9/615/cd1/bf9615cd1e3c23646dd94b67d33023f9.png "Темы и стили")

Темы и стили

## Примеры

[Репозиторий](https://github.com/Pcothren/DearPyGui-Examples.git) демонстраций Dear PyGui.

Для установки необходимых зависимостей запустите в репозитории

```
pip install -r requirements.txt
```

или

```
pip3 install -r requirements.txt.
```

## Заключение

Dear PyGui — это простой и мощный фреймворк для создания графических интерфейсов пользователя с помощью скриптов на языке Python. Он рисует через GPU и работает на Windows 10, macOS и Linux, содержит функции графики, темы, API для пользовательских отрисовок и инструменты для разработки приложений.

DearPyGui оборачивает Dear ImGui, включает дополнительные виджеты и дополнения (графики, диалоги файлов, изображения, виджет редактирования текста и т. д.), поддерживает асинхронность, добавление элементов на холст, дополнительные инструменты отладки и т. д.

Планы [на 12 октября 2020]:

-   Интерфейс в стиле ООП [[вот](https://github.com/mwerezak/DearPyGui-Obj) вариант].
    
-   Гистограмма, круговая диаграмма и другие элементы.
    
-   Улучшения для закрепления окон и двух вьюпортов.
    
-   Виджет 3D.
    
-   API персонализации виджетов.
    

Ссылки

1.  [](https://pypi.org/project/dearpygui/0.1.0a18/)
    
2.  [](https://hoffstadt.github.io/DearPyGui/)
    
3.  [](https://github.com/Pcothren/DearPyGui-Examples)
    
4.  [](https://hoffstadt.github.io/DearPyGui/)
    
5.  [](https://hoffstadt.github.io/DearPyGui/tutorial.html)
    

Вот так на Python можно сделать достойный графический интерфейс. Язык продолжает развиваться, а благодаря лаконичности и простоте превращается в швейцарский нож программиста. Если разработка на Python вам интересна, [переходите](https://skillfactory.ru/catalogue?utm_source=habr&utm_medium=habr&utm_campaign=article&utm_content=sf_allcourses_080921&utm_term=conc) на страницы наших курсов, чтобы увидеть, как мы готовим людей к началу карьеры [Python-разработчика](https://skillfactory.ru/python-developer?utm_source=habr&utm_medium=habr&utm_campaign=article&utm_content=coding_py_080921&utm_term=conc).