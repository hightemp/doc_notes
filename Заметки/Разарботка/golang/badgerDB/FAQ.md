## напиши пример кода badger в golang, где сохраняется объект, создается, удаляется запись

Вот пример кода, который демонстрирует сохранение, создание и удаление записи в Badger:

```go
package main

import (
 "fmt"
 "log"

 "github.com/dgraph-io/badger/v3"
)

type Person struct {
 Name string
 Age  int
}

func main() {
 db, err := badger.Open(badger.DefaultOptions("./data"))
 if err != nil {
  log.Fatal(err)
 }
 defer db.Close()

 // сохранение объекта
 err = db.Update(func(txn *badger.Txn) error {
  person := Person{Name: "John", Age: 25}
  key := []byte("person1")
  value, err := encodePerson(person)
  if err != nil {
   return err
  }
  err = txn.Set(key, value)
  return err
 })
 if err != nil {
  log.Fatal(err)
 }

 // создание записи
 err = db.Update(func(txn *badger.Txn) error {
  key := []byte("person2")
  value, err := encodePerson(Person{Name: "Alice", Age: 30})
  if err != nil {
   return err
  }
  return txn.Set(key, value)
 })
 if err != nil {
  log.Fatal(err)
 }

 // удаление записи
 err = db.Update(func(txn *badger.Txn) error {
  key := []byte("person1")
  return txn.Delete(key)
 })
 if err != nil {
  log.Fatal(err)
 }

 // чтение объекта
 err = db.View(func(txn *badger.Txn) error {
  key := []byte("person2")
  item, err := txn.Get(key)
  if err != nil {
   return err
  }
  var person Person
  err = item.Value(func(val []byte) error {
   person, err = decodePerson(val)
   return err
  })
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

func encodePerson(person Person) ([]byte, error) {
 // кодируем объект в бинарный формат
 // здесь может использоваться любой codec, например, gob или protobuf
 return []byte(fmt.Sprintf("%s:%d", person.Name, person.Age)), nil
}

func decodePerson(b []byte) (Person, error) {
 // декодируем бинарный формат обратно в объект
 // здесь может использоваться любой codec, например, gob или protobuf
 var person Person
 _, err := fmt.Sscanf(string(b), "%s:%d", &person.Name, &person.Age)
 return person, err
}
```

В этом примере мы создаем базу данных Badger и сохраняем два объекта `Person`. Затем мы удаляем один из них и читаем второй объект, чтобы убедиться, что он был успешно сохранен. Обратите внимание, что Badger использует транзакции для обновления данных, поэтому каждое обновление выполняется внутри функции `db.Update`. Транзакции предоставляют атомарность и консистентность при обновлении данных в Badger.