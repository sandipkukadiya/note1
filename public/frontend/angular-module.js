var app = angular.module('frontend', ['ngRoute']);
var base_url = 'http://localhost:8000';

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('!');
    // configure the routing rules here
    $routeProvider.
            when('/', {
                controller: 'index'
            }).
            when('/post/:slug', {
                controller: 'singlePost'
            }).
            when('/category/:slug', {
                controller: 'archiveCtrl'
            });
});
app.controller('index', ['$scope', '$http', 'latestPosts', function ($scope, $http, latestPosts) {

        $scope.latest_posts = {};
        var post_type = 'post';
        /*Get All latest posts*/
        latestPosts.async(post_type).then(function (res) {
            $scope.latest_posts = res;
        });

    }]);
app.controller('archiveCtrl', ['$scope', '$http', '$routeParams', '$route', 'getSingleCategory', 'latestPosts', function ($scope, $http, $routeParams, $route, getSingleCategory, latestPosts) {

        $scope.archive_posts = {};
        var slug;
        $scope.$on('$routeChangeSuccess', function () {
            slug = $routeParams.slug;
            console.log(slug);
            getSingleCategory.async('/api/taxonomies?title=' + slug).then(function (res) {
                console.log(res);
                var id = res._id;
                archivePosts(id);
            });


        });
//        /*Get All latest posts*/
        var archivePosts = function (id) {

            latestPosts.async("/api/posts/byCategory/" + id).then(function (res) {
                console.log(res);
                $scope.archive_posts = res;
            });
        };

    }]);

app.controller('singlePost', ['$scope', '$routeParams', '$route', 'singleResult', function ($scope, $routeParams, $route, singleResult) {


        $scope.post = {};
        var slug;
        $scope.$on('$routeChangeSuccess', function () {
            slug = $routeParams.slug;
            singlePostDetails(slug);
        });
        var singlePostDetails = function (slug) {
            singleResult.async('/api/posts?post_link=' + slug).then(function (res) {
                $scope.post = res;
            });
        };
        $scope.display = function (value) {
            if (value === undefined) {
                console.log('hi');
                return false;
            } else {
                return true;
            }
        }
    }]);

app.factory('latestPosts', ['$http', function ($http) {
        var customPostDetails = {
            async: function (url) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url)
                        .then(function (response) {
                            /* create custom field as individual values */
                            angular.forEach(response.data, function (value, key) {
                                var custom_fields = value.custom_field;
                                value.publish_date = format_date(value.publish_date);
                                angular.forEach(custom_fields, function (v, k) {
                                    value[v.key] = v.value;
                                });
                                response.data[key] = value;
                            });
                            return response.data;
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return customPostDetails;
    }]);

app.factory('singleResult', ['$http', function ($http) {
        var result = {
            async: function (url) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url)
                        .then(function (response) {
                            /* create custom field as individual values */
                            angular.forEach(response.data, function (value, key) {
                                var custom_fields = value.custom_field;
                                value.publish_date = format_date(value.publish_date);
                                angular.forEach(custom_fields, function (v, k) {
                                    value[v.key] = v.value;
                                });
                                response.data[key] = value;
                            });
                            return response.data[0];
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return result;
    }]);

app.factory('getSingleCategory', ['$http', function ($http) {
        var result = {
            async: function (url) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get(url)
                        .then(function (response) {
                            /* create custom field as individual values */
                            return response.data[0];
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return result;
    }]);


/* test*/
app.filter("trust", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    }]);
/* convert ISO date to dd-mm-yyyy */
function format_date(date) {

    date = new Date(date);

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}