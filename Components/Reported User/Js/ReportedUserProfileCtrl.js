var ReportedUserProfileApp = angular.module("rootApp.ReportedUserProfileApp", []);
ReportedUserProfileApp.controller("ReportedUserProfileController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope,$sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    $rootScope.getReportedUserProfile = getReportedUserProfile;

    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    vm.IsPost = true;
    vm.IsUser = true;
    vm.i = 1;
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedByUser(vm.id,$scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedByUser(vm.id,$scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
    
    //***********


    ReportedUserProfile = [];
    vm.IntializeMethod = IntializeMethod;
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('ReportedUserId');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getReportedUserProfile(vm.id);
            vm.i = 1;
            
        }
    }
    function getReportedUserProfile(Id) {
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'userProfile', Id, function (response) {
            if (response.Success) {
                vm.ReportedUserProfile = response.Result;
                vm.ReportedUserPostList(Id, 1);
                vm.i = 1;
                getReportedByUser(Id, 1);
                GetPostRevenue(Id);
             //   console.log(vm.ReportedUserProfile);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                vm.IsUser = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

    vm.ReportedUserPost = true;
    vm.ReportedUserPostList = ReportedUserPostList;

    function ReportedUserPostList(Id,page) {
        vm.ReportedUserPost = true;
        vm.IsPost = true;
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getUserPost', Id + "?&page=" + page, function (response) {
            if (response.Success) {
                vm.i = page + 1;
               // vm.UserViewPost = response.Result;
                angular.forEach(response.Result, function (value, key) {
                    value.ShowMediaUrl = $sce.trustAsResourceUrl(value.MediaUrl);
                    value.Ago = TimeDifferenceOfPost(value);
                });
                if (response.Result.length > 0 && page == 1) {

                    vm.UserViewPost = response.Result;
                    vm.ToatalUserPost = response.Result[0].TotalPostCount;
                }
                else if (response.Result.length > 0 && vm.UserViewPost.length > 0) {
                    vm.UserViewPost = vm.UserViewPost.concat(response.Result);
                }
                else {
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
              //  console.log(response);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                if (page == 1) {
                    vm.IsPost = false;
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

    vm.ReportedUserRevenue = ReportedUserRevenue;
    function ReportedUserRevenue(Id) {
        vm.ReportedUserPost = false;
        vm.Payment = false;
        GetPostRevenue(Id);
    }

    function getReportedByUser(Id,page) {
        var Type = 'user';
        LoaderStart();
        APIInterface.getDataWithTwoId(EndPoint.Admin, 'userReported', Id,Type +'?page=' + page,function (response) {
            if (response.Success) {
                vm.ReportedByUser = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
              //  console.log(vm.ReportedByUser);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {

            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

    vm.postDetailId = postDetailId;
    function postDetailId(item) {
        localStorage.removeItem('postId');
        localStorage.setItem('postId', item.PostId);
        $state.go('ReviewerPostDetail');
    }

    vm.WatchVideo = WatchVideo;
    function WatchVideo(item, event) {
        $scope.PlayYouTubeVideo(item, event);
    }

    $scope.PlayYouTubeVideo = function (item, event) {
      //  console.log(item);
        $(event.target).parent().hide().next().show();

        var new_src = item.MediaUrl.replace('autoplay=0', '');
        new_src += "&autoplay=1";
        new_src = $sce.trustAsResourceUrl(new_src);
        item.ShowMediaUrl = new_src;
        // scope.PostViewCountMethod(item);
    }
    vm.LikeListMethod = LikeListMethod;
    function LikeListMethod(item) {
        $rootScope.GetLikeListMethod(item);
    }
    vm.getViewCommentData = getViewCommentData;
    function getViewCommentData(item) {

        $rootScope.GetAllComments(item, 1);
    }

    vm.showPost = showPost;
    function showPost(id) {
        vm.Payment = false;
        GetPostRevenue(id);
    }

    vm.showPayment = showPayment;
    function showPayment(id) {
        vm.Payment = true;
        GetPaymentRevenue(id);

    }

    function GetPostRevenue(id) {

        vm.PostRevenueList = [];
        LoaderStart();
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'showRevenueDetail?Id=' + id, function (response) {
            LoaderStop();
            console.log(response);
            if (response.Success) {

                vm.PostRevenueList = response.Result;
                angular.forEach(vm.PostRevenueList, function (value, key) {
                    value.PostCreatedDate = new Date(value.PostCreatedDate);
                })


            } else {
                SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
            }

        }, function (err) {
            LoaderStop();
            // console.log(err);
            if (err.Status == 404 || err.Status == 400) {

                //  $scope.IsScollEnable = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);

        });
    }

    function GetPaymentRevenue(id) {

        vm.PaymentRevenueList = [];
        LoaderStart();
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'getPaymentHistory?Id=' + id, function (response) {
            LoaderStop();
            console.log(response);
            if (response.Success) {

                vm.PaymentRevenueList = response.Result;
                angular.forEach(vm.PaymentRevenueList, function (value, key) {
                    value.RevenueCreatedDate = new Date(value.RevenueCreatedDate);
                })

            } else {
                SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
            }

        }, function (err) {
            LoaderStop();
            // console.log(err);
            if (err.Status == 404 || err.Status == 400) {

                //  $scope.IsScollEnable = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);

        });
    }



}]);