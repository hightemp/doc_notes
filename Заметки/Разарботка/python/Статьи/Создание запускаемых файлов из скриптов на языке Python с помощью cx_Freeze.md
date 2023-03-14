https://jenyay.net/Programming/Cxfreeze

# Создание запускаемых файлов из скриптов на языке Python с помощью cx_Freeze

![](https://jenyay.net/uploads/Programming/Cxfreeze/cx_freeze_cover_site.png)

### Содержание

1.  [Введение](https://jenyay.net/Programming/Cxfreeze#intro)
2.  [Установка](https://jenyay.net/Programming/Cxfreeze#install)
3.  [Первый пример](https://jenyay.net/Programming/Cxfreeze#example_01)
4.  [Добавление файлов Microsoft Visual C++ Redistributable](https://jenyay.net/Programming/Cxfreeze#msvc)
5.  [Избавляемся от лишних модулей](https://jenyay.net/Programming/Cxfreeze#clean)
6.  [Наводим красоту в сборке](https://jenyay.net/Programming/Cxfreeze#renames)
7.  [Добавление модулей в сборку](https://jenyay.net/Programming/Cxfreeze#add)
8.  [Сборка нескольких запускаемых файлов](https://jenyay.net/Programming/Cxfreeze#several)
9.  [Добавление дополнительных файлов в сборку](https://jenyay.net/Programming/Cxfreeze#add_files)
10.  [Создание приложений с графическим интерфейсом](https://jenyay.net/Programming/Cxfreeze#gui)
11.  [Установка иконки приложения](https://jenyay.net/Programming/Cxfreeze#icon)
12.  [Создание инсталятора MSI](https://jenyay.net/Programming/Cxfreeze#msi)
13.  [Скрипт cxfreeze-quickstart для создания файла setup.py](https://jenyay.net/Programming/Cxfreeze#cxfreeze_quickstart)
14.  [Заключение](https://jenyay.net/Programming/Cxfreeze#outro)

### 1. Введение

Python - отличный язык программирования для широкого круга задач, начиная от автоматизации рутинных действий до создания web- или настольных приложений с графическим интерфейсом. Но Python - интерпретируемый язык, а это значит, что если вы хотите распространять ваше приложение, то у пользователя должен быть установлен интерпретатор, на вход которого он должен подать исходные коды вашей программы. Если вы разрабатываете приложение под Linux или основная масса пользователей вашей программы - айтишники (программисты, админы и им сочувствующие), то требование установить интерпретатор Python скорее всего их не испугает. А вот заставлять устанавливать Python, а, возможно, еще и дополнительные библиотеки обычных пользователей - сомнительная идея.

Однако, Python хорош еще тем, что ядро интерпретатора достаточно компактное, оно умещается в единственную dll-ку размером 3.5 МБ + дополнительные модули. Это позволяет сделать такой хак: скопируем в отдельную папку файл PythonXX.dll (где XX - номер версии интерпретатора Python) и также скомпилированные файлы *.pyc, созданные из исходных файлов вашего приложения и используемых модулей, а затем рядом с этими файлами создадим запускаемый файл .exe, который будет подменять и перенаправлять вызовы интерпретатора в скопированную dll-ку (это очень грубое представление работы создаваемого файла .exe, но для простоты оставим так). Набор этих файлов можно передавать конечному пользователю, он запустит запускаемый файл и даже не будет догадываться, что "под капотом" работает интерпретатор Python.

Именно это и делает библиотека [cx_Freeze](https://anthony-tuininga.github.io/cx_Freeze/), причем такой прием эта библиотека умеет применять для Windows, Linux и Mac OS. Эта статья будет посвящена использованию данной библиотеки. На простейших примерах мы рассмотрим основы работы с этой библиотекой cx_Freeze и различные сценарии ее использования.

Все примеры в этой статье тестировались на Python 3.6 и cx_Freeze 5.0.2. cx_Freeze пока еще умеет работать с Python 2.7, но судя по коммитам на [github](https://github.com/anthony-tuininga/cx_Freeze), следующая версия cx_Freeze 6 будет работать только с Python 3.5 и выше.

### 2. Установка

Устанавливается cx_Freeze стандартно через pip. Если вы хотите установить cx_Freeze глобально для всех пользователей системы, то нужно выполнить в консоли команду

pip install cx_freeze

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=1)

Разумеется, для этого у вас должны быть права администратора, и консоль должна быть запущена от администратора.

Или вы можете установить cx_Freeze только для вашего пользователя, тогда админские права не понадобятся:

pip install cx_freeze --user

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=2)

В реальном проекте идеологически более верно установить cx_Freeze внутри virtualenv, но в этом случае могут быть некоторые проблемы ([например](https://github.com/anthony-tuininga/cx_Freeze/issues/275)).

### 3. Первый пример

Теперь, когда cx_Freeze установлен, можно приступать к изучению возможностей этой библиотеки. Все примеры из статьи вы можете найти на [github](https://github.com/Jenyay/cx_freeze_examples). Примеры последовательно пронумерованы в том порядке, как они описаны в статье. Приложение, которое мы будем упаковывать в запускаемые файлы, будет называться _example.py_.

Для начала создадим простейший python-скрипт с именем _example.py_, который не импортирует никакие модули ([Example 01](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2001) на github):

# example.py  
  
# coding: utf-8  
  
  
if __name__ == '__main__':  
    print('Hello world!')

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=3)

Скорее всего нет смысла описывать, что делает данный скрипт. :) Желающие убедиться, что скрипт работает, могут выполнить команду:

python example.py

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=4)

Если у вас установлено несколько версий Python, то под Windows можно воспользоваться утилитой _py_ и явно указать номер версии интерпретатора:

py -3.6 example.py

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=5)

или

py -3 example.py

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=6)

Давайте упакуем наш очень полезный скрипт в запускаемый файл, который можно будет передать пользователю. Для этого создадим файл _setup.py_ со следующим содержимым:

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
setup(name='hello_world',  
      version='0.0.1',  
      description='My Hello World App!',  
      executables=executables)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=7)

Имя скрипта для сборки может быть произвольным, но обычно принято называть его _setup.py_, и мы будем придерживаться этого правила. Те, кто создавал Python-пакеты с помощью утилит [distutils](https://docs.python.org/2/library/distutils.html) или [setuptools](https://pypi.python.org/pypi/setuptools), увидят в работе с cx_Freeze что-то знакомое.

Итак, в файле _setup.py_ мы импортируем из модуля cx_Freeze функцию _setup_ и класс _Executable_. Самое главное здесь - это функция _setup_, в нее передаются все параметры, которые описывают сборку. В параметрах функции _setup_ мы указываем имя приложения (параметр _name_), номер версии (параметр _version_), краткое описание приложения (параметр _description_), а также параметр _executables_, который должен быть **списком** экземпляров класса _Executable_. Почему тут должен быть именно список, и не достаточно одного экземпляра класса _Executable_ будет описано чуть позже в разделе [Сборка нескольких запускаемых файлов](https://jenyay.net/Programming/Cxfreeze#several).

Конструктор класса _Executable_ может принимать достаточно большое количество параметров. Обязательным параметром является только имя запускаемого python-файла. Если ваша программа состоит из большого количества скриптов, то указывать нужно на тот файл, который запускал бы пользователь, если бы он запускал приложение из исходников. Полностью конструктор класса _Executable_ выглядит следующим образом (класс описан в файле [freezer.py](https://github.com/anthony-tuininga/cx_Freeze/blob/master/cx_Freeze/freezer.py) исходников cx_Freeze):

class Executable(object):  
    def __init__(self, script, initScript = None, base = None,  
            targetName = None, icon = None, shortcutName = None,  
            shortcutDir = None, copyright = None, trademarks = None):

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=8)

Некоторыми из этих параметров мы еще воспользуемся, а некоторые останутся за рамками статьи, назначение многих из них понятно из названия переменных.

Чтобы создать запускаемый файл, запустим консоль и перейдем в папку, где лежит файл _setup.py_. Затем нужно выполнить команду

python setup.py build

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=9)

На экран будет выведено достаточно много теста:

running build
running build_exe
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\cx_Freeze\bases\Console.exe -> build\exe.win32-3.6\example_01.exe
copying C:\Program Files (x86)\Python36-32\python36.dll -> build\exe.win32-3.6\python36.dll
*** WARNING *** unable to create version resource
install pywin32 extensions first
writing zip file build\exe.win32-3.6\python36.zip

  Name                      File
  ----                      ----
m BUILD_CONSTANTS
m __future__                C:\Program Files (x86)\Python36-32\lib\__future__.py
m __startup__               C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\cx_Freeze\initscripts\__startup__.py
m _ast

...

m xml.parsers.expat         C:\Program Files (x86)\Python36-32\lib\xml\parsers\expat.py
m zipfile                   C:\Program Files (x86)\Python36-32\lib\zipfile.py
m zipimport
m zlib

Missing modules:
? __main__ imported from bdb, pdb
? _dummy_threading imported from dummy_threading
? _frozen_importlib imported from importlib, importlib.abc
? _frozen_importlib_external imported from importlib, importlib._bootstrap, importlib.abc
? _posixsubprocess imported from subprocess
? _winreg imported from platform
? grp imported from shutil, tarfile
? java.lang imported from platform
? org.python.core imported from copy, pickle
? os.path imported from os, pkgutil, py_compile, tracemalloc, unittest, unittest.util
? posix imported from os
? pwd imported from http.server, posixpath, shutil, tarfile, webbrowser
? termios imported from tty
? vms_lib imported from platform
This is not necessarily a problem - the modules may not be needed on this platform.

copying C:\Program Files (x86)\Python36-32\DLLs\_bz2.pyd -> build\exe.win32-3.6\_bz2.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\_hashlib.pyd -> build\exe.win32-3.6\_hashlib.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\_lzma.pyd -> build\exe.win32-3.6\_lzma.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\_socket.pyd -> build\exe.win32-3.6\_socket.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\_ssl.pyd -> build\exe.win32-3.6\_ssl.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\pyexpat.pyd -> build\exe.win32-3.6\pyexpat.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\select.pyd -> build\exe.win32-3.6\select.pyd
copying C:\Program Files (x86)\Python36-32\DLLs\unicodedata.pyd -> build\exe.win32-3.6\unicodedata.pyd

В довольно большом логе работы можно увидеть, какие модули Python попали в сборку, а каких по мнению cx_Freeze не хватает. Чаще всего на этот вывод можно не обращать внимания, если нет каких-либо ошибок.

После запуска скрипта сборки, если все прошло успешно (если нет сообщений об ошибках), рядом с файлами _example.py_ и _setup.py_ должна появиться папка _build_, а в ней папка, имя которой зависит от версии Python. Например, если сборка запускалась с помощью 32-битной версии интерпретатора Python 3.6, то будет создана папка _exe.win32-3.6_, а в ней огромное количество файлов и папок.

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_01.png)

Среди файлов можно увидеть файл _example.exe_ - файл, который будут запускать пользователи. Попробуйте его запустить - откроется консольное окно, в котором промелькнет фраза "Hello world!"

Рядом с запускаемым файлом расположился файл с ядром интерпретатора Python - _python36.dll_, а также файл _python36.zip_ - архив, в котором хранятся модули Python, скомпилированные в файлы *.pyc. Также в корне находятся динамические загружаемые библиотеки *.pyd и папки с пакетами, которые не попали в файл _python36.zip_. Если открыть этот архив, то можно увидеть, что он содержит файлы *.pyc.

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_01_zip.png)

По умолчанию cx_Freeze в архив помещает одиночные модули, а пакеты помещает в корень папки сборки. В данный момент в сборку попало очень много лишних модулей, который на самом деле не используются в программе. Например, среди модулей можно увидеть unittest, logging, xml, urllib и другие, которые явно не используются в нашей простой программе. Скоро мы научимся удалять лишние модули из сборки и вручную добавлять необходимые.

### 4. Добавление файлов Microsoft Visual C++ Redistributable

Интерпретатор Python компилируется под Windows с помощью Microsoft Visual C++, поэтому для того, чтобы пользователи могли запускать собранное вами приложение, у них должен установлен Microsoft Visual C++ Redistributable Package, который они должны скачать с сайта Microsoft. Это не очень удобно. Ситуация усугубляется тем, что разные версии Python компилируются с помощью разных версий компилятора.

Чтобы решить эту проблему вы можете поставлять с вашим дистрибутивом необходимые файлы *.dll. Например, для Python 3.6 достаточно скопировать файл _vcruntime140.dll_ из папки с установленным Python. Для того, чтобы не делать эту вручную, cx_Freeze может делать это за вас, для этого надо добавить новый для нас параметр в функцию _setup_ скрипта сборки _setup.py_. Исправленный скрипт сборки теперь будет выглядеть следующим образом ([Example 02](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2002)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.2',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=10)

В функцию _setup_ был добавлен новый параметр _options_, который должен быть словарем. Этот словарь содержит вложенные словари, описывающие особенности сборки для разных операционных систем и типов сборки (cx_Freeze кроме запускаемых файлов может создавать инсталяторы). Все возможные параметры можно найти [в документации](http://cx-freeze.readthedocs.io/en/latest/distutils.html), некоторые из этих параметров мы еще будем использовать в дальнейшем.

Пока мы добавили единственный параметр в словарь _build_exe_ - 'include_msvcr': True. Этот параметр говорит cx_Freeze, что нужно скопировать необходимые файлы *.dll из Microsoft Visual C++ Redistributable.

Но в последних версиях cx_Freeze есть некоторые непонятные моменты, связанные с этим параметром. По идее после запуска нового скрипта сборки с помощью команды

python setup.py build

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=11)

должна создаться та же самая сборка, что и в предыдущем примере, но только в папке с программой должен появиться файл _vcruntime140.dll_ (для Python 3.6). Во время написания этой статьи (напомню, что для тестирования примеров использовался cx_Freeze 5.0.2) этот файл не копировался. На github есть несколько обсуждений ([#275](https://github.com/anthony-tuininga/cx_Freeze/issues/275)), где говорится, что этот файл не копируется при использовании virtualenv. Я пробовал запускать эти примеры и без virtualenv, файл _vcruntime140.dll_ все равно не копировался. В одном из следующих примеров, когда мы будем собирать скрипт, создающий графический интерфейс с помощью библиотеки wxPython, этот файл появится. С чем связано такое поведение - пока загадка. Но при создании своих сборок имейте это в виду, может быть нужно будет копировать файлы Microsoft Visual C++ Redistributable вручную. В дальнейших примерах для общности везде будет добавлен параметр _include_msvcr_.

### 5. Избавляемся от лишних модулей

Как мы видим, несмотря на то, что наш исходный скрипт Hello World явно не импортирует никакие модули, в сборку попало достаточно много файлов *.pyc и *.pyd. Некоторые из них нам явно не нужны (например, unittest, logging и другие). Полный размер сборки сейчас составляет 9.05 МБ, что для простого Hello World кажется излишним, хотя при современных размерах жестких дисков скорее всего не будет проблемой.

cx_Freeze позволяет указать, какие модули не надо включать в создаваемую сборку. Сразу скажу, что этой возможностью надо пользоваться осторожно, особенно для больших программах. Python - язык с динамической типизацией и заранее нельзя сказать, какие модули понадобятся, а какие нет. Тут нужно все тестировать. Некоторые модули исключить не удастся, и cx_Freeze во время сборки напишет ошибку, другие модули можно не включить в сборку, но на самом деле они окажутся нужными (например, они могут использоваться другими модулями, которые вы используете), и в этом случае вы получите ошибку во время выполнения программы. Это особенно неприятно для больших программ. Таким образом вы можете исключить модуль, который используется в редком случае, и из-за этого не сразу обнаружить ошибку. Поэтому лучше убирать из сборки только те модули, в которых вы 100% уверены, что они не используются (модуль unittest обычно таким является).

Чтобы исключить какие-либо модули из сборки, в словарь параметров _build_exe_ нужно добавить ключ _excludes_, значением которого должен быть список строк с именами модулей, которые нужно исключить. Давайте для начала исключим модули, которые нам явно не нужны. Добавим параметр _excludes_ с небольшим списком модулей ([Example 03](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2003)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'bz2']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.3',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=12)

После сборки заходим в папку _build\exe.win32-3.6\_ или аналогичную ей и видим, что количество файлов и папок заметно уменьшилось:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_03.png)

В архиве _python36.zip_ количество файлов тоже немного уменьшилось:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_03_zip.png)

Общий размер сборки теперь составляет 5.93 МБ - размер уже уменьшился на треть. Обязательно надо убедиться, что программа работает.

В реальном проекте, возможно, стоит на этом остановиться и не рисковать сломать программу, удаляя более мелкие модули. Но поскольку у нас очень простая программа, мы можем пойти дальше и путем перебора попробовать удалить как можно больше ненужных модулей. Через несколько (десятков?) итераций удаления и восстановления модулей получился следующий скрипт сборки ([Example 04](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2004)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar', 'functools',  
            'weakref', 'tokenize', 'base64', 'gettext', 'heapq', 're', 'operator',  
            'bz2', 'fnmatch', 'getopt', 'reprlib', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'keyword', 'linecache']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.4',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=13)

После его запуска с помощью команды _python setup.py build_ сборка будет выглядеть следующим образом:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_04.png)

А в архиве _python36.zip_ остались лишь следующие модули:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_04_zip.png)

В архиве осталось всего 19 файлов из 100 первоначальных. Теперь сборка занимает 3.7 МБ. По-моему, неплохо. Но это еще не все.

Мы видим, что часть модулей находится в архиве _python36.zip_ , а часть в отдельных папках в папке сборки. Это может быть неприятно из эстетических соображений, если вы не хотите видеть лишние служебные файлы и папки в сборке. На этот случай у cx_Freeze есть еще один параметр, который указывает, какие модули он должен обязательно помещать в архив. Но имейте в виду, что распаковка архива при работе программы тоже будет занимать время, поэтому запуск программы с заархивированными модулями будет медленнее. Насколько медленнее - надо измерять, возможно, скорость будет не заметна для пользователей (скорее всего так и будет).

Чтобы указать, какие модули нужно обязательно поместить в архив, используется элемент с именем _zip_include_packages_ словаря параметров _build_exe_ . Этот элемент словаря должен содержать **список строк** с именами модулей (пакетов), которые нужно поместить в архив. В нашем случае скрипт сборки преобразуется к следующему виду ([Example 05](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2005)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar', 'functools',  
            'weakref', 'tokenize', 'base64', 'gettext', 'heapq', 're', 'operator',  
            'bz2', 'fnmatch', 'getopt', 'reprlib', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'keyword', 'linecache']  
  
zip_include_packages = ['collections', 'encodings', 'importlib']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.5',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=14)

Запускаем сборку и смотрим на ее результат:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_05.png)

Осталось всего лишь три файла!

Указанные в скрипте сборки модули переместились в файл _python36.zip_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_05_zip.png)

Теперь сборка занимает всего лишь 3.45 МБ - по сравнению с исходными 9 МБ размер сократился почти в 3 раза. Еще раз напомню, что в сборку еще не были включены файлы из Microsoft Visual C++ Redistributable, которые почему-то не были помещены автоматически библиотекой cx_Freeze. Ну и, конечно, в этом примере было применено очень агрессивное исключение модулей, которые могут использоваться во многих других модулях. Обычно этого делать не стоит, чтобы не получить неожиданную ошибку. К тому же многие файлы *.pyc занимают всего лишь десятки кБ, из-за которых нет смысла рисковать.

### 6. Наводим красоту в сборке

Мы создали запускаемую сборку нашей программы. По умолчанию она помещается в папку с именем вроде _build\exe.win32-3.6\_ , имя которой зависит от версии Python, для которой происходила сборка. Во многих случаях можно на этом остановиться, но в больших проектах создание такой сборки - это лишь один промежуточный этап автоматического создания дистрибутива. После этого полученную сборку, возможно, нужно будет отправить на сервер для тестирования, может быть нужно будет запустить локальные тесты или создать из сборки инсталятор. Поэтому может оказаться, что такое имя папки неудобно или нужно сохранить сборку на другом диске. Все это, конечно, можно сделать сторонними скриптами, но cx_Freeze позволяет настраивать, куда будет помещена полученная сборка.

Давайте изменим файл _setup.py_, таким образом, чтобы создаваемая сборка помещалась, например, в папку _build_windows_ рядом со скриптами. Для этого снова нужно добавить новый параметр в словарь _build_exe_. Этот параметр тоже должен называться _build_exe_ и хранить строку с папкой, куда должна помещаться сборка ([Example 06](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2006)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar', 'functools',  
            'weakref', 'tokenize', 'base64', 'gettext', 'heapq', 're', 'operator',  
            'bz2', 'fnmatch', 'getopt', 'reprlib', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'keyword', 'linecache']  
  
zip_include_packages = ['collections', 'encodings', 'importlib']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.6',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=15)

Теперь после создания сборки рядом с файлами _example.py_ и _setup.py_ появится папка _build_windows_, где будет находиться созданная сборка, ничем не отличающаяся от предыдущего примера.

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_06.png)

По умолчанию cx_Freeze создает запускаемый файл, имя которого (без расширения) совпадает с именем запускаемого скрипта. То есть в нашем случае - _example.exe_, поскольку наш запускаемый сприпт называется _example.py_. Часто нужно дать запускаемому файлу другое имя. Сделать это тоже очень просто, достаточно добавить еще один параметр, но на этот раз в конструктор класса _Executable_. Имя нужного нам параметра - _targetName_. Это должна быть строка, которая содержит имя создаваемого запускаемого файла. Поэтому, если мы хотим, чтобы cx_Freeze создал запускаемый файл _hello_world.exe_, то предыдущий файл _setup.py_ нужно изменить следующим образом ([Example 07](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2007)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar', 'functools',  
            'weakref', 'tokenize', 'base64', 'gettext', 'heapq', 're', 'operator',  
            'bz2', 'fnmatch', 'getopt', 'reprlib', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'keyword', 'linecache']  
  
zip_include_packages = ['collections', 'encodings', 'importlib']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.7',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=16)

Запускаем сборку и видим, что в папке _build_windows_ вместо _example.exe_ появился файл _hello_world.exe_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_07.png)

### 7. Добавление модулей в сборку

До сих пор мы только исключали лишние модули из создаваемой сборки с помощью параметра _excludes_ словаря _build_exe_. Однако, импорт модулей в Python может происходить не только с помощью оператора _import_, но и динамически по имени модуля с помощью функции '_import_', а может быть импорт будет осуществляться с использованием сложной логики, когда cx_Freeze не сможет понять, что нужно добавить какой-то модуль в сборку.

Давайте изменим наш пример таким образом, чтобы он импортировал модуль _json_ таким образом, что cx_Freeze об этом не узнает ([Example 08](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2008)):

# coding: utf-8  
  
  
if __name__ == '__main__':  
    module = __import__('json')  
    print('Hello world!')

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=17)

Скрипт сборки _setup.py_ пока останется неизменным. Запустим сборку с помощью команды _python setup.py build_, ошибок при этом не возникнет, будет создана сборка в папке _build_windows_.

Однако если теперь мы запустим созданный файл _hello_world.exe_, то в консоль будет выведено информация об исключении:

> hello_world.exe  
  
Traceback (most recent call last):  
  File "C:\...\Python36\site-packages\cx_Freeze\initscripts\__startup__.py", line 14, in run  
    module.run()  
  File "C:\...\Python36\site-packages\cx_Freeze\initscripts\Console.py", line 26, in run  
    exec(code, m.__dict__)  
  File "example.py", line 5, in <module>  
ModuleNotFoundError: No module named 'json'

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=18)

На указанные пути обращать внимания не будем. Для нас сейчас главное, что мы получили ошибку времени исполнения. Надо ее исправлять, а именно нужно добавить модуль _json_ в сборку.

Если для исключения модулей из сборку предназначен параметр _excludes_, до для включения модуля в сборке используется параметр _includes_, который тоже должен содержать список модулей, которые нужно добавить в сборку. Параметр _includes_ так же должен входить в словарь _build_exe_. Добавим модуль _json_ в этот список ([Example 08-1](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2008-1)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar', 'functools',  
            'weakref', 'tokenize', 'base64', 'gettext', 'heapq', 're', 'operator',  
            'bz2', 'fnmatch', 'getopt', 'reprlib', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'keyword', 'linecache']  
  
includes = ['json']  
  
zip_include_packages = ['collections', 'encodings', 'importlib']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'includes': includes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.8',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=19)

Создаем сборку, заходим в папку _build_windows_ и видим, что в ней появилась папка с именем _json_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_08.png)

Но не спешим радоваться. При попытке запустить _hello_world.exe_ мы получим новую ошибку:

> hello_world.exe  
Traceback (most recent call last):  
  File "C:\...\Python36\site-packages\cx_Freeze\initscripts\__startup__.py", line 14, in run  
    module.run()  
  File "C:\...\Python36\site-packages\cx_Freeze\initscripts\Console.py", line 26, in run  
    exec(code, m.__dict__)  
  File "example.py", line 5, in <module>  
  File "C:\Program Files (x86)\Python36-32\lib\json\__init__.py", line 106, in <module>  
    from .decoder import JSONDecoder, JSONDecodeError  
  File "C:\Program Files (x86)\Python36-32\lib\json\decoder.py", line 3, in <module>  
    import re  
ModuleNotFoundError: No module named 're'

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=20)

Теперь не хватает модуля для работы с регулярными выражениями _re_. Если мы посмотрим внимательнее на наш предыдущий файл _setup.py_, то увидим, что этот модуль мы исключили из сборки с помощью параметра _excludes_, а этот модуль, оказывается, используется в модуле _json_. Если мы исключим модуль _re_ из списка _excludes_, то это тоже не решит проблему, окажется, что еще нужны другие модули, которые вы выкинули из сборки. Я же предупреждал, что не надо увлекаться удалением модулей. Постепенно удаляя имена модулей из списка _excludes_ можно добиться работоспособной сборки. Новый файл _setup.py_ теперь выглядит следующим образом ([Example 08-2](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2008-2)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar',  
            'tokenize', 'base64', 'gettext',  
            'bz2', 'fnmatch', 'getopt', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'linecache']  
  
includes = ['json']  
  
zip_include_packages = ['collections', 'encodings', 'importlib']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'includes': includes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.8',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=21)

Из списка _excludes_ были убраны следующие модули: _re_, _functools_, _operator_, _keyword_, _heapq_, _reprlib_, _weakref_.

Создаем сборку и получаем теперь уже работоспособное приложение. Если мы зайдем в папку _build_windows_, то увидим, что внешне ничего не изменилось, в ней из перечисленных модулей значится только папка _json_, остальные модули были помещены в архив _python36.zip_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_08-2_zip.png)

И для аккуратности сделаем так, чтобы модуль _json_ тоже был помещен в архив _python36.zip_, добавим строку 'json' в параметр _zip_include_packages_ ([Example 08-3](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2008-3)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar',  
            'tokenize', 'base64', 'gettext',  
            'bz2', 'fnmatch', 'getopt', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'linecache']  
  
includes = ['json']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'json']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'includes': includes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.8',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=22)

Теперь сборка выглядит аккуратно и состоит всего из трех файлов:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_08-3.png)

