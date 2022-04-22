const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');


/* ------- 初期動作 -------- */
markdown.addEventListener('click',serchText,{
    once:true
});
input.addEventListener('input',widthExtender);//*常時発動

function serchText(){
    if(printArea.firstChild.textContent === ''){
        printArea.firstElementChild.insertAdjacentElement('beforeend',input);
        inputStyleChenger();
        input.focus();
        input.addEventListener('keydown',bOLMaker);//bOL = body of letter
    }
}

/*常時発動 */
function widthExtender(){
    markdown.appendChild(span);
    span.textContent = input.value;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
    span.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
    input.style.width = window.getComputedStyle(span).getPropertyValue('width');
}
/**/

function inputStyleChenger(){
    input.style.width = '6px';
    input.style.fontSize = window.getComputedStyle(input.parentElement).getPropertyValue('font-size');
    input.style.fontWeight = window.getComputedStyle(input.parentElement).getPropertyValue('font-weight');
}
/*---------- 初期動作終わり -----------*/

/* --------------　メインコントロール ----------------- */
function bOLMaker(e){
    if(e.isComposing){
        return false;
    }
    if(e.key === 'Enter'){
        input.removeEventListener('keydown',bOLMaker);//e.ley === Enterの重なり防止
        printText();
    }
}

function printText(){
    input.replaceWith(input.value);
    input.value = '';
    document.getElementById('this').insertAdjacentElement('beforeend',input);
    inputStyleChenger();
    input.focus();
    input.addEventListener('keydown',nextAction);
}

function nextAction(e){
    if(e.isComposing){
        return false;
    }
    if(e.key ==='Enter'){
        if(input.value === ''){
            createContents();
        }
        if(input.value !== ''){
            printText();
        }
    }
}

function createContents(){
    printArea.insertAdjacentHTML('beforeend','<p>');
    printArea.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
    inputStyleChenger();
    document.getElementById('this').removeAttribute('id','this');
    input.parentElement.setAttribute('id','this');
}