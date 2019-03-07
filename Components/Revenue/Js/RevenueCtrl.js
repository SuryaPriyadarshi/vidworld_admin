var RevenueApp = angular.module("rootApp.RevenueApp", []);
RevenueApp.controller("RevenueController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant', '$filter',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant, $filter) {
    BootstrapDatepicker.init();

    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

    vm.startdate = new Date();
    vm.enddate = new Date();
    vm.startdate = '';
    vm.enddate = '';
    vm.RevenueList = [];
    $scope.Pending = true;
    vm.showRevenue = showRevenue;
    $scope.Amajon = true;
    $scope.CJ = false;
    $scope.Rakuteen = false;
    $scope.Ebay = false;
    vm.showRevenue('amazon', 2, vm.startdate, vm.enddate);
    vm.ClickOnTab = ClickOnTab;
    function ClickOnTab(type, id) {
        if (id === 2)
        {
            $scope.Pending = true;
        }
        else
        {
            $scope.Pending = false;
        }
        if (type === 1) {
            $scope.Amajon = true;
            $scope.CJ = false;
            $scope.Rakuteen = false;
            $scope.Ebay = false;
            vm.showRevenue('amazon', id, vm.startdate, vm.enddate);
        }
        else if (type === 2) {
            $scope.Amajon = false;
            $scope.CJ = false;
            $scope.Rakuteen = false;
            $scope.Ebay = true;
            vm.showRevenue('ebay', id, vm.startdate, vm.enddate);
        }
        else if (type === 3) {
            $scope.Amajon = false;
            $scope.CJ = true;
            $scope.Rakuteen = false;
            $scope.Ebay = false;
            vm.showRevenue('CJ', id, vm.startdate, vm.enddate);
        }
        else {
            $scope.Amajon = false;
            $scope.CJ = false;
            $scope.Rakuteen = true;
            $scope.Ebay = false;
            vm.showRevenue('rakuteen', id, vm.startdate, vm.enddate);
        }

    }

    
    function showRevenue(type, id) {
        
        vm.startdate = (id == 1 || id == '1') ? $('#start_date1').val() : $('#start_date').val();
        vm.enddate = (id == 1 || id == '1') ? $('#end_date1').val() : $('#end_date').val();
        if (vm.enddate < vm.startdate)
        {
            SweetAlert.swal(AppConstant.AlertTitle, "Enter valid date", AppConstant.Warning);
        }
        else
        {        
        var myModel = {
            IsPaid: id,
            AffiliateType: type,
            StartDate: $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd'),
            EndDate: $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd')

        };
        vm.type = type;
        LoaderStart();
        APIInterface.postData(EndPoint.Admin, 'manageRevenue', myModel, function (response) {
              console.log(response);

            if (response.Success) {
                vm.RevenueList = response.Result;
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
               console.log(err);

               LoaderStop();
             
            SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
        });
        }
    }
    
   vm.MakePayment = MakePayment;
    function MakePayment() {
        var myModel = { 
            AffiliateType: vm.type
        };  
        LoaderStart();

        APIInterface.postData(EndPoint.Admin, 'createPayment', myModel, function (response) {
               console.log(response);

            if (response.Success) {
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                vm.showRevenue(vm.type,2, vm.startdate, vm.enddate);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
                console.log(err);

                LoaderStop();
              
            SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
        });
    }

    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }

    vm.postDetailId = postDetailId;
    function postDetailId(item) {
        localStorage.removeItem('postId');
        localStorage.setItem('postId', item.PostId);
        $state.go('ReviewerPostDetail');
    }

}]);