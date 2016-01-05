// 账号注册相关的方法

Meteor.methods({
	// 生成验证码
	'genereateUserCode': function(phone) {
		var phoneLegal = verifyPhone(phone) || false;

		function userCodeGenerator(callback) {
			var codeValue = {};
			log('phoneLegal', phoneLegal, 'codeGenerateLegal', codeGenerateLegal(phone));
			var codeGenerateFlag = codeGenerateLegal(phone);

			if(phoneLegal && codeGenerateFlag) {
				var randomCode = randomWord(true, 4, 4);
				var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳
				var accountSid= '8a48b5514a9e4570014a9f056aa300ec'; //Account Sid
				var accountToken = '0fe4efa3c2c54a0eb91dbac340aa49cf'; //Account Token
				var appId = '8a48b5514a9e4570014a9f1ac45b0115';
				var auth = accountSid + ':' + timestamp;
				var a = new Buffer(auth).toString('base64');
				var content = accountSid + accountToken + timestamp;
				var crypto = Npm.require('crypto');
				var md5 = crypto.createHash('md5');
				md5.update(content);
				var sig = md5.digest('hex').toUpperCase();

				UserCode.update({phone: phone}, {
						$set: {
							phone: phone,
							code: randomCode,
							createTime: Date.now(),
							codeType: 'codeVefify',
							used: false, // verify if the code been used
						},
						$inc: {times: 1}
					}, {
						upsert: true
					}, function(err) {
						if(err) {
							log('update verification code error');
						} else {
						log('update codeVerification code succeed.');
					}
				});

				HTTP.call("POST", "https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/"+accountSid+"/SMS/TemplateSMS?sig="+sig,
					{
						"data":{"to":phone,"appId":""+appId+"","templateId":"11559","datas":[randomCode,"3"]},
						"headers":{"Accept":"application/json","content-type":"application/json;charset=UTF-8","Authorization":a}
					}, function (err, result) {
						if(err) {
							log('send verification code error', err);
							codeValue = {
								codestatus: 0,
								message: "发送验证码失败"
							};
							callback(err, codeValue);
						} else {
							log('send verification code succeed');
							codeValue = {
							codestatus: 1,
							message: "验证码发送成功!"
						}
							callback(null, codeValue);
						}
					}
				);

			} else  {
				if(!codeGenerateFlag) {
					var err = '提交太频繁,请一分钟后再试!';
				} else {
					var err = '手机号错误或者该用户已经是注册用户!';
					}

					log(err);

					var codeValue = {
						codestatus: 2,
						message: err
					}
					callback(null, codeValue);
			};
		}

		var UserCodeHandle = Async.wrap(userCodeGenerator);
		var response = UserCodeHandle();
		return response;
	},

	// 注册
	'UserRegistration': function(phone, password, wechat_openid, code) {
		// 验证码校验
		// if (!codeVerification(phone, code, new Date())) {
		// 	throw new Meteor.Error("验证码校验失败", "Error: code verify fail");
		// }

		var options = {
			username: phone,
			password: password,
			roles: ['customer'],
			profile: {
	            phone: phone,
	            wechat_openid: wechat_openid
	        }
		};

		// if (Meteor.users.findOne({username: phone})) {
		// 	throw new Meteor.Error("该号码已被注册");
		// }

		var userId = Accounts.createUser(options);
		if (userId) {
			return 'OK';
		} else {
			throw new Meteor.Error("注册用户失败", 'Error createUser fail');
		}
	},

	// 密码重置
	'passwordReset': function (phone, password, code, digest) {
		if (!kylUtil.verifyPhone(phone) || !password || !code) {
			throw new Meteor.Error("输入信息有误", 'Error: input info illegal');
		}

		var oldInfo = Meteor.users.findOne({'profile.phone': phone}) || {};
		var userId = oldInfo._id || false;
		if (!userId) {
			throw new Meteor.Error("该用户不存在，请前往注册", "Error: user not found");
		}


		// if (!codeVerification(phone, code, new Date())) {
		// 	throw new Meteor.Error("验证码校验失败", "Error: code verify fail");
		// }

		var checkPwdRet = Accounts._checkPassword(oldInfo, {digest: digest, algorithm: 'sha-256'});
		if (!checkPwdRet.error) {
			throw new Meteor.Error("新密码与原密码一致，请前往登录", "Error: the new password is same with the old", 'gotologin');
		}
		Accounts.setPassword(userId, password);
		return true;
	},

	// 检测微信与Web账号的绑定
	'checkWeChatBind': function(wechat_openid) {
		Meteor.users.upsert({_id: Meteor.userId()}, {$set: {'profile.wechat_openid': wechat_openid}});
		return true;
	}
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// 验证短信发送的频次校验
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

// 验证码检验
function codeVerification(phone, code, timestamp) {
	if(phone && code && timestamp) {
		var userCode = UserCode.findOne({phone: phone});
		if(userCode) {
			var createTime = userCode.createTime;
			var _code = userCode.code;
			var timeLegal = (timestamp - createTime) <= 180 * 1000 || false;
			if(code.toLowerCase() === _code.toLowerCase() && timeLegal) {
				log(11)
				return true;
			} else {
				log(22)
				return false;
			}
		} else {
		log(33)
		return false;
		}
	} else {
		log(44)
		return false;
	}
}

// 验证手机号正确性
function verifyPhone(phone) {
	var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	if(!phoneReg.test(phone)) {
		return false;
	} else {
		return true;
	}
}

// 生成随机数
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        // arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
