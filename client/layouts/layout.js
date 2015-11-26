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
  
  var confirmBox=$('#confirm');
  confirmBox.modal('show');
  confirmBox.on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });

  return {
      on: function (callback) {
          if (callback && callback instanceof Function) {
              confirmBox.find('#dialogSure').click(function () { callback(true);  confirmBox.modal('hide'); });
              confirmBox.find('#dialogCancel').click(function () { callback(false); confirmBox.modal('hide'); });
          }
      }
  };  
}

Template.layoutTemplate.onRendered(function(){
//  var message = {};
//  message.title = "hello";
//  message.content = "world";
//  Template.layoutTemplate.confirm(message).on( function (e) {
//        if(e){
//         alert('yes'); 
//        }
//        else {
//         alert('no'); 
//        }
//    });
});