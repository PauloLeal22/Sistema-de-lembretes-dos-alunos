let cards = document.getElementsByClassName('card-user')

if(cards.length >= 1){
    document.getElementById('area-aviso').style.display = 'none'
}else{
    document.getElementById('area-aviso').style.display = 'block'
}