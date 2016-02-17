Meteor.subscribe('list')

var hooksObjectListBusinessscope = {
	onSuccess: function (operation, result, template) {
		var openid = Session.get('openid');
		alert('提交成功！')
		Router.go('/list/i/'+openid)
	}
}

AutoForm.addHooks(['listBusinessscope'],hooksObjectListBusinessscope);

Template.listBusinessscope.helpers({
	defaultValue: function(){
		var openid = Session.get('openid');
		return Lists.findOne({openid: openid});
	},
	options: function(){
		var openid = Session.get('openid');
		var businessScope = Lists.findOne({openid: openid}).businessScope;
		var businessScopeArray = new Array();
		if (businessScope){
			for (var i = 0; i < businessScope.length; i++) {
				businessScopeArray.push({label: businessScope[i], value: businessScope[i]})
			};
		}
		
		return businessScopeArray;
	},
	// checkedValues: function(){
	// 	var openid = Session.get('openid');
	// 	return Lists.findOne({openid: openid}).businessScope;
	// },
	hasBusinessscope: function(){
		var openid = Session.get('openid');
		var list = Lists.findOne({openid: openid});
		//alert(list.businessScope)
		if (list.businessScope) {
			return false;
		}else{
			return true;
		}
	}
})