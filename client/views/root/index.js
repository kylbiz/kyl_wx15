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

  $(".root-module>.content").click(function(){
    var href = $(this).find("a").attr("href");
    console.log(href);
    if (href) {
      window.location.href = href;
    }
    return false;
  });


  $("#notice").modal('show');

  $("#get").click(function(){
      $("#notice").modal('hide');
  });

   setTimeout(function(){
    $("#notice").modal("hide");
   },8000);

//  $('#notice').on('show.bs.modal',function(event) {
//  });

// //下拉功能实现
//   var range = 50;             //距下边界长度/单位px
//   var elemt = 500;           //插入元素高度/单位px
//   var maxnum = 1;            //设置加载最多次数
//   var num = 0;
//   $(window).scroll(function(){
//       var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
//       var dbHiht = $("body").height();          //页面(约等于窗体)高度/单位px
//       var main = $(".index");                         //主体元素
//       var mainHiht = main.height();               //主体元素高度/单位px
//       if((srollPos + dbHiht) >= (mainHiht-range) && num != maxnum){
//           main.append("<div style='height:"+elemt+"' >hello world"+srollPos+"---"+num+"</div>");
//           num++;
//       }
//   });

});


Template.index.helpers({
    bannerImages: function () {
        // 配置banner图
        var bannerImages = [{
            source: '/images/event/banner2.png',
            // link: 'products/special?subtype=partnership'
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
			"finance": '/products/finance',
            "bank": '/products/bank',
            // registration: '/product/registration?name=1元注册',
   //          "special": '/product/special?name=合伙管家&subtype=partnership',
   //          "registration": '/product/registration?name=极速注册',
   //          "registration-newyear": '/product/registration?name=公司注册-新年特惠',
			// "assurance": '/product/assurance?name=社保人事',
   //          "trademark": '/product/trademark?name=商标注册',
			// workspace: 'http://foundfit.mikecrm.com/f.php?t=Q3JZZH'
		};
        if (url.hasOwnProperty(product)) {
    		Router.go(url[product]);
        }
	}
});
