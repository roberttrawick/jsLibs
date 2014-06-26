// View grid methods

// viewGrid -	constructs a viewGrid object
// addRow -		contains all elements of the grid as a list of strings,
//				which may be html
//				all calls to addRow must have the same length list
// display -	takes a DOM object where the grid should be displayed
//				all rows must be added at the time display is called
//				viewGrid will remember where the grid was displayed and use
//				that location to update cells
// updateCell - updates the contents of the cell at the given x,y location
//				locations are 0-based starting in the upper left corner
//				argument is a string which may be html. Updates occur in the
//				viewGrid data as well as the display
// dimension -	the length of a row or column of the grid

// global counter for giving each viewGrid a unique id when it is displayed
var vgTabCounter = 0;


// construct a viewGrid
function viewGrid() {
	this.dimension = 0;
	this.data = [];
}

viewGrid.prototype.addRow = function ( rowItems ) {
	
	// on the first call, capture the number of items as grid dimension
	if (this.dimension === 0) {
		this.dimension = arguments.length;
	} else {
		if (arguments.length !== this.dimension) {
			throw "addRow argument count (" + arguments.length + ") mismatch";
		}
	}
	// add this row to the viewGrid data array
	this.data.push( Array.prototype.slice.call( arguments ) );
}

// display the grid in the element with the given parentId
// optionally provide names of CSS classes for the table elements
viewGrid.prototype.display = function ( parentId, tableClass, rowClass, cellClass ) {
	var html;
	var row, column;
	
	this.tableId = "vg-tab-" + vgTabCounter.toString();
	vgTabCounter = vgTabCounter + 1;
	
	// prepare the class strings
	var tClassString = "";
	if ((arguments.length > 1) && (tableClass.length > 0)) {
		tClassString = "class='" + tableClass + "'";
	}
	var rClassString = "";
	if ((arguments.length > 2) && (rowClass.length > 0)) {
		rClassString = "class='" + rowClass + "'";
	}
	var cClassString = "";
	if ((arguments.length > 3) && (cellClass.length > 0)) {
		cClassString = "class='" + cellClass + "'";
	}
	
	html = "<table " + tClassString + "id='" + this.tableId + "'>\n";
	this.displayLocation = parentId;
	for (row = 0; row < this.dimension; ++row) {
		html = html + "<tr " + rClassString + ">";
		for (column = 0; column < this.dimension; ++column) {
			html = html + "<td " + cClassString + ">" + this.data[row][column] + "</td>";
		}
		html = html + "</tr>\n";
	}
	html = html + "</table>\n";
	
	document.getElementById( parentId ).innerHTML = html;
}

viewGrid.prototype.updateCell = function ( rowIndex, colIndex, content ) {

    var tableElement = document.getElementById( this.tableId );
	var grid = tableElement.rows;
    var row = grid[rowIndex].cells;
    row[colIndex].innerHTML = content;
}
