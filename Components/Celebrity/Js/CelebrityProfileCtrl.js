var CelebrityProfileApp = angular.module("rootApp.CelebrityProfileApp", []);
CelebrityProfileApp.controller("CelebrityProfileController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    $rootScope.getCelebrityProfile = getCelebrityProfile;
    CelebrityProfile = [];
    vm.IntializeMethod = IntializeMethod;
    vm.IsPost = true;
    vm.IsCelebrity = true;
    vm.i = 1;
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('CelebrityId');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getCelebrityProfile(vm.id);
            vm.i = 1;
        }
    }
    function getCelebrityProfile(Id) {
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'UserProfile', Id, function (response) {
            if (response.Success) {
                vm.CelebrityProfile = response.Result;
                CelebrityPostList(Id, 1);
                vm.i = 1;
                GetPostRevenue(Id);
               console.log(vm.CelebrityProfile);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                vm.IsCelebrity = false;
                //  $scope.IsScollEnable = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
        });
    }

    vm.CelebrityPost = true;
    vm.CelebrityPostList = CelebrityPostList;

    function CelebrityPostList(Id,page) {
        vm.CelebrityPost = true;
        vm.IsPost = true;
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getUserPost', Id + "?&page=" + page, function (response) {
            if (response.Success) {
                vm.i = page + 1;
              //  vm.UserViewPost = response.Result;
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
                console.log(response);
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
                $state.go('loginpage');
            }
            else {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
        });
    }

    vm.CelebrityRevenue = CelebrityRevenue;
    function CelebrityRevenue(Id) {
        vm.CelebrityPost = false;
        vm.Payment = false;
        GetPostRevenue(Id);
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
       // console.log(item);
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
            // console.log(response);
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
            //  console.log(response);
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