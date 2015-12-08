Template.companyInfo.helpers({
    done: function (item) {
        var self = this;
        var handleMap = {
            item1: function () {
                return (self.companyName && self.companyName.mainName);
            },
            item2: function () {
                return (self.industryBig && self.industrySmall && self.businessScope && self.businessScope.length > 0);
            },
            item3: function () {
                return (self.companyMoney && self.holders && self.holders.length > 0);
            },
            item4: function () {
                return (self.legalPerson && self.legalPerson.legalPersonId && self.supervisor && self.supervisor.supervisorId);
            },
            item5: function () {
                return (self.contractor && self.contractor.liaisons && self.contractor.financialStaff);
            },
            item6: function () {
                return self.consigner && self.consigner.consignerPhone;
            }
        };

        return handleMap[item]() || false;
    }
});

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

        kylUtil.confirm("资料提交后不可修改", function (ret) {
            if (ret) {
                orderConfirm();
            }
        });


        function orderConfirm() {
            Meteor.call("orderConfirm", orderId, function (err, res) {
                console.log("orderConfirm ret", err, res);
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

        

        
    }
});