angular.module('gamificationEngine.concepts', [])
	.controller('ConceptsCtrl', function ($scope, $rootScope, $uibModal, gamesFactory) {
		$rootScope.currentNav = 'concepts';

		//var game = $scope.game;

		$scope.points = {};
		//var instance = {};
		//$scope.points.name = instance.name;

		$scope.badges_collection = {};
		//$scope.instance = {};
		//$scope.badges_collection.name = instance.name;

		// Error alerts object
		$scope.alerts = {
			'genericError': false,
			'editInstanceError': '',
			'challengeError': '',
			'startError': false,
			'bonusError': false,
			'endError': false,
			'typeError': false,
			'pointsError': false,
			'listError': false,
			'challengeEdited': false
		};

		// SAVE button click event-handler
		$scope.addPoint = function () {
			$scope.alerts.editInstanceError = '';
			$scope.alerts.genericError = false;

			if (!$scope.points.name) {
				$scope.alerts.editInstanceError = 'messages:msg_instance_name_error';
			} else if (gamesFactory.existsInstanceByName($scope.game, $scope.points.name, 'points')) {
				$scope.alerts.editInstanceError = 'messages:msg_instance_name_exists_error';
			} else {
				$scope.disabled = true;
				gamesFactory.editInstance($scope.game, 'points', $scope.points).then(function (instance) {
					// Points instance edited
					//$scope.game.pointConcept.push(instance);
					$scope.game.pointConcept.unshift(instance);
					$scope.points.name = '';
					$scope.disabled = false;
					//$uibModalInstance.close();
				}, function (message) {
					// Show error alert
					$scope.alerts.genericError = 'messages:' + message;
					$scope.disabled = false;
				});
			}
		};

		// SAVE button click event-handler
		$scope.addBadge = function () {
			$scope.alerts.editInstanceError = '';
			$scope.alerts.genericError = false;

			if (!$scope.badges_collection.name) {
				$scope.alerts.editInstanceError = 'messages:msg_instance_name_error';
			} else if (gamesFactory.existsInstanceByName($scope.game, $scope.badges_collection.name, 'badges_collections')) {
				$scope.alerts.editInstanceError = 'messages:msg_instance_name_exists_error';
			} else {
				$scope.disabled = true;
				gamesFactory.editInstance($scope.game, 'badges_collections', $scope.badges_collection).then(function (instance) {
					// Badges collection instance edited
					//$scope.game.badgeCollectionConcept.push(instance);
					$scope.game.badgeCollectionConcept.unshift(instance);
					$scope.badges_collection.name = '';
					$scope.disabled = false;
				}, function (message) {
					// Show error alert
					$scope.alerts.genericError = 'messages:' + message;
					$scope.disabled = false;
				});
			}
		};

		$scope.deleteConcept = function (instance, type) {
			// Delete a game
			var modalInstance = $uibModal.open({
				templateUrl: 'modals/modal_delete_confirm.html',
				controller: 'DeleteConceptConfirmModalInstanceCtrl',
				backdrop: "static",
				resolve: {
					game: function () {
						return $scope.game;
					},
					instance: function () {
						return instance;
					},
					type: function () {
						return type;
					}
				}
			});
		};

		function resetAlerts() {
			$scope.alerts.challengeError = '';
			$scope.alerts.startError = false;
			$scope.alerts.bonusError = false;
			$scope.alerts.endError = false;
			$scope.alerts.typeError = false;
			$scope.alerts.pointsError = false;
			$scope.alerts.listError = false;
			$scope.alerts.challengeEdited = false;
		}

		$scope.isCollapsed = true;
		$scope.title = "labels:title_add_challenge";
	
		$scope.addChallenge = function () {
			$scope.title = "labels:title_add_challenge";
			newChallenge = true;
			
			$scope.input = {};
			$scope.input.start = new Date();
			$scope.input.end = new Date();
			$scope.isCollapsed = false;
			$scope.alerts.challengeEdited = false;
		};

		$scope.cancel = function () {
			resetAlerts();
			$scope.isCollapsed = true;
		};

		var errors = 0;
		$scope.saveChallenge = function () {
			resetAlerts();
			var valid = true;

			if (document.getElementsByClassName('has-error').length > errors) {
				$scope.alerts.startError = true;
				errors++;
				valid = false;
			}
			if (document.getElementsByClassName('has-error').length > errors) {
				$scope.alerts.endError = true;
				valid = true;
			}
			errors = 0;
			if (!$scope.input.bonus) {
				errors++;
				$scope.alerts.bonusError = true;
				valid = false;
			}
			if (!$scope.input.challengeType) {
				errors++;
				$scope.alerts.typeError = true;
				valid = false;
			}
			if (!$scope.input.points) {
				errors++;
				$scope.alerts.pointsError = true;
				valid = false;
			}
			if (!$scope.input.list) {
				errors++;
				$scope.alerts.listError = true;
				valid = false;
			}

			if (valid) {
				$scope.disabled = true;
				gamesFactory.editInstance($scope.game, 'challenges', $scope.input).then(function (instance) {
					$scope.game.challenges.unshift(instance);
					$scope.isCollapsed = true;
					$scope.alerts.challengeEdited = true;
					$scope.disabled = false;
				}, function (message) {
					// Show error alert
					$scope.alerts.challengeError = 'messages:' + message;
					$scope.disabled = false;
				});
			}
		};

		var newChallenge = true;
	
		$scope.editChallenge = function (editingChallenge) {
			$scope.title = "labels:title_edit_challenge";
			newChallenge = false;
			
			$scope.input.start = editingChallenge.start;
			$scope.input.bonus = editingChallenge.bonus;
			$scope.input.end = editingChallenge.end;
			$scope.input.challengeType = editingChallenge.challengeType;
			$scope.input.points = editingChallenge.points;
			$scope.input.list = editingChallenge.list;
			
			$scope.isCollapsed = false;
			$scope.alerts.challengeEdited = false;
		};

		/*gamesFactory.getChallenges($rootScope.currentGameId).then(function (challenges) {
			$scope.challenges = challenges;
		});*/

		/*gamesFactory.getPoints($rootScope.currentGameId).then(function (points) {
			$scope.points = points;
		});

		gamesFactory.getBadges($rootScope.currentGameId).then(function (badges) {
			$scope.badges = badges;
		});*/
	});

modals.controller('DeleteConceptConfirmModalInstanceCtrl', function ($scope, $uibModalInstance, instance, game, type, gamesFactory) {
	$scope.argument = instance.name;

	$scope.alerts = {
		'deleteError': false,
	}

	// DELETE button click event-handler
	$scope.delete = function () {
		var idx = 0;
		var a = [];

		var tmpGame = angular.copy(game);
		if (type === 'point') {
			a = tmpGame.pointConcept;
		} else if (type === 'badge') {
			a = tmpGame.badgeCollectionConcept;
		} else if (type === 'challenge') {
			a = tmpGame.challenges;
		}
		a.forEach(function (c) {
			if (c.id === instance.id && c.name === instance.name) {
				a.splice(idx, 1);
			}
			idx++;
		});

		gamesFactory.saveGame(tmpGame).then(
			function () {
				if (type === 'point') {
					game.pointConcept = a;
				} else if (type === 'badge') {
					game.badgeCollectionConcept = a;
				} else if (type === 'challenge') {
					game.challenges = a;
				}
				$uibModalInstance.close();
			},
			function (message) {
				$scope.alerts.deleteError = true;
			}
		);
	};

	// CANCEL button click event-handler
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
