var ReportedCommentApp = angular.module("rootApp.ReportedCommentApp", []);
ReportedCommentApp.controller("ReportedCommentController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.DeleteComment = DeleteComment;
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

    $rootScope.spamShow = function () {
        $rootScope.Spam = true;
        $rootScope.Inappr = false;
        getReportedCommentList("",1);
    };
    $rootScope.InapprShow = function () {
        $rootScope.Spam = false;
        $rootScope.Inappr = true;
        getInapprCommentList("",1);
    };

    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedCommentList(vm.SearchReportedComment, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedCommentList(vm.SearchReportedComment, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchReportedCommentList = searchReportedCommentList;
    function searchReportedCommentList(keyword, page) {

        $scope.currentPage = 1;
        getReportedCommentList(keyword, page);
    };
    //***********


    vm.ReportedCommentList = [];
    getReportedCommentList("",1);
    vm.getReportedCommentList = getReportedCommentList;
    function getReportedCommentList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedComment', 1 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.ReportedCommentList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReportedCommentList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
                console.log(vm.ReportedCommentList);
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
            getInapprCommentList(vm.SearchInapprComment, $scope.currentPage1);
        }
    };

    $scope.nextPage1 = function () {
        if (($scope.currentPage1 * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage1++;
            getInapprCommentList(vm.SearchInapprComment, $scope.currentPage1);
        }
    };

    $scope.setPage1 = function () {
        $scope.currentPage1 = this.n;
    };

    vm.searchInapprCommentList = searchInapprCommentList;
    function searchInapprCommentList(keyword, page) {

        $scope.currentPage1 = 1;
        getInapprCommentList(keyword, page);
    };
    //***********


    vm.InapprCommentList = [];
    // getInapprCommentList();
    vm.getInapprCommentList = getInapprCommentList;
    function getInapprCommentList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reportedComment', 2 + '?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.InapprCommentList = response.Result;
                angular.forEach(vm.InapprCommentList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
               console.log(vm.InapprCommentList);
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

    function DeleteComment(item,type) {

        var putData = {
            Type: item.Type,
            Id: item.CommentId

        }
        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'adminDelete', putData, function (response) {
           console.log(response);
            if (response.Success) {
            //    console.log(item);
                if(type == 1)
                    vm.ReportedCommentList.splice(vm.ReportedCommentList.indexOf(item), 1);
                else
                    vm.InapprCommentList.splice(vm.InapprCommentList.indexOf(item), 1);
             
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            console.log(err);
            LoaderStop();
           
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            
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
           
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
           
        });
    }
    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }

    vm.GetReportedPostId = GetReportedPostId;
    function GetReportedPostId(item) {
        localStorage.removeItem('ReportedPostId');
        localStorage.removeItem('ReportedCommentId');
        localStorage.removeItem('Type');
        localStorage.setItem('Type', item.Type);
        localStorage.setItem('ReportedPostId', item.PostId);
        localStorage.setItem('ReportedCommentId', item.CommentId);
        $state.go('ReportedCommentDetail');
    }

}]);