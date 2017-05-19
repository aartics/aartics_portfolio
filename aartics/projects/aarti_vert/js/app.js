$(document).ready(function() {

    // prevents going back from the site
    history.pushState(null, null, location.href)
    window.onpopstate = function(event) {
        history.go(1)
    }

    $('header').fadeTo( "fast" , 0.2, function() {
       // Animation complete.
    });
    
    var polyData = window.PolyData

    var step = 100 / (polyData.states - 1)
    var loopNum = polyData.states - 1
    var fixedStates = []
    for (var i = 0; i < loopNum; i++) {
        fixedStates.push(step * i)
    }
    fixedStates.push(100)
//     console.log(fixedStates)

    function updateAttached() {
        $('g.attached').each(function() {
            var $me = $(this)
            var $poly = $($me.attr('data-attach'))
            var ppoints = $poly.attr('points').split(',')
            if (ppoints.length == 1)
                ppoints = $poly.attr('points').split(' ')
            var xMax = +ppoints[0]
            var yMax = +ppoints[1] //adding y here, delete if breaks
            for (var i=0; i<ppoints.length; i+=2) {
                var ppoint = +ppoints[i]
                if (ppoint > xMax)
                    xMax = ppoint
            }
            for (var i=1; i<(ppoints.length-1); i+=2) {
                var ppoint = +ppoints[i]
                if (ppoint > yMax)
                    yMax = ppoint
            }            
            $me.children().each(function() {
                var $child = $(this)
//                 var xRel = +$child.attr('data-x-rel') || 0
                var yRel = +$child.attr('data-y-rel') || 0
                $child.attr('y', yMax + yRel)
            })
            var clipPath = $me.attr('data-clip-path')
            if (clipPath) {
                $('polygon', clipPath).attr('points', ppoints)
            }
        })
    }

    function updatePolygons(percent) {
        var pointsData = getPolygonPoints(percent * 100)
        for (var id in pointsData) {
            var $poly = $('#' + id)
            if ($poly.length > 0)
                $poly.attr('points', pointsData[id])
        }
    }

    function getPolygonPoints(state) {

        var polygons = polyData.polygons
    
        var lowerState = 0, upperState = 0
        for (var i = fixedStates.length - 1; i > 0; i--) {
            if (state == fixedStates[i]) {
                upperState = i
                lowerState = i
            } else if (state < fixedStates[i]) {
                upperState = i
                lowerState = i - 1
            }
        }
        var lowerBound = fixedStates[lowerState]
        var upperBound = fixedStates[upperState]
        //console.log({lowerState: lowerState, upperState: upperState})
        var polygonPoints = {}
        for (var p = 0; p < polygons.length; p++) {
            var points = []
            var polygon = polygons[p]
            if (polygon.states.length < lowerState + 1 || polygon.states.length < upperState + 1) {
                  console.log("Error with id " + polygon.id + ', missing states.')
                  continue
            }
            var lowerPoints = polygon.states[lowerState]
            var upperPoints = polygon.states[upperState]
            var pointsLength = polygon.states[0].length
            for (var i = 0; i < pointsLength; i++) {
                var lowerPoint = +lowerPoints[i]
                var upperPoint = +upperPoints[i]
                var diff = upperPoint - lowerPoint
                var progress = (state - lowerBound) / ((upperBound - lowerBound) || 1)
                var point = (diff * progress) + lowerPoint
                points.push(point)
            }
            polygonPoints[polygon.id] = points
        }
        return polygonPoints
    }

    // Propagate polygon.has_link hovering to the descendant links of the group
    // that is attached to that polygon (with data-attach), by adding/removing
    // the .hovered class to all the links inside the group.
    $('svg').on('mouseenter mouseout', 'polygon', function(e) {
        var $target = $(e.target)
        if ($target.hasClass('has_link')) {
            var id = $target.attr('id')
            if (id)
                $('[data-attach="#' + id + '"]').find('a').toggleClass('hovered', e.type == 'mouseenter')
        }
    })

    // Propagate link hovering "upward" to the polygon to which the link's
    // ancestral group element is attached (with data-attach), as well as
    // the other links inside the group, by adding/removing the .hovered class.
    $('svg').on('mouseenter mouseout', 'a', function(e) {
        var $target = $(e.target)
        var $g = $target.closest('g')
        var polygonSel = $target.closest('[data-attach]').attr('data-attach')
        if (polygonSel)
            $(polygonSel).add('a', $g).toggleClass('hovered', e.type == 'mouseenter')
    })

    // Clicking on a polygon with the .has_link class will open the href of the
    // first link inside a group that is attached to the polygon (with data-attach).
    $('svg').on('click', 'polygon.has_link', function(e) {
        var $target = $(e.target)
        var id = $target.attr('id')
        if (id) {
            var $a = $('[data-attach="#' + id + '"]').find('a').first()
            if ($a.length) {
                var href = $a.attr('href')
                var tgt = $a.attr('target')
                if (tgt)
                    // open in a new window of the target attribute is set (see issue #13)
                    window.open(href, tgt)
                else
                    // just change the current location if target attribute is not set
                    window.location.href = href
            }
        }
    })

    window.addEventListener("scroll", function(event) {
      $('header').css({'opacity':getopacity()})
      $('.child1').css({'opacity':getopacityChild1()})
      $('.child3').css({'top':getleftText()})
//       $('.child4').css({'left':getleft()})
      $('.child4').css({'opacity':getopacityButtons()})
      $('.contact_class').css({'animation':'none'})
    
    if ($(window).scrollTop() > 0) {
      $('#area2').click(function() {
          $('#area2').css({'color':'cyan'})
          $('#area2').css({'border-bottom':'2px solid aqua'})
      }, function() {
          $('#area2').css({'color':'white'})
          $('#area2').css({'border-bottom':'none'})
      })

      $('#area3').click(function() {
          $('#area3').css({'color':'orange'})
          $('#area3').css({'border-bottom':'2px solid orange'})
      }, function() {
          $('#area3').css({'color':'white'})
          $('#area3').css({'border-bottom':'none'})
      })

      $('#area4').click(function() {
          $('#area4').css({'color':'#EF2D56'})
          $('#area4').css({'border-bottom':'2px solid #EF2D56'})
      }, function() {
          $('#area4').css({'color':'white'})
          $('#area4').css({'border-bottom':'none'})
      })

      $('#area5').click(function() {
          $('#area5').css({'color':'#FFC107'})
          $('#area5').css({'border-bottom':'2px solid #FFC107'})
      }, function() {
          $('#area5').css({'color':'white'})
          $('#area5').css({'border-bottom':'none'})
      })

      $('#area6').click(function() {
          $('#area6').css({'color':'white'})
          $('#area6').css({'border-bottom':'2px solid white'})
      }, function() {
          $('#area6').css({'color':'white'})
          $('#area6').css({'border-bottom':'none'})
      })
    }

    if (($(window).scrollTop() > 500) && ($(window).scrollTop() < 1500)) {
        $('#area2').css({'color':'cyan'})
        $('#area2').css({'border-bottom':'2px solid aqua'})
    } else if (($(window).scrollTop() <= 200)) {
        $('#area2').css({'color':'white'})
        $('#area2').css({'border-bottom':'none'})
    } else {
        $('#area2').css({'color':'white'})
        $('#area2').css({'border-bottom':'none'})
    }

    if (($(window).scrollTop() > 1300) && ($(window).scrollTop() < 2100)) {
        $('#area3').css({'color':'orange'})
        $('#area3').css({'border-bottom':'2px solid orange'})
    } else if (($(window).scrollTop() <= 700)) {
        $('#area3').css({'color':'white'})
        $('#area3').css({'border-bottom':'none'})
    } else {
        $('#area3').css({'color':'white'})
        $('#area3').css({'border-bottom':'none'})
    }

    if (($(window).scrollTop() > 1900) && ($(window).scrollTop() < 2800)) {
        $('#area4').css({'color':'#EF2D56'})
        $('#area4').css({'border-bottom':'2px solid #EF2D56'})
    } else if (($(window).scrollTop() <= 1400)) {
        $('#area4').css({'color':'white'})
        $('#area4').css({'border-bottom':'none'})
    } else {
        $('#area4').css({'color':'white'})
        $('#area4').css({'border-bottom':'none'})
    }

    if (($(window).scrollTop() > 2600) && ($(window).scrollTop() < 3700)) {
        $('#area5').css({'color':'#FFC107'})
        $('#area5').css({'border-bottom':'2px solid #FFC107'})
    } else if (($(window).scrollTop() <= 1800)) {
        $('#area5').css({'color':'white'})
        $('#area5').css({'border-bottom':'none'})
    } else {
        $('#area5').css({'color':'white'})
        $('#area5').css({'border-bottom':'none'})
    }

    if (($(window).scrollTop() > 3600) && ($(window).scrollTop() < 5001)) {
        $('#area6').css({'color':'white'})
        $('#area6').css({'border-bottom':'2px solid white'})
    } else if (($(window).scrollTop() <= 2100)) {
        $('#area6').css({'color':'white'})
        $('#area6').css({'border-bottom':'none'})
    } else {
        $('#area6').css({'color':'white'})
        $('#area6').css({'border-bottom':'none'})
    }


      function getopacity() {
            var opacitystring = '0.0'
            if (($(window).scrollTop() > 95) && ($(window).scrollTop() < 300)) {
                opacitystring = $(window).scrollTop()/300
            } else if ($(window).scrollTop() <= 95) {
                opacitystring = '0.2'
            } else {
                opacitystring = '1.0'
            }
            return opacitystring         
      }

      function getopacityChild1() {
            var opacitystring = '0.0'
            if ($(window).scrollTop() < 300) {
                opacitystring = $(window).scrollTop()/300
            } else {
                opacitystring = '1.0'
            }
            return opacitystring          
      }
      
      function getopacityButtons() {
            var opacitystring = '1.0'
            if (($(window).scrollTop() > 10) && ($(window).scrollTop() < 100)) {
                opacitystring = 1 - ($(window).scrollTop()/100)
            } else if (($(window).scrollTop() <= 10)) {
                opacitystring = '1.0'
            } else {
                opacitystring = '0.0'
            }
            return opacitystring         
      }

      function getleftText() {
          var leftstring = '0'
          if ($(window).scrollTop() < 600) {
              leftstring = '-' + ($(window).scrollTop()).toString() + "px"
          } else {
              leftstring = '-600px'
          }
          return leftstring
      }

      function getleft() {
          var leftstring = '0'
          if ($(window).scrollTop() < 600) {
              leftstring = '-' + ($(window).scrollTop()).toString() + "px"
          } else {
              leftstring = '-700px'
          }
          return leftstring
      }
     
      var scrollPercent = ($(window).scrollTop() / ($(document).height() - $(window).height())).toFixed(4)
//       console.log(scrollPercent)
      updatePolygons(scrollPercent)
      updateAttached()
 
    }, false);

    // Breadcrumb

    $('#area1 , #bz0, #logo').on('click', function() {
        scrollToY(0, 1, 'easeInOutSine');
    })
    
    $('#area2 , #bz1 , #aarti , #_1').on('click', function() {
        scrollToY(700, 100, 'easeInOutSine');
    })

    $('#area3 , #bz2').on('click', function() {
        scrollToY(1800, 1, 'easeInOutSine');
    })

    $('#area4 , #bz3').on('click', function() {
        scrollToY(2700, 1, 'easeInOutSine');
    })

    $('#area5 , #bz4').on('click', function() {
        scrollToY(3500, 1, 'easeInOutSine');
    })

    $('#area6').on('click', function() {
        scrollToY(5000, 1, 'easeInOutSine');
    })

    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    //Function to animate the breadcrumbs. Copied from stackoverflow here:
    //http://stackoverflow.com/questions/12199363/scrollto-with-animation

    function scrollToY(scrollTargetY, speed, easing) {
        // scrollTargetY: the target scrollY property of the window
        // speed: time in pixels per second
        // easing: easing equation to use

        var scrollY = window.scrollY,
            scrollTargetY = scrollTargetY || 0,
            speed = speed || 2000,
            easing = easing || 'easeOutSine',
            currentTime = 0;

        // min time .1, max time .8 seconds
        var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        var PI_D2 = Math.PI / 2,
            easingEquations = {
                easeOutSine: function (pos) {
                    return Math.sin(pos * (Math.PI / 2));
                },
                easeInOutSine: function (pos) {
                    return (-0.5 * (Math.cos(Math.PI * pos) - 1));
                },
                easeInOutQuint: function (pos) {
                    if ((pos /= 0.5) < 1) {
                        return 0.5 * Math.pow(pos, 5);
                    }
                    return 0.5 * (Math.pow((pos - 2), 5) + 2);
                }
            };

        // add animation loop
        function tick() {
            currentTime += 1 / 60;

            var p = currentTime / time;
            var t = easingEquations[easing](p);

            if (p < 1) {
                requestAnimFrame(tick);

                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
//                 console.log('scroll done');
                window.scrollTo(0, scrollTargetY);
            }
        }

        // call it once to get started
        tick();
    }


})