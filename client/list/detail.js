Meteor.subscribe('wxuser')

Template.listdetail.helpers({
	wxuser: function () {
		return WXUsers.findOne({openid: this.openid});
	},
	sex: function() {
		alert(wxuser)
		if (sex == '1'){
			return "男"
		}else{
			return "女"
		}
	}
})