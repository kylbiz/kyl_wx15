Template.layoutTemplate.alert=function(object){
  var template = Blaze.toHTMLWithData(Template.alertTemplate,object);
  $("#Mount").html(template);
  $('#alert').modal('show');
  $('#alert').on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });  
}
Template.layoutTemplate.confirm=function(object){
  var template = Blaze.toHTMLWithData(Template.confirmTemplate,object);
  $("#Mount").html(template);
  $('#confirm').modal('show');
  $('#confirm').on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });  
}

Template.layoutTemplate.onRendered(function(){
  //eg
  /*
  var message = {};
  message.title = "hello";
  message.content = "world";
  Template.layoutTemplate.confirm(message);
  */
});