var fs = require('fs')
var cheerio = require('cheerio')


var args = process.argv

if (args.length != 3)
	throw new Error("Bad arguments.")

var dirPath = args[2]

if (dirPath.substring(dirPath.length - 1) == '/')
	dirPath = dirPath.substring(0, dirPath.length - 1)

var outputFileSrc = dirPath + '/' + 'data.js'
var outputFileStrict = dirPath + '/' + 'data.strict.json'
var outputFileChill = dirPath + '/' + 'data.chill.json'

var fileNames = fs.readdirSync(dirPath)

var svgFiles = []
for (var i = 0; i < fileNames.length; i++) {
	var filePath = dirPath + '/' + fileNames[i]
	if (filePath.substring(filePath.length - 3) != 'svg')
		continue
	svgFiles.push(filePath)
}

if (!svgFiles.length)
	throw new Error('No svg files found to process.')

svgFiles.sort()

var polygons = []
var polygonsById = {}
// var polygonsChill = []
// var polygonsChillById = {}

for (var i = 0; i < svgFiles.length; i++) {
	var text = fs.readFileSync(svgFiles[i]).toString()
	var $ = cheerio.load(text)
	var isFirst = i == 0
	$('polygon').add('polyline').each(function() {
		var $poly = $(this)
		var id = $poly.attr('id')
		if (!polygonsById[id]) {
			var pdata = {id: id, states: []}
			polygonsById[id] = pdata
			polygons.push(pdata)
		} else {
			var pdata = polygonsById[id]
		}
		pdata.states.push($poly.attr('points').split(' '))
	})
	// experimental, not functioning!
	// if (isFirst) {
	// 	for (var id in polygonsById)
	// 		polygonsChillById[id] = {id: id, states: [].concat(polygonsById[id].states)}			
	// 	for (var j = 0; j < polygons.length; j++)
	// 		polygonsChill.push(polygonsChillById[polygons[j].id])
	// } else {
	// 	for (var id in polygonsChillById) {
	// 		var $poly = $('#' + id)
	// 		if (!$poly.length) {
	// 			//console.log("Missing " + id + ' from ' + svgFiles[i])
	// 			polygonsChillById[id].states.push(polygonsChillById[id].states[i - 1])
	// 		}
				
	// 	}
	// }
}

var statesCount = svgFiles.length

for (var id in polygonsById) {
	var pdata = polygonsById[id]
	if (pdata.states.length != statesCount)
		console.log('WARNING: element ' + id + ' only has ' + pdata.states.length + ' states, expecting ' + statesCount + '.')
}
var data = {
	generatedOn : new Date().toLocaleString(),
	states : svgFiles.length,
	polygons : polygons
}
// var dataChill =  {
// 	generatedOn : new Date().toLocaleString(),
// 	states : svgFiles.length,
// 	polygons : polygonsChill
// }



//console.log('Writing ' + outputFileChill + '.')
//fs.writeFileSync(outputFileChill, JSON.stringify(dataChill, null, 2))

var jsonString = JSON.stringify(data, null, 2)

console.log('Writing ' + outputFileStrict + '.')
fs.writeFileSync(outputFileStrict, jsonString)

console.log('Writing ' + outputFileSrc + '.')
fs.writeFileSync(outputFileSrc, 'window.PolyData = ' + jsonString)

console.log('Done.')