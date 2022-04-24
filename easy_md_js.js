const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');

/* ------- 基本動作 -------- */
markdown.addEventListener('click',serchText,{
    once:true
});

input.addEventListener('keydown',enterActions);
input.addEventListener('input',widthExtender);
input.addEventListener('input',tagChanger);
input.addEventListener('keydown',pressBackspace);
input.addEventListener('keydown',pressArrows);


function serchText(){
    if(printArea.firstChild.textContent === ''){
        printArea.firstElementChild.insertAdjacentElement('beforeend',input);
        inputStyleChanger();
        input.focus();
    }
}

function enterActions(e){
    if(e.isComposing){
        return false;
    }
    if(e.shiftKey && e.key === 'Enter'){
        switch(input.parentElement.tagName){
            case 'LI':
                exitList();
                break;
            case 'P':
                indention();
                break;
            default:
                break;
        }
    }
    if(!e.shiftKey && e.key === 'Enter'){
        switch(input.parentElement.tagName){
            case 'LI':
                toNextList();
                toNextSibling();
                break;
            case 'P':
                exitP();
                noIndention();
                break;
            default:
                toNextLine();
                toNextSibling();
                break;
        }
    }
}

///////////////////////////////////////////////

function widthExtender(){
    markdown.appendChild(span);
    span.textContent = input.value;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
    span.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
    input.style.width = window.getComputedStyle(span).getPropertyValue('width');
}

function inputStyleChanger(){//-補助関数
    input.style.width = '6px';
    input.style.fontSize = window.getComputedStyle(input.parentElement).getPropertyValue('font-size');
    input.style.fontWeight = window.getComputedStyle(input.parentElement).getPropertyValue('font-weight');
}
//////////////////////////////////////////////

function toNextLine(){
    if(!input.value){
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        document.getElementById('this').removeAttribute('id','this');
        input.parentElement.setAttribute('id','this');
        input.value = '';
        input.focus();
        inputStyleChanger();
    }
}

function toNextSibling(){
    if(input.value){
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
        input.style.width = '6px';
        if(input.previousSibling.previousSibling){
            input.previousSibling.textContent = input.previousSibling.previousSibling.textContent + input.previousSibling.textContent;
            input.previousSibling.previousSibling.remove();
        }
    }
}

function indention(){
    if(!input.value){
        document.getElementById('this').insertAdjacentHTML('beforeend','<br>');
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.focus();
    }
}

let inlineTag;

function noIndention(){
    if(input.value){
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
        input.style.width = '6px';
        if(input.previousElementSibling && input.previousElementSibling.tagName !== 'BR'){
            inlineTag = input.previousElementSibling;
            if(inlineTag.nextSibling.nextSibling){
                inlineTag.nextSibling.textContent = inlineTag.nextSibling.textContent + inlineTag.nextSibling.nextSibling.textContent;
                inlineTag.nextSibling.nextSibling.remove();
                inlineTag.parentElement.insertAdjacentElement('beforeend',input);
                input.focus();
            }
            if(inlineTag.previousSibling.previousSiblingg && input.previousElementSibling.tagName !== 'BR'){
                inlineTag.previousSibling.textContent = inlineTag.previousSibling.previousSibling.textContent + inlineTag.previousSibling.textContent;
                inlineTag.previousSibling.previousSibling.remove();
                inlineTag.parentElement.insertAdjacentElement('beforeend',input);
                input.focus();
            }
            if(inlineTag){
                return false;
            }
        }
        if(input.previousSibling.previousSibling && input.previousSibling.previousSibling.tagName !== 'BR'){
            input.previousSibling.textContent = input.previousSibling.previousSibling.textContent + input.previousSibling.textContent;
            input.previousSibling.previousSibling.remove();
        }
    }
}

function exitP(){
    if(!input.value){
        if(input.previousSibling.tagName === 'BR'){
            input.previousElementSibling.remove();
        }
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        document.getElementById('this').removeAttribute('id','this');
        printArea.lastElementChild.setAttribute('id','this');
        input.focus();
    }
}

function toNextList(){
    if(!input.value){
        input.parentElement.insertAdjacentHTML('beforeend','<li>');
        input.parentElement.lastElementChild.insertAdjacentElement('beforeend',input);
        document.getElementById('this').removeAttribute('id','this');
        input.parentElement.setAttribute('id','this');
        input.value = '';
        input.focus();
        inputStyleChanger();
    }
}

function exitList(){
    if(!input.value){
        if(input.parentElement.textContent === ''){
            input.parentElement.remove();
        }
        printArea.insertAdjacentHTML('beforeend','<p>');
        printArea.lastElementChild.insertAdjacentElement('beforeend',input);
        if(document.getElementById('this')){
            document.getElementById('this').removeAttribute('id','this');
        }
        printArea.lastElementChild.setAttribute('id','this');
        input.focus();
    }
}