А в архиве _python36.zip_ появился модуль _json_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_08-3_zip.png)

### 8. Сборка нескольких запускаемых файлов

Давайте вернемся к вопросу о том, зачем в качестве параметра _executables_ функции _setup_ должен быть передан **список** экземпляров класса _Executable_, а не единственный экземпляр класса. Это полезно в тех случаях, когда ваше приложение состоит из нескольких запускаемых файлов. Например, это может быть основная программа и дополнительная программа для обновления основной программы, или может быть ваше приложение - это набор небольших утилит, написанных на Python. В этом случае для каждой такой программы надо делать отдельную сборку, но как быть с архивом модулей (_python36.zip_ или аналогичного), ведь у каждой программы будет свой список импортируемых модулей? Именно поэтому cx_Freeze позволяет указывать список создаваемых запускаемых файлов, а в архив модулей будут помещены все необходимые модули для всех приложений.

Сделаем два простых скрипта в одной папке ([Example 09](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2009)).

hello_01.py:

# coding: utf-8  
  
import json  
  
  
if __name__ == '__main__':  
    print('Hello world 01!')

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=23)

hello_02.py:

# coding: utf-8  
  
  
if __name__ == '__main__':  
    print('Hello world 02!')

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=24)

Скрипт _hello_01.py_ явно импортирует модуль _json_, поэтому в файле _setup.py_ мы не будем использовать параметр _includes_ - cx_Freeze сам найдет все необходимые модули. Для скрипта _hello_02.py_ модуль _json_ не требуется. Для каждого из этих модулей мы должны создать свой экземпляр класса _Executable_ в _setup.py_, а остальное нам уже знакомо:

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('hello_01.py', targetName='hello_world_01.exe'),  
               Executable('hello_02.py', targetName='hello_world_02.exe'),  
               ]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar',  
            'tokenize', 'base64', 'gettext',  
            'bz2', 'fnmatch', 'getopt', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'linecache']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'json']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.9',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=25)

