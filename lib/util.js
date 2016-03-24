// 相关工具
log = console.log;

kylUtil = {};

kylUtil.isWeChat = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

kylUtil.getValueFromList = function (list, name, value, retKey) {
    list= list|| [];
    for (var key in list) {
        var info = list[key] || {};
        if (info && info[name] == value) {
            if (retKey) {
                return info[retKey];
            }
            return info;
        }
    }
    return null;
}


kylUtil.getBrowserHost = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return 'KYLWX';
    } else {
        return 'KYLWAP';
    }
}

// 产品大体价格
kylUtil.getPriceGeneral = function (name) {
    var products = {
        'registration': '1-1500',
        'finance': '179-579',
        'bank': '300-500',
        // 旧产品
        '投资管理': '3000',
        '1元注册': '1',
        '新年特惠': '99',
        '极速注册': '1000',
        '电商公司': '500',
        '教育公司': '500',
        '金融信息公司': '500',
        '移动互联网公司': '1000',
        '文化传媒公司': '500',
        '商务服务公司': '500',
        '建筑设计公司': '500',
        '医疗公司': '500',
        '银行开户': '200',
        '财务代理': '300',
        '流量记账包服务套餐': '300',
        '社保人事': '120',
        '商标注册': '1200',
    };
    if (products.hasOwnProperty(name)) {
        return products[name] || 0;
    } else {
        console.log("未找到该产品的价格", name);
        return 0;
    }
};

kylUtil.getProductName = function (type) {
    var productName = {
        'registration': '公司注册',
        'finance': '财务代理',
        'bank': '银行开户',
    }[type];
    return productName || "未知产品";
}

// 公司大产品分类描述
kylUtil.getProductsDes = function (name) {
    var productsDes = {
        'registration': {img: '/images/product/reg_icon.png', title: '小白云', subTitle: '工商注册系统'}, // 小白云
        'bank': {img: '/images/product/f_icon.png', title: '小企财云', subTitle: '银行开户'},     // 小企财云
        'finance': {img: '/images/product/f_icon.png', title: '小企财云', subTitle: '财务代理'}, // 小企财云
        'finances': {img: '/images/product/f_icon.png', title: '小企财云', subTitle: '财务代理'}, // 小企财云
        'bookkeeping': {img: '/images/product/f_icon.png', title: '小企财云', subTitle: '流量记账包'}, //小企财云
        'assurance': {img: '/images/product/security_icon.png', title: '小企人事', subTitle: '社保公积金'}, //小企人事
        'trademark': {img: '/images/product/trademark_icon.png', title: '商标注册', subTitle: '专人代理、快速对接'}
    };

    if (productsDes.hasOwnProperty(name)) {
        return productsDes[name];
    }
    return {img: '', title: '', subTitle: ''};
};

// 产品图片url
kylUtil.getImg = function (name) {
    var img = {
        'registration': 'jisu.png',
        '公司注册': 'jisu.png',
        'finance': 'icon_finance.png',
        '财务代理': 'icon_finance.png',
        'bank': 'icon_bank.png',
        '银行开户': 'icon_bank.png',
        // 'special': 'partner.png',
        // '特别产品': 'partner.png',
        'partnership': 'partner.png',

        // 旧产品
        '投资管理': 'invest.png',
        '1元注册': 'oneyuan.png',
        '新年特惠': 'newyear.png',
        '极速注册': 'jisu.png',
        '电商公司': 'dianshang.png',
        '教育公司': 'jiaoyu.png',
        '金融信息公司': 'jingrong.png',
        '移动互联网公司': 'hulianwang.png',
        '文化传媒公司': 'wenhua.png',
        '商务服务公司': 'shangwu.png',
        '建筑设计公司': 'jianzhu.png',
        '医疗公司': 'yiliao.png',
        '银行开户': 'icon_bank.png',
        '财务代理': 'icon_finance.png',
        '流量记账包服务套餐': 'icon_packpage.png',
        '社保人事': 'icon_assurance.png',
        '商标注册': 'shangbiao.png',
        '合伙管家': 'partner.png',
        '周年庆特别活动': 'zhounian.png',
    }[name];
    if(img) {
      img = '/images/icon/'+img;
    }
    else {
        img = 'http://fpoimg.com/296x296';
    }
    return img;
};

