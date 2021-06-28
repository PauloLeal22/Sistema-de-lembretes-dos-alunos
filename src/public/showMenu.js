$(document).ready(function(){
    $('.hamburguer-home').click(function(){
        $(this).toggleClass('active');
        $(".menu-lateral").toggleClass('active');
    });
});