Запускаем сборку и видим, что в папке _build_windows_ появились файлы _hello_world_01.exe_ и _hello_world_02.exe_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_09.png)

А в архиве _python36.zip_ имеется модуль _json_, который нужен только для _hello_world_01.exe_:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_09_zip.png)

### 9. Добавление дополнительных файлов в сборку

До сих пор у нас приложение состояло только из скриптов Python, но часто к скриптам должны прилагаться какие-нибудь файлы с данными. Давайте дополним один из предыдущих примеров, сделаем так, чтобы в отдельной папке с именем _data_ хранился файл _data.json_ с данными в формате JSON о том, кого программа должна приветствовать ([Example 10](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2010)):

{  
        "first_name": "John",  
        "last_name": "Zoidberg"  
}

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=26)

Т.е. общая структура файлов будет такой:

.  
│--example.py  
│--setup.py  
│  
└───data  
        data.json

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=27)

Скрипт _example.py_ теперь выглядит так:

# coding: utf-8  
  
import json  
  
  
if __name__ == '__main__':  
    fname = 'data/data.json'  
    with open(fname) as fp:  
        obj = json.load(fp)  
  
    print('Hello {} {}!'.format(obj['first_name'], obj['last_name']))

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=28)

Если мы воспользуемся одним из предыдущих скриптов _setup.py_ и запустим полученный файл .exe, то мы получим ошибку из-за того, что папка _data_ не будет скопирована в папку со сборкой. На этот случай у cx_Freeze есть еще один параметр _include_files_, который тоже должен входить в словарь _build_exe_ и содержать либо список, в который могут входить либо строковые элементы с именами файлов или папок, которые нужно добавить к сборке, либо кортежи, показывающие, как исходные файлы должны быть переименованы (об этом мы поговорим чуть позже).

