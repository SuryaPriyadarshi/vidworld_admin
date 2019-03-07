var ContactUsApp = angular.module("rootApp.ContactUsApp", []);
ContactUsApp.controller("ContactUsController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.ContactTrue = false;
    vm.Address = "";
    vm.PhoneNumber = "";
    $scope.UserActive = true;
    $scope.CelebrityActive = false;
    $scope.ReviewerActive = false;
    vm.ClickOnTab = ClickOnTab;
    function ClickOnTab(type) {
        if (type === 1) {
            $scope.UserActive = true;
            $scope.CelebrityActive = false;
            $scope.ReviewerActive = false;
        }
        else if (type === 2) {
            $scope.UserActive = false;
            $scope.CelebrityActive = true;
            $scope.ReviewerActive = false;
        }
        else {
            $scope.UserActive = false;
            $scope.CelebrityActive = false;
            $scope.ReviewerActive = true;
        }

    }
    showContactUs();
    vm.showContactUs = showContactUs;
    function showContactUs() {
       
     
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getContactUs', 'user', function (response) {
            LoaderStart();
            if (response.Success) {
              //  console.log(response)
                vm.Address = response.Result[0].Address;
                vm.PhoneNumber = response.Result[0].PhoneNumber;
                vm.ContactTrue = false;
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            if (err.Status == 404) {

            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });

    }

    vm.saveContactUs = saveContactUs;
    function saveContactUs() {
        vm.ContactTrue = true;
        var postData = {
            PhoneNumber: vm.PhoneNumber,
            Address: vm.Address,
            UserType : 'user'
        }
        if ($scope.contactUsForm.$valid) {
            LoaderStart();
            // console.log(postData);
            APIInterface.putData(EndPoint.Admin, 'contactUs', postData, function (response) {
                if (response.Success) {
                    vm.ContactTrue = false;
                    //   console.log(response);
                    LoaderStop();
                } else {
                    LoaderStop();
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
            }, function (err) {
                LoaderStop();
               
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            });
        }
    }

}]);