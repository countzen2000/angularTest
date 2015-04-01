app = (function() {
/*************************************************************
	Dependencies
*************************************************************/
	var spot = spotify;
	var jquery = $;
	var drop = dropController;

/*************************************************************
	Private
*************************************************************/
	var scope;
	var ngDialog;

	var onSearchForAutoComplete = function(event) {
		spotify.songSearch(scope.searchQuery, scope.onSearchSuccess);
	};

	var onSearchSuccess = function(objects) {
		scope.currentList = objects.tracks.items;;
		console.log(scope.currentList);
		scope.$apply();
	}

	var addToPlayList = function(cEvent) {
		if (scope.currentList[cEvent.detail] != undefined) {
			scope.userList.push (scope.currentList[cEvent.detail]);
			scope.currentList.splice(cEvent.detail, 1);
			calculate();
			scope.$apply();
		}
		save();
	}

	var removeFromPlayList = function(id) {
		scope.userList.splice(id, 1);
		calculate();
		//scope.$apply();
	}

	var calculate = function() {
		var coolnessTotal = 0;
		var durationTotal = 0;

		if (scope.userList.length > 0 ) {
			for (datum in scope.userList)
			{
				coolnessTotal += scope.userList[datum].popularity * scope.userList[datum].duration_ms;
				durationTotal += scope.userList[datum].duration_ms;
			}
			scope.coolness = Math.round(coolnessTotal/durationTotal);
			scope.duration = Math.round(durationTotal/1000);
		} else {
			scope.coolness = "Not Cool";
			scope.duration = 0;
		}
	}

	var save = function() {
		if (scope.userList.length > 0 ) {
			window.localStorage.setItem("title", scope.title);
			window.localStorage.setItem("tags", scope.tags);
			window.localStorage.setItem("userList", JSON.stringify(scope.userList));
		}
	}

	var load = function() {
		scope.title = window.localStorage.getItem("title");
		scope.tags = window.localStorage.getItem("tags");
		var temp = JSON.parse(window.localStorage.getItem("userList"));
		if (temp.length > 0) {	
			scope.userList = temp;
			calculate();
		}
		scope.$apply();
	}


/*************************************************************
	Public
*************************************************************/

	var init = function() {
		
		var app = angular.module('playApp', ['ui.sortable', 'ngDialog'])
		.controller('MainCtrl', ['$scope', 'ngDialog', function($scope, ngDialog ) {
				scope = $scope;

				$scope.currentList =[];
				$scope.userList = [];
				$scope.coolness = "Not Cool";
				$scope.duration = "No";

				$scope.onSearchForAutoComplete = onSearchForAutoComplete;
				$scope.onSearchSuccess = onSearchSuccess;
				$scope.removeFromPlayList = removeFromPlayList;

				//ui.sortable
				$scope.dragControlListeners = {
				    containment: '#playList'
				};

				//ngDialog
				$scope.openReadme = function() {
					ngDialog.open({
						template: 'README.html',
						className: 'ngdialog-theme-default',
						cache: false
					});
				}

				//LocalStoarage
				$scope.save = save;
				$scope.tags = "";
				$scope.title = "";

		}]);

		addEventListener(dropController.ITEM_ADDED, addToPlayList, false);
		setTimeout(load, 100);
	}

	return {
		init:init
	}

}())