// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (openid) {
    check(openid, String);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    var list = Lists.findOne({openid: openid});
    if(list) {
      var industryBig = list.industryBig;
      var industrySmall = list.industrySmall;
      var zj_num = list.zj_num;
      var gd_infor = list.gd_infor;
      var businessScope = list.businessScope;
      var scopeDetail = '';
      var scopeLength = businessScope.length;

      for(var i = 0; i < scopeLength; i++) {
        scopeDetail += businessScope[i];
      }
      var objectProperties = Object.getOwnPropertyNames(list);
      var companyName = [];
      var nameStr = '';
      for(var i = 1; i <= 9; i++) {
        var name = 'companyName' + i;
        if(list.hasOwnProperty(name) && list[name]) {
          companyName.push(list[name]);
        }
      }

      var text = '开业清单\n'
        + '行业: ' + industryBig + '>' + industrySmall + '\n'
        + '公司: 上海**' +industrySmall + '有限公司\n'
        + '经营范围: ' + scopeDetail + '\n'
        + '字号: ' + companyName.toString() + '\n'
        + '股东信息\n';
      gd_infor.forEach(function(gd) {
        text += '[ 姓名: ' + gd.name + ' , 股权比例%: ' + gd.quantity + ']\n';
      });

      text += '以上是您的开业清单,如有疑问,请联系开业啦: 400-066-3192';       
      var to = 'liuzk552@gmail.com';
      var from = 'zunkun.liu@kyl.biz';
      var subject = 'kyl email replay';

      console.log(text)
      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    }


  },
  updatedHandle: function(openid) {
    var list = Lists.findOne({openid: openid});
    var industryBig = list.industryBig;
    var industrySmall = list.industrySmall;
    var zj_num = list.zj_num;
    var gd_infor = list.gd_infor;
    var gdLength = gd_infor.length;
    var businessScope = list.businessScope;
    var scopeLength = businessScope.length;
    if(industryBig && industrySmall && (zj_num && zj_num > 0) && (gdLength && gdLength > 0) && (scopeLength && scopeLength > 0)) {
      Lists.update({openid: openid}, {
        $set: {
          handled: true
        }
      }, function(err) {
        if(err) {
          console.log('update handled to true error');
        } else {
          console.log('update handled to true succeed.');
        }
      })      
    }
  }
});