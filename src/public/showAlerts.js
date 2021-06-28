function showAlertDel(id_user, id_avaliacao){
    document.querySelector('div#bg-alert-del').style.display = 'block'
    document.querySelector('div#card-alert-del').style.display = 'block'
    document.querySelector('input#id_avaliacao').value = id_avaliacao
    document.querySelector('form#form-del').setAttribute('action', `delete/${id_user}`)
    document.querySelector('form#form-del').setAttribute('method', 'POST')
}

function showAlertConc(id_user, id_avaliacao){
    document.querySelector('div#bg-alert-conc').style.display = 'block'
    document.querySelector('div#card-alert-conc').style.display = 'block'
    document.querySelector('input#id_avaliacao_conc').value = id_avaliacao
    document.querySelector('form#form-conc').setAttribute('action', `complete/${id_user}`)
    document.querySelector('form#form-conc').setAttribute('method', 'POST')
}

// action="complete/{{dataValues.user_id}}/{{dataValues.id}}" method="POST"