Пока сделаем, чтобы папка _data_ была добавлена к сборке.

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar',  
            'tokenize', 'base64', 'gettext',  
            'bz2', 'fnmatch', 'getopt', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'linecache']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'json']  
  
include_files = ['data']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
        'include_files': include_files,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.10',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=29)

После удачной сборки папка _build_windows_ будет выглядеть следующим образом:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_10.png)

И приложение _hello_world.exe_ при запуске поприветствует доктора Зойдберга (пока не залез в Википедию, не знал, что его зовут Джон).

Давайте немного усложним задачу. Пусть исходники у нас включают в себя файлы _readme.txt_ и _documentation.txt_, которые не используются в скрипте (он останется прежним), но эти файлы хотелось бы добавить в сборку, при этом файл _documentation.txt_ нужно поместить в отдельную папку _doc_ и переименовать в _doc.txt_ ([Example 11](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2011)).

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_11_src.png)

Для этого воспользуемся тем, что в список _include_files_ можно включать не только строки, но и кортежи из двух элементов. Первый элемент кортежа должен быть строкой с именем исходного файла, а второй элемент - именем этого файла в папке сборки, при этом исходный файл можно помещать в поддиректории.

Наш новый файл _setup.py_ теерь выглядит так:

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_world.exe')]  
  
