## напиши примеры работы с vuex-orm?

Vuex-ORM - это библиотека для управления состоянием приложения во Vue.js, которая предоставляет возможность упрощенного доступа к данным, хранящимся в Vuex. Рассмотрим несколько примеров работы с Vuex-ORM:

1. Определение моделей данных

```javascript
import { Model } from "@vuex-orm/core";

export default class User extends Model {
  static entity = "users";

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(""),
      email: this.string(""),
      posts: this.hasMany(Post, "user_id")
    };
  }
}
```


Здесь мы определили модель User, которая имеет атрибуты id, name и email, а также связь один-ко-многим с моделью Post.

2. Использование Vuex-ORM для получения данных

```javascript
import { mapGetters } from "vuex";
import User from "@/models/User";

export default {
  computed: {
    ...mapGetters({
      users: "entities/users/all"
    })
  },

  created() {
    User.fetch();
  }
};
```


Здесь мы использовали метод fetch() модели User, чтобы получить данные из API и сохранить их в хранилище Vuex. Мы также использовали хелпер mapGetters для получения всех пользователей из хранилища.

3. Создание новой записи

```javascript
import User from "@/models/User";

const user = new User({
  name: "John Doe",
  email: "john.doe@example.com"
});

user.$save();
```


Здесь мы создали новую запись в модели User и сохраняем ее в хранилище с помощью метода $save(). После этого пользователь будет доступен в хранилище и может быть использован в других компонентах.

4. Обновление записи

```javascript
import User from "@/models/User";

const user = User.query().find(1);

user.name = "Jane Doe";

user.$update();
```


Здесь мы получаем запись пользователя с помощью метода find() модели User, обновляем ее атрибуты и сохраняем изменения в хранилище с помощью метода $update().

Это только некоторые примеры работы с Vuex-ORM. Библиотека предоставляет множество других методов и функций для управления состоянием приложения во Vue.js.