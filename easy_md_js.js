const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');

let i = 0;

const printElement0 = printArea.firstElementChild;
const elem0Fsize = window.getComputedStyle(printElement0).getPropertyValue('font-size');
const elem0Fweight = window.getComputedStyle(printElement0).getPropertyValue('font-weight');

//(メインコントロール--------------------------------------
markdown.addEventListener('click',searchText);
input.addEventListener('input',widthExtender);//常時起動
//-----------------------------------------------------

function searchText(e){
    if(printArea.childElementCount === 1 && printElement0.textContent === ''){
        printElement0.insertAdjacentElement('beforeend',input);
        input.style.width = '6px';
        input.focus();
        input.style.fontSize = window.getComputedStyle(printElement0).getPropertyValue('font-size');
        input.style.fontWeight = window.getComputedStyle(printElement0).getPropertyValue('font-weight');
        span.style.opacity = '0';
        markdown.appendChild(span);
        input.addEventListener('input',tagChanger);
    }
    if(printArea.childElementCount >= 1){
        const coodinateX = document.elementFromPoint(e.pageX,e.pageY);//取得要素(座標X,座標Y)
        const thisFSize = window.getComputedStyle(coodinateX).getPropertyValue('font-size').replace('px','');
        const thisLineHeight = thisFSize * 1.2;//line-heightがnormalの時のみ
        const thisWidth = coodinateX.getBoundingClientRect().width;
        const thisHeight = coodinateX.getBoundingClientRect().height;
        const strCount = Math.ceil(e.pageX / thisFSize);

        console.log('要素：' + coodinateX.tagName);
        console.log('座標X：' + e.pageX);
        console.log('座標Y：' + e.pageY);
        console.log('フォントサイズ：' + thisFSize);
        console.log('座標までの文字数：' + strCount);//sbとmbに分けないとsbで座標が半分になる
        console.log('文字の高さ：' + thisHeight);
        console.log('要素のline-height：' + thisLineHeight);
        console.log('行数：' + Math.floor(thisHeight / thisLineHeight));
        console.log('最大横文字数：' + Math.floor(thisWidth / thisFSize));


    }
    //<-テキストが入っている場合の処理を挿入
}

function widthExtender(){
    i++;
    if(i>3){
        i = 2;
    }
    if(i>1){
        const parent = document.getElementById('this');
        const fSize = window.getComputedStyle(parent).getPropertyValue('font-size');
        span.style.fontSize = fSize;
    }
    span.textContent = input.value;
    const spanWidth = span.getBoundingClientRect().width;
    input.style.width = spanWidth + 'px';
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
    //見出しタグチェンジ
    createHeadingTag(headingCommands,headingTags,this);
    //リストタグチェンジ
    createListTag(listCommands,listTags,this);

    input.addEventListener('keydown',pressEnter);
}

function createInline(matchStr,replaceStr,code,element){
    if(input.value.match(matchStr)){
        const inline = input.value.replace(replaceStr,code).replace(replaceStr,'');
        if(element.parentNode.innerHTML === ''){
            element.parentNode.innerHTML = '';
        }
        document.getElementById('this').insertAdjacentHTML('beforeend',inline);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.style.width = '6px';
        input.focus();
    }
}

