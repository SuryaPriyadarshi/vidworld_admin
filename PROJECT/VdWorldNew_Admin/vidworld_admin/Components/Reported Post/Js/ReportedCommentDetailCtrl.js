var ReportedCommentDetailApp = angular.module("rootApp.ReportedCommentDetailApp", []);
ReportedCommentDetailApp.controller("ReportedCommentDetailController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

    vm.IntializeMethod = IntializeMethod;
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('ReportedPostId');
        vm.commentid = localStorage.getItem('ReportedCommentId');
        vm.type = localStorage.getItem('Type');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getPostDetail(vm.id);
        }
        if (vm.commentid != undefined && vm.commentid != null && vm.commentid.trim() != '') {
            getComment(vm.commentid, vm.type);
        }
    }
    function getPostDetail(Id) {
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

                //  $scope.IsScollEnable = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
            SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
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

    function getComment(Id,type) {
        LoaderStart();

        APIInterface.getDataWithTwoId(EndPoint.Admin, 'getReportedComment', Id, type, function (response) {
            if (response.Success) {
                vm.ReportedComment = response.Result[0].Comment;
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            console.log(err);
            if (err.Status == 404) {

            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }


}]);