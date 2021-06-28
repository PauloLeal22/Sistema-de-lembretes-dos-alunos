let camposSituacao = document.getElementsByClassName('td-sit')
    
for(let i in camposSituacao){
    if(camposSituacao[i].innerHTML == "Excluída"){
        camposSituacao[i].style.color = "red"
    } else if(camposSituacao[i].innerHTML == "Concluída"){
        camposSituacao[i].style.color = "green"
    } else if(camposSituacao[i].innerHTML == "Andamento"){
        camposSituacao[i].style.color = "blue"
    }
}