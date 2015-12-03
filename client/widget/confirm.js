Template.hello.onRendered(function(){
  $("ul.half li").click(function(){
    $(this).addClass("selected").siblings().removeClass("selected");
  });
});