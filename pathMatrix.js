// Javascript to solve Euler problem 81: (https://projecteuler.net/problem=81)
// Find the minimum sum of cells in an NxN matrix along a path from 0,0 to N-1,N-1

// Define the pathMatrix class, which provides
//		addRow() - populate the matrix with the next row of data
//		process() - compute the path sums and solution
// 		nodeSums[N-1][N-1] - after processing will contain the minimum path
//					across the matrix

// Algorithm - to find overall minimum path sum, record at each cell, the minimum
// cost of reaching it from the origin.
// Maintain a list of active cells on the frontier of the exploration, and always
// explore the next cells from the minimum on this list

// some representations: nodes are designated by a string of its x,y coordinates,
// e.g. "0,0", "64,49"
// pathMatrix consists of 2 matrices - one of values and one of sums.
// Values are assigned by addRow and sums, possibly sparse and set by
// "exploring" nodes to see which neighbors, progressing right and down,
// yield lower path sums. There is also an activeNodes list containing
// nodes on the frontier to be explored. We will always want to explore
// the one with minimum value next. The keys of activeNode are coordinates
// representing nodes on the list; values are 1. To remove from the list,
// delete it. When activeNodes list is empty, the algorithm has completed
// and the nodeSum[N-1][N-1] is the minimum path sum across the matrix.

"use strict";

				
var debugLevel = 2;	// any call to debugWrite with level <= debugLevel will log
function debugWrite( level, string ) {
	
	if (level <= debugLevel) {
		console.log ( string );
	}
}

// define the constructor
function pathMatrix() {
	this.dimension = 0;
	this.nodeValues = [];
	this.nodeSums = [];
	this.activeNodes = {};
}

pathMatrix.prototype.addRow = function() {
	// on the first call, capture the number of items as matrix dimension
	if (this.dimension === 0) {
		this.dimension = arguments.length;
	} else {
		if (arguments.length !== this.dimension) {
			throw "addRow argument count (" + arguments.length + ") mismatch";
		}
	}
	// add this row to the viewGrid data array
	this.nodeValues.push( Array.prototype.slice.call( arguments ) );

	// add a row to nodeSums. The cells within it will remain undefined.
	this.nodeSums.push( [] );
};

// Find the minimum in the activeNodes list

pathMatrix.prototype.minimumActive = function() {

	// start with a candidate minimum- any one from the list
	var currentMinimum;
	for (currentMinimum in this.activeNodes) {
		break;
	}

	var currentMinimumXY = currentMinimum.split(',');
	var currentMinimumX = currentMinimumXY[0];
	var currentMinimumY = currentMinimumXY[1];
	
	var possibleMinimum;
	for (possibleMinimum in this.activeNodes) {
		var possibleMinimumXY = possibleMinimum.split(',');
		var x = possibleMinimumXY[0];
		var y = possibleMinimumXY[1];
		if (this.nodeSums[x][y] < this.nodeSums[currentMinimumX][currentMinimumY]) {
			// we have a new minimum
			currentMinimumX = x;
			currentMinimumY = y;
			currentMinimum = possibleMinimum;
		}
	}
	return currentMinimum;
};

// given a cell, explore its right and down neighbors, if they exist.
// If the neighbor has already been explored, i.e. nodeValues[x][y+1] or
// nodeValues[x+1][y] has a value, update the nodeSum only if the new
// nodeSum would be less.
// Add the neighbors to the activeNodes list if they are not already on it.

pathMatrix.prototype.explore = function ( x, y ) {
	
	var currentNode = x.toString() + "," + y.toString();
	
	debugWrite( 2, "exploring " + currentNode );
	
	if ((x >= this.dimension) || (y >= this.dimension)) {
		throw  "explore called with invalid arguments (" + currentNode +
				") for dimension " + this.dimension.toString();
	}

	// does it have a right neighbor? If so, process it.
	if (parseInt(x)+1 < this.dimension) {
		var newX = parseInt(x)+1;

		// compute value along this path
		var rightValue = parseInt(this.nodeSums[x][y]) + parseInt(this.nodeValues[newX][y]);
		// update this neighbor's cellValue if this path is less
		if (this.nodeSums[newX][y] === undefined) {
			// first visit to this cell so we know this path is minimum
			this.nodeSums[newX][y] = rightValue;
		} else if (rightValue < this.nodeSums[newX][y]) {
			this.nodeSums[newX][y] = rightValue;
		}
		// add this neighbor to the activeNodes list
		this.activeNodes[ newX.toString() + "," + y.toString() ] = 1;
	}
	// have a left neighbor? If so, process it.
	if (parseInt(y)+1 < this.dimension) {
		var newY = parseInt(y)+1;

		// compute value along this path
		var leftValue = parseInt(this.nodeSums[x][y]) + parseInt(this.nodeValues[x][newY]);
		// update this neighbor's cellValue if this path is less
		if (this.nodeSums[x][newY] === undefined) {
			// first visit to this cell so we know this path is minimum
			this.nodeSums[x][newY] = leftValue;
		} else if (leftValue < this.nodeSums[x][newY]) {
			this.nodeSums[x][newY] = leftValue;
		}
		// add this neighbor to the activeNodes list
		this.activeNodes[ x.toString() + "," + newY.toString() ] = 1;
	}
	// remove the current cell from the active list
	delete this.activeNodes[ currentNode ];
	debugWrite( 2, "deleted " + currentNode );

};

pathMatrix.prototype.process = function() {

	// check that the pathMatrix is ready to process.
	// All rows should have been added.
	if ((this.dimension === 0) || (this.nodeValues.length !== this.dimension)) {
		throw "call to process pathMatrix before all values added";
	}
	
	// start with cell 0,0. Its nodeSum is itself. It becomes the only member of the
	//  activeNode list.
	var currentNode = "0,0";
	var currentX = 0;
	var currentY = 0;
	this.nodeSums[currentX][currentY] = this.nodeValues[currentX][currentY];
	this.activeNodes[ currentNode ] = 1;
	
	while (Object.keys(this.activeNodes).length > 0) {
		
		// Find the minimum in the updated activeNodes
		currentNode = this.minimumActive();
		var minimumXY = currentNode.split(',');
		currentX = minimumXY[0];
		currentY = minimumXY[1];
	
		// explore this node and compute nodeSums for its neighbors
		// they will be added to the activeNodes list and the current
		// node removed from it.
		this.explore( currentX, currentY );
	}
};
