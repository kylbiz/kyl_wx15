Template.address.events({
	'click #saveAddrBtn': function (event, template) {
		var addressInfo = {
			receiver: $('#receiver').val(),
			phone: $('#phone').val(),
			address: $('#address').val(),
		};

		for (key in addressInfo) {
			if (!addressInfo[key]) {
				Template.layoutTemplate.alert({
					title: "提示", 
					content: {receiver: '收货人', phone: '电话',	address: '地址'}[key] + "不可为空"});
				return;
			}
		}
		var zipcode = $('#zipcode').val();
		if (zipcode) {
			addressInfo.zipcode = zipcode;
		}

		Meteor.call('addressAdd', addressInfo, function (error, result) {
			if (error) {
				kylUtil.alert('警告', error);
			} else {
				Router.go('/addressList');
			}
		});



		
	}
});