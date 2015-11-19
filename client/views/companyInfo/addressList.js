Template.addressList.events({
  'click .module .radio':function(event,template){
    $('.module .radio').removeClass("selected");
    $(event.currentTarget).addClass("selected");
    return false;
  }
});