function tagChanger(){
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

    input.addEventListener('keydown',enterActions);
}

function createInline(matchStr,replaceStr,code,element){//インライン-----
    if(input.value.match(matchStr)){
        const inline = input.value.replace(replaceStr,code).replace(replaceStr,'');
        if(element.parentNode.innerHTML === ''){
            element.parentNode.innerHTML = '';
        }
        document.getElementById('this').insertAdjacentHTML('beforeend',inline);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        inputStyleChanger();
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
            inputStyleChanger();
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
            inputStyleChanger();
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
        inputStyleChanger();
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
        inputStyleChanger();
        input.value = '';
        input.focus();
    }
}//-----

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
            inputStyleChanger();
        }
    }
    if(e.key === 'Backspace' && input.value === '' && !this.previousSibling && this.parentElement.previousSibling){
        this.parentElement.previousSibling.insertAdjacentElement('beforeend',input);
        input.focus();
        this.parentElement.nextSibling.remove();
        this.parentElement.setAttribute('id','this');
        inputStyleChanger();
    }
}//---

function pressArrows(e){
    switch(e.key){
        case 'ArrowUp':
            if(!this.parentElement.previousElementSibling){
                return false;
            }
            if(this.parentElement.previousElementSibling.tagName === 'UL' && this.parentElement.previousElementSibling.tagName === 'OL'){
                console.log(this.parentElement.parentElement);
            }
            // const beforeElement = this.parentElement.previousSibling;
            // let textLength = this.previousSibling.textContent.length
            // if(!beforeElement){
            //     return false;
            // }
            // if(textLength > beforeElement.textContent.length){
            //     textLength = beforeElement.textContent.length;
            // }
            // const afterText = beforeElement.textContent.slice(textLength,beforeElement.textContent.length);
            // beforeElement.textContent = beforeElement.textContent.slice(0,textLength);
            // beforeElement.insertAdjacentElement('beforeend',input);
            // this.parentElement.insertAdjacentText('beforeend',afterText);
            // input.focus();
            break;
        case 'ArrowDown':
            break;
        case 'ArrowLeft':
            if(this.previousElementSibling && this.previousSibling.textContent === '' && this.previousSibling.tagName !== 'BR'){
                this.previousElementSibling.insertAdjacentElement('beforeend',input);
                input.focus();
            }
            if(this.previousSibling.textContent === ''){
                if(this.parentElement.tagName === 'EM' || this.parentElement.tagName === 'STRONG' || this.parentElement.tagName === 'DEL' || this.parentElement.tagName === 'CODE'){
                    this.parentElement.insertAdjacentElement('beforebegin',input);
                    input.focus();
                }
            }
            this.insertAdjacentText('afterend',this.previousSibling.textContent.slice(-1,this.previousSibling.textContent.length));
            this.previousSibling.textContent = this.previousSibling.textContent.slice(0,-1);
            if(this.nextSibling.nextSibling && !this.nextElementSibling && !this.nextSibling.nextElementSibling){
                this.nextSibling.textContent = this.nextSibling.textContent + this.nextSibling.nextSibling.textContent;
                this.nextSibling.nextSibling.remove();
            }
            if(this.previousSibling.textContent === '' && this.previousElementSibling && this.previousElementSibling.tagName === 'BR'){
                this.previousElementSibling.insertAdjacentElement('beforebegin',input);
                input.focus();
            }
            break;
        case 'ArrowRight':
            // if(this.nextElementSibling && this.nextSibling.textContent === ''){
            //     this.nextElementSibling.insertAdjacentElement('afterbegin',input);
            //     input.focus();
            // }
            // if(this.nextSibling.textContent === ''){
            //     if(this.parentElement.tagName === 'EM' || this.parentElement.tagName === 'STRONG' || this.parentElement.tagName === 'DEL' || this.parentElement.tagName === 'CODE'){
            //         this.parentElement.insertAdjacentElement('afterend',input);
            //         input.focus();
            //     }
            // }
            this.insertAdjacentText('beforebegin',this.nextSibling.textContent.slice(0,1));
            this.nextSibling.textContent = this.nextSibling.textContent.slice(1,this.nextSibling.textContent.length);
            // if(this.previousSibling.previousSibling && !this.previousElementSibling && !this.previousSibling.previousElementSibling){
            //     this.previousSibling.textContent = this.previousSibling.previousSibling.textContent + this.previousSibling.textContent;
            //     this.previousSibling.previousSibling.remove();
            // }
            // input.focus();
            break;
    }
}

function listArrowUp(){
    input.parentElement.previousElementSibling.lastElementChild.insertAdjacentElement('beforeend',input);
    input.focus();
}