var rootApp = angular.module('rootApp', ['ui.router', 'oitozero.ngSweetAlert', 'angular.filter', 'ngTable',

    'rootApp.HomeApp',
    'rootApp.loginApp',
    "rootApp.UserApp",
    "rootApp.UserProfileApp",
    "rootApp.SettingApp",
    "rootApp.ContactUsApp",
    "rootApp.AboutUsApp",
    "rootApp.PrivacyPolicyApp",
    "rootApp.TermsAndConditionApp",
    "rootApp.CategoriesApp",
    "rootApp.ReviewerApp",
    "rootApp.ReviewerProfileApp",
    "rootApp.ReviewerPostDetailApp",
    "rootApp.ReviewApp",
    "rootApp.RevenueApp",
    "rootApp.TrackingIdApp",
    "rootApp.ProfanityWordsApp",
    "rootApp.ReportedUserApp",
    "rootApp.ReportedUserProfileApp",
    "rootApp.ReportedPostApp",
    "rootApp.ReportedPostDetailApp",
    "rootApp.ReportedMessageApp",
    "rootApp.ReportedCommentApp",
    "rootApp.ReportedCommentDetailApp",
    "rootApp.HashtagApp",
    "rootApp.FeedbackApp",
    "rootApp.CelebrityApp",
    "rootApp.CelebrityProfileApp",
    "rootApp.SidebarApp",
    "rootApp.HeaderApp",
    "rootApp.FooterApp",
    "rootApp.CommentApp",
    "rootApp.LikeApp"
]);


rootApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider

     .state('home', {
         url: '/home',
         templateUrl: 'Components/Home/Views/Home.html',     
     })
     .state('login', {
         url: '/login',
         templateUrl: 'Components/Login/Views/Login.html',
        
     })
    .state('forgotPswd', {
        url: '/forgotPswd',
        templateUrl: 'Components/Login/Views/ForgetPassword.html',     
    })

     .state('Celebrity', {
         url: '/Celebrity',
         templateUrl: 'Components/Celebrity/Views/Celebrity.html',
     })
     .state('CelebrityProfile', {
         url: '/CelebrityProfile',
         templateUrl: 'Components/Celebrity/Views/CelebrityProfile.html',

     })
    .state('Feedback', {
        url: '/Feedback',
        templateUrl: 'Components/Feedback/Views/Feedback.html',
    })

     .state('Hashtag', {
         url: '/Hashtag',
         templateUrl: 'Components/Hashtag/Views/Hashtag.html',
     })
     .state('ReportedComment', {
         url: '/ReportedComment',
         templateUrl: 'Components/Reported Post/Views/ReportedComment.html',

     })

    .state('ReportedPost', {
        url: '/ReportedPost',
        templateUrl: 'Components/Reported Post/Views/ReportedPost.html',

    })
        .state('ReportedPostDetail', {
            url: '/ReportedPostDetail',
            templateUrl: 'Components/Reported Post/Views/ReportedPostDetail.html',

        })
    .state('ReportedUser', {
        url: '/ReportedUser',
        templateUrl: 'Components/Reported User/Views/ReportedUser.html',
    })


    .state('ReportedUserProfile', {
        url: '/ReportedUserProfile',
        templateUrl: 'Components/Reported User/Views/ReportedUserProfile.html',
    })


    //

     .state('Revenue', {
         url: '/Revenue',
         templateUrl: 'Components/Revenue/Views/Revenue.html',
     })
         .state('TrackingId', {
             url: '/TrackingId',
             templateUrl: 'Components/Tracking Id/Views/TrackingId.html',
         })
         .state('ProfanityWords', {
             url: '/ProfanityWords',
             templateUrl: 'Components/Profanity Words/Views/ProfanityWords.html',
         })
     .state('Review', {
         url: '/Review',
         templateUrl: 'Components/Review/Views/Review.html',

     })
    .state('Reviewer', {
        url: '/Reviewer',
        templateUrl: 'Components/Reviewer/Views/Reviewer.html',
    })

        .state('ReviewerPostDetail', {
            url: '/ReviewerPostDetail',
            templateUrl: 'Components/Reviewer/Views/ReviewerPostDetail.html',
        })

        .state('ReviewerProfile', {
            url: '/ReviewerProfile',
            templateUrl: 'Components/Reviewer/Views/ReviewerProfile.html',
        })

     .state('Setting', {
         url: '/Setting',
         templateUrl: 'Components/Setting/Views/Setting.html',
     })
     .state('ContactUs', {
         url: '/ContactUs',
         templateUrl: 'Components/Setting/Views/ContactUs.html',

     })
    .state('AboutUs', {
        url: '/AboutUs',
        templateUrl: 'Components/Setting/Views/AboutUs.html',
    })
    .state('PrivacyPolicy', {
        url: '/PrivacyPolicy',
        templateUrl: 'Components/Setting/Views/PrivacyPolicy.html',
    })

    .state('TermsAndCondition', {
        url: '/TermsAndCondition',
        templateUrl: 'Components/Setting/Views/TermsAndCondition.html',
    })
    .state('Categories', {
        url: '/Categories',
        templateUrl: 'Components/Setting/Views/Categories.html',
    })
        //setting end
     .state('User', {
         url: '/User',
         templateUrl: 'Components/User/Views/User.html',

     })
    .state('UserPostDetail', {
        url: '/UserPostDetail',
        templateUrl: 'Components/User/Views/UserPostDetail.html',
    })
    .state('UserProfile', {
        url: '/UserProfile',
        templateUrl: 'Components/User/Views/UserProfile.html',
    })

    .state('ReportedCommentDetail', {
        url: '/ReportedCommentDetail',
        templateUrl: 'Components/Reported Post/Views/ReportedCommentDetail.html',
    })
    .state('ReportedMessage', {
        url: '/ReportedMessage',
        templateUrl: 'Components/Reported Post/Views/ReportedMessage.html',
    })

   
});

rootapp.run(function ($rootscope, $state) {
    if (location.protocol != 'https:') {
       location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
    $rootscope.$on('$statechangesuccess', function (event, tostate, toparams) {
        //alert($state.current.name);
       // console.log($state.current.name);
       if (location.protocol != 'https:') {
           location.href = 'https:' + window.location.href.substring(window.location.protocol.length);    
    }
              
    });
});

function ClosePopUp(value) {
  
    $(value).modal('toggle');
    //$("[data-attribute]").closePopup(value);
}


function LoaderStart() {
    $('#loader').show();
}
function LoaderStop() {
    $('#loader').hide();
}

