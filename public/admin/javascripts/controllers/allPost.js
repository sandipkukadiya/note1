app.controller('allPost', ['$scope', '$http', '$window', 'Notification', '$location', function ($scope, $http, $window, Notification, $location) {
        var url,method;
        $scope.all_posts = [];
        var post_type = $location.search()['post_type'];
        //get all post lists
        $http.get("/api/posts?post_type=" + post_type)
                .then(function (response) {
                    $scope.all_posts = response.data;
                });
        //Redirect to edit post page from post list
        $scope.editPost = function (id) {
            $window.location.href = '/admin/add-post?post_type=' + post_type + '&id=' + id;
        };
        //Delete Custom post from list
        $scope.deletePost = function (id) {
            url = base_url + '/api/' + post_type + '/' + id;
            method = 'delete';
            $http({
                method: method,
                url: url
            }).then(function mySucces(response) {
                if (response.data === true) {
                    var msg = 'Post Deleted';
                    Notification({message: msg}, 'success');
                    $http.get("/api/posts?post_type=" + post_type)
                            .then(function (response) {
                                $scope.all_posts = response.data;
                            });
                } else {
                    var msg = 'Something Went Wrong';
                    Notification({message: msg}, 'warning');
                }
            }, function myError(response) {
                Notification({message: 'somethinf went wrong'}, 'error');
            });
        };
    }]);