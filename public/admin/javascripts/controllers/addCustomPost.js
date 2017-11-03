app.controller('addCustomPost', ['$scope', '$http', '$location', 'Notification', function ($scope, $http, $location, Notification) {
        $scope.post = {};
        $scope.post['custom_fields'] = [{key: '', inputType: ''}];
        $scope.fieldNames = ['text', 'textarea', 'file'];
        var id = $location.search()['id'];
        var method = 'post',
                url = base_url + '/api/option/';
        if (id !== undefined) {
            $http.get("/api/option/" + id)
                    .then(function (response) {
                        $scope.post.post_title = response.data.option_value.post_type_name.name;
                        $scope.post.post_taxonomy = response.data.option_value.post_type_name.taxonomy;
                        $scope.post.custom_fields = response.data.option_value.post_type_name.custom_field;
                    });
            method = 'put';
            url = base_url + "/api/option/" + id;
        }

        //add dynamic field for custom_field
        $scope.addCustomField = function () {
            $scope.post['custom_fields'].push({key: '', inputType: ''});
        };
        $scope.addCustomPost = function () {
            var post_title = $scope.post['post_title'];
            var post_taxonomy = $scope.post['post_taxonomy'];
            var custom_field = [];
            var custom_fields = $scope.post['custom_fields'];
            if (_.size(custom_fields) > 0) {
                Object.keys(custom_fields).forEach(function (index) {
                    var key = custom_fields[index]['key'];
                    var inputType = custom_fields[index]['inputType'];
                    custom_field.push({key: key, inputType: inputType});
                });
            }

            var option_value = {
                post_type_name: {
                    name: post_title.toLowerCase(),
                    taxonomy: post_taxonomy.toLowerCase(),
                    custom_field: custom_field
                }
            };
            var data = {
                option_key: 'post_type',
                option_value: option_value
            };
            $http({
                method: method,
                url: url,
                data: data
            }).then(function (response) {
                if (method === 'put') {
                    var msg = 'Post Updated';
                } else {
                    var msg = 'Post Added';
                }
                if (response.data === true) {
                    Notification({message: msg}, 'success');
                } else {
                    Notification({message: 'something went wrong'}, 'error');
                }
            }, function (response) {
                Notification({message: 'Something Went Wrong'}, 'error');
            });
        };
        $scope.removeCustomField = function (index) {
            var keys = _.keys($scope.post.custom_fields);
            _.each(keys, function (key) {

                if (key == index) {
                    $scope.post.custom_fields = _.omit($scope.post.custom_fields, index);
                }
            });
        };
    }]);