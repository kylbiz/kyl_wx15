Template.paySuccess.events({
	'click #showOrder': function () {
		Router.go('orderDetail');
	}, 
	'click #editOrder': function () {
		Router.go('companyInfo');
	}
});