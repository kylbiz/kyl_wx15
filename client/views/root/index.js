Template.index.onCreated(function () {
    if (Meteor.userId()) {
        Meteor.subscribe('shopcart');
    }
});


Template.index.onRendered(function(){
  $("ul.main_root>li").click(function(){
    var href = $(this).find("a").attr("href");
    if (href) {
      window.location.href = href;
    }
    return false;
  });
});


Template.index.helpers({
    productPrice: function (product) {
        return kylUtil.getPriceGeneral(product) || 0;
    },
    shopCartNum: function () {
        if (Meteor.user()) {
            return ShopCart.find({}).count();
        }
        return 0;
    }
});


Template.index.events({
	'click .specialProduct': function (event) {
        var product = $(event.currentTarget).attr('product');
        if (product == 'workspace') {
            window.location.href = 'http://foundfit.mikecrm.com/f.php?t=Q3JZZH';
            return;
        }

		var url = {
			// registration: '/product/registration?name=1元注册',
            registration: '/product/registration?name=极速注册',
			finance: '/product/finance?name=财务代理',
			assurance: '/product/assurance?name=社保人事',
            trademark: '/product/trademark?name=商标注册'
			// workspace: 'http://foundfit.mikecrm.com/f.php?t=Q3JZZH'
		};
        if (url.hasOwnProperty(product)) {
    		Router.go(url[product]);
        }
	}
});
