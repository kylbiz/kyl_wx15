Template.home.events({
	'click #logout': function () {
		Meteor.logout(function (err) {
			if (err) {
				kylUtil.alert("警告", "退出失败");
			} else {
				Router.go("/");
			}
		});
	}
});
