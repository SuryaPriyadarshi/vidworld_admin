
function TimeDifferenceOfPost(value) {
    if (value.CreatedDate != undefined && value.CreatedDate != null && value.CreatedDate != '') {

        var timeStart = new Date(value.CreatedDate.replace(/\s/, 'T') + 'Z');

    }
    else if (value.ServerTimestamp != undefined && value.ServerTimestamp != null && value.ServerTimestamp != '') {
        var timeStart = new Date((value.ServerTimestamp * 1000).replace(/\s/, 'T') + 'Z');

    }
    else if (value.UpdatedDate != undefined && value.UpdatedDate != null && value.UpdatedDate != '') {
        var timeStart = new Date(value.UpdatedDate.replace(/\s/, 'T') + 'Z');
    }
    else
    {
        var timeStart = new Date();
    }
    var newDate = new Date();
    var timeEnd = new Date(newDate.getTime() + (newDate.getTimezoneOffset() * 60000));
    var timeDiff = Math.abs(timeEnd.getTime() - timeStart.getTime());
    var hourDiff = parseInt(timeDiff / (1000 * 3600));
    var minDiff = parseInt(timeDiff / (1000 * 60))
    var secDiff = parseInt(timeDiff / (1000));
    var ago = '';
    if (secDiff >= 0 && secDiff <= 60)
        ago = 'NOW';
    else if (hourDiff <= 0) {
        if (minDiff == 1) {
            ago = minDiff + ' MINUTE AGO';
        }
        else {
            ago = minDiff + ' MINUTES AGO';
        }
    }
    else if (hourDiff > 0 && hourDiff < 24) {
        if (hourDiff == 1) {
            ago = hourDiff + ' HOUR AGO';
        }
        else {
            ago = hourDiff + ' HOURS AGO';
        }
    }

    else if (hourDiff >= 24 && hourDiff <= 168) {
        if (parseInt(hourDiff / 24) == 1) {
            ago = parseInt(hourDiff / 24) + ' DAY AGO';
        }
        else {
            ago = parseInt(hourDiff / 24) + ' DAYS AGO';
        }
    }

    else if (hourDiff > 168) {
        ago = new Date(timeStart);
    }
    return ago;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else if (charCode == 46)
        return false;
    return true;
}

//******* method to return time diff from ServerTimeStamp**************
function TimeDifferenceOfChat(ServerTimestamp) {
    var ago = '';
    if (ServerTimestamp != undefined && ServerTimestamp != null && ServerTimestamp != '') {
        var timeStart = new Date(ServerTimestamp * 1000);

        // var newDate = new Date();
        var timeEnd = new Date();
        var timeDiff = Math.abs(timeEnd.getTime() - timeStart.getTime());
        var hourDiff = parseInt(timeDiff / (1000 * 3600));
        var minDiff = parseInt(timeDiff / (1000 * 60))
        var secDiff = parseInt(timeDiff / (1000));
       
        if (secDiff >= 0 && secDiff <= 60)
            ago = 'now';
        else if (hourDiff <= 0)
            ago = minDiff + ' Minutes Ago';
        else if (hourDiff > 0 && hourDiff <= 24)
            ago = hourDiff + ' Hours Ago';
        else if (hourDiff > 24 && hourDiff <= 168)
            ago = parseInt(hourDiff / 24) + ' Days Ago';
        else if (hourDiff > 168 && hourDiff <= 720)
            ago = parseInt(hourDiff / 168) + ' Weeks Ago';
        else {
            if (parseInt(hourDiff / 720) > 12)
                ago = parseInt(hourDiff / 720) + ' Year Ago';
            else
                ago = parseInt(hourDiff / 720) + ' Months Ago';

        }
    }
    return ago;
}

//-----******GenerateNumberList*****---------
function GenerateNumberList(start, end) {
    var dayList = [];
    for (var i = start; i <= end; i++) {
        var obj = {
            Id: i,
            Value: i
        };
        dayList.push(obj);
    }
    return dayList;
}
//************Generate List*******************
function GenerateListForExplore(list) {
    var maxValue = list.length;
    var a = [];
    for (var i = 0 ; i < maxValue; i++) {
        a.push(list[i]);
    }
    var n;
    var r = [];
    for (n = 1; n <= 3; ++n) {
        var i = Math.floor((Math.random() * (list.length - n)) + 1);
        r.push(a[i]);
        a[i] = a[list.length - n];
    }
    return r;
}
