const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const previewArea = document.getElementById('previewArea');
const input = document.getElementById('input');
/*
A①クリックでinputAreaにfocus、文字入力を可能にする ||| 完了
A②sbかmbを判定　->　sbでA③mbでA④ |||　完了
A③コマンド入力の有無　->　有）B①|||||||||||　無）A④　||| 完了？

A④文字入力 -> 改行なし -> B② 改行あり -> A⑤
A⑤枠内改行処理<br>
A⑥枠内BS処理 || 文字がなくなる -> END 文字が残る -> B②

B①文字入力
B②プリントアウト

------BS処理--------

C①<p>タグかその他か -> その他->C② 　<p>->D①
C②プリントエリアの最後のタグをプレビューに戻すinputvalueにタグの中身を挿入
C③プリントエリアの最後のエレメント消す
C④プレビューに残ったエレメントを消す　|| END

D①仮想エリアにプリントエリアの最後のエレメントを全てコピー
D②プリントエリアの最後のエレメントの最後のテキストを消す
D③プレビューに<p>タグ
D④仮想エリアの最後子要素をinputareaに挿入

E①ファイルに出力 -> ファイル名、テキスト

F①クリックの場所にpreviewを映す
F②別の場所をクリックした時にプリントアウトプレビューを移す
*/

markdown.addEventListener('click',()=>{
    input.focus();
});//A①OK

input.addEventListener('input',determineStringType);
input.addEventListener('keydown',keydownEvents);

function determineStringType(e){
    if(!input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){//シングルバイト
        tagChenger();
    }
    if(input.value.match(/[^\x01-\x7E]/)){//マルチバイト
        insertText();
    }
}

const headingTags = [
    'h1',
    'h2',
];

const headings = [
    [ 'h1 ' , '* ' ],
    [ 'h2 ' , '** ' ],
];

function tagChenger(){
    headings.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            previewArea.innerHTML = '<'+headingTags[index]+'></'+headingTags[index]+'>';
            input.value = '';
        }
    });
    insertText();
}

function insertText(){
    previewArea.firstElementChild.textContent = input.value;
}


function printText(){
    printArea.insertAdjacentHTML('beforeend',previewArea.innerHTML);
    previewArea.firstElementChild.textContent = '';
    input.value = '';
}


function keydownEvents(e){
    if(previewArea.firstElementChild.textContent !== '' && e.shiftKey === false && e.key ==='Enter'){
        if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){
            printText();
        }
        if(!input.value.match(/[^\x01-\x7E]/)){
            printText();
        }
    }//Enter
    if(previewArea.firstElementChild.textContent !== '' && e.shiftKey === true && e.key ==='Enter'){
        newLine();//shiftEnter
    }
}

function addText(){
    printArea.lastElementChild.lastChild.textContent = input.value;
}

function newLine(){
    printArea.insertAdjacentHTML('beforeend','<p></p>');
    printArea.lastElementChild.innerHTML = previewArea.textContent + '<br>';
    printArea.lastElementChild.insertAdjacentText('beforeend','');
    input.value = '';
    addText();
}