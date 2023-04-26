## напши список книг по PyQT

Конечно! Вот несколько книг по PyQt, которые могут быть полезны при изучении этой библиотеки:

1. "Rapid GUI Programming with Python and Qt" (Mark Summerfield)

2. "Creating GUI Applications with PyQt and Qt Designer" (Mark Summerfield)

3. "PyQt5 Tutorial: Create a Python GUI in 2020" (Jan Bodnar)

4. "PyQt GUI Programming Cookbook" (B.M. Harwani)

5. "Python GUI Programming with PyQt5" (Alan D. Moore)

6. "PyQt5 Projects: Create Python GUI Projects That Go Beyond the Basics" (Alan D. Moore)

7. "PyQt5: Create Dynamic and Interactive GUIs with Python and Qt" (Gabriel Garrido Calvo)

8. "PyQt5 from A to Z" (Mohamed Emam)

Надеюсь, эти рекомендации помогут вам выбрать книгу для изучения PyQt. Удачи в изучении!

## что означает ошибка:
```
Traceback (most recent call last):
  File "/home/hightemp/Projects/app_data_manager/demo/qt/09.py", line 4, in <module>
    from PyQt5.QtWebEngineWidgets import *
ImportError: /home/hightemp/.local/lib/python3.10/site-packages/PyQt5/Qt5/lib/libQt5WebEngineCore.so.5: undefined symbol: _ZNSt12out_of_rangeC1EPKc, version Qt_5
```

Эта ошибка возникает, когда версия библиотеки PyQt5 не соответствует версии библиотеки Qt5WebEngineCore.so.5. Вероятно, что PyQT5 была пересобрана с другой версией Qt, отличной от той, которая была использована для сборки устанавливаемой библиотеки.

Символ '_ZNSt12out_of_rangeC1EPKc', упоминаемый в ошибке, является символом библиотеки STL C++ "std::out_of_range::out_of_range(char const*)". Похоже, что версия символа в библиотеке PyQt5, используемой Вами, отличается от используемой в библиотеке Qt5WebEngineCore.so.5.

Чтобы исправить эту ошибку, можно попробовать следующие действия:

1. Обновить установленные версии PyQt5 и Qt5, чтобы они соответствовали друг другу, или использовать версии, которые были собраны из одного и того же исходного кода.
2. Сделать переустановку PyQt5 и Qt5WebEngineCore.so.5, чтобы обеспечить их совместимость.
3. Убедиться, что все необходимые зависимости и библиотеки правильно установлены и доступны для использования в Вашей системе.
4. Проверить, что переменные окружения настроены правильно, чтобы PyQt5 и Qt5 могли найти и использовать необходимые библиотеки и зависимости.

Если данные действия не помогают в решении ошибки, то рекомендуется обратиться к сообществу проекта или разработчикам для получения дополнительной помощи и поддержки в решении данного вопроса.

## почему PythonHighlighter не обновляет подсветку после редактирования текста

QSyntaxHighlighter не обновляет подсветку сразу после изменения текста в редакторе, чтобы избежать излишних нагрузок на процессор. Вместо этого он вызывает метод rehighlight при необходимости обновления подсветки.

Вы можете добавить слот update_highlighting для обновления подсветки после каждого изменения текста в редакторе. Вот пример кода, который показывает, как это сделать:

```python
class PythonHighlighter(QSyntaxHighlighter):
	...
    def update_highlighting(self):
        self.rehighlight()
```

Затем вы можете подключить этот слот к сигналу textChanged вашего QTextEdit:

```
editor = QTextEdit()
highlighter = PythonHighlighter(editor.document())
editor.textChanged.connect(highlighter.update_highlighting)
```

Теперь подсветка будет обновляться автоматически после каждого изменения текста в редакторе.