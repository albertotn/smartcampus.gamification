angular.module('gamificationEngine.monitor', [])
	.controller('MonitorCtrl', function ($scope, $rootScope, $stateParams, $uibModal, gamesFactory, $state) {
		$rootScope.currentGameId = $stateParams.id;
		$scope.currentPage = 1;
		$scope.items4Page = 10;

		if ($state.current.data) {
			$rootScope.page = $state.current.data.page;
		}

		if ($rootScope.monitorFilter) {
			$scope.searchText = $rootScope.monitorFilter;
		}


		// Load games
		gamesFactory.getGameById($stateParams.id).then(function (game) {
			$scope.game = game;
		}, function () {
			// Show error alert
			$scope.err = 'messages:msg_generic_error';
		});

		var enrichData = function (data) {
			data.forEach(function (p) {
				var badges = p.state['BadgeCollectionConcept'] ? p.state['BadgeCollectionConcept'] : [];
				var score = p.state['PointConcept'] ? p.state['PointConcept'] : [];
				p.totalBadges = 0;
				p.totalScore = 0;
				badges.forEach(function (b) {
					p.totalBadges += b.badgeEarned.length;
				});

				score.forEach(function (s) {
					p.totalScore += s.score;
				});
				p.hasCustomData = Object.keys(p.customData).length > 0;

				/* patch for an explicit request of peppo
				if custom data key contains '_startTs' or '_endTs' format it as a date
				THIS MUST TO BE RETHINK FOR A GENERIC PURPOSE
				*/

				Object.keys(p.customData).forEach(function (k) {
					if (k.indexOf('_startChTs') != -1 || k.indexOf('_endChTs') != -1) {
						p.customData[k] = moment(p.customData[k]).format('DD/MM/YYYY, HH:mm:ss');
					}
				});
			});

			return data;
		}

		$scope.hideDetails = true;


		gamesFactory.getPlayersState($rootScope.currentGameId, 'all', $scope.searchText, $scope.currentPage, $scope.items4Page).then(function (data) {
			data.content = enrichData(data.content);
			$scope.playerStates = data;
			$scope.totalItems = data.totalElements;
		}, function (msg) {
			$scope.err = 'messages:' + msg;
		});

		$scope.searchText = '';

		$scope.filter = function () {
			$rootScope.monitorFilter = $scope.searchText;
			gamesFactory.getPlayersState($rootScope.currentGameId, $scope.category, $scope.searchText, $scope.currentPage, $scope.items4Page).then(function (data) {
				data.content = enrichData(data.content);
				$scope.playerStates = data;
				$scope.totalItems = data.totalElements;
			}, function (msg) {
				$scope.err = 'messages:' + msg;
			});
		}

		$scope.update = function () {
			gamesFactory.getPlayersState($rootScope.currentGameId, $scope.category, $scope.searchText, $scope.currentPage, $scope.items4Page).then(function (data) {
				data.content = enrichData(data.content);
				$scope.playerStates = data;
				$scope.totalItems = data.totalElements;
			}, function (msg) {
				$scope.err = 'messages:' + msg;
			});
		};

		$scope.advancedFilter = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'game-monitor/modal_advanced_filter.html',
				controller: 'AdvancedFilterModalInstanceCtrl',
				backdrop: "static",
				resolve: {
					gameId: function () {
						return $rootScope.currentGameId;
					}
				}
			});
		};

		$scope.resetPlayer = function (player) {
			var modalInstance = $uibModal.open({
				templateUrl: 'game-monitor/modal_action_confirm.html',
				controller: 'ResetModalInstanceCtrl',
				backdrop: "static",
				resolve: {
					gameId: function () {
						return $rootScope.currentGameId;
					},
					player: function () {
						return player;
					}
				}
			});
		};

		$scope.blockPlayer = function (player) {
			var modalInstance = $uibModal.open({
				templateUrl: 'game-monitor/modal_action_confirm.html',
				controller: 'BlockModalInstanceCtrl',
				backdrop: "static",
				resolve: {
					gameId: function () {
						return $rootScope.currentGameId;
					},
					player: function () {
						return player;
					}
				}
			});
		};

		$scope.unlockPlayer = function (player) {
			gamesFactory.unlockPlayer($rootScope.currentGameId, player.playerId).then(function () {
				player.blocked = false;
			});
		}

		var editingPlayer = {};
		$scope.editPlayer = function (player) {
			$scope.input = angular.copy(player);
			editingPlayer = player;
		};

		$scope.save = function () {
			gamesFactory.editPlayer($rootScope.currentGameId, $scope.input).then(function () {
					$scope.success = "messages:msg_player_edited";
					editingPlayer = $scope.input;
				},
				function () {
					$scope.err = 'messages:msg_generic_error';
				});
		};

		$scope.addPoint = function (badgeCollection) {
			var modalInstance = $uibModal.open({
				templateUrl: 'game-monitor/modal_badge_selection.html',
				controller: 'BadgeSelectionModalInstanceCtrl',
				size: 'sm',
				backdrop: "static",
				resolve: {
					gameId: function () {
						return $rootScope.currentGameId;
					},
					badgeCollection: function () {
						return badgeCollection;
					}
				}
			});
		};
	});

