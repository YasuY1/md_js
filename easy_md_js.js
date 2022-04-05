const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');

const printElement0 = printArea.firstElementChild;
const elem0Fsize = window.getComputedStyle(printElement0).getPropertyValue('font-size');
const elem0Fweight = window.getComputedStyle(printElement0).getPropertyValue('font-weight');

//メインコントロール
markdown.addEventListener('click',searchText);
input.addEventListener('input',widthExtender);

function searchText(){
    if(printArea.childElementCount === 1 && printElement0.textContent === ''){
        printElement0.insertAdjacentElement('beforeend',input);
        input.style.width = '6px';
        input.style.fontSize = elem0Fsize;
        input.style.fontWeight = elem0Fweight;
        input.focus();
        span.style.opacity = '0';
        markdown.appendChild(span);
    }
    //テキストが入っている場合の処理を挿入
}

function widthExtender(){
    span.textContent = input.value;
    const spanWidth = span.getBoundingClientRect().width;
    input.style.width = spanWidth + 'px';
}
