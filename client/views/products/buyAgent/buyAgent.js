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
      },
      'registration': function () {
        return {
          template: 'registservice',
          data: "",
        }
      },
      'permit': function () {
          return {
            template: 'permitAgent',
            data: '',
          }
      },
      'companycha': function () {
        return {
          template: 'companychaAgent',
          data: '',
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
        registration: function () {
          return {
            type: type,
            name: Session.get('Sel_1'),
            zone: Session.get('Sel_2'),
          }
        }
    };

    if (handles.hasOwnProperty(type)) {
        var data = handles[type]();
        data.host = kylUtil.getBrowserHost();
        return data;
    } else {
        throw new Meteor.Error("内部错误", "非法数据");
    }
}









