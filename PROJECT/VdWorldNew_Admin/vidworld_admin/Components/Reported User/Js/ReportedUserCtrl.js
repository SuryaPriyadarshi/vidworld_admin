var ReportedUserApp = angular.module("rootApp.ReportedUserApp", []);
ReportedUserApp.controller("ReportedUserController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.GetReportedUserProfileId = GetReportedUserProfileId;

    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedUserList(vm.SearchReportedUser, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedUserList(vm.SearchReportedUser, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchReportedUserList = searchReportedUserList;
    function searchReportedUserList(keyword, page) {

        $scope.currentPage = 1;
        getReportedUserList(keyword, page);
    };
    //***********

    vm.ReportedUserList = [];
    getReportedUserList("",1);
    vm.getReportedUserList = getReportedUserList;
    function getReportedUserList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'UserList', 'report?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.ReportedUserList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReportedUserList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
               // console.log(vm.ReportedUserList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                if (keyword != "" && page == 1) {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }
    function GetReportedUserProfileId(item) {
        localStorage.removeItem('ReportedUserId');
        localStorage.setItem('ReportedUserId', item.UserId);
        $state.go('ReportedUserProfile');
    }

    vm.BlockReportedUser = BlockReportedUser;
    function BlockReportedUser(item) {
        var postData = {
            Type: 'User',
            Id: item.UserId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'adminBlock', postData, function (response) {
            if (response.Success) {
                item.Block = item.Block == 'Unblock' ? 'Block' : 'Unblock';

              //  console.log(response);
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
    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }
}]);