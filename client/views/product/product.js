// 产品说明页

Template.product.helpers({
	des: function () {
		// 产品的描述
		return {}
	}, 
  _dynamic: function () {
    var type=Router.current().params.productType;
    var name;
    switch(type)
    {
//注册
      case 'registration':
      name= 'registration_board';
      break;
//社保        
      case 'assurance':
      name= 'assurance_board';
      break;
//财务代理
      case 'finance':
      name= 'agent_board';
      break;
//流量记账     
      case 'bookkeeping':
      name= 'package_board';
      break;
//银行开户
      case 'bank':
      name= 'bank_board';
      break;          
    }
    return name;
  }

});


Template.product.events({
	'click #buyBtn': function (event, template) {
    event.preventDefault();
		// if (Meteor.userId()) {
		// 	// 不同产品 不同购买选项
		// 	console.log('buyBtn', Session.get('productType'));
		// 	alert('buyBtn ' + Session.get('productType'));
		// 	// 跳转到购买页
		// } else {
		// 	// 去登陆
		// }

		// console.log('buyBtn');
		// Router.go('/shopcart'); // 之后版本
		Router.go('/shopcart');
	},
  'click .submit':function() {
      // Router.go('/trade');
        Router.go('/weixinpay/');

  }
});