Meteor.subscribe('list')

var hooksObjectListCompanyname = {
  // before: {
    
  // },
	onSuccess: function (operation, result, template) {
		var openid = Session.get('openid');
		alert('提交成功！')
		Router.go('/list/i/'+openid)
	}
}

AutoForm.addHooks(['listCompanyname'],hooksObjectListCompanyname);

Template.listCompanyname.helpers({
	defaultValue: function(){
		var openid = Session.get('openid');
		return Lists.findOne({openid: openid})
	}
})