const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const previewArea = document.getElementById('previewArea');
const input = document.getElementById('input');

/*
E①ファイルに出力 -> ファイル名、テキスト

F①クリックの場所にpreviewを映す
F②別の場所をクリックした時にプリントアウトプレビューを移す
*/

markdown.addEventListener('click',()=>{
    input.focus();
});

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
    'h3',
    'h4',
    'h5',
];

const headings = [
    [ 'h1 ' , '# ' ],
    [ 'h2 ' , '## ' ],
    [ 'h3 ' , '### ' ],
    [ 'h4 ' , '#### ' ],
    [ 'h5 ' , '##### ' ],
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

function addText(){
    printArea.lastElementChild.insertAdjacentText('beforeend',previewArea.firstElementChild.innerHTML);
}

function nLine(){//shiftEnterの後
    if(printArea.childElementCount === 0){
        printArea.innerHTML = previewArea.innerHTML;
        previewArea.innerHTML = '<p></p>';
        input.value = '';
    }
    if(printArea.childElementCount > 0){
        printArea.lastElementChild.insertAdjacentHTML('beforeend','<br>' + previewArea.textContent);
        previewArea.innerHTML = '<p></p>';
        input.value = '';
        addText();
    }
    if(printArea.childElementCount === 2){
        printArea.lastElementChild.removeChild(printArea.lastElementChild.lastElementChild);
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
        if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){
            printText();
        }
    }

//shiftEnter
    if(previewArea.innerHTML.match(/^[\<p\>].*/) && e.shiftKey === true && e.key ==='Enter'){
        if(previewArea.firstElementChild.tagName === 'P'){
            if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){
                nLine();
            }
            if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){
                nLine();
            }
        }
    }

//backspace
    if(input.value === '' && printArea.innerHTML !== '' && e.key === 'Backspace'){
        if(printArea.lastElementChild.tagName === 'P'){
            previewArea.innerHTML = '<p></p>';
            input.value = printArea.lastElementChild.lastChild.textContent;
            printArea.lastElementChild.removeChild(printArea.lastElementChild.lastChild);
        }
        if(printArea.lastElementChild.tagName !== 'P'){
            const tag = printArea.lastElementChild.tagName.toLowerCase();
            previewArea.innerHTML = '<'+tag+'></'+tag+'>';
            input.value = printArea.lastElementChild.textContent;
            printArea.removeChild(printArea.lastElementChild);
        }
    }
}
