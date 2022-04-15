const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const input = document.createElement('input');
const span = document.createElement('span');

let i = 0;
let c = 0;

let beforeText;
let afterText;

const printElement0 = printArea.firstElementChild;
const elem0Fsize = window.getComputedStyle(printElement0).getPropertyValue('font-size');
const elem0Fweight = window.getComputedStyle(printElement0).getPropertyValue('font-weight');

//(メインコントロール--------------------------------------
markdown.addEventListener('click',searchText);
input.addEventListener('keydown',arrows);
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
    if(printArea.childElementCount > 1){
        const coodinateX = document.elementFromPoint(e.pageX,e.pageY);
        const thisFSize = window.getComputedStyle(coodinateX).getPropertyValue('font-size').replace('px','');
        const thisLineHeight = thisFSize * 1.4;
        const thisWidth = coodinateX.getBoundingClientRect().width;
        const thisHeight = coodinateX.getBoundingClientRect().height;
        const thisY = coodinateX.getBoundingClientRect().y;

        let strCount;
        if(coodinateX.textContent.match(/[\x01-\x7E]/)){
            strCount = Math.floor(e.pageX / (thisFSize/2));
        };
        if(coodinateX.textContent.match(/[^\x01-\x7E]/)){
            strCount = Math.floor(e.pageX / thisFSize);
        };

        let maxLength = Math.floor(thisWidth / thisFSize);

        if(thisHeight/thisLineHeight > 1){
            const lineCountThis = Math.floor((e.pageY - thisY)/thisLineHeight);
            if(!coodinateX.innerHTML.match(/.*(\<br).*/)){
                strCount = strCount + (lineCountThis * maxLength);
            }
            if(coodinateX.innerHTML.match(/.*(\<input).*/)){
                coodinateX.removeChild(input);
            }
            if(coodinateX.innerHTML.match(/.*(\<br).*/)){
                const textBlock = coodinateX.innerHTML.split('<br>');
                if(lineCountThis === 0){
                    coodinateX.textContent = textBlock[0].slice(0,strCount);
                    coodinateX.insertAdjacentElement('beforeend',input);
                    coodinateX.insertAdjacentText('beforeend',textBlock[0].slice(strCount,textBlock[0].length));
                    for(let i=1; i<textBlock.length; i++){
                        coodinateX.insertAdjacentHTML('beforeend','<br>');
                        coodinateX.insertAdjacentText('beforeend',textBlock[i]);
                    }
                }
                for(let n=1; n<Math.floor(thisHeight/thisLineHeight); n++){
                    if(lineCountThis === n){
                        coodinateX.innerHTML = '';
                        for(let i=0; i<lineCountThis; i++){
                            coodinateX.insertAdjacentHTML('beforeend',textBlock[i]);
                            coodinateX.insertAdjacentHTML('beforeend','<br>');
                        }
                        coodinateX.insertAdjacentText('beforeend',textBlock[lineCountThis].slice(0,strCount));
                        coodinateX.insertAdjacentElement('beforeend',input);
                        coodinateX.insertAdjacentText('beforeend',textBlock[lineCountThis].slice(strCount,textBlock[lineCountThis].length));
                        for(let i=lineCountThis + 1; i<textBlock.length; i++){
                            coodinateX.insertAdjacentHTML('beforeend','<br>');
                            coodinateX.insertAdjacentText('beforeend',textBlock[i]);
                        }
                    }
                }
                return false;
            }
        }

        if(coodinateX.innerHTML.match(/.*(\<input).*/)){
            coodinateX.removeChild(input);
        }

        const beforeText = coodinateX.innerHTML.slice(0, strCount);
        const afterText = coodinateX.innerHTML.slice(strCount,coodinateX.textContent.length);

        coodinateX.innerHTML = beforeText;
        coodinateX.insertAdjacentElement('beforeend',input);
        coodinateX.insertAdjacentText('beforeend',afterText);
        document.getElementById('this').removeAttribute('id','this');
        coodinateX.setAttribute('id','this');

        input.focus();
    }
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

function arrows(e){
    if(printArea.childElementCount > 1 && input.value === ''){
        if(this.previousSibling){
            beforeText = this.previousSibling.textContent;//
        }
        if(this.nextSibling){
            afterText = this.nextSibling.textContent;
        }
        switch(e.key){
            case 'ArrowUp':
                console.log('上');
                break;
            case 'ArrowDown':
                console.log('下');
                break;
            case 'ArrowLeft':
                if(!this.previousSibling){
                    c++;
                    if(c === 1){
                        this.parentElement.previousSibling.setAttribute('id','this');
                        this.parentElement.removeAttribute('id','this');
                        document.getElementById('this').insertAdjacentElement('beforeend',input);
                        beforeText = this.previousSibling.wholeText;
                        afterText = '';
                        input.focus();
                    }
                    if(c === 3){
                        c = 0;
                    }
                }
                if(this.previousSibling){
                    const beforeCount = beforeText.length;
                    let afterCount;
                    if(!this.nextSibling){
                        afterText = (beforeText.slice(beforeCount-1,beforeCount)+afterText).replace('undefined','');
                    }
                    if(this.nextSibling){
                        afterCount = afterText.length;
                        afterText = beforeText.slice(beforeCount-1,beforeCount)+afterText;
                    }
                    beforeText = beforeText.slice(0,-1);

                    document.getElementById('this').innerHTML = beforeText;
                    document.getElementById('this').insertAdjacentElement('beforeend',input);
                    document.getElementById('this').insertAdjacentText('beforeend',afterText);
                }
                break;
            case 'ArrowRight':
                if(this.nextSibling){
                    const afterCount = afterText.length;
                    let beforeCount;
                    if(!this.previousSibling){
                        beforeText = (beforeText + afterText.slice(0,1)).replace('undefined','');
                    }
                    if(this.previousSibling){
                        beforeCount = beforeText.length;
                        beforeText = beforeText + afterText.slice(0,1);
                    }

                    afterText = afterText.slice(1,afterCount);

                    document.getElementById('this').textContent = beforeText;
                    document.getElementById('this').insertAdjacentElement('beforeend',input);
                    document.getElementById('this').insertAdjacentText('beforeend',afterText);
                }
                if(this.nextSibling.textContent === '' && this.parentElement.nextElementSibling){
                    beforeText = '';
                    this.parentElement.nextElementSibling.setAttribute('id','this');
                    this.parentElement.removeAttribute('id','this');
                    document.getElementById('this').insertAdjacentElement('afterbegin',input);
                }
                break;
        }
    }
    input.focus();
    console.log('前：' + beforeText);
    console.log('後：' + afterText);
}
