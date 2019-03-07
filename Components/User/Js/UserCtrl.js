var UserApp = angular.module("rootApp.UserApp", []);
UserApp.controller("UserController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant)  {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.GetUserProfileId = GetUserProfileId;
    vm.UserList = [];
    vm.SearchUser = "";

    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getUserList(vm.SearchUser, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getUserList(vm.SearchUser, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
   
    vm.searchList = searchList;
    function searchList(keyword, page) {

        $scope.currentPage = 1;
        getUserList(keyword, page);
    };
    //***********
    getUserList("",1);
    vm.getUserList = getUserList;
   

    function getUserList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'UserList', 'user?search=' + keyword + "&page=" + page, function (response) {
            console.log(response);

            if (response.Success) {
                vm.UserList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.UserList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
                
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
          //  console.log(err);
            if (err.Status == 404 || err.Status == 400) {
                if (keyword != "" && page == 1) {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            }
            else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }
    function GetUserProfileId(item) {
        localStorage.removeItem('UserId');
        localStorage.setItem('UserId', item.UserId);
        $state.go('UserProfile');
    }

    vm.BlockUser = BlockUser;
    function BlockUser(item) {
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