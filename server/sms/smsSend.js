SMSSend = {};

SMSSend.send = function (phone, message, callback) {
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
        };
        callback(null, codeValue);
      }
    }
  );
};
