//var siteUrl = 'http://localhost:55176/';
var siteUrl = '';
if (window.location.hostname == 'localhost') {
    if (window.location.port != '') {
        siteUrl = 'http://localhost:' + window.location.port + '/';
    }
    else {
        siteUrl = 'http://localhost/';
    }
}
else {
    if (window.location.port != '') {
        siteUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/';
    }
    else {
        siteUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/';
    }

}

var dataPerPage = 10;

function LoaderStart() {

    $('#loader').show();
}


function LoaderStop() {
    $('#loader').hide();
}
