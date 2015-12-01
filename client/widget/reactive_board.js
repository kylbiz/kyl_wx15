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
    // 监听人数变化
    $(document).delegate("#personNum", "change", function () {
        var num = $("#personNum").val() || 1;
        Session.set('Sel_3', num);
    });

    // 计算花费
    // 这里更好的办法应该是使用 `Track.afterFlush` 具体使用时有问题之后再研究
    this.autorun(function () {
        var Sel_1 = Session.get('Sel_1');
        var Sel_2 = Session.get('Sel_2');
        Session.setDefault('Sel_3', 1);
        var personNum = Session.get('Sel_3') || 1;

        var payFunc = function () {
            var serSelect = $("#serSelect li").eq(Sel_1).html() || "";
            Session.set('Sel_1_str', serSelect);

            var timeSelect = $("#timeSelect li").eq(Sel_2).html() || "";
            Session.set('Sel_2_str', timeSelect);

            var handle = {
                '社保+公积金开户': function () {
                    Session.set('Sel_2', 0);
                    Session.set('Sel_2_str', "");
                    Session.set('Sel_3', 1);

                    var info = AssuranceLists.findOne({name: serSelect}) || {};
                    return info.payment || 0;
                },
                '社保+公积金每月代缴': function () {
                    var info = AssuranceLists.findOne({name: serSelect, periodName: timeSelect}) || {};
                    return info.payment * personNum || 0;
                }
            }

            Session.set('Pay', handle[serSelect]() || 0);
        }

        setTimeout(payFunc, 200);
    });

});

Template.assurance_board.helpers({
    payment: function () {
        return Session.get('Pay');
    },
    items: function () {
        var Sel_1 = Session.get('Sel_1');
        return this.productInfo[Sel_1].items;
    },
    personNum: function () {
        return Session.get('Sel_3');
    }
});

Template.assurance_board.events({
    'click #serSelect li': function (event, template) {
        Session.set('Sel_1', $(event.currentTarget).index());
    },
    'click #timeSelect li': function (event, template) {
        Session.set('Sel_2', $(event.currentTarget).index());
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// 财务代理

Template.agent_board.onRendered(function () {

    // 计算花费
    this.autorun(function () {
        var Sel_1 = Session.get('Sel_1');
        var Sel_2 = Session.get('Sel_2');
        var Sel_3 = Session.get('Sel_3');

        var payFunc = function () {
            var typ = $("#agentTypSel li").eq(Sel_1).html();
            var ser = $("#agentSerSel")[0].value;

            Session.set("Sel_1_str", typ);
            Session.set("Sel_2_str", ser);

            var period = $("#agentTimeSel li").eq(Sel_3).html() || "一次";
            Session.set("Sel_3_str", period);

            var payment = 0;
            var info = FinanceLists.findOne({'financeTypeName': typ, 'serviceTypeName': ser}) || [];
            var lists = info.lists || [];
            lists.forEach(function (value) {
                if (value.period == period) {
                    payment = value.payment;
                }
            });

            Session.set('Pay', payment);
        }

        setTimeout(payFunc, 200);
    });
});


Template.agent_board.helpers({
    payment: function () {
        return Session.get('Pay');
    },
    periodNames: function () {
        var periodNames = false;
        var selId = Session.get("Sel_2");
        var list = this.productInfo.list;
        periodNames = list[selId].periodNames || false;

        if (!periodNames) {
            Session.set('Sel_3', 0); 
        } 

        return periodNames;
    }
});

Template.agent_board.events({
    'click #agentTypSel li': function (event, template) {
        Session.set('Sel_1', $(event.currentTarget).index());
    },
    'change #agentSerSel':function (event, template) {
        Session.set('Sel_2', $(event.currentTarget)[0].selectedIndex);       
    },
    'click #agentTimeSel li':function (event, template) {
        Session.set('Sel_3', $(event.currentTarget).index());      
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




