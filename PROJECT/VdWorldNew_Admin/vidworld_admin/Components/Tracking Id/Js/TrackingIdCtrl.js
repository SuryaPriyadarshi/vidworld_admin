var TrackingIdApp = angular.module("rootApp.TrackingIdApp", []);
TrackingIdApp.controller("TrackingIdController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'readFileData', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, readFileData, AppConstant) {
    BootstrapDatepicker.init();

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
            GetTrackingIdList($scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            GetTrackingIdList($scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********

    GetAmazonId();
    GetTrackingIdList(1);
    vm.AmazonId = 0;
    vm.TrackingIdList = [];

    function GetAmazonId() {

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'getAmazonTrackingCount', function (response) {
            if (response.Success) {
                vm.AmazonId = response.Result[0].TrackingIdCount;

            } else {
                SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
            }

        }, function (err) {
            //  console.log(err);
            if (err.Status == 404 || err.Status == 400) {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);

        });
    }

    function GetTrackingIdList(page) {

        APIInterface.getDataWithoutParam(EndPoint.Admin, 'getAvailableTrackingId?page=' + page, function (response) {
            if (response.Success) {
                vm.TrackingIdList = response.Result;
                $scope.totalCount = response.Result[0].Count;
                angular.forEach(vm.TrackingIdList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                })
            } else {
                SweetAlert.swal(AppConstant.WarningTitle, response.Message, AppConstant.Warning);
            }

        }, function (err) {
            //  console.log(err);
            if (err.Status == 404 || err.Status == 400) {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);

        });
    }
        
        $scope.fileDataObj = {};
    
        $scope.uploadFile = function() {
            if ($scope.fileContent) {
                $scope.fileDataObj = readFileData.processData($scope.fileContent);
              //  console.log("fileDataObj" + $scope.fileDataObj)
              //  $scope.fileData = JSON.stringify($scope.fileDataObj);

              //  console.log("fileData" + $scope.fileData)

                var myModel = {
                    AmazonTrackingId: $scope.fileDataObj
                }

                LoaderStart();
                APIInterface.postData(EndPoint.Admin, 'saveAmazonTrackingId', myModel, function (response) {
                       console.log(response);

                       if (response.Success) {
                          // $scope.fileContent = {};
                        LoaderStop();
                    } else {
                        LoaderStop();
                        SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                    }
                }, function (err) {
                    //    console.log(err);

                    LoaderStop();
                   
                    SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
                });

            }
        }



}]);