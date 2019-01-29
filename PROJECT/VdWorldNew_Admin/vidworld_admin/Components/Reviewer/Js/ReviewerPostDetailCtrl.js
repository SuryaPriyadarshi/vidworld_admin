var ReviewerPostDetailApp = angular.module("rootApp.ReviewerPostDetailApp", []);
ReviewerPostDetailApp.controller("ReviewerPostDetailController", ['$scope', '$sce','$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.IsPost = true;
    vm.IntializeMethod = IntializeMethod;
    vm.LikeList = [];
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('postId');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getPostDetail(vm.id);
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
               // console.log(vm.PostDetail);
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
    vm.getViewCommentData = getViewCommentData;
    function getViewCommentData(item) {
     
        $rootScope.GetAllComments(item, 1);
    }
    //*******Popup Likelist*******
    vm.LikeListMethod = LikeListMethod;
    function LikeListMethod(item) {

        $rootScope.GetLikeListMethod(item);
      
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
        // scope.PostViewCountMethod(item);
        $("#youtube_video")[0].src = new_src;
    }
   
}]);