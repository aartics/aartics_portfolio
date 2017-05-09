$(document).ready(function(){
  history.pushState(null, null, location.href)
    window.onpopstate = function(event) {
        history.go(1)
  }

//   console.log(('body').width())

  $(document).on('scroll', function() {
//     console.log("test")
    var val = $(this).scrollLeft()
    console.log(val)
    var elem_width = ($(document).width())
    console.log(elem_width)
//     var percent_val = (val/elem_width)
//     console.log(percent_val)
  })
}); 