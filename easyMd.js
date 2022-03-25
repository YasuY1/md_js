const md = document.getElementById('markdown');
const printArea = document.getElementById('printArea');

const input = document.createElement('input');
const span = document.createElement('span');

if(printArea.lastElementChild.tagName === 'P'){
    md.addEventListener('click',addInputArea,{once:true});
}
if(printArea.lastElementChild.tagName !== 'P'){
    console.log('Pじゃないよ');
}

function addInputArea(){
    input.setAttribute('type','text');
    input.setAttribute('id','input');
    input.style.width = '0px';
    printArea.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
    input.addEventListener('input',insertSpan);
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
    input.addEventListener('keydown',normalEnter);
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