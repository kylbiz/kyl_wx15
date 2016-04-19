Template.productDes.helpers({
	_dynamic: function () {
		var type = Router.current().params.type;
		return {
			'fieldwork': 'fieldwork',
			'invoiceagent': 'invoiceagent',
			'financebase': 'financebase',
		}[type] || "";
	}
});