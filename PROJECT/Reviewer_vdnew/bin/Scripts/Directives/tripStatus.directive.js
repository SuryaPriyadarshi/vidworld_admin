app.filter('tripstatus', function (appConstant, $filter) {
    return function (type) {
        var statusList = appConstant.TripStatus;
        return $filter('filter')(statusList, { Id: type }, true)[0].Value;;
    };
});