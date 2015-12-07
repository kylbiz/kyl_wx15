// 产品说明页

Template.product.helpers({
  
    _des: function() {
        var type = Router.current().params.productType;
        if(type=='bookkeeping') {
          type='finance';
        }
        var origin = '/images/'+type+'_scene.jpg';
        return origin;
    },
    _name: function() {
      var name = Router.current().params.query.name;
      return name;
    },
    _img: function(){
      var name = Router.current().params.query.name;
      var img = {
          '1元注册': 'oneyuan',  
          '极速注册': 'jisu',        
          '电商公司': 'dianshang',              
          '教育公司': 'jiaoyu',        
          '金融信息公司': 'jingrong', 
          '移动互联网公司': 'hulianwang',
          '文化传媒公司': 'wenhua',
          '商务服务公司': 'shangwu',
          '建筑设计公司': 'jianzhu',
          '医疗公司': 'yiliao',
          '银行开户': 'icon_bank',
          '财务代理': 'icon_finance',
          '流量记账包服务套餐': 'icon_packpage',
          '小企社保': 'icon_assurance'
      }[name];
      if(img) {
        img = '/images/icon/'+img+'.png';
      }
      else {
        img = 'http://fpoimg.com/640x320';
      }
      return img;
    },  
    _dynamic: function() {
        var type = Router.current().params.productType;
        return {
            registration: 'registration_board', //注册
            assurance: 'assurance_board',       //社保
            finance: 'agent_board',             //财务代理
            bookkeeping: 'package_board',       //流量记账包服务套餐
            bank: 'bank_board'                  //银行开户
        }[type];
    },
    _price: function () {
      console.log("Router.current().params._name", Router.current().params.query.name);
      return kylUtil.getPriceGeneral(Router.current().params.query.name);
    },

    // 产品选项信息
    product: function () {
         var params = Router.current().params;
         var productName = params.query.name || "default";
         var _img = kylUtil.getImg(productName);


         var products = {
            registration: function () {
                return {productInfo: RegistrationLists.findOne(params.query), _img: _img};
            },

            assurance: function () {
                // var assInfo = AssuranceLists.find().fetch();
                var services = [
                    {name: '社保+公积金开户', type: "account", payment: 500 }, 
                    {name: '社保+公积金每月代缴', type: "fees",  items: [
                            { period: "6", periodName: "半年", payment: 120}, 
                            { period: "12", periodName: "一年", payment: 240}
                        ]
                    },
                ];
                return {productInfo: services, _img: _img};
            },

            finance: function () {
                var services = {
                    serTypes: ["一般纳税人", "小规模纳税人"],
                    list: [
                        {name: '抄报税（零申报）', periodNames: ['季度', '半年', '一年'] },
                        {name: '抄报税+核税', periodNames: ['半年', '一年'] },
                        {name: '年度公示+汇算清缴'},
                        {name: '抄报税（零申报）+年度公示+汇算清缴', periodNames: ['季度', '半年', '一年'] },
                        {name: '抄报税+核税+年度公示+汇算清缴', periodNames: ['半年', '一年'] },
                    ]
                };

                return {productInfo: services, _img: _img};
            },

            bookkeeping: function () {
                var services = {
                    bookkeepingTypeNames: ["小规模纳税人", "一般纳税人"],
                    list: [{
                                name: '起步型记账包',
                                description: '10张代开发票、20张记账凭证或40张记账凭证'
                            }, {
                                name: '成长型记账包',
                                description: '20张代开发票、30张记账凭证或70张记账凭证'
                            }, {
                                name: '稳定型记账包',
                                description: '50张代开发票、60张记账凭证或160张记账凭证'
                            }, {
                                name: '无限量记账包',
                                description: '无限量代开发票、无限量记账凭证1年或无限量记账凭证1年'
                            }
                    ]
                };


                return {productInfo: services, _img: _img };
            },

            bank: function () {
                return {productInfo: BankLists.find({}).fetch(), _img: _img};
            }

         };

         //初始化数据
         Session.set('Sel_1', 0);
         Session.set('Sel_1_str', "");
         Session.set('Sel_2', 0);
         Session.set('Sel_2_str', "");
         Session.set('Sel_3', 0);
         Session.set('Sel_3_str', "");
         Session.set('Pay', 0);

        return products[params.productType];
    },


});


Template.product.events({
    'click #shopCart': function(event, template) {
        event.preventDefault();
        Router.go('/shopCart');
    },
    'click .submit': function(event, template) {

        if (!Meteor.userId()) {
            console.log("product", Router.current());
            Router.go('login', {}, {query: 'redirectUrl=' + encodeURIComponent(Router.current().url) });
            return;
        }
        console.log('seceive data', getServiceData());

        Meteor.call('shopcartAdd', getServiceData(), function (err, result) {
            if (err) {
                console.log('shopcartAdd err', err);
                kylUtil.alert("添加到购物车失败!");
            } else {
                Router.go('/shopcart');
            }
        });
    }
});

// 获取所选服务
function getServiceData () {
    var params = Router.current().params
    var type = params.productType;
    var name = params.query.name;
    
    var handles = {
        registration: function () {
            return {
                type: type,
                name: name,
                zone: Session.get("Sel_1_str"),
            };
        },
        assurance: function () {
            var info = {
                type: type,
                name: name,
                server: Session.get("Sel_1_str"),
                num: Session.get("Sel_3") || 1
            };

            var periodName = Session.get("Sel_2_str") || "";
            if (periodName) {
                info.periodName = periodName;
            }

            return info;
        },
        finance: function () {
            return {
                type: type,
                name: name,
                serverType: Session.get('Sel_1_str') || "",
                server: Session.get('Sel_2_str') || "",
                period: Session.get('Sel_3_str') || "",
            }
        },
        bookkeeping: function () {
            return {
                type: type,
                name: name,
                serverType: Session.get('Sel_1_str') || "",
                server: Session.get("Sel_2_str") || "", 
            }
        },
        bank: function () {
            return {
                type: type,
                name: name,
                bank: Session.get('Sel_1_str') || "", 
            }
        }
    };

    return handles[type]();       
}