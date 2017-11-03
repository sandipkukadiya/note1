/*tree structure*/
app.directive('treestructure', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        template: "<ul><member ng-repeat='member in treedata' member='member'></member></ul>",
        scope: {
            treedata: '='
        }
    };
});
app.directive('member', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template: "<li>{{member.title}}</li>",
        link: function (scope, element, attrs) {

            if (angular.isArray(scope.member.children)) {
                element.append("<treestructure treedata='member.children'></treestructure>");
                $compile(element.contents())(scope);
            }
        }
    };
});

app.filter('with', function () {
    return function (items, field) {
        var result = {};
        angular.forEach(items, function (value, key) {

            if (value.inputType === 'text') {
                items[key]['html'] = "<input class='form-control' type='text' value='" + value.value + "'>";
            } else if (value.inputType === 'textarea') {
                items[key]['html'] = "<textarea ng-model='custom_field.key'></textarea>";
            } else if (value.inputType === 'file') {
                items[key]['html'] = "<input ng-model='custom_field.key' class='form-control' type='text' ng-model='custom_field.key'>";
            }
            if (!value.hasOwnProperty(field)) {
                result[key] = value;
            }
        });
        return result;
    };
});
app.filter('taxfilter', function () {
    return function (items, field) {
        angular.forEach(items, function (value, key) {
            var counter = 1;
            var checkChildren = function (single) {

                if (single.parent != 0) {
                    if ('children' in single && _.size(single.children) > 0) {
                        counter++;
                        checkChildren(single.children);
                    }
                } else {
                    counter = 0;
                }
            };
            checkChildren(value);
            items[key]['counter'] = counter;
            items[key] = value;
        });
        return items;
    };
});

/* test*/
app.filter("trust", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    }]);

app.directive('renderHtml', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                html: '='
            },
            link: function postLink(scope, element, attrs) {

                function appendHtml() {
                    if (scope.html) {
                        var newElement = angular.element(scope.html);
                        $compile(newElement)(scope);
                        element.append(newElement);
                    }
                }

                scope.$watch(function () {
                    return scope.html
                }, appendHtml);
            }
        };
    }]);
app.directive('fullSelect', function ($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {datarepo: "=datarepo", ngModel: "="},
        replace: true,
        link: function (scope, element, attrs, ngModel) {

            var unwatch = scope.$watch('datarepo', function (v) {
                if (v) { // Check if you got the value already, you can be more specific like angular.isObject/angular.isArray(v)
                    console.log(scope);
                    unwatch(); //Remove the watch
                    angular.forEach(scope.datarepo, function (value, key) {
                        var opt;
                        var display = "";
                        for (var idx = 0; idx < value.level; idx++) {
                            display += "&nbsp;&nbsp;";
                        }
                        display += value.title;
                        opt = angular.element('<option value="' + value._id + ',' + value.level + '">' + display + '</option>');
                        element.append($compile(opt)(scope));
                    });

                }
            });

        }
    };
});

/* create a tree structure*/
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

app.directive('treestructure', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        template: "<ul><member ng-repeat='member in treedata' member='member'></member></ul>",
        scope: {
            treedata: '='
        }
    };
});
app.directive('member', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '='
        },
        template: "<li><input type='checkbox' ng-change='updatePostTaxonomy($event)' ng-model='user.roles' value='member._id'>{{member.title}}</li>",
        link: function (scope, element, attrs) {

            if (angular.isArray(scope.member.children)) {
                element.append("<treestructure treedata='member.children'></treestructure>");
                $compile(element.contents())(scope);
            }
        }
    };
});