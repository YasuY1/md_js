function pressBackspace(e){
    if(printArea.getElementsByTagName("p") === null){
        if(printArea.innerHTML && e.key === 'Backspace'){
            input.value = printArea.lastElementChild.textContent;
            printArea.removeChild(printArea.lastElementChild);
            return false;
        }
    }
    if(printArea.getElementsByTagName("p") !== null){//pの中身を代入
        if(printArea.innerHTML && e.key === 'Backspace'){
            input.value = printArea.lastElementChild.lastChild.textContent;
            printArea.lastElementChild.removeChild(printArea.lastElementChild.lastChild);
            printArea.lastElementChild.removeChild(printArea.lastElementChild.lastChild);
            return false;
        }
    }
}