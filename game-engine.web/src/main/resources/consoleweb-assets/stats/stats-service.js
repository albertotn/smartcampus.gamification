angular.module('gamificationEngine.statsServices', [])

.factory('statsFactory', function ($rootScope, $http, $q, $timeout) {
    return {
        getGlobalStatsGame: function () {
            // Request to server API without specify the range
        },
        getFromRangeStatsGame: function (idGame, fromDate, toDate) {
            // Simulate the request to REST server
            var deferred = $q.defer();

            $http.get('/stats/game.json').success(function (data) {
                deferred.resolve(data);
            }).error(
                function (e) {
                    deferred.reject(e);
                });
            return deferred.promise;
        },
        getUsersCategories: function (idGame) {
            var deferred = $q.defer();

            $http.get('/stats/user-stats/users-category.json').success(function (data) {
                deferred.resolve(data);
            }).error(
                function (e) {
                    deferred.reject(e);
                });
            return deferred.promise;
        }
    }
});