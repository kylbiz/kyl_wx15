Template.trade.events({
	'click #wxbuy': function () {
		Router.go('paySuccess');
	},
  'click #address':function () {
     //当前地址数
     var count=0;
     if(!count==0) {
       Router.go('address');
     }
     else {
       Router.go('addressList');   
     }
  }
});