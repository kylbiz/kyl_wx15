Template.addressList.helpers({
    addressList: function() {
        return UserAddress.find({}).fetch();
    },
    sele: function(id) {
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
    'click .module.header': function(event, template) {
        event.stopPropagation();
        var self = $(event.currentTarget).find(".radio").first();
        $('.module .radio').removeClass("selected");
        self.addClass("selected");
        console.log("id  ", self.prop("id"));
        Session.set('addressId', self.prop("id"));
        return false;
    },
    'click #delAddr': function(event) {
        // var id = Session.get('addressId');
        var id = $(event.currentTarget).attr("addrId") || "";
        if (id) {
            Template.layoutTemplate.confirm({
                title: "提示", content: "确定删除该地址?"
            }).on( function (e) {
               if(e){
                    Meteor.call('addressDel', id, function(error, result) {
                        if (error) {
                            kylUtil.alert('警告', error);
                        } else {
                            console.log('remove address', result);
                            var count = UserAddress.find({}).count();
                            if (count == 0) {
                                delete Session.keys.addressId;
                                Router.go("address");
                            } else {
                                if (id == Session.get("addressId")) {
                                    Session.set('addressId', UserAddress.findOne({})._id);
                                }
                            }
                        }
                    }); 
               }
            });
        }
    },
    'click #editAddr': function (event) {
        var id = $(event.currentTarget).attr("addrId") || "";
        if (id) {
            Router.go("address", {}, {query: "addrId=" + id});
        }
    },
    'click #sureBtn': function() {
        Router.go('trade');
    }
});