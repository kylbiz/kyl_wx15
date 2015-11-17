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
}