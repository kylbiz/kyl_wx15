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
				var msg = {receiver: '收货人', phone: '电话',	address: '地址'}[key] + "不可为空";
				kylUtil.alert(msg);
				return;
			}
		}
		var zipcode = $('#zipcode').val();
		if (zipcode) {
			addressInfo.zipcode = zipcode;
		}

		var phone = parseInt(addressInfo.phone);
		if (!phone || !kylUtil.verifyPhone(phone)) {
			kylUtil.alert("输入手机号有误");
			return;
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