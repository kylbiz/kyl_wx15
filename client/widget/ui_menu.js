Template.ui_menu.helpers({
  'pathname':function(){
    var pathname =Router.current().location.get().pathname;
    return pathname;
  }  
});