var base_url = 'http://localhost/pms_layout'
angular.module('members_area', [])
        .controller('myCtrl', ['$scope', '$http', function ($scope, $http) {
                $scope.board = {};
                $scope.personalTeam = {};
                $scope.businessTeam = {};
                $scope.results = [];
                $scope.create_board = function () {
                    $http.post(base_url + '/json_data/boards.json', {params: $scope.board},
                            function (response) {
                                $scope.results = response;
                            },
                            function (failure) {
                                console.log("failed :(", failure);
                            });
                };
                $scope.create_personal_team = function () {
                    $http.post(base_url + '/json_data/boards.json', {params: $scope.personalTeam},
                            function (response) {
                                $scope.results = response;
                            },
                            function (failure) {
                                console.log("failed :(", failure);
                            });
                };
                $scope.create_business_team = function () {
                    $http.post(base_url + '/json_data/boards.json', {params: $scope.businessTeam},
                            function (response) {
                                $scope.results = response;
                            },
                            function (failure) {
                                console.log("failed :(", failure);
                            });
                };
            }]);
