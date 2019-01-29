
app.controller('Reviewer_Post', function ($rootScope, $scope, $http, myFactory, appConstant, $window, $cookieStore, $sce, $timeout, SweetAlert, $filter, Guid, $cookies) {

    $scope.SamePostguid = Guid.newGuid();
  
    $rootScope.Username = $cookieStore.get("Username");
    $scope.failed = false;
    $scope.playVideo = true;
    $scope.s3Url = false;
    $scope.youtubeUrl = true;
    $scope.DisableClick = true;
    $scope.editorEnabled = false;
    $scope.editorDescriptionEnabled = false;  
    $scope.timeView = true;
    $scope.editView = false;
    $scope.UserName = "";
    $scope.Image = "";
    $scope.Age = "";
    $scope.Thumbnail = "";
    $scope.Title = "";
    $scope.Description = "";
    $scope.Duration = 0;
    $scope.CreatedDate = "";
    $scope.AdvertisementList = [];
   // $scope.SelectedAdd = [];
    $scope.id = "";
    $scope.HashTags = [];
    var re = /(?:^|\W)#([\w.]+)(?!\w)/g, match1, matches1 = [], deletedHashTags = [];
    $scope.Url = "";
    $scope.trustedUrl = "";
    $scope.isTimerClear = false;
    $scope.isVideoApproved = false;
    $scope.DisableButton = false;
    $scope.add = false;
    $scope.VideoUrl = "";
 //   $scope.New = true;
    var mm = $scope.Description;
    //  var mytimeout;
    var timer;
   
    var ss = 00;
    $scope.time = mm + ":" + ss;
    $scope.status = "S3 Url Uploaded";

    //function declaration/ calling
    
    $scope.init = function (pId) {
        $('#loader').show();
        $timeout.cancel(timer);
        $scope.getPosts(pId);
    }

    $scope.getPosts = function (pId) {
       // alert(1);
        myFactory.getData(EndPoint.Admin, "postForReview?PostId=" + pId, function (response) {
           // console.log(response);
            $scope.viewPost = true;
            $scope.noPost = false;
            $scope.PostType = response.Result[0].PostType;
            $scope.Uploaded = response.Result[0].Uploaded;
            $scope.UserName = response.Result[0].Username;
            $scope.Image = response.Result[0].ProfileImageUrl;
           // $scope.Image =  '~/images/user_image_holder.png';
            $scope.Age = response.Result[0].Age;
            $scope.Thumbnail = response.Result[0].ThumbnailUrl;
            $scope.Title = response.Result[0].Title;
            $scope.Description = response.Result[0].Description;
            $scope.CreatedDate = response.Result[0].CreatedDate;
            $scope.AdvertisementList = response.Result[0].AdvertisementList;
            $scope.id = response.Result[0].PostId;
            $scope.HashTags = response.Result[0].HashTags;
            $scope.Url = response.Result[0].MediaUrl;
            $scope.Duration = response.Result[0].Duration;
            mm = parseInt($scope.Duration) == 0 || $scope.Duration == null ? 00 : parseInt($scope.Duration);
            ss = 00;
            $scope.time = mm + ":" + ss;
            $scope.trustedUrl = $sce.trustAsResourceUrl($scope.Url);
            $('#loader').hide();
           // console.log($scope.PostType);
            timer = $timeout(updateTime, 1000);
            if (response.Result[0].EditMode)
            {
                $scope.timeView = false;
                $scope.editView = true;
            }               
            if ($scope.PostType == 2) {
                 $scope.VideoUrl = $sce.trustAsResourceUrl($scope.Url);               
               // console.log($scope.VideoUrl);
                $scope.s3Url = false;
                $scope.youtubeUrl = true;
                $scope.DisableClick = true;
                $scope.status = "Repost video";

                var videoUrl = $scope.Url;
                videoUrl = videoUrl.substring(0, videoUrl.lastIndexOf("?"));
                $scope.newVideoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1, videoUrl.length);
                $scope.createYTP();
            }
            else if ($scope.Url.includes("youtube") || $scope.Uploaded == '1') {
                $scope.VideoUrl = $sce.trustAsResourceUrl($scope.Url);
              //  console.log($scope.VideoUrl);
                $scope.s3Url = false;
                $scope.youtubeUrl = true;
                $scope.DisableClick = true;
                $scope.status = "Uploaded on Youtube";
                
                var videoUrl = $scope.Url;
                videoUrl = videoUrl.substring(0, videoUrl.lastIndexOf("?"));
                $scope.newVideoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1, videoUrl.length);
                $scope.createYTP();
            }

        }, function (err) {
           // console.log(err);
            if (err.Status === 401) { 
                window.location.href = '/Review/Review_Login';
            }
            else {
               // alert("Hit");
                $scope.viewPost = false;
                $scope.noPost = true;
              //  mm = 1;
               // $scope.time = mm + ":" + ss;
            }
            $('#loader').hide();
        });
    }
   
    //timer callback
    updateTime = function () {
        if (mm == 0 && ss == 00) {
           // console.log($scope.timeView)
          //  console.log($scope.time);
            $scope.getPosts($scope.id);
            mm = parseInt($scope.Duration) == 0 || $scope.Duration == null ? 00 : parseInt($scope.Duration);
            ss = 00;
            $scope.time = mm + ":" + ss;
            //$timeout(timer, 1000);
        }
        else {
            if (mm >= 0) {
                if (ss > 00)
                    ss--;
                else {
                    ss = 59;
                    mm--;
                }
                if (ss < 10)
                    $scope.time = mm + ":0" + ss;
                else
                    $scope.time = mm + ":" + ss;
                $timeout.cancel(timer);
                timer = $timeout(updateTime, 1000);
            }
        }
        //  mytimer = $timeout(timer, 1000);
    } 

    $scope.skip = function () {
        $scope.getPosts($scope.id);
    }

    $scope.stopTimeout = function () {
        $scope.editView = true;
        $scope.timeView = false;
        $scope.isTimerClear = true;
        if (timer) {
            $timeout.cancel(timer);
            $timeout.apply();
        }
        //$scope.$on('$destroy', function (event) {
        //    $timeout.cancel(timer);
        //});
        var putData = {
            PostId: $scope.id         
        }

     //   console.log(putData);

        myFactory.putData(EndPoint.Admin, 'reviewEditMode', putData, function (response) {
       //     console.log(response.Result);       
 
        }, function (err) {
        //    console.log(err);
        });
        //alert("Timer Stopped");
    } 

    $scope.enableEditor = function () {
        $scope.stopTimeout();
        $scope.editorEnabled = true;
        $scope.editableTitle = $scope.Title;
    };

    $scope.disableEditor = function () {
        $scope.editorEnabled = false;
    };

    $scope.save = function () {
        if ($scope.editableTitle === null || $scope.editableTitle === "")
            SweetAlert.swal(appConstant.AlertTitle, "Title should not be empty." , appConstant.Warning);
           // alert("Title should not be empty");
        else {
            $scope.Title = $scope.editableTitle;
          //  console.log($scope.id);
            var putData = {
                PostId: $scope.id,
                Title: $scope.Title
            }
            myFactory.putData(EndPoint.Admin, 'titleUpdate', putData, function (response) {
            //    console.log(response.Result);
               // alert("Post successfully Updated");
                //  window.location.href = '~/Review/Review_Login';
            }, function (err) {
             //   console.log(err);
            });
            //   $scope.approvePost(0);

            $scope.disableEditor();
        }
    };

    // $scope.editorDescriptionEnabled = false;

    $scope.enableDescriptionEditor = function () {
        $scope.stopTimeout();
     
        $scope.editorDescriptionEnabled = true;
        $scope.editableDescription = $scope.Description;
    };

    $scope.disableDescriptionEditor = function () {
        $scope.editorDescriptionEnabled = false;
    };

    $scope.saveDescription = function () {
        $scope.Description = $scope.editableDescription;
        $scope.disableDescriptionEditor();
        matches1 = [];
        // var re = /(?:^|\W)#(\w+)(?!\w)/g, match1, matches1 = [], deletedHashTags = [];
        while (match1 = re.exec($scope.Description)) {
            matches1.push(match1[1]);
        }
      //  console.log(matches1);
        for (var i = 0; i < $scope.HashTags.length; i++) {
            if (matches1.indexOf($scope.HashTags[i]) == -1) {
                deletedHashTags.push($scope.HashTags[i]);
            }
        }
        var putData = {
            PostId: $scope.id,
            Title: $scope.Title,
            Description: $scope.Description,
            HashTags: matches1,
            DeletedHashTags: deletedHashTags,
        }
        myFactory.putData(EndPoint.Admin, 'descriptionUpdate', putData, function (response) {
         //   console.log(response.Result);
          //  alert("Post successfully Updated");
            //  window.location.href = '~/Review/Review_Login';
        }, function (err) {
         //   console.log(err);
        });
        $scope.HashTags = matches1;
    };
       
    // YouTube video player events
    $scope.createYTP = function () {
      //  console.log(YT.loaded);
        if (!YT) {
        //    console.log('playerNotLoaded');
            $window.onYouTubePlayerAPIReady = onPlayerRady;
        } else if (YT.loaded) {
            onPlayerRady();
        } else {
            YT.ready(onPlayerRady);
        }
    }
    var player;
    function onPlayerRady() {
       // console.log('Creating player');
        var element = $("#ut_video")[0];
        player = new YT.Player(element, {
            height: '390',
            width: '640',
            videoId: $scope.newVideoId, //'YxstpdNPo98',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
            
    function onPlayerReady(event) {
      //  console.log('autoplay');
       // event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === 0) {
          //  console.log('finsihed');
        }
        if (event.data < 0) {
           // $timeout(updateYTUrl, 10000);
        }
        if (event.data == 0 || event.data == 1 || event.data == 2 || event.data == 4)
            $scope.isVideoApproved = true;
        //if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.PLAYING)
        //    $scope.isVideoApproved = true;
    }

    function updateYTUrl() {
        if ($scope.isVideoApproved == false) {
            var videoSrc = $("#ut_video")[0].src;
            //$("#ut_video")[0].src = "";
            //$("#ut_video")[0].src = videoSrc;
            $timeout(updateYTUrl, 10000);
        }
    }

    $scope.statusDisplay = function () {
        $timeout(function () {
            $scope.updateVideoUrl();
        }, 120000);
    }

    $scope.updateVideoUrl = function () {
        $scope.status = "Uploaded on youtube!! Verified";
        if ($scope.isVideoApproved == false)
            $scope.VideoUrl = $scope.VideoUrl;
    }

    $scope.setAdd = function () {
        $scope.stopTimeout();

        if ($scope.AdvertisementList.length >= 6) {
            $('.add-more-product button.add-product').removeAttr('data-attribute');
            SweetAlert.swal(appConstant.AlertTitle, "Remove 1 or more ads to add more.", appConstant.Warning);
           // alert("Remove 1 or more ads to add more");
            return;
        }
        else {
            $('.add-more-product button.add-product').attr('data-attribute', 'advt');
        }
        $scope.IsAffliateScroll = false;
        $scope.Keyword = "";
        $scope.Affiliates = [];
        $scope.SelectedAffiliates = angular.copy($scope.AdvertisementList);
    //    $scope.New = true;
       // $scope.SelectedAdd = $scope.AdvertisementList;
        
        $("[data-pop='" + $(this).attr("data-attribute") + "']").addClass("opened-pop").fadeIn();
        $("body").addClass("overlay");
    }
     
    $scope.IsAffliateScroll = false;
    $scope.GetAdvertisements = GetAdvertisements;
    function GetAdvertisements(model, page) {
        $('#loader').show();
    
        myFactory.getData(EndPoint.Admin, 'getAffiliates?Keywords=' + $scope.Keyword + '&page=' + page, function (response) {
           // console.log(response);
            //  $scope.Affiliates = response.Result;
            if (Object.keys(response.Result).length === 0 && response.Result.constructor === Object) {
                SweetAlert.swal(appConstant.AlertTitle, "No option found.", appConstant.Warning);
                $scope.Affiliates = [];
                $scope.IsAffliateScroll = false;
               
            }
           else if(response.Result.length> 0 && page===1) {
               $scope.Affiliates = response.Result;
            
                $scope.affliatePage =page+1; 
                $scope.IsAffliateScroll = true;
                var uniqueAffiliates = [];
                angular.forEach($scope.Affiliates, function (value, key) {
                   // console.log(value);
                    if (value.AffiliateType == 'amazon') {
                        
                        value.ImageLink = value.ImageLink[0].URL[0];
                    }
                    else if (value.AffiliateType == 'ebay') {
                      //  console.log(value.ImageLink);
                      //  if (Array.isArray(value.ImageLink)) {

                        //    value.ImageLink = value.ImageLink[0];
                         //   console.log(value.ImageLink);
                     //   }
                       // else {
                            value.ImageLink = value.ImageLink;
                      //  }

                    }
                    else {

                        value.ImageLink = value.ImageLink;
                    }

                    value.IsMapped = false;
                    value.Keywords = $scope.Keyword;
                    value.addGuid = Guid.newGuid();                          
                    var duplicateItems = uniqueAffiliates.filter(function (item, index) {
                        return (item.Amount == value.Amount && item.ImageLink == value.ImageLink);
                    });

                    if (duplicateItems.length === 0) {
                        uniqueAffiliates.push(value);
                    }
                });
            $scope.Affiliates = uniqueAffiliates;
           // console.log($scope.Affiliates);

            }
            else if (response.Result.length > 0 && $scope.Affiliates.length>0) {
                  $scope.IsAffliateScroll = true;
                  $scope.affliatePage =page+1; 
              
                  angular.forEach(response.Result, function (value, key) {
                      if (value.AffiliateType == 'amazon') {
                        value.ImageLink = value.ImageLink[0].URL[0];
                      }
                      else if (value.AffiliateType == 'ebay') {
                          value.ImageLink = value.ImageLink;
                      }
                      else {
                          value.ImageLink = value.ImageLink;
                      }
                      value.IsMapped = false;
                      value.Keywords = $scope.Keyword;
                      value.addGuid = Guid.newGuid();
                  });
                  $scope.Affiliates = $scope.Affiliates.concat(response.Result);
                  var uniqueAffiliates = [];
                  angular.forEach($scope.Affiliates, function (value, key) {

                      var duplicateItems = uniqueAffiliates.filter(function(item, index) {
                          return (item.Amount == value.Amount && item.ImageLink == value.ImageLink);
                  });
                  if (duplicateItems.length === 0) {
                      uniqueAffiliates.push(value);
                  }
              });

              $scope.Affiliates = uniqueAffiliates;
            }
           
            $('#loader').hide();
        }, function (err) {
            if ($scope.Affiliates.length == 0) {
               // alert(1)
                SweetAlert.swal(appConstant.AlertTitle, "Invalid search query.", appConstant.Warning);
                $scope.Affiliates = [];
                //  alert("Invalid Key");
            }
            $('#loader').hide();
        });
    }
    //$scope.clearAdd = function () {
    //    $scope.SelectedAffiliates = [];
    //}
    $scope.saveAffiliates = function () {
        if ($scope.SelectedAffiliates.length == 0) {
            SweetAlert.swal(appConstant.AlertTitle, "Please select ads.", appConstant.Warning);
            return;
        }     
        else if ($scope.SelectedAffiliates.length > 6) {
            SweetAlert.swal(appConstant.AlertTitle, "Only 6 ads can be attached.", appConstant.Warning);
          //  alert("Only 5 advertisements can be attached");
          //  $scope.SelectedAffiliates = [];
            //event.preventDefault();
            return;
        }
        //else {
        //    var len = 5 - $scope.AdvertisementList.length;
        //    if ($scope.SelectedAffiliates.length > len) {
        //        SweetAlert.swal(appConstant.AlertTitle, " You can select only " + len + " items ", appConstant.Warning);
        //      //  alert(" You can select only " + len + " items ");
        //      //  $scope.SelectedAffiliates = [];
        //        // event.preventDefault();
        //        return;
        //    }
            else {
               //  if ($scope.AdvertisementList != $scope.SelectedAffiliates)
               //  {
                   $scope.add = true;
                   $scope.DisableButton = true;
               //  }
                //  $scope.AdvertisementList = $scope.AdvertisementList.concat($scope.SelectedAffiliates);
                $scope.AdvertisementList = $scope.SelectedAffiliates;
              //  console.log($scope.AdvertisementList);
                
                $(".opened-pop").fadeOut();
                $(".popup,.pop-div").removeClass('opened-pop');
                $("body").removeClass("overlay");

            }
       // }

      
    };

    //** check status of advertisement**
    $scope.checkAdds = function (item,name) {
        //  var data = $filter('filter')($scope.AdvertisementList, { AddLink: item.AddLink }, true)[0];
        var data = $filter('filter')($scope.SelectedAffiliates, { addGuid: item.addGuid }, true)[0];
        if (data != undefined && data != null) {

            //var index = $scope.SelectedAffiliates.indexOf(data);
           // var index = $scope.SelectedAffiliates.findIndex( record => record.ProductLinkId === item.ProductLinkId )
            var index = $scope.SelectedAffiliates.findIndex(function (record) { return record.ProductLinkId === item.ProductLinkId })

            $scope.SelectedAffiliates.splice(index, 1);
            deletedAdvertisement.push(item.ProductLinkId);
            var AffliatesItem = $filter('filter')($scope.Affiliates, { addGuid: item.addGuid }, true)[0];
            if (AffliatesItem != undefined && AffliatesItem != null) {
                AffliatesItem.IsMapped = false;
            }
        }
        else {
            if ($scope.SelectedAffiliates.length < 6) {

                if (item.AffiliateType == 'ebay') {
                    var changedAddLink = item.AddLink + '&customid=' + $scope.SamePostguid;
                    var obj = {
                        AddLink: changedAddLink,
                        ProductId: item.ProductId,
                        ImageLink: item.ImageLink,
                        IconLink: item.IconLink,
                        AffiliateType: item.AffiliateType,
                        IsMapped: true,
                        addGuid: item.addGuid,
                        Amount: item.Amount,
                        Description: item.Description,
                        Title: item.Title,
                        Keywords: name
                    };
                    $scope.SelectedAffiliates.push(obj);
                }
                else if (item.AffiliateType == 'CJ') {

                    var changedAddLink = item.AddLink + '?sid=' + $scope.SamePostguid;
                    var obj = {

                        AddLink: changedAddLink,
                        ProductId: item.ProductId,
                        ImageLink: item.ImageLink,
                        AffiliateType: item.AffiliateType,
                        IconLink: item.IconLink,
                        IsMapped: true,
                        addGuid: item.addGuid,
                        Amount: item.Amount,
                        Description: item.Description,
                        Title: item.Title,
                        Keywords: name

                    };
                    $scope.SelectedAffiliates.push(obj);
                }
                else if (item.AffiliateType == 'rakuteen') {
                    var changedAddLink = item.AddLink + '&u1=' + $scope.SamePostguid;
                    var obj = {

                        AddLink: changedAddLink,
                        ProductId: item.ProductId,
                        ImageLink: item.ImageLink,
                        AffiliateType: item.AffiliateType,
                        IconLink: item.IconLink,
                        IsMapped: true,
                        addGuid: item.addGuid,
                        Amount: item.Amount,
                        Description: item.Description,
                        Title: item.Title,
                        Keywords: name
                    };
                    $scope.SelectedAffiliates.push(obj);
                }
                else {
                    var obj = {

                        AddLink: item.AddLink,
                        ProductId: item.ProductId,
                        ImageLink: item.ImageLink,
                        IconLink: item.IconLink,
                        AffiliateType: item.AffiliateType,
                        IsMapped: true,
                        addGuid: item.addGuid,
                        Amount: item.Amount,
                        Description: item.Description,
                        Title: item.Title,
                        Keywords: name
                    };
                    $scope.SelectedAffiliates.push(obj);
                }
                // vm.SelectedNewAdvertisements = $scope.AdvertisementList;
            }
            else {
                item.IsMapped = false
                SweetAlert.swal(appConstant.AlertTitle, "You cannot select more than 6 ads.", appConstant.Warning);
            }
        }
    }


    var deletedAdvertisement = [];
    $scope.delete = function (item) {
        $scope.stopTimeout();
        $scope.add = true;
        $scope.DisableButton = true;
        if (item.ProductLinkId != null) {
           // console.log(item.ProductLinkId);
            deletedAdvertisement.push(item.ProductLinkId);
        }
        $scope.AdvertisementList.splice($scope.AdvertisementList.indexOf(item), 1);
    }

    $scope.saveAdd = function () {       
        if ($scope.AdvertisementList.length === 0) {
            SweetAlert.swal(appConstant.AlertTitle, "Please select at least one ad.", appConstant.Warning);
            //  alert("Add atleast one advertisement");
        }
        else
        {
            $scope.add = false;
            $scope.DisableButton = false;
            var putData = {
                PostId: $scope.id,               
                AdvertisementList: $scope.AdvertisementList,
                DeletedAdvertisementId: deletedAdvertisement
            }

          //  console.log(putData);
            $('#loader').show();
            myFactory.putData(EndPoint.Admin, 'advertisementUpdate', putData, function (response) {
                if (response.Success) {                
                    $scope.addUpdate();
                }
               // if(response.Result)
               // SweetAlert.swal(appConstant.AlertTitle, response.Message, appConstant.Warning);
                $('#loader').hide();
            }, function (err) {
                $('#loader').hide();
                SweetAlert.swal(appConstant.AlertTitle, err.Message, appConstant.Warning);
             //   console.log(err);
            });
        }
    }
    $scope.addUpdate = function () {
        myFactory.getData(EndPoint.Admin, "getAdvertisements?id=" + $scope.id, function (response) {
          //  console.log(response.Result);
            if (response.Success) {                
                $scope.AdvertisementList = response.Result;
            }
        }, function (err) {           
            SweetAlert.swal(appConstant.AlertTitle, err.Message, appConstant.Warning);
           // console.log(err);
        });
    }

    $scope.approvePost = function (isApproved) {
        $scope.stopTimeout();

      //  console.log("deletedAdvertisement: " + deletedAdvertisement);
        if ($scope.AdvertisementList.length === 0) {
            SweetAlert.swal(appConstant.AlertTitle, "Please select at least one ad.", appConstant.Warning);
          //  alert("Add atleast one advertisement");
        }
        else if ($scope.DisableClick == false)
            SweetAlert.swal(appConstant.AlertTitle,"Please tap on upload video and review the uploaded video before accepting the post.", appConstant.Warning);
         //   alert("Please tap on upload video and review the uploaded video before accepting the post");
        else {
            var re = (/(?:^|\W)@([\w.]+)(?!\w)/g), mention, mentions1 = [];
           while (mention = re.exec($scope.Description)) {
               mentions1.push(mention[1]);
           }
            var putData = {
                PostId: $scope.id,
                Title: $scope.Title,
                Description: $scope.Description,
                AdvertisementList: $scope.AdvertisementList,
                DeletedAdvertisementId: deletedAdvertisement,
                HashTags: matches1,
                DeletedHashTags: deletedHashTags,
                IsApproved: isApproved,
                Mentions : mentions1,
                Guid: $cookieStore.get("Guid")
            }

            console.log(putData);
            $('#loader').show();
            myFactory.putData(EndPoint.Admin, 'postAccept', putData, function (response) {
               // console.log(response.Result);
                if (isApproved === 1) {
               //     SweetAlert.swal(appConstant.AlertTitle, "Post successfully accepted", appConstant.Warning);
                //    alert("Post successfully accepted");
                    window.location.href = '/Review/Review_Post';
                }
                else
                {
                    SweetAlert.swal(appConstant.AlertTitle, response.Message, appConstant.Warning);
                }
                $('#loader').hide();
            }, function (err) {
                $('#loader').hide();
                SweetAlert.swal(appConstant.AlertTitle, err.Message, appConstant.Warning);
             //   console.log(err);
            });
        }
    }

 
    $scope.changeKeyword = function (Keyword,affliatePage) {
        GetAdvertisements(Keyword,1);
     //   $scope.New = false;
        $scope.Affiliates = [];
        $('#advert_popup').scrollTop(0);
    }

    $('#advert_popup').scroll(function () {
        var element = document.getElementById("advert_popup");
        var maxHeight = element.scrollHeight - element.clientHeight;
       
        if (element.scrollTop >= maxHeight - 10) {
            if ($scope.IsAffliateScroll == true) {
                $scope.IsAffliateScroll = false;
                //if ($scope.affliatePage === 1) {
                //    $('#advert_popup').scrollTop(maxHeight - 10);
                //}
                GetAdvertisements($scope.Keyword, $scope.affliatePage);
                
               // alert('bootom of the div');
            }
        }

    });
    
    $scope.setDefault = function () {
        $scope.stopTimeout();
 
        $scope.RejectReasonId = "";

    }

    myFactory.getData(EndPoint.Admin, 'rejectReason', function (response) {
      //  console.log(response.Result);
        $scope.ReasonList = response.Result;
    }, function (err) {
      //  console.log(err);
    });
    $scope.rejectPost = function () {
      //  console.log($scope.id);
        if ($scope.RejectReasonId == null || $scope.RejectReasonId == "") {
            SweetAlert.swal(appConstant.AlertTitle, "Please enter Reason for Rejection.", appConstant.Warning);
          //  alert("Please enter Reason for Rejection");
            return;
        }
        else {
            $('#loader').show();
            var putData = {
                RejectId: $scope.RejectReasonId
            }
            myFactory.putData(EndPoint.Admin, 'rejectPost/' + $scope.id, putData, function (response) {
             //   SweetAlert.swal(appConstant.AlertTitle, "Post successfully rejected", appConstant.Warning);
             //   console.log(response.Result);
            //    alert("Post successfully rejected");
                window.location.href = '/Review/Review_Post';
                $('#loader').hide();
            }, function (err) {
                $('#loader').hide();
               // console.log(err);
            });
        }
        $(".opened-pop").fadeOut();
        $(".popup,.pop-div").removeClass('opened-pop');
        $("body").removeClass("overlay");
    }

    $rootScope.logout = function () {
        $('#loader').show();
        myFactory.putDataForLogout(EndPoint.Admin, 'reviewLogout',function (response) {
           // console.log(response.Result);
            $cookies.remove("Username", { path: '/' });
            $cookies.remove("Guid", { path: '/' });
            $cookies.remove("SessionToken", { path: '/' });
            $cookies.remove("Username", { path: '~/Review/Review_Login' });
            $cookies.remove("Guid", { path: '~/Review/Review_Login' });
            $cookies.remove("SessionToken", { path: '~/Review/Review_Login' });
            delete $cookies["Username"]
            delete $cookies["Guid"]
            delete $cookies["SessionToken"]
          //  SweetAlert.swal(appConstant.AlertTitle, "Post successfully logged out", appConstant.Warning);
          //  alert("Post successfully logged out");
            window.location.href = '/Review/Review_Login';
            $('#loader').hide();
        }, function (err) {
            $('#loader').hide();
            window.location.href = '/Review/Review_Login';
           // console.log(err);
        });
    }

});

app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

//// we create a simple directive to modify behavior of <ul>
//app.directive("whenScrolled", function () {
//    return function (scope, elm, attr) {
//        var raw = elm[0];
//        elm.bind('scroll', function () {
//            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
//                scope.$apply(attr.whenScrolled);
//            }
//        });
//    };
//});