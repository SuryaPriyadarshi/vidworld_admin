var ReportedMessageApp = angular.module("rootApp.ReportedMessageApp", []);
ReportedMessageApp.controller("ReportedMessageController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.GetUserProfileId = GetUserProfileId;
    vm.ChangeTabOnTap = ChangeTabOnTap;
    $rootScope.Spam = true;
    $rootScope.Inappr = false;
    function ChangeTabOnTap(key) {
        switch (key) {
            case 1: {
                $rootScope.Spam = true;
                $rootScope.Inappr = false;
                $state.go('ReportedPost');
                break;
            }
            case 2: {
                $rootScope.Spam = true;
                $rootScope.Inappr = false;
                $state.go('ReportedMessage');
                break;
            }
            case 3: {
                $rootScope.Spam = true;
                $rootScope.Inappr = false;
                $state.go('ReportedComment');
                break;
            }

        }
    }

    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedMessageList(vm.SearchReportedMessage, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedMessageList(vm.SearchReportedMessage, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchReportedMessageList = searchReportedMessageList;
    function searchReportedMessageList(keyword, page) {

        $scope.currentPage = 1;
        getReportedMessageList(keyword, page);
    };
    //***********


    $rootScope.spamShow = function () {
        $rootScope.Spam = true;
        $rootScope.Inappr = false;
        getReportedMessageList("",1);
    };
    $rootScope.InapprShow = function () {
        $rootScope.Spam = false;
        $rootScope.Inappr = true;
        getInapprMessageList("",1);
    };

    vm.ReportedMessageList = [];
    getReportedMessageList("",1);
    vm.getReportedMessageList = getReportedMessageList;
    function getReportedMessageList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedMessage', 1 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.ReportedMessageList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReportedMessageList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
                console.log(vm.ReportedMessageList);
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

    //paging


    $scope.currentPage1 = 1;
    $scope.pageSize = 10;

    $scope.prevPage1 = function () {
        if ($scope.currentPage1 > 1) {
            $scope.currentPage1--;
            getInapprMessageList(vm.SearchInapprMessage, $scope.currentPage1);
        }
    };

    $scope.nextPage1 = function () {
        if (($scope.currentPage1 * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage1++;
            getInapprMessageList(vm.SearchInapprMessage, $scope.currentPage1);
        }
    };

    $scope.setPage1 = function () {
        $scope.currentPage1 = this.n;
    };

    vm.searchInapprMessageList = searchInapprMessageList;
    function searchInapprMessageList(keyword, page) {

        $scope.currentPage1 = 1;
        getInapprMessageList(keyword, page);
    };
    //***********


    vm.InapprMessageList = [];
    //   getInapprMessageList();
    vm.getInapprMessageList = getInapprMessageList;
    function getInapprMessageList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedMessage', 2 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.InapprMessageList = response.Result;
                angular.forEach(vm.InapprMessageList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
              //  console.log(vm.InapprMessageList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404) {
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
    function GetUserProfileId(item) {
        localStorage.removeItem('UserId');
        localStorage.setItem('UserId', item);
        $state.go('UserProfile');
    }

    vm.BlockReportedUser = BlockReportedUser;
    function BlockReportedUser(item) {
        var postData = {
            Type: 'User',
            Id: item.ReportedUserId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'adminBlock', postData, function (response) {
            if (response.Success) {
                item.Block = item.Block == 'Unblock' ? 'Block' : 'Unblock';

                console.log(response);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
           
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
         
        });
    }
    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }
}]);