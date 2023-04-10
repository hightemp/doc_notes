## напиши пример кода bbolt в golang, где сохраняется объект, создается, удаляется запись

Вот пример кода, который демонстрирует сохранение, создание и удаление записи в BoltDB (bbolt):

```go
package main

import (
 "encoding/json"
 "fmt"
 "log"

 "github.com/boltdb/bolt"
)

type Person struct {
 Name string
 Age  int
}

func main() {
 db, err := bolt.Open("mydb.db", 0600, nil)
 if err != nil {
  log.Fatal(err)
 }
 defer db.Close()

 // сохранение объекта
 err = db.Update(func(tx *bolt.Tx) error {
  b, err := tx.CreateBucketIfNotExists([]byte("people"))
  if err != nil {
   return err
  }
  person := Person{Name: "John", Age: 25}
  encoded, err := json.Marshal(person)
  if err != nil {
   return err
  }
  err = b.Put([]byte("person1"), encoded)
  return err
 })
 if err != nil {
  log.Fatal(err)
 }

 // создание записи
 err = db.Update(func(tx *bolt.Tx) error {
  b, err := tx.CreateBucketIfNotExists([]byte("people"))
  if err != nil {
   return err
  }
  person := Person{Name: "Alice", Age: 30}
  encoded, err := json.Marshal(person)
  if err != nil {
   return err
  }
  err = b.Put([]byte("person2"), encoded)
  return err
 })
 if err != nil {
  log.Fatal(err)
 }

 // удаление записи
 err = db.Update(func(tx *bolt.Tx) error {
  b := tx.Bucket([]byte("people"))
  if b == nil {
   return fmt.Errorf("bucket not found")
  }
  err := b.Delete([]byte("person1"))
  return err
 })
 if err != nil {
  log.Fatal(err)
 }

 // чтение объекта
 err = db.View(func(tx *bolt.Tx) error {
  b := tx.Bucket([]byte("people"))
  if b == nil {
   return fmt.Errorf("bucket not found")
  }
  encoded := b.Get([]byte("person2"))
  if encoded == nil {
   return fmt.Errorf("person2 not found")
  }
  var person Person
  err := json.Unmarshal(encoded, &person)
  if err != nil {
   return err
  }
  fmt.Printf("Name: %s, Age: %d\n", person.Name, person.Age)
  return nil
 })
 if err != nil {
  log.Fatal(err)
 }
}
```

В этом примере мы создаем базу данных BoltDB и сохраняем два объекта `Person`. Затем мы удаляем один из них и читаем второй объект, чтобы убедиться, что он был успешно сохранен. Обратите внимание, что BoltDB использует транзакции для обновления данных, поэтому каждое обновление выполняется внутри функции `db.Update`. Транзакции предоставляют атомарность и консистентность при обновлении данных в BoltDB. Мы также используем функцию `json.Marshal` для кодирования объектов в формат JSON и `json.Unmarshal` для декодирования JSON обратно в объекты.