// 相关工具
log = console.log;

kylUtil = {};

// 产品图片url
kylUtil.getImg = function (name) {
    var img = {
        '1元注册': 'oneyuan',  
        '极速注册': 'jisu',        
        '电商公司': 'dianshang',              
        '教育公司': 'jiaoyu',        
        '金融信息公司': 'jingrong', 
        '移动互联网公司': 'hulianwang',
        '文化传媒公司': 'wenhua',
        '商务服务公司': 'shangwu',
        '建筑设计公司': 'jianzhu',
        '医疗公司': 'yiliao',
        '银行开户': 'icon_bank',
        '财务代理': 'icon_finance',
        '流量记账包服务套餐': 'icon_packpage',
        '小企社保': 'icon_assurance'
    }[name];
    if(img) {
      img = '/images/icon/'+img+'.png';
    }
    else {
        img = 'http://fpoimg.com/296x296'; 
//      img = 'http://lorempixel.com/296/296/';
    }
    return img;
}

// 警告框
kylUtil.alert = function (title, content) {
    if (arguments.length == 1) {
        content = title;
        title = '提示';
    }; 
    Template.layoutTemplate.alert({title: title, content: content});
}

// 确认框
// kylUtil.confirm = function (title, content, callBack) {
//     if (arguments.length == 2) {
//         callBack = content;
//         content = title;
//         title = '提示';
//     };

//     Template.layoutTemplate.confirm({
//         title: title, content: content
//     }).on( function (e) {
//        if(e){
//           callBack(); 
//        }
//     });
// }

// 验证手机号
kylUtil.verifyPhone = function(phone) {
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!phoneReg.test(phone)) {
        return false;
    } else {
        return true;
    }
};

// 验证身份证
kylUtil.verifyIDCard = function(code) {
    return getIdCardInfo(code).isTrue;

    /**
     * 身份证号码验证
     * @param cardNo {String} 证件号码
     * @returns info {Object} 身份证信息
     */
    function getIdCardInfo(cardNo) {
      var info = {
            isTrue : false, // 身份证号是否有效。默认为 false
            year : null,// 出生年。默认为null
            month : null,// 出生月。默认为null
            day : null,// 出生日。默认为null
            isMale : false,// 是否为男性。默认false
            isFemale : false // 是否为女性。默认false
        };
        
        if (!cardNo || (15 != cardNo.length && 18 != cardNo.length) ) {
            info.isTrue = false;
            return info;
        }
        
        if (15 == cardNo.length) {
            var year = cardNo.substring(6, 8);
            var month = cardNo.substring(8, 10);
            var day = cardNo.substring(10, 12);
            var p = cardNo.substring(14, 15); // 性别位
            var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
            if (birthday.getYear() != parseFloat(year)
                    || birthday.getMonth() != parseFloat(month) - 1
                    || birthday.getDate() != parseFloat(day)) {
                info.isTrue = false;
            } else {
                info.isTrue = true;
                info.year = birthday.getFullYear();
                info.month = birthday.getMonth() + 1;
                info.day = birthday.getDate();
                if (p % 2 == 0) {
                    info.isFemale = true;
                    info.isMale = false;
                } else {
                    info.isFemale = false;
                    info.isMale = true;
                }
            }
            return info;
        }
        
        if (18 == cardNo.length) {
            var year = cardNo.substring(6, 10);
            var month = cardNo.substring(10, 12);
            var day = cardNo.substring(12, 14);
            var p = cardNo.substring(14, 17);
            var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题
            if (birthday.getFullYear() != parseFloat(year)
                    || birthday.getMonth() != parseFloat(month) - 1
                    || birthday.getDate() != parseFloat(day)) {
                info.isTrue = false;
                return info;
            }

            var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子
            var Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X

            // 验证校验位
            var sum = 0; // 声明加权求和变量
            var _cardNo = cardNo.split("");

            if (_cardNo[17].toLowerCase() == 'x') {
                _cardNo[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
            }
            for ( var i = 0; i < 17; i++) {
                sum += Wi[i] * _cardNo[i];// 加权求和
            }
            var i = sum % 11;// 得到验证码所位置

            if (_cardNo[17] != Y[i]) {
                return info.isTrue = false;
            }

            info.isTrue = true;
            info.year = birthday.getFullYear();
            info.month = birthday.getMonth() + 1;
            info.day = birthday.getDate();
            
            if (p % 2 == 0) {
                info.isFemale = true;
                info.isMale = false;
            } else {
                info.isFemale = false;
                info.isMale = true;
            }
            return info;
        }
        return info;
    }
}   

// 生成15长的随机字符串
kylUtil.createNonceStr = function(num) {
    num = num || 15;
    return Math.random().toString(36).substr(2, 15);
};

//
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

kylUtil.randomNumber = function (number) {
    number = number || 0;
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var str = "";
    for (var i = 0; i < number; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}


kylUtil.checkData = function (data, checkReg) {
    data = data || {};
    for (key in data) {
        var info = data[key];
        var ret = checkReg[key](info);
        if (!ret[0]) {
            kylUtil.alert(ret[1]);
            return false;
        } 
    }

    return true;
}



///////////////////////////// 之后改放到server中 /////////////////////////////

// 生成订单
kylUtil.genOrderId = function() {
    var date = new Date();
    return moment(date).format("YYYYMMDDHHmmssSSS") + kylUtil.randomNumber(4);
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


