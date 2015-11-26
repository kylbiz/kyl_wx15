Template.companyInfo.events({
  'click .list .module':function(event,template){
    var index= $(event.currentTarget).index(); 
    var item = ['name_segement','scope_segement','resource_segement','manager_segement','others_segement'];
    Session.set('form',item[index]);
    Router.go('/form') 
  }  
});
