let camposSituacao = document.getElementsByClassName('td-sit')
    
for(let i in camposSituacao){
    if(camposSituacao[i].innerHTML == "Inativo"){
        camposSituacao[i].style.color = "red"
    } else if(camposSituacao[i].innerHTML == "Online"){
        camposSituacao[i].style.color = "green"
    } else if(camposSituacao[i].innerHTML == "Ativo"){
        camposSituacao[i].style.color = "blue"
    }
}