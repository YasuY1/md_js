const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const previewArea = document.getElementById('previewArea');
const input = document.getElementById('input');
//↓後で分離
const headingTags = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
];

const headings = [
    [ 'h1 ' , '# ' ],
    [ 'h2 ' , '## ' ],
    [ 'h3 ' , '### ' ],
    [ 'h4 ' , '#### ' ],
    [ 'h5 ' , '##### ' ],
];

const listTags = [
    'ul',
    'ol',
];

const listCommands = [
    ['ul ','- '],
    ['ol ','+ '],
];

class TagCommandController {
    constructor(commandArray,tagArray){
        this.commandArray = commandArray;
        this.tagArray = tagArray;
    }

    commonCommands(){
        const tag = this.tagArray;
        this.commandArray.forEach(function(command){
            if(input.value === '\\' + command[0]){
                input.value = command[0];
                insertText();
            }
            if(input.value === '\\' + command[1]){
                input.value = command[1];
                insertText();
            }
        });
    }
}

class HeadingCommandController extends TagCommandController {
    constructor(commandArray,tagArray,insertArea){
        super(commandArray,tagArray);
        this.insertArea = insertArea;
    }

    headingCommands(){
        const tag = this.tagArray;
        const area = this.insertArea;
        this.commandArray.forEach(function(command,index){
            if(input.value === command[0] || input.value === command[1]){
                area.innerHTML = '<'+tag[index]+'></'+tag[index]+'>';
                input.value = '';
                tagSellector();
            }
        });
        this.commonCommands();
    }
}

class ListCommandController extends HeadingCommandController {
    listCommands(){
        const tag = this.tagArray;
        const area = this.insertArea;
        this.commandArray.forEach(function(command,index){
            if(input.value === command[0] || input.value === command[1]){
                area.insertAdjacentHTML('beforeend','<'+tag[index]+'></'+tag[index]+'>');
                input.value = '';
                tagSellector();
            }
        });
        this.commonCommands();
    }
}
//↑あとで分離

//↓実際の機能
markdown.addEventListener('click',()=>{
    input.focus();
});

input.addEventListener('input',insertText,{once:true});
input.addEventListener('input',determineStringType);
input.addEventListener('keydown',keydownEvents);
// insertText();

function determineStringType(e){
    if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){//シングルバイト
        tagChenger();
    }
    if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === true){//マルチバイト
        insertText();
    }
}

function tagChenger(){
    const heading = new HeadingCommandController(headings,headingTags,previewArea);
    heading.headingCommands();

    const lists = new ListCommandController(listCommands,listTags,printArea);
    lists.listCommands();
}

function tagSellector(){
    headingTags.forEach(function(head){
        if(previewArea.firstElementChild.tagName === head.toUpperCase()){
            insertText();
        }
    });
    listTags.forEach(function(list){
        if(printArea.childElementCount !== 0){
            if(printArea.lastElementChild.tagName === list.toUpperCase()){
                insertLines();
            }
        }
    });
}

function insertLines(){
    listTags.forEach(function(tag){
        const parent = printArea.getElementsByTagName(tag)[printArea.getElementsByTagName(tag).length - 1];
        if(parent && parent.childElementCount === 0 ){
            parent.insertAdjacentHTML('beforeend','<li></li>');
            input.addEventListener('input',insertLineText);
        };
    });
}

function insertLineText(){
    const ul = printArea.getElementsByTagName('ul')[printArea.getElementsByTagName('ul').length - 1];
    const ol = printArea.getElementsByTagName('ol')[printArea.getElementsByTagName('ol').length - 1];
    if(ul){
        createList(ul);
    }
    if(ol){
        createList(ol);
    }
    function createList(listTag){
        listTag.lastElementChild.textContent = input.value;
        input.addEventListener('keydown',(e)=>{
            if(e.key === 'Enter' && e.shiftKey === false){
                listTag.insertAdjacentHTML('beforeend','<li></li>');
                input.value = '';
                insertLineText();
            }
            if(e.key === 'Enter' && e.shiftKey === true){
                console.log('ok');
            }
        },{once:true});
    }
}

function insertText(){
    input.addEventListener('input',()=>{
        if(printArea.childElementCount !== 0){
            if(printArea.lastElementChild.tagName === 'UL' || printArea.lastElementChild.tagName === 'OL'){
                previewArea.firstElementChild.textContent = '';
                return false;
            }
        }
        previewArea.firstElementChild.textContent = input.value;
    });
}

function keydownEvents(e){//動かすな！
//Enter
    if(previewArea.firstElementChild.textContent !== '' && e.shiftKey === false && e.key ==='Enter'){
        if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){
            printText();
        }
        if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === false){
            printText();
        }
    }//動かすな！
}

function printText(){
    printArea.insertAdjacentHTML('beforeend',previewArea.innerHTML);
    previewArea.firstElementChild.textContent = '';
    input.value = '';
    previewArea.innerHTML = '<p></p>';
}