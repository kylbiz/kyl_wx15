Meteor.methods({
	'addressAdd': function (addressInfo) {
		var userId = Meteor.userId();
		if (!userId) {
			throw new Meteor.Error('未登录', 'Error: 请登录');
		}

		addressInfo.userId = userId;
		addressInfo.createAt = new Date();

		console.log('add address', addressInfo);
		
		return UserAddress.insert(addressInfo);
	},
	'addressUpdate': function (addrId, addressInfo) {
		var userId = Meteor.userId();
		if (!userId) {
			throw new Meteor.Error('未登录', 'Error: 请登录');
		}

		addressInfo.createAt = new Date();

		console.log('update address', addressInfo);
		
		return UserAddress.update({_id: addrId, userId:userId }, {
			$set: addressInfo
		});
	},

	'addressDel': function (id) {
		return UserAddress.remove({_id: id});
	}
});