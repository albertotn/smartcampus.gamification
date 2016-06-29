angular.module('gamificationEngine.stats', [])

.controller('StatsCtrl', function ($scope, $stateParams, gamesFactory, statsFactory) {
    $scope.alerts = {
        'loadGameError': false
    };

    // Set default period to today
    $scope.period = 'today';

    // Request gama using GamesFactory service
    gamesFactory.getGameById($stateParams.id).then(function (game) {
        $scope.game = game;
        console.log(game);
    }, function () {
        $scope.alerts.loadGameError = true;
    });

    statsFactory.getFromRangeStats(334, 343).then(function (data) {
        $scope.stats = data;
    }, function () {
        $scope.alerts.loadGameError = true;
    });
});