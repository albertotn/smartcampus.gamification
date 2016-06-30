angular.module('gamificationEngine.stats', [])

.controller('StatsCtrl', function ($scope, $stateParams, $timeout, $filter, gamesFactory, statsFactory) {
    $scope.alerts = {
        'loadGameError': false
    };;

    // Set default period to today
    $scope.period = 'today';
    $scope.chartsData = {
        players: {
            type: 'line',
            series: [],
            labels: [],
            data: [],
            options: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            colors: [
                {
                    backgroundColor: 'rgba(230, 126, 24,0.2)',
                    pointBackgroundColor: 'rgba(230, 126, 24,1)',
                    pointHoverBackgroundColor: 'rgba(230, 126, 24,1)',
                    borderColor: 'rgba(230, 126, 24,1)',
                    borderWidth: 4,
                    pointBorderColor: 'rgba(230, 126, 24,1)',
                    pointHoverBorderColor: 'rgba(230, 126, 24,0.8)'
      },
                {
                    backgroundColor: 'rgba(231,76,60,0.4)',
                    pointBackgroundColor: 'rgba(231,76,60,1)',
                    pointHoverBackgroundColor: 'rgba(231,76,60,1)',
                    borderColor: 'rgba(231,76,60,1)',
                    borderWidth: 4,
                    pointBorderColor: 'rgba(231,76,60,1)',
                    pointHoverBorderColor: 'rgba(231,76,60,1)'
      }
    ]
        },
        badges: {
            series: ['Numero utenti'],
            labels: [],
            data: [[]],
            options: {},
            colors: [
                {
                    backgroundColor: 'rgba(243, 45, 58,0.2)',
                    pointBackgroundColor: 'rgba(243, 45, 58,1)',
                    pointHoverBackgroundColor: 'rgba(243, 45, 58,1)',
                    borderColor: 'rgba(243, 45, 58,1)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgba(243, 45, 58,0.8)'
      }],
            details: {
                series: ['-'],
                labels: [],
                data: [[]],
                options: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                colors: [
                    {
                        backgroundColor: 'rgba(251, 166, 75,0.2)',
                        pointBackgroundColor: 'rgba(251, 166, 75,1)',
                        pointHoverBackgroundColor: 'rgba(251, 166, 75,1)',
                        borderColor: 'rgba(251, 166, 75,1)',
                        pointBorderColor: '#fff',
                        pointHoverBorderColor: 'rgba(251, 166, 75,0.8)'
      }]
            }
        },
        points: {
            type: 'pie',
            labels: [],
            data: [],
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        },
        actions: {
            type: 'pie',
            labels: [],
            data:  [],
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        },
        matchPlayers: {
            series: ['Numero utenti'],
            labels: [],
            data: [[]],
            colors: [
                {
                    backgroundColor: 'rgba(60, 180, 176,0.2)',
                    pointBackgroundColor: 'rgba(60, 180, 176,1)',
                    pointHoverBackgroundColor: 'rgba(60, 180, 176,1)',
                    borderColor: 'rgba(60, 180, 176,1)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgba(60, 180, 176,0.8)'
      }],
            options: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        },
        globalChallenges: {
            type: 'horizontalBar',
            series: [],
            labels: [],
            data: [],
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    };

    // Request gama using GamesFactory service
    gamesFactory.getGameById($stateParams.id).then(function (game) {
        $scope.game = game;
    }, function () {
        $scope.alerts.loadGameError = true;
    });

    statsFactory.getFromRangeStats(334, 343).then(function (data) {
            $scope.stats = data;
            // Players chart
            var array = [];
            $scope.chartsData.players.series.push('Numero giocatori');
            data.graphsData.totalPlayers.forEach(function (element, idx) {
                $scope.chartsData.players.labels.push($filter('date')(element.date, "dd/MM/yyyy"));
                array.push(element.number);
            });
            $scope.chartsData.players.data.push(array);

            array = [];
            $scope.chartsData.players.series.push('Giocatori attivi');
            data.graphsData.activePlayers.forEach(function (element, idx) {
                array.push(element.number);
            });
            $scope.chartsData.players.data.push(array);

            // Badge chart
            data.graphsData.badgeCategories.forEach(function (element, idx) {
                $scope.chartsData.badges.labels.push(element.name);
                $scope.chartsData.badges.data[0].push(element.users);
            });

            // Points chart
            data.graphsData.typeOfPoints.forEach(function (element, idx) {
                $scope.chartsData.points.data.push(element.points);
                $scope.chartsData.points.labels.push(element.name);
            });

            // Actions chart
            data.graphsData.typeOfAtions.forEach(function (element, idx) {
                $scope.chartsData.actions.data.push(element.matchs);
                $scope.chartsData.actions.labels.push(element.name);
            });

            // Global result for challenges
            $scope.chartsData.globalChallenges.series.push('Tutte le challenge');
            $scope.chartsData.globalChallenges.data.push([]);
            data.graphsData.globalChallengesStatus.forEach(function (element, idx) {
                $scope.chartsData.globalChallenges.data[0].push(element.number);
                $scope.chartsData.globalChallenges.labels.push(element.status);
            });

            // All Challenges
            data.graphsData.typeOfChallenges.forEach(function (challenge, idx) {
                $scope.chartsData.globalChallenges.series.push(challenge.name);
                var data = [];
                challenge.data.forEach(function (element, idx) {
                    data.push(element.number);
                });
                $scope.chartsData.globalChallenges.data.push(data);
            });

            data.graphsData.matchsPerPlayers.forEach(function (element, idx) {
                $scope.chartsData.matchPlayers.labels.push(element.range);
                $scope.chartsData.matchPlayers.data[0].push(element.users);
            });

        },
        function () {
            $scope.alerts.loadGameError = true;
        });

    $scope.badgeCatClick = function (points, evt) {
        if (!points[0]) return;
        $scope.categoryBadge = points[0]._model.label;

        $scope.chartsData.badges.details.series[0] = $scope.categoryBadge;
        $scope.chartsData.badges.details.labels = [];
        $scope.chartsData.badges.details.data = [[]];

        var badges;
        // Find badges category
        $scope.stats.graphsData.badgeCategories.forEach(function (cat, idx) {
            if (cat.name == $scope.categoryBadge)
                badges = cat.badges;
        });

        badges.forEach(function (badge, idx) {
            $scope.chartsData.badges.details.data[0].push(badge.users);
            $scope.chartsData.badges.details.labels.push(badge.name);
        });
        console.log($scope.chartsData.badges.details);
        $scope.$apply();
    };
});