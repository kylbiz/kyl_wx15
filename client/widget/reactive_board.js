Template.reactive_board.events({
    'click .field li':function(event){
      $(event.currentTarget).addClass("selected").siblings().removeClass("selected");
    }
});
