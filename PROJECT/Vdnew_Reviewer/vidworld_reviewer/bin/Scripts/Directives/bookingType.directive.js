app.filter('bookingtype', function (appConstant, $filter) {
    return function (type) {
        var booking = appConstant.BookingType;
        return $filter('filter')(booking, { Id: type }, true)[0].Value;;
    };
});