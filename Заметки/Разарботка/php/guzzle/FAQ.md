## какие ошибки генерирует Guzzle при ответе с кодом не равным 200

При ответе с кодом, отличным от 200, Guzzle может генерировать исключения разных типов в зависимости от настроек клиента и типа ошибки. 

Вот некоторые из возможных исключений:

- GuzzleHttp\Exception\RequestException - генерируется, если запрос не может быть успешно выполнен из-за ошибки на стороне клиента (например, неверный URL, отсутствие соединения и т.д.) или сервера (например, ошибка валидации данных).

- GuzzleHttp\Exception\ClientException - генерируется, если запрос был корректен, но сервер вернул код ошибки 4xx (например, 404 Not Found, 401 Unauthorized и т.д.).

- GuzzleHttp\Exception\ServerException - генерируется, если сервер вернул код ошибки 5xx (например, 500 Internal Server Error).

- GuzzleHttp\Exception\BadResponseException - генерируется, если ответ сервера не может быть обработан из-за неправильного формата данных или другой ошибки.

Каждый тип исключения содержит дополнительную информацию, которая может быть использована для обработки ошибок в коде приложения.