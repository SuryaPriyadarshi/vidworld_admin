rootApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

rootApp.directive('file', function () {
    return {
        restrict: 'AE',
        scope: {
            file: '@'
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                var file = files[0];
                scope.file = file;
                scope.$parent.file = file;
                scope.$apply();
            });
        }
    };
});

rootApp.directive('fileReaderDirective', function () {
    return {
        restrict: "A",
        scope: {
            fileReaderDirective: "=",
        },
        link: function (scope, element) {
            $(element).on('change', function (changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function (e) {
                        var contents = e.target.result;
                        scope.$apply(function () {
                            scope.fileReaderDirective = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});

rootApp.factory('readFileData', function () {
    return {
        processData: function (csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(' ');
            var lines = [];
            var json = {};

            for (var i = 0; i < record.length; i++) {
                var data = record[i].split(' ');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        //   tarr.push(data[j]);
                        tarr[j] = data[j];
                    }
                //   lines.push(tarr);
                }
            }

        //  for (var k = 0; k < tarr.length; ++k) {
                // json[k] = lines[k];
        //        json["key"] = tarr[k];
         //   }
            // return json;
           return tarr;
        }
    };
});
