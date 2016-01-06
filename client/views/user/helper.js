Template.helper.onRendered(function(){
  var hash = window.location.hash;
  //name_brand 字号
  //capital 注册资金  
  //manager 法人与监事
  //finance_chief 财务负责人
    $(hash).addClass("open");

    $(".dist-list-box .list").click(function(){
      $(this).closest('.list-container').toggleClass("open");
    });
});