const md = document.getElementById('markdown');
const printArea = document.getElementById('printArea');

const input = document.createElement('input');
const span = document.createElement('span');

tagSellector();

function tagSellector(){
    //Pタグ内
    if(printArea.lastElementChild.tagName === 'P'){
        md.addEventListener('click',addInputArea,{once:true});
    }
    //Pタグ以外
    if(printArea.lastElementChild.tagName !== 'P'){
        headingCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === headingTags[index].toUpperCase() || printArea.lastElementChild.tagName === headingTags[index].toUpperCase()){
                addInputArea();
            }
        });//見出しタグ
        listCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === listTags[index].toUpperCase() || printArea.lastElementChild.tagName === listTags[index].toUpperCase()){
                insertList();
            }
        });//リストタグ
        underLineCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === underLineTags[index].toUpperCase() || printArea.lastElementChild.tagName === underLineTags[index].toUpperCase()){
                printArea.insertAdjacentHTML('beforeend','<p></p>');
                addInputArea();
            }
        });//下線
        blockQuoteCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === blockQuoteTags[index].toUpperCase() || printArea.lastElementChild.tagName === blockQuoteTags[index].toUpperCase()){
                addInputArea();
            }
        });//blockquote
    }
}

//共通処理
function inputPropertyResetter(){
    input.setAttribute('type','text');
    input.setAttribute('id','input');
    input.style.width = '0px';
}

//通常処理
function addInputArea(){
    inputPropertyResetter();
    printArea.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
    input.addEventListener('input',tagChanger);//この後でしか分岐できない
}

function insertSpan(){
    md.appendChild(span);
    span.style.opacity = '0';
    span.setAttribute('id','trashBox');
    input.addEventListener('input',widthExtender);
}

function widthExtender(){
    span.textContent = input.value;//一時的にspanからwidthを拾う
    const styleWidth = Math.ceil(span.getBoundingClientRect().width);
    input.style.width = styleWidth + 'px';
    CompletionProcessing();
}

function CompletionProcessing(){
    input.addEventListener('input',composingFilter);
}

function composingFilter(e){
    if(input.value.match(/[\x01-\x7E]/) && !e.isComposing){
        input.addEventListener('keydown',normalEnter);
    }
    if(input.value.match(/[^\x01-\x7E]/) && e.isComposing){
        input.addEventListener('compositionend',()=>{
            input.addEventListener('keypress',normalEnter,{once:true});
        });
    }
}

function normalEnter(e){
    if(e.key === 'Enter' && !e.shiftKey){
        printArea.lastElementChild.insertAdjacentText('beforeend',input.value);
        printArea.lastElementChild.removeChild(input);
        printArea.insertAdjacentHTML('beforeend','<p></p>');
        input.value = '';
        addInputArea();
    }
    if(e.key === 'Enter' && e.shiftKey){
        printArea.lastElementChild.insertAdjacentText('beforeend',input.value);
        printArea.lastElementChild.insertAdjacentHTML('beforeend','<br>');
        printArea.lastElementChild.removeChild(input);
        printArea.lastElementChild.insertAdjacentText('beforeend','');
        input.value = '';
        addInputArea();
    }
}
//通常処理END


//タグチェンジャー
function tagChanger(){
    //見出しタグ
    createTagElements(headingCommands,headingTags);
    //リストタグ
    createTagElements(listCommands,listTags);
    //下線
    createTagElements(underLineCommands,underLineTags);
    //blockquote
    createTagElements(blockQuoteCommands,blockQuoteTags);
    //インラインコマンド
    inlineTagElements(inlineCommands,inlineCodes);
    //アスタリスク処理
    if(input.value.match(/.*(\*{1})/)){
        const i = input.value;
        const after = i.substr(i.indexOf('*') + 1);
        if(after.slice(0,1) === '*'){
            inlineTagElements(commandDouble,codeDouble);
        }
        if(after.slice(0,1) !== '*'){
            inlineTagElements(commandSingle,codeSingle);
        }
    }

    insertSpan();
}

function insertList(){
    printArea.lastElementChild.insertAdjacentHTML('beforeend','<li></li>');
    inuputAreaPutInList();
}

function inuputAreaPutInList(){
    inputPropertyResetter();
    printArea.lastElementChild.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
    input.addEventListener('keydown',listEnter);
}

function listEnter(e){
    if(e.key === 'Enter' && !e.shiftKey){
        input.removeEventListener('keydown',normalEnter);
        printArea.lastElementChild.lastElementChild.innerHTML = input.value;
        input.value = '';
        insertList();
    }
    if(e.key === 'Enter' && e.shiftKey){
        printArea.lastElementChild.removeChild(printArea.lastElementChild.lastElementChild);
        printArea.insertAdjacentHTML('beforeend','<p></p>');
        input.removeEventListener('keydown',listEnter);
        addInputArea();
    }
}

function createTagElements(commands,tags){//タグチェンジャーの関数
    commands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            const tag = document.createElement(tags[index]);
            printArea.lastElementChild.replaceWith(tag);
            input.value = '';
            tagSellector();
        }
        for(let i=0; i<2; i++){
            if(input.value === '\\' + command[i]){
                input.value = command[i];
                tagSellector();
            }
        }
    });
}

function inlineTagElements(commands,codes){
    commands.forEach(function(item,index){
        if(printArea.lastElementChild.tagName === 'P' && input.value.match(item[0])){
            const parentElement = printArea.lastElementChild;
            parentElement.innerHTML = input.value.replace(item[1],'<'+codes[index]+'>');
            input.value='';
            parentElement.insertAdjacentElement('beforeend',input);
            input.focus();
            parentElement.lastElementChild.previousElementSibling.textContent = parentElement.lastElementChild.previousElementSibling.textContent.replace(item[1],null);
        }
    });
}

//クリック動作
printArea.addEventListener('click',(e)=>{
    const coodinate = document.elementFromPoint(e.pageX,e.pageY);
    if(coodinate.tagName !== 'INPUT'){
    }
});
//BS動作
input.addEventListener('keydown',(e)=>{
    if(e.key === 'Backspace'){
        console.log('OK');
    }
});