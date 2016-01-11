
// 登录
Template.login.events({
	"click #loginBtn": function (event, template) {
		var phone = template.$('#phone').val();
		var password = template.$('#password').val();


		if (phone && password) {
			loginFunc(phone, password);
		}
	},
});

// 注册
Template.register.onCreated(function(){
  Session.set('codeTime', 0);
});

Template.register.helpers({
  'codeTime': function(){
   return Session.get('codeTime');
  }
});

Template.register.events({
	// 获取验证码
	'click #codeBtn': function (event, template) {
		var phone = template.$('#phone').val() || "";
		if (!kylUtil.verifyPhone(phone)) {
			kylUtil.alert("输入的手机号有误");
			return;
		}

		if (Session.get('codeTime') > 0) {
			kylUtil.alert("操作过于频繁！");
			return;
		}

		Session.set('codeTime', 60);
		clearInterval();
		getGenCode(phone, function () {
			setInterval(function() {
				if (Session.get('codeTime') > 0) {
					Session.set('codeTime', Session.get('codeTime') - 1);
				}
			}, 1000);
		});
	},


	// 点击注册
	'click #registerBtn': function(event, template) {
		var phone = template.$('#phone').val();
		var password = template.$('#password').val();
		var verifyCode = template.$('#verifyCode').val();

		// 校验手机号
		if (!kylUtil.verifyPhone(phone)) {
			kylUtil.alert("输入的手机号有误");
			return;
		}

		if (phone && password && verifyCode) {
			Meteor.call('UserRegistration', phone, password, Session.get('WeChatUser'), verifyCode, function (error, result) {
				if (error) {
					console.log('UserRegistration err' + error.error, error.message, error.details);
					if (error.error == 403) {
						kylUtil.alert("该手机号已被注册");
					} else {
						kylUtil.alert(error.error);
					}
					// Router.go('login');
				} else {
					kylUtil.alert('注册成功');
					// Meteor.call('sendRegistrationInfos', phone); // 发送成功注册消息
					Meteor.loginWithPassword(phone, password, function(err) {
						if(err) {
							console.log("login fail", err);
							alert('用户注册成功,请登录系统!')
							Router.go('/login');
						} else {
							var redirect = Session.get('loginRedirect') || "/";
							Router.go(redirect);
						}
					});
				}
			});
		} else {
			kylUtil.alert('输入有误');
		}
	},
});


// 找回密码
Template.forget.onRendered(function () {
	Session.set('codeTime', 0);
});

Template.forget.helpers({
	codeTime: function () {
		return Session.get("codeTime");
	}
});

Template.forget.events({
	'click #codeBtn': function (event, template) {
		var phone = template.$('#phone').val() || "";
		var password = template.$('#password').val() || "";
		if (!kylUtil.verifyPhone(phone)) {
			kylUtil.alert("输入的手机号有误");
			return;
		}

		if (Session.get('codeTime') > 0) {
			kylUtil.alert("操作过于频繁！");
			return;
		}

		Session.set('codeTime', 60);
		clearInterval();
		getGenCode(phone, function () {
			setInterval(function() {
				if (Session.get('codeTime') > 0) {
					Session.set('codeTime', Session.get('codeTime') - 1);
				}
			}, 1000);
		});
	},
	'click #resetPwdBtn': function (event, template) {
		var phone = template.$('#phone').val();
		var password = template.$('#password').val();
		var verifyCode = template.$('#verifyCode').val();

		// 校验手机号
		if (!kylUtil.verifyPhone(phone)) {
			kylUtil.alert("输入的手机号有误");
			return;
		}

		Meteor.call('passwordReset', phone, password, verifyCode, Package.sha.SHA256(password),
			function (error, result) {
			if (error) {
				kylUtil.alert(error.error);
				if (error.details && error.details == 'gotologin') {
					Router.go('login');
				}
			} else {
				console.log("resetPassword", result);
				loginFunc(phone, password);
			}
		});
	}
});


// 生成校验码
function getGenCode(phone, callBack) {
	Meteor.call('genereateUserCode', phone, function(err, codeValue) {
		console.log('genereateUserCode', err, codeValue);
    	clearInterval();
		if(!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
			if(codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
				kylUtil.alert(codeValue['message'] || "未知错误");
			}
	        else {
				callBack();
	        }
		} else {
			kylUtil.alert(codeValue['message'] || "未知错误");
		}
	});
}

//
function loginFunc(phone, password) {
	Meteor.loginWithPassword(phone, password, function (error, result) {
		if (error) {
			var msg = "登录失败";
			if (error.reason == "User not found") {
				msg = "用户不存在";
			}
			kylUtil.alert(msg);
			Router.go('login');
		} else {
			// 检测当前用户是否有微信账号绑定
			Meteor.call('checkWeChatBind', Session.get('WeChatUser'), function (error, result) {
				console.log('checkWeChatBind', error, result);
			});

			var redirectUrl = Router.current().params.query.redirectUrl || '/';
			Router.go(decodeURIComponent(redirectUrl));
		}
	});
}

// 验证短信发送的频次校验
// function codeGenerateLegal(phone) {
//   if(verifyPhone(phone)) {
//     var userCode = UserCode.findOne({phone: phone});
//     if(userCode) {
//       var createTime = userCode.createTime;
//       var timestamp = Date.now();
//       var times = userCode.times;
//       if(times <= 100 && timestamp - createTime >= 1 * 60 * 1000) {
//         return true;
//       } else {
//         log('you have call verify code  more than 100 times , or less than 1 minutes')
//         return false;
//       }
//     } else {
//       return true;
//     }
//   } else {
//     log('phone number illegal')
//     return false;
//   }
// }
