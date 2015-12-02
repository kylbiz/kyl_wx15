Template.companyInfo.events({
	'click .list .module': function(event, template) {
		var index = $(event.currentTarget).index();
		var items = ['name_segement', 'scope_segement', 'resource_segement', 'manager_segement', 'others_segement', 'contractor_segement'];
		console.log("Router.current().params --", Router.current().params);
		Router.go('form', {
			item: items[index]
		}, {
			query: 'orderid=' + Router.current().params.query.orderid,
		});
	}
});