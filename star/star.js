// the star class
// the star may be defined by a given number of points at equal angles on concentric circles
// the outer circle has radius 1
// the inner circle has radius innerOuterRatio
// The first vertex is placed at angle 0, the x-axis, and the next at
// angles (2*Math.PI)/ numPoints

// the vertices are given as x,y coordinates for the star centered at 0,0
// the vertices method allows an optional scale factor that scales the
// outer circle radius. If not supplied, a scale of 1 is used.

var Star = function( innerOuterRatio, numPoints ) {

	// for now there are constraints
	if ((innerOuterRatio <= 0) || (innerOuterRatio > 1)) {
		alert( "star with invalid innerOuterRatio '" + innerOuterRatio + "'" );
	}
	if (numPoints < 4) {
		alert( "star with invalid numPoints" );
	}

	this.innerOuterRatio = innerOuterRatio;
	this.numPoints = numPoints;
};

Star.prototype.reconfigure = function( innerOuterRatio, numPoints ) {

	// we should have some common code to check args
	
	this.innerOuterRatio = innerOuterRatio;
	this.numPoints = numPoints;
	return this;
}

function starVertices( scale, innerOuterRatio, numPoints ) {
	var result = [];
	var scale = scale || 1;
	
	// compute the vertices
	// there will be 2*numPoints of them at
	// PI/numPoints intervals, alternating between the
	// outer and inner circles
	var i;	// for even i, point is on the outer circle
	var angle;
	var angleIncrement = Math.PI/numPoints;
	var cartesianPoint;
	var innerPointScale = innerOuterRatio * scale;

	for (i = 0; i < numPoints*2; ++i) {
		angle = i*angleIncrement;
		// so in polar coordinates, we have the next vertex at (scale,angle)
		// put into Cartesian
		if (i % 2 == 1) {
			cartesianPoint = { x : innerPointScale * Math.cos(angle), y : innerPointScale * Math.sin(angle) };
		} else {
			cartesianPoint = { x : scale * Math.cos(angle), y : scale * Math.sin(angle) };
		}
		result.push( cartesianPoint );
	}
	return result;
};

Star.prototype.vertices = function( scale ) {
	return starVertices( scale, this.innerOuterRatio, this.numPoints );
};

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
