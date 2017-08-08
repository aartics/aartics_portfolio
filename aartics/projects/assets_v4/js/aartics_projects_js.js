$(document).ready(function() {

    $(' #problem ').hover(function() {
        $('#problem').css('background-color', 'white')
        $('#problemtitle').css('color', '#00BCD4')
    }, function() {
        $('#problem').css('background-color', '#00BCD4')
        $('#problemtitle').css('color', 'white')                
    })
    

    $(' #problem ').click(function() {
        $('html, body').animate({
            scrollTop: $("#problem-1").offset().top
        }, 1000);
    })

})