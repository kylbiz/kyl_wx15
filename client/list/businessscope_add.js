Meteor.subscribe('business1')

function unique(arr){
	var result = [], hash = {};
	for (var i=0, elem; (elem=arr[i]) !=null; i++){
		if (!hash[elem]){
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
}

var hooksObjectListBusinessscopeAdd = {
	before: {
		update:  function(doc) {
			var openid = Session.get('openid');
			var currentDoc = Lists.findOne({openid: openid}).businessScope;
			var updateDoc = doc.$set.businessScope;
			var newDoc;
			if (currentDoc){
				newDoc = unique(currentDoc.concat(updateDoc));
			}else{
				newDoc = updateDoc;
			}

			doc = {$set: {businessScope: newDoc }}

			return doc;
		}
	},
	onSuccess: function (operation, result, template) {
		var openid = Session.get('openid');
		alert('提交成功！')
		Router.go('/list/businessScope/'+openid)
	}
}

AutoForm.addHooks(['businessscopeAdd'],hooksObjectListBusinessscopeAdd);

Template.listBusinessscopeAdd.helpers({
	defaultValue: function(){
		var openid = Session.get('openid');
		return Lists.findOne({openid: openid});
	},
	businessScope_services: function () {
		return Business1.findOne({businessBig: '服务类'}).businessSmall;
	},
	businessScope_sales: function () {
		return Business1.findOne({businessBig: '销售类'}).businessSmall;
	},
	options: function () {
		var currentBusinessCate = Session.get('currentBusinessCate');
		var currentBusinessContent = "";
		var businessScopeArray = new Array();
		var currentTab = "服务类";
		if (Session.get('currentTab')) currentTab = Session.get('currentTab');


		if (currentBusinessCate) {
			var BusinessScope = Business1.findOne({businessBig: currentTab}).businessSmall
			for (var i = 0; i < BusinessScope.length; i++) {
				if (currentBusinessCate == BusinessScope[i].cate){
					currentBusinessContent = BusinessScope[i].content;
				}
			};
		}

		if (currentBusinessContent){
			for (var i = 0; i < currentBusinessContent.length; i++) {
				businessScopeArray.push({label: currentBusinessContent[i], value: currentBusinessContent[i]});
			};
		}

		return businessScopeArray;
	}
})

Template.listBusinessscopeAdd.events({
	"click #modalwindow": function(event, template){
		var cate = $.trim($(event.currentTarget).text());
		var cate_title = cate+"-经营范围选择";
		template.$('#myModalLabel').html(cate_title);
		Session.set('currentBusinessCate', cate);
	},
	"click #services": function(event, template){
		Session.set('currentTab', '服务类');
	},
	"click #sales": function(event, template){
		Session.set('currentTab', '销售类');
	}
})