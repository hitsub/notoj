

var notes = [
    {
        title : "あびゃ",
        content : "うひょ",
        date : "2017-10-15 11:28:10.173"
    },
    {
        title : "めう～",
        content : "めう",
        date : "2017-10-13 11:28:10.173"
    }
];
window.localStorage.setItem("notes", JSON.stringify(notes));


var isNewFile = true;

function GetCell() {
    var table = document.getElementById('table');
    for (var i=0; i<table.rows.length; i++) {
        for (var j=0; j<table.rows[i].cells.length; j++) {
            var Cells = table.rows[i].cells[j];
            Cells.onclick = function(){
                TableClick(this);
            }
        }
    }
}

function TableClick(Cell) {
    var rowINX = '行位置：'+Cell.parentNode.rowIndex;//Cellの親ノード'tr'の行位置
    var cellINX = 'セル位置：'+Cell.cellIndex;
    var cellVal = 'セルの内容：'+Cell.innerHTML;
    alert(rowINX);
}

window.onload = function(){
    RefreshList();
}

document.getElementById('save').addEventListener('click', function(e) {
    //保存
    SaveNote();
});

document.getElementById('delete-all').addEventListener('click', function(e) {
    //ローカルストレージの消去
    window.localStorage.clear();
    RefreshList();
});

function RefreshList(){
    var elements = document.getElementById("notelist");
    for (var i = 0; i < elements.childNodes.length; i++) {
        elements.removeChild(elements.childNodes.item(i));
    }
    var notes = JSON.parse(window.localStorage.getItem("notes"));
    if (notes == null) return;
    notes.forEach(function(value){
        //子要素の作成及び親の設定
        var tr = document.createElement("tr");
        document.getElementById("notelist").appendChild(tr);

        //孫要素の作成
        var td_title = document.createElement("td");
        var td_date = document.createElement("td");
        td_title.id = "element";
        td_date.id = "element";

        //親の設定
        tr.appendChild(td_title);
        tr.appendChild(td_date);

        //内容のセット
        td_title.innerHTML = value.title;
        td_date.innerHTML = value.date;
    });
}

function SaveNote(){
    var notes = JSON.parse(window.localStorage.getItem("notes"));
    var addData = {
        title : document.getElementById("title").value,
        content : document.getElementById("content").value,
        date : new Date()
    }
    alert(addData.title);
    if (notes == null){
        notes = [];
    }
    notes.push(addData);
    window.localStorage.setItem("notes", JSON.stringify(notes));
    RefreshList();
}
