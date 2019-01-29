app.controller('Reviewer_login', function ($scope, $http, myFactory, appConstant, $window, $cookieStore) {

    $scope.logInApi = function () {

        var postData = {
            Username: $scope.LogInReviewer,
            Password: $scope.LogInPassword,
            DeviceUniqueId: "web1234",
            DeviceType: "Web"
        }
        console.log(postData);
        myFactory.postData(EndPoint.Admin, 'login', postData, function (response) {
            console.log(response);
            if (response.Success) {
                $cookieStore.put("SessionToken", response.Result.SessionToken);
                $cookieStore.put("Guid", response.Result.Guid);
                console.log($cookieStore.get("Guid"));

                appConstant.UserId = response.Result.UserId;
                console.log("UserId" + appConstant.UserId);
                window.location.href = '/Review/Review_Post';
            }
            else {
                $window.alert(response.Message);
            }
        }, function (err) {
            console.log(err);
            alert(err.Message)
            window.location.href = '/Review/Review_Login';
        });
    }
});

app.controller('Reviewer_Post', function ($scope, $http, myFactory, appConstant, $window, $cookieStore, $sce, $timeout) {

    //variable declaration
    $scope.viewPost = true;
    $scope.noPost = false;
    $scope.s3Url = true;
    $scope.youtubeUrl = false;
    $scope.editorEnabled = false;
    $scope.editorDescriptionEnabled = false;
    $scope.DisableClick = false;
    $scope.time = true;
    $scope.UserName = "";
    $scope.Image = "";
    $scope.Age = "";
    $scope.Thumbnail = "";
    $scope.Title = "";
    $scope.Description = "";
    $scope.CreatedDate = "";
    $scope.AdvertisementList = [];
    $scope.id = "";
    $scope.HashTags = [];
    var re = /(?:^|\W)#(\w+)(?!\w)/g, match1, matches1 = [], deletedHashTags = [];
    $scope.Url = "";
    $scope.trustedUrl = "";
    
    var mytimeout;
    var mytimer;
    var mm = 5;
    var ss = 00;
    $scope.time = mm + ":" + ss;
    $scope.status = "S3 Url Uploaded";

    //function declaration/ calling


    $scope.init = function (pId) {

        myFactory.getData(EndPoint.Admin,"postForReview?PostId=" + pId, function (response) {
            console.log(response);
            $scope.UserName = response.Result[0].Username;
            $scope.Image = response.Result[0].ProfileImageUrl;
            $scope.Age = response.Result[0].Age;
            $scope.Thumbnail = response.Result[0].ThumbnailUrl;
            $scope.Title = response.Result[0].Title;
            $scope.Description = response.Result[0].Description;
            $scope.CreatedDate = response.Result[0].CreatedDate;
            $scope.AdvertisementList = response.Result[0].AdvertisementList;
            $scope.id = response.Result[0].PostId;
            $scope.HashTags = response.Result[0].HashTags;
            $scope.Url = response.Result[0].MediaUrl;
            $scope.trustedUrl = $sce.trustAsResourceUrl($scope.Url);

        }, function (err) {
            console.log(err);
            if (err.Status === 401)
            {
                window.location.href = '/Review/Review_Login';
            }
            else
            {
                $scope.noPost = true;
                $scope.viewPost = false;
            }
            

        });


    }

    $scope.init(0);
      
    //function wrapper() {
    //    console.log($scope.time);
    //    $scope.init($scope.id);
    //    mytimeout = $timeout(wrapper, 300000);
    //}

    //timer callback
    var timer = function () {
        if (mm == 0 && ss == 00) {
            console.log($scope.time);
            $scope.init($scope.id);
            //time
            mm = 5;
            ss = 00;
            $scope.time = mm + ":" + ss;
            $timeout(timer, 1000);
        }
        else {
            if (mm >= 0) {
                if (ss > 00)
                    ss--;
                else {
                    ss = 59;
                    mm--;
                }
                $scope.time = mm + ":" + ss;
                mytimer = $timeout(timer, 1000);
            }
        }
    }
        //if (mm>=0) {
        //    if (ss > 00)
        //        ss--;
        //    else
        //    {
        //        ss = 59;
        //        mm--;
        //    }
        //    $scope.time = mm + ":" + ss;
        //    mytimer = $timeout(timer, 1000);
        //}
        //else {
        //    console.log($scope.time);
        //   $scope.init($scope.id);
        //    //time
        //    mm = 5;
        //    ss = 00;
        //    $scope.time = mm + ":" + ss;
        //    $timeout(timer, 1000);
        //}
   // }

    //run!!
   // $timeout(wrapper, 300000);
    $timeout(timer, 1000);

    $scope.stopTimeout = function () {
   //     $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
        //alert("Timer Stopped");
    }


    $scope.enableEditor = function () {
    //    $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
        //alert("Timer Stopped");
        $scope.editorEnabled = true;
        $scope.editableTitle = $scope.Title;
    };

    $scope.disableEditor = function () {
        $scope.editorEnabled = false;
    };

    $scope.save = function () {
        if ($scope.editableTitle === null || $scope.editableTitle === "")
            alert("Title should not be empty");
        else
            {
            $scope.Title = $scope.editableTitle;
            $scope.approvePost(0);

        $scope.disableEditor();
        }
    };

    // $scope.editorDescriptionEnabled = false;

    $scope.enableDescriptionEditor = function () {
    //    $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
        // alert("Timer Stopped");
        $scope.editorDescriptionEnabled = true;
        $scope.editableDescription = $scope.Description;
    };

    $scope.disableDescriptionEditor = function () {
        $scope.editorDescriptionEnabled = false;
    };

    $scope.saveDescription = function () {
        $scope.Description = $scope.editableDescription;
        $scope.disableDescriptionEditor();
       // var re = /(?:^|\W)#(\w+)(?!\w)/g, match1, matches1 = [], deletedHashTags = [];
        while (match1 = re.exec($scope.Description)) {
            matches1.push(match1[1]);
        }
        console.log(matches1);
        for (var i = 0; i < $scope.HashTags.length; i++) {
            if (matches1.indexOf($scope.HashTags[i]) == -1) {
                deletedHashTags.push($scope.HashTags[i]);
            }
        }
        $scope.approvePost(0);        
    };

    $scope.upload = function () {
       // $scope.VideoUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/SXu31tgW4cY");
    //    $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
        //  alert("Timer Stopped");
        $scope.s3Url = false;
        $scope.youtubeUrl = true;
        $scope.DisableClick = true;
        myFactory.getData(EndPoint.Admin, 'uploadVideo/' + $scope.id, function (response) {
            console.log(response.Result);
            $scope.VideoUrl = $sce.trustAsResourceUrl(response.Result[0]);            
            $scope.status = "Uploaded on youtube!! Verification Pending";
            $scope.statusDisplay();

        }, function (err) {
            $scope.status = "Failed";
            //  $scope.statusDisplay();
        });
    }

    $scope.statusDisplay = function () {
        $timeout(function () {
            $scope.updateVideoUrl();
        }, 10000);
    }

    $scope.updateVideoUrl = function () {
        $scope.status = "Uploaded on youtube!! Verified";
        $scope.VideoUrl = $scope.VideoUrl;
    }

    var IsPaging = 0;
    var page = 1;
    var PageSize = 20;
    var inCallback = false;
    $scope.Affiliates = [];
    $scope.SelectedAffiliates = [];
    $scope.getAffiliate = function (IsPaging) {
        if (IsPaging === 1) {
            //debugger;  
            IsPaging = 1;
            if (page > -1 && !inCallback) {
                inCallback = true;
                page++;
                myFactory.getData(EndPoint.Admin, 'getAffiliates?Keywords=' + $scope.Keyword + '&page=' + page, function (response) {

                    $scope.Affiliates = response.Result;
                    if ($scope.Affiliates.length == 0) {
                        alert("No option found");
                        inCallback = false;
                        page = -1;
                    }
                    else {
                        for (var i = 0; i < $scope.Affiliates.length; i++) {
                            $scope.Affiliates[i].Selected = false;
                        }
                        inCallback = false;
                    }

                }, function (err) {
                    alert("Invalid Key");
                });
            }
        } //unlimited load data while scroll  
        else {
            //debugger;  
            IsPaging = 0;
            myFactory.getData(EndPoint.Admin, 'getAffiliates?Keywords=' + $scope.Keyword + '&page=' + page, function (response) {

                $scope.Affiliates = response.Result;
                if ($scope.Affiliates.length == 0) {
                    alert("No option found");
                }
                else {
                    for (var i = 0; i < $scope.Affiliates.length; i++) {
                        $scope.Affiliates[i].Selected = false;
                    }
                }

            }, function (err) {
                alert("Invalid Key");
            });
        }
    };
    $scope.saveAffiliates = function () {
        for (var i = 0; i < $scope.Affiliates.length; i++) {
            if ($scope.Affiliates[i].Selected) {
                $scope.SelectedAffiliates.push($scope.Affiliates[i]);
                console.log($scope.SelectedAffiliates);
            }
        }
        if ($scope.AdvertisementList.length >= 5 && $scope.SelectedAffiliates.length !== 0) {
            alert("Only 5 advertisements can be attached");
            //event.preventDefault();
        }
        else {
            var len = 5 - $scope.AdvertisementList.length;
            if ($scope.SelectedAffiliates.length > len) {
                alert(" You can select only " + len + " items ");
               // event.preventDefault();
            }
            else {
                $scope.AdvertisementList = $scope.AdvertisementList.concat($scope.SelectedAffiliates);
                console.log($scope.AdvertisementList);
            }
        }
        $scope.Keyword = "";
        $scope.Affiliates = [];
        $scope.SelectedAffiliates = [];

    };

    var deletedAdvertisement = [];
    $scope.delete = function (item) {
     //   $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
       // alert("Timer Stopped");
        if (item.ProductLinkId != null) {
            console.log(item.ProductLinkId);
            deletedAdvertisement.push(item.ProductLinkId);
        }
        $scope.AdvertisementList.splice($scope.AdvertisementList.indexOf(item), 1);
    }

    $scope.approvePost = function (isApproved) {
      //  $timeout.cancel(mytimeout);
        $timeout.cancel(mytimer);
        $scope.time = false;
       // alert("Timer Stopped");

        //var re = /(?:^|\W)#(\w+)(?!\w)/g, match1, matches1 = [], deletedHashTags = [];
        //while (match1 = re.exec($scope.Description)) {
        //    matches1.push(match1[1]);
        //}
        //console.log(matches1);
        //for (var i = 0; i < $scope.HashTags.length; i++) {
        //    if (matches1.indexOf($scope.HashTags[i]) == -1) {
        //        deletedHashTags.push($scope.HashTags[i]);
        //    }
        //}
        console.log("deletedAdvertisement: " + deletedAdvertisement);
        if ($scope.AdvertisementList.length === 0)
        {
            alert("Add atleast one advertisement");
        }
        else
            {
        var putData = {
            PostId: $scope.id,
            Title: $scope.Title,
            Description: $scope.Description,
            AdvertisementList: $scope.AdvertisementList,
            DeletedAdvertisementId: deletedAdvertisement,
            HashTags: matches1,
            DeletedHashTags: deletedHashTags,
            IsApproved : isApproved,
            Guid: $cookieStore.get("Guid")
        }

        console.log(putData);

        myFactory.putData(EndPoint.Admin, 'postAccept', putData, function (response) {
            console.log(response.Result);
            if (isApproved === 1)
            {
                alert("Post successfully Accepted");
                window.location.href = '/Review/Review_Post';
            }            
        }, function (err) {
            console.log(err);
        });
        }
    }

    myFactory.getData(EndPoint.Admin, 'rejectReason', function (response) {
        console.log(response.Result);
        $scope.ReasonList = response.Result;
    }, function (err) {
        console.log(err);
    });
    $scope.rejectPost = function () {
        if ($scope.RejectReasonId == null || $scope.RejectReasonId == "")
            alert("Please enter Reason for Rejection")
        else
            {
        var putData = {
            RejectId: $scope.RejectReasonId
        }
        myFactory.putData(EndPoint.Admin, 'rejectPost/' + $scope.id, putData, function (response) {
            console.log(response.Result);
            alert("Post successfully rejected");
            window.location.href = '/Review/Review_Post';
        }, function (err) {
            console.log(err);
        });
        }
    }


});

app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

//// we create a simple directive to modify behavior of <ul>
app.directive("whenScrolled", function () {
    return function (scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});