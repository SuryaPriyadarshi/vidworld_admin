var ReportedPostApp = angular.module("rootApp.ReportedPostApp", []);
ReportedPostApp.controller("ReportedPostController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

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
              //  $rootScope.Inappr = false;
                $state.go('ReportedComment');
                break;
            }
           
        }
    }
    $scope.Spam = true;
    $scope.ClickOnTabReport = ClickOnTabReport;
    function ClickOnTabReport(type) {
        if (type === 1) {
            $scope.Spam = true;
            getReportedPostList("",1);
        } else {
            $scope.Spam = false;
            getInapprPostList("",1);
        }
    }

    $rootScope.spamShow = function () {
        $rootScope.Spam = true;
        $rootScope.Inappr = false;
       
    };
    $rootScope.InapprShow = function () {
        $rootScope.Spam = false;
        $rootScope.Inappr = true;
   
    };
        
    //paging

    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedPostList(vm.SearchReportedPost, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedPostList(vm.SearchReportedPost, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchReportedPostList = searchReportedPostList;
    function searchReportedPostList(keyword, page) {

        $scope.currentPage = 1;
        getReportedPostList(keyword, page);
    };
    //***********


    vm.ReportedPostList = [];
    getReportedPostList("",1);
    vm.getReportedPostList = getReportedPostList;
    function getReportedPostList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedPost', 1 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.ReportedPostList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReportedPostList, function (value, key) {
                    value.Date = new Date(value.Date);
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
                console.log(vm.ReportedPostList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
           // console.log(err);
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

    //paging

 
    $scope.currentPage1 = 1;
    $scope.pageSize = 10;

    $scope.prevPage1 = function () {
        if ($scope.currentPage1 > 1) {
            $scope.currentPage1--;
            getInapprPostList(vm.SearchInapprPost, $scope.currentPage1);
        }
    };

    $scope.nextPage1 = function () {
        if (($scope.currentPage1 * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage1++;
            getInapprPostList(vm.SearchInapprPost, $scope.currentPage1);
        }
    };

    $scope.setPage1 = function () {
        $scope.currentPage1 = this.n;
    };

    vm.searchInapprPostList = searchInapprPostList;
    function searchInapprPostList(keyword, page) {

        $scope.currentPage1 = 1;
        getInapprPostList(keyword, page);
    };
    //***********

    vm.InapprPostList = [];
    vm.getInapprPostList = getInapprPostList;
    function getInapprPostList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedPost', 2 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.InapprPostList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.InapprPostList, function (value, key) {
                    value.Date = new Date(value.Date);
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
             //   console.log(vm.InapprPostList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
          //  console.log(err);
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
  

    vm.BlockReportedPost = BlockReportedPost;
    function BlockReportedPost(item) {
        var postData = {
            Type: 'Post',
            Id: item.PostId
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
    vm.GetReportedPostId = GetReportedPostId;
    function GetReportedPostId(item) {
        localStorage.removeItem('ReportedPostId');
        localStorage.setItem('ReportedPostId', item.PostId);
        $state.go('ReportedPostDetail');
    }
}]);