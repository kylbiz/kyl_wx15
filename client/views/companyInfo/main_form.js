Template.scope_segement.setTab = function(tab) {
}
    
Template.scope_segement.onCreated(function(){
  
});

Template.scope_segement.events({
  'click #step':function(){
    
  }
});

Template.form.helpers({
  _dynamic:function(){
        return 'scope_segement';  
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
    var atuoSwiper = new Swiper ('.swiper-container', {
//      direction: 'vertical',
      loop: false
    });
    $("#step").click(function(){
       atuoSwiper.slideNext();
       return false;
    });
    
    $(".scope_segement_widget1 .module").click(function(){
       atuoSwiper.slideNext();
       return false;
    });
  
    $(".scope_segement_widget2 .module").click(function(){
       atuoSwiper.slideNext();
       return false;
    });  
  
})

