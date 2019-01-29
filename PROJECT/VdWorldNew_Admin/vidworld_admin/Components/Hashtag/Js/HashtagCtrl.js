var HashtagApp = angular.module("rootApp.HashtagApp", []);
HashtagApp.controller("HashtagController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.HashTrue = false;
    vm.HastagName = "";
    vm.SearchHashtag = "";
    //paging

    $scope.currentPage = 1;
    $scope.totalCount = 0;
    $scope.pageSize = 10;
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getHashtagList(vm.SearchHashtag, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getHashtagList(vm.SearchHashtag, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchHashtagList = searchHashtagList;
    function searchHashtagList(keyword, page) {

        $scope.currentPage = 1;
        getHashtagList(keyword, page);
    };
    //***********


    vm.DeleteHashtag = DeleteHashtag;
    vm.HashtagList = [];
    getHashtagList("",1);
    vm.getHashtagList = getHashtagList;
    function getHashtagList(keyword,page) {
        LoaderStart();
        if (keyword != null && keyword != '' && keyword != undefined && keyword.charAt(0) === '#') {
            keyword = keyword.substring(1);
        }
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'hashtagList?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.HashtagList = response.Result;
                
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.HashtagList, function (value, key) {
                    value.CreatedDate = new Date(value.CreatedDate);
                })
            //   console.log(vm.HashtagList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
           // console.log(err);
            if (err.Status == 404 || err.Status == 400) {
                if (keyword != "" && page == 1) {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }
        });
    }

    function DeleteHashtag(item) {
  
        var putData = {
            Type: 'Hashtag',
            Id: item.HashTagId
        }
        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'adminDelete', putData, function (response) {
            if (response.Success) {
             //   console.log(item);
                vm.HashtagList.splice(vm.HashtagList.indexOf(item), 1);

             //   console.log(response);
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
    vm.reset = reset;
    function reset() {
        vm.HastagName = "";
        vm.HashTrue = false;
    }
    vm.AddHashtag = AddHashtag;
    function AddHashtag() {
        vm.HashTrue = true;
        var myModel = {
            HashTag: vm.HastagName
        }

        var n = vm.HastagName.includes("#");
        if (n) {
            SweetAlert.swal(AppConstant.AlertTitle, "Word cannot contain #", AppConstant.Warning);
        }
        else {
            if ($scope.addHashTagform.$valid) {
                LoaderStart();
                APIInterface.postData(EndPoint.Admin, 'addHashtag', myModel, function (response) {
                 //   console.log(response);

                    if (response.Success) {
                        vm.getHashtagList("", 1);

                        ClosePopUp('#add_hashtag');
                        vm.HastagName = "";
                        vm.HashTrue = false;
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
    }
    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }

    }]);
            
          
                

