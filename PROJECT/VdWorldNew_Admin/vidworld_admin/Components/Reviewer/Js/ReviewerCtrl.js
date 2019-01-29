var ReviewerApp = angular.module("rootApp.ReviewerApp", []);
ReviewerApp.controller("ReviewerController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;
    vm.GetProfileId = GetProfileId;
    vm.DeleteReviewer = DeleteReviewer;
    vm.passwordRegEx = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&])[A-Za-z\0-9$@$!%*#?&]{6,15}$/;
    vm.emailexpr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    //paging
    $scope.totalCount = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;;

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getReviewerList(vm.SearchReviewer, $scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getReviewerList(vm.SearchReviewer, $scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    vm.searchReviewerList = searchReviewerList;
    function searchReviewerList(keyword, page) {

        $scope.currentPage = 1;
        getReviewerList(keyword, page);
    };
    //***********

    vm.ReviewerList = [];
    getReviewerList("",1);
    vm.getReviewerList = getReviewerList;
    function getReviewerList(keyword,page) {
        LoaderStart();
   
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'reviewerList?search=' + keyword + "&page=" + page, function (response) {
            if (response.Success) {
                vm.ReviewerList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;
                angular.forEach(vm.ReviewerList, function (value, key) {
                    value.Block = value.IsActive.data == 1 ? 'Block' : 'Unblock';
                })
                console.log(vm.ReviewerList);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
            }
        }, function (err) {
            LoaderStop();
            if (err.Status == 404 || err.Status == 400) {
                if(keyword != "" && page == 1)
                {
                    SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
                }
            }
            else if (err.Status == 401) {
                $state.go('loginpage')
            } else {
                SweetAlert.swal(AppConstant.Warning, err.Message, AppConstant.Error);
            }
        });
    }
    $rootScope.Id = '';
    function GetProfileId(item) {
        localStorage.removeItem('reviewerId');
        localStorage.setItem('reviewerId', item.UserId);       
        $state.go('ReviewerProfile');
    }

    function DeleteReviewer(item) {
        var putData = {
            Type: 'User',
            Id: item.UserId           
        }
        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'adminDelete',putData,function (response) {
            if (response.Success) {
                vm.ReviewerList.splice(vm.ReviewerList.indexOf(item), 1);

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

    vm.BlockReviewer = BlockReviewer;
    function BlockReviewer(item) {
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
    vm.reset = reset;
    function reset() {
        vm.addEmployee = false;
        vm.Name = "";
        vm.Email = "";
        vm.Phone = "";
        vm.Password = "";
        vm.CPassword = "";
    }
    /*Insert new reviewer*/
    vm.SetValues = SetValues;
    function SetValues() {
        var myModel = {
            Username: vm.Name,
            Email: vm.Email,
            Phone: vm.Phone,
            Password: vm.Password
        }


        vm.addEmployee = true;
        if ($scope.addEmployeeform.$valid) {
            if (vm.Password != vm.CPassword) {
                SweetAlert.swal(AppConstant.AlertTitle, "Assign Password and Confirm Password must be same", AppConstant.Warning);
            }
            else {
                APIInterface.postData(EndPoint.Admin, 'addReviewer', myModel, function (response) {
                //    console.log(response);

                    if (response.Success) {
                        vm.getReviewerList("", 1);
                        ClosePopUp('#new_reviewer');
                        vm.addEmployee = true;
                        vm.Name = "";
                        vm.Email = "";
                        vm.Phone = "";
                        vm.Password = "";
                        vm.CPassword = "";
                        $scope.currentPage = 1;
                        LoaderStop();
                    } else {
                        LoaderStop();
                        SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                    }
                }, function (err) {
                  //  console.log(err);

                    LoaderStop();                
                    SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
                });

            }
        }
    }
}]);