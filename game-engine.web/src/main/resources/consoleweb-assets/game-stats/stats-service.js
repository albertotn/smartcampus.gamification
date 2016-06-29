angular.module('gamificationEngine.statsServices', [])

.factory('statsFactory', function ($rootScope, $http, $q, $timeout) {
    return {
        getGlobalStats: function () {
            // Request to server API without specify the range
        },
        getFromRangeStats: function (fromDate, toDate) {
            // Simulate the request to REST server
            var deferred = $q.defer();

            $http.get('/game-stats/stats.json').success(function (data) {
                deferred.resolve(data);
            }).error(
                function (e) {
                    deferred.reject(e);
                });
            return deferred.promise;
        }
    }
});