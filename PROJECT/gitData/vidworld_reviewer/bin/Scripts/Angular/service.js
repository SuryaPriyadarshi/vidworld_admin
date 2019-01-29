var EndPoint = {
    Service: siteUrl + '/api/WebService/',
    CompanyAdmin: siteUrl + '/companyapi/',
    API: siteUrl + '/api/',
    Home: siteUrl + '/Home/'
};

rootApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

rootApp.directive('myMaxlength', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var maxlength = Number(attrs.myMaxlength);

            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9]/g, '');

                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                if (text.length > maxlength) {
                    var transformedInput = text.substring(0, maxlength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
rootApp.factory('focus', function ($timeout, $window) {

    return function (id) {
        // timeout makes sure that is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function () {

            var element = $window.document.getElementById(id);
            if (element)
                debugger
            element.focus();
        });
    };
})

//-**************Service for Communicating web Api--------------------------
rootApp.factory("APIInterface", function ($http, $rootScope) {
    var nd = new Date();
    var timeZone = nd.getTimezoneOffset();

    var ModifiedBy;

    return {
        postData: function (EndPoint, method, postData, onSuccess, onError) {
          
            LoaderStart(); //Loader Stop on your success method
            ModifiedBy = $('#txtUserID').val();
            $http({
                method: "POST",
                headers: { 'Authentication': 'cleazz#techahead', 'TimeZone': -timeZone, 'ModifiedBy': ModifiedBy },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);
        },
        putData: function (EndPoint, method, postData, onSuccess, onError) {
            LoaderStart(); //Loader Stop on your success method
            $http({
                method: "PUT",
                headers: { 'Authentication': 'web60134', 'TimeZone': -timeZone },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);
        },
        postDataViaAjax: function (EndPoint, method, postData, onSuccess, onError) {
            LoaderStart();
            ModifiedBy = $('#txtUserID').val();
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
            ModifiedBy = $('#txtUserID').val();
            $http({
                method: "POST",
                headers: { 'Authentication': 'web60134' },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);

        },
        getData: function (EndPoint, method, postData, onSuccess, onError) {
          
            ModifiedBy = $('#txtUserID').val();
            // $http.get(EndPoint + method + "?Id=" + postData).success(onSuccess).error(onError);
            $http({
                method: "GET",
                headers: { 'Authentication': 'cleazz#techahead', 'TimeZone': -timeZone, 'ModifiedBy': ModifiedBy },
                url: EndPoint + method + "?Id=" + postData,
                async: false,
            }).success(onSuccess).error(onError);
        }
    }
});

rootApp.factory("PagerService", function () {
    var service = {};
    service.GetPager = GetPager;
    return service;
    function GetPager(totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1;
        pageSize = pageSize || 10;
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= pageSize) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                if (totalPages > 10) {
                    endPage = 10;
                }
                else {
                    endPage = totalPages;
                }
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var pages = [];
        for (var i = startPage; i < endPage + 1; i++) {
            pages.push(i);
        }
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
});