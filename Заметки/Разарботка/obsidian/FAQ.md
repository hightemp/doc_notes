## как в obsidian plugin добавить событие при сохранении файла
Для добавления события при сохранении файла в Obsidian Plugin необходимо использовать функцию `registerEvent`. В качестве параметра функции нужно передать объект типа `App`, который предоставляет доступ к различным событиям, происходящим в приложении Obsidian.

Пример:

```typescript
import { App, Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
    async onload() {
        this.registerEvent(this.app.vault.on('modify', (file) => {
            console.log(`Файл ${file.path} был изменен!`);
        }));
    }
}
```

В этом примере мы регистрируем событие `modify` с помощью функции `this.app.vault.on()`, которая срабатывает при изменении любого файла в хранилище. В обработчике события мы выводим сообщение в консоль с информацией о пути измененного файла.

## как в obsidian plugin добавить событие при создании, удалении файла

Для того, чтобы добавить событие при создании файла, можно воспользоваться функцией `this.app.vault.on("create", callback)`. В обработчике события `callback` можно выполнить нужные действия при создании файла. Например, вывести сообщение в консоль с информацией о созданном файле.

Аналогично, для добавления события при удалении файла можно использовать функцию `this.app.vault.on("delete", callback)`. В обработчике `callback` можно выполнить нужные действия при удалении файла. Например, вывести сообщение в консоль с информацией об удаленном файле.

## как в obsidian plugin получить список файлов

Для получения списка файлов можно использовать следующий код:

```javascript
let files = this.app.vault.getMarkdownFiles();
```

Этот код вернет массив объектов, представляющих все файлы с расширением `.md` в текущем хранилище. Каждый объект содержит информацию о файле, такую как его название, путь и содержимое. Вы можете использовать этот массив для выполнения различных действий с файлами в вашем плагине.

## как в obsidian plugin получить список файлов и покажи структуру содержимого

Для получения списка файлов в папке в Obsidian плагине можно воспользоваться функцией `listFiles` из API. Эта функция возвращает массив объектов `TFile`, которые содержат информацию о каждом файле.

Пример использования:

```javascript
let files = this.app.vault.getMarkdownFiles();
files.forEach(file => {
    console.log(file.path);
});
```

Этот код получит список всех Markdown-файлов в хранилище и выведет путь к каждому файлу в консоль.

Чтобы получить структуру содержимого, можно использовать рекурсивную функцию для обхода всех файлов и папок внутри папки. Пример:

```javascript
function listFilesRecursive(dir) {
    let files = this.app.vault.getMarkdownFiles().filter(file => file.parent.path == dir);
    let folders = this.app.vault.getMarkdownFiles().filter(file => file.parent.path == dir && file instanceof TFolder);

    console.group(`[${dir}]`);
    console.log('Files:', files.map(file => file.name));
    console.log('Folders:', folders.map(folder => folder.name));
    console.groupEnd();

    folders.forEach(folder => listFilesRecursive(folder.path));
}

listFilesRecursive('/');
```

Этот код получит список всех Markdown-файлов и папок в корневой папке хранилища и выведет их структуру в консоль в виде дерева.

## как в obsidian plugin получить содержимое определенного файла

можно использовать объект `this.app.vault`, который предоставляет метод `read(file: TAbstractFile): Promise<string>`. Этот метод принимает объект файла `TAbstractFile` и возвращает обещание, которое разрешается строкой содержимого файла.

Например, чтобы получить содержимое файла с именем `myfile.md`, находящегося в корневой папке хранилища, можно использовать следующий код:

```typescript
const filename = "myfile.md";
const file = this.app.vault.getAbstractFileByPath(filename);
if (file instanceof TFile) {
  const content = await this.app.vault.read(file);
  console.log(content);
} else {
  console.error(`${filename} is not a file`);
}
```

Этот код получит объект файла `myfile.md` с помощью метода `getAbstractFileByPath()`, проверит, является ли этот объект экземпляром класса `TFile`, и если да, то получит его содержимое с помощью метода `read()`.

## как в obsidian plugin записать содержимое определенного файла

Вы можете использовать метод `modify()` для записи содержимого файла. Вот как это сделать:

```javascript
async function writeToFile(filepath, content) {
    let file = await this.app.vault.getAbstractFileByPath(filepath);
    if(file instanceof TFile) {
        await this.app.vault.modify(file, content);
        console.log(`File ${filepath} saved successfully!`);
    } else {
        console.log(`File ${filepath} not found!`);
    }
}
```

Этот код получит объект файла `myfile.md` с помощью метода `getAbstractFileByPath()`, проверит, является ли этот объект экземпляром класса `TFile`, и если да, то запишет в него новое содержимое с помощью метода `modify()`. Обратите внимание, что этот метод является асинхронным, поэтому вам нужно использовать ключевое слово `await` при вызове.

## как в obsidian plugin получить список файлов рекурсивно обойдя все дерево файлов

```javascript
async function listFilesRecursive(path) {
    const folder = await workspace.getAbstractFileByPath(path);

    if (folder instanceof TFolder) {
        const files = await Promise.all(folder.children.map(child => listFilesRecursive(child.path)));
        return [].concat(...files);
    } else if (folder instanceof TFile) {
        return [folder];
    } else {
        return [];
    }
}

async function printFileTree() {
    const files = await listFilesRecursive('/');
    console.log(files.map(file => file.path));
}

printFileTree();
```

Этот код получает список всех файлов, начиная с корневой папки, с помощью рекурсивной функции `listFilesRecursive()`. Функция возвращает массив объектов `TFile`, представляющих каждый файл в дереве. Затем функция `printFileTree()` просто выводит путь каждого файла в консоль.

## как в obsidian plugin получить объект-список из вложенных папок и файлов рекурсивно обойдя все дерево файлов

Вот пример кода, который позволяет получить объект-список из вложенных папок и файлов рекурсивно обойдя все дерево файлов:

```javascript
async function getFilesRecursively(dir) {
  const files = await window.app.vault.getMarkdownFiles();

  const result = {
    files: [],
    folders: {},
  };

  for (const file of files) {
    const relativePath = window.app.vault.getRelativePath(file.path, dir);
    const parts = relativePath.split('/');

    let current = result;
    for (const part of parts.slice(0, -1)) {
      if (!current.folders[part]) {
        current.folders[part] = {
          files: [],
          folders: {},
        };
      }
      current = current.folders[part];
    }

    const fileName = parts[parts.length - 1];
    current.files.push(fileName);
  }

  return result;
}
```

Вызов этой функции с указанием корневой папки вернет объект, содержащий список файлов и вложенных папок в этой папке. Объект будет иметь следующий формат:

```json
{
  files: [
    'file1.md',
    'file2.md'
  ],
  folders: {
    'folder1': {
      files: [
        'file3.md',
        'file4.md'
      ],
      folders: {
        'subfolder1': {
          ...
        }
      }
    },
    'folder2': {
      ...
    }
  }
}
```

Обратите внимание, что этот код будет работать только с файлами Markdown, поэтому, если вы хотите работать с другими типами файлов, вам может потребоваться изменить функцию `getFilesRecursively` соответствующим образом.

Written by Chatsonic