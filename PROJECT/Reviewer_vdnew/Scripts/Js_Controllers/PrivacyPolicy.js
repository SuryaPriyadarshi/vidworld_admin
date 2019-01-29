app.controller('PrivacyPolicy', function ($rootScope,$scope, $http, myFactory, appConstant, $window, $cookieStore, SweetAlert) {
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


     vm.PrivacyPolicy = PrivacyPolicy();


     function PrivacyPolicy() {
         $('#loader').show();
         myFactory.getDataWithAnyId(EndPoint.Admin, 'getPrivacyPolicy', 'Reviewer', function (response) {

             if (response.Success) {
                 vm.PrivacyData = response.Result[0].PrivacyPolicy;

                 $('.inner-cotennt').html(vm.PrivacyData);
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
             } else {
                 SweetAlert.swal(appConstant.Warning, err.Message, appConstant.Error);
             }
             $('#loader').hide();

         });
     }




 });