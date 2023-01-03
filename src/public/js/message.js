function toast(title,message,type,duration = 3000){
    console.log("Vao ham 2");
    var main = document.getElementById('toast');
    console.log(main);
    if(main){
        const time = 1000
        var toast = document.createElement('div');
        toast.classList.add('toast',`toast--${type}`);
        var delay = (duration/1000).toFixed(2);
        toast.style.animation = `pushMessage .5s ease,hiddenMessage linear 1s ${delay}s forwards`;
        
        var icons = {
            success: `<i class="fa-solid fa-check"></i>`,
            error: `<i class="fa-solid fa-triangle-exclamation"></i>`,
            warning:  `<i class="fa-solid fa-exclamation"></i>`
        }

        var icon = icons[type];

        toast.innerHTML = `
                                <div class="toast__icon">
                                    ${icon}
                                </div>
                                <div class="toast__body">
                                    <h3 class="toast__tittle">${title}</h3>
                                    <p class="toast_msg">${message}</p>
                                </div>
                                <div class="toast__close">
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                            `;
                      
        main.appendChild(toast);
        
        const autoRemoveId = setTimeout(function(){
            main.removeChild(toast);
        },duration + time)

        toast.onclick = function(e){
            // Khi click vao the close hoặc thẻ chứa nó có class close
            if(e.target.closest('.toast__close')){
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        }


      


    }

}


