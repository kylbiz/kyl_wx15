
///////////////////////////// 之后改放到server中 /////////////////////////////

kylUtil = {};

// 生成订单
kylUtil.genOrderId = function() {
    var date = new Date();
    return moment(date).format("YYYYMMDDHHmmssSSS") + kylUtil.randomNumber(4);
};


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
};

// 签名加密
kylUtil.getWXSign = function(args) {
    var str = kylUtil.rawWX(args);
    console.log('getWXSign original str', str);
    return kylUtil.crypto('sha1', str);
};

kylUtil.crypto = function (type, str) {
    // type = sha1 / md5
    var crypto = Npm.require('crypto');
    var sum = crypto.createHash(type);
    sum.update(str);
    str = sum.digest('hex');
    return str;
};


kylUtil.rawWX = function(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};
