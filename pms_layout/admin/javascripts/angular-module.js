angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
        .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');

            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            }
        });