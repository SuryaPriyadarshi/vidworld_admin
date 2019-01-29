//US-Phone Number
function ParseUSNumber(PhoneNumberInitialString, obj) {
    var FmtStr = '';
    var index = 0;
    var LimitCheck;

    LimitCheck = PhoneNumberInitialString.length;
    while (index != LimitCheck) {
        if (isNaN(parseInt(PhoneNumberInitialString.charAt(index))))
        { }
        else
        { FmtStr = FmtStr + PhoneNumberInitialString.charAt(index); }
        index = index + 1;
    }
    if (FmtStr.length >= 10) {
        FmtStr = FmtStr.substring(0, 10);
        FmtStr = "(" + FmtStr.substring(0, 3) + ") " + FmtStr.substring(3, 6) + "-" + FmtStr.substring(6, 10);
    }
    else if (FmtStr.length != 0) {
        FmtStr = PhoneNumberInitialString;
        //CustomAlertMsg(CssDanger, "United States phone numbers must have exactly ten digits.");

    }
    if (FmtStr == '')
        FmtStr = null


    obj.value = FmtStr;
}

//-------GetTimeZone-------
function GetTimeZone() {
    debugger;
    var d = new Date();
    nd = new Date(d + (3600000 * 5.5));
    nd = nd.toString();
    nd = nd.split('GMT');
    nd = nd[1].split(' ');
    nd = nd[0];
    var a1 = nd.substring(0, 3);
    var a2 = nd.substring(3, 5);
    var timeZone = a1 + ':' + a2;
    console.log(timeZone);
}


//Scroll to top
function scrollTop() {
    $('html, body').animate({ scrollTop: '0px' }, 300);
}

//isNumber
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

//isNumber
function isNumberLatLong(evt) {
    if (charCode == 43) return true;

    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

//--prevent spaces
function isSpace(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 32)
        return false;

    return true;
}

//Get this index of item via attr from array
var getIndexIfObjWithOwnAttr = function (newArr, attr, value) {
    for (var i = 0; i < newArr.length; i++) {
        if (newArr[i].hasOwnProperty(attr) && newArr[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function isValidEmail(email) {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
        return true;
    }
    else {
        return false;
    }
}
function isValidNumber(num) {
    var Number = /^[A-Za-z]+$/;
    if (Number.test(num)) {
        return false;
    }
    else {
        return true;

    }
}

//isNumber
function isValidPhonenumber(evt) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}
