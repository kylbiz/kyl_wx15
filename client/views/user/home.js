Template.home.helpers({
  isWeChat: function () {
    return kylUtil.isWeChat();
  }
});

Template.home.events({
	'click #logout': function (e) {
    e.preventDefault();
    // Session.set('isLoggingout', true);
		Meteor.logout(function (err) {
			if (err) {
				kylUtil.alert("警告", "退出失败");
			} else {
        console.log("go to index");
        window.localStorage.openid = null;
        Session.set('WeChatUser', null);
        // Session.set("isLoggingout", false);
      }
    });

    Router.go('index');
	}
});
