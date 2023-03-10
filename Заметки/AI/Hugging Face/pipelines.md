# Трубопроводы

Конвейеры — отличный и простой способ использования моделей для логического вывода. Эти конвейеры представляют собой объекты, которые абстрагируют большую часть сложного кода из библиотеки, предлагая простой API, предназначенный для нескольких задач, включая распознавание именованных сущностей, моделирование маскированного языка, анализ настроений, извлечение функций и ответы на вопросы. Примеры использования см. в [сводке задач .](https://huggingface.co/docs/transformers/task_summary)

Существует две категории абстракций конвейера, о которых следует знать:

-   Pipeline [()](https://huggingface.co/docs/transformers/v4.26.1/en/main_classes/pipelines#transformers.pipeline) , который является самым мощным объектом, инкапсулирующим все остальные конвейеры.
-   Конвейеры для конкретных задач доступны для [аудио](https://huggingface.co/docs/transformers/main_classes/pipelines#audio) , [компьютерного зрения](https://huggingface.co/docs/transformers/main_classes/pipelines#computer-vision) , [обработки естественного языка](https://huggingface.co/docs/transformers/main_classes/pipelines#natural-language-processing) и [мультимодальных](https://huggingface.co/docs/transformers/main_classes/pipelines#multimodal) задач.

## Абстракция конвейера

_Абстракция конвейера_ представляет собой оболочку всех других доступных конвейеров. Он создается как любой другой конвейер, но может обеспечить дополнительное качество жизни.

Простой вызов одного элемента:
