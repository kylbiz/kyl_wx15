Template.controlBox.events({
  'click .home-box':function(){
    console.log('controlBox', this.data);
    Router.go('/');
  }
});
 