excludes = ['unicodedata', 'logging', 'unittest', 'email', 'html', 'http', 'urllib',  
            'xml', 'pydoc', 'doctest', 'argparse', 'datetime', 'zipfile',  
            'subprocess', 'pickle', 'threading', 'locale', 'calendar',  
            'tokenize', 'base64', 'gettext',  
            'bz2', 'fnmatch', 'getopt', 'string', 'stringprep',  
            'contextlib', 'quopri', 'copy', 'imp', 'linecache']  
  
includes = ['json']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'json']  
  
include_files = ['data',  
                 'readme.txt',  
                 ('documentation.txt', 'doc/doc.txt'),  
                 ]  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'includes': includes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
        'include_files': include_files,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.11',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=30)

Запускаем сборку и убеждаемся, что новые файлы были скопированы в папку сборки:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_11.png)

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_11-2.png)

Это очень полезная возможность при создании сборок.

### 10. Создание приложений с графическим интерфейсом

До сих пор мы создавали запускаемые файлы для консольных приложений, но если вы разрабатываете программу для обычных пользователей, то им нужен графический интерфейс (GUI). Для создания графического интерфейса на Python существует много библиотек, которые в основном являются оболочками над библиотеками, написанными на C или C++. Наиболее известные из них - Tkinter (входит в стандартную библиотеку Python), PyQt, PySide, wxPython и др. В этой статье для примера рассмотрим использование библиотеки [wxPython](https://wxpython.org/), которая является оболочкой поверх библиотеки [wxWidgets](https://www.wxwidgets.org/). В примерах будет использоваться wxPython 4.0, которая на момент написания статьи имеет статус пока еще альфа-версии, зато в отличие от предыдущих версий может устанавливаться из PyPi с помощью pip.

Устанавливается wxPython 4.0 обычным способом:

pip install wxpython

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=31)

