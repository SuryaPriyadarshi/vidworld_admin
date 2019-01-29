
//Base scripts included maximum custom functions, angular service to post/get, validate form/elements

var app = angular.module('myApp', ['ngTable', 'ngSanitize', 'ui.bootstrap', 'ngCookies', 'ngHashtags'])


app.directive('ngEnter', function () {
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
app.directive('phonenumberDirective', ['$filter', function ($filter) {

    function link(scope, element, attributes) {

        // scope.inputValue is the value of input element used in template
        scope.inputValue = scope.CompanyModel.phoneNumber;

        scope.$watch('inputValue', function (value, oldValue) {

            value = String(value);
            var number = value.replace(/[^0-9]+/g, '');
            scope.CompanyModel.phoneNumber = number;
            scope.inputValue = $filter('phonenumber')(number);
        });
    }

    return {
        link: link,
        restrict: 'AE',

    };
}]);
app.directive('myDatepicker', function ($parse) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
        $(function () {
            element.datepicker({
                //showOn: "both",
                changeYear: true,
                changeMonth: true,
                dateFormat: 'dd-mm-yy',
                maxDate: new Date(),
                yearRange: '2010:2020',
                onSelect: function (dateText, inst) {
                    scope.$apply(function (scope) {
                        // Change binded variable
                        ngModel.assign(scope, dateText);
                    });
                }
            });
        });
    }
});
app.directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

app.directive('ngRightClick', function ($parse) {
    debugger;
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
});
app.directive('infinityscroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('scroll', function () {
                if ((element[0].scrollTop + element[0].offsetHeight) >= element[0].scrollHeight) {
                    //scroll reach to end
                    scope.$apply(attrs.infinityscroll)
                }
            });
        }
    }
});

//var siteUrl = '';  // Local url

//var baseUrl = 'http://35.168.164.77:1336/';  // Local url
var baseUrl = 'https://vid.world:1337/';

var EndPoint = {    
    Admin: baseUrl
};

app.factory("myFactory", function ($http, $log, $filter, ngTableParams, appConstant, $window, $cookieStore) {

    return {

        postData: function (EndPoint, method, postData, onSuccess, onError) {
            LoaderStart(); //Loader Stop on your success method  
            //var accessToken = "";
            //    //constants.accessToken;
            $http({
                async: false,
                method: "POST",
                headers: { 'access-token': $cookieStore.get("SessionToken") },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);
        },

        putData: function (EndPoint, method, putData, onSuccess, onError) {
            LoaderStart(); //Loader Stop on your success method  
            //var accessToken = "";
            //    //constants.accessToken;
            $http({
                async: false,
                method: "PUT",
                headers: { 'access-token': $cookieStore.get("SessionToken") },
                url: EndPoint + method,
                data: JSON.stringify(putData),
                async: false,
            }).success(onSuccess).error(onError);
        },

        checkPage: function () {
            return true;
        },

        postDataSring: function (EndPoint, method, postData, onSuccess, onError) {
            LoaderStart(); //Loader Stop on your success method           
            $http({
                method: "POST",
                headers: { 'Authentication': 'web60134' },
                url: EndPoint + method + "/" + postData,
                data: null,
                async: false,
            }).success(onSuccess).error(onError);
        },

        postDataViaAjax: function (EndPoint, method, postData, onSuccess, onError) {
            LoaderStart();
            $.ajax({
                method: "POST",
                headers: { 'Authentication': 'web60134' },
                url: EndPoint + method,
                contentType: false,
                processData: false,
                async: false,
                data: postData
            }).success(onSuccess).error(onError);
        },

        postDataWittOutLoader: function (EndPoint, method, postData, onSuccess, onError) {
            //Loader Stop on your success method
            $http.post(EndPoint + method, JSON.stringify(postData)).success(function (data) {
                onSuccess(data);
            }).error(onError);
        },

        //getData: function (EndPoint, method, onSuccess, onError) {

        //    LoaderStart(); //Loader Stop on your success method
        //    $http.get(EndPoint + method).success(onSuccess).error(onError);
        //},
        getData: function (EndPoint, method, onSuccess, onError) {
            LoaderStart(); //Loader Stop on your success method
            console.log($cookieStore.get("SessionToken"));
            $http({
                method: "GET",
                url: EndPoint + method,
                headers: { 'access-token': $cookieStore.get("SessionToken") },
                //headers: {
                //    'accept': 'application/json',
                //    'content-type': 'application/json',
                //    'access-token': appConstant.SessionToken ,
                //}
            }).success(onSuccess).error(onError);
        },

        uploadFile: function (imageEleId, onSuccess, onError) {

            var files = $(imageEleId).get(0).files;
            if (files.length > 0) {
                var fsize = files[0].size;
                var fileSize = parseInt(fsize) / 1024;
                if (fileSize <= 5200) {
                    var data = new FormData();
                    for (i = 0; i < files.length; i++) {
                        data.append("file" + i, files[i]);
                    }
                    data.append("json", "j:b");
                    LoaderStart(); //Loader Stop on your success method
                    $.ajax({
                        type: "POST",
                        headers: { 'Authentication': 'web60134' },
                        url: siteUrl + "/Uploder.ashx",
                        contentType: false,
                        processData: false,
                        data: data,
                        async: false,
                        success: onSuccess,
                        error: onError
                    });
                } else {
                    throw "File size should not be greater than 5MB";
                }

            } else {
                LoaderStop();
            }
        },

        getDataWithOutLoader: function (EndPoint, method, onSuccess, onError) {

            $http.get(EndPoint + method).success(onSuccess).error(onError);
        },

    }

});

function LoaderStart() {
    $('#loaderdiv').show();
}

function LoaderStop() {
    $('#loaderdiv').hide();
}

function isValidEmail(email) {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
        return true;
    }
    else {
        return false;
    }
}

