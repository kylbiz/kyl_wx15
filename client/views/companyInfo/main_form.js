Template.form.helpers({
  _dynamic:function(){
        return Session.get('form');
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

Template.scope_segement.swingToNext=function(swingObject){
  swingObject.unlockSwipeToNext();
  swingObject.slideNext();
  swingObject.lockSwipeToNext();
}

Template.scope_segement.onRendered(function(){
    var autoSwiper = new Swiper ('.swiper-container', {
      allowSwipeToNext:false,
      loop:false
    });

    $("#step").click(function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;
    });

    $(".scope_segement_widget1 .module").click(function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;
    });

    $(".scope_segement_widget2 .module").click(function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;
    });

    /*
    $(".scope_segement_widget3 #submit").click(function(){
       autoSwiper.slideTo(0);
       return false;
    });
    */
})
