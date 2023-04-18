## напиши код используя easyui где в layout слева datagrid справа iframe все инициализируется в javascript коде

Ниже приведен пример кода, который использует библиотеку EasyUI для создания макета с datagrid слева и iframe справа, и все инициализируется в JavaScript-коде:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EasyUI Layout Example</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/themes/icon.css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/jquery.easyui.min.js"></script>
</head>
<body>
    <div class="easyui-layout" style="width:100%;height:100%;">
        <div data-options="region:'west',split:true,title:'DataGrid',width:400" style="padding:5px;">
            <table id="dg" class="easyui-datagrid" style="width:100%;height:100%;"
                url="datagrid_data.json"
                toolbar="#toolbar"
                rownumbers="true"
                fitColumns="true"
                singleSelect="true">
                <thead>
                    <tr>
                        <th field="name" width="50">Name</th>
                        <th field="email" width="50">Email</th>
                        <th field="phone" width="50">Phone</th>
                    </tr>
                </thead>
            </table>
            <div id="toolbar">
                <a href="#" class="easyui-linkbutton" iconCls="icon-add" plain="true">Add</a>
                <a href="#" class="easyui-linkbutton" iconCls="icon-edit" plain="true">Edit</a>
                <a href="#" class="easyui-linkbutton" iconCls="icon-remove" plain="true">Remove</a>
            </div>
        </div>
        <div data-options="region:'center',title:'IFrame'" style="padding:5px;">
            <iframe id="myIframe" src="about:blank" frameborder="0" style="width:100%;height:100%;"></iframe>
        </div>
    </div>
    <script type="text/javascript">
        $(function(){
            $('#dg').datagrid({
                onClickRow: function(index,row){
                    $('#myIframe').attr('src', row.url);
                }
            });
        });
    </script>
</body>
</html>
```

В этом примере используется EasyUI Layout для создания разметки с двумя регионами: "west" и "center". В регионе "west" находится datagrid, который загружает данные из файла "datagrid_data.json". В регионе "center" находится iframe, который загружает страницу "about:blank" по умолчанию, и его содержимое обновляется при клике на строку datagrid. Кнопки "Add", "Edit" и "Remove" в datagrid создаются с помощью EasyUI LinkButton.

## сделай всю инициализацию компонентов в jquery

Вот пример кода, который инициализирует компоненты EasyUI в jQuery:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EasyUI Layout Example</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/themes/icon.css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easyui/1.9.19/jquery.easyui.min.js"></script>
    <script type="text/javascript">
        $(function(){
            $('#dg').datagrid({
                url: 'datagrid_data.json',
                toolbar: '#toolbar',
                rownumbers: true,
                fitColumns: true,
                singleSelect: true,
                columns:[[
                    {field:'name',title:'Name',width:50},
                    {field:'email',title:'Email',width:50},
                    {field:'phone',title:'Phone',width:50}
                ]],
                onClickRow: function(index,row){
                    $('#myIframe').attr('src', row.url);
                }
            });
            $('#toolbar').toolbar({
                items:[{
                    text:'Add',
                    iconCls:'icon-add',
                    handler:function(){alert('add')}
                },{
                    text:'Edit',
                    iconCls:'icon-edit',
                    handler:function(){alert('edit')}
                },{
                    text:'Remove',
                    iconCls:'icon-remove',
                    handler:function(){alert('remove')}
                }]
            });
        });
    </script>
</head>
<body>
    <table id="dg" class="easyui-datagrid" style="width:100%;height:100%;"></table>
    <div id="toolbar">
    </div>
    <iframe id="myIframe" src="about:blank" frameborder="0" style="width:100%;height:100%;"></iframe>
</body>
</html>
```

В этом примере все компоненты EasyUI инициализируются внутри функции jQuery $(). В datagrid определяются параметры и колонки таблицы. В toolbar создаются кнопки "Add", "Edit" и "Remove". В onClickRow определяется функция, которая обновляет содержимое iframe при клике на строку таблицы. Обратите внимание, что в toolbar используется EasyUI Toolbar вместо LinkButton, как в предыдущем примере.

## как для easyui datagrid вывести изображение в одной из колоннок?

Для вывода изображения в столбце грида EasyUI Datagrid нужно использовать форматирование ячеек. В зависимости от того, какие данные вы хотите отображать в ячейке, можно использовать различные форматы.

Для вывода изображения в ячейке можно использовать форматирование типа "formatter". Для этого нужно задать свойство "formatter" для столбца, в котором нужно отобразить изображение.

Пример:

```javascript
$('#dg').datagrid({
    columns: [{
        field: 'name',
        title: 'Имя'
    },{
        field: 'image',
        title: 'Изображение',
        formatter: function(value, row, index){
            return '<img src="' + value + '" style="width:100px;height:100px;">';
        }
    }]
});
```

В этом примере мы задаем два столбца: "Имя" и "Изображение". Для столбца "Изображение" мы задаем свойство "formatter" и передаем функцию, которая возвращает тег изображения с источником изображения, указанным в ячейке.

В данном примере мы выводим изображение с шириной и высотой 100 пикселей. Вы можете изменить размер изображения, указав другие значения для свойства "style".