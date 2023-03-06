## напиши vue компонент содержащий таблицу имеющую возможность сортировать столбцы, убирать столбцы и фильтровать по столбцам

Конечно! Вот пример Vue компонента, который содержит таблицу со встроенными возможностями сортировки, скрытия и фильтрации столбцов:

```HTML
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <div>
              <span v-if="column.visible" @click="sort(index)">
                {{ column.name }}
              </span>
              <span v-else>
                {{ column.name }}
              </span>
              <button @click="toggleColumn(index)">Hide</button>
              <input v-if="column.filterable" v-model="filters[index]" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredData" :key="index">
          <td v-for="(column, colIndex) in columns" :key="colIndex" v-if="column.visible">
            {{ row[column.field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortColumn: -1,
      sortDirection: null,
      filters: {},
    };
  },
  computed: {
    filteredData() {
      let filteredData = this.data;
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        if (column.filterable && this.filters[i]) {
          filteredData = filteredData.filter((row) => {
            return row[column.field]
              .toLowerCase()
              .includes(this.filters[i].toLowerCase());
          });
        }
      }
      return filteredData;
    },
  },
  methods: {
    sort(index) {
      if (this.sortColumn === index) {
        this.sortDirection =
          this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = index;
        this.sortDirection = "asc";
      }
      const column = this.columns[index];
      this.data.sort((a, b) => {
        const fieldA = a[column.field];
        const fieldB = b[column.field];
        if (fieldA < fieldB) {
          return this.sortDirection === "asc" ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return this.sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    },
    toggleColumn(index) {
      this.columns[index].visible = !this.columns[index].visible;
    },
  },
  mounted() {
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (column.filterable) {
        this.filters[i] = "";
      }
      if (column.visible === undefined) {
        this.$set(this.columns[i], "visible", true);
      }
    }
  },
};
</script>
```

Этот компонент принимает два свойства: `data` и `columns`. `data` это массив объектов, каждый объект представляет строку в таблице. `columns` это массив объектов, каждый объект представляет столбец в таблице. Каждый объект столбца имеет следующие свойства: `name` - имя столбца для отображения, `field` - имя свойства объекта данных, которое отображается в этом столбце, `visible` - определяет, должен ли столбец быть видимым по умолчанию, и `filterable` - определяет, должен ли столбец быть доступен для фильтрации.

Когда пользователь щелкает на заголовок столбца, метод `sort` вызывается для сортировки данных по выбранному столбцу. Когда пользователь щелкает на кнопку "Hide" в заголовке столбца, метод `toggleColumn` вызывается для скрытия столбца. Когда пользователь вводит текст в поле фильтрации столбца, вычисляем

## напиши пример использования этого компонента

Конечно! Вот пример использования компонента таблицы во Vue-приложении:

```
<template>
  <div>
    <table-component :data="tableData" :columns="tableColumns" />
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";

export default {
  components: {
    TableComponent,
  },
  data() {
    return {
      tableData: [
        { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
        { id: 2, name: "Jane Doe", email: "jane@example.com", age: 25 },
        { id: 3, name: "Bob Smith", email: "bob@example.com", age: 40 },
        { id: 4, name: "Mary Johnson", email: "mary@example.com", age: 35 },
      ],
      tableColumns: [
        { name: "ID", field: "id", visible: true },
        { name: "Name", field: "name", visible: true, filterable: true },
        { name: "Email", field: "email", visible: true, filterable: true },
        { name: "Age", field: "age", visible: true, filterable: true },
      ],
    };
  },
};
</script>
```

Этот код создает таблицу с четырьмя столбцами: ID, Name, Email и Age. Каждый столбец имеет свойство `visible`, которое устанавливает его видимость. По умолчанию все столбцы видимы. Каждый столбец, кроме ID, также имеет свойство `filterable`, которое позволяет пользователю фильтровать данные в этом столбце.

## напиши полнофукциональный datagrid компонент на vue, при этом нужно учесть

-   столбцы можно скрывать
-   есть сортировака столбцов, можно ее переключать
-   есть фильтрация столбцов, которая включается при необходимости
-   есть настройки datagrid


```Vue.js

<template>
  <div>
    <div class="datagrid-settings">
      <label>Columns:</label>
      <select v-model="columnsSetting">
        <option v-for="column in columns" :value="column">{{column}}</option>
      </select>
      <button @click="hideColumn(columnsSetting)">Hide</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <div class="datagrid-header">
              <span>{{ column }}</span>
              <div>
                <button @click="sortColumn(column)">Sort</button>
                <button @click="toggleFilterColumn(column)">Filter</button>
              </div>
            </div>
            <div class="datagrid-filter" v-if="isFiltering(column)">
              <input type="text" v-model="filter[column]" />
              <button @click="applyFilter(column)">Apply</button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredRows" :key="index">
          <td v-for="(column, index) in columns" :key="index">{{ row[column] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    rows: Array,
    columns: Array
  },
  data() {
    return {
      visibleColumns: this.columns.slice(),
      sort: {
        column: null,
        order: "asc"
      },
      filter: {},
      settings: {
        isFiltering: false
      }
    };
  },
  computed: {
    filteredRows() {
      let rows = this.rows.slice();
      for (let column in this.filter) {
        if (this.filter[column]) {
          rows = rows.filter(row => {
            return row[column]
              .toString()
              .toLowerCase()
              .includes(this.filter[column].toString().toLowerCase());
          });
        }
      }
      return rows;
    }
  },
  methods: {
    hideColumn(column) {
      const index = this.visibleColumns.indexOf(column);
      if (index > -1) {
        this.visibleColumns.splice(index, 1);
      }
    },
    sortColumn(column) {
      if (this.sort.column === column) {
        this.sort.order = this.sort.order === "asc" ? "desc" : "asc";
      } else {
        this.sort.column = column;
        this.sort.order = "asc";
      }
      this.filteredRows.sort((a, b) => {
        let comparison = 0;
        if (a[column] > b[column]) {
          comparison = 1;
        } else if (a[column] < b[column]) {
          comparison = -1;
        }
        return this.sort.order === "desc" ? comparison * -1 : comparison;
      });
    },
    toggleFilterColumn(column) {
      this.settings.isFiltering = !this.settings.isFiltering;
      if (this.settings.isFiltering) {
        this.filter[column] = "";
      } else {
        delete this.filter[column];
      }
    },
    applyFilter(column) {
      this.settings.isFiltering = false;
    },
    isFiltering(column) {
      return column in this.filter && this.settings.isFiltering;
    }
  }
};
</script>

<style>
.datagrid-header {
  display: flex;
  justify-content: space-between;
}
.datagrid-settings {
  margin-bottom: 16px;
}
.datagrid-filter {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
</style>
```

