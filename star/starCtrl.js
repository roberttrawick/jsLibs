// Code goes here

	var starApp = angular.module( "starApp", []);

	starApp.controller('starCtrl', function($scope) {
		$scope.ratioVal = 10;
		$scope.numPoints = 8;
		$scope.star = new Star( $scope.ratioVal/20, $scope.numPoints );
		// $scope.starPoints = $scope.star.svgPolygonPoints(100);
	});