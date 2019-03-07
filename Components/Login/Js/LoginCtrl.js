var loginApp = angular.module("rootApp.loginApp", []);
loginApp.controller("LoginController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant', 
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
     var vm = {};
     $scope.vm = vm;
     $rootScope.routeState = $state.current.name;
     vm.login = false;
    //***request Login model***
     vm.Login = {
         Username: "",
         Password: "",
         DeviceUniqueId: "vid.world",
         DeviceType: "web"
     }

    //***Function calling
    
    
     vm.SignInUser = SignInUser;
     function SignInUser() {
  
         vm.login = true;
    
         if ($scope.loginform.$valid) {
             APIInterface.postData(EndPoint.Admin, 'login', vm.Login, function (response) {
                 LoaderStart();
                 if (response.Success && response.Result.UserType == 'admin') {
                     // console.log(response)
                     localStorage.setItem('UserData', response.Result.SessionToken);
                     localStorage.setItem('UserId', response.Result.UserId);
                     sessionStorage.setItem('UserData', response.Result.SessionToken);
                     sessionStorage.setItem('UserId', response.Result.UserId);
                     sessionStorage.setItem('Username', response.Result.Username);
                     $rootScope.nameToShow = response.Result.Username;
                     var seesiondata = sessionStorage.getItem('UserData');
                     vm.login = false;
                     $state.go('home');
                     LoaderStop();
                 } else {
                     LoaderStop();
                     SweetAlert.swal(AppConstant.AlertTitle, "You are not an Admin.", AppConstant.Warning);
                 }


             }, function (err) {
                 //  console.log(err)
                 if (err.Status == 404) {
                     SweetAlert.swal(AppConstant.AlertTitle, "Username or Password is Invalid.", AppConstant.Warning);
                 }
                 else if (err.Status == 401) {
                     $state.go('login');
                 }
                 else if (err.Status == 400) {
                     SweetAlert.swal(AppConstant.AlertTitle, "Username or Password is Invalid.", AppConstant.Warning);
                 }
                 else {
                     SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
                 }
                 // LoaderStop();
             });
         }
     }

 }]);