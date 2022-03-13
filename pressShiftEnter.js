function pressShiftEnter(e){
    if(!input.value.match(/[^\x01-\x7E]/) && e.key === 'Enter' && e.shiftKey === true){
        previewArea.firstElementChild.insertAdjacentHTML('beforeend','<br>'+' ');
        input.value = '';
    }//シングルバイト
    if(input.value.match(/[^\x01-\x7E]/) && e.key === 'Enter' && e.shiftKey === true){
        if(e.isComposing){
            previewArea.firstElementChild.textContent = input.value;
        }
        if(e.isComposing === false){
            previewArea.firstElementChild.insertAdjacentHTML('beforeend','<br>'+' ');
            input.value = '';
        }
    }//マルチバイト
}