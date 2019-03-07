var LikeApp = angular.module("rootApp.LikeApp", []);
LikeApp.controller("LikeController", ['$scope', '$sce', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope,$sce, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.GetLikeListMethod = GetLikeListMethod;
  //  vm.GetLikeListMethod = GetLikeListMethod;

function GetLikeListMethod(item) {
    GetLikeList(item,1)
   // vm.LikeList = item.LikeList;
}

vm.AllLikeList = [];
vm.LikePostModal = {};
vm.IsLikePopUpScrollable = false;
function GetLikeList(model, page) {
    vm.LikePostModal = model;
    APIInterface.getDataWithAnyId(EndPoint.Admin, 'likeList', model.PostId + '?page=' + page, function (response) {
        if (response.Success) {
            if (response.Result.length > 0 && page == 1) {
                vm.AllLikeList = [];
                vm.IsLikePopUpScrollable = response.Result.length > 0 ? true : false;
                vm.LikeListPage = page + 1;
                vm.AllLikeList = response.Result;
            }
            else if (response.Result.length > 0 && vm.AllLikeList.length > 0) {
                vm.IsLikePopUpScrollable = response.Result.length > 0 ? true : false;
                vm.LikeListPage = page + 1;
                vm.AllLikeList = vm.AllLikeList.concat(response.Result);
            }
        } else {
            SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
        }
    }, function (err) {

        if (err.Status == 404) {
            vm.IsLikePopUpScrollable = false;
        }
        else if (err.Status == 401) {
           // $state.go('loginpage');
        }
        else
            SweetAlert.swal(AppConstant.ErrorTitle, AppConstant.ServerErrorMessage, AppConstant.Error);

    });
}


$('#likeList_div').scroll(function () {
   
        var element = document.getElementById("likeList_div");
        var maxHeight = element.scrollHeight - element.clientHeight;
        if (element.scrollTop >= maxHeight) {

            if (vm.IsLikePopUpScrollable == true) {
                vm.IsLikePopUpScrollable = false;
                GetLikeList(vm.LikePostModal, vm.LikeListPage)
                // alert('bootom of the div');
            }
        
    }
});
    //*******End AllLikeLIst********

}]);