angular.module('gamificationEngine.stats', [])

.controller('StatsCtrl', function ($scope, $stateParams, $timeout, gamesFactory, statsFactory) {
    $scope.alerts = {
        'loadGameError': false
    };

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
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointHoverBackgroundColor: 'rgba(148,159,177,1)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
                {
                    backgroundColor: 'rgba(77,83,96,0.2)',
                    pointBackgroundColor: 'rgba(77,83,96,1)',
                    pointHoverBackgroundColor: 'rgba(77,83,96,1)',
                    borderColor: 'rgba(77,83,96,1)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: 'rgba(77,83,96,0.8)'
      }
    ]
        },
        badges: {
            series: ['Numero utenti'],
            labels: [],
            data: [[]],
            options: {}
        },
        points: {
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
            labels: [],
            data:  [],
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        },
        globalChallenges: {
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
        console.log(game);
    }, function () {
        $scope.alerts.loadGameError = true;
    });

    statsFactory.getFromRangeStats(334, 343).then(function (data) {
        $scope.stats = data;
        // Players chart
        var array = [];
        $scope.chartsData.players.series.push('Numero giocatori');
        data.graphsData.totalPlayers.forEach(function (element, idx) {
            $scope.chartsData.players.labels.push(element.date);
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

    }, function () {
        $scope.alerts.loadGameError = true;
    });
});