var HeaderApp = angular.module("rootApp.HeaderApp", []);
HeaderApp.controller("HeaderController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant', '$timeout',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant, $timeout) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    $rootScope.nameToShow = sessionStorage.getItem('Username');
    vm.name = $rootScope.nameToShow;
   
    vm.LogOut = LogOut;
    vm.showTrackingId = false;
    GetAmazonId();
    $rootScope.AmazonId = 0;
    function GetAmazonId() {

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'getAmazonTrackingCount', function (response) {
            if (response.Success) {
                $rootScope.AmazonId = response.Result[0].TrackingIdCount;
                console.log("hit");
                if ($rootScope.AmazonId <= 100)
                {
                    vm.showTrackingId = true;
                }
               // alert(1)
                $timeout(GetAmazonId, 300000);

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
   

    function LogOut() {       

        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'logout', null , function (response) {

            if (response.Success) {
              //  console.log(response)
                sessionStorage.setItem('UserData', null);
                sessionStorage.setItem('UserId', null);
             sessionStorage.setItem('Username', null);
                localStorage.removeItem('UserData');
                 localStorage.removeItem('UserId');
                $state.go("login");
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
          //  console.log(err)
            $state.go('login');
            LoaderStop();
        });
    }

}]);