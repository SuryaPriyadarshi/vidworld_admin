var HomeApp = angular.module("rootApp.HomeApp", []);
HomeApp.controller("HomeController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    GetDashboard();
    vm.UserCount = 0;
    vm.CelebrityCount = 0;
    vm.ReviewerCount = 0;
    vm.TrackingIdCount = 0;
    function GetDashboard() {

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'dashboard', function (response) {
            if (response.Success) {
             
                vm.UserCount = response.Result[0][0].UserCount;
                vm.ReviewerCount = response.Result[1][0].ReviewerCount;
                vm.CelebrityCount = response.Result[2][0].CelebrityCount;
                vm.TrackingIdCount = response.Result[3][0].TrackingIdCount;
            } else {
                SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
            }

        }, function (err) {
          //  console.log(err);
            if (err.Status == 404 || err.Status == 400) {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);

        });
    }

}]);