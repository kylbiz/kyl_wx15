var hooksObjectList = {
	before: {
		update: function(doc){
			var openid = Session.get('openid');
			var list = Lists.findOne({openid: openid});

			if (list) {
				var businessScope = list.businessScope;
				var companyName1 = list.companyName1;
				var companyName2 = list.companyName2;
				var companyName3 = list.companyName3;
			}
			if (!businessScope){
        //TODO: condition companyName wrong 
				alert('请选择您的行业，系统将自动生成经营范围。')
				return false;
			}else if (!companyName1||!companyName2||!companyName3) {
				alert('请至少填写3个字号')
				return false;
			}else if (!doc.$set.gd_infor){
				alert('请至少添加一个股东信息。')
				return false;
			}else{
				return doc;
			}

		}
  },

	onSuccess: function (operation, result, template) {
		var openid = Session.get('openid');
		alert('提交成功！')
		Router.go('/list/i/'+openid);
    Meteor.call('updatedHandle', openid);
    Meteor.call('sendEmail',openid)

	}
}

AutoForm.addHooks(['list'],hooksObjectList);

function checknull(value){
	if (value) {
		return value + "、";
	}else{
		return "";
	}
}

function dellast(value){
	if (value){
		return value.substring(0, value.length-1);
	}else{
		return "";
	}
}

Template.list.helpers({
	companynames: function(){
		var openid = Session.get('openid');
		var list = Lists.findOne({openid: openid});
		if (list.companyName1) {
			var companynames = checknull(list.companyName1)+checknull(list.companyName2)+checknull(list.companyName3)+checknull(list.companyName4)+checknull(list.companyName5)+checknull(list.companyName6)+checknull(list.companyName7)+checknull(list.companyName8)+checknull(list.companyName9);
			if (companynames == ""){
				return "请点击右侧按钮，添加您的公司字号。";
			}else{
				companynames = dellast(companynames);
				return companynames;
			}
		}else{
			return "请点击右侧按钮，添加您的公司字号。";
		}
	},
	businessScope: function(){
		var openid = Session.get('openid');
		var businessScope = Lists.findOne({openid: openid}).businessScope;
		if (businessScope) {
			return businessScope
		}else{
			return "请先选择您的行业，系统将自动生成经营范围。"
		}
	},
	defaultValue: function(){
		var openid = Session.get('openid');
		return Lists.findOne({openid: openid});
	}
})