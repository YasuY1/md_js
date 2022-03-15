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
    if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){//シングルバイト
        tagChenger();
    }
    if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === true){//マルチバイト
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

function tagChenger(e){
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

function addText(){
    printArea.lastElementChild.insertAdjacentText('beforeend',previewArea.firstElementChild.innerHTML);
}

function nLine(){//shiftEnterの後
    if(printArea.childElementCount === 0){
        printArea.insertAdjacentHTML('beforeend','<p></p>');
    }
    if(printArea.lastElementChild.tagName !== 'P'){
        printArea.insertAdjacentHTML('beforeend','<p></p>');
    }
    if(printArea.childElementCount > 1){
        printArea.lastElementChild.insertAdjacentHTML('beforeend','<br>' + previewArea.textContent);
        previewArea.innerHTML = '<p></p>';//previewの初期化
        input.value = '';//inputの初期化
        addText();
    }
}

function printText(){
    printArea.insertAdjacentHTML('beforeend',previewArea.innerHTML);
    previewArea.firstElementChild.textContent = '';
    input.value = '';
    previewArea.innerHTML = '<p></p>';
}


function keydownEvents(e){
//Enter
    if(previewArea.firstElementChild.textContent !== '' && e.shiftKey === false && e.key ==='Enter'){
        if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){
            printText();
        }
        if(input.value.match(/[\x01-\x7E]/)){
            printText();
        }
    }

//shiftEnter
    if(previewArea.firstElementChild.textContent !== '' && previewArea.innerHTML.match(/^[\<p\>].*/) &&e.shiftKey === true && e.key ==='Enter'){
        if(previewArea.firstElementChild.tagName === 'P'){
            if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){
                nLine();
            }
            if(input.value.match(/[\x01-\x7E]/)){
                nLine();
            }
        }
    }

//backspace
    if(input.value === '' && printArea.innerHTML !== '' && e.key === 'Backspace'){
        if(printArea.lastElementChild.tagName === 'P'){
            console.log('P');
        }
        if(printArea.lastElementChild.tagName !== 'P'){
            const tag = printArea.lastElementChild.tagName.toLowerCase();
            previewArea.innerHTML = '<'+tag+'></'+tag+'>';
            input.value = printArea.lastElementChild.textContent;
            printArea.removeChild(printArea.lastElementChild);
        }
    }
}