modals.controller('AdvancedFilterModalInstanceCtrl', function ($scope, $uibModalInstance, gameId, gamesFactory) {
		gamesFactory.getBadges(gameId).then(function (data) {
			$scope.badges = data;
			// ONLY FOR DEBUG
			$scope.badges[0].points = ['10-point', '20-point', '30-point'];
			$scope.badges[1].points = ['point', '1point', '2point'];
			$scope.badges[2].points = ['10-health', '20-health', '30-health'];
			// END DEBUG
		}, function () {
			// Show error alert
			$scope.$parent.err = 'messages:msg_generic_error';
			$uibModalInstance.dismiss('cancel');
		});
	
		$scope.selectedBadges = [];
		$scope.toggleSelection = function (badge) {
			var idx = $scope.selectedBadges.indexOf(badge);

			if (idx > -1) {
				$scope.selectedBadges.splice(idx, 1);
			} else {
				$scope.selectedBadges.push(badge);
			}
		};

		$scope.confirm = function () {
			if ($scope.filterType == 'less') {
				// $scope.score.min
			} else if ($scope.filterType == 'more') {
				// $scope.score.max
			} else {
				// $scope.score.bMin
				// $scope.score.bMax
			}
			
			// $scope.selectedBadges;
			$uibModalInstance.close();
		};

		// CANCEL button click event-handler
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})
	.controller('ResetModalInstanceCtrl', function ($scope, $uibModalInstance, gameId, player, gamesFactory) {
		$scope.argument = player.playerId;
		$scope.action = 'reset';

		// DELETE button click event-handler
		$scope.confirm = function () {
			gamesFactory.resetPlayer(gameId, player.playerId).then(function () {
					player.totalBadges = 0;
					player.totalScore = 0;
					player.state.BadgeCollectionConcept = [];
					player.state.PointConcept = [];
					$uibModalInstance.close();
				},
				function () {
					$scope.deleteError = true;
				});
		};

		// CANCEL button click event-handler
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
	})
	.controller('BlockModalInstanceCtrl', function ($scope, $uibModalInstance, gameId, player, gamesFactory) {
		$scope.argument = player.playerId;
		$scope.action = 'block';

		// DELETE button click event-handler
		$scope.confirm = function () {
			gamesFactory.blockPlayer(gameId, player.playerId).then(function () {
					player.blocked = true;
					$uibModalInstance.close();
				},
				function () {
					$scope.deleteError = true;
				});
		};

		// CANCEL button click event-handler
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
	})
	.controller('BadgeSelectionModalInstanceCtrl', function ($scope, $uibModalInstance, gameId, badgeCollection, gamesFactory) {
		//$scope.badgeEarned = badgeCollection.badgeEarned;
		console.log(badgeCollection);

		gamesFactory.getListOfBadges(gameId, badgeCollection.name).then(function (data) {
				$scope.badges = data;
			},
			function () {
				$scope.$parent.err = 'messages:msg_generic_error';
				$uibModalInstance.dismiss('cancel');
			});

		$scope.isEarned = function (badge) {
			return (badgeCollection.badgeEarned.indexOf(badge) > -1) ? true : false;
		};

		$scope.toggleSelection = function (badge) {
			var idx = badgeCollection.badgeEarned.indexOf(badge);

			if (idx > -1) {
				badgeCollection.badgeEarned.splice(idx, 1);
			} else {
				badgeCollection.badgeEarned.push(badge);
			}
		};

		// ADD button click event-handler
		$scope.confirm = function () {
			$uibModalInstance.close();
		};

		// CANCEL button click event-handler
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
	});
