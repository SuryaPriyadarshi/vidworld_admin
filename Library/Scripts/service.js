//***********Services**********
var EndPoint = {

  //Admin: 'http://35.168.164.77:1336/',
    //Admin: 'http://54.209.75.99:1336/',

  
 //Admin: 'http://54.210.240.64:1337/',
    //  Admin: 'http://18.204.255.20:1336/',//new QA
    Admin: 'https://vid.world:3000/'

};

//var storageService = angular.module('storageService', []);
rootApp.factory('getLocalStorage', function () {
    var userList = {};
    return {
        list: userList,
        updateUser: function (UserArr) {
            if (window.localStorage && UserArr) {
                //Local Storage to add Data  
                localStorage.setItem("userDataList", angular.toJson(UserArr));
            }
            userList = UserArr;

        },
        getUserList: function () {
            //Get data from Local Storage  
            userList = angular.fromJson(localStorage.getItem("userDataList"));
            return userList ? userList : [];
        }
    };

});
rootApp.factory("APIInterface", function ($http, $rootScope) {
    var nd = new Date();
    var timeZone = nd.getTimezoneOffset();
    var SessionToken = sessionStorage.getItem('UserData');
   
    var ModifiedBy;

    return {
        postData: function (EndPoint, method, postData, onSuccess, onError) {

            $http({
                method: "POST",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);
        },
        putData: function (EndPoint, method, postData, onSuccess, onError) {
        //Loader Stop on your success method

            $http({
                method: "PUT",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);
        },
        postDataViaAjax: function (EndPoint, method, postData, onSuccess, onError) {
         


            //ModifiedBy = $('#txtUserID').val();
            $.ajax({
                method: "POST",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method,
                contentType: false,
                processData: false,
                async: false,
                data: postData
            }).success(onSuccess).error(onError);
        },
        postDataWittOutLoader: function (EndPoint, method, postData, onSuccess, onError) {
            //ModifiedBy = $('#txtUserID').val();


            $http({
                method: "POST",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method,
                data: JSON.stringify(postData),
                async: false,
            }).success(onSuccess).error(onError);

        },

        getData: function (EndPoint, method, postData, onSuccess, onError) {
            $http({
                method: "GET",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method + "?Id=" + postData,
                async: false,
            }).success(onSuccess).error(onError);
        },

        deleteData: function (EndPoint, method, postData, onSuccess, onError) {         
            $http({
                method: "DELETE",
                headers: {  'Content-Type': 'application/json','access-token': sessionStorage.getItem('UserData') },
                url: EndPoint + method,
                data: postData,
                async: false,
            }).success(onSuccess).error(onError);
        },

        getDataWithAnyId: function (EndPoint, method, postData, onSuccess, onError) {

            $http({
                method: "GET",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method+'/'+ postData,
                async: false,
            }).success(onSuccess).error(onError);
        },

        getDataWithTwoId: function (EndPoint, method, postData,postData2, onSuccess, onError) {

            $http({
                method: "GET",
                headers: { 'access-token': localStorage.getItem('UserData') },
                url: EndPoint + method + '/' + postData + '/' + postData2,
                async: false,
            }).success(onSuccess).error(onError);
        },
            getDataWithoutParam: function (EndPoint, method, onSuccess, onError) {

                $http({
                    method: "GET",
                    headers: { 'access-token': localStorage.getItem('UserData') },
                    url: EndPoint + method,
                    async: false,
                }).success(onSuccess).error(onError);
            }
    }
});

