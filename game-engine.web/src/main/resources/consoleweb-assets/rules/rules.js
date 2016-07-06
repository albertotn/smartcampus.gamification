angular.module('gamificationEngine.rules', [])
	.controller('RulesCtrl', function ($scope, $rootScope, $stateParams, $uibModal, gamesFactory) {
		$rootScope.currentNav = 'rules';
		$rootScope.currentGameId = $stateParams.id;

		$scope.list = true;

		$scope.hideRule = true;
		$scope.title = "labels:title_add_rule";

		//$scope.ruleContent = '';
		$scope.input = {};
		$scope.alerts = {
			'nameError': false,
			'contentError': false,
			'ruleError': '',
			'draftError': '',
			'ruleEdited': false
		};
		var previousName = '';

		var rule;
		var game = $scope.game;

		function resetAlerts() {
			$scope.alerts.nameError = false;
			$scope.alerts.contentError = false;
			$scope.alerts.ruleError = '';
			$scope.alerts.ruleValidation = '';
			$scope.alerts.draftError = '';
		}
		/*if (rule) {
			gamesFactory.getRule(game, rule.id).then(
				function (data) {
					if (data) {
						$scope.input.name = data.name;
						$scope.input.ruleContent = data.content;

						previousName = data.name;
						//previousContent = data.content;
					}
				},
				function (message) {
					// Show given error alert
					$scope.alerts.ruleError = 'messages:' + message;
				});
		}*/

		$scope.saveRule = function (published) {
			resetAlerts();
			var valid = true;

			if (!$scope.input.ruleContent || $scope.input.ruleContent.length == 0) {
				$scope.alerts.contentError = true;
				valid = false;
			}
			if (!$scope.input.name || $scope.input.name.length == 0) {
				$scope.alerts.nameError = true;
				valid = false;
			}
			/*if (!$scope.input.draftContent || $scope.input.draftContent.length == 0) {
				$scope.alerts.draftError = true;
				valid = false;
			}*/

			if (valid) {
				//$scope.disabled = true;
				//check if already exist
				var found = false;
				if (game.rules && (!rule || rule.name != $scope.input.name)) {
					//if (game.rules) {
					for (var i = 0; i < game.rules.length && !found; i++) {
						found = game.rules[i].name == $scope.input.name;
						//if (found) break;
					}
					//}
				}

				if (!found) {
					$scope.disabled = true;

					var r = (rule) ? rule : {};
					r.name = $scope.input.name;

					//r.published = published;
					//r.lastUpdate = Date().getTime();
					r.lastUpdate = Date.now(); // CHECK IF IS CORRECT
					
					var previousStatus = (rule) ? rule.published : false;
					if (rule) {
						if (previousStatus) {
							r.published = true;
						} else {
							r.published = published;
						}
					} else {
						r.published = published;
					}


					if (rule) {
						console.log(previousStatus);
						if (previousStatus) {
							if (published) {
								if (rule.draftContent && rule.draftContent != '') {
									r.content = $scope.input.draftContent;
									r.draftContent = '';
								} else {
									r.content = $scope.input.ruleContent;
									r.draftContent = '';
								}
								//r.draftContent = $scope.input.draftContent;
							} else {
								if (!rule.draftContent || rule.draftContent == '') {
									r.draftContent = $scope.input.ruleContent;
								} else {
									r.draftContent = $scope.input.draftContent;
								}
							}
						} else {
							if (published) {
								console.log("hi");
								r.content = $scope.input.ruleContent;
								r.draftContent = '';
							} else {
								console.log("maybe here..");
								//r.content = '';
								r.draftContent = $scope.input.ruleContent;
							}
						}
					} else {
						if (published) {
							r.content = $scope.input.ruleContent;
						} else {
							r.draftContent = $scope.input.ruleContent;
						}
					}
					/*if (rule && !rule.published) {
						if (published) {
							r.content = $scope.input.draftContent;
						} else {
							r.draftContent = $scope.input.draftContent;
						}
					} else {
						if (published) {
							r.content = $scope.input.ruleContent;
						} else {
							r.draftContent = $scope.input.draftContent;
						}
					}*/

					/*if (published) {
						if (rule && !rule.published) {
							r.content = $scope.input.draftContent;
							r.draftContent = '';
						} else {
							r.content = $scope.input.ruleContent;
							r.draftContent = '';
						}
					} else {
						if (rule) {
							r.draftContent = $scope.input.draftContent;
						} else {
							r.draftContent = $scope.input.ruleContent;
						}
					}*/

					console.log(r);
					if ($scope.input.name != 'constants') {
						gamesFactory.validateRule($scope.input.ruleContent).then(function (data) {
							if (data.length > 0) {
								$scope.alerts.ruleValidation = data;
								$scope.disabled = false;
							} else {
								addRuleAPI(game, r);
							}
						}, function (msg) {
							r.name = previousName;
							$scope.alerts.ruleError = 'messages:' + msg;
							$scope.disabled = false;
						});
					} else {
						addRuleAPI(game, r);
					}
				} else {
					$scope.alerts.ruleError = 'messages:msg_error_exist';
					//$scope.disabled = false;
				}
				/*if (found) {
					$scope.alerts.ruleError = 'messages:msg_error_exist';
					$scope.disabled = false;
					return;
				}

				var r = {};

				if (rule) {
					r = rule;
				}
				r.name = $scope.input.name;
				r.content = $scope.input.ruleContent;

				if ($scope.input.name === 'constants') {
					gamesFactory.addRule(game, r).then(
						function (data) {
							if (!game.rules) {
								game.rules = [];
							}
							if (!rule) {
								game.rules.push(data);
							}
							$scope.disabled = false;
							$scope.list = true;
							$scope.alerts.ruleEdited = true;
						},
						function (message) {
							r.name = previousName;
							// Show given error alert
							$scope.alerts.ruleError = 'messages:' + message;
							$scope.disabled = false;
						});
				} else {
					gamesFactory.validateRule($scope.input.ruleContent).then(function (data) {
						if (data.length > 0) {
							$scope.alerts.ruleValidation = data;
							$scope.disabled = false;
							return;
						}
						gamesFactory.addRule(game, r).then(
							function (data) {
								if (!game.rules) {
									game.rules = [];
								}
								if (!rule) {
									game.rules.push(data);
								}
								$scope.disabled = false;
								$scope.list = true;
								$scope.alerts.ruleEdited = true;
							},
							function (message) {
								r.name = previousName;
								// Show given error alert
								$scope.alerts.ruleError = 'messages:' + message;
								$scope.disabled = false;
							});
					}, function (msg) {
						r.name = previousName;
						$scope.alerts.ruleError = 'messages:' + msg;
						$scope.disabled = false;
					});
				}*/
			}
			/* else {
							$scope.alerts.ruleError = 'messages:msg_empty_fields';
							$scope.disabled = false;
						}*/
		};

		function addRuleAPI(game, r) {
			gamesFactory.addRule(game, r).then(
				function (data) {
					if (!game.rules) {
						game.rules = [];
					}
					if (!rule) {
						//game.rules.push(data);
						game.rules.unshift(data);
					}
					$scope.disabled = false;
					$scope.list = true;
					$scope.alerts.ruleEdited = true;
				},
				function (message) {
					r.name = previousName;
					// Show given error alert
					$scope.alerts.ruleError = 'messages:' + message;
					$scope.disabled = false;
				});
		}

		$scope.cancel = function () {
			$scope.list = true;
			resetAlerts();
		}

		$scope.addRule = function () {
			$scope.input = {};
			rule = null;
			$scope.alerts.ruleEdited = false;
			$scope.list = false;
			$scope.title = "labels:title_add_rule";
		}

		$scope.editRule = function (editingRule) {
			rule = editingRule;
			$scope.alerts.ruleEdited = false;
			$scope.list = false;
			$scope.title = "labels:title_edit_rule";

			//if (rule) {
			gamesFactory.getRule(game, rule.id).then(
				function (data) {
					if (data) {
						$scope.input.name = data.name;
						$scope.input.ruleContent = (data.published) ? data.content : data.draftContent;
						$scope.input.draftContent = (data.published) ? data.draftContent : '';
						$scope.input.published = data.published;
						$scope.input.lastUpdate = data.lastUpdate;
						$scope.input.status = (data.published) ? 'PUBLISHED' : 'DRAFT';

						previousName = data.name;
						//previousContent = data.content;
					}
				},
				function (message) {
					// Show given error alert
					$scope.input = {};
					$scope.alerts.ruleError = 'messages:' + message;
				});
			//}
		}

		$scope.convertDate = function (ts) {
			var date = new Date(ts);
			return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
		};

		$scope.rules = [];

		$scope.showRule = function (index) {
				var rule = game.rules[index];
				if (rule.published) {
					gamesFactory.getRule(game, rule.id).then(
						function (data) {
							if (data) {
								//$scope.ruleContent = data.content;
								$scope.rules[index] = data.content;

								//previousName = data.name;
								//previousContent = data.content;
							}
						},
						function (message) {
							// Show given error alert
							$scope.rules[index] = '';
							$scope.alerts.ruleError = 'messages:' + message;
						});
				} else {
					// ---- TODO: DOWNLOAD DRAFT CONTENT FROM DB ---- //
					$scope.rules[index] = rule.draftContent;
				}
			}
			//Add action
			/*$scope.openAddRuleModal = function () {
				var modalInstance = $uibModal.open({
					templateUrl: 'rules/modal_rule_edit.html',
					controller: 'EditRuleModalInstanceCtrl',
					backdrop: "static",
					resolve: {
						game: function () {
							return $scope.game;
						},
						rule: function () {}
					}
				});
			};

			//Add action
			$scope.editRule = function (rule) {
				var modalInstance = $uibModal.open({
					templateUrl: 'rules/modal_rule_edit.html',
					controller: 'EditRuleModalInstanceCtrl',
					backdrop: "static",
					resolve: {
						game: function () {
							return $scope.game;
						},
						rule: function () {
							return rule;
						}
					}
				});
			};*/

		$scope.deleteRule = function (rule) {
			// Delete a game
			var modalInstance = $uibModal.open({
				templateUrl: 'modals/modal_delete_confirm.html',
				controller: 'DeleteRuleModalInstanceCtrl',
				backdrop: "static",
				resolve: {
					game: function () {
						return $scope.game;
					},
					rule: function () {
						return rule;
					}
				}
			});
		};

		$scope.search = 'all';
		$scope.filterRules = function (rule) {
			if ($scope.search == 'all' || (rule.published.toString() == $scope.search)) {
				return rule;
			}
		}

		$scope.searchText = '';
		$scope.searchRules = function (rule) {
			if (rule.name.indexOf($scope.searchText) > -1) {
				return rule;
			}
		}

		// Load game
		gamesFactory.getGameById($stateParams.id).then(function (game) {
			$scope.game = game;
			console.log(game.rules);
		}, function () {
			// Show error alert
			$scope.alerts.loadGameError = true;
		});
	});

