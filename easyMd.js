const md = document.getElementById('markdown');
const printArea = document.getElementById('printArea');

const input = document.createElement('input');
const span = document.createElement('span');

tagSellector();

function tagSellector(){
    if(printArea.lastElementChild.tagName === 'P'){
        md.addEventListener('click',addInputArea,{once:true});
    }
    if(printArea.lastElementChild.tagName !== 'P'){
        headingCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === headingTags[index].toUpperCase() || printArea.lastElementChild.tagName === headingTags[index].toUpperCase()){
                addInputArea();
            }
        });
        listCommands.forEach(function(command,index){
            if(printArea.lastElementChild.tagName === listTags[index].toUpperCase() || printArea.lastElementChild.tagName === listTags[index].toUpperCase()){
                insertList();
            }
        });
    }
}

//通常処理
function addInputArea(){
    input.setAttribute('type','text');
    input.setAttribute('id','input');
    input.style.width = '0px';
    printArea.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
    input.addEventListener('input',tagChanger);//この後でしか分岐できない
}

function insertSpan(){
    md.appendChild(span);
    span.style.opacity = '0';
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

function tagChanger(){
    headingCommands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            const tag = document.createElement(headingTags[index]);
            printArea.lastElementChild.replaceWith(tag);
            input.value = '';
            tagSellector();
        }
    });
    listCommands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            const tag = document.createElement(listTags[index]);
            printArea.lastElementChild.replaceWith(tag);
            input.value = '';
            tagSellector();
        }
    });

    insertSpan();
}

function insertList(){
    console.log('list入れる準備OK');
}
