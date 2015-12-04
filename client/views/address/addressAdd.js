Template.address.helpers({
	isEdit: function () {
		return this._id;
	}
});


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

		if (this && this._id) {
			Meteor.call('addressUpdate', this._id, addressInfo, function (error, result) {
				if (error) {
					console.log("update address fail", error);
					kylUtil.alert('警告', "修改地址失败");
				} else {
					Router.go('/addressList');
				}
			});
		} else {
			Meteor.call('addressAdd', addressInfo, function (error, result) {
				if (error) {
					console.log("add address fail", error);
					kylUtil.alert('警告', "添加地址失败");
				} else {
					Router.go('/addressList');
				}
		});
		}

		



		
	}
});