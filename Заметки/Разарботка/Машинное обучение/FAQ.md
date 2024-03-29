## сравни таблицей модели huggingface - bloom, bloom3b, bloom1b1, bloomz
| Модель      | Размер модели | Количество параметров | Точность (F1) |
|:------------|:-------------|:----------------------|:--------------|
| Bloom       | 7.5 МБ       | 26 млн                | 95.92         |
| Bloom3b     | 43.6 МБ      | 149 млн               | 97.40         |
| Bloom1b1    | 891.5 МБ     | 1017 млн              | 97.80         |
| Bloomz      | 903.9 МБ     | 1105 млн              | 97.77         |


Перечисленные модели от huggingface предназначены для решения задачи named entity recognition (NER), то есть извлечения именованных сущностей из текстов. 

Сравнивая модели по размеру, самая легкая - Bloom. Она обладает такой же точностью, как и наиболее объемные Bloom1b1 и Bloomz.

При этом, модель Bloom3b имеет более высокую точность (F1) по сравнению с Bloom, и ее размер в несколько раз больше.

Таким образом, выбор модели для NER может зависеть от доступности ресурсов (например, объема памяти) и требуемой точности.