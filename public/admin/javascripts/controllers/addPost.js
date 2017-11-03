
app.controller('addPost', ['$scope', '$http', '$location', 'Notification', 'attachmentPosts', 'taxonomyValues', 'customPostDetails', function ($scope, $http, $location, Notification, attachmentPosts, taxonomyValues, customPostDetails) {
        $scope.post = {};
        
        /*Get All attachment posts*/
        attachmentPosts.async().then(function (res) {
            $scope.attachment_posts = res;
        });
        var id = $location.search()['id'];
        var post_type = $location.search()['post_type'];
        var method = 'post',
                url = base_url + '/api/post/';
        var chkElements = [];
        customPostDetails.async(post_type).then(function (response) {
           
            if(response.length != 0){
                $scope.post.custom_fields = response[0].option_value.post_type_name.custom_field;
                var taxonomy_type = response[0].option_value.post_type_name.taxonomy;
                /*Get All taxonomy posts*/  
                taxonomyValues.async(taxonomy_type).then(function (res) {
                    
                    if (id != undefined) {
                        editData(res);
                    } else {
                        $scope.taxonomiesValues = unflatten(res);
                    }
                });
            }
           
        });
        /*Edit Post*/

        var editData = function (res) {

            $http.get("/api/post/" + id)
                    .then(function (response) {
                        $scope.post.post_title = response.data.post_title;

                        $scope.post.post_content = response.data.post_content;
                        $scope.post.post_featured_image = response.data.post_featured_image;
                        $scope.post.custom_fields = response.data.custom_field;
                        chkElements = response.data.category;

                        angular.forEach(res, function (value, key) {
                            if (chkElements.indexOf(value._id) > -1) {
                                res[key]['chk'] = true;
                            }
                        });
                        $scope.taxonomiesValues = unflatten(res);
                    });
            method = 'put';
            url = base_url + "/api/post/" + id;
        };
        /* Category Selection */
        $scope.setData = function (data) {
            if (data.chk === true) {
                chkElements.push(data._id);
            } else {
                var index = chkElements.indexOf(data._id);
                if (index > -1) {
                    chkElements.splice(index, 1);
                }
            }
        };
        $scope.add_post = function () {
            var post_title = $scope.post.post_title;
            var post_link = post_title.toUrl();
            $http.get("/api/posts?comparison=like&post_link=" + post_link)
                    .then(function (response) {
                        var result = response.data;
                        
                        var link_counter = '';
                        if (result.length > 0) {
                            link_counter = result.length;
                        }
                        var data = {
                            post_title: post_title,
                            post_content: $scope.post.post_content,
                            category: chkElements,
                            post_type: post_type,
                            post_link: post_link + link_counter,
                            custom_field: $scope.post.custom_fields
                        };
                        addPostAjax(data);
                    });



            var addPostAjax = function (data) {
                $http({
                    method: method,
                    url: url,
                    data: data
                }).then(function mySucces(response) {
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
                }, function myError(response) {
                    Notification({message: 'something went wrong'}, 'error');
                });

            };
        };
    }]);