или, если вы хотите установить wxPython только для своего пользователя (в этом случае не требуются права администратора):

pip install wxpython --user

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=32)

Сделаем простейшее приложение, которое создает пустое окно с заголовком "Hello wxPython". Поскольку данная статья не является учебником по wxPython, то не будем подробно останавливаться на использовании этой библиотеки, хотя я думаю, что код такого простого приложения достаточно понятен ([Example 12](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2012)).

# example.py  
  
# coding: utf-8  
  
import wx  
  
  
class MyApp(wx.App):  
    def OnInit(self):  
        self.mainWnd = wx.Frame(None, -1, "")  
        self.SetTopWindow(self.mainWnd)  
        self.mainWnd.SetTitle('Hello wxPython')  
        self.mainWnd.Show()  
        return True  
  
  
if __name__ == "__main__":  
    app = MyApp(False)  
    app.MainLoop()

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=33)

Создадим скрипт сборки _setup.py_, в котором пока тоже нет ничего необычного:

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py', targetName='hello_wx.exe')]  
  
excludes = ['logging', 'unittest', 'email', 'html', 'http', 'urllib', 'xml',  
            'unicodedata', 'bz2', 'select']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'wx']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.12',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=34)

Единственное отличие от предыдущих примеров заключается в том, что в список исключаемых модулей (параметр _excludes_ в _build_exe_) включены только некоторые модули, которые нам явно не нужны, а модуль _wx_ добавлен в список _zip_include_packages_, чтобы файлы *pyc из библиотеки wxPython попали в архив _python36.zip_.

Запускаем сборку с помощью команды

python setup.py build

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=35)

Теперь содержимое папки _build_windows_ выглядит следующим образом:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_12.png)

Появились новые файлы *.dll и *.pyd, относящиеся в wxPython. С ними ничего не поделаешь, их трогать нельзя. Обратите внимание, что появились файлы _MSVCP140.dll_ и _VCRUNTIME140.dll_, относящиеся к Microsoft Visual C++ Redistributable. Если мы посмотрим на лог работы cx_Freeze, то увидим, что эти файлы были скопированы не из папки, где находится запускаемый файл интерпретатора Python, а из папки библиотеки wxPython:

Copying data from package pydoc_data...  
copying C:\Program Files (x86)\Python36-32\DLLs\_hashlib.pyd -> build_windows\_hashlib.pyd  
copying C:\Program Files (x86)\Python36-32\DLLs\_lzma.pyd -> build_windows\_lzma.pyd  
copying C:\Program Files (x86)\Python36-32\DLLs\_socket.pyd -> build_windows\_socket.pyd  
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\_core.cp36-win32.pyd -> build_windows\wx._core.pyd  
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\wxbase30u_vc140.dll -> build_windows\wxbase30u_vc140.dll  
**copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\MSVCP140.dll -> build_windows\MSVCP140.dll**  
**copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\VCRUNTIME140.dll -> build_windows\VCRUNTIME140.dll**  
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\wxbase30u_net_vc140.dll -> build_windows\wxbase30u_net_vc140.dll  
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\wxmsw30u_core_vc140.dll -> build_windows\wxmsw30u_core_vc140.dll  
copying C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\wx\siplib.cp36-win32.pyd -> build_windows\wx.siplib.pyd

Поэтому появление этих файлов не связано с параметром _include_msvcr_, который мы всегда устанавливаем в _True_. Если мы уберем этот параметр или присвоим ему значение _False_, файлы _MSVCP140.dll_ и _VCRUNTIME140.dll_ не пропадут из сборки. Это еще раз доказывает, что появлению этих файлов мы обязаны библиотеки wxPython, а не cx_Freeze.

Если заглянуть в архив _python36.zip_, то внутри мы увидим следующие файлы:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_12_zip.png)

Здесь может быть достаточно трудно понять, какие модули нужны, а какие лишние, поэтому лучше все оставить как есть.

Если мы теперь запустим созданный файл _hello_wx.exe_, то увидим одну особенность - появилось графическое окно, но кроме него на заднем фоне открылось также консольное окно.

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_12_wnd.png)

В этом нет ничего удивительного, ведь для запуска скриптов используется интерпретатор Python _python.exe_, который является консольным приложением. Но понятно, что обычному пользователю программу в таком виде отдавать нельзя, консольное окно нужно убрать.