kylUtil.getProductImg = function (type) {
    var img = {
        'registration': '/images/icon/jisu.png',
        'finance': '/images/icon/icon_finance.png',
        'bank': '/images/icon/icon_bank.png',
    }[type];
    return img || 'http://fpoimg.com/296x296';
}

// 产品的辅助描述
kylUtil.getBriefDes = function (name) {
    var productDes = {
        '投资管理': '',
        '1元注册': '',
        '新年特惠': '',
        '极速注册': '',
        '电商公司': '推荐电子商务、贸易类公司',
        '教育公司': '推荐教育科技类公司',
        '金融信息公司': '推荐金融信息服务、众筹类公司',
        '移动互联网公司': '推荐APP开发、智能硬件等互联网类公司',
        '文化传媒公司': '推荐广告、影视、会展类公司',
        '商务服务公司': '推荐商务咨询、企业管理类公司',
        '建筑设计公司': '推荐建筑设计、装潢、建材类公司',
        '医疗公司': '推荐医疗器械、生物科技类公司',
        '银行开户': '专人办理，快速对接',
        '财务代理': '定期财务建议，助你规避财务风险',
        '流量记账包服务套餐': '量贩式定价，总有最合适你的',
        '社保人事': '',
        '商标注册': ''
    };
    if (productDes.hasOwnProperty(name)) {
        return productDes[name] || "";
    } else {
        console.log("未找到该产品的辅助描述");
        return "";
    }
};

// 警告框
kylUtil.alert = function (title, content) {
    if (arguments.length == 1) {
        content = title;
        title = '提示';
    }
    Template.layoutTemplate.alert({title: title, content: content});
};

// 确认框
kylUtil.confirm = function (title, content, callBack) {
    if (arguments.length == 2) {
        callBack = content;
        content = title;
        title = '提示';
    }

    Template.layoutTemplate.confirm({
        title: title, content: content
    }).on( callBack );
};

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
};

// 验证邮编
kylUtil.verifyZipCode = function (code) {
    var pattern =/^[0-9]{6}$/;

    if (code && pattern.exec(code)) {
        return true;
    }

    return false;
};

// 验证公司名
kylUtil.verifyCompanyName = function (name) {
    var pattern = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    var strList = [];

    if (name && typeof(name) == 'string' && name.length >= 2) {
        var retStatus = 1;
        var msg = 'ok';
        for (var key in name) {
            var str = name[key];
            console.log(str, pattern.exec(str));
            if (!pattern.exec(str)) {
                return [-1, '公司名只能使用中文'];
            }

            if (strList.indexOf(str) >= 0) {
                retStatus = 0;
                msg = '公司名包含叠字，不易通过，请慎用';
            }
            strList.push(str);
        }

        return [retStatus, msg]
    }

    return [-1, '公司名不得少于两个中文'];
};

// 生成随机数字串
kylUtil.randomNumber = function (number) {
    number = number || 0;
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var str = "";
    for (var i = 0; i < number; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

// 生成15长的随机字符串
kylUtil.createNonceStr = function(num) {
    num = num || 15;
    return Math.random().toString(36).substr(2, 15);
};

// 生成时间戳
kylUtil.createTimestamp = function() {
    return parseInt(new Date().getTime() / 1000) + '';
};

// 验证数据合法性的统一调用 暂未实现！！！
kylUtil.checkData = function (data, checkReg) {
    data = data || {};
    for (var key in data) {
        var info = data[key];
        var ret = checkReg[key](info);
        if (!ret[0]) {
            kylUtil.alert(ret[1]);
            return false;
        }
    }

    return true;
};


// 等到绝对url 格式： http://www.baidu.com/path/to
kylUtil.getAbsoluteUrl = function (pathname) {
    if (pathname.charAt(0) == '/') {
        return Meteor.absoluteUrl() + pathname.substring(1);
    } else if (pathname.slice(0, 7) == 'http://') {
        return pathname;
    }

    throw new Meteor.Error('kylUtil.getAbsoluteUrl fail', 'Error: pathname is illegal');
};



///////////////////////////// 之后改放到server中 ////////////////////////////

// 生成订单
kylUtil.genOrderId = function() {
    var date = new Date();
    return moment(date).format("YYYYMMDDHHmmssSSSS") + kylUtil.randomNumber(4);
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



