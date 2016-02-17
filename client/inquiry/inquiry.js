Meteor.subscribe('inquiryCorpreg');
Meteor.subscribe('inquiryBankaccount');
Meteor.subscribe('inquiryBookkeeping');

var hooksObject_inquiryCorpreg = {
	onSuccess: function (operation, result, template) {
        var inquiryId = inquiryCorpreg.findOne(result).inquiryId;
        var openid = inquiryCorpreg.findOne(result).openid;
        
        var kfopenid = 'oPw1ptzZ8zTtsOKqJmlH5hhJgmx0';
        var mobilephone = inquiryCorpreg.findOne(result).mobilephone;
        var area = inquiryCorpreg.findOne(result).area;
        var kfcontent = '咨询手机：'+mobilephone+'；注册地区：'+area;

        //给客服人员推送信息
        Meteor.call('send_WechatMsg', kfopenid, kfcontent, function(error, result) {});

        Router.go('/inquiry/ok/'+openid);
    }
};

var hooksObject_inquiryBankaccount = {
    onSuccess: function (operation, result, template) {
        var openid = inquiryBankaccount.findOne(result).openid;
        Router.go('/inquiry/ok/'+openid);
    }
};

var hooksObject_inquiryBookkeeping = {
    onSuccess: function (operation, result, template) {
        var openid = inquiryBookkeeping.findOne(result).openid;
        Router.go('/inquiry/ok/'+openid);
    }
};

AutoForm.addHooks(['inquiryCorpreg'], hooksObject_inquiryCorpreg);

AutoForm.addHooks(['inquiryBankaccount'], hooksObject_inquiryBankaccount);

AutoForm.addHooks(['inquiryBookkeeping'], hooksObject_inquiryBookkeeping);

Template.inquiry.helpers({
	openId: function() {
		return this.toString();
	},
	defaultValues: function() {
        return { openid: Session.get('openid') };
    },
    inquiryNum: function() {
        return inquiryCorpreg.find({openid:this.toString()}).count();
    }
})