Template.zhuaqu.events({
	"submit form": function (event, template) {
		event.preventDefault();
		var keywords = template.$('[name=keywords]').val();
		var captcha = template.$('[name=captcha]').val();
		alert(keywords);
		alert(captcha);
		Meteor.call('zhuaqu', keywords, captcha, function(err, result){
			alert(result);
		})
	}
})