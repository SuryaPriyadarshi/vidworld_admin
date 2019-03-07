var CategoriesApp = angular.module("rootApp.CategoriesApp", []);
CategoriesApp.controller("CategoriesController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
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
            getCategoryList($scope.currentPage);
        }
    };

    $scope.nextPage = function () {
        if (($scope.currentPage * $scope.pageSize) <= $scope.totalCount - 1) {
            $scope.currentPage++;
            getCategoryList($scope.currentPage);
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    //***********

    vm.CategoryList = [];
    getCategoryList(1);
    function getCategoryList(page) {
        LoaderStart();
        APIInterface.getDataWithoutParam(EndPoint.Admin, 'categoryList?page=' + page, function (response) {
            if (response.Success) {
                vm.CategoryList = response.Result;
                $scope.totalCount = response.Result[0].TotalCount;

              //  console.log(vm.CategoryList);
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
    vm.reset = reset;
    function reset() {
          vm.CategoryTrue = false;
        vm.CategoryName = "";
    }
    vm.AddCategory = AddCategory;
    function AddCategory() {
        vm.CategoryTrue = true;
        var myModel = {
            Category: vm.CategoryName
        }


        if ($scope.addCategoryform.$valid) {
            APIInterface.postData(EndPoint.Admin, 'addCategory', myModel, function (response) {
                LoaderStart();
             //   console.log(response);

                if (response.Success) {
                    getCategoryList(1);
                    ClosePopUp('#add_category');
                    vm.CategoryTrue = true;
                    vm.CategoryName = "";
                    $scope.currentPage = 1;
                    LoaderStop();
                } else {
                    LoaderStop();
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
            }, function (err) {
              console.log(err);
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            });

        }

    }

    vm.OpenSubCategory = OpenSubCategory;
    function OpenSubCategory(item) {
        vm.CategoryId = item.CategoryId;
        vm.SubCategoryTrue = false;
        vm.SubCategoryName = "";
    }

    vm.AddSubCategory = AddSubCategory;
    function AddSubCategory(CategoryId) {
        vm.SubCategoryTrue = true;
        var myModel = {
            SubCategory: vm.SubCategoryName,
            CategoryId: CategoryId
        }

       // console.log(myModel);
        if ($scope.addSubCategoryform.$valid) {
            APIInterface.postData(EndPoint.Admin, 'addSubCategory', myModel, function (response) {
                LoaderStart();
             //   console.log(response);
                if (response.Success) {
                    getCategoryList(1);
                    ClosePopUp('#add_subcategory');
                    vm.SubCategoryTrue = true;
                    vm.SubCategoryName = "";
                    LoaderStop();
                } else {
                    LoaderStop();
                    SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
                }
            }, function (err) {
                console.log(err);
             
                SweetAlert.swal(AppConstant.ErrorTitle, err.Message, AppConstant.Error);
            });

        }
    }

    vm.DeleteCategory = DeleteCategory;
    function DeleteCategory(item) {

        var putData = {
            Type: 'Category',
            Id: item.CategoryId
        }
        LoaderStart();
        APIInterface.deleteData(EndPoint.Admin, 'adminDelete', putData, function (response) {
            if (response.Success) {
              //  console.log(item);
                vm.CategoryList.splice(vm.CategoryList.indexOf(item), 1);

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

}]);