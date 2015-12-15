Template.index.onRendered(function(){
  $("ul.main_root>li").click(function(){
    var href = $(this).find("a").attr("href");
    if (href) {
      window.location.href = href;
    }
    return false;
  });
});


Template.index.events({
	'click .specialProduct': function (event, template) {
		var product = $(event.currentTarget).attr('product');
		var url = {
			registration: '/product/registration?name=1元注册',
			finance: '/product/finance?name=财务代理',
			assurance: '/product/assurance?name=小企社保',
			workspace: 'http://foundfit.mikecrm.com/f.php?t=Q3JZZH'
		};

		Router.go(url[product]);
	}
});