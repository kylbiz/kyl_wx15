Template.form.helpers({
  _dynamic:function(){
        return 'resource_segement';
  }
});

Template.scope_segement.helpers({
  pageNames:function(){
    var pageNames = [{
      name: 'scope_segement_board'
    }, {
      name: 'scope_segement_widget1'
    }, {
      name: 'scope_segement_widget2'
    }, {
      name: 'scope_segement_widget3'
    }];
    return pageNames;
  }
});

Template.scope_segement.onRendered(function(){
    var autoSwiper = new Swiper ('.swiper-container', {
      noSwiping : true,
      // freeMode: false,
      // autoplayDisableOnInteraction: false,
      // loop: false
    });
    $("#step").click(function(){
       autoSwiper.slideNext();
       return false;
    });

    $(".scope_segement_widget1 .module").click(function(){
       autoSwiper.slideNext();
       return false;
    });

    $(".scope_segement_widget2 .module").click(function(){
       autoSwiper.slideNext();
       return false;
    });

    /*
    $(".scope_segement_widget3 #submit").click(function(){
       autoSwiper.slideTo(0);
       return false;
    });
    */
})
