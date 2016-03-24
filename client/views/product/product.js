// 产品说明页
Template.product.onRendered(function(){
    $(".dist-list-box .list").click(function(){
      $(this).closest('.list-container').toggleClass("open");
    });
});

Template.product.helpers({
    isSpecialProduct: function () {
        var params = Router.current().params;
        var type = params.productType;

        // console.log("isSpecialProduct", params);
        if (type == 'special') {
            var subType = params.query.subtype || "";
            return {result: true, template: subType};
        }

        return {result: false};
    },
});


Template.product_normal.helpers({
    productName: function () {
        var type = Router.current().params.productType;
        return kylUtil.getProductName(type);
    },
    productsDes: function() {
        var type = Router.current().params.productType;
        return kylUtil.getProductsDes(type);
    },
    _des: function() {
        var type = Router.current().params.productType;
        if (type == 'bookkeeping') {
            type = 'finance';
        }
        var origin = '/images/' + type + '_scene.jpg';
        return origin;
    },
    _img: function() {
        var type = Router.current().params.productType;
        // return kylUtil.getProductImg(type);
        return kylUtil.getImg(type);
    },
    _dynamic: function() {
        var type = Router.current().params.productType;
        return {
            registration: 'registration_board', //注册
            assurance: 'assurance_board', //社保
            finance: 'agent_board', //财务代理
            bookkeeping: 'package_board', //流量记账包服务套餐
            bank: 'bank_board' //银行开户
        }[type];
    },
    _price: function() {
        var type = Router.current().params.productType;
        // return kylUtil.getGeneralPrice(type);
        return kylUtil.getPriceGeneral(type);
    },
    _briefDes: function() {
        // return "hello-world";
    },
    _desTemplate: function() {
        var type = Router.current().params.productType;
        var dynamicTemplates = {
            registration: 'dist_reg',
            finance: 'dist_agent',
            bank: 'dist_bank',
            assurance: 'dist_security',
            trademark: 'dist_trademark',
            bookkeeping: 'dist_agent',
        };
        if (dynamicTemplates.hasOwnProperty(type)) {
            return dynamicTemplates[type];
        }

        return false;

    },

    // 产品选项信息
    product: function() {
        var params = Router.current().params;
        var productType = params.productType;
        // var _img = kylUtil.getProductImg(productType);
        var _img = kylUtil.getImg(productType);

        var products = {
            registration: function() {
                return {
                    _img: _img
                };
            },
            finance: function() {
                var services = {
                    serTypes: ["一般纳税人", "小规模纳税人"],
                    list: [{
                        name: '抄报税（零申报）',
                        periodNames: ['季度', '半年', '一年']
                    }, {
                        name: '抄报税+核税',
                        periodNames: ['半年', '一年']
                    }, {
                        name: '年度公示+汇算清缴'
                    }, {
                        name: '抄报税（零申报）+年度公示+汇算清缴',
                        periodNames: ['季度', '半年', '一年']
                    }, {
                        name: '抄报税+核税+年度公示+汇算清缴',
                        periodNames: ['半年', '一年']
                    }, ]
                };

                return {
                    productInfo: services,
                    _img: _img
                };
            },
            bank: function() {
                return {
                    productInfo: BankLists.find({}).fetch(),
                    _img: _img
                };
            },
        };

        //初始化数据
        Session.set('Sel_1', 0);
        Session.set('Sel_2', 0);
        Session.set('Sel_3', 0);
        Session.set('Sel_4', 0);
        // Session.set('paySelInfo', {});
        Session.set('Pay', 0);

        if (products.hasOwnProperty(params.productType)) {
            return products[params.productType]();
        } else {
            return {};
        }

    },
});



Template.product.events({
    'click #shopCart': function(event, template) {
        event.preventDefault();
        Router.go('/shopCart');
    },
    'click .submit': function() {
        goToAddShopCart();
    },
    'click .directBuy':function () {
        event.preventDefault();
        goToAddShopCart();
    }

});

// 前去添加到购物车
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
        registration: function () {
            return {
                type: type,
                name: Session.get("Sel_1"),
                zone: Session.get("Sel_2"),
            };
        },
        finance: function () {
            return {
                type: type,
                name: Session.get("Sel_1"),
                period: Session.get('Sel_4'),
                annualIncome: Session.get('Sel_2'),
                certiNum: Session.get('Sel_3'),
            };
        },
        bank: function () {
            return {
                type: type,
                name: '银行开户',
                bank: Session.get('Sel_2') || "",
            };
        },
        special: function () {
            var product = SpecialProduct.findOne({subType: params.query.subtype}) || false;

            if (product) {
                return {
                    type: type,
                    name: product.label
                };
            } else {
                throw new Meteor.Error("内部错误", "非法数据");
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
