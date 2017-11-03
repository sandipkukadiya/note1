app.controller('allCustomPostTypes', ['$scope', '$http', '$window', 'Notification', function ($scope, $http, $window, Notification) {
        var url,
                method;
        $scope.all_posts = [];
        //get all post lists
        $http.get("/api/option?option_key=post_type")
                .then(function (response) {
                    $scope.all_posts = response.data;
                });
        //Redirect to edit post page from post list
        $scope.editCustomPost = function (id) {
            $window.location.href = '/admin/custom-post?id=' + id;
        };
        //Delete Custom post from list
        $scope.deleteCustomPost = function (id) {
            url = base_url + '/api/option/' + id;
            method = 'delete';
            $http({
                method: method,
                url: url
            }).then(function mySucces(response) {
                if (response.data === true) {
                    var msg = 'Post Deleted';
                    Notification({message: msg}, 'success');
                    $http.get("/api/option?option_key=post_type")
                            .then(function (result) {

                                $scope.all_posts = result.data;
                            });
                } else {
                    var msg = 'Something Went Wrong';
                    Notification({message: msg}, 'warning');
                }
            }, function myError(response) {
                Notification({message: response.data.msg}, response.data.result);
            });
        };
    }]);