var TermsAndConditionApp = angular.module("rootApp.TermsAndConditionApp", []);
TermsAndConditionApp.controller("TermsAndConditionController", ['$scope', '$rootScope', '$state', 'SweetAlert', 'APIInterface', 'AppConstant',
function ($scope, $rootScope, $state, SweetAlert, APIInterface, AppConstant) {
    var vm = {};
    $scope.vm = vm;
    $rootScope.routeState = $state.current.name;

    $scope.UserActive = true;
    $scope.CelebrityActive = false;
    $scope.ReviewerActive = false;
    vm.showUserTerms = showUserTerms;
    vm.showUserTerms();
    vm.ClickOnTab = ClickOnTab;
    function ClickOnTab(type) {
        if (type === 1) {
            $scope.UserActive = true;
            $scope.CelebrityActive = false;
            $scope.ReviewerActive = false;
            vm.showUserTerms();
        }
        else if (type === 2 ) {
            $scope.UserActive = false;
            $scope.CelebrityActive = true;
            $scope.ReviewerActive = false;
            vm.showCelebrityTerms();
        }
        else {
            $scope.UserActive = false;
            $scope.CelebrityActive = false;
            $scope.ReviewerActive = true;
            vm.showReviewerTerms();
        }

    }

  
    function showUserTerms() {

        var userterms = "";

        CKEDITOR.replace('Usertermsconditions');
      
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getTermsCondition','user', function (response) {
            LoaderStart();
            if (response.Success) {
              //  console.log(response)
                userterms = response.Result[0].TermsCondition;
                CKEDITOR.instances.Usertermsconditions.setData(userterms);
             //   console.log(userterms)
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
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
  
    vm.showCelebrityTerms = showCelebrityTerms;
    function showCelebrityTerms() {
        var Celebrityterms = "";

        CKEDITOR.replace('Celebritytermsconditions');
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getTermsCondition', 'celebrity', function (response) {
            LoaderStart();
            if (response.Success) {
              //  console.log(response)
                Celebrityterms = response.Result[0].TermsCondition;
                CKEDITOR.instances.Celebritytermsconditions.setData(Celebrityterms);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
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
    vm.showReviewerTerms = showReviewerTerms;
    function showReviewerTerms() {
        var Reviewerterms = "";

        CKEDITOR.replace('Reviewertermsconditions');
        APIInterface.getDataWithAnyId(EndPoint.Admin, 'getTermsCondition', 'reviewer', function (response) {
            LoaderStart();
            if (response.Success) {
              //  console.log(response)
                Reviewerterms = response.Result[0].TermsCondition;
                CKEDITOR.instances.Reviewertermsconditions.setData(Reviewerterms);
                LoaderStop();
            } else {
                LoaderStop();
                SweetAlert.swal(AppConstant.AlertTitle, response.Message, AppConstant.Warning);
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

    vm.saveUserTerms = saveUserTerms;
    function saveUserTerms() {
        var userterms = CKEDITOR.instances.Usertermsconditions.getData();
        if (userterms == "" || userterms == null) {
            SweetAlert.swal(AppConstant.AlertTitle, "Please enter specified detail", AppConstant.Warning);
        }
        else {
            var postData = {
                UserType: 'user',
                TermsCondition: userterms
            }
            LoaderStart();
            APIInterface.putData(EndPoint.Admin, 'termsCondition', postData, function (response) {
                if (response.Success) {
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
            // console.log(userterms);
        }
    }
   
    vm.saveCelebrityTerms = saveCelebrityTerms;
    function saveCelebrityTerms() {
        var Celebrityterms = CKEDITOR.instances.Celebritytermsconditions.getData();
     //   console.log(Celebrityterms);
        console.log(Celebrityterms);
        if (Celebrityterms == "" || Celebrityterms == null) {
            SweetAlert.swal(AppConstant.AlertTitle, "Please enter specified detail", AppConstant.Warning);
        }
        else {
            var postData = {
                UserType: 'celebrity',
                TermsCondition: Celebrityterms
            }
            LoaderStart();
            APIInterface.putData(EndPoint.Admin, 'termsCondition', postData, function (response) {
                if (response.Success) {
                    //    console.log(response);
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
    }

    vm.saveReviewerTerms = saveReviewerTerms;
    function saveReviewerTerms() {
        var Reviewerterms = CKEDITOR.instances.Reviewertermsconditions.getData();
     //   console.log(Reviewerterms);
        if (Reviewerterms == "" || Reviewerterms == null) {
            SweetAlert.swal(AppConstant.AlertTitle, "Please enter specified detail", AppConstant.Warning);
        }
        else {
            var postData = {
                UserType: 'reviewer',
                TermsCondition: Reviewerterms
            }
            LoaderStart();
            APIInterface.putData(EndPoint.Admin, 'termsCondition', postData, function (response) {
                if (response.Success) {
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
    }
}]);
