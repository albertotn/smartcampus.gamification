angular.module('gamificationEngine.userStats', [])

.controller('UserStatsCtrl', function ($scope, $stateParams, $timeout, $filter, statsFactory) {
    $scope.$parent.selectedTab = 'users';
    $scope.player = {
        name: "Raffaele Calzà"
    }
});