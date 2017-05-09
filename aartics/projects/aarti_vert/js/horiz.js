$(document).ready(function(){
  history.pushState(null, null, location.href)
    window.onpopstate = function(event) {
        history.go(1)
  }

  window.addEventListener("scroll", function(event) {
    console.log(window.scrollX)
    console.log(document.body.clientWidth)
    var percent_val = (window.scrollX/document.body.clientWidth)
    console.log((percent_val).toFixed(4))
  }, false);


}); 