function isValidNumber(num) {
    var Number = /^[(]{0,1}\d{0,9}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    if (Number.test(num)) {
        return true;
    }
    else {
        return false;
    }
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function formValidation(id) {

    jQuery(id).validate({
        highlight: function (element) {
            jQuery(element).closest('.input-group').removeClass('has-success').addClass('has-error');
        },
        success: function (element) {
            jQuery(element).closest('.input-group').removeClass('has-error').addClass('has-success');

        },
        //Disable error msg lable
        errorPlacement: function (error, element) {
            return true;
        }
    });

    return $(id).valid();;
}

var skpatterns = false;
var emailpattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
var alphapattern = /^([a-zA-Z0-9 _-]+)$/;
var onlynumbers = /^\d*(?:\.\d{1,2})?$/;
var strongpass = /^[a-z0-9_-]{6,12}$/;
var urlpattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var phonePatternWithoutCountryCode = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var pass = '';

app.directive('skemail', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr) {
            scope.$watch(attr.ngModel, function (skvalue) {
                if (emailpattern.test(skvalue)) {

                    scope.skemail = true;
                } else {
                    scope.skemail = false;


                }
            });
        }
    }
})
app.filter('phonenumber', function () {
    /* 
    Format phonenumber as: c (xxx) xxx-xxxx
        or as close as possible if phonenumber length is not 10
        if c is not '1' (country code not USA), does not use country code
    */

    return function (number) {
        /* 
        @param {Number | String} number - Number that will be formatted as telephone number
        Returns formatted number: (###) ###-####
            if number.length < 4: ###
            else if number.length < 7: (###) ###

        Does not handle country codes that are not '1' (USA)
        */
        if (!number) { return ''; }

        number = String(number);

        // Will return formattedNumber. 
        // If phonenumber isn't longer than an area code, just show number
        var formattedNumber = number;

        // if the first character is '1', strip it out and add it back
        var c = (number[0] == '1') ? '1 ' : '';
        number = number[0] == '1' ? number.slice(1) : number;

        // # (###) ###-#### as c (area) front-end
        var area = number.substring(0, 3);
        var front = number.substring(3, 6);
        var end = number.substring(6, 10);

        if (front) {
            formattedNumber = (c + "(" + area + ") " + front);
        }
        if (end) {
            formattedNumber += ("-" + end);
        }
        return formattedNumber;
    };
});
app.directive('skphonewithoutCountryCode', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr) {
            scope.$watch(attr.ngModel, function (skvalue) {
                if (phonePatternWithoutCountryCode.test(skvalue)) {
                    scope.skphonewithoutCountryCode = true;
                } else {
                    scope.skphonewithoutCountryCode = false;

                }
            });
        }
    }
})
app.directive('skalpha', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr) {
            scope.$watch(attr.ngModel, function (skvalue) {

                if (alphapattern.test(skvalue) && skvalue != null) {
                    scope.skalpha = true;
                } else {
                    scope.skalpha = false;
                }
            });
        },

    }
})
app.directive('skstrong', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, modelCtrl) {
            scope.$watch(attr.ngModel, function (skvalue) {
                if (skvalue == null || skvalue === 'undefined' || skvalue == "") {
                    scope.skstrong = false;

                } else if (strongpass.test(skvalue)) {
                    pass = skvalue;
                    if (skvalue.length > 12) {
                        skvalue = skvalue.substring(0, skvalue.length - 1);
                        modelCtrl.$setViewValue(skvalue);
                        modelCtrl.$render();
                    }
                    scope.skstrong = true;

                } else {
                    if (skvalue.length > 12) {
                        skvalue = skvalue.substring(0, skvalue.length - 1);
                        modelCtrl.$setViewValue(skvalue);
                        modelCtrl.$render();
                    }
                    scope.skstrong = false;

                }
            });
        },

    }
})
app.directive('skconfirm', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, modelCtrl) {
            scope.$watch(attr.ngModel, function (skvalue) {
                if (skvalue == null || skvalue === 'undefined' || skvalue == "") {
                    scope.skconfirm = false;

                } else if (pass == skvalue) {
                    pass = skvalue;
                    if (skvalue.length > 12) {
                        skvalue = skvalue.substring(0, skvalue.length - 1);
                        modelCtrl.$setViewValue(skvalue);
                        modelCtrl.$render();
                    }
                    scope.skconfirm = true;

                } else {
                    if (skvalue.length > 12) {
                        skvalue = skvalue.substring(0, skvalue.length - 1);
                        modelCtrl.$setViewValue(skvalue);
                        modelCtrl.$render();
                    }
                    scope.skconfirm = false;

                }
            });
        },

    }
})
app.directive('sknumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (skvalue) {
                if (skvalue == undefined) return ''
                var rjvalue = skvalue.replace(/[^0-9]/g, '');
                if (rjvalue != skvalue) {
                    modelCtrl.$setViewValue(rjvalue);
                    modelCtrl.$render();
                }
                return rjvalue;
            });
        }
    };
});
app.directive('skzipcode', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (skvalue) {
                if (skvalue == undefined) return ''
                var rjvalue = skvalue.replace(/[&\/\\#,+$~%.'":*?<>{}!@^=_`~]/g, '');
                if (rjvalue != skvalue) {
                    modelCtrl.$setViewValue(rjvalue);
                    modelCtrl.$render();
                }
                return rjvalue;
            });
        }
    };
})

