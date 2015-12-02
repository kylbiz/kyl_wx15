Template.addressList.helpers({
	addressList: function () {
		return UserAddress.find({}).fetch();
	},
	sele: function (id) {
		Session.setDefault('addressId', UserAddress.findOne({})._id);
		return Session.get("addressId") == id;
	}
});


Template.addressList.events({
//  'click .module .radio':function(event,template){
//    $('.module .radio').removeClass("selected");
//    $(event.currentTarget).addClass("selected");
//    console.log("id  ", $(event.currentTarget).context.id);
//    Session.set('addressId', $(event.currentTarget).context.id);
//    return false;
//  },
  'click .module.header':function(event,template){
    event.stopPropagation();
    var self=$(event.currentTarget).find(".radio").first();
    $('.module .radio').removeClass("selected");
    self.addClass("selected");
    console.log("id  ", self.prop("id"));
    Session.set('addressId', self.prop("id"));
    return false;
  },  
  'click #delAddress': function  () {
  		var id = Session.get('addressId');
  		if (id) {
  			Meteor.call('addressDel', id, function (error, result) {
  				if (error) {
  					kylUtil.alert('警告', error);
  				} else {
  					console.log('remove address', result);
                    Session.setDefault('addressId', UserAddress.findOne({})._id);
  				}
  			});
  		}
  },
  'click #sureBtn': function () {
  		Router.go('trade');
  }
});