Пример использования компонента:

```Vue.js
<template>
  <div>
    <datagrid :rows="rows" :columns="columns" />
  </div>
</template>

<script>
import Datagrid from "@/components/Datagrid.vue";

export default {
  components: {
    Datagrid
  },
  data() {
    return {
      rows: [
        { name: "John", age: 25, email: "john@email.com" },
        { name: "Mary", age: 35, email: "mary@email.com" }
      ],
      columns: ["name", "age", "email"]
    };
  }
};
</script>
```

Однако, чтобы создать полнофункциональный компонент таблицы, мы можем добавить еще некоторые функции, такие как:

3. Пагинация: если таблица содержит большое количество строк, мы можем добавить возможность разбивать таблицу на страницы. Для этого мы можем добавить дополнительные параметры, такие как количество строк на странице и текущую страницу.

```html
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" @click="sort(index)">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in paginatedRows"
          :key="index"
          @click="selectRow(index)"
          :class="rowClasses(index)"
        >
          <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="previousPage">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      columnToSort: null,
      direction: 1,
      selectedRow: null,
      currentPage: 1,
    };
  },
  computed: {
    sortedRows() {
      if (this.columnToSort === null) {
        return this.rows;
      }
      return this.rows.slice().sort((a, b) =>
        a[this.columnToSort] > b[this.columnToSort] ? this.direction : -this.direction
      );
    },
    filteredRows() {
      if (this.filter === "") {
        return this.sortedRows;
      }
      return this.sortedRows.filter((row) =>
        row.some(
          (cell) =>
            cell.toString().toLowerCase().includes(this.filter.toLowerCase())
        )
      );
    },
    paginatedRows() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize);
      return this.filteredRows.slice(startIndex, endIndex);
    },
  },
  methods: {
    sort(columnIndex) {
      if (columnIndex === this.columnToSort) {
        this.direction = this.direction * -1;
      } else {
        this.columnToSort = columnIndex;
        this.direction = 1;
      }
    },
    selectRow(rowIndex) {
      if (rowIndex === this.selectedRow) {
        this.selectedRow = null;
      } else {
        this.selectedRow = rowIndex;
      }
    },
    rowClasses(rowIndex) {
      return {
        selected: rowIndex === this.selectedRow,
      };
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
  },
};
</script>
```


Однако, чтобы создать полнофункциональный компонент таблицы, мы можем добавить еще некоторые функции, такие как:

3.  Пагинация: если таблица содержит большое количество строк, мы можем добавить возможность разбивать таблицу на страницы. Для этого мы можем добавить дополнительные параметры, такие как количество строк на странице и текущую страницу.

```html
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" @click="sort(index)">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in paginatedRows"
          :key="index"
          @click="selectRow(index)"
          :class="rowClasses(index)"
        >
          <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="previousPage">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      columnToSort: null,
      direction: 1,
      selectedRow: null,
      currentPage: 1,
    };
  },
  computed: {
    sortedRows() {
      if (this.columnToSort === null) {
        return this.rows;
      }
      return this.rows.slice().sort((a, b) =>
        a[this.columnToSort] > b[this.columnToSort] ? this.direction : -this.direction
      );
    },
    filteredRows() {
      if (this.filter === "") {
        return this.sortedRows;
      }
      return this.sortedRows.filter((row) =>
        row.some(
          (cell) =>
            cell.toString().toLowerCase().includes(this.filter.toLowerCase())
        )
      );
    },
    paginatedRows() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize);
      return this.filteredRows.slice(startIndex, endIndex);
    },
  },
  methods: {
    sort(columnIndex) {
      if (columnIndex === this.columnToSort) {
        this.direction = this.direction * -1;
      } else {
        this.columnToSort = columnIndex;
        this.direction = 1;
      }
    },
    selectRow(rowIndex) {
      if (rowIndex === this.selectedRow) {
        this.selectedRow = null;
      } else {
        this.selectedRow = rowIndex;
      }
    },
    rowClasses(rowIndex) {
      return {
        selected: rowIndex === this.selectedRow,
      };
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
  },
};
</script>
```

4.  Редактирование ячеек: мы можем добавить возможность редактировать ячейки таблицы. Для этого мы можем добавить состояние редактирования, методы для отображения и скрытия поля ввода и обработку изменений.