Для этого в cx_Freeze предусмотрен специальный параметр конструктора класса _Executable_, который называется _base_. До сих пор мы не использовали этот параметр, что равносильно использованию значения "Console", что означает, что мы создаем консольное приложение. Другие возможные значения параметра _base_ это "Win32GUI" и "Win32Service".

Для того, чтобы избавиться от фонового консольного окна, достаточно в конструктор класса _Executable_ передать параметр _base="Win32GUI"_. Сделаем это (([Example 12-1](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2012-1))):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py',  
                          targetName='hello_wx.exe',  
                          base='Win32GUI')]  
  
excludes = ['logging', 'unittest', 'email', 'html', 'http', 'urllib', 'xml',  
            'unicodedata', 'bz2', 'select']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'wx']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.12',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=36)

Если теперь выполнить сборку и запустить приложение _hello_wx.exe_, то появится графическое окно без фонового консольного окна:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_12-1_wnd.png)

Как видите, никаких проблем с созданием графических приложений с использованием библиотеки wxPython нет.

### 11. Установка иконки приложения

Библиотека cx_Freeze позволяет устанавливать иконку для создаваемых запускаемых файлов. До сих пор мы не устанавливали иконку, поэтому в Windows использовалась картинка по умолчанию для запускаемых файлов:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_12-1_icon.png)

Чтобы поменять иконку запускаемого файла, достаточно в конструктор класса _Executable_ передать параметр _icon_, который должен содержать строку с именем файла иконки. К нашему следующему примеру ([Example 13](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2013)) прилагается высокохудожественная иконка, которая будет установлена для файла _hello_wx.exe_. Чтобы ее установить, добавим в конструктор класса _Executable_ параметр _icon_, который принимает строку с именем иконки для приложения:

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py',  
                          targetName='hello_wx.exe',  
                          base='Win32GUI',  
                          icon='example.ico')]  
  
excludes = ['logging', 'unittest', 'email', 'html', 'http', 'urllib', 'xml',  
            'unicodedata', 'bz2', 'select']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'wx']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
        'build_exe': 'build_windows',  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.13',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=37)

В результате сборки запускаемый файл в проводнике Windows будет выглядеть следующим образом:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_13.png)

### 12. Создание инсталятора MSI

Кроме создания запускаемых файлов cx_Freeze позволяет создавать то, что под Windows называется инсталятором, а под Linux - пакетами. Под Windows cx_Freeze умеет создавать инсталятор в формате MSI, под Linux - пакеты в формате RPM, а под Mac OS X - пакеты .app и .dmg. В этой статье мы рассмотрим только создание инсталятора под Windows.

Давайте сделаем инсталятор на основе предыдущего примера. Единственное, что нам нужно будет сделать - убрать из словаря _build_exe_ параметр _build_exe_, изменяющий папку для сборки. Как это ни странно, но если он установлен, то создатель инсталятора все равно ищет созданные файлы в папке, подразумеваемой по умолчанию. Возможно, это ошибка в cx_Freeze.

Новый скрипт для создания инсталятора ничем не примечателен по сравнению со скриптом для создания запускаемого файла ([Example 14](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2014)):

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py',  
                          targetName='hello_wx.exe',  
                          base='Win32GUI',  
                          icon='example.ico')]  
  
excludes = ['logging', 'unittest', 'email', 'html', 'http', 'urllib', 'xml',  
            'unicodedata', 'bz2', 'select']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'wx']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.14',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=38)

Для того, чтобы создать инсталятор под Windows, вместо команды _build_ мы должны использовать команду _bdist_msi_:

python setup.py bdist_msi

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=39)

**Внимание!** Для того, чтобы инсталятор успешно создался, путь до скрипта сборки _setup.py_ не должен содержать русские или другие не латинские буквы, иначе вы получите исключение:

Traceback (most recent call last):

  File "setup.py", line 27, in <module>
    options=options)
  File "C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\cx_Freeze\dist.py", line 349, in setup
    distutils.core.setup(**attrs)
  File "C:\Program Files (x86)\Python36-32\lib\distutils\core.py", line 148, in setup
    dist.run_commands()
  File "C:\Program Files (x86)\Python36-32\lib\distutils\dist.py", line 955, in run_commands
    self.run_command(cmd)
  File "C:\Program Files (x86)\Python36-32\lib\distutils\dist.py", line 974, in run_command
    cmd_obj.run()
  File "C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\cx_Freeze\windist.py", line 392, in run
    self.add_files()
  File "C:\Users\jenyay\AppData\Roaming\Python\Python36\site-packages\cx_Freeze\windist.py", line 133, in add_files
    cab.commit(db)
  File "C:\Program Files (x86)\Python36-32\lib\msilib\__init__.py", line 217, in commit
    FCICreate(filename, self.files)

ValueError: FCI error 1

После удачной сборки появятся две папки: папка _build_, внутри которой будет уже знакомая нам папка _exe.win32-3.6_ (мы ведь удалили параметр _build_exe_), и папка _dist_, внутри которой будет лежать файл _hello_world-0.0.15-win32.msi_. МЫ сделали очень простой инсталятор, если его запустить, то единственное, что он спросит пользователя, это папка, куда устанавливать программу:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_14_installer.png)

Сейчас инсталятор даже не создает иконку в меню "Пуск", давайте ее добавим ([Example 14-1](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2014-1)). В исправленном файле _setup.py_ мы передадим два новых параметра в конструктор класса _Executable_ - _shortcutName_ и _shortcutDir_. Параметр _shortcutName_ задает имя, которое будет отображаться в меню "Пуск", а _shortcutDir_ должно быть строкой из [этой таблицы](https://msdn.microsoft.com/en-us/library/aa370905v=vs.85.aspx#System_Folder_Properties), указывающей, в какую системную папку следует поместить ярлык. В нашем случае мы поместим ярлык в C:\ProgramData\Microsoft\Windows\Start Menu\Programs, что задается параметром shortcutDir='ProgramMenuFolder'.

# coding: utf-8  
  
from cx_Freeze import setup, Executable  
  
executables = [Executable('example.py',  
                          targetName='hello_wx.exe',  
                          base='Win32GUI',  
                          icon='example.ico',  
                          shortcutName='Hello wxPython Application',  
                          shortcutDir='ProgramMenuFolder')]  
  
excludes = ['logging', 'unittest', 'email', 'html', 'http', 'urllib', 'xml',  
            'unicodedata', 'bz2', 'select']  
  
zip_include_packages = ['collections', 'encodings', 'importlib', 'wx']  
  
options = {  
    'build_exe': {  
        'include_msvcr': True,  
        'excludes': excludes,  
        'zip_include_packages': zip_include_packages,  
    }  
}  
  
setup(name='hello_world',  
      version='0.0.14',  
      description='My Hello World App!',  
      executables=executables,  
      options=options)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=40)

