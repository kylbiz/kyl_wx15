Template.layoutTemplate.alert=function(object){
  var template = Blaze.toHTMLWithData(Template.alertTemplate,object);
  $("#Mount").html(template);
  $('#alert').modal('show');
  $('#alert').on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });
}

Template.layoutTemplate.confirm=function(object) {
  var template = Blaze.toHTMLWithData(Template.confirmTemplate, object);
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
  }
}

Template.layoutTemplate.select=function(object) {
  // object = {
  //   title: "标题",
  //   options: [
  //     {name: "name", value="value"}
  //   ]
  // }
  var template = Blaze.toHTMLWithData(Template.selectTemplate, object);
  $("#Mount").html(template);

  var selectBox=$('#select');
  selectBox.modal('show');
  selectBox.on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });

  return {
      on: function (callback) {
          if (callback && callback instanceof Function) {
              selectBox.find('#dialogSure').click(function () {
                var seleVal = selectBox.find("#selOpts .selected").attr("value") || null;
                callback(true, seleVal);
                selectBox.modal('hide');
              });
              selectBox.find('#dialogCancel').click(function () {
                callback(false, null);
                selectBox.modal('hide');
              });
          }
      }
  }
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
