## как с помощью PhpOffice\PhpSpreadsheet сгенерировать xls таблицу с данными в 3 столбцах

Для генерации XLS таблицы с помощью библиотеки PhpSpreadsheet, вы можете использовать следующий пример кода:

```php
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;

// Создаем объект класса Spreadsheet
$spreadsheet = new Spreadsheet();

// Получаем активный лист
$sheet = $spreadsheet->getActiveSheet();

// Задаем заголовки столбцов
$sheet->setCellValue('A1', 'Название');
$sheet->setCellValue('B1', 'Количество');
$sheet->setCellValue('C1', 'Цена');

// Добавляем данные в таблицу
$data = [
    ['Товар 1', 10, 100],
    ['Товар 2', 5, 200],
    ['Товар 3', 3, 300],
];

foreach ($data as $row => $rowData) {
    $sheet->setCellValue('A' . ($row + 2), $rowData[0]);
    $sheet->setCellValue('B' . ($row + 2), $rowData[1]);
    $sheet->setCellValue('C' . ($row + 2), $rowData[2]);
}

// Создаем объект класса Xls и сохраняем файл
$writer = new Xls($spreadsheet);
$writer->save('example.xls');
```


Здесь мы создаем объект класса Spreadsheet, получаем активный лист, задаем заголовки столбцов и добавляем данные в таблицу. Затем создаем объект класса Xls и сохраняем файл.

Обратите внимание, что для работы с библиотекой PhpSpreadsheet необходимо установить ее через Composer.

## а как отдать в браузер в виде файла

Чтобы отдать сгенерированный файл в браузер, можно использовать следующий код:

```php
// Создаем объект класса Xls
$writer = new Xls($spreadsheet);

// Устанавливаем заголовки для скачиваемого файла
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="example.xls"');
header('Cache-Control: max-age=0');

// Отправляем данные файла в браузер
$writer->save('php://output');
```


Здесь мы создаем объект класса Xls, устанавливаем заголовки для скачиваемого файла и отправляем данные файла в браузер.

Обратите внимание, что в данном примере мы задаем заголовок Content-Type для типа файла XLS. Если вы хотите отправить другой тип файла, необходимо установить соответствующий заголовок. Например, для CSV файлов используется заголовок text/csv.

## как это сделать в laminas controller

Для отдачи сгенерированного файла в Laminas Controller можно использовать следующий код:

```php
use Laminas\Http\Response\Stream;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;

public function downloadAction()
{
    // Создаем объект класса Spreadsheet и заполняем его данными

    // Создаем объект класса Xls
    $writer = new Xls($spreadsheet);

    // Создаем объект класса Stream и устанавливаем данные файла
    $response = new Stream();
    $response->setStream(fopen('php://output', 'r+'));
    $response->setStatusCode(200);
    $response->setStreamName('example.xls');
    $response->setHeaders([
        'Content-Type' => 'application/vnd.ms-excel',
        'Content-Disposition' => 'attachment;filename="example.xls"',
        'Cache-Control' => 'max-age=0',
    ]);

    // Отдаем файл в браузер
    $writer->save('php://output');
    return $response;
}
```

Здесь мы создаем объект класса Stream, в который будем записывать данные файла. Устанавливаем заголовки для скачиваемого файла и отправляем данные файла в браузер.

Обратите внимание, что в данном примере мы задаем заголовок Content-Type для типа файла XLS. Если вы хотите отправить другой тип файла, необходимо установить соответствующий заголовок. Например, для CSV файлов используется заголовок text/csv.

Данный код может быть использован в действии контроллера в Laminas MVC приложении.