rootApp.constant('AppConstant', {

    cTabKey: 'cTabKey',
    //-----******SweetAlert*****----------
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
    Info: 'info',
    SuccessTitle: 'Success',
    WarningTitle: 'Oops!',
    ErrorTitle: 'Oops!',
    InfoTitle: 'Info',
    AlertTitle: 'Info',
    s3BucketBaseUrl: 'https://s3.amazonaws.com/vidworld',
    //-----******Local Stotage Keys*****----------
    CurrentUser: 'UserData',


    //******SocketConnection***********
    SocketEvent: {
        connect: "connect",
        disconnect: "disconnect",
        message: "message",
        messageAck: "messageAck",
        userStatus: "userStatus",
        typing: "typing",
        newConversation: "newConversation",
        postSharing: "postSharing",
        messageAction: "messageAction",
        systemMessage: "systemMessage",
    },

    PostStatus: {
        Pending: 'Pending',
        Approved: 'Approved',
        Rejected: 'Rejected',
        InReview: 'InReview',
    },

    ChatMessageType: {
        text: 'text',
        heart: 'heart',
        post: 'post',
        media: 'media',
        hashtag: 'hashtag',
    }



   

});