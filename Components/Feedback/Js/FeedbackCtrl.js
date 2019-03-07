var FeedbackApp = angular.module("rootApp.FeedbackApp", []);
FeedbackApp.controller("FeedbackController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

    //paging

    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getFeedbackList($scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getFeedbackList($scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********


    vm.OpenViewImage = OpenViewImage;
    vm.OpenViewMail = OpenViewMail;
    vm.FeedbackList = [];
    getFeedbackList(1);
    function getFeedbackList(page) {
        LoaderStart();
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'feedback?page=' + page, function (response) {
            if (response.Success) {
                vm.FeedbackList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.FeedbackList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                })
              //  console.log(vm.FeedbackList);
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
            else {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
        });
    }
    function OpenViewImage(item){
        document.querySelector("#img_element").src = item.ImageUrl;
        vm.name = item.UserName
    }
    function OpenViewMail(item) {
        vm.Mail = item.EmailId;
        vm.ReceiverId = item.UserId;
        vm.addEmployee = false;
        vm.MailBody = "";
    }
    vm.SendMail = SendMail;
    function SendMail() {
        var myModel = {
            Email: vm.Mail,
            Body: vm.MailBody,
            ReceiverId: vm.ReceiverId
        }
        vm.addEmployee = true;
        if ($scope.addEmployeeform.$valid) {

            APIInterface.postData(EndPoint.Admin, 'adminReply', myModel, function (response) {
                //  console.log(response);
                LoaderStart();
                if (response.Success) {
                    ClosePopUp('#reply_mail');
                    vm.addEmployee = false;
                    vm.MailBody = "";
                    LoaderStop();
                } else {
                    LoaderStop();
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
            }, function (err) {
                //  console.log(err);
                              
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            });
        }
    }
}]);