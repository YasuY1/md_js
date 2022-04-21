const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');


/* ------- 初期動作 -------- */
markdown.addEventListener('click',serchText,{
    once:true
});
input.addEventListener('input',widthExtender);

function serchText(){
    if(printArea.firstChild.textContent === ''){
        printArea.firstElementChild.insertAdjacentElement('beforeend',input);
        inputStyleChenger();
        input.focus();
        input.addEventListener('keydown',bOLMaker);//bOL = body of letter
    }
}

function widthExtender(){
    markdown.appendChild(span);
    span.textContent = input.value;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
    span.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
    input.style.width = window.getComputedStyle(span).getPropertyValue('width');
}

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
        input.replaceWith(input.value);
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        input.value = '';
        inputStyleChenger();
        input.focus();
        input.removeEventListener('keydown',bOLMaker);//e.ley === Enterの重なり防止
        input.addEventListener('input',tagChenger);
        input.addEventListener('keydown',pressBackspace);
    }
}

function tagChenger(){
    this.parentNode.setAttribute('id','this');
    //インラインコマンド
    if(!input.value.match(/.*(\*{3})/) && !input.value.match(/.*(\*{2})/)){
        createInline(/.*(\*{1}).+(\*{1})/,/(\*{1})/,'<em>',this);
    }
    if(!input.value.match(/.*(\*{3})/)){
        createInline(/.*(\*{2}).+(\*{2})/,/(\*{2})/,'<strong>',this);
    }
    if(input.value.match(/.*(\~{2}).+(\~{2})/)){
        createInline(/.*(\~{2}).+(\~{2})/,/(\~{2})/,'<del>',this);
    }
    if(input.value.match(/.*(\`).+(\`)/)){
        createInline(/.*(\`).+(\`)/,/(\`)/,'<code>',this);
    }
    //見出しタグ
    createHeadingTag(headingCommands,headingTags,this);
    //リストタグ
    createListTag(listCommands,listTags,this);
    //引用
    createBlockQuate(this);
    //水平線
    createHr(this);

    input.addEventListener('keydown',keydownEvents);
}

function createInline(matchStr,replaceStr,code,element){//インライン-----
    if(input.value.match(matchStr)){
        const inline = input.value.replace(replaceStr,code).replace(replaceStr,'');
        if(element.parentNode.innerHTML === ''){
            element.parentNode.innerHTML = '';
        }
        document.getElementById('this').insertAdjacentHTML('beforeend',inline);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
    }
}//------

function createHeadingTag(commands,tags,elem){//見出し---------
    commands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            const tag = document.createElement(tags[index]);
            elem.parentNode.replaceWith(tag);
            tag.textContent = '';
            tag.insertAdjacentElement('beforeend',input);
            input.value = '';
            input.focus();
        }
    });
}//----------

function createListTag(commands,tags,elem){//リストタグ------
    commands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            const tag = document.createElement(tags[index]);
            elem.parentNode.replaceWith(tag);
            tag.innerHTML = '<li>';
            tag.lastElementChild.textContent = '';
            tag.lastElementChild.setAttribute('id','this');
            tag.lastElementChild.insertAdjacentElement('beforeend',input);
            input.value = '';
            input.focus();
        }
    });
}//---------

function createBlockQuate(elem){//引用タグ------
    if(input.value === '> '){
        const tag = document.createElement('blockquote');
        elem.parentNode.replaceWith(tag);
        tag.innerHTML = '<p>';
        tag.lastElementChild.textContent = '';
        tag.lastElementChild.setAttribute('id','this');
        tag.lastElementChild.insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
    }
}//---------

function createHr(elem){//水平線-----
    if(input.value === '*** '){
        const tag = document.createElement('hr');
        elem.parentNode.replaceWith(tag);
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
    }
}//-----

function keydownEvents(e){
    tagSercher(e);
}

function tagSercher(e){
    switch(input.parentElement.tagName){
        case 'LI':
            listEnter(e);
            break;
        case 'P':
            normalEnter(e);
            break;
        default:
            headEnter(e);
            break;
    }
}

//------Enters
function normalEnter(e){
    headEnter(e);

    if(e.key === 'Enter' && e.shiftKey && input.value === ''){
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentHTML('beforeend','<br>');
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.style.width = '6px';
        input.focus();
    }
}

function headEnter(e){
    if(e.isComposing){
        return false;
    }
    if(e.key === 'Enter' && !e.shiftKey && input.value === ''){
        printArea.insertAdjacentHTML('beforeend','<p>');
        document.getElementById('this').removeChild(input);
        document.getElementById('this').removeAttribute('id','this');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        printArea.lastElementChild.setAttribute('id','this');
        input.focus();
    }
    if(e.key === 'Enter' && !e.shiftKey && input.value !== ''){
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.style.width = '6px';
        input.focus();
    }
}

function listEnter(e){
    if(e.isComposing){
        return false;
    }
    if(e.key === 'Enter' && !e.shiftKey && input.value !== ''){
        input.replaceWith(input.value);
        input.value = '';
        input.style.width = '6px';
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.focus();
    }
    if(e.key === 'Enter' && !e.shiftKey && input.value === ''){
        document.getElementById('this').parentElement.insertAdjacentHTML('beforeend','<li>');
        document.getElementById('this').parentElement.lastElementChild.insertAdjacentElement('beforeend',input);
        document.getElementById('this').removeAttribute('id','this');
        input.parentElement.setAttribute('id','this');
        input.focus();
    }
    if(e.key === 'Enter' && e.shiftKey && input.value === ''){
        document.getElementById('this').parentElement.removeChild(document.getElementById('this'));
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        printArea.lastElementChild.setAttribute('id','this');
        input.focus();
    }
}
//---

function pressBackspace(e){
    if(e.key === 'Backspace' && input.value === '' && this.previousSibling){
        this.previousSibling.textContent = this.previousSibling.textContent.slice(0,-1);
        if(this.previousSibling.textContent === ''){
            this.parentElement.removeChild(this.previousSibling);
        }
        if(this.previousSibling === null && this.parentElement.tagName === 'LI' && this.parentElement.parentElement.childElementCount === 1){
            this.parentElement.parentElement.previousSibling.insertAdjacentElement('beforeend',input);
            input.focus();
            this.parentElement.nextSibling.remove();
            this.parentElement.setAttribute('id','this');
            inputStyleChenger();
        }
    }
    if(e.key === 'Backspace' && input.value === '' && !this.previousSibling && this.parentElement.previousSibling){
        this.parentElement.previousSibling.insertAdjacentElement('beforeend',input);
        input.focus();
        this.parentElement.nextSibling.remove();
        this.parentElement.setAttribute('id','this');
        inputStyleChenger();
    }
}