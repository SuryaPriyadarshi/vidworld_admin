var ReportedPostDetailApp = angular.module("rootApp.ReportedPostDetailApp", []);
ReportedPostDetailApp.controller("ReportedPostDetailController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    // $rootScope.ReportedPostDetail = ReportedPostDetail;
    vm.IsPost = true;
    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReportedByUser(vm.id, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReportedByUser(vm.id, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********


    ReportedPostDetail = [];
    vm.IntializeMethod = IntializeMethod;
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('ReportedPostId');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getPostDetail(vm.id);
            getReportedByUser(vm.id,1);

        }
    }

    function getPostDetail(Id) {
        vm.IsPost = true;
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getPostDetail', Id, function (response) {
            if (response.Success) {
                vm.PostDetail = response.Result;
                vm.PostDetail.Ago = TimeDifferenceOfPost(vm.PostDetail);
                vm.PostDetail.ShowMediaUrl = $sce.trustAsResourceUrl(vm.PostDetail[0].MediaUrl);
                console.log(vm.PostDetail);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                vm.IsPost = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

    //*******Popup Likelist*******
    vm.GetLikeListMethod = GetLikeListMethod;
    function GetLikeListMethod(item) {
        vm.LikeList = item.LikeList;
    }
    vm.RedirectToUrl = RedirectToUrl;
    function RedirectToUrl(item) {

        window.open(item.AddLink);

    }
    vm.WatchVideo = WatchVideo;
    function WatchVideo(item, event) {
        $scope.PlayYouTubeVideo(item, event);
    }

    $scope.PlayYouTubeVideo = function (item, event) {

        $(event.target).parent().hide().next().show();
        var new_src = item.MediaUrl.replace('autoplay=0', '');
        new_src += "&autoplay=1";
        //new_src = $sce.trustAsResourceUrl(new_src);
        //item.ShowMediaUrl = new_src;
        $("#youtube_video")[0].src = new_src;

        
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

    function getReportedByUser(Id,page) {
        var Type = 'post';
        LoaderStart();
        APIInterface.getDataWithTwoId(EndPoint.Admin, 'userReported', Id, Type + '?page=' + page, function (response) {
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
   
}]);