Template.companyInfo.events({
	'click .list .module': function(event, template) {
		var index = $(event.currentTarget).index();
		var items = ['name_segement', 'scope_segement', 'resource_segement', 'manager_segement', 'others_segement', 'contractor_segement'];
		Router.go('form', {
			item: items[index]
		}, {
			query: 'orderid=' + Router.current().params.query.orderid,
		});
	},
    'click #submitBtn': function () {
    	console.log("companyInfo submitBtn");
        var orderId  = Router.current().params.query.orderid;
        if (!orderId) {
        	kylUtil.alert("数据错误，请退出重登!");
        	return;
        }

        Meteor.call("orderIsComplete", orderId, function (err, res) {
        	console.log("orderIsComplete ret", err, res);
        	if (err) {
        		kylUtil.alert("数据错误");
        	} else {
        		if (!res.userConfirmed) {
        			kylUtil.alert(res.msg);
        		} else {
                    kylUtil.alert(res.msg);
                    Router.go('orderList');
                }
        	}
        });
    }
});