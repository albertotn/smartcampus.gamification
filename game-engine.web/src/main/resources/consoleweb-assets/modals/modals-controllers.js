/*
 *    Copyright 2015 Fondazione Bruno Kessler - Trento RISE
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

// Edit game modal
var modals = angular.module('gamificationEngine.modals', [])
	// Edit game modal
	.controller('EditGameModalInstanceCtrl', function ($scope, $uibModalInstance, game, gamesFactory) {
		$scope.newGame = {};
		$scope.newGame.name = game.name;

		if (game.expiration) {
			$scope.newGame.expiration = new Date(game.expiration);
		} else {
			$scope.newGame.neverending = true;
			$scope.newGame.expiration = new Date();
		}
		// Error alerts object
		$scope.alerts = {
			'editGameError': ''
		};

		$scope.closeAlert = function (alertName) {
			$scope.alerts[alertName] = '';
		}

		// OK button click event-handler
		$scope.ok = function () {

			var fields = {};
			fields.name = $scope.newGame.name;
			fields.expiration = $scope.newGame.expiration && !$scope.newGame.neverending ? $scope.newGame.expiration.getTime() : undefined;

			// Edit game
			gamesFactory.editGame(game, fields).then(
				function () {
					// Settings edited
					$uibModalInstance.close();
				},
				function (message) {
					// Show given error alert
					$scope.alerts.editGameError = message;
				}
			);
		};

		// CANCEL button click event-handler
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})

// Delete game modal
.controller('DeleteGameConfirmModalInstanceCtrl', function ($scope, $uibModalInstance, $window, game, gamesFactory) {
	$scope.argument = game.name;
	$scope.isGame = true;

	$scope.alerts = {
		'deleteError': '',
	}

	$scope.closeAlert = function (alertName) {
		$scope.alerts[alertName] = '';
	}

	// DELETE button click event-handler
	$scope.delete = function () {
		// Delete game
		gamesFactory.deleteGame(game).then(function () {
			// Game has been deleted
			// Redirect to homepage
			$window.location.href = '#/home';
			$uibModalInstance.close();
		}, function (data) {
			$scope.alerts.deleteError = data;
		});
	};

	// CANCEL button click event-handler
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	}
});

// Delete instance modal
/*.controller('DeleteInstanceConfirmModalInstanceCtrl', function ($scope, $uibModalInstance, $window, game, instance, instanceType, gamesFactory) {
	$scope.argument = instance.name;

	// DELETE button click event-handler
	$scope.delete = function () {
		gamesFactory.deleteInstance(game, instance, instanceType).then(function () {
			// Instance has been deleted
			// Redirect to homepage
			$window.location.href = '#/game/' + game.id;
			$uibModalInstance.close();
		});
	};

	// CANCEL button click event-handler
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});*/