var CelebrityApp = angular.module("rootApp.CelebrityApp", []);
CelebrityApp.controller("CelebrityController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.GetCelebrityProfileId = GetCelebrityProfileId;
    vm.Request = true;
    vm.Verified = false;

    //paging    
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getCelebrityList(vm.SearchCelebrity, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getCelebrityList(vm.SearchCelebrity, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchCelebrityList = searchCelebrityList;
    function searchCelebrityList(keyword, page) {

        $scope.currentPage = 1;
        getUserList(keyword, page);
    };
    //***********


    vm.requestShow = function()
    {
        vm.Request = true;
        vm.Verified = false;
        vm.getCelebrityList("",1);
    }

    vm.verifiedShow = function () {
        vm.Request = false;
        vm.Verified = true;
        vm.getVerifiedCelebrityList("",1);
    }

    vm.CelebrityList = [];
    getCelebrityList("",1);
    vm.getCelebrityList = getCelebrityList;
    function getCelebrityList(keyword,page) {
        LoaderStart();
    
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'CelebrityList', 'Request?search=' + keyword + '&page=' + page, function (response) {
            if (response.Success) {
                vm.CelebrityList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.CelebrityList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
               // console.log(vm.CelebrityList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                if (keyword != "" && page == 1) {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage');
            }
            else
            {
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            }           
        });
    }

    //paging    

    $scope.currentPage1 = 1;
    $scope.pageSize = 10;

    $scope.prevPage1 = function () {
        if ($scope.currentPage1 > 1) {
            $scope.currentPage1--;
            getVerifiedCelebrityList(vm.SearchVerifiedCelebrity, $scope.currentPage1);
        }
    };

    $scope.nextPage1 = function () {
        if (($scope.currentPage1 * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage1++;
            getVerifiedCelebrityList(vm.SearchVerifiedCelebrity, $scope.currentPage1);
        }
    };

    $scope.setPage1 = function () {
        $scope.currentPage1 = this.n;
    };

    vm.searchVerifiedCelebrityList = searchVerifiedCelebrityList;
    function searchVerifiedCelebrityList(keyword, page) {

        $scope.currentPage1 = 1;
        getVerifiedCelebrityList(keyword, page);
    };
    //***********
    vm.VerifiedCelebrityList = [];
    vm.getVerifiedCelebrityList = getVerifiedCelebrityList;
    function getVerifiedCelebrityList(keyword,page) {
        LoaderStart();

        APIInterface.getDataWithAnyId(EndPoint.Admin, 'CelebrityList', 'Verified?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.VerifiedCelebrityList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.VerifiedCelebrityList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
               // console.log(vm.VerifiedCelebrityList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
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
    function GetCelebrityProfileId(item) {
        localStorage.removeItem('CelebrityId');
        localStorage.setItem('CelebrityId', item.UserId);
        $state.go('CelebrityProfile');
    }

    vm.BlockCelebrity = BlockCelebrity;
    function BlockCelebrity(item) {
        var postData = {
            Type: 'User',
            Id: item.UserId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'adminBlock', postData, function (response) {
            if (response.Success) {
                item.Block = item.Block == 'Unblock' ? 'Block' : 'Unblock';

               // console.log(response);
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

    vm.AcceptCelebrity = AcceptCelebrity;
    function AcceptCelebrity(item) {
        var postData = {
            Type: "Accept",
            Id: item.UserId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'acceptCelebrity', postData, function (response) {
            if (response.Success) {
                vm.CelebrityList.splice(vm.CelebrityList.indexOf(item), 1);
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

    vm.RejectCelebrity = RejectCelebrity;
    function RejectCelebrity(item) {
        var postData = {
            Type: "Reject",
            Id: item.UserId
        }
        LoaderStart();
        APIInterface.putData(EndPoint.Admin, 'acceptCelebrity', postData, function (response) {
            if (response.Success) {
                vm.CelebrityList.splice(vm.CelebrityList.indexOf(item), 1);
               // console.log(response);
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
    vm.orderByMe = orderByMe;
    function orderByMe(x) {
        vm.myOrderBy = x;
    }
}]);