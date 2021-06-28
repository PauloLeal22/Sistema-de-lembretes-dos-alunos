let cards = document.getElementsByClassName('card-avaliacao')

if(cards.length >= 1){
    document.getElementById('area-aviso').style.display = 'none'
}else{
    document.getElementById('area-aviso').style.display = 'block'
}