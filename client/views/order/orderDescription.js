Template.orderDescription.onRendered(function(){
    //collapse
    function collapse(){
        var el = $(this).find("#altBox");
        if(el.is(':animated'))
          return false;
        var toggle= $(this).find(".pull-right").first();
        if (toggle.hasClass("collapse")) {
            toggle.removeClass("collapse").addClass("expand");
            var i = toggle.children(".angle.down");
            i.removeClass("down").addClass("right");
            el.slideUp(200);
        } else {
            toggle.removeClass("expand").addClass("collapse");
            var i = toggle.children(".angle.right");
            i.removeClass("right").addClass("down");
            el.slideDown(200);
        }      
    }
    $(document).on("click","#alt",collapse);  
});

Template.orderDescription.events({
  'click .oGroup .piece':function(){
   Router.go('/shockholder');
  }
});