Meteor.methods({
	'addressAdd': function  (addressInfo) {
		var userId = Meteor.userId();
		if (!userId) {
			throw new Meteor.Error('未登录', 'Error: 请登录');
		}

		addressInfo.userId = userId;
		addressInfo.createAt = new Date();

		console.log('add address', addressInfo);
		
		return UserAddress.insert(addressInfo);
	},

	'addressDel': function (id) {
		return UserAddress.remove({_id: id});
	}
});