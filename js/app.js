var editingIndex = -1;

window.onload = function() {
    RefreshList();
}

document.getElementById('save').addEventListener('click', function(e) {
    //保存
    e.preventDefault();
    SaveNote();
});

document.getElementById('new').addEventListener('click', function(e) {
    //新規作成
    e.preventDefault();
    NewNote();
});

document.getElementById('adjust').addEventListener('click', function(e) {
    //上付き文字の変換
    e.preventDefault();
    Adjust();
});

document.getElementById('delete').addEventListener('click', function(e) {
    //開いているファイルの削除
    e.preventDefault();
    DeleteNote();
});

document.getElementById('delete-all').addEventListener('click', function(e) {
    //ローカルストレージの全消去
    e.preventDefault();
    window.localStorage.clear();
    RefreshList();
});

function RefreshList () {
    //既に表示されている分は消す
    var elements = document.getElementById("notelist");
    elements.innerHTML = "";

    //LocalStorageからリストを読みこむ
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
        td_title.setAttribute("onclick", "OpenNote(this.parentNode.rowIndex - 1)");
        td_date.setAttribute("onclick", "OpenNote(this.parentNode.rowIndex - 1)");

        //親の設定
        tr.appendChild(td_title);
        tr.appendChild(td_date);

        //内容のセット
        td_title.innerHTML = value.title;
        td_date.innerHTML = value.date;
    });
}

function Adjust (){
    var content = document.getElementById("content").value;
    content = content.replace(/\^/g,"x").replace("~","x")
    .replace(/cx/g,"ĉ").replace(/Cx/g,"Ĉ")
    .replace(/gx/g,"ĝ").replace(/Gx/g,"Ĝ")
    .replace(/hx/g,"ĥ").replace(/Hx/g,"Ĥ")
    .replace(/jx/g,"ĵ").replace(/Jx/g,"Ĵ")
    .replace(/sx/g,"ŝ").replace(/Sx/g,"Ŝ")
    .replace(/Ux/g,"Ŭ");
    document.getElementById("content").value = content;
}

function NewNote () {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    editingIndex = -1;
}

function DeleteNote (){

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    if (editingIndex < 0) return;

    var notes = JSON.parse(window.localStorage.getItem("notes"));
    var newNotes = notes.filter(function(item, index){
        if (item.seed != notes[editingIndex].seed) return true;
    });
    notes = newNotes;

    editingIndex = -1;
    window.localStorage.setItem("notes", JSON.stringify(notes));
    RefreshList();
}

function SaveNote () {
    var notes = JSON.parse(window.localStorage.getItem("notes"));

    //上付き文字の変換
    Adjust();

    //保存データの準備
    var addData = {
        title : ((document.getElementById("title").value == "") ? "Neniu Titolo" : document.getElementById("title").value),
        content : document.getElementById("content").value,
        date : FormatDate(new Date(), "YYYY-MM-DD hh:mm"),
        seed : Seed(20)
    }

    //1つ目のノートだったら空配列を準備
    if (notes == null){
        notes = [];
    }

    if (editingIndex >= 0){
        var newNotes = notes.filter(function(item, index){
            if (item.seed != notes[editingIndex].seed) return true;
        });
        notes = newNotes;
    }

    //データの保存
    notes.push(addData);
    window.localStorage.setItem("notes", JSON.stringify(notes));
    RefreshList();

    editingIndex =  notes.length - 1;
}

function OpenNote (index) {
    //指定ノートの読み込み
    var notes = JSON.parse(window.localStorage.getItem("notes"));
    var title = notes[index].title;
    var content = notes[index].content;

    //開く
    document.getElementById("title").value = title;
    document.getElementById("content").value = content;

    //フラグ立てる
    editingIndex = index;
}

var FormatDate = function (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};

var Seed = function (length){
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    var r = "";
    for(var i=0; i<length; i++){
        r += characters[Math.floor(Math.random() * characters.length)];
    }
    return r;
}
