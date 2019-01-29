app.factory("APIInterface", function ($http, $q) {
    var factory = {};
    var nd = new Date();
    var timeZone = nd.getTimezoneOffset();
    var ModifiedBy;

    factory.postData = function (EndPoint, method, postData) {
        LoaderStart();
        // LoaderStart(); //Loader Stop on your success method
        ModifiedBy = $('#txtUserID').val();
        var request = {
            method: "POST",
            url: EndPoint + method,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'access_token': 'taxi#techahead',
                'Authentication': 'taxi#techahead',
                'TimeZone': -timeZone,
                'ModifiedBy': ModifiedBy
            },
            data: JSON.stringify(postData),
        };

        var defer = $q.defer();
        $http(request).then(
            function (result) {
                defer.resolve(result.data);
                LoaderStop();
            }, function (error) {
                defer.reject(error);
                LoaderStop();
            });
        return defer.promise;
    };

    factory.getData = function (EndPoint, method) {
         LoaderStart(); //Loader Stop on your success method
        ModifiedBy = $('#txtUserID').val();
        var request = {
            method: "GET",
            url: EndPoint + method,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'access_token': 'taxi#techahead',
                'Authentication': 'taxi#techahead',
                'TimeZone': -timeZone,
                'ModifiedBy': ModifiedBy
            }
        };

        var defer = $q.defer();
        $http(request).then(
            function (result) {
                defer.resolve(result.data);
                LoaderStop();
            }, function (error) {
                defer.reject(error);
                LoaderStop();
            });
        return defer.promise;
    };
    return factory;
});