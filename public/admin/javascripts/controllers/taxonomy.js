app.controller('taxonomy', ['$scope', '$http', '$location', 'Notification', 'taxonomyValues', function ($scope, $http, $location, Notification, taxonomyValues) {
        var method, url;
        var type = $location.search()['type'];
        /*Get All taxonomyValues posts*/
        taxonomyValues.async(type).then(function (res) {
            $scope.taxonomies = addLevels(res);
        });
        $scope.updateLevel = function (level) {
            console.log(level);
        };
        $scope.editTaxonomy = function (id) {
            $http.get("/api/taxonomy/" + id)
                    .then(function (response) {
                        $scope.taxonomy = response.data;
                    });
        };
        $scope.deleteTaxonomy = function (id) {
            url = base_url + '/api/taxonomy/' + id;
            method = 'delete';
            $http({
                method: method,
                url: url
            }).then(function mySucces(response) {
                if (response.data === true) {
                    var msg = 'Taxonomy Deleted';
                    Notification({message: msg}, 'success');
                    /*Get All taxonomyValues posts*/
                    taxonomyValues.async(type).then(function (res) {
                        $scope.taxonomies = addLevels(res);
                    });
                } else {
                    var msg = 'Something Went Wrong';
                    Notification({message: msg}, 'warning');
                }
            }, function myError(response) {
                Notification({message: 'somethinf went wrong'}, 'error');
            });
        };
        $scope.saveTaxonomy = function (id) {
            var parent = $scope.taxonomy.parent;
            var level = 0;
            if (parent != 0) {
                var result = _.filter($scope.taxonomies, function (num) {
                    if (num._id === parent) {
                        return num;
                    }
                });
                level = parseInt(result[0].level) + 1;
            }
            var data = {
                title: $scope.taxonomy.title,
                description: $scope.taxonomy.description,
                parent: parent,
                level: level,
                taxonomy_type: type,
                image: $scope.taxonomy.image
            };
            console.log(data)
            if (id == undefined) {
                method = 'post';
                url = base_url + '/api/taxonomy/';
            } else {
                method = 'put';
                url = base_url + '/api/taxonomy/' + id;
            }
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

                $scope.taxonomy = null;
            }, function myError(response) {
                Notification({message: 'something went wrong'}, 'error');
            });
        };
    }]);