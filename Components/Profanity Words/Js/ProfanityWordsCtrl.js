var ProfanityWordsApp = angular.module("rootApp.ProfanityWordsApp", []);
ProfanityWordsApp.controller("ProfanityWordsController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'readFileData', 'AppConstant',
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
            getProfanityList($scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getProfanityList($scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********

    vm.ProfanityList = [];
    getProfanityList(1);
    function getProfanityList(page) {
        LoaderStart();
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'getProfanityList?page=' + page, function (response) {
            if (response.Success) {
                vm.ProfanityList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ProfanityList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                    value.UpdatedDate = value.UpdatedDate == "0000-00-00 00:00:00" || value.UpdatedDate == null || value.UpdatedDate == "" ? '' : new Date(value.UpdatedDate);
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                    value.Status = value.IsActive.data == 1 ? 'Active' : 'Inactive';
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

    vm.BlockUser = BlockUser;
    function BlockUser(item) {
        var postData = {
            ProfanityWordId: item.ProfanityWordId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'blockProfanity', postData, function (response) {
            if (response.Success) {
                item.Block = item.Block == 'Unblock' ? 'Block' : 'Unblock';
                item.Status = item.Block == 'Unblock' ? 'Inactive' : 'Active';
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

    vm.AddProfanity = AddProfanity;
    function AddProfanity() {
        vm.ProfanityTrue = true;
        var myModel = {
            ProfanityWord: vm.ProfanityWord,
            ProfanityWordId: vm.Id
        }
        
        if ($scope.addProfanityform.$valid) {
                LoaderStart();
                APIInterface.putData(EndPoint.Admin, 'updateProfanity', myModel, function (response) {
                    //   console.log(response);

                    if (response.Success) {
                        getProfanityList($scope.currentPage);

                        ClosePopUp('#add_hashtag');
                        vm.ProfanityWord = "";
                        vm.ProfanityTrue = false;
                        $scope.currentPage = 1;
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
    vm.OpenView = OpenView;
    function OpenView(item) {        
        vm.ProfanityWord = item.ProfanityWord
        vm.Id = item.ProfanityWordId
        vm.ProfanityTrue = false;
    }

    $scope.fileDataObj = {};

    $scope.uploadFile = function () {
     //   alert(1);
        if ($scope.fileContent) {
            $scope.fileDataObj = readFileData.processData($scope.fileContent);
            // console.log("fileDataObj" + $scope.fileDataObj)
           // $scope.fileData = JSON.stringify($scope.fileDataObj);

           //  console.log("fileData" + $scope.fileData)

            var myModel = {
                ProfanityList: $scope.fileDataObj
            }

            LoaderStart();
            APIInterface.postData(EndPoint.Admin, 'saveProfanityList', myModel, function (response) {
                console.log(response);

                if (response.Success) {
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