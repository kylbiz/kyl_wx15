Template.index.onRendered(function(){
  $("ul.main_root>li>div").click(function(){
    var href = $(this).find("a").attr("href");
    if (href) {
      window.location.href = href;
    }
    return false;
  });
});