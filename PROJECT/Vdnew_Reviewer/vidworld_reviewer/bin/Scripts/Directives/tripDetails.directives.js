app.directive('tripDetails', function (appConstant, APIInterface) {
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        link: function (scope, elem, attr) {
            debugger;
           
            if (scope.guid != undefined && scope.guid != null && scope.guid != "") {
                GetTripDetails();
            } 

            //-------*************GetTripDetails***************----------------------
            function GetTripDetails() {
                debugger;
                var queryparms = "?id=" + scope.guid;
                APIInterface.getData(appConstant.EndPoint.Admin, "GetTripDetails" + queryparms).then(function (response) {
                    console.log(response)
                    if (response.IsSuccess) {
                        scope.tripDetailsModel = response.Result;
                    } else {
                        SweetAlert.swal(appConstant.AlertTitle, response.Message, appConstant.Warning);
                    }
                }, function (err) {
                    console.log(err);
                    SweetAlert.swal(appConstant.ErrorTitle, appConstant.ServerErrorMessage, appConstant.Error);
                });
            }         
        },
        templateUrl: '/Scripts/Directives/_tripDetailsTemplate.html'
    };
});