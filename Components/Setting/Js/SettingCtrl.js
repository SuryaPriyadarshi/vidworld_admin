var SettingApp = angular.module("rootApp.SettingApp", []);
SettingApp.controller("SettingController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

    getSetting();
    vm.getSetting = getSetting;
    function getSetting() {
        LoaderStart();

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'settingList', function (response) {
            if (response.Success) {
                vm.Revenue = response.Result[0].RevenuePercentage;
                vm.TUsers = response.Result[0].UserThreshold;
                vm.TPosts = response.Result[0].PostThreshold;
                vm.TComments = response.Result[0].CommentThreshold;
                vm.ModeDuration = response.Result[0].UneditableModeDuration;
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404) {

            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

    vm.SetSetting = SetSetting;
    function SetSetting() {
        var myModel = {
            RevenuePercentage: vm.Revenue,
            UserThreshold: vm.TUsers,
            PostThreshold: vm.TPosts,
            CommentThreshold: vm.TComments,
            UneditableModeDuration: vm.ModeDuration
        }

        LoaderStart();
        APIInterface.postData(EndPoint.Admin, 'setting', myModel, function (response) {
          //  console.log(response);

            if (response.Success) {

                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
         //   console.log(err);
        
            LoaderStop();
           
            SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
        });

    }

}]);