// Edit rule instance modal
modals
/*.controller('EditRuleModalInstanceCtrl', function ($scope, $uibModalInstance, gamesFactory, game, rule) {
		$scope.input = {};
		$scope.alerts = {
			'ruleError': ''
		};
		var previousName = '';

		if (rule) {
			gamesFactory.getRule(game, rule.id).then(
				function (data) {
					if (data) {
						$scope.input.name = data.name;
						$scope.input.ruleContent = data.content;

						previousName = data.name;
						//previousContent = data.content;
					}
				},
				function (message) {
					// Show given error alert
					$scope.alerts.ruleError = 'messages:' + message;
				});
		}

		$scope.save = function () {
			$scope.disabled = true;
			$scope.alerts.ruleError = '';

			if (!!$scope.input.ruleContent && $scope.input.ruleContent.length > 0 && $scope.input.name && $scope.input.name.length > 0) {

				//check if already exist
				var found = false;
				if (game.rules && $scope.input.name && (!rule || rule && rule.name !== $scope.input.name)) {
					for (var i = 0; i < game.rules.length; i++) {
						found = game.rules[i].name == $scope.input.name;
						if (found) break;
					}
				}

				if (found) {
					$scope.alerts.ruleError = 'messages:msg_error_exist';
					$scope.disabled = false;
					return;
				}

				var r = {};

				if (rule) {
					r = rule;
				}
				r.name = $scope.input.name;
				r.content = $scope.input.ruleContent;

				if ($scope.input.name === 'constants') {
					gamesFactory.addRule(game, r).then(
						function (data) {
							if (!game.rules) {
								game.rules = [];
							}
							if (!rule) {
								game.rules.push(data);
							}
							$uibModalInstance.close();
						},
						function (message) {
							r.name = previousName;
							// Show given error alert
							$scope.alerts.ruleError = 'messages:' + message;
							$scope.disabled = false;
						});
				} else {
					gamesFactory.validateRule($scope.input.ruleContent).then(function (data) {
						if (data.length > 0) {
							$scope.alerts.ruleValidation = data;
							$scope.disabled = false;
							return;
						}
						gamesFactory.addRule(game, r).then(
							function (data) {
								if (!game.rules) {
									game.rules = [];
								}
								if (!rule) {
									game.rules.push(data);
								}
								$uibModalInstance.close();
							},
							function (message) {
								r.name = previousName;
								// Show given error alert
								$scope.alerts.ruleError = 'messages:' + message;
								$scope.disabled = false;
							});
					}, function (msg) {
						r.name = previousName;
						$scope.alerts.ruleError = 'messages:' + msg;
						$scope.disabled = false;
					});
				}


			} else {
				$scope.alerts.ruleError = 'messages:msg_empty_fields';
				$scope.disabled = false;
			}
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})*/
// Delete rule modal
	.controller('DeleteRuleModalInstanceCtrl', function ($scope, $uibModalInstance, gamesFactory, game, rule) {
	$scope.alerts = {
		'deleteError': '',
	};
	$scope.argument = rule.name;

	$scope.delete = function () {
		gamesFactory.deleteRule(game, rule.id).then(
			function (data) {
				if (data) {
					var idx = 0;
					for (idx = 0; idx < game.rules.length; idx++) {
						if (game.rules[idx].id == rule.id) {
							break;
						}
					}
					game.rules.splice(idx, 1);
					$uibModalInstance.close();
				}
			},
			function (message) {
				$scope.alerts.deleteError = message;
			})
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
