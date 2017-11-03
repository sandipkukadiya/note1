var app = angular.module('cms', ['ngRoute', 'ui-notification']);
var base_url = 'http://localhost:8000';

app.config(function ($locationProvider, NotificationProvider) {
    // use for store dip path
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('!');
    NotificationProvider.setOptions({
        delay: 5000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
    });
});
app.factory('customPostDetails', ['$http', function ($http) {
        var customPostDetails = {
            async: function (post_type) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get("/api/option?option_value.post_type_name.name=" + post_type)
                        .then(function (response) {
                            return response.data;
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return customPostDetails;
    }]);
app.factory('attachmentPosts', ['$http', function ($http) {
        var attachmentPosts = {
            async: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get("/api/posts?post_type=attachment")
                        .then(function (response) {
                            return response.data;
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return attachmentPosts;
    }]);
app.factory('taxonomyValues', ['$http', function ($http) {
        var taxonomyValues = {
            async: function (type) {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get("/api/taxonomies?taxonomy_type=" + type)
                        .then(function (response) {
                            return response.data;
                        });
                // Return the promise to the controller
                return promise;
            }
        };
        return taxonomyValues;
    }]);
app.directive('uploadclick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.bind('click', function () {
                $('.bs-modal-sm').modal('show');
                element.prev('input').addClass('activeSrc');
            });
        }
    };
});
app.directive('createformfield', function ($compile) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

            var inputType = attrs.inputtype;
            if (inputType === 'text') {
                content = angular.element('<input class="form-control" type="text" value="" ng-model="ngModel">');
            } else if (inputType === 'textarea') {
                content = angular.element('<textarea class="form-control" ng-model="ngModel"></textarea>');
            } else if (inputType === 'file') {
                content = angular.element('<input class="form-control" type="text" ng-model="ngModel"><a hre="javascript:void(0)" uploadclick  class="btn btn-primary">Upload</button>');
            }
            element.append(content);
            $compile(content)(scope);
        }
    };
});
app.directive('richTextEditor', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        replace: true,
        transclude: true,
        template: "<div><textarea></textarea></div>",
        link: function (scope, element, attrs, ctrl) {
            var textarea = $(element.find('textarea')).wysihtml5();
            var editor = textarea.data('wysihtml5').editor;
            // view -> model
            editor.on('change', function () {
                scope.$apply(function () {
                    ctrl.$setViewValue(editor.getValue());
                });
            });
            // model -> view
            ctrl.$render = function () {
                textarea.html(ctrl.$viewValue);
                editor.setValue(ctrl.$viewValue);
            };
            // load init value from DOM
            ctrl.$render();
        }
    };
});
function unflatten(arr) {
    var tree = [],
            mappedArr = {},
            arrElem,
            mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem._id] = arrElem;
        mappedArr[arrElem._id]['children'] = [];
    }


    for (var _id in mappedArr) {
        if (mappedArr.hasOwnProperty(_id)) {
            mappedElem = mappedArr[_id];
            // If the element is not at the root level, add it to its parent array of children.

            if (mappedElem.parent && mappedElem.parent != 0) {
                mappedArr[mappedElem['parent']]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}
function addLevels(obj) {
    angular.forEach(obj, function (value, key) {
        var display = "";
        for (var idx = 0; idx < value.level; idx++) {
            display += "- ";
        }
        display += value.title;
        obj[key]['title'] = display;
        obj[key]['value'] = value._id + ',' + value.level;
    });
    return obj;
}
String.prototype.toUrl = function () {
    var str = this.toLowerCase();
    var i = 0, strLength = str.length;
    var str;
    console.log(strLength);
    for (i; i < strLength; i++) {

        str = str.replace(" ", "-");

    }

    console.log(str);
    return str;
};
