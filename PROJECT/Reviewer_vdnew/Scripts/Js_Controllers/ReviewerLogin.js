app.controller('Reviewer_login', function ($scope, $http, myFactory, appConstant, $window, $cookieStore, SweetAlert, $cookies) {
    $scope.loading = false;
    $scope.logInApi = function () {

        $cookies.remove("Username", { path: '/' });
        $cookies.remove("Guid", { path: '/' });
        $cookies.remove("SessionToken", { path: '/' });
        $cookies.remove("Username", { path: '~/Review/Review_Login' });
        $cookies.remove("Guid", { path: '~/Review/Review_Login' });
        $cookies.remove("SessionToken", { path: '~/Review/Review_Login' });
        delete $cookies["Username"]
        delete $cookies["Guid"]
        delete $cookies["SessionToken"]
        var postData = {
            Username: $scope.LogInReviewer,
            Password: $scope.LogInPassword,
            DeviceUniqueId: "web1234",
            DeviceType: "Web"
        }
     
        $('#loader').show();
        myFactory.postData(EndPoint.Admin, 'login', postData, function (response) {
        
            if (response.Success) {
                $cookieStore.put("SessionToken", response.Result.SessionToken);
                $cookieStore.put("Guid", response.Result.Guid);
                $cookieStore.put("Username", response.Result.Username);

                appConstant.UserId = response.Result.UserId;
                if (response.Result.UserType == ' reviewer') {
                    window.location.href = '/Review/Review_Post';
                }
                else {
                    SweetAlert.swal(appConstant.AlertTitle, "Reviewer not found.", appConstant.Warning);
                }
                $('#loader').hide();
            }
            else {
                SweetAlert.swal(appConstant.AlertTitle, response.Message, appConstant.Warning);
           
                $('#loader').hide();
            }
        }, function (err) {
            $('#loader').hide();
            SweetAlert.swal(appConstant.AlertTitle, err.Message, appConstant.Warning);
         
        });

    }

    $scope.forgetPasswordModel =
    {
        Email: $scope.Email,
        UserType: 3
    }

    $scope.Back = function () {
        window.location.href = '/Review/Review_Login';
    }

    $scope.forgetPasswordApi = function () {
      //  console.log($scope.forgetPasswordModel.Email);
        try {
            myFactory.postData(EndPoint.Admin, 'forgetPassword', $scope.forgetPasswordModel, function (response) {
             
                SweetAlert.swal(appConstant.AlertTitle, 'Email has been sent to ' + $scope.forgetPasswordModel.Email + '.', appConstant.Warning);
             
            }, function (err) {
           
                if (err.Success == false) {
                   // SweetAlert.swal(appConstant.AlertTitle, "Enter registered email address here", appConstant.Warning);
                    SweetAlert.swal(appConstant.AlertTitle, "Enter valid email address.", appConstant.Warning);
                

                }

            });
        }
        catch (err) {
          //  console.log(err);
        }

    }

    $scope.RedirectFP = function () {
        if (!$scope.LogInReviewer)
        {
            SweetAlert.swal(appConstant.AlertTitle, 'Please enter the credentials.', appConstant.Warning);
        }
        else {
            $scope.CheckModel =
              {
                  Username: $scope.LogInReviewer
              }
       
        try {
            myFactory.postData(EndPoint.Admin, 'checkUserExist', $scope.CheckModel, function (response) {

                if(response.Success)
                {
                    if(response.Result[0].UserType ==  " reviewer")
                    {
                        window.location.href = '/Review/Forget_Password';
                    }
                    else
                    {
                        SweetAlert.swal(appConstant.AlertTitle, "Reviewer not found.", appConstant.Warning);
                    }
                }
                else
                {
                    SweetAlert.swal(appConstant.AlertTitle, "Reviewer not found.", appConstant.Warning);
                }

            }, function (err) {

                if (err.Success == false) {
                  
                    SweetAlert.swal(appConstant.AlertTitle, "Reviewer not found.", appConstant.Warning);


                }

            });
        }
        catch (err) {
            //  console.log(err);
        }
        }
    }

});