const markdown = document.getElementById('markdown');
const printArea = document.getElementById('printArea');
const previewArea = document.getElementById('previewArea');
const input = document.getElementById('input');

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

class CleateParentTags {
    constructor(commandArray,tagArray){
        this.commandArray = commandArray;
        this.tagArray = tagArray;
    }

    getTag(){
        const tag = this.tagArray;
        this.commandArray.forEach(function(command,index){
            if(input.value === command[0] || input.value === command[1]){
                previewArea.innerHTML = '<'+tag[index]+'></'+tag[index]+'>';
                input.value = '';
                insertText();
            }
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

markdown.addEventListener('click',()=>{
    input.focus();
});

input.addEventListener('input',determineStringType);
input.addEventListener('keydown',keydownEvents);

function determineStringType(e){
    if(input.value.match(/[\x01-\x7E]/) && e.isComposing === false){//シングルバイト
        tagChenger();
    }
    if(input.value.match(/[^\x01-\x7E]/) && e.isComposing === true){//マルチバイト
        insertText();
    }
}

function tagChenger(){
    const heading = new CleateParentTags(headings,headingTags);
    heading.getTag();

    const list = new CleateParentTags(listCommands,listTags);
    list.getTag();

    insertText();
}

// function tagSellector(){

// }

function insertText(){
    previewArea.firstElementChild.textContent = input.value;
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