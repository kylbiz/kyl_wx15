Template.listIndustry.helpers({
	openid: function(){
		return Session.get('openid');
	}
})

Template.listIndustrySub.helpers({
	businessesData: function(){
		return Business.find({industryBig: this.industry});
	}
})

Template.listIndustrySub.events({
	"click .list-group-item": function(event, template){
		var industrySmall = $.trim($(event.currentTarget).children().text());
		var openid = Session.get('openid');//早日铲除Session！！！
	
		Meteor.call('chooseIndustry', industrySmall, openid, function(){
			alert('提交成功！')
			Router.go('/list/i/'+openid)
		})
	}
})