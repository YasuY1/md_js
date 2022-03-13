function pressEnter(e){
    if(!input.value.match(/[^\x01-\x7E]/) && e.key === 'Enter' && e.shiftKey === false){
        printText();
    }//シングルバイト
    if(input.value.match(/[^\x01-\x7E]/) && e.key === 'Enter' && e.shiftKey === false){
        if(e.isComposing){
            previewArea.firstElementChild.removeChild(previewArea.firstElementChild.lastChild);
            previewArea.firstElementChild.insertAdjacentHTML('beforeend',input.value);
        }
        if(e.isComposing === false){
            printText();
        }
    }//マルチバイト
}