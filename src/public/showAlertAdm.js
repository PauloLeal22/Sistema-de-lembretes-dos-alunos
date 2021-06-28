function showAlertDel(id_user){
    document.querySelector('div.bg-alert-adm').style.display = 'block'
    document.querySelector('div.card-alert-adm').style.display = 'block'
    document.querySelector('input#id_usuario').value = id_user
    document.querySelector('form#form-del').setAttribute('action', `deleteUser/1`)
    document.querySelector('form#form-del').setAttribute('method', 'POST')
}