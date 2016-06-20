Template.companychaAgent.onRendered(function () {
    // 保留上次
    // $("#zone li").eq(Session.get('Sel_1')).addClass("selected").siblings().removeClass("selected");

    // 计算价格
    this.autorun(function () {
        var name = Session.get('Sel_1');
        var payment = 0;
        var info = CompanyChange.findOne({name: name});
        if (name && info) {
            payment = info.payment || 0;
        }
        Session.set('Pay', payment);
    });
});


Template.companychaAgent.helpers({
    subTypes: function () {
        var info = CompanyChange.find({}).fetch() || [{}];
        if (!Session.get('Sel_1')) {
            Session.set('Sel_1', info[0].name);
        }

        return info;
    },
    payment: function() {
        return Session.get('Pay') || 0;
    },
    typeLabel: function () {
      var name = Session.get('Sel_1');
      return CompanyChange.findOne({name: name}).label || "";
    }
});


Template.companychaAgent.events({
    'click #name li': function(event) {
        Session.set('Sel_1', $(event.currentTarget).attr("value"));
        $("#zone li").first().addClass("selected").siblings().removeClass("selected");
    }
});
