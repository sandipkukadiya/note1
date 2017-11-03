app.controller('menuBar', ['$scope', '$http', function ($scope, $http) {

        $http.get("/api/option?option_key=post_type")
                .then(function (response) {
                    var menuObj = [];
                    angular.forEach(response.data, function (value, key) {

                        var name = value.option_value.post_type_name.name;
                        var taxonomy = value.option_value.post_type_name.taxonomy;
                        if (name != 'attachment') {
                            var add = {url: '/admin/add-post?post_type=' + name, title: 'Add ' + name.ucfirst()};
                            var all = {url: '/admin/all-posts?post_type=' + name, title: 'All ' + name.ucfirst()};
                            var obj = {
                                add: add,
                                all: all,
                                title: name.ucfirst()
                            };
                            menuObj.push(obj);
                        }
                    });
                    $scope.customPosts = menuObj;
                });
    }]);
app.controller('footerCtrl', ['$scope', 'attachmentPosts', function ($scope, attachmentPosts) {
        /*Get All attachment posts*/
        attachmentPosts.async().then(function (d) {
            $scope.attachment_posts = d;
        });
        $scope.addAttachmentPost = function (event, link) {
            angular.element('.activeSrc').val(link);
            angular.element(jQuery('.activeSrc')).triggerHandler('input');
        };
    }]);