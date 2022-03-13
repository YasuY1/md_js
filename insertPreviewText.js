function insertPreviewText(){
    if(previewArea.firstElementChild.childElementCount === 0){
        previewArea.firstElementChild.textContent = input.value;
    }
    if(previewArea.firstElementChild.childElementCount !== 0){
        input.removeEventListener('input',insertPreviewText,{onece:true});
        input.addEventListener('input',()=>{
            previewArea.firstElementChild.lastChild.textContent = input.value;
        });
    }
}
