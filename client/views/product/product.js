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

        console.log("isSpecialProduct", params);
        if (type == 'special') {
            var subType = params.query.subtype || "";
            return {result: true, template: subType};
        }

        return {result: false};
    },
});


Template.product_normal.helpers({
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
        var name = this.productName || "";
        return kylUtil.getImg(name);
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
        var name = this.productName || "";
        // console.log('price', name);
        return kylUtil.getPriceGeneral(name);
    },
    _briefDes: function() {
        var type = Router.current().params.productType;
        var name = this.productName || "";
        if (type != 'registration') {
            return kylUtil.getBriefDes(name);
        } else {
            var info = RegistrationLists.findOne({name: name}) || {};
            var services = info.services || [];
            var areas = [];
            services.forEach(function (area) {
                areas.push(area.zone);
            });
            if (areas.length === 0) {
                return "";
            } else {
                return "地区: " + areas.join("、");
            }
        }
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
        var productName = params.query.name || "default";
        var _img = kylUtil.getImg(productName);


        var products = {
            registration: function() {
                return {
                    productInfo: RegistrationLists.findOne(params.query),
                    _img: _img
                };
            },

            assurance: function() {
                // var assInfo = AssuranceLists.find().fetch();
                var services = [{
                    name: '社保+公积金开户',
                    type: "account",
                    payment: 500
                }, {
                    name: '网上汇缴',
                    type: "account",
                    payment: 300
                }, {
                    name: '社保+公积金每月代缴',
                    type: "fees",
                    items: [{
                        period: "6",
                        periodName: "半年",
                        payment: 120
                    }, {
                        period: "12",
                        periodName: "一年",
                        payment: 240
                    }]
                }, ];
                return {
                    productInfo: services,
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

            bookkeeping: function() {
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
                    }]
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

            trademark: function () {
                return {directBuy: true};
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
        // console.log("product", Router.current());
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


// 获取所选服务
function getServiceData () {
    var params = Router.current().params;
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
            };
        },
        bookkeeping: function () {
            return {
                type: type,
                name: name,
                serverType: Session.get('Sel_1_str') || "",
                server: Session.get("Sel_2_str") || "",
            };
        },
        bank: function () {
            return {
                type: type,
                name: name,
                bank: Session.get('Sel_1_str') || "",
            };
        },
        trademark: function () {
            return {
                type: type,
                name: name,
            };
        },
        special: function () {
            if (SpecialProduct.findOne({name: name, subType: params.query.subtype})) {
                return {
                    type: type,
                    name: name
                };
            } else {
                throw new Meteor.Error("内部错误", "非法数据");
            }
        }
    };

    if (handles.hasOwnProperty(type)) {
        return handles[type]();
    } else {
        throw new Meteor.Error("内部错误", "非法数据");
    }
}
