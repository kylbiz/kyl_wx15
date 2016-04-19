Template.buyagent.helpers({
	buyAgentInfo: function () {
    var params = Router.current().params
		var type = params.productType;
    var handelMap = {
      'finance': function () {
        var basicType = params.query.type;
        templateMap = {
          'base': 'financeBase',
          'special': 'financeSpecial',
          'customproduct': 'financeCustomProduct',
        }

        return {
          template: templateMap[basicType],
          data: "",
        }
      }
    }
    if (handelMap[type]) {
      return handelMap[type]();
    }
    return {};

	}
});

Template.buyagent.events({
  'click .field li': function (event, template) {
       $(event.currentTarget).addClass("selected").siblings().removeClass("selected");
  },
  'click .submit':function () {
    goToAddShopCart();
  }
});


Template.financeBase.onRendered(function () {
    // 计算花费
    this.autorun(function () {
        var name = Session.get('Sel_1');
        var annualIncome = Session.get('Sel_2');
        var certiNum = Session.get('Sel_3');
        var period = Session.get('Sel_4');

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


Template.financeBase.helpers({
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
      var name = Session.get("Sel_1");
      return FinanceAgent.findOne({name: name}).period || {};
  },
  typeLabel: function () {
    var name = Session.get("Sel_1");
    return FinanceAgent.findOne({name: name}).label || "未知";
  },
  monthPayLabel: function () {
    var pay = Session.get('Pay') || 0;
    var period = Session.get('Sel_4') || 1;
    return pay / parseInt(period);
  },
  isServer: function (str) {
    var name = Session.get("Sel_1") || "";
    return (str == name);
  }
});


Template.financeBase.events({
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
    },
    'click #name li:last': function(event) {
    $(".dist-content").css({height: '450px'})
  }
});



Template.financeSpecial.onRendered(function () {
  this.autorun(function () {
    var name = Session.get('Sel_1');
    var service = Session.get('Sel_2');
    var area = Session.get('Sel_3');
    var num = parseInt(Session.get('Sel_4'));

    // console.log('name', name, 'service', service, 'area', area, 'num', num);
    var payment = 0
    if (name && service && num) {
      var info = FinanceAgent.findOne({name: name});
      if (info.opts.area && area) {
        var paymentAll = kylUtil.getValueFromList(
          info.opts.service.items, 'name', service, 'payment') || {};
        var pay = paymentAll[area] || 0;
        payment = pay * num;
      } else {
        var pay = kylUtil.getValueFromList(
          info.opts.service.items, 'name', service, 'payment') || 0;
        payment = pay * num;
      }
    }
    Session.set('Pay', payment);
  });
});


Template.financeSpecial.helpers({
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
    var opts = info.opts;
    Session.set('Sel_2', opts.service.items[0].name);
    if (opts.area) {
      Session.set('Sel_3', opts.area.items[0].name);
    } else {
      Session.set('Sel_3', '');
    }
    Session.set('Sel_4', 1);
    return opts || {};
  },
  typeLabel: function () {
    var name = Session.get("Sel_1");
    if (name) {
      return FinanceAgent.findOne({name: name}).label || "未知";
    }
    return '';
  },
  payment: function () {
    return Session.get('Pay') || 0;
  },
  message: function () {
    var name = Session.get("Sel_1");
    var service = Session.get("Sel_2");
    if (name && service) {
      var items = FinanceAgent.findOne({name: name}).opts.service.items;
      return kylUtil.getValueFromList(items, 'name', service, 'message') || '';
    }
    return '';
  },
  singlePayLabel: function () {
    var pay = Session.get('Pay') || 0;
    var num = parseInt(Session.get('Sel_4')) || 1;
    return pay / num;
  },
  unitLabel: function () {
    var name = Session.get('Sel_1');
    var service = Session.get('Sel_2');
    if (name && service) {
      var info = FinanceAgent.findOne({name: name});
      return kylUtil.getValueFromList(
        info.opts.service.items, 'name', service, 'unit') || "未知";
    }

    return '';
  },
  serviceDes: function () {
    var name = Session.get("Sel_1");
    return {
      'fieldwork': 'fieldwork',
      'invoiceagent': 'invoiceagent'
    }[name] || "";

  }
});

Template.financeSpecial.events({
  'click #name li': function (event) {
    Session.set('Sel_1', $(event.currentTarget).attr('value') );

    $("#service li").first().addClass("selected").siblings().removeClass("selected");
    $('#num input').val("1");
  },
  'click #service li': function (event) {
    Session.set('Sel_2', $(event.currentTarget).attr('value') );
  },
  'click #area li': function (event) {
    Session.set('Sel_3', $(event.currentTarget).attr('value') );
  },
  'change #num input': function (event) {
    Session.set('Sel_4', parseInt($(event.currentTarget).val()) );
  },
  'click #name li:last': function(event) {
    $(".dist-content").css({height: '400px'})
  }
});

Template.financeCustomProduct.onRendered(function () {
  var value = $($('#service li.selected')[0]).attr('value');
  Session.set('Sel_1', value);
});

Template.financeCustomProduct.helpers({
  opts: function () {
    return FinanceAgent.findOne({}).opts;
  },
  message: function () {
    var service = Session.get('Sel_1');
    return kylUtil.getValueFromList(
      FinanceAgent.findOne({}).opts.service.items,
      'name', service, 'message'
      );
  },
});

Template.financeCustomProduct.events({
  'click #service li': function (event) {
    Session.set('Sel_1', $(event.currentTarget).attr('value'));
  },
  'click .buy-box button.btn': function () {
    window.location.href = 'tel:4000663192';
  }
});


function goToAddShopCart() {
    if (!Meteor.userId()) {
        Router.go('login', {}, {query: 'redirectUrl=' + encodeURIComponent(Router.current().url) });
        return;
    }

    Meteor.call('shopcartAdd', getServiceData(), function (err, result) {
        if (err) {
            console.log('shopcartAdd err', err);
            kylUtil.alert("添加到购物车失败!");
        } else {
            Router.go('/shopcart');
        }
    });
}


// 获取所选服务
function getServiceData () {
    var params = Router.current().params;
    var type = params.productType;

    var handles = {
        finance: function () {
            var basicType = params.query.type;

            var handleMap = {
              'base': function () {
                return {
                  type: type,
                  name: Session.get("Sel_1"),
                  period: Session.get('Sel_4'),
                  annualIncome: Session.get('Sel_2'),
                  certiNum: Session.get('Sel_3'),
                };
              },
              'special': function () {
                return {
                  type: type,
                  name: Session.get('Sel_1'),
                  service: Session.get('Sel_2'),
                  area: Session.get('Sel_3'),
                  num: Session.get('Sel_4'),
                }
              }
            }

            if (handleMap[basicType]) {
              return handleMap[basicType]();
            }
            return {};
        },
    };

    if (handles.hasOwnProperty(type)) {
        var data = handles[type]();
        data.host = kylUtil.getBrowserHost();
        return data;
    } else {
        throw new Meteor.Error("内部错误", "非法数据");
    }
}









