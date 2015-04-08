angular.module('weatherApp', ['ngRoute', 'ngResource'])
.config(function($routeProvider) {
   $routeProvider.when('/', {
       templateUrl: 'pages/home.html',
       controller: 'homeController'
   }).when('/forecast', {
        templateUrl: 'pages/forecast.html',
       controller: 'forecastController'
   }).when('/forecast/:days', {
       templateUrl: 'pages/forecast.html',
       controller: 'forecastController'
   });
})
.service('cityService', function() {
    this.city = 'Chisinau';
})
.controller('homeController', function($scope, cityService) {
    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
})
.controller('forecastController', function($scope, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",
                            { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" } });

    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, units: 'metric', cnt: $scope.days });

    $scope.convertToDate= function(dt) {
        return new Date(dt * 1000);
    }
})
.directive('weatherReport', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/report.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToDate: '&',
            dateFormat: '@'
        }
    }
});