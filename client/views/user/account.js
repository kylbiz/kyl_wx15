Template.login.events({
	"click #loginBtn": function (event, template) {
		var phone = template.$('#phone').val();
		var password = template.$('#password').val();

		if (phone && password) {
			Meteor.loginWithPassword(phone, password, function (error, result) {
				if (error) {
					alert('login err' + error);
					Router.go('login');
				} else {

					// 检测当前用户是否有微信账号绑定
					Meteor.call('checkWeChatBind', Session.get('WeChatUser'), function (error, result) {
						console.log('checkWeChatBind', error, result);
					});

					var redirect = Session.get('loginRedirect') || "/";
					Router.go(redirect);
				}
			});
		}
	},
});


Template.register.onCreated(function(){
  Session.set('codeTime',0);
});
Template.register.helpers({
  'codeTime':function(){
   return Session.get('codeTime'); 
  }  
});
Template.register.events({
	// 获取验证码
	'click #codeBtn': function (event, template) {   
		var phone = template.$('#phone').val() || "";
		if (kylUtil.verifyPhone(phone)) {
			Meteor.call('genereateUserCode', phone, function(err, codeValue) {
				console.log('genereateUserCode', err, codeValue);
				if(!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
					if(codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
						// $("[id=error]").html(codeValue['message'] || "未知错误");           
						// $("[id=error]").show();       
						alert(codeValue['message'] || "未知错误");           
					}
          else {
          //60秒  
              if (Session.get('codeTime') == 0) {
                Session.set('codeTime', 60);
                var runtime = setInterval(function () {
                 if(Session.get('codeTime') > 0) {
                    Session.set('codeTime',Session.get('codeTime')-1);
                 }
                }, 1000);
              } else {
                return false;
              }
            //clearInterval('codeTime')              
          }
				} else {
					alert(codeValue['message'] || "未知错误");
					// $("[id=error]").html(codeValue['message'] || "未知错误");           
					// $("[id=error]").show();        
				}
			});	
		} else {
			alert("输入的手机号有误");
		}
	},


	// 点击注册
	'click #registerBtn': function(event, template) {
		var phone = template.$('#phone').val();
		var password = template.$('#password').val();
		var verifyCode = template.$('#verifyCode').val();

		// 校验手机号
		if (!kylUtil.verifyPhone(phone)) {
			alert("输入的手机号有误");
			return;
		}

		if (phone && password && verifyCode) {			
			Meteor.call('UserRegistration', phone, password, Session.get('WeChatUser'), verifyCode, function (error, result) {
				if (error) {
					alert('UserRegistration err' + error);
					// Router.go('login');
				} else {
					alert('UserRegistration OK' + result);
					// Meteor.call('sendRegistrationInfos', phone); // 发送成功注册消息
					Meteor.loginWithPassword(phone, password, function(err) {
						if(err) {
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
			alert('输入有误');
		}
	},
});


function codeGenerateLegal(phone) {
  if(verifyPhone(phone)) {
    var userCode = UserCode.findOne({phone: phone});
    if(userCode) {
      var createTime = userCode.createTime;
      var timestamp = Date.now();
      var times = userCode.times;
      if(times <= 100 && timestamp - createTime >= 1 * 60 * 1000) {
        return true;
      } else {
        log('you have call verify code  more than 100 times , or less than 1 minutes')
        return false;
      }
    } else {
      return true;
    }
  } else {
    log('phone number illegal')
    return false;
  }
} 