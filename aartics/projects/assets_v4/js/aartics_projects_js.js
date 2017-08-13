$(document).ready(function() {

    $(' #problem ').hover(function() {
        $('#problem').css('background-color', 'white')
        $('#problemtitle').css('color', '#00BCD4')
        $('#problemdesc').css('color', '#00BCD4')
        document.getElementById("problemsrc").src="../assets_v4/img/icon_problem_color.png";
    }, function() {
        $('#problem').css('background-color', '#00BCD4')
        $('#problemtitle').css('color', 'white')
        $('#problemdesc').css('color', 'white')
        document.getElementById("problemsrc").src="../assets_v4/img/icon_problem.png";             
    })

    $(' #solution ').hover(function() {
        $('#solution').css('background-color', 'white')
        $('#solutiontitle').css('color', '#70868E')
        $('#solutiondesc').css('color', '#70868E')
        document.getElementById("solutionsrc").src="../assets_v4/img/icon_solution_color.png";
    }, function() {
        $('#solution').css('background-color', '#70868E')
        $('#solutiontitle').css('color', 'white')
        $('#solutiondesc').css('color', 'white')
        document.getElementById("solutionsrc").src="../assets_v4/img/icon_solution.png";             
    })    

    $(' #process ').hover(function() {
        $('#process').css('background-color', 'white')
        $('#processtitle').css('color', '#cf045e')
        $('#processdesc').css('color', '#cf045e')
        document.getElementById("processsrc").src="../assets_v4/img/icon_process_color.png";
    }, function() {
        $('#process').css('background-color', '#cf045e')
        $('#processtitle').css('color', 'white')
        $('#processdesc').css('color', 'white')
        document.getElementById("processsrc").src="../assets_v4/img/icon_process.png";             
    }) 

    $('#problem').click(function() {
        $('html, body').animate({
            scrollTop: $("#problem-1").offset().top
        }, 1000);
    })
    $('#solution').click(function() {
        $('html, body').animate({
            scrollTop: $("#solution-1").offset().top
        }, 1000);
    })
    $('#process').click(function() {
        $('html, body').animate({
            scrollTop: $("#process-1").offset().top
        }, 1000);
    })
})