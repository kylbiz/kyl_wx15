// Template.reactive_board.helpers({
//     _img: function (name) {
//         return kylUtil.getImg(name);
//     }
// });

// 选项选中变色
Template.reactive_board.events({
    'click .field li': function (event, template) {
         $(event.currentTarget).addClass("selected").siblings().removeClass("selected");
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 注册公司
Template.registration_board.onRendered(function () {
    // 保留上次
    // $("#zone li").eq(Session.get('Sel_1')).addClass("selected").siblings().removeClass("selected");

    // 计算价格
    this.autorun(function () {
        var name = Session.get('Sel_1');
        var zone = Session.get('Sel_2');
        var payment = 0;
        if (name && zone) {
            var services = CompanyRegist.findOne({"name": name}).services || [];
            services.forEach(function (service) {
                if (service.zone == zone) {
                    payment = service.payment;
                }
            });
        }
        Session.set('Pay', payment);
    });
});


Template.registration_board.helpers({
    subTypes: function () {
        return CompanyRegist.find({}).fetch();
    },
    zones: function () {
        // 初始化
        if (!Session.get('Sel_1')) {
            Session.set("Sel_1", CompanyRegist.find({}).fetch()[0].name);
        }
        var name = Session.get('Sel_1');
        Session.set("Sel_2", CompanyRegist.findOne({name: name}).services[0].zone);
        return CompanyRegist.findOne({name: name}).services;
    },
    payment: function() {
        return Session.get('Pay') || 0;
    }
});


Template.registration_board.events({
    'click #name li': function(event) {
        Session.set('Sel_1', $(event.currentTarget).attr("value"));
        $("#zone li").first().addClass("selected").siblings().removeClass("selected");
    },
    'click #zone li': function (event) {
        Session.set('Sel_2', $(event.currentTarget).attr("value"));
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 财务代理

Template.agent_board.onRendered(function () {

    // 计算花费
    this.autorun(function () {
        var name = Session.get('Sel_1');
        var annualIncome = Session.get('Sel_2');
        var certiNum = Session.get('Sel_3');
        var period = Session.get('Sel_4');

        // console.log(name, period, annualIncome, certiNum);

        var payment = 0;
        if (name && period) {
            var info = FinanceAgent.findOne({name: name});
            if (info.payment && !info.opts) {
                payment = info.payment;
            } else {
                var payment_1 = kylUtil.getValueFromList(
                    info.opts.annualIncome.items || [], 'name', annualIncome, 'value');
                var payment_2 = kylUtil.getValueFromList(
                    info.opts.certiNum.items || [], 'name', certiNum, 'value');

                if (payment_1 && payment_2) {
                    payment = Math.min(payment_1, payment_2);
                }
            }
            payment = payment * parseInt(period);
        }
        Session.set('Pay', payment);
    });
});


Template.agent_board.helpers({
    payment: function () {
        return Session.get('Pay');
    },
    names: function () {
        return FinanceAgent.find({}, {fields: {name: 1, label: 1}}).fetch();
    },
    opts: function () {
        if (!Session.get('Sel_1')) {
            var info = FinanceAgent.find({}).fetch()[0] || {};
            Session.set('Sel_1', info.name);
        }
        var name = Session.get("Sel_1");
        var info = FinanceAgent.findOne({name: name});
        var opts = info.opts || false;
        if (opts) {
            Session.set('Sel_2', opts.annualIncome.items[0].name);
            Session.set('Sel_3', opts.certiNum.items[0].name);
        } else {
            Session.set('Sel_2', '');
            Session.set('Sel_3', '');
        }
        Session.set('Sel_4', info.period.items[0].value);
        return opts;
    },
    period: function () {
        var name = Session.get("Sel_1") ;
        return FinanceAgent.findOne({name: name}).period || {};
    }
});

Template.agent_board.events({
    'click #name li': function (event, template) {
        Session.set('Sel_1', $(event.currentTarget).attr('value') );
        $("#period li").first().addClass("selected").siblings().removeClass("selected");
    },
    'click #annualIncome li': function (event, template) {
        Session.set('Sel_2', $(event.currentTarget).attr('value') );
    },
    'click #certiNum li':function (event, template) {
        Session.set('Sel_3', $(event.currentTarget).attr('value') );
    },
    'click #period li': function (event, template) {
        Session.set('Sel_4', parseInt($(event.currentTarget).attr('value')) );
    }
});



/////////////////////////////////////////////////////////////////////////////////////////////////
// 流量记账包

Template.package_board.onRendered(function () {
    // 计算花费
    this.autorun(function () {
        var typ = $("#packageType li").eq(Session.get('Sel_1')).html() || "";
        var ser = $("#packageSer li").eq(Session.get('Sel_2')).html() || "";

        Session.set("Sel_1_str", typ);
        Session.set("Sel_2_str", ser);

        var info = BookkeepingLists.findOne({bookkeepingTypeName: typ});
        var lists = info.lists;
        var payment = 0;

        lists.forEach(function (value) {
            if (value.name == ser) {
                payment = value.payment;
            }
        });

        Session.set('Pay', payment);
    });
});


Template.package_board.helpers({
    payment: function () {
        return Session.get('Pay') || 0;
    }
});


Template.package_board.events({
    'click #packageType li': function (event, template) {
        Session.set('Sel_1', $(event.currentTarget).index());
    },
    'click #packageSer li': function (event, template) {
        Session.set('Sel_2', $(event.currentTarget).index());
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 银行开户

Template.bank_board.onRendered(function () {

    this.autorun(function () {
        var bankName = $("#bankSel li").eq(Session.get('Sel_1')).html() || "";
        Session.set('Sel_1_str', bankName);
        var info = BankLists.findOne({bank: bankName});

        Session.set("Pay", info.payment);
    });
});

Template.bank_board.helpers({
    payment: function () {
        return Session.get("Pay") || 0;
    }
});

Template.bank_board.events({
    'click #bankSel': function (event) {
        Session.set('Sel_1', $(event.currentTarget).index());

    }
});




