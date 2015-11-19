// 相关工具
log = console.log;

kylUtil = {};

// 验证手机号
kylUtil.verifyPhone = function (phone) {
	var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
	if(!phoneReg.test(phone)) {
		return false;
	} else {
		return true;
	}
};


kylUtil.createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};


kylUtil.createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};


kylUtil.md5 = function (str) {
	var crypto = Npm.require('crypto');
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
};


kylUtil.rawWXSign = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
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



