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

    input.addEventListener('keydown',keydownEvents);
}

function createInline(matchStr,replaceStr,code,element){//インライン--------------
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
}//-------------------------------------------------------------------------------

function createHeadingTag(commands,tags,elem){//見出し-----------------------------
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
}//------------------------------------------------------

function createListTag(commands,tags,elem){
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
}//---------------------------------------------------

function keydownEvents(e){
    tagSercher(e);
}

function tagSercher(e){
    switch(input.parentElement.tagName){
        case 'LI':
            console.log('li');
            break;
        default:
            normalEnter(e);
            break;
    }
}

function normalEnter(e){
    if(e.isComposing){
        return false;
    }
    if(e.key === 'Enter' && !e.shiftKey){
        console.log('enter');
    }
    if(e.key === 'Enter' && e.shiftKey){
        console.log('shiftEnter');
    }
}