Если теперь выполнить команду _python setup.py bdist_msi_, после чего запустить инсталятор и выполнить установку программы, то в меню "Пуск" появится иконка нашей программы:

![](https://jenyay.net/uploads/Programming/Cxfreeze/example_14-1_menu.png)

Создание MSI - это большая тема, достойная отдельной статьи, поэтому здесь мы ограничимся совсем коротким примером. К сожалению, в документации по cx_Freeze эта тема очень плохо описана, если вы хотите гибко настраивать параметры создаваемого инсталятора, то можете начать с этих двух ссылок - [раз](https://bitbucket.org/anthony_tuininga/cx_freeze/issues/48/documentation-of-how-to-create-desktop-or) и [два](https://stackoverflow.com/questions/15734703/use-cx-freeze-to-create-an-msi-that-adds-a-shortcut-to-the-desktop), но готовьтесь к тому, что вам придется разобраться с тем, как устроен формат MSI по MSDN. Хотя в документации к cx_Freeze говорится, что для создания сложных инсталяторов лучше использовать сторонние приложения, например [Inno Setup](http://www.jrsoftware.org/isinfo.php).

### 13. Скрипт cxfreeze-quickstart для создания файла setup.py

До сих пор мы предполагали, что файл _setup.py_ мы создавали сами с чистого листа. В этом нет ничего сложного, но для облегчения создания этого файла к библиотеке cx_Freeze прилагается скрипт _cxfreeze-quickstart_. После запуска этого скрипта он предложит ответить на несколько вопросов и создаст заготовку с уже частично настроенным файлом _setup.py_.

Но прежде, чем демонстрировать работу этого скрипта, надо сказать пару слов о запуске его под Windows. Дело в том, что скрипт _cxfreeze-quickstart_ поставляется в виде python-скрипта в формате, принятом в Linux - в виде файла с именем _cxfreeze-quickstart_ без расширения. Под Windows этот файл расположен в папке _Scripts_ внутри папки с Python. Например, если вы устанавливали cx_Freeze без использования virtualenv в папку пользователя (без использования прав администратора), то это будет папка _C:\Users\USERNAME\AppData\Roaming\Python\Scripts\_ .

Содержимое файла _cxfreeze-quickstart_ очень короткое:

#!c:\python27\python.exe  
from cx_Freeze.setupwriter import main  
  
main()

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=41)

Под Windows, если вы хотите использовать скрипт _cxfreeze-quickstart_ проще всего скопировать его из указанной выше папки в папку с вашим проектом, переименовать его в _cxfreeze-quickstart.py_ и запустить с помощью команды

python cxfreeze-quickstart.py

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=42)

Давайте запустим его и введем некоторые параметры ([Example 15](https://github.com/Jenyay/cx_freeze_examples/tree/master/example%2015)):

$ python cxfreeze-quickstart.py

**Project name:** My project  
**Version [1.0]:** 0.0.14  
**Description:** Example for article.  
**Python file to make executable from:** example_15.py  
**Executable file name [example_15]:** hello.exe  
**(C)onsole application, (G)UI application, or (S)ervice [C]:** G  
**Save setup script to [setup.py]:**

'''Setup script written to setup.py; run it as:

    python setup.py build

Run this now [n]?''' n

Для наглядности строки, которые выводит скрипт _cxfreeze-quickstart_, выделены полужирным шрифтом.

После того, как мы ответим на все вопросы, будет создан файл _setup.py_ со следующим содержимым:

from cx_Freeze import setup, Executable  
  
# Dependencies are automatically detected, but it might need  
# fine tuning.  
buildOptions = dict(packages = [], excludes = [])  
  
import sys  
base = 'Win32GUI' if sys.platform=='win32' else None  
  
executables = [  
    Executable('example_15.py', base=base, targetName = 'hello.exe')  
]  
  
setup(name='My project',  
      version = '0.0.15',  
      description = 'Example for article.',  
      options = dict(build_exe = buildOptions),  
      executables = executables)

[Исходник](https://jenyay.net/Programming/Cxfreeze?action=sourceblock&num=43)

А дальше мы можем заполнять недостающие параметры самостоятельно.

### 14. Заключение

Мы рассмотрели основы использования библиотеки cx_Freeze для создания запускаемых файлов из python-скриптов. Мы научились создавать файл с параметрами сборки, который обычно называется _setup.py_ , как с нуля, так и с помощью скрипта _cxfreeze-quickstart_. Разобрались с некоторыми параметрами, которые влияют на создание запускаемых файлов, а именно: как исключать лишние модули из сборки, как добавлять необходимые модули вручную, как менять папку для сборки. Мы рассмотрели особенности создания запускаемых файлов из скриптов, создающих графический интерфейс на примере wxPython, рассмотрели основы для создания инсталятора MSI под Windows.

Но библиотека cx_Freeze предлагает еще больше возможностей, которые остались за рамками статьи. Например, мы ничего не сказали о задании параметров сборки через командную строку (эти параметры могут заменять параметры, указанные в файле _setup.py_). Мы ничего не сказали о сборке запускаемых файлов и инсталяторов под другие операционные системы (Linux и Mac OS). Также за рамками статьи остались некоторые параметры, которые можно использовать в скрипте сборки _setup.py_. Обо всем этом вы можете прочитать в [официальной документации](http://cx-freeze.readthedocs.io/en/latest) библиотеки cx_Freeze.

И в завершение надо сказать, что cx_Freeze **не** позволяет делать. Во-первых, с помощью cx_Freeze вы можете делать сборки только под ту операционную систему, в которой вы работаете в данный момент, т.е. cx_Freeze - не инструмент для кросскомпиляции. И, во-вторых, в отличие от других подобных инструментов (например, [pyInstaller](http://www.pyinstaller.org/)), cx_Freeze не позволяет упаковать все необходимые файлы в один exe-шник.

На этом мы закончим статью, надеюсь, что она будет вам полезна. Еще раз напомню ссылку на github, где вы можете скачать все примеры, используемые в статье - [https://github.com/Jenyay/cx_freeze_examples](https://github.com/Jenyay/cx_freeze_examples)

Возможно, вас также заинтересуют другие [статьи по программированию на Python](http://jenyay.net/Programming/Python).