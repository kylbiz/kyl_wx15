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

  Session.set('WeChatUser', 'WeChatUser');
});


Template.index.helpers({
    bannerImages: function () {
    <!-- 配置banner图 -->          
        var bannerImages = [{
            source: '/images/event/newyear.jpg',
            link: '/product/registration?name=公司注册-新年特惠'
        }, {
            source: '/images/event/banner1.png',
            link: '/product/partnership'
        }];
        return bannerImages;      
    },
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
            "registration": '/product/registration?name=极速注册',
            "registration-newyear": '/product/registration?name=公司注册-新年特惠',
			"finance": '/product/finance?name=财务代理',
			"assurance": '/product/assurance?name=社保人事',
            "trademark": '/product/trademark?name=商标注册'
			// workspace: 'http://foundfit.mikecrm.com/f.php?t=Q3JZZH'
		};
        if (url.hasOwnProperty(product)) {
    		Router.go(url[product]);
        }
	}
});
