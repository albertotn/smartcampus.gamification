angular.module('gamificationEngine.menuStats', [])

.controller('StatsCtrl', function ($scope, $stateParams, gamesFactory) {
    $scope.period = 'today';
    // Request game using GamesFactory service
    gamesFactory.getGameById($stateParams.id).then(function (game) {
        $scope.game = game;
    }, function () {
        $scope.alerts.loadGameError = true;
    });
});