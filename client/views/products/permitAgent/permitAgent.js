Template.permitAgent.onRendered(function () {
    // 保留上次
    // $("#zone li").eq(Session.get('Sel_1')).addClass("selected").siblings().removeClass("selected");

    // 计算价格
    this.autorun(function () {
        var name = Session.get('Sel_1');
        var zone = Session.get('Sel_2');
        var payment = 0;
        if (name && zone) {
            var services = (PermitProduct.findOne({"name": name}) || {}).services || [];
            services.forEach(function (service) {
                if (service.zone == zone) {
                    payment = service.payment;
                }
            });
        }
        Session.set('Pay', payment);
    });
});


Template.permitAgent.helpers({
    subTypes: function () {
        return PermitProduct.find({}).fetch();
    },
    zones: function () {
        // 初始化
        if (!Session.get('Sel_1')) {
            Session.set("Sel_1", PermitProduct.find({}).fetch()[0].name);
        }
        var name = Session.get('Sel_1');
        Session.set("Sel_2", PermitProduct.findOne({name: name}).services[0].zone);
        return PermitProduct.findOne({name: name}).services;
    },
    payment: function() {
        return Session.get('Pay') || 0;
    },
    notice: function () {
        var name = Session.get('Sel_1');
        var zone = Session.get('Sel_2');
        return kylUtil.getValueFromList(
            PermitProduct.findOne({name: name}).services || [],
            'zone', zone, 'message') || "";
    },
    typeLabel: function () {
      var name = Session.get('Sel_1');
      return PermitProduct.findOne({name: name}).label || "";
    }
});


Template.permitAgent.events({
    'click #name li': function(event) {
        Session.set('Sel_1', $(event.currentTarget).attr("value"));
        $("#zone li").first().addClass("selected").siblings().removeClass("selected");
    },
    'click #zone li': function (event) {
        Session.set('Sel_2', $(event.currentTarget).attr("value"));
    }
});
