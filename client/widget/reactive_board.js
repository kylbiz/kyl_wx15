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
        var name = Blaze.getData(this).productInfo.name;
        var info = RegistrationLists.findOne({name: name});
        var zoneName = Session.get("Sel_1_str") || "";
        if (!zoneName) {
            zoneName = $("#zone li").eq(Session.get('Sel_1')).html();
            Session.set("Sel_1_str", zoneName);
        }

        var payment = 0;
        var services = info.services;
        services.forEach(function (service) {
            if (service.zone == zoneName) {
                payment = service.payment;
            }
        });

        Session.set('Pay', payment);
    });

});


Template.registration_board.helpers({
    payment: function() {
        return Session.get('Pay') || 0;
    }
});


Template.registration_board.events({
    'click #zone li': function(event) {
        Session.set('Sel_1', $(event.currentTarget).index());
        Session.set('Sel_1_str', $(event.currentTarget).html());
    }
});




/////////////////////////////////////////////////////////////////////////////////////////////////
// 社保

Template.assurance_board.onRendered(function () {
    // 保留上次
    // $("#timeSelect li").eq(Session.get('timeSelect')).addClass("selected").siblings().removeClass("selected");
    // $("#serSelect li").eq(Session.get('serSelect')).addClass("selected").siblings().removeClass("selected");
    // $("#personNum").val(Session.get('personNum') || 1);

    // 监听人数变化
    $(document).delegate("#personNum", "change", function () {
        var num = $("#personNum").val() || 1;
        Session.set('personNum', num);
    });
});

Template.assurance_board.helpers({
    payment: function () {
        var serSelect = Session.get('serSelect');
        var timeSelect = Session.get('timeSelect');
        var personNum = Session.get('personNum') || 1;

        var info = this.productInfo[serSelect];
        console.log('payment', this,serSelect, info); 

        return info.payment || info.items[timeSelect].payment * personNum || 0;
    },
    items: function () {
        Session.setDefault('serSelect', 0);

        var items = [
            false, 
            [{
                period: "6",
                periodName: "半年",
                payment: 120
            }, {
                period: "12",
                periodName: "一年",
                payment: 240
            }]
        ];
        return items[Session.get('serSelect')];
    },
    personNum: function () {
        return Session.get('personNum');
    }
});

Template.assurance_board.events({
    'click #timeSelect li': function (event, template) {
        var index = $(event.currentTarget).index();
        Session.set('timeSelect', index);
    },
    'click #serSelect li': function (event, template) {
        var index = $(event.currentTarget).index();
        Session.set('serSelect', index);
    },

});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 财务代理
Template.agent_board.onRendered(function () {

    // 获取购买时间选项列表
    this.autorun(function () {
        var periodNames = false;
        var ser = $("#agentSerSel li").eq(Session.get('agentSerSel')).html();
        var list = Blaze.getData(this).productInfo.list;

        list.forEach(function (value) {
            if (value.name == ser) {
                periodNames = value.periodNames;
            }
        }); 

        Session.set('agentPerNames', periodNames);
    });


    // 计算花费
    Tracker.afterFlush(function () {
        var typ = $("#agentTypSel li").eq(Session.get('agentTypSel')).html();
        var ser = $("#agentSerSel li").eq(Session.get('agentSerSel')).html();

        var period = "一次";
        if (Session.get('agentPerNames')) {
            period = $("#agentTimeSel li").eq(Session.get('agentTimeSel')).html();
        }

        var payment = 0;
        var info = FinanceLists.findOne({'financeTypeName': typ, 'serviceTypeName': ser});
        var lists = info.lists;
        lists.forEach(function (value) {
            if (value.period == period) {
                payment = value.payment;
            }
        });

        Session.set('agentPay', payment);
    });   
});


Template.agent_board.helpers({
    payment: function () {
        return Session.get('agentPay');
    },
    periodNames: function () {      
        var ret = Session.get('agentPerNames');
        if (!ret) {
            Session.set('agentTimeSel', 0); 
        }
        return ret;
    }
});

Template.agent_board.events({
    'click #agentTypSel li': function (event, template) {
        Session.set('agentTypSel', $(event.currentTarget).index());
    },
    'click #agentSerSel li':function (event, template) {
        Session.set('agentSerSel', $(event.currentTarget).index());
    },
    'click #agentTimeSel li':function (event, template) {
        Session.set('agentTimeSel', $(event.currentTarget).index());      
    }
});



/////////////////////////////////////////////////////////////////////////////////////////////////
// 流量记账包

Template.package_board.onRendered(function () {
    // 计算花费
    this.autorun(function () {
        var typ = $("#packageType li").eq(Session.get('packageType')).html();
        var ser = $("#packageSer li").eq(Session.get('packageSer')).html();

        var info = BookkeepingLists.findOne({bookkeepingTypeName: typ});
        var lists = info.lists;
        var payment = 0;

        lists.forEach(function (value) {
            if (value.name == ser) {
                payment = value.payment;
            }
        });

        Session.set('packagePay', payment);
    });
});


Template.package_board.helpers({
    payment: function () {
        return Session.get('packagePay') || 0;
    }
});


Template.package_board.events({
    'click #packageType li': function (event, template) {
        Session.set('packageType', $(event.currentTarget).index());
    },
    'click #packageSer li': function (event, template) {
        Session.set('packageSer', $(event.currentTarget).index());
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 银行开户

Template.bank_board.onRendered(function () {

    this.autorun(function () {
        var bankName = $("#bankSel li").eq(Session.get('bankSel')).html();
        var info = BankLists.findOne({bank: bankName});

        Session.set("bankPay", info.payment);
    });
});

Template.bank_board.helpers({
    payment: function () {
        return Session.get("bankPay") || 0;
    }
});

Template.bank_board.events({
    'click #bankSel': function (event) {
        Session.set('bankSel', $(event.currentTarget).index());
        
    }
});




