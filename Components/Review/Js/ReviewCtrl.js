var ReviewApp = angular.module("rootApp.ReviewApp", []);
ReviewApp.controller("ReviewController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
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
            getReviewList($scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReviewList($scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********

    vm.ReviewList = [];
    getReviewList(1);
    function getReviewList(page) {
        LoaderStart();

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'reviews?page=' + page, function (response) {
            if (response.Success) {
                vm.ReviewList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReviewList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                })
               // console.log(vm.ReviewList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404) {

            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }

}]);