## напиши CRUD REST сервис на golang

Код для простого CRUD REST сервиса на Golang с использованием базы данных SQLite:

```go
package main

import (
 "database/sql"
 "encoding/json"
 "log"
 "net/http"

 "github.com/gorilla/mux"
 _ "github.com/mattn/go-sqlite3"
)

type Book struct {
 ID     int    `json:"id"`
 Title  string `json:"title"`
 Author string `json:"author"`
}

var db *sql.DB

func main() {
 // Открываем соединение с базой данных SQLite
 var err error
 db, err = sql.Open("sqlite3", "./books.db")
 if err != nil {
  log.Fatal(err)
 }
 defer db.Close()

 // Создаем таблицу для хранения книг, если она еще не существует
 _, err = db.Exec("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL)")
 if err != nil {
  log.Fatal(err)
 }

 // Создаем роутер и регистрируем обработчики для каждого HTTP метода
 r := mux.NewRouter()
 r.HandleFunc("/books", getBooks).Methods("GET")
 r.HandleFunc("/books/{id}", getBook).Methods("GET")
 r.HandleFunc("/books", createBook).Methods("POST")
 r.HandleFunc("/books/{id}", updateBook).Methods("PUT")
 r.HandleFunc("/books/{id}", deleteBook).Methods("DELETE")

 log.Fatal(http.ListenAndServe(":8080", r))
}

// Обработчик GET запроса на получение списка книг
func getBooks(w http.ResponseWriter, r *http.Request) {
 rows, err := db.Query("SELECT id, title, author FROM books")
 if err != nil {
  log.Println(err)
  http.Error(w, "Error getting books", http.StatusInternalServerError)
  return
 }
 defer rows.Close()

 var books []Book
 for rows.Next() {
  var book Book
  err := rows.Scan(&book.ID, &book.Title, &book.Author)
  if err != nil {
   log.Println(err)
   http.Error(w, "Error getting books", http.StatusInternalServerError)
   return
  }
  books = append(books, book)
 }

 w.Header().Set("Content-Type", "application/json")
 json.NewEncoder(w).Encode(books)
}

// Обработчик GET запроса на получение книги по ID
func getBook(w http.ResponseWriter, r *http.Request) {
 params := mux.Vars(r)
 id := params["id"]

 var book Book
 err := db.QueryRow("SELECT id, title, author FROM books WHERE id = ?", id).Scan(&book.ID, &book.Title, &book.Author)
 if err != nil {
  log.Println(err)
  http.Error(w, "Error getting book", http.StatusInternalServerError)
  return
 }

 w.Header().Set("Content-Type", "application/json")
 json.NewEncoder(w).Encode(book)
}

// Обработчик POST запроса на создание новой книги
func createBook(w http.ResponseWriter, r *http.Request) {
 var book Book
 err := json.NewDecoder(r.Body).Decode(&book)
 if err != nil {
  log.Println(err)
  http.Error(w, "Invalid request payload", http.StatusBadRequest)
  return
 }

 result, err := db.Exec("INSERT INTO books (title, author) VALUES (?, ?)", book.Title, book.Author)
 if err != nil {
  log.Println(err)
  http.Error(w, "Error creating book", http.StatusInternalServerError)
  return
 }

 id, _ := result.LastInsertId()
 book.ID = int(id)

 w.Header().Set("Content-Type", "application/json")
 json.NewEncoder(w).Encode(book)
}

// Обработчик PUT запроса на обновление книги по ID
func updateBook(w http.ResponseWriter, r *http.Request) {
 params := mux.Vars(r)
 id := params["id"]

 var book Book
 err := json.NewDecoder(r.Body).Decode(&book)
 if err != nil {
  log.Println(err)
  http.Error(w, "Invalid request payload", http.StatusBadRequest)
  return
 }

 _, err = db.Exec("UPDATE books SET title = ?, author = ? WHERE id = ?", book.Title, book.Author, id)
 if err != nil {
  log.Println(err)
  http.Error(w, "Error updating book", http.StatusInternalServerError)
  return
 }

 book.ID, err = strconv.Atoi(id)
 if err != nil {
  log.Println(err)
  http.Error(w, "Invalid book ID", http.StatusBadRequest)
  return
 }

 w.Header().Set("Content-Type",
```

## напиши телеграм бота на go который чиает новости из rss (учитывает прочитанное) и постит в телеграм

Хорошо, вот пример кода на Go, который читает новости из RSS-ленты и постит их в Телеграм:

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "time"

    "github.com/mmcdole/gofeed"
    "gopkg.in/tucnak/telebot.v2"
)

const (
    token = "<your_bot_token>"
    feedURL = "<rss_feed_url>"
    dataFile = "data.json"
)

type NewsItem struct {
    Title string
    Link string
}

type Data struct {
    LastRead time.Time
}

func main() {
    bot, err := telebot.NewBot(telebot.Settings{
        Token: token,
    })
    if err != nil {
        panic(err)
    }

    // load last read time from file
    data := Data{}
    if b, err := ioutil.ReadFile(dataFile); err == nil {
        if err := json.Unmarshal(b, &data); err != nil {
            fmt.Println("Error loading data:", err)
        }
    }

    // parse RSS feed
    fp := gofeed.NewParser()
    feed, err := fp.ParseURL(feedURL)
    if err != nil {
        panic(err)
    }

    // iterate through items and post new ones to Telegram
    for _, item := range feed.Items {
        if item.PublishedParsed.After(data.LastRead) {
            data.LastRead = *item.PublishedParsed
            newsItem := NewsItem{
                Title: item.Title,
                Link: item.Link,
            }
            postNews(bot, newsItem)
        }
    }

    // save last read time to file
    if b, err := json.Marshal(data); err == nil {
        if err := ioutil.WriteFile(dataFile, b, 0644); err != nil {
            fmt.Println("Error saving data:", err)
        }
    }
}

func postNews(bot *telebot.Bot, item NewsItem) {
    msg := fmt.Sprintf("<a href=\"%s\">%s</a>", item.Link, item.Title)
    _, err := bot.Send(&telebot.MessageConfig{
        ParseMode: telebot.ModeHTML,
        Text: msg,
    })
    if err != nil {
        fmt.Println("Error posting news:", err)
    }
}
```

В этом примере мы используем библиотеку gofeed для парсинга RSS-ленты и библиотеку telebot для работы с Телеграм API. Мы также сохраняем время последнего прочитанного элемента в файле для того, чтобы не повторяться при следующем запуске.
