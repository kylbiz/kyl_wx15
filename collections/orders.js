Order1 = new Meteor.Collection('wxorders');//订单

Meteor.methods({
	orderView: function (orderId) {
		check(orderId, String);

		var affected = Order1.update({
			_id: orderId,
			viewed: null
		},{
			$set: {
				viewTime: new Date(),//查看时间
				viewed: true//查看Flag
			}
		})

		if (! affected)
      		throw new Meteor.Error('invalid', "You weren't able to view that inquiry!");

	},
	orderPush: function (orderId) {
	    check(orderId, String);

	    var affected = Order1.update({
			_id: orderId
			//,pushed: null
		},{
			$set: {
				lastPushTime: new Date(),
				pushed: true
			}
		})

		if (! affected)
			throw new Meteor.Error('invalid', "You weren't able to view that inquiry!");

  	}
});

