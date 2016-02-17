Inquiry1 = new Meteor.Collection('inquiryCorpreg');//公司注册
Inquiry2 = new Meteor.Collection('inquiryBankaccount');//银行开户
Inquiry3 = new Meteor.Collection('inquiryBookkeeping');//财务代理

Meteor.methods({
	inquiryView: function (inquiryId) {
		check(inquiryId, String);

		var affected = Inquiry1.update({
			_id: inquiryId,
			viewed: null
		},{
			$set: {
				viewTime: new Date(),//查看时间
				viewed: true//查看Flag
			}
		})

		if (! affected)
      		throw new Meteor.Error('invalid', "You weren't able to view that inquiry!");

	},
	inquiryReply: function (inquiryId) {
		check(inquiryId, String);

		var affected = Inquiry1.update({
			_id: inquiryId,
			replied: null
		},{
			$set: {
				replyTime: new Date(),
				replied: true
			}
		})

		if (! affected)
      		throw new Meteor.Error('invalid', "You weren't able to view that inquiry!");


	}
});

