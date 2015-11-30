// 产品说明页

Template.product.helpers({
    des: function() {
        // 产品的描述
        return {}
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

    product: function () {
         var params = Router.current().params;

         var products = {
            registration: function () {
                //初始化数据
                Session.set('zoneSelect', 0);
                return {productInfo: RegistrationLists.findOne(params.query)};
            },

            assurance: function () {
                // 初始化数据
                Session.set('serSelect', 0);
                Session.set('timeSelect', 0);
                Session.set('personNum', 1); 

                // var assInfo = AssuranceLists.find().fetch();

                var services = [
                    {name: '社保+公积金开户', type: "account", payment: 500 }, 
                    {name: '社保+公积金每月代缴', type: "fees",  items: [
                            { period: "6", periodName: "半年", payment: 120}, 
                            { period: "12", periodName: "一年", payment: 240}
                        ]
                    },
                ];
                return {productInfo: services};
            },

            finance: function () {
                // 初始化数据
                Session.set('agentTypSel', 0);
                Session.set('agentSerSel', 0);
                Session.set('agentTimeSel', 0);

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

                return {productInfo: services};
            },

            bookkeeping: function () {
                // 初始化数据
                Session.set('packageType', 0);
                Session.set('packageSer', 0);


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


                return {productInfo: services };
            },

            bank: function () {
                // 初始化数据
                Session.set('bankSel', 0);

                return {productInfo: BankLists.find({}).fetch()};
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
            Router.go('/login');
            return;
        }

        console.log('seceive data', getServiceData());

        Meteor.call('shopcartAdd', getServiceData(), function (err, result) {
            if (err) {
                alert('shopcartAdd err', err);
            } else {
                // alert('shopcartAdd OK');
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
    };

    return handles[type]();
        
}