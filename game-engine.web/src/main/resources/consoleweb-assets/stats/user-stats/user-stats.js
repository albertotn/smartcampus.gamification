angular.module('gamificationEngine.userStats', [])

.controller('UserStatsCtrl', function ($scope, $stateParams, $timeout, $filter, statsFactory) {
    $scope.$parent.selectedTab = 'users';

    statsFactory.getUsersCategories($stateParams.id).then(function (data) {
        $scope.usersCategories = data;
        $scope.usersCategory = data[0].name;
    }, function () {

    });

    $scope.searchStats = function () {
        $scope.chartsData = {
            matchs: {
                type: 'line',
                series: [],
                labels: [],
                data: [[]],
                options: {},
                colors: [{
                    backgroundColor: 'rgba(230, 126, 24,0.2)',
                    pointBackgroundColor: 'rgba(230, 126, 24,1)',
                    pointHoverBackgroundColor: 'rgba(230, 126, 24,1)',
                    borderColor: 'rgba(230, 126, 24,1)',
                    borderWidth: 4,
                    pointBorderColor: 'rgba(230, 126, 24,1)',
                    pointHoverBorderColor: 'rgba(230, 126, 24,0.8)'
      }]
            },
            points: {
                type: 'pie',
                series: [],
                labels: [],
                data: [],
                options: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            },
            challenges: {
                type: 'pie',
                series: [],
                labels: [],
                data: [],
                options: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        }
        if ($scope.userID) {
            // Get user
            console.log("user search");

        } else {
            statsFactory.getCategoryStats($scope.usersCategory.id).then(function (data) {
                $scope.chartsData.matchs.series.push('Giocate');
                data.graphsData.matchs.forEach(function (element, idx) {
                    $scope.chartsData.matchs.labels.push(element.date);
                    $scope.chartsData.matchs.data[0].push(element.number);
                });

                data.graphsData.points.forEach(function (element, idx) {
                    $scope.chartsData.points.labels.push(element.name);
                    $scope.chartsData.points.data.push(element.points);
                });

                data.graphsData.challenges.forEach(function (element, idx) {
                    $scope.chartsData.challenges.labels.push(element.status);
                    $scope.chartsData.challenges.data.push(element.number);
                })
            });
        }
        $scope.showCharts = true;
    }

});