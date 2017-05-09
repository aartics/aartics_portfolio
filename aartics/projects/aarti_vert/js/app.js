$(document).ready(function() {

    // prevents going back from the site
    history.pushState(null, null, location.href)
    window.onpopstate = function(event) {
        history.go(1)
    }

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
            for (var i=0; i<ppoints.length; i+=2) {
                var ppoint = +ppoints[i]
                if (ppoint > xMax)
                    xMax = ppoint
            }
            $me.children().each(function() {
                var $child = $(this)
                var xRel = +$child.attr('data-x-rel') || 0
                $child.attr('x', xMax + xRel)
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
                var tgt = $.attr('target') || '_blank'
                window.open(href, tgt)
            }
        }
    })

    window.addEventListener("scroll", function(event) {

      var scrollPercent = ($(window).scrollTop() / ($(document).height() - $(window).height())).toFixed(4)
      console.log(scrollPercent)

      updatePolygons(scrollPercent)
      updateAttached()
      
    }, false);

})