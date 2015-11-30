// 相关工具
log = console.log;

kylUtil = {};

// 警告框
kylUtil.alert = function (title, content) {
    if (arguments.length == 1) {
        content = title;
        title = '提示';
    }; 
    Template.layoutTemplate.alert({title: title, content: content});
}

// 验证手机号
kylUtil.verifyPhone = function(phone) {
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!phoneReg.test(phone)) {
        return false;
    } else {
        return true;
    }
};


kylUtil.createNonceStr = function(num) {
    num = num || 15;
    return Math.random().toString(36).substr(2, 15);
};


kylUtil.createTimestamp = function() {
    return parseInt(new Date().getTime() / 1000) + '';
};


kylUtil.md5 = function(str) {
    var crypto = Npm.require('crypto');
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};


kylUtil.rawWXSign = function(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    // return string;

    kylUtil.md5();

};


///////////////////////////// 之后改放到server中 /////////////////////////////

// 生成订单
kylUtil.genOrderId = function() {
    var date = new Date();

    function randomNumber(number) {
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var str = "";
        for (var i = 0; i < number; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }
    return moment(date).format("YYYYMMDDHHmmssSSS") + randomNumber(4);
}


// 合并两个对象
kylUtil.mergeTwoObj = function (mainObj, obj) {
    // mainObj = mainObj || {};
    // obj = obj || {};
    Object.keys(obj).filter(function (key) {
        return obj[key] !== undefined && obj[key] !== '';
    }).map(function (key) {
        mainObj[key] = obj[key];
    });

    return mainObj;
}