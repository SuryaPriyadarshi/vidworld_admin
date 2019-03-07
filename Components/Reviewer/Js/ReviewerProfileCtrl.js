var ReviewerProfileApp = angular.module("rootApp.ReviewerProfileApp", []);
ReviewerProfileApp.controller("ReviewerProfileController", ['$scope','$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope,$sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    $rootScope.getReviewerProfile = getReviewerProfile;
    ReviewerProfile = [];
    vm.IntializeMethod = IntializeMethod;
    vm.IsPost = true;
    vm.IsReviewer = true;
    vm.i = 1;
    IntializeMethod();
    function IntializeMethod() {
        vm.id = localStorage.getItem('reviewerId');
        if (vm.id != undefined && vm.id != null && vm.id.trim() != '') {
            getReviewerProfile(vm.id);
            vm.i = 1;
      }
    }
    function getReviewerProfile(Id) {
        LoaderStart();
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'reviewerProfile', Id, function (response) {
            if (response.Success) {
                vm.ReviewerProfile = response.Result;
                vm.ReviewerProfile.UserId = Id;
                ApprovedList(Id,1);
                vm.i = 1;
             //   console.log(vm.ReviewerProfile);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                vm.IsReviewer = false;
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }
    vm.Approve = true;

    vm.ApprovedList = ApprovedList;
    function ApprovedList(Id,page) {
        vm.Approve = true;
        vm.IsPost = true;
        LoaderStart();
        APIInterface.getDataWithTwoId(EndPoint.Admin, 'reviewerPost', Id, 'Approved?&page=' + page, function (response) {
            if (response.Success) {
                vm.i = page + 1;
               // vm.ApprovedPost = response.Result;
                angular.forEach(response.Result, function (value, key) {
                    value.ShowMediaUrl = $sce.trustAsResourceUrl(value.MediaUrl);
                    value.Ago = TimeDifferenceOfPost(value);
                });
                if (response.Result.length > 0 && page == 1) {

                    vm.ApprovedPost = response.Result;
                    vm.ToatalUserPost = response.Result[0].TotalCount;
                }
                else if (response.Result.length > 0 && vm.ApprovedPost.length > 0) {
                    vm.ApprovedPost = vm.ApprovedPost.concat(response.Result);
                }
                else {
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
                console.log(vm.ApprovedPost);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404) {
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

    vm.RejectList = RejectList;
    function RejectList(Id, page) {
        vm.Approve = false;
        vm.IsPost = true;
        LoaderStart();
        APIInterface.getDataWithTwoId(EndPoint.Admin, 'reviewerPost', Id, 'Rejected?&page=' + page, function (response) {
            if (response.Success) {
                vm.i = page + 1;
               // vm.RejectedPost = response.Result;
                angular.forEach(response.Result, function (value, key) {
                    value.ShowMediaUrl = $sce.trustAsResourceUrl(value.MediaUrl);
                    value.Ago = TimeDifferenceOfPost(value);
                });
                if (response.Result.length > 0 && page == 1) {

                    vm.RejectedPost = response.Result;
                    vm.ToatalUserPost = response.Result[0].TotalCount;
                }
                else if (response.Result.length > 0 && vm.RejectedPost.length > 0) {
                    vm.RejectedPost = vm.RejectedPost.concat(response.Result);
                }
                else {
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
                console.log(vm.RejectedPost);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404) {
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
    vm.postDetailId = postDetailId;
    function postDetailId(item) {
        localStorage.removeItem('postId');
        localStorage.setItem('postId', item.PostId);
        $state.go('ReviewerPostDetail');
    }

    vm.WatchVideo = WatchVideo;
    function WatchVideo(item,event) {
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

    vm.ReviewerDelete = ReviewerDelete;
    function ReviewerDelete(item) {
        var putData = {
            Type: 'User',
            Id: item
        }
        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'adminDelete', putData, function (response) {
            if (response.Success) {
                $state.go('Reviewer');

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



    

}]);