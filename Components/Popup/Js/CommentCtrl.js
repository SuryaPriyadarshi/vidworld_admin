var CommentApp = angular.module("rootApp.CommentApp", []);
CommentApp.controller("CommentController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope,$sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.GetAllComments = GetAllComments;
    $scope.IsShowMoreLoad = false;
    vm.CommentList = [];
    var maxHeight = 0;

    vm.resetComment = resetComment;
    function resetComment() {
        vm.CommentList = [];
    }
    $scope.IsCommentScroll = false;
    function GetAllComments(model, page) {
        vm.CommentList = [];
            APIInterface.getDataWithAnyId(EndPoint.Admin, 'commentList', model.PostId + '?&page=' + page, function (response) {
                if (response.Success) {
                    vm.currentCommentPage = page + 1;
                    $scope.IsCommentScroll = response.Result.length > 0 ? true : false;
                    if (page == 1) {
                        angular.forEach(response.Result, function (value, key) {
                            value.CommentAgo = TimeDifferenceOfPost(value);
                           value.ChildCommentList = [];
                            value.IsViewAllComment = false;
                        });
                        vm.CommentList = response.Result;
                       // console.log(vm.CommentList);
                        $scope.IsShowMoreLoad = vm.CommentList.length > 9 ? true : false;
                    }
                    else {
                        $scope.IsShowMoreLoad = response.Result.length > 9 ? true : false;
                        response.Result = response.Result.reverse();
                        angular.forEach(response.Result, function (value, key) {
                            value.CommentAgo = TimeDifferenceOfPost(value);
                          vm.CommentList.unshift(value);
                            value.ChildCommentList = [];
                            value.IsViewAllComment = false;
                          
                        });
                    }

                } else {
                    SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
                }
            }, function (err) {
                if (err.Status == 404) {

                }
                else if (err.Status == 401) {
                    $state.go('loginpage')
                } else {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }


            });
    }


    vm.LoadMoreComment = LoadMoreComment;
    function LoadMoreComment() {

        if ($scope.IsCommentScroll == true) {
            $scope.IsCommentScroll = false;
            $('#comment_div').scrollTop(0);
          //  console.log($('#comment_div').scrollTop(0));
            $rootScope.GetAllComments($scope.UserModal, vm.currentCommentPage);

        }
    }
    vm.getAllReplies = getAllReplies;
    function getAllReplies(CommentId, mainCommentModel) {
    
        if (mainCommentModel.IsViewAllComment == false) {
            //vm.ViewData="Hide all replies";
            mainCommentModel.IsViewAllComment = true;
            APIInterface.getDataWithAnyId(EndPoint.Admin, 'commentReplyList', CommentId, function (response) {
                if (response.Success) {
                    vm.ReplyList = [];
                    vm.ReplyList = response.Result;
                    angular.forEach(vm.ReplyList, function (value, key) {
                        value.CommentAgo = TimeDifferenceOfPost(value);
                    });
                    mainCommentModel.ChildCommentList = vm.ReplyList;


                } else {
                    SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
                }

            }, function (err) {
               // console.log(err);
                if (err.Status == 404 || err.Status == 400) {
                    // vm.UserDetail = {};
                }
                else if (err.Status == 401) {
                 
                }
                else
                    SweetAlert.swal(AppConstant.ErrorTitle, AppConstant.ServerErrorMessage, AppConstant.Error);

            });
        }
        else {
            mainCommentModel.IsViewAllComment = false;
        }
    }
}]);