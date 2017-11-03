app.controller('mediaLibrary', ['$scope', 'attachmentPosts', function ($scope, attachmentPosts) {
        attachmentPosts.async().then(function (d) {
            $scope.attachment_posts = d;
        });
    }]);