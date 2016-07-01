angular.module('gamificationEngine.userStats', [])

.controller('UserStatsCtrl', function ($scope, $stateParams, $timeout, $filter, statsFactory) {
    $scope.$parent.selectedTab = 'users';

    statsFactory.getUsersCategories($stateParams.id).then(function (data) {
        $scope.usersCategories = data;
        $scope.usersCategory = data[0].name;
    }, function () {

    });

    $scope.searchStats = function () {
        // If user ID is empty
        if (!!$scope.userID) {
            // Get categories
        } else {
            // Get user
        }
    }

});