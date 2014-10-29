// add SVG methods to the star class

Star.prototype.svgPolygonPoints = function(scale) {
	return xyCenteredToSVG( scale, this.vertices(scale) );
}

// take an array of objects representing (x,y) points for a shape centered at 0,0
// and turn it into a string suitable for an SVG polygon object, with origin at top left
function xyCenteredToSVG( scale, jsonVertices ) {
	var svgVertices = "";
	var i;
	// reformat the array of x,y objects to the SVG points syntax
	for (i = 0; i < jsonVertices.length; ++i) {
		if (svgVertices) {
			svgVertices = svgVertices + ' ';
		}
		svgVertices = svgVertices + (scale + jsonVertices[i].x) + ',' + (scale + jsonVertices[i].y);
	}
	return svgVertices;
}