app.directive('skonlyalpha', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (skvalue) {
                if (skvalue == undefined) return ''
                var rjvalue = skvalue.replace(/[^a-zA-Z]/g, '');
                if (rjvalue != skvalue) {
                    modelCtrl.$setViewValue(rjvalue);
                    modelCtrl.$render();
                }

                return rjvalue;
            });
        }
    };
});
app.directive('skurl', function () {
    return {
        replace: false,
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr) {
            scope.$watch(attr.ngModel, function (skvalue) {
                if (urlpattern.test(skvalue)) {
                    scope.skurl = true;

                } else {
                    scope.skurl = false;

                }
            });
        },
    }
});

app.directive('typeaheadItem', function () {
    return {
        require: '^typeahead',
        link: function (scope, element, attrs, controller) {

            var item = scope.$eval(attrs.typeaheadItem);

            scope.$watch(function () {
                return controller.isActive(item);
            }, function (active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function (e) {
                scope.$apply(function () {
                    controller.activate(item);
                });
            });

            element.bind('click', function (e) {
                scope.$apply(function () {
                    controller.select(item);
                });
            });
        }
    };
});
app.directive('slick', function ($timeout) {
    return function (scope, el, attrs) {
        $timeout((function () {
            el.slick({
                arrows: true,
                dots: true,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 6500,
                speed: 1500,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                cssEase: 'linear'
            })
        }), 100)
    }
})
app.directive('ngEnter', function () {
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

app.directive('validNumberDecimal', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

function getUtcTimestamp() {
    var now = new Date();
    var utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
    return utcTime;
}