function pressEnter(e){
    if(e.isComposing){
        return false;
    }
    if(this.parentElement.tagName === 'P'){
        if(input.value === ''){
            if(e.key === 'Enter' && !e.shiftKey && this.parentNode.tagName !== 'LI'){
                printArea.insertAdjacentHTML('beforeend','<p>');
                this.parentNode.removeAttribute('id','this');
                this.parentNode.nextElementSibling.textContent = '';
                this.parentNode.nextElementSibling.setAttribute('id','this');
                input.replaceWith(input.value);
                document.getElementById('this').insertAdjacentElement('beforeend',input);
                input.style.width = '6px';
                input.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
                input.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
                input.value = '';
                input.focus();
            }
            if(e.key === 'Enter' && e.shiftKey && this.parentNode.previousElementSibling.tagName !== 'UL' && this.parentNode.previousElementSibling.tagName !== 'OL'){
                input.replaceWith(input.value);
                document.getElementById('this').insertAdjacentHTML('beforeend','<br>');
                document.getElementById('this').insertAdjacentElement('beforeend',input);
                input.style.width = '6px';
                input.value = '';
                input.focus();
            }
        }
        if(input.value !== ''){
            if(e.key === 'Enter' && !e.shiftKey && this.parentNode.tagName !== 'LI'){
                input.replaceWith(input.value);
                document.getElementById('this').insertAdjacentElement('beforeend',input);
                input.style.width = '6px';
                input.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
                input.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
                input.value = '';
                input.focus();
            }
        }
    }
    if(this.parentElement.tagName !== 'P' && e.key === 'Enter' && !e.shiftKey && this.parentNode.tagName !== 'LI'){
        printArea.insertAdjacentHTML('beforeend','<p>');
        this.parentNode.removeAttribute('id','this');
        this.parentNode.nextElementSibling.textContent = '';
        this.parentNode.nextElementSibling.setAttribute('id','this');
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.style.width = '6px';
        input.style.fontSize = window.getComputedStyle(this.parentElement).getPropertyValue('font-size');
        input.style.fontWeight = window.getComputedStyle(this.parentElement).getPropertyValue('font-weight');
        input.value = '';
        input.focus();
    }
    // if(this.parentNode.tagName === 'P' && e.key === 'Enter' && e.shiftKey && this.parentNode.previousElementSibling.tagName !== 'UL' && this.parentNode.previousElementSibling.tagName !== 'OL'){
    //     input.replaceWith(input.value);
    //     document.getElementById('this').insertAdjacentHTML('beforeend','<br>');
    //     document.getElementById('this').insertAdjacentElement('beforeend',input);
    //     input.style.width = '6px';
    //     input.value = '';
    //     input.focus();
    // }
}

function createHeadingTag(commands,tags,elem){//----------------------------------------
    commands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            i = 0;
            const tag = document.createElement(tags[index]);
            elem.parentNode.replaceWith(tag);
            tag.textContent = '';
            tag.insertAdjacentElement('beforeend',input);
            input.style.width = '6px';
            input.style.fontSize = window.getComputedStyle(elem.parentElement).getPropertyValue('font-size');
            input.style.fontWeight = window.getComputedStyle(elem.parentElement).getPropertyValue('font-weight');
            input.value = '';
            input.focus();
        }
    });
}//------------------------------------------------------

function createListTag(commands,tags,elem){
    commands.forEach(function(command,index){
        if(input.value === command[0] || input.value === command[1]){
            i = 0;
            const tag = document.createElement(tags[index]);
            elem.parentNode.replaceWith(tag);
            tag.innerHTML = '<li>';
            tag.lastElementChild.textContent = '';
            tag.lastElementChild.setAttribute('id','this');
            tag.lastElementChild.insertAdjacentElement('beforeend',input);
            input.value = '';
            input.focus();
            input.removeEventListener('keydown',pressEnter);
            input.addEventListener('keydown',listEnter);
        }
    });
}

function listEnter(e){
    if(e.isComposing){
        return false;
    }
    if(e.key === 'Enter' && !e.shiftKey){
        this.parentElement.parentElement.insertAdjacentHTML('beforeend','<li>');
        this.parentElement.removeAttribute('id','this');
        this.parentElement.parentElement.lastElementChild.setAttribute('id','this');
        input.replaceWith(input.value);
        document.getElementById('this').insertAdjacentElement('beforeend',input);
        input.value = '';
        input.focus();
    }
    if(e.key === 'Enter' && e.shiftKey){
        if(input.value === ''){
            return false;
        }
        if(input.value !== ''){
            this.parentElement.removeAttribute('id','this');
            input.replaceWith(input.value);
            printArea.insertAdjacentHTML('beforeend','<p>');
            printArea.lastElementChild.insertAdjacentElement('beforeend',input);
            printArea.lastElementChild.setAttribute('id','this');
            input.value = '';
            input.focus();
            input.style.width = '6px';
            i = 0;
            input.removeEventListener('keydown',listEnter);
        }
    }
}
