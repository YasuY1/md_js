const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');

let inputCount;

input.style.width = '6px';

/* ------- 初期動作 -------- */
markdown.addEventListener('click',serchText);
// input.addEventListener('input',widthExtender);

function serchText(){
    if(printArea.firstChild.textContent === ''){
        printArea.firstElementChild.insertAdjacentElement('beforeend',input);
        input.style.fontSize = window.getComputedStyle(input.parentElement).getPropertyValue('font-size');
        input.style.fontWeight = window.getComputedStyle(input.parentElement).getPropertyValue('font-weight');
        input.focus();
        input.addEventListener('input',widthExtender);
        input.addEventListener('keydown',bOLMaker);//bOL = body of letter
    }
}

function widthExtender(){
    markdown.appendChild(span);
    span.textContent = input.value;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.fontSize = window.getComputedStyle(input).getPropertyValue('font-size');
    span.style.fontWeight = window.getComputedStyle(input).getPropertyValue('font-weight');
    input.style.width = window.getComputedStyle(span).getPropertyValue('width');
}
/*-----------------------------*/

/* --------------　本文作成動作 ----------------- */
function bOLMaker(e){
    if(e.key === 'Enter'){
        input.replaceWith(input.value);
        input.value = '';
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        input.focus();
    }
}