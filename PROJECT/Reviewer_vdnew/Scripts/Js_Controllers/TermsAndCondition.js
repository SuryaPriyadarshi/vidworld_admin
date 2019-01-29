app.controller('TermsConditionController', function ($scope, $http, myFactory, appConstant, $window, $cookieStore, SweetAlert) {
     var vm = {};
     $scope.vm = vm;
     $(document).ready(function () {
         var sec_height_1 = $(window).innerHeight() - $("header").outerHeight() - $("footer").outerHeight();
         $(".mid-container").css("min-height", sec_height_1);

     });
     $(window).on("load resize", function () {
         var sec_height_1 = $(window).innerHeight() - $("header").outerHeight() - $("footer").outerHeight();
         $(".mid-container").css("min-height", sec_height_1);
     });

     vm.TermsCondition = TermsCondition();
     function TermsCondition() {
         $('#loader').show();
         myFactory.getDataWithAnyId(EndPoint.Admin, 'getTermsCondition', 'Reviewer', function (response) {

             if (response.Success) {
                 vm.TermsConditionData = response.Result[0].TermsCondition;

                 $('.inner-cotennt').html(vm.TermsConditionData);
                 $('#loader').hide();
             } else {
                 $('#loader').hide();
                 SweetAlert.swal(appConstant.AlertTitle, response.Message, appConstant.Warning);
             }
         }, function (err) {
             if (err.Status == 404) {

             }
             else if (err.Status == 401) {
                 console.log(err);
                // window.location.href = '/Review/Review_Login';
             } else {
                 SweetAlert.swal(appConstant.Warning, err.Message, appConstant.Error);
             }
             $('#loader').hide();
         });
     }


 });