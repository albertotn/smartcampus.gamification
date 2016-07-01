angular.module('gamificationEngine.menuStats', [])

.controller('StatsCtrl', function ($scope, $stateParams, gamesFactory) {
    // Request game using GamesFactory service
    gamesFactory.getGameById($stateParams.id).then(function (game) {
        $scope.game = game;
        console.log(game);
    }, function () {
        $scope.alerts.loadGameError = true;
    });
});