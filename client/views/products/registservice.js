Template.registservice.helpers({
	names: function () {
		return CompanyRegist.find({},{fields: {name: 1, label: 1}}).fetch();
	}
});