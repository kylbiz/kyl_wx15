Template.companyInfo.events({
  'click .list .module':function(event,template){
    var index= $(event.currentTarget).index(); 
    Router.go('/form') 
  }  
});