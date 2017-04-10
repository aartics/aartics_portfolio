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
    console.log(fixedStates)

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

    $('svg').on('click', function(e) {
        var $target = $(e.target)
        if (!$target.is('a')) {
            var id = $target.attr('id')
            if (id) {
                var $a = $('[data-attach="#' + id + '"]').find('a').first()
                if ($a.length) {
                    var href = $a.attr('href')
                    var tgt = $.attr('target') || '_blank'
                    window.open(href, tgt)
                }
            }
        }
    })

    // load handlers
    $.jInvertScroll(['.header','.backgroundgrad','.scroll'], {
        height: 3000,                   
        onScroll: function(percent) {
            updatePolygons(percent)
            updateAttached()
        }
    })

})