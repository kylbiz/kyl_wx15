// 购物车页
Template.shopcart.helpers({
  list: function() {
  	console.log("shopcart", ShopCart.find({}).fetch());
    return {info: ShopCart.find({}).fetch()};
  }
});