https://habr.com/ru/articles/516098/

Два года назад я писал на Хабр [статью про Yargy-парсер и библиотеку Natasha](https://habr.com/ru/post/349864/), рассказывал про решение задачи NER для русского языка, построенное на правилах. Проект хорошо приняли. Yargy-парсер заменил [яндексовый Томита-парсер](https://yandex.ru/dev/tomita/) в крупных проектах внутри Сбера, Интерфакса и РИА Новостей. Библиотека Natasha сейчас встроена в образовательные программы ВШЭ, МФТИ и МГУ.  
  
Проект подрос, библиотека теперь решает все базовые задачи обработки естественного русского языка: сегментация на токены и предложения, морфологический и синтаксический анализ, лемматизация, извлечение именованных сущностей.  
![](https://habrastorage.org/r/w1560/webt/r7/_x/u-/r7_xu-3lepbdxktr04l41oujfae.png)  
Для новостных статей качество на всех задачах [сравнимо или превосходит существующие решения](https://github.com/natasha/natasha#evaluation). Например с задачей NER Natasha справляется на 1 процентный пункт хуже, чем [Deeppavlov BERT NER](https://github.com/natasha/naeval#deeppavlov_bert_ner) (F1 PER 0.97, LOC 0.91, ORG 0.85), модель весит в 75 раз меньше (27МБ), работает на CPU в 2 раза быстрее (25 статей/сек), чем BERT NER на GPU.  
  
[В проекте 9 репозиториев](https://github.com/natasha), библиотека Natasha объединяет их под одним интерфейсом. В статье поговорим про новые инструменты, сравним их с существующими решениями: [Deeppavlov](http://deeppavlov.ai/), [SpaCy](https://spacy.io/), [UDPipe](http://ufal.mff.cuni.cz/udpipe).  
![](https://habrastorage.org/r/w1560/webt/pu/63/yp/pu63ypcw3q3pb9f06pufhdynppw.png)  
  

> Этому лонгриду предшествовала серия публикация на сайте [natasha.github.io](http://natasha.github.io/):  
>   
> 
> -   [Natasha — качественный компактный NER для русского языка](http://natasha.github.io/ner)
> -   [Navec — компактные эмбеддинги для русского языка](http://natasha.github.io/navec)
> -   [Corus — коллекция русскоязычных NLP-датасетов](http://natasha.github.io/corus)
> -   [Razdel — сегментация русскоязычного текста на токены и предложения](http://natasha.github.io/razdel)
> -   [Naeval — количественное сравнение систем для русскоязычного NLP](http://natasha.github.io/naeval)
> -   [Nerus — большой синтетический русскоязычный датасет с разметкой морфологии, синтаксиса и именованных сущностей](http://natasha.github.io/nerus)
> 
>   
> В тексте использованы заметки и обсуждения из чата [t.me/natural_language_processing](https://t.me/natural_language_processing), там же в закрепе появляются ссылки на новые материалы:  
>   
> 
> -   [Почему Natasha не использует Transformers. BERT в 100 строк](https://t.me/natural_language_processing/17369)
> -   [BERT-модели Slovnet](https://t.me/natural_language_processing/18186)
> -   [Ламповый стрим про историю проекта Natasha](https://t.me/natural_language_processing/18673)
> -   [Обновлённая документация Yargy](https://t.me/natural_language_processing/19507)
> -   [Дополнительные материалы по Yargy-парсеру](https://t.me/natural_language_processing/19508)
> 
>   

Если вас пугает размер текста ниже, посмотрите первые 20 минут лампового стрима про историю проекта Natasha, там короткий пересказ:  
  

  
Кто больше любит слушать, посмотрите часовой доклад на Datafest 2020, он почти покрывает этот пост:  

  
Содержание:  
  

-   [Natasha — набор качественных открытых инструментов для обработки естественного русского языка. Интерфейс для низкоуровневых библиотек проекта](https://habr.com/ru/articles/516098/#natasha)
-   [Razdel — сегментация русскоязычного текста на токены и предложения](https://habr.com/ru/articles/516098/#razdel)
-   [Slovnet — deep learning моделирование для обработки естественного русского языка](https://habr.com/ru/articles/516098/#slovnet)
-   [Navec — компактные эмбеддинги для русского языка](https://habr.com/ru/articles/516098/#navec)
-   [Nerus — большой синтетический датасет с разметкой морфологии, синтаксиса и именованных сущностей](https://habr.com/ru/articles/516098/#nerus)
-   [Corus — коллекция ссылок на публичные русскоязычные датасеты + функции для загрузки](https://habr.com/ru/articles/516098/#corus)
-   [Naeval — количественное сравнение систем для русскоязычного NLP](https://habr.com/ru/articles/516098/#naeval)
-   [Yargy-парсер — извлечение структурированное информации из текстов на русском языке с помощью грамматик и словарей](https://habr.com/ru/articles/516098/#yargy)
-   [Ipymarkup — визуализация разметки именованных сущностей и синтаксических связей](https://habr.com/ru/articles/516098/#ipymarkup)

  
  

## Natasha — набор качественных открытых инструментов для обработки естественного русского языка. Интерфейс для низкоуровневых библиотек проекта

  
![](https://habrastorage.org/r/w1560/webt/rz/dk/l-/rzdkl-9ynag5bfpvd_jtzqpz0iu.png)  
  
Раньше библиотека Natasha решала задачу [NER для русского языка, была построена на правилах](https://habr.com/ru/post/349864/), показывала среднее качество и производительность. Сейчас Natasha — это целый [большой проект, состоит из 9 репозиториев](https://github.com/natasha). [Библиотека Natasha](https://github.com/natasha/natasha) объединяет их под одним интерфейсом, решает базовые задачи обработки естественного русского языка: сегментация на токены и предложения, предобученные эмбеддинги, анализ морфологии и синтаксиса, лемматизация, NER. Все решения показывают [топовые результаты в новостной тематике](https://github.com/natasha/natasha#evaluation), быстро работают на CPU.  
  
Natasha похожа на другие библиотеки-комбайны: [SpaCy](https://spacy.io/), [UDPipe](http://ufal.mff.cuni.cz/udpipe), [Stanza](https://stanfordnlp.github.io/stanza/). SpaCy инициализирует и вызывает модели неявно, пользователь передаёт текст в магическую функцию `nlp`, получает полностью разобранный документ.  
  

```
import spacy

# Внутри load происходит загрузка предобученных эмбеддингов,
# инициализация компонентов для разбора морфологии, синтаксиса и NER
nlp = spacy.load('...')

# Пайплайн моделей обрабатывает текст, возвращает разобранный документ
text = '...'
doc = nlp(text)
```

  
Интерфейс Natasha более многословный. Пользователь явно инициализирует компоненты: загружает предобученные эмбеддинги, передаёт их в конструкторы моделей. Сам вызывает методы `segment`, `tag_morph`, `parse_syntax` для сегментации на токены и предложения, анализа морфологии и синтаксиса.  
  

```
>>> from natasha import (
    Segmenter,
    
    NewsEmbedding,
    NewsMorphTagger,
    NewsSyntaxParser,
    
    Doc
)

>>> segmenter = Segmenter()

>>> emb = NewsEmbedding()
>>> morph_tagger = NewsMorphTagger(emb)
>>> syntax_parser = NewsSyntaxParser(emb)

>>> text = 'Посол Израиля на Украине Йоэль Лион признался, что пришел в шок, узнав о решении властей Львовской области объявить 2019 год годом лидера запрещенной в России Организации украинских националистов (ОУН) Степана Бандеры...'
>>> doc = Doc(text)

>>> doc.segment(segmenter)
>>> doc.tag_morph(morph_tagger)
>>> doc.parse_syntax(syntax_parser)

>>> sent = doc.sents[0]
>>> sent.morph.print()
               Посол NOUN|Animacy=Anim|Case=Nom|Gender=Masc|Number=Sing
             Израиля PROPN|Animacy=Inan|Case=Gen|Gender=Masc|Number=Sing
                  на ADP
             Украине PROPN|Animacy=Inan|Case=Loc|Gender=Fem|Number=Sing
               Йоэль PROPN|Animacy=Anim|Case=Nom|Gender=Masc|Number=Sing
                Лион PROPN|Animacy=Anim|Case=Nom|Gender=Masc|Number=Sing
...

>>> sent.syntax.print()
        ┌──► Посол         nsubj
        │    Израиля       
        │ ┌► на            case
        │ └─ Украине       
        │ ┌─ Йоэль         
        │ └► Лион          flat:name
┌─────┌─└─── признался     
│     │ ┌──► ,             punct
│     │ │ ┌► что           mark
│     └►└─└─ пришел        ccomp
│     │   ┌► в             case
│     └──►└─ шок           obl
...
```

  
Модуль извлечения именованных сущностей не зависит от результатов морфологического и синтаксического разбора, его можно использовать отдельно.  
  

```
>>> from natasha import NewsNERTagger

>>> ner_tagger = NewsNERTagger(emb)
>>> doc.tag_ner(ner_tagger)
>>> doc.ner.print()
Посол Израиля на Украине Йоэль Лион признался, что пришел в шок, узнав
      LOC────    LOC──── PER───────                                   
 о решении властей Львовской области объявить 2019 год годом лидера 
                   LOC──────────────                                
запрещенной в России Организации украинских националистов (ОУН) 
              LOC─── ORG─────────────────────────────────────── 
Степана Бандеры...
PER──────────── 
```

  
Natasha решает задачу лемматизации, использует [Pymorphy2](https://pymorphy2.readthedocs.io/en/latest/) и результаты морфологического разбора.  
  

```
>>> from natasha import MorphVocab

>>> morph_vocab = MorphVocab()

>>> for token in doc.tokens:
>>>     token.lemmatize(morph_vocab)

>>> {_.text: _.lemma for _ in doc.tokens}
{'Посол': 'посол',
 'Израиля': 'израиль',
 'на': 'на',
 'Украине': 'украина',
 'Йоэль': 'йоэль',
 'Лион': 'лион',
 'признался': 'признаться',
 ',': ',',
 'что': 'что',
 'пришел': 'прийти'
...
```

  
Чтобы привести словосочетание к нормальной форме, недостаточно найти леммы отдельных слов, для «МИД России» получится «МИД Россия», для «Организации украинских националистов» — «Организация украинский националист». Natasha использует результаты синтаксического разбора, учитывает связи между словами, нормализует именованные сущности.  
  

```
>>> for span in doc.spans:
>>>    span.normalize(morph_vocab)

>>> {_.text: _.normal for _ in doc.spans}
{'Израиля': 'Израиль',
 'Украине': 'Украина',
 'Йоэль Лион': 'Йоэль Лион',
 'Львовской области': 'Львовская область',
 'России': 'Россия',
 'Организации украинских националистов (ОУН)': 'Организация украинских националистов (ОУН)',
 'Степана Бандеры': 'Степан Бандера',
...
```

  
Natasha находит в тексте имена, названия организаций и топонимов. Для имён в библиотеке есть набор готовых правил для [Yargy-парсера](https://github.com/natasha/yargy), модуль делит нормированные имена на части, из «Виктор Федорович Ющенко» получается `{first: Виктор, last: Ющенко, middle: Федорович}`.  
  

```
>>> from natasha import (
    PER,
    NamesExtractor,
)

>>> names_extractor = NamesExtractor(morph_vocab)

>>> for span in doc.spans:
>>>    if span.type == PER:
>>>        span.extract_fact(names_extractor)

>>> {_.normal: _.fact.as_dict for _ in doc.spans if _.type == PER}
{'Йоэль Лион': {'first': 'Йоэль', 'last': 'Лион'},
 'Степан Бандера': {'first': 'Степан', 'last': 'Бандера'},
 'Петр Порошенко': {'first': 'Петр', 'last': 'Порошенко'},
 'Бандера': {'last': 'Бандера'},
 'Виктор Ющенко': {'first': 'Виктор', 'last': 'Ющенко'}}
```

  
В библиотеке собраны правила для разбора дат, сумм денег и адресов, они описаны в [документации и справочнике](https://nbviewer.jupyter.org/github/natasha/natasha/blob/master/docs.ipynb).  
  
Библиотека Natasha хорошо подходит для демонстрации технологий проекта, используется в образовании. Архивы с весами моделей встроены в пакет, после установки не нужно ничего скачивать и настраивать.  
  
Natasha объединяет под одним интерфейсом другие библиотеки проекта. Для решения практических задач стоит использовать их напрямую:  
  

-   [Razdel](https://github.com/natasha/razdel) — сегментация текста на предложения и токены;  
    
-   [Navec](https://github.com/natasha/navec) — качественный компактные эмбеддинги;  
    
-   [Slovnet](https://github.com/natasha/slovnet) — современные компактные модели для морфологии, синтаксиса, NER;  
    
-   [Yargy](https://github.com/natasha/yargy) — правила и словари для извлечения структурированной информации;  
    
-   [Ipymarkup](https://github.com/natasha/ipymarkup) — визуализация NER и синтаксической разметки;  
    
-   [Corus](https://github.com/natasha/corus) — коллекция ссылок на публичные русскоязычные датасеты;  
    
-   [Nerus](https://github.com/natasha/nerus) — большой корпус с автоматической разметкой именованных сущностей, морфологии и синтаксиса.  
    

  
  

## Razdel — сегментация русскоязычного текста на токены и предложения

  
![](https://habrastorage.org/r/w1560/webt/qv/l0/ts/qvl0tsnrvumgt5wb4qczr9na6ci.png)  
  
[Библиотека Razdel](https://github.com/natasha/razdel) — часть проекта Natasha, делит русскоязычный текст на токены и предложения. [Инструкция по установке](https://github.com/natasha/razdel#installation), [пример использования](https://github.com/natasha/razdel#usage) и [замеры производительности](https://github.com/natasha/razdel#evaluation) в репозитории Razdel.  
  

```
>>> from razdel import tokenize, sentenize

>>> text = 'Кружка-термос на 0.5л (50/64 см³, 516;...)'
>>> list(tokenize(text))
[Substring(start=0, stop=13, text='Кружка-термос'),
 Substring(start=14, stop=16, text='на'),
 Substring(start=17, stop=20, text='0.5'),
 Substring(start=20, stop=21, text='л'),
 Substring(start=22, stop=23, text='(')
 ...]

>>> text = '''
... - "Так в чем же дело?" - "Не ра-ду-ют".
... И т. д. и т. п. В общем, вся газета
... '''
>>> list(sentenize(text))
[Substring(start=1, stop=23, text='- "Так в чем же дело?"'),
 Substring(start=24, stop=40, text='- "Не ра-ду-ют".'),
 Substring(start=41, stop=56, text='И т. д. и т. п.'),
 Substring(start=57, stop=76, text='В общем, вся газета')]
```

  
Современные модели часто не заморачиваются на счёт сегментации, используют [BPE](https://dyakonov.org/2019/11/29/%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%BF%D0%BE%D0%B4%D1%81%D0%BB%D0%BE%D0%B2%D0%B0-subword-tokenization/), показывают замечательные результаты, вспомним все версии [GPT](https://openai.com/blog/better-language-models/) и зоопарк [BERT](https://arxiv.org/abs/1810.04805)ов. Natasha решает задачи разбора морфологии и синтаксиса, они имеют смысл только для отдельных слов внутри одного предложения. Поэтому мы ответственно подходим к этапу сегментации, стараемся повторить разметку из популярных открытых датасетов: [SynTagRus](https://github.com/natasha/corus#load_ud_syntag), [OpenCorpora](https://github.com/natasha/corus#load_morphoru_corpora), [GICRYA](https://github.com/natasha/corus#load_morphoru_gicrya).  
  
Скорость и качество Razdel сопоставимы или выше, чем у других открытых решений для русского языка.  

Решения для сегментации на токены

Ошибки на 1000 токенов

Время обработки, секунды

Regexp-baseline

19

**0.5**

[SpaCy](https://github.com/natasha/naeval#spacy)  

17

5.4

[NLTK](https://github.com/natasha/naeval#nltk)  

130

3.1

[MyStem](https://github.com/natasha/naeval#mystem)  

19

4.5

[Moses](https://github.com/natasha/naeval#moses)  

**11**

**1.9**

[SegTok](https://github.com/natasha/naeval#segtok)  

12

2.1

[SpaCy Russian Tokenizer](https://github.com/natasha/naeval#spacy_russian_tokenizer)  

**8**

46.4

[RuTokenizer](https://github.com/natasha/naeval#rutokenizer)  

15

**1.0**

Razdel  

**7**

2.6

  

Решения для сегментации на предложения

Ошибки на 1000 предложений

Время обработки, секунды

Regexp-baseline

76

**0.7**

[SegTok](https://github.com/natasha/naeval#segtok)  

381

10.8

[Moses](https://github.com/natasha/naeval#moses)  

166

**7.0**

[NLTK](https://github.com/natasha/naeval#nltk)  

**57**

7.1

[DeepPavlov](https://github.com/natasha/naeval#rusenttokenizer)  

**41**

8.5

Razdel

**43**

**4.8**

  
_Число ошибок среднее по 4 датасетам: [SynTagRus](https://github.com/natasha/corus#load_ud_syntag), [OpenCorpora](https://github.com/natasha/corus#load_morphoru_corpora), [GICRYA](https://github.com/natasha/corus#load_morphoru_gicrya) and [RNC](https://github.com/natasha/corus#load_morphoru_rnc). Подробнее в [репозитории Razdel](https://github.com/natasha/razdel#evaluation).  
_  
Зачем вообще нужен Razdel, если похожее качество даёт baseline с регулярочкой и для русского языка есть куча готовых решений? На самом деле, Razdel это не просто токенизатор, а небольшой сегментационный движок на правилах. Сегментация базовая задача, часто встречается на практике. Например, есть судебный акт, нужно выделить в нём резолютивную часть и поделить её на параграфы. Естественно, готовые решения так не умеют. Как писать свои правила [читайте в исходниках](https://github.com/natasha/razdel/blob/master/razdel/segmenters/sentenize.py). Дальше речь о том, как упороться и сделать на нашем движке топовое решение для токенов и предложений.  
  

### В чём сложность?

  
В русском языке предложения обычно заканчиваются точкой, вопросительным или восклицательным знаком. Просто разделим текст регулярным выражением `[.?!]\s+`. Такое решение даст 76 ошибок на 1000 предложений. Типы и примеры ошибок:  
  
Cокращения  
… любая площадка с аудиторией от 3 тыс.▒человек является блогером.  
… над ними с конца XVII в.▒стоял бей;  
… в Камерном музыкальном театре им.▒Б.А. Покровского.  
  
Инициалы  
В след за операми «Идоменей» В.А.▒Моцарта – Р.▒Штрауса …  
  
Списки  
2.▒думал будет в финское консульство красивая длинная очередь …  
г.▒билеты на поезда российских железных дорог …  
  
В конце предложения смайлик или типографское многоточие  
Кто предложит способ избавления от минусов — тому спасибо :)▒Посмотрел, призадумался…▒Вот это уже более неприятно, поскольку содержательность нарушится.  
  
Цитаты, прямая речь, в конце предложения кавычка  
— невесты у вас в городе есть?»▒«Кому и кобыла невеста».  
«Как хорошо, что я не такой!»▒Сейчас при переводе сделал фрейдстскую ошибку:«идология».  
  
Razdel учитывает эти нюансы, сокращает число ошибок c 76 до 43 на 1000 предложений.  
  
С токенами аналогичная ситуация. Хорошее базовое решение даёт регулярное выражение `[а-яё-]+|[0-9]+|[^а-яё0-9 ]`, оно делает 19 ошибок на 1000 токенов. Примеры:  
  
Дробные числа, сложная пунктуация  
… В конце 1980▒-х — начале 1990▒-х  
… БС-▒3 можно отметить слегка меньшую массу (3▒,▒6 т)  
— да и умерла.▒.▒. Понял ли девку, сокол?▒!  
  
Razdel сокращает число ошибок до 7 на 1000 токенов.  
  

### Принцип работы

  
Система построена на правилах. Принцип сегментации на токены и предложения одинаковый.  
  

#### Сбор кандидатов

  
Находим в тексте всех кандидатов на конец предложения: точки, многоточия, скобки, кавычки.  
  
6.▒Наиболее частый и при этом высоко оцененный вариант ответов «я рада»▒(13 высказываний, 25 баллов)▒– ситуации получения одобрения и поощрения.▒7.▒Примечательно, что в ответе «я знаю»▒оценен как максимально стереотипный, но лишь раз встречается ответ «я женщина»▒;▒присутствуют высказывания «один брак – это всё, что меня ждет в этой жизни»▒и «рано или поздно придется рожать»▒.▒Составители: В.▒П.▒Головин, Ф.▒В.▒Заничев, А.▒Л.▒Расторгуев, Р.▒В.▒Савко, И.▒И.▒Тучков.  
  
Для токенов дробим текст на атомы. Внутри атома точно не проходит граница токена.  
  
В▒конце▒1980▒-▒х▒-▒начале▒1990▒-▒х▒  
БС▒-▒3▒можно▒отметить▒слегка▒меньшую▒массу▒(▒3▒,▒6▒т▒)▒  
▒—▒да▒и▒умерла▒.▒.▒.▒Понял▒ли▒девку▒,▒сокол▒?▒!  
  

#### Объединение

  
Последовательно обходим кандидатов на разделение, убираем лишние. Используем список эвристик.  
  
Элемент списка. Разделитель — точка или скобка, слева число или буква  
6.▒Наиболее частый и при этом высоко оцененный вариант ответов «я рада» (13 высказываний, 25 баллов) – ситуации получения одобрения и поощрения. 7.▒Примечательно, что в ответе «я знаю» …  
  
Инициалы. Разделитель — точка, слева одна заглавная буква  
… Составители: В.▒П.▒Головин, Ф.▒В.▒Заничев, А.▒Л.▒Расторгуев, Р.▒В.▒Савко, И.▒И.▒Тучков.  
  
Справа от разделителя нет пробела  
… но лишь раз встречается ответ «я женщина»▒; присутствуют высказывания «один брак – это всё, что меня ждет в этой жизни» и «рано или поздно придется рожать»▒.  
  
Перед закрывающей кавычкой или скобкой нет знака конца предложения, это не цитата и не прямая речь  
6. Наиболее частый и при этом высоко оцененный вариант ответов «я рада»▒(13 высказываний, 25 баллов)▒– ситуации получения одобрения и поощрения. … «один брак – это всё, что меня ждет в этой жизни»▒и «рано или поздно придется рожать».  
  
В результате остаётся два разделителя, считаем их концами предложений.  
  
6. Наиболее частый и при этом высоко оцененный вариант ответов «я рада» (13 высказываний, 25 баллов) – ситуации получения одобрения и поощрения.▒7. Примечательно, что в ответе «я знаю» оценен как максимально стереотипный, но лишь раз встречается ответ «я женщина»; присутствуют высказывания «один брак – это всё, что меня ждет в этой жизни» и «рано или поздно придется рожать».▒Составители: В. П. Головин, Ф. В. Заничев, А. Л. Расторгуев, Р. В. Савко, И. И. Тучков.  
  
Для токенов процедура аналогичная, правила другие.  
  
Дробь или рациональное число  
… (3▒,▒6 т) …  
  
Сложная пунктуация  
— да и умерла.▒.▒. Понял ли девку, сокол?▒!  
  
Вокруг дефиса нет пробелов, это не начало прямой речи  
В конце 1980▒-▒х — начале 1990▒-▒х  
БС▒-▒3 можно отметить …  
  
Всё что осталось считаем границами токенов.  
  
В▒конце▒1980-х▒-▒начале▒1990-х▒  
БС-3▒можно▒отметить▒слегка▒меньшую▒массу▒(▒3,6▒т▒)▒  
▒—▒да▒и▒умерла▒...▒Понял▒ли▒девку▒,▒сокол▒?!  
  

### Ограничения

  
Правила в Razdel оптимизированы для аккуратно написанных текстов с правильной пунктуацией. Решение хорошо работает с новостными статьями, художественными текстами. На постах из социальных сетей, расшифровках телефонных разговоров качество ниже. Если между предложениями нет пробела или в конце нет точки или предложение начинается с маленькой буквы, Razdel сделает ошибку.  
  
Как писать правила под свои задачи [читайте в исходниках](https://github.com/natasha/razdel/blob/master/razdel/segmenters/sentenize.py), в документации эта тема пока не раскрыта.  
  

## Slovnet — deep learning моделирование для обработки естественного русского языка

  
![](https://habrastorage.org/r/w1560/webt/jq/k-/fv/jqk-fvsz6fbzbxakuhekbj7b1xw.png)  
  
В проекте Natasha [Slovnet](https://github.com/natasha/slovnet) занимается обучением и инференсом современных моделей для русскоязычного NLP. В библиотеке собраны качественные компактные модели для извлечения именованных сущностей, разбора морфологии и синтаксиса. [Качество на всех задачах сравнимо или превосходит](https://github.com/natasha/slovnet#evaluation) другие отрытые решения для русского языка на текстах новостной тематики. [Инструкция по установке](https://github.com/natasha/slovnet#install), [примеры использования](https://github.com/natasha/slovnet#usage) — в [репозитории Slovnet](https://github.com/natasha/slovnet). Подробно разберёмся, как устроено решение для задачи NER, для морфологии и синтаксиса всё по аналогии.  
  
В конце 2018 года после [статьи от Google про BERT](https://arxiv.org/abs/1810.04805) в англоязычном NLP случился большой прогресс. В 2019 ребята из [проекта DeepPavlov](https://deeppavlov.ai/) адаптировали мультиязычный BERT для русского, появился [RuBERT](http://docs.deeppavlov.ai/en/master/features/models/bert.html). Поверх обучили [CRF-голову](http://homepages.inf.ed.ac.uk/csutton/publications/crftut-fnt.pdf), получился [DeepPavlov BERT NER](https://www.youtube.com/watch?v=eKTA8i8s-zs) — SOTA для русского языка. У модели великолепное качество, в 2 раза меньше ошибок, чем у ближайшего преследователя [DeepPavlov NER](https://github.com/deepmipt/ner), но размер и производительность пугают: 6ГБ — потребление GPU RAM, 2ГБ — размер модели, 13 статей в секунду — производительность на хорошей GPU.  
  
В 2020 году в проекте Natasha нам удалось вплотную приблизится по качеству к DeepPavlov BERT NER, размер модели получился в 75 раз меньше (27МБ), потребление памяти в 30 раз меньше (205МБ), скорость в 2 раза больше на CPU (25 статей в секунду).  

Natasha, Slovnet NER

DeepPavlov BERT NER

PER/LOC/ORG F1 по токенам, среднее по Collection5, factRuEval-2016, BSNLP-2019, Gareev

0.97/0.91/0.85

0.98/0.92/0.86

Размер модели

27МБ

2ГБ

Потребление памяти

205МБ

6ГБ (GPU)

Производительность, новостных статей в секунду (1 статья ≈ 1КБ)

25 на CPU (Core i5)

13 на GPU (RTX 2080 Ti), 1 на CPU

Время инициализации, секунд

1

35

Библиотека поддерживает

Python 3.5+, PyPy3

Python 3.6+

Зависимости

NumPy

TensorFlow

  
_Качество Slovnet NER на 1 процентный пункт ниже, чем у SOTA DeepPavlov BERT NER, размер модели в 75 раз меньше, потребление памяти в 30 раз меньше, скорость в 2 раза больше на CPU. Сравнение со SpaCy, PullEnti и другими решениями для русскоязычного NER в [репозитории Slovnet](https://github.com/natasha/slovnet#ner-1)._  
  
Как получить такой результат? Короткий рецепт:  

> [Slovnet NER](https://github.com/natasha/slovnet#ner) = [Slovnet BERT NER](https://github.com/natasha/slovnet/blob/master/scripts/02_bert_ner/main.ipynb) — аналог DeepPavlov BERT NER + дистилляция через синтетическую разметку ([Nerus](https://github.com/natasha/nerus)) в WordCNN-CRF c квантованными эмбеддингами ([Navec](https://github.com/natasha/navec)) + движок для инференса на NumPy.  

  
Теперь по порядку. План такой: обучим тяжёлую модель c BERT-архитектурой на небольшом вручную аннотированном датасете. Разметим ей корпус новостей, получится большой грязный синтетический тренировочный датасет. Обучим на нём компактную примитивную модель. Этот процесс называется дистилляцией: тяжёлая модель — учитель, компактная — ученик. Рассчитываем, что BERT-архитектура избыточна для задачи NER, компактная модель несильно проиграет по качеству тяжёлой.  
  

### Модель-учитель

  
DeepPavlov BERT NER состоит из RuBERT-энкодера и CRF-головы. Наша тяжёлая модель-учитель повторяет эту архитектуру с небольшими улучшениями.  
  
Все бенчмарки измеряют качество NER на текстах новостей. Дообучим RuBERT на новостях. В репозитории [Corus](https://github.com/natasha/corus) собраны ссылки на публичные русскоязычные новостные корпуса, в сумме 12 ГБ текстов. Используем техники из [статьи от Facebook про RoBERTa](https://arxiv.org/abs/1907.11692): большие агрегированные батчи, динамическая маска, отказ от предсказания следующего предложения (NSP). RuBERT использует огромный словарь на 120 000 сабтокенов — наследие мультиязычного BERT от Google. Сократим размер до 50 000 самых частотных для новостей, покрытие уменьшится на 5%. Получим [NewsRuBERT](https://github.com/natasha/slovnet/blob/master/scripts/01_bert_news/main.ipynb), модель предсказывает замаскированные сабтокены в новостях на 5 процентных пунктов лучше RuBERT (63% в топ-1).  
  
Обучим NewsRuBERT-энкодер и CRF-голову на 1000 статей из [Collection5](https://github.com/natasha/corus#load_ne5). Получим [Slovnet BERT NER](https://github.com/natasha/slovnet/blob/master/scripts/02_bert_ner/main.ipynb), качество на 0.5 процентных пункта лучше, чем у DeepPavlov BERT NER, размер модели меньше в 4 раза (473МБ), работает в 3 раза быстрее (40 статей в секунду).  

> NewsRuBERT = RuBERT + 12ГБ новостей + техники из RoBERTa + 50K-словарь.  
> Slovnet BERT NER (аналог DeepPavlov BERT NER) = NewsRuBERT + CRF-голова + Collection5.  

  
Сейчас, для обучения моделей с BERT-like архитектурой, принято использовать [Transformers](https://huggingface.co/transformers/) от Hugging Face. Transformers — это 100 000 строк кода на Python. Когда взорвётся loss или на инференсе мусор, тяжело разобраться, что пошло не так. Ладно, там много кода дублируется. Пускай мы тренируем RoBERTa, довольно быстро локализуем проблему до ~3000 строк кода, но это тоже немало. С современным PyTorch, библиотека Transformers не так актуальна. С `[torch.nn.TransformerEncoderLayer](https://pytorch.org/docs/stable/nn.html#transformer-layers)` код RoBERTa-like модели занимает 100 строк:  
  

```
class BERTEmbedding(nn.Module):
    def __init__(self, vocab_size, seq_len, emb_dim, dropout=0.1, norm_eps=1e-12):
        super(BERTEmbedding, self).__init__()
        self.word = nn.Embedding(vocab_size, emb_dim)
        self.position = nn.Embedding(seq_len, emb_dim)
        self.norm = nn.LayerNorm(emb_dim, eps=norm_eps)
        self.drop = nn.Dropout(dropout)

    def forward(self, input):
        batch_size, seq_len = input.shape
        position = torch.arange(seq_len).expand_as(input).to(input.device)

        emb = self.word(input) + self.position(position)
        emb = self.norm(emb)
        return self.drop(emb)
      

def BERTLayer(emb_dim, heads_num, hidden_dim, dropout=0.1, norm_eps=1e-12):
    layer = nn.TransformerEncoderLayer(
        d_model=emb_dim,
        nhead=heads_num,
        dim_feedforward=hidden_dim,
        dropout=dropout,
        activation='gelu'
    )
    layer.norm1.eps = norm_eps
    layer.norm2.eps = norm_eps
    return layer


class BERTEncoder(nn.Module):
    def __init__(self, layers_num, emb_dim, heads_num, hidden_dim,
                 dropout=0.1, norm_eps=1e-12):
        super(BERTEncoder, self).__init__()
        self.layers = nn.ModuleList([
            BERTLayer(
                emb_dim, heads_num, hidden_dim,
                dropout, norm_eps
            )
            for _ in range(layers_num)
        ])

    def forward(self, input, pad_mask=None):
        input = input.transpose(0, 1)  # torch expects seq x batch x emb
        for layer in self.layers:
            input = layer(input, src_key_padding_mask=pad_mask)
        return input.transpose(0, 1)  # restore
          
          
class BERTMLMHead(nn.Module):
    def __init__(self, emb_dim, vocab_size, norm_eps=1e-12):
        super(BERTMLMHead, self).__init__()
        self.linear1 = nn.Linear(emb_dim, emb_dim)
        self.norm = nn.LayerNorm(emb_dim, eps=norm_eps)
        self.linear2 = nn.Linear(emb_dim, vocab_size)

    def forward(self, input):
        x = self.linear1(input)
        x = F.gelu(x)
        x = self.norm(x)
        return self.linear2(x)


class BERTMLM(nn.Module):
    def __init__(self, emb, encoder, head):
        super(BERTMLM, self).__init__()
        self.emb = emb
        self.encoder = encoder
        self.head = head

    def forward(self, input):
        x = self.emb(input)
        x = self.encoder(x)
        return self.head(x)
```

  
Это не прототип, код скопирован из [репозитория Slovnet](https://github.com/natasha/slovnet/blob/master/slovnet/model/bert.py). Transformers полезно читать, они делают большую работу, набивают код для статей с Arxiv, часто исходники на Python понятнее, чем объяснение в научной статье.  
  

### Синтетический датасет

  
Разметим 700 000 статей из [корпуса Lenta.ru](https://github.com/natasha/corus#load_lenta) тяжёлой моделью. Получим огромный синтетический обучающий датасет. Архив доступен в репозитории [Nerus](https://github.com/natasha/nerus) проекта Natasha. Разметка очень качественная, оценки F1 по токенам: PER — 99.7%, LOC — 98.6%, ORG — 97.2%. Редкие примеры ошибок:  
  

```
Выборы Верховного совета Аджарской автономной республики
       ORG────────────── LOC────────────────────────────
назначены в соответствии с 241-ой статьей и 4-м пунктом 10-й
статьи Конституционного закона Грузии <О статусе Аджарской
                               LOC───            LOC──────
автономной республики>.
───────────~~~~~~~~~~~

Следственное управление при прокуратуре требует наказать
ORG────────────────────~~~~~~~~~~~~~~~~
премьера Якутии.
LOC───

Начальник полигона <Игумново> в Нижегородской области осужден
                    ~~~~~~~~    LOC──────────────────
за загрязнение атмосферы и грунтовых вод.

Страны Азии и Африки поддержали позицию России в конфликте с
       ~~~~   ~~~~~~                    LOC───
Грузией.
LOC────

У Владимира Стржалковского появится помощник - специалист по
  PER─────────────────────
проведению сделок M&A.
                  ~~~

Постоянный Секретариат ОССНАА в Каире в пятницу заявил: Когда
           ~~~~~~~~~~~~ORG───   LOC──
Саакашвили стал президентом Грузии, он проявил стремление
PER───────                  LOC───
вступить в НАТО, Европейский Союз и установить более близкие
           ORG─  LOC─────────────
отношения с США.
            LOC
```

  

### Модель-ученик

  
С выбором архитектуры тяжёлой модели-учителя проблем не возникло, вариант один — трансформеры. С компактной моделью-учеником сложнее, вариантов много. С 2013 до 2018 год с появления word2vec до статьи про BERT, человечество придумало кучу нейросетевых архитектур для решения задачи NER. У всех общая схема:  
  
![](https://habrastorage.org/r/w1560/webt/uu/gm/_u/uugm_uuuruwcdrs8ycekgfpwufm.png)  
_Схема нейросетевых архитектур для задачи NER: энкодер токенов, энкодер контекста, декодер тегов. Расшифровка сокращений в [обзорной статье Yang (2018)](https://arxiv.org/pdf/1806.05626.pdf)._  
  
Комбинаций архитектур много. Какую выбрать? Например, (CharCNN + Embedding)-WordBiLSTM-CRF — схема модели из [статьи про DeepPavlov NER](https://arxiv.org/pdf/1709.09686.pdf), SOTA для русского языка до 2019 года.  
  
Варианты с CharCNN, CharRNN пропускаем, запускать маленькую нейронную сеть по символам на каждом токене — не наш путь, слишком медленно. WordRNN тоже хотелось бы избежать, решение должно работать на CPU, перемножать матрицы на каждом токене медленно. Для NER выбор между Linear и CRF условный. Мы используем BIO-кодировку, порядок тегов важен. Приходится терпеть жуткие тормоза, использовать CRF. Остаётся один вариант — Embedding-WordCNN-CRF. Такая модель не учитывает регистр токенов, для NER это важно, «надежда» — просто слово, «Надежда» — возможно, имя. Добавим ShapeEmbedding — эмбеддинг с очертаниями токенов, например: «NER» — EN_XX, «Вайнович» — RU_Xx, "!" — PUNCT_!, «и» — RU_x, «5.1» — NUM, «Нью-Йорк» — RU_Xx-Xx. Схема Slovnet NER — (WordEmbedding + ShapeEmbedding)-WordCNN-CRF.  
  

### Дистилляция

  
Обучим Slovnet NER на огромном синтетическом датасете. Сравним результат с тяжёлой моделью-учителем Slovnet BERT NER. Качество считаем и усредняем по размеченным вручную Collection5, Gareev, factRuEval-2016, BSNLP-2019. Размер обучающей выборки очень важен: на 250 новостных статьях (размер factRuEval-2016) средний по PER, LOC, LOG F1 — 0.64, на 1000 (аналог Collection5) — 0.81, на всём датасете — 0.91, качество Slovnet BERT NER — 0.92.  
  
![](https://habrastorage.org/r/w1560/webt/er/mf/p_/ermfp_dwuzfmo94zoe3wjdyg-ce.png)  
_Качество Slovnet NER, зависимость от числа синтетических обучающих примеров. Серая линия — качество Slovnet BERT NER. Slovnet NER не видит размеченных вручную примеров, обучается только на синтетических данных._  
  
Примитивная модель-ученик на 1 процентный пункт хуже тяжёлой модели-учителя. Это замечательный результат. Напрашивается универсальный рецепт:  

> Вручную размечаем немного данных. Обучаем тяжёлый трансформер. Генерируем много синтетических данных. Обучаем простую модель на большой выборке. Получаем качество трансформера, размер и производительность простой модели.  

  
В библиотеке Slovnet есть ещё две модели обученные по этому рецепту: [Slovnet Morph](https://github.com/natasha/slovnet#morphology) — морфологический теггер, [Slovnet Syntax](https://github.com/natasha/slovnet#syntax) — синтаксический парсер. Slovnet Morph отстаёт от тяжёлой модели-учителя [на 2 процентных пункта](https://github.com/natasha/slovnet#morphology-1), Slovnet Syntax — [на 5](https://github.com/natasha/slovnet#syntax-1). У обеих моделей качество и производительность выше существующих решений для русского на новостных статьях.  
  

### Квантизация

  
Размер Slovnet NER — 289МБ. 287МБ занимает таблица с эмбеддингами. Модель использует большой словарь на 250 000 строк, он покрывает 98% слов в новостных текстах. Используем [квантизацию](http://mccormickml.com/2017/10/13/product-quantizer-tutorial-part-1/), заменим 300-мерные float-вектора на 100-мерные 8-битные. Размер модели уменьшится в 10 раз (27МБ), качество не изменится. [Библиотека Navec](https://github.com/natasha/navec) — часть проекта Natasha, коллекция квантованных предобученных эмбеддингов. [Веса обученные на художественной литературе](https://github.com/natasha/navec#hudlit) занимают 50МБ, обходят по [синтетическим оценкам](https://github.com/natasha/navec/#evaluation) все [статические модели RusVectores](https://rusvectores.org/ru/models/).  
  

### Инференс

  
Slovnet NER использует PyTorch для обучения. Пакет PyTorch весит 700МБ, не хочется тянуть его в продакшн для инференса. Ещё PyTorch [не работает с интерпретатором PyPy](https://github.com/pytorch/pytorch/issues/17835). Slovnet используется в связке с [Yargy-парсером](https://github.com/natasha/yargy) аналогом [яндексового Tomita-парсера](https://yandex.ru/dev/tomita/). С PyPy Yargy работает в 2-10 раз быстрее, зависит от сложности грамматик. Не хочется терять скорость из-за зависимости от PyTorch.  
  
Стандартное решение — использовать [TorchScript](https://pytorch.org/docs/stable/jit.html) или [сконвертировать модель в ONNX](https://pytorch.org/docs/stable/onnx.html), инференс делать в [ONNXRuntime](https://github.com/microsoft/onnxruntime). Slovnet NER использует нестандартные блоки: квантованные эмбеддинги, CRF-декодер. TorchScript и ONNXRuntime не поддерживают PyPy.  
  
Slovnet NER — простая модель, [вручную реализуем все блоки на NumPy](https://github.com/natasha/slovnet/blob/master/slovnet/exec/model.py), используем веса, посчитанные PyTorch. Применим немного NumPy-магии, аккуратно реализуем [блок CNN](https://github.com/natasha/slovnet/blob/master/slovnet/exec/model.py#L82-L112), [CRF-декодер](https://github.com/natasha/slovnet/blob/master/slovnet/exec/model.py#L154-L184), распаковка квантованного эмбеддинга [занимает 5 строк](https://github.com/natasha/slovnet/blob/master/slovnet/exec/model.py#L229-L234). Скорость инференса на CPU такая же как с ONNXRuntime и PyTorch, 25 новостных статей в секунду на Core i5.  
  
Техника работает на более сложных моделях: Slovnet Morph и Slovnet Syntax тоже реализованы на NumPy. Slovnet NER, Morph и Syntax используют общую таблицу эмбеддингов. Вынесем веса в отдельный файл, таблица не дублируется в памяти и на диске:  
  

```
>>> navec = Navec.load('navec_news_v1_1B.tar')  # 25MB
>>> morph = Morph.load('slovnet_morph_news_v1.tar')  # 2MB
>>> syntax = Syntax.load('slovnet_syntax_news_v1.tar')  # 3MB
>>> ner = NER.load('slovnet_ner_news_v1.tar')  # 2MB

# 25 + 2 + 3 + 2 вместо 25+2 + 25+3 + 25+2
>>> morph.navec(navec)
>>> syntax.navec(navec)
>>> ner.navec(navec)
```

  

### Ограничения

  
Natasha извлекает стандартные сущности: имена, названия топонимов и организаций. Решение показывает хорошее качество на новостях. Как работать с другими сущностями и типами текстов? Нужно обучить новую модель. Сделать это непросто. За компактный размер и скорость работы мы платим сложностью подготовки модели. [Скрипт-ноутбук для подготовки тяжёлой модели учителя](https://github.com/natasha/slovnet/blob/master/scripts/02_bert_ner/main.ipynb), [скрипт-ноутбук для модели-ученика](https://github.com/natasha/slovnet/blob/master/scripts/05_ner/main.ipynb), [инструкции по подготовке квантованных эмбеддингов](https://github.com/natasha/navec#development).  
  

## Navec — компактные эмбеддинги для русского языка

  
![](https://habrastorage.org/r/w1560/webt/to/gc/c8/togcc85ufq3b9rmshkwxvmqdnqo.png)  
  
С компактными моделями удобно работать. Они быстро запускаются, используют мало памяти, на один инстанст помещается больше параллельных процессов.  
  
В NLP 80-90% весов модели приходится на таблицу с эмбеддингами. [Библиотека Navec](https://github.com/natasha/navec) — часть проекта Natasha, коллекция предобученных эмбеддингов для русского языка. По intrinsic-метрикам качества они чуть-чуть не дотягивают по топовых решений [RusVectores](https://rusvectores.org/), зато размер архива с весами в 5-6 раз меньше (51МБ), словарь в 2-3 раза больше (500К слов).  

Качество*

Размер модели, МБ

Размер словаря, ×103

Navec

0.719

50.6

500

RusVectores

0.638–0.726

220.6–290.7

189–249

_* Качество на задаче определения семантической близости. Усреднённая оценка по шести датасетам: [SimLex965](https://github.com/natasha/corus#load_simlex), [LRWC](https://github.com/natasha/corus#load_toloka_lrwc), [HJ](https://github.com/natasha/corus#load_russe_hj), [RT](https://github.com/natasha/corus#load_russe_rt), [AE](https://github.com/natasha/corus#load_russe_ae), [AE2](https://github.com/natasha/corus#load_russe_ae)_  
  
Речь пойдёт про [старые добрые пословные эмбеддинги](https://lena-voita.github.io/nlp_course/word_embeddings.html), совершившие революцию в NLP в 2013 году. Технология актуальна до сих пор. В проекте Natasha модели для [разбора морфологии](https://github.com/natasha/slovnet#morphology), [синтаксиса](https://github.com/natasha/slovnet#syntax) и [извлечения именованных сущностей](https://github.com/natasha/slovnet#ner) работают на пословных Navec-эмбеддингах, [показывают качество выше других открытых решений](https://github.com/natasha/slovnet#evaluation).  
  

### RusVectores

  
Для русского языка принято использовать [предобученные эмбеддинги от RusVectores](https://rusvectores.org/ru/models/), у них есть неприятная особенность: в таблице записаны не слова, а пары «слово_POS-тег». Идея хорошая, для пары «печь_VERB» ожидаем вектор, похожий на «готовить_VERB», «варить_VERB», а для «печь_NOUN» — «изба_NOUN», «топка_NOUN».  
  
На практике использовать такие эмбеддинги неудобно. Недостаточно разделить текст на токены, для каждого нужно как-то определить POS-тег. Таблица эмбеддингов разбухает. Вместо одного слова «стать», мы храним 6: 2 разумных «стать_VERB», «стать_NOUN» и 4 странных «стать_ADV», «стать_PROPN», «стать_NUM», «стать_ADJ». В таблице на 250 000 записей 195 000 уникальных слов.  
  

### Качество

  
Оценим качество эмбеддингов на задаче семантической близости. Возьмём пару слов, для каждого найдём вектор-эмбеддинг, посчитаем косинусное сходство. Navec для похожих слов «чашка» и «кувшин» возвращет 0.49, для «фрукт» и «печь» — −0.0047. Соберём много пар с эталонными метками похожести, посчитаем корреляцию Спирмена с нашими ответами.  
  
Авторы RusVectores используют небольшой [аккуратно проверенный и исправленный](https://arxiv.org/abs/1801.06407) тестовый список пар [SimLex965](https://github.com/natasha/corus#load_simlex). Добавим свежий яндексовый [LRWC](https://github.com/natasha/corus#load_toloka_lrwc) и датасеты из [проекта RUSSE](https://russe.nlpub.org/downloads/): [HJ](https://github.com/natasha/corus#load_russe_hj), [RT](https://github.com/natasha/corus#load_russe_rt), [AE](https://github.com/natasha/corus#load_russe_ae), [AE2](https://github.com/natasha/corus#load_russe_ae):  

Среднее качество на 6 датасетах

Время загрузки, секунды

Размер модели, МБ

Размер словаря, ×103

Navec

`hudlit_12B_500K_300d_100q`

**0.719**

**1.0**

**50.6**

**500**

`news_1B_250K_300d_100q`

0.653

**0.5**

**25.4**

**250**

RusVectores

`ruscorpora_upos_cbow_300_20_2019`

**0.692**

**3.3**

**220.6**

189

`ruwikiruscorpora_upos_skipgram_300_2_2019`

0.691

5.0

290.0

248

`tayga_upos_skipgram_300_2_2019`

**0.726**

5.2

290.7

**249**

`tayga_none_fasttextcbow_300_10_2019`

0.638

8.0

2741.9

192

`araneum_none_fasttextcbow_300_5_2018`

0.664

16.4

2752.1

195

_[Таблица с разбивкой по датасетам](https://github.com/natasha/navec#evaluation) в репозитории Navec._  
  
Качество `hudlit_12B_500K_300d_100q` сравнимо или лучше, чем у решений RusVectores, словарь больше в 2–3 раза, размер модели меньше в 5–6 раз. Как удалось получить такое качество и размер?  
  

### Принцип работы

  
`hudlit_12B_500K_300d_100q` — [GloVe-эмбеддинги](https://nlp.stanford.edu/projects/glove/) обученные на [145ГБ художественной литературы](https://github.com/natasha/corus#load_librusec). Архив с текстами возьмём из [проекта RUSSE](https://russe.nlpub.org/downloads/). Используем [оригинальную реализацию GloVe на C](https://github.com/stanfordnlp/GloVe), обернём её в [удобный Python-интерфейс](https://github.com/natasha/navec/blob/master/navec/train/glove.py).  
  
Почему не word2vec? Эксперименты на большом датасете быстрее с GloVe. Один раз считаем матрицу коллокаций, по ней готовим эмбеддинги разных размерностей, выбираем оптимальный вариант.  
  
Почему не fastText? В проекте Natasha мы работаем с текстами новостей. В них мало опечаток, проблему OOV-токенов решает большой словарь. 250 000 строк в таблице `news_1B_250K_300d_100q` покрывают 98% слов в новостных статьях.  
  
Размер словаря `hudlit_12B_500K_300d_100q` — 500 000 записей, он покрывает 98% слов в художественных текстах. Оптимальная размерность векторов — 300. Таблица 500 000 × 300 из float-чисел занимает 578МБ, размер архива с весами `hudlit_12B_500K_300d_100q` в 12 раз меньше (48МБ). Дело в квантизации.  
  

### Квантизация

  
Заменим 32-битные float-числа на 8-битные коды: [−∞, −0.86) — код 0, [−0.86, -0.79) — код 1, [-0.79, -0.74) — 2, …, [0.86, ∞) — 255. Размер таблицы уменьшится в 4 раз (143МБ).  
  

```
Было:
-0.220 -0.071  0.320 -0.279  0.376  0.409  0.340 -0.329  0.400
 0.046  0.870 -0.163  0.075  0.198 -0.357 -0.279  0.267  0.239
 0.111  0.057  0.746 -0.240 -0.254  0.504  0.202  0.212  0.570
 0.529  0.088  0.444 -0.005 -0.003 -0.350 -0.001  0.472  0.635
                     ────── ──────
-0.170  0.677  0.212  0.202 -0.030  0.279  0.229 -0.475 -0.031
                            ──────                      ──────
Стало:
    63    105    215     49    225    230    219     39    228
   143    255     78    152    187     34     49    204    198
   163    146    253     58     55    240    188    191    246
   243    155    234    127    127     35    128    237    249
                        ───    ───
    76    251    191    188    118    207    195     18    118
                               ───                         ───
```

  
_Данные огрубляются, разные значения -0.005 и -0.003 заменяет один код 127, -0.030 и -0.031 — 118_  
  
Заменим кодом не одно, а 3 числа. Кластеризуем все тройки чисел из таблицы эмбеддингов [алгоритмом k-means](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4_k-%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D1%85) на 256 кластеров, вместо каждой тройки будем хранить код от 0 до 255. Таблица уменьшится ещё в 3 раза (48МБ). Navec использует [библиотеку PQk-means](http://yusukematsui.me/project/pqkmeans/pqkmeans.html), она разбивает матрицу на 100 колонок, каждую кластеризует отдельно, качество на синтетических тестах падёт на 1 процентный пункт. Понятно про квантизацию в статье [Product Quantizers for k-NN](http://mccormickml.com/2017/10/13/product-quantizer-tutorial-part-1/).  
  
Квантованные эмбеддинги проигрывают обычным по скорости. Сжатый вектор перед использованием нужно распаковать. Аккуратно реализуем процедуру, [применим Numpy-магию](https://github.com/natasha/navec/blob/master/navec/pq.py#L40-L43), в PyTorch [используем torch.gather](https://github.com/natasha/slovnet/blob/master/slovnet/model/emb.py#L29-L39). В Slovnet NER доступ к таблице эмбеддингов занимает 0.1% от общего времени вычислений.  
  
Модуль `NavecEmbedding` из [библиотеки Slovnet](https://github.com/natasha/slovnet) интегрирует Navec в PyTorch-модели:  
  

```
>>> import torch

>>> from navec import Navec
>>> from slovnet.model.emb import NavecEmbedding

>>> path = 'hudlit_12B_500K_300d_100q.tar'  # 51MB
>>> navec = Navec.load(path)  # ~1 sec, ~100MB RAM

>>> words = ['навек', '<unk>', '<pad>']
>>> ids = [navec.vocab[_] for _ in words]

>>> emb = NavecEmbedding(navec)
>>> input = torch.tensor(ids)

>>> emb(input)  # 3 x 300
tensor([[ 4.2000e-01,  3.6666e-01,  1.7728e-01,
        [ 1.6954e-01, -4.6063e-01,  5.4519e-01,
        [ 0.0000e+00,  0.0000e+00,  0.0000e+00,
	  ...
```

  
  

## Nerus — большой синтетический датасет с разметкой морфологии, синтаксиса и именованных сущностей

  
![](https://habrastorage.org/r/w1560/webt/qz/q7/ma/qzq7mafha7lfwywqjrtllntksko.png)  
  
В проекте Natasha анализ морфологии, синтаксиса и извлечение именованных сущностей делают 3 компактные модели: [Slovnet NER](https://github.com/natasha/slovnet#ner), [Slovnet Morph](https://github.com/natasha/slovnet#morphology) и [Slovnet Syntax](https://github.com/natasha/slovnet#syntax). [Качество решений](https://github.com/natasha/slovnet#evaluation) на 1–5 процентных пунктов хуже, чем у тяжёлых аналогов c BERT-архитектурой, размер в 50-75 раз меньше, скорость на CPU в 2 раза больше. Модели обучены на огромном синтетическом [датасете Nerus](https://github.com/natasha/nerus), в архиве 700 000 новостных статей с [CoNLL-U](https://universaldependencies.org/format.html)-разметкой морфологии, синтаксиса и именованных сущностей:  
  

```
# newdoc id = 0
# sent_id = 0_0
# text = Вице-премьер по социальным вопросам Татьяна Голикова рассказала, в каких регионах России зафиксирована ...
1    Вице-премьер   _   NOUN   _   Animacy=Anim|C...   7   nsubj     _   Tag=O
2    по             _   ADP    _   _                     4   case      _   Tag=O
3    социальным     _   ADJ    _   Case=Dat|Degre...   4   amod      _   Tag=O
4    вопросам       _   NOUN   _   Animacy=Inan|C...   1   nmod      _   Tag=O
5    Татьяна        _   PROPN  _   Animacy=Anim|C...   1   appos     _   Tag=B-PER
6    Голикова       _   PROPN  _   Animacy=Anim|C...   5   flat:name _   Tag=I-PER
7    рассказала     _   VERB   _   Aspect=Perf|Ge...   0   root      _   Tag=O
8    ,              _   PUNCT  _   _                   13  punct     _   Tag=O
9    в              _   ADP    _   _                   11  case      _   Tag=O
10   каких          _   DET    _   Case=Loc|Numbe...   11  det       _   Tag=O
11   регионах       _   NOUN   _   Animacy=Inan|C...   13  obl       _   Tag=O
12   России         _   PROPN  _   Animacy=Inan|C...   11  nmod      _   Tag=B-LOC
13   зафиксирована  _   VERB   _   Aspect=Perf|Ge...   7   ccomp     _   Tag=O
14   наиболее       _   ADV    _   Degree=Pos          15  advmod    _   Tag=O
15   высокая        _   ADJ    _   Case=Nom|Degre...   16  amod      _   Tag=O
16   смертность     _   NOUN   _   Animacy=Inan|C...   13  nsubj     _   Tag=O
17   от             _   ADP    _   _                   18  case      _   Tag=O
18   рака           _   NOUN   _   Animacy=Inan|C...   16  nmod      _   Tag=O
19   ,              _   PUNCT  _   _                   20  punct     _   Tag=O
20   сообщает       _   VERB   _   Aspect=Imp|Moo...   0   root      _   Tag=O
21   РИА            _   PROPN  _   Animacy=Inan|C...   20  nsubj     _   Tag=B-ORG
22   Новости        _   PROPN  _   Animacy=Inan|C...   21  appos     _   Tag=I-ORG
23   .              _   PUNCT  _   _                   20  punct     _   Tag=O

# sent_id = 0_1
# text = По словам Голиковой, чаще всего онкологические заболевания становились причиной смерти в Псковской, Тверской, ...
1   По              _   ADP    _   _                   2   case      _   Tag=O
2   словам          _   NOUN   _   Animacy=Inan|C...   9   parataxis _   Tag=O
...
```

  
Slovnet NER, Morph, Syntax — примитивные модели. Когда в обучающей выборке 1000 примеров, Slovnet NER отстаёт от тяжёлого BERT-аналога на 11 процентных пунктов, когда примеров 10 000 — на 3 пункта, когда 500 000 — на 1.  
  
Nerus — результат работы, тяжёлых моделей с BERT-архитектурой: [Slovnet BERT NER](https://github.com/natasha/slovnet/blob/master/scripts/02_bert_ner/main.ipynb), [Slovnet BERT Morph](https://github.com/natasha/slovnet/blob/master/scripts/03_bert_morph/main.ipynb), [Slovnet BERT Syntax](https://github.com/natasha/slovnet/blob/master/scripts/04_bert_syntax/main.ipynb). Обработка 700 000 новостных статей занимает 20 часов на Tesla V100. Мы экономим время других исследователей, выкладываем готовый архив в открытый доступ. В [SpaCy-Ru](https://github.com/buriy/spacy-ru) обучают на Nerus качественные русскоязычные модели для SpaCy, готовят патч в официальный репозиторий.  
  
[![](https://habrastorage.org/r/w1560/webt/7_/g-/2h/7_g-2hzeucgt0wvyrpmapcsy9o4.png)](https://storage.yandexcloud.net/natasha-nerus/data/nerus_lenta.conllu.gz)  
  
У синтетической разметки высокое качество: точность определения морфологических тегов — 98%, синтаксических связей — 96%. Для NER оценки F1 по токенам: PER — 99%, LOC — 98%, ORG — 97%. Для оценки качества мы размечаем [SynTagRus](https://github.com/natasha/corus#load_ud_syntag), [Collection5](https://github.com/natasha/corus#load_ne5) и новостной срез [GramEval2020](https://github.com/natasha/corus#load_gramru), сравниваем эталонную разметку с нашей, подробнее в [репозитории Nerus](https://github.com/natasha/nerus#evaluation). Из-за ошибок в разметке синтаксиса встречаются циклы и множественные корни, POS-теги иногда не соответствуют синтаксическим рёбрам. Полезно использовать [валидатор от Universal Dependencies](https://github.com/UniversalDependencies/tools/blob/master/validate.py), пропускать такие примеры.  
  
Python-пакет Nerus организует удобный интерфейс для загрузки и визуализации разметки:  
  

```
>>> from nerus import load_nerus

>>> docs = load_nerus('nerus_lenta.conllu.gz')
>>> doc = next(docs)
>>> doc

NerusDoc(
    id='0',
    sents=[NerusSent(
         id='0_0',
         text='Вице-премьер по социальным вопросам Татьяна Голикова рассказала, в каких регионах России ...',
         tokens=[NerusToken(
              id='1',
              text='Вице-премьер',
              pos='NOUN',
              feats={'Animacy': 'Anim',
               'Case': 'Nom',
               'Gender': 'Masc',
               'Number': 'Sing'},
              head_id='7',
              rel='nsubj',
              tag='O'
          ),
          NerusToken(
              id='2',
              text='по',
              pos='ADP',
...

>>> doc.ner.print()
Вице-премьер по социальным вопросам Татьяна Голикова рассказала, в каких регионах России зафиксирована наиболее 
                                    PER─────────────                              LOC───                     
высокая смертность от  рака, сообщает РИА Новости. По словам Голиковой, чаще всего онкологические заболевания
                                      ORG────────            PER──────             
...

​
>>> sent = doc.sents[0]
>>> sent.morph.print()
        Вице-премьер  NOUN|Animacy=Anim|Case=Nom|Gender=Masc|Number=Sing
                  по  ADP
          социальным  ADJ|Case=Dat|Degree=Pos|Number=Plur
            вопросам  NOUN|Animacy=Inan|Case=Dat|Gender=Masc|Number=Plur
             Татьяна  PROPN|Animacy=Anim|Case=Nom|Gender=Fem|Number=Sing
            Голикова  PROPN|Animacy=Anim|Case=Nom|Gender=Fem|Number=Sing
          рассказала  VERB|Aspect=Perf|Gender=Fem|Mood=Ind|Number=Sing
...
				   
>>> sent.syntax.print()
  ┌►┌─┌───── Вице-премьер  nsubj
  │ │ │ ┌──► по            case
  │ │ │ │ ┌► социальным    amod
  │ │ └►└─└─ вопросам      nmod
  │ └────►┌─ Татьяна       appos
  │       └► Голикова      flat:name
┌─└───────── рассказала    
│   ┌──────► ,             punct
│   │   ┌──► в             case
│   │   │ ┌► каких         det
│   │ ┌►└─└─ регионах      obl
│   │ │ └──► России        nmod
└──►└─└───── зафиксирована ccomp
    │     ┌► наиболее      advmod
    │   ┌►└─ высокая       amod
    └►┌─└─── смертность    nsubj:pass
      │   ┌► от            case
      └──►└─ рака          nmod
          ┌► ,             punct
      ┌─┌─└─ сообщает      
      │ └►┌─ РИА           nsubj
      │   └► Новости       appos
      └────► .             punct
```

  
[Инструкция по установке, примеры использования](https://github.com/natasha/nerus#usage), [оценки качества](https://github.com/natasha/nerus#evaluation) в репозитории Nerus.  
  

## Corus — коллекция ссылок на публичные русскоязычные датасеты + функции для загрузки

  
![](https://habrastorage.org/r/w1560/webt/1q/m2/qg/1qm2qgkuf6krpvpcobq5zkwtba8.png)  
[Библиотека Corus](https://github.com/natasha/corus) — часть проекта Natasha, коллекция ссылок на публичные русскоязычные NLP-датасеты + Python-пакет с функциями-загрузчиками. [Список ссылок на источники](https://github.com/natasha/corus#reference), [инструкция по установке](https://github.com/natasha/corus#install) и [примеры использования](https://nbviewer.jupyter.org/github/natasha/corus/blob/master/docs.ipynb) в репозитории Corus.  
  

```
>>> from corus import load_lenta

# Находим в реестре Corus ссылку на Lenta.ru, загружаем:
# wget https://github.com/yutkin/Lenta.Ru-News-Dataset/...

>>> path = 'lenta-ru-news.csv.gz'
>>> records = load_lenta(path)  # 2ГБ, 750 000 статей
>>> next(records)
LentaRecord(
    url='https://lenta.ru/news/2018/12/14/cancer/',
    title='Названы регионы России с\xa0самой высокой ...',
    text='Вице-премьер по социальным вопросам Татьяна ...',
    topic='Россия',
    tags='Общество'
)
```

  
Полезные открытые датасеты для русского языка так хорошо спрятаны, что мало людей про них знает.  
  

### Примеры

  

#### Корпус новостных статей

  
Хотим обучить языковую модель на новостных статьях, нужно много текстов. Первым приходит в голову новостной срез [датасета Taiga](https://tatianashavrina.github.io/taiga_site/) (~1ГБ). Многие знают про [дамп Lenta.ru](https://github.com/yutkin/Lenta.Ru-News-Dataset) (2ГБ). Остальные источники найти сложнее. В 2019 году на Диалоге проходил [конкурс про генерацию заголовков](https://vk.com/headline_gen), организаторы подготовили [дамп РИА Новостей](https://github.com/RossiyaSegodnya/ria_news_dataset) за 4 года (3.7ГБ). В 2018 году Юрий Бабуров опубликовал [выгрузку с 40 русскоязычных новостных ресурсов](https://github.com/buriy/russian-nlp-datasets/releases/tag/r4) (7.5ГБ). Волонтёры из [ODS](http://ods.ai/) [делятся архивами](https://github.com/ods-ai-ml4sg/proj_news_viz/releases/tag/data) (7ГБ), собранными для [проекта про анализ новостной повестки](https://proj-news-viz-flask.herokuapp.com/).  
  
В [реестре Corus](https://github.com/natasha/corus#reference) ссылки на эти датасеты помечены тегом «news», для всех источников есть функции-загрузчики: [`load_taiga_*`](https://github.com/natasha/corus#load_taiga_arzamas), [`load_lenta`](https://github.com/natasha/corus#load_lenta), [`load_ria`](https://github.com/natasha/corus#load_ria), [`load_buriy_*`](https://github.com/natasha/corus#load_buriy_lenta), [`load_ods_*`](https://github.com/natasha/corus#load_ods_interfax).  
  

#### NER

  
Хотим обучить NER для русского языка, нужны аннотированные тексты. Первым делом вспоминаем про [данные конкурса factRuEval-2016](https://github.com/dialogue-evaluation/factRuEval-2016/). У разметки есть недостатки: свой сложный формат, спаны сущностей пересекаются, есть неоднозначная категориям «LocOrg». Не все знают про [коллекцию Named Entities 5](http://labinform.ru/pub/named_entities/descr_ne.htm) наследницу [Persons-1000](http://ai-center.botik.ru/Airec/index.php/ru/collections/28-persons-1000). Разметка в [стандартном формате](https://brat.nlplab.org/standoff.html), спаны не пересекаются, красота! Остальные три источника известны только самым преданным фанатам русскоязычного NER. Напишем на почту Ринату Гарееву, приложим ссылку на его [статью 2013 года](https://www.researchgate.net/publication/262203599_Introducing_Baselines_for_Russian_Named_Entity_Recognition), в ответ получим 250 новостных статей с помеченными именами и организациями. В 2019 году проводился [конкурс BSNLP-2019](http://bsnlp.cs.helsinki.fi/shared_task.html) про NER для славянских языков, напишем организаторам, получим ещё 450 размеченных текстов. В проекте WiNER [придумали делать полуавтоматическую разметку NER из дампов Wikipedia](https://www.aclweb.org/anthology/I17-1042/), [большая выгрузка для русского доступна на Github](https://github.com/dice-group/FOX/tree/master/input/Wikiner).  
  
Ссылки и функции для загрузки в реестре Corus: [`load_factru`](https://github.com/natasha/corus#load_factru), [`load_ne5`](https://github.com/natasha/corus#load_ne5), [`load_gareev`](https://github.com/natasha/corus#load_gareev), [`load_bsnlp`](https://github.com/natasha/corus#load_bsnlp), [`load_wikiner`](https://github.com/natasha/corus#load_wikiner).  
  

### Коллекция ссылок

  
Перед тем как обзавестить загрузчиком и попасть в реестр, ссылки на источники копятся в [разделе с Тикетами](https://github.com/natasha/corus/issues). В коллекции 30 датасетов: [новая версия Taiga](https://github.com/natasha/corus/issues/30), [568ГБ русского текста из Common Crawl](https://github.com/natasha/corus/issues/26), [отзывы c Banki.ru](https://github.com/natasha/corus/issues/32) и [Auto.ru](https://github.com/natasha/corus/issues/16). Приглашаем делиться находками, заводить тикеты со ссылками.  
  

### Функции-загрузчики

  
Код для простого датасета легко написать самому. [Дамп Lenta.ru](https://github.com/yutkin/Lenta.Ru-News-Dataset) оформлен грамотно, [реализация простая](https://github.com/natasha/corus/blob/master/corus/sources/lenta.py#L28-L30). [Taiga](https://tatianashavrina.github.io/taiga_site/) состоит из ~15 миллионов [CoNLL-U](https://universaldependencies.org/format.html)-файлов, запакованных в zip-архивы. Чтобы загрузка работала быстро, не использовала много памяти и не угробила файловую систему, нужно заморочиться, аккуратно на низком уровне [реализовать работу с zip-файлами](https://github.com/natasha/corus/blob/master/corus/zip.py).  
  
Для 35 источников в Python-пакете Corus есть функции-загрузчики. Интерфейс доступа к Taiga не сложнее, чем к дампу Lenta.ru:  
  

```
>>> from corus import load_taiga_proza_metas, load_taiga_proza

>>> path = 'taiga/proza_ru.zip'
>>> metas = load_taiga_proza_metas(path)
>>> records = load_taiga_proza(path, metas)
>>> next(records)

TaigaRecord(
    id='20151231005',
    meta=Meta(
        id='20151231005',
        timestamp=datetime.datetime(2015, 12, 31, 23, 40),
        genre='Малые формы',
        topic='миниатюры',
        author=Author(
            name='Кальб',
            readers=7973,
            texts=92681,
            url='http://www.proza.ru/avtor/sadshoot'
        ),
        title='С Новым Годом!',
        url='http://www.proza.ru/2015/12/31/1875'
    ),
    text='...Искры улыбок...\n... затмят фейерверки..\n...
)
```

  
Приглашаем пользователей делать пулл-реквесты, присылать свои функции-загрузчики, [короткая инструкция](https://github.com/natasha/corus#development) в репозитории Corus.  
  

## Naeval — количественное сравнение систем для русскоязычного NLP

  
![](https://habrastorage.org/r/w1560/webt/v4/ah/kq/v4ahkqyhsuxsp5m8jjaqoflwq_c.png)  
Natasha — не научный проект, нет цели побить SOTA, но важно проверить качество на публичных бенчмарках, постараться занять высокое место, сильно не проиграв в производительности. Как делают в академии: измеряют качество, получают число, берут таблички из других статей, сравнивают эти числа со своими. У такой схемы две проблемы:  

1.  Забывают про производительность. Не сравнивают размер модели, скорость работы. Упор только на качество.
2.  Не публикуют код. В расчёте метрики качества обычно миллион нюансов. Как именно считали в других статьях? Неизвестно.

  
[Naeval](https://github.com/natasha/naeval) — часть проекта Natasha, набор скриптов для оценки качества и скорости работы открытых инструментов для обработки естественного русского языка:  

Задача

Датасеты

Решения

Токенизация

[SynTagRus](https://github.com/natasha/corus#load_ud_syntag), [OpenCorpora](https://github.com/natasha/corus#load_morphoru_corpora), [GICRYA](https://github.com/natasha/corus#load_morphoru_gicrya), [RNC](https://github.com/natasha/corus#load_morphoru_rnc)  

[SpaCy](https://github.com/natasha/naeval#spacy), [NLTK](https://github.com/natasha/naeval#nltk), [MyStem](https://github.com/natasha/naeval#mystem), [Moses](https://github.com/natasha/naeval#moses), [SegTok](https://github.com/natasha/naeval#segtok), [SpaCy Russian Tokenizer](https://github.com/natasha/naeval#spacy_russian_tokenizer), [RuTokenizer](https://github.com/natasha/naeval#rutokenizer), [Razdel](https://github.com/natasha/naeval#razdel)  

Сегментация предложений

[SynTagRus](https://github.com/natasha/corus#load_ud_syntag), [OpenCorpora](https://github.com/natasha/corus#load_morphoru_corpora), [GICRYA](https://github.com/natasha/corus#load_morphoru_gicrya), [RNC](https://github.com/natasha/corus#load_morphoru_rnc)  

[SegTok](https://github.com/natasha/naeval#segtok), [Moses](https://github.com/natasha/naeval#moses), [NLTK](https://github.com/natasha/naeval#nltk), [RuSentTokenizer](https://github.com/natasha/naeval#rutokenizer), [Razdel](https://github.com/natasha/naeval#razdel)  

Эмбеддинги

[SimLex965](https://github.com/natasha/corus#load_simlex), [HJ](https://github.com/natasha/corus#load_russe_hj), [LRWC](https://github.com/natasha/corus#load_toloka_lrwc), [RT](https://github.com/natasha/corus#load_russe_rt), [AE](https://github.com/natasha/corus#load_russe_ae), [AE2](https://github.com/natasha/corus#load_russe_ae)  

[RusVectores](https://rusvectores.org/ru/models/), [Navec](https://github.com/natasha/navec)  

Анализ морфологии

[GramRuEval2020](https://github.com/natasha/corus#load_gramru) (SynTagRus, GSD, Lenta.ru, Taiga)  

[DeepPavlov Morph](https://github.com/natasha/naeval#deeppavlov_morph), [DeepPavlov BERT Morph](https://github.com/natasha/naeval#deeppavlov_bert_morph), [RuPosTagger](https://github.com/natasha/naeval#rupostagger), [RNNMorph](https://github.com/natasha/naeval#rnnmorph), [Maru](https://github.com/natasha/naeval#maru), [UDPipe](https://github.com/natasha/naeval#udpipe), [SpaCy](https://github.com/natasha/naeval#spacy), [Stanza](https://github.com/natasha/naeval#stanza), [Slovnet Morph](https://github.com/natasha/naeval#slovnet_morph), [Slovnet BERT Morph](https://github.com/natasha/naeval#slovnet_bert_morph)  

Анализ синтаксиса

[GramRuEval2020](https://github.com/natasha/corus#load_gramru) (SynTagRus, GSD, Lenta.ru, Taiga)  

[DeepPavlov BERT Syntax](https://github.com/natasha/naeval#deeppavlov_bert_syntax), [UDPipe](https://github.com/natasha/naeval#udpipe), [SpaCy](https://github.com/natasha/naeval#spacy), [Stanza](https://github.com/natasha/naeval#stanza), [Slovnet Syntax](https://github.com/natasha/naeval#slovnet_syntax), [Slovnet BERT Syntax](https://github.com/natasha/naeval#slovnet_bert_syntax)  

NER

[factRuEval-2016](https://github.com/natasha/corus#load_factru), [Collection5](https://github.com/natasha/corus#load_ne5), [Gareev](https://github.com/natasha/corus#load_gareev), [BSNLP-2019](https://github.com/natasha/corus#load_bsnlp), [WiNER](https://github.com/natasha/corus#load_wikiner)  

[DeepPavlov NER](https://github.com/natasha/naeval#deeppavlov_ner), [DeepPavlov BERT NER](https://github.com/natasha/naeval#deeppavlov_bert_ner), [DeepPavlov Slavic BERT NER](https://github.com/natasha/naeval#deeppavlov_slavic_bert_ner), [PullEnti](https://github.com/natasha/naeval#pullenti), [SpaCy](https://github.com/natasha/naeval#spacy), [Stanza](https://github.com/natasha/naeval#stanza), [Texterra](https://github.com/natasha/naeval#texterra), [Tomita](https://github.com/natasha/naeval#tomita), [MITIE](https://github.com/natasha/naeval#mitie), [Slovnet NER](https://github.com/natasha/naeval#slovnet_ner), [Slovnet BERT NER](https://github.com/natasha/naeval#slovnet_bert_ner)  

_Сетка решений и тестовых датасетов из [репозитория Naeval](https://github.com/natasha/naeval). Инструменты проекта Natasha: [Razdel](https://github.com/natasha/razdel), [Navec](https://github.com/natasha/navec), [Slovnet](https://github.com/natasha/slovnet)._  
  
Дальше подробнее рассмотрим задачу NER.  
  

### Датасеты

  
Для русскоязычного NER существует 5 публичных бенчмарков: [factRuEval-2016](https://github.com/natasha/corus#load_factru), [Collection5](https://github.com/natasha/corus#load_ne5), [Gareev](https://github.com/natasha/corus#load_gareev), [BSNLP-2019](https://github.com/natasha/corus#load_bsnlp), [WiNER](https://github.com/natasha/corus#load_wikiner). Ссылки на источники собраны в [реестре Corus](https://github.com/natasha/corus). Все датасеты состоят из новостных статей, в текстах отмечены подстроки с именами, названиями организаций и топонимов. Что может быть проще?  
  
У всех источников разный формат разметки. Collection5 использует [Standoff-формат](https://brat.nlplab.org/standoff.html) утилиты [Brat](https://brat.nlplab.org/index.html), Gareev и WiNER — разные диалекты [BIO-разметки](https://en.wikipedia.org/wiki/Inside%E2%80%93outside%E2%80%93beginning_(tagging)), у BSNLP-2019 [свой формат](http://bsnlp.cs.helsinki.fi/Guidelines_20190122.pdf), у factRuEval-2016 тоже [своя нетривиальная спецификация](https://github.com/dialogue-evaluation/factRuEval-2016#%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82-%D0%B4%D0%B5%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%BE%D0%B9-%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B8). Naeval приводит все источники к общему формату. Разметка состоит из спанов. Спан — тройка: тип сущности, начало и конец подстроки.  
  
Типы сущностей. factRuEval-2016 и Collection5 отдельно помечают полутопонимы-полуорганизации: «Кремль», «ЕС», «СССР». BSNLP-2019 и WiNER выделяют названия событий: «Чемпионат России», «Брексит». Naeval адаптирует и удаляет часть меток, оставляет эталонные метки PER, LOC, ORG: имена людей, названия топонимов и организаций.  
  
Вложенные спаны. В factRuEval-2016 спаны пересекаются. Naeval упрощает разметку:  

```
Было:
Теперь, как утверждают в Х5 Retail Group, куда входят 
                         org_name───────              
                         Org────────────              
сети магазинов "Пятерочка", "Перекресток" и "Карусель",
org_descr─────  org_name─    org_name───     org_name  
Org──────────────────────                              
org_descr─────                                         
Org─────────────────────────────────────               
org_descr─────                                         
Org──────────────────────────────────────────────────  
о повышении цен сообщили два поставщика рыбы и 
морепродуктов и компания, поставляющая овощи и фрукты.

Стало:
Теперь, как утверждают в Х5 Retail Group, куда входят
                         ORG────────────
сети магазинов "Пятерочка", "Перекресток" и "Карусель",
                ORG──────    ORG────────     ORG─────     

о повышении цен сообщили два поставщика рыбы и
морепродуктов и компания, поставляющая овощи и фрукты.
```

  

### Модели

  
Naeval сравнивает 12 открытых решений задачи NER для русского языка. Все инструменты [завёрнуты в Docker-контейнеры](https://github.com/natasha/naeval/tree/master/docker) с веб-интерфейсом:  
  

```
$ docker run -p 8080:8080 natasha/tomita-algfio
2020-07-02 11:09:19 BIN: 'tomita-linux64', CONFIG: 'algfio'
2020-07-02 11:09:19 Listening http://0.0.0.0:8080	    

$ curl -X POST http://localhost:8080 --data \
  'Глава государства Дмитрий Медведев и Председатель \
  Правительства РФ Владимир Путин выразили глубочайшие \
  соболезнования семье актрисы'

<document url="" di="5" bi="-1" date="2020-07-02">
   <facts>
      <Person pos="18" len="16" sn="0" fw="2" lw="3">
         <Name_Surname val="МЕДВЕДЕВ" />
         <Name_FirstName val="ДМИТРИЙ" />
         <Name_SurnameIsDictionary val="1" />
      </Person>
      <Person pos="67" len="14" sn="0" fw="8" lw="9">
         <Name_Surname val="ПУТИН" />
         <Name_FirstName val="ВЛАДИМИР" />
         <Name_SurnameIsDictionary val="1" />
      </Person>
   </facts>
</document>
```

  
Некоторые решения так тяжело запустить и настроить, что мало людей ими пользуется. [PullEnti](http://pullenti.ru/) — сложная система, построенная на правилах, заняла первой место на конкурсе factRuEval в 2016 году. Инструмент распространяется в виде SDK для C#. Работа над Naeval вылилась в [отдельный проект](http://github.com/pullenti) с набором обёрток для PullEnti: [PullentiServer](https://github.com/pullenti/PullentiServer) — веб-сервер на С#, [pullenti-client](https://github.com/pullenti/pullenti-client) — Python-клиент для PullentiServer:  
  

```
$ docker run -p 8080:8080 pullenti/pullenti-server
2020-07-02 11:42:02 [INFO] Init Pullenti v3.21 ...
2020-07-02 11:42:02 [INFO] Load lang: ru, en
2020-07-02 11:42:03 [INFO] Load analyzer: geo, org, person
2020-07-02 11:42:05 [INFO] Listen prefix: http://*:8080/

>>> from pullenti_client import Client

>>> client = Client('localhost', 8080)
>>> text = 'Глава государства Дмитрий Медведев и ' \
...  'Председатель Правительства РФ Владимир Путин ' \
...  'выразили глубочайшие соболезнования семье актрисы'
>>> result = client(text)
>>> result.graph
```

  
![](https://habrastorage.org/r/w1560/webt/nr/lt/c_/nrltc_h9ecxeodnar5r1wwzgcbc.png)  
Формат разметки у всех инструментов немного отличается. Naeval загружает результаты, адаптирует типы сущностей, упрощает структуру спанов:  
  

```
Было (PullEnti):
Напомним, парламент Южной Осетии на состоявшемся 19 декабря 
          ORGANIZATION──────────                            
                    GEO─────────                            
заседании одобрил представление президента Республики 
                                PERSON────────────────
                                PERSONPROPERTY─────── 
Леонида Тибилова об отставке председателя Верховного суда 
────────────────             PERSON───────────────────────
                             PERSONPROPERTY────────────── 
                                          ORGANIZATION─── 
Ацамаза Биченова.
──────────────── 

Стало:
Напомним, парламент Южной Осетии на состоявшемся 19 декабря 
          ORG────── LOC─────────
заседании одобрил представление президента Республики 
Леонида Тибилова об отставке председателя Верховного суда 
PER─────────────                          ORG────────────
Ацамаза Биченова.
PER─────────────
```

  
_Результат работы PullEnti сложнее адаптировать, чем разметку factRuEval-2016. Алгоритм убирает тег PERSONPROPERTY, разбивает вложенные PERSON, ORGANIZATION и GEO на непересекающиеся PER, LOC, ORG._  
  

### Сравнение

  
Для каждой пары «модель, датасет» Naeval вычисляет [F1-меру по токенам](https://github.com/natasha/naeval/blob/master/naeval/ner/score.py), публикует [таблицу с оценками качества](https://github.com/natasha/naeval#ner).  
  
Natasha — не научный проект, для нас важна практичность решения. Naeval измеряет время старта, скорость работы, размер модели и потребление RAM. [Таблица с результатами в репозитории](https://github.com/natasha/naeval#ner).  
  
Мы подготовили датасеты, завернули 20 систем в Docker-контейнеры и посчитали метрики для 5 других задач русскоязычного NLP, результаты в репозитории Naeval: [токенизация](https://github.com/natasha/naeval#tokenization), [сегментация на предложения](https://github.com/natasha/naeval#sentence-segmentation), [эмбеддинги](https://github.com/natasha/naeval#pretrained-embeddings), [анализ морфологии](https://github.com/natasha/naeval#morphology-taggers) и [синтаксиса](https://github.com/natasha/naeval#syntax-parser).  
  

## Yargy-парсер — извлечение структурированное информации из текстов на русском языке с помощью грамматик и словарей

  
![](https://habrastorage.org/r/w1560/webt/d_/xt/dp/d_xtdp-kcw4iayyjkro-kdv7sli.png)  
  
[Yargy-парсер](https://github.com/natasha/yargy) — аналог яндексового [Томита-парсера](https://tech.yandex.ru/tomita/) для Python. [Инструкция по установке](https://github.com/natasha/yargy#install), [пример использования](https://github.com/natasha/yargy#usage), [документация](https://github.com/natasha/yargy#documentation) в репозитории Yargy. Правила для извлечения сущностей описываются с помощью [контекстно-свободных грамматик](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%BD%D0%BE-%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0) и словарей. Два года назад я писал на Хабр [статью про Yargy и библиотеку Natasha](https://habr.com/ru/post/349864/), рассказывал про решение задачи NER для русского языка. Проект хорошо приняли. Yargy-парсер заменил Томиту в крупных проектах внутри Сбера, Интерфакса и РИА Новостей. Появилось много образовательных материалов. Большое видео с воркшопа в Яндексе, полтора часа про процесс разработки грамматик на примерах:  

  
Обновилась документация, я причесал [вводный раздел](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/index.ipynb) и [справочник](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/ref.ipynb). Главное, появился [Cookbook](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb) — раздел с полезными практиками. Там собраны ответы на самые частые вопросы из [t.me/natural_language_processing](https://t.me/natural_language_processing):  
  

-   [как пропустить часть текста](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%9F%D1%80%D0%BE%D0%BF%D1%83%D1%81%D1%82%D0%B8%D1%82%D1%8C-%D1%87%D0%B0%D1%81%D1%82%D1%8C-%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0);
-   [как подать на вход токены, а не текст](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#IdTokenizer);
-   [что делать, если парсер тормозит](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#CappedParser).

  
Yargy-парсер — сложный инструмент. В Cookbook описаны неочевидные моменты, который всплывают при работе с большими наборами правил:  

-   [порядок аргументов в or_](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%9F%D0%BE%D1%80%D1%8F%D0%B4%D0%BE%D0%BA-%D0%B0%D1%80%D0%B3%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%B2-or_-%D0%B8%D0%BC%D0%B5%D0%B5%D1%82-%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D0%B5);
-   [неоднозначные грамматики](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%9D%D0%B5%D0%BE%D0%B4%D0%BD%D0%BE%D0%B7%D0%BD%D0%B0%D1%8F-%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0);
-   [зачем аргумент tagger в Parser](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D0%BE%D0%B5-%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B8-Yargy).

  
У нас в лабе на Yargy работает несколько крупных сервисов. Перечитал код, собрал в Cookbook паттерны, которые не описаны в паблике:  
  

-   [генерация правил](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB);
-   [наследование fact](https://nbviewer.jupyter.org/github/natasha/yargy/blob/master/docs/cookbook.ipynb#%D0%9D%D0%B0%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-fact) (особенно полезно, ни одно решение на практике без этого приёма не обходится).

  
После прочтения документации полезно посмотреть [репозиторий с примерами](https://github.com/natasha/yargy-examples):  
  

-   [парсинг объявлений с Авито](https://github.com/natasha/yargy-examples/blob/master/02_console/notes.ipynb);
-   [разбор рецептов из ВК](https://github.com/natasha/yargy-examples/blob/master/04_food/notes.ipynb).

  
Ещё в проекте Natasha есть репозиторий [natasha-usage](https://github.com/natasha/natasha-usage). Туда попадает код пользователей Yargy-парсера, опубликованный на Github. 80% ссылок учебные проекты, но есть и содержательные примеры:  
  

-   [разбор фида о работе метро в Спб](https://github.com/xamgore/spbmetro);
-   [парсинг объявлений о сдаче жилья в соцсетях](https://github.com/AlexSkrn/yargy_flats_parser/blob/master/yargy_flats_parser.ipynb);
-   [извлечение атрибутов из названий авто покрышек](https://github.com/rokku3kpvc/yargy-tires/blob/master/tires_parser.py);
-   [парсинг вакансий из канала jobs чата ODS](https://github.com/AndreyKolomiets/ods_jobs_analytics/blob/master/extractors/position_extractor.py);

  
Самые интересные кейсы использования Yargy-парсера, конечно, не публикуют открыто на Github. Напишите в личку, если компания использует Yargy и, если не против, добавим ваше лого на [natasha.github.io](http://natasha.github.io/).  
  

## Ipymarkup — визуализация разметки именованных сущностей и синтаксических связей

  
![](https://habrastorage.org/r/w1560/webt/gw/p9/lp/gwp9lpwboykhneqqwinufvivdju.png)  
[Ipymarkup](https://github.com/natasha/ipymarkup) — примитивная библиотека, нужна для подсветки подстрок в тексте, визуализации NER. [Инструкция по установке](https://github.com/natasha/ipymarkup#install), [пример использования](https://github.com/natasha/ipymarkup#usage) в репозитории Ipymarkup. Библиотека похожа на [displaCy](https://explosion.ai/demos/displacy) и [displaCy ENT](https://explosion.ai/demos/displacy-ent), бесценна при отладке грамматик для Yargy-парсера.  
  

```
>>> from yargy import Parser
>>> from ipymarkup import show_span_box_markup as show_markup

>>> parser = Parser(...)
>>> text = '...'
>>> matches = parser.findall(text)
>>> spans = [_.span for _ in matches]
>>> show_markup(text, spans)
```

  
![](https://habrastorage.org/r/w1560/webt/2c/vq/zn/2cvqznnj3s9gr2mauhfuxx6drai.png)  
  
В проекте Natasha появилось [решение задачи синтаксического разбора](https://github.com/natasha/slovnet#syntax). Понадобилось не только выделять слова в тексте, но и рисовать между ними стрелочки. Существует масса готовых решений, есть даже [научная статья по теме](https://www.aclweb.org/anthology/L18-1091.pdf).  
  
![](https://habrastorage.org/r/w1560/webt/dm/pt/ym/dmptym0rlzlligd6uuidnpxplke.png)  
  
Конечно, ничего из существующего не подошло, и однажды я конкретно заморочился, применил всю известную магию CSS и HTML, добавил новую визуализацию в Ipymarkup. [Инструкция по использованию](https://nbviewer.jupyter.org/github/natasha/ipymarkup/blob/master/docs.ipynb#Syntax-tree) в доке.  
  

```
>>> from ipymarkup import show_dep_markup

>>> words = ['В', 'советский', 'период', 'времени', 'число', 'ИТ', '-', 'специалистов', 'в', 'Армении', 'составляло', 'около', 'десяти', 'тысяч', '.']
>>> deps = [(2, 0, 'case'), (2, 1, 'amod'), (10, 2, 'obl'), (2, 3, 'nmod'), (10, 4, 'obj'), (7, 5, 'compound'), (5, 6, 'punct'), (4, 7, 'nmod'), (9, 8, 'case'), (4, 9, 'nmod'), (13, 11, 'case'), (13, 12, 'nummod'), (10, 13, 'nsubj'), (10, 14, 'punct')]
>>> show_dep_markup(words, deps)
```

  
![](https://habrastorage.org/r/w1560/webt/0z/lz/wm/0zlzwmyl-zdfrkg5xaumhb-3b8o.png)  
  
Теперь в [Natasha](https://github.com/natasha/natasha) и [Nerus](https://github.com/natasha/nerus) удобно смотреть результаты синтаксического разбора.  
  
![](https://habrastorage.org/r/w1560/webt/u2/kd/qf/u2kdqfgbxcioedy6d7bcpgyz3kg.png)