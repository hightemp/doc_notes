## напиши код bootstrap-vue где b-table обновляется по ajax с поддержкой sort, filtering

Пример кода BootstrapVue, который использует компонент `b-table` и обновляет его данные через AJAX с поддержкой сортировки и фильтрации:

```html
<template>
  <div>
    <b-table :items="books" :fields="fields" :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" striped hover responsive>
      <template slot="title">
        Books
        <b-button size="sm" class="float-right" @click="refreshBooks"><i class="fa fa-refresh"></i> Refresh</b-button>
      </template>
      <template slot="title-row" slot-scope="{ columns }">
        <tr>
          <th v-for="column in columns" :key="column.key" :class="[column.sortable ? 'sorting' : '', sortBy === column.key ? sortDesc ? 'sorting-desc' : 'sorting-asc' : '']" @click="column.sortable ? sort(column.key) : null">
            {{ column.label }}
            <span v-if="column.sortable" class="float-right">
              <b-icon icon="sort-alpha-down" v-if="sortBy !== column.key"></b-icon>
              <b-icon icon="sort-alpha-down-alt" v-if="sortBy === column.key && !sortDesc"></b-icon>
              <b-icon icon="sort-alpha-up-alt" v-if="sortBy === column.key && sortDesc"></b-icon>
            </span>
          </th>
        </tr>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      books: [],
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title', sortable: true },
        { key: 'author', label: 'Author', sortable: true },
        { key: 'published', label: 'Published' },
        { key: 'pages', label: 'Pages' },
        { key: 'language', label: 'Language' }
      ],
      filter: null,
      filterOn: ['title', 'author'],
      sortBy: 'title',
      sortDesc: false
    }
  },
  methods: {
    refreshBooks () {
      axios.get('/api/books')
        .then(response => {
          this.books = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    sort (key) {
      if (this.sortBy === key) {
        this.sortDesc = !this.sortDesc
      } else {
        this.sortBy = key
        this.sortDesc = false
      }
    }
  },
  mounted () {
    this.refreshBooks()
  }
}
</script>
```

В этом примере мы создали компонент Vue, который использует компонент `b-table` из BootstrapVue. Мы настроили таблицу на поддержку фильтрации и сортировки. Для обновления данных в таблице мы используем метод `refreshBooks`, который делает AJAX-запрос на сервер и обновляет данные таблицы. Мы также добавили метод `sort`, который обрабатывает клики на заголовки столбцов и изменяет направление сортировки. Обратите внимание, что мы используем библиотеку Axios для выполнения AJAX-запросов.

## напиши код bootstrap-vue где b-table обновляется по ajax с поддержкой sort, filtering фильтрация и сортировка должны быть на стороне сервера

Вот пример кода, который позволяет обновлять таблицу b-table по AJAX с поддержкой сортировки и фильтрации на стороне сервера:

```vue
<template>
  <div>
    <b-table :items="items" :fields="fields" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @filtered="onFiltered" @sort-changed="onSortChanged">
      <template slot="first_name" slot-scope="row">{{ row.item.first_name }}</template>
      <template slot="last_name" slot-scope="row">{{ row.item.last_name }}</template>
      <template slot="email" slot-scope="row">{{ row.item.email }}</template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      fields: [
        { key: 'first_name', label: 'First Name' },
        { key: 'last_name', label: 'Last Name' },
        { key: 'email', label: 'Email' }
      ],
      filter: null,
      sortBy: null,
      sortDesc: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        filter: this.filter,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      }
      axios.get('/api/data', { params }).then(response => {
        this.items = response.data.items
      })
    },
    onFiltered(filter) {
      this.filter = filter
      this.loadData()
    },
    onSortChanged(sortBy, sortDesc) {
      this.sortBy = sortBy
      this.sortDesc = sortDesc
      this.loadData()
    }
  }
}
</script>
```

Этот код использует компонент b-table из Bootstrap Vue для отображения таблицы. Он настроен на получение данных с сервера через AJAX-запросы. При изменении фильтра или сортировки на стороне клиента, он отправляет запросы на сервер с параметрами фильтра и сортировки, а затем обновляет таблицу с новыми данными.