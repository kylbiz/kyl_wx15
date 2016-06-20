var subObj = null;

// 产品说明页
Template.product.onRendered(function(){
    this.autorun(function () {
        subObj = Meteor.subscribe('products', Router.current().params.productType);
    });

    $(".dist-list-box .list").click(function(){
      $(this).closest('.list-container').toggleClass("open");
    });
    // $(".dist-info-box .list").click(function(){
    //   $(this).closest('.list-container').toggleClass("open");
    // });
    Session.set('buyagentParmas', "");
});

Template.product.onDestroyed(function () {
    if (subObj) {
        // console.log("prodcut destroy", subObj);
        subObj.stop();
    }
});

Template.product.helpers({
    isSpecialProduct: function () {
        var params = Router.current().params;
        var type = params.productType;
        // console.log(params);
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
            bank: 'bank_board', //银行开户
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
            registration: 'registintro',
            finance: 'dist_agent',
            bank: 'dist_bank',
            assurance: 'dist_security',
            trademark: 'dist_trademark',
            bookkeeping: 'dist_agent',
            permit: 'dist_permit', //许可证
            companycha: 'dist_change', //公司变更
        };
        if (dynamicTemplates.hasOwnProperty(type)) {
            return dynamicTemplates[type];
        }

        return false;

    },
    needNewPage: function () {
        var type = Router.current().params.productType;
        // console.log(Router.current().params);
        // return (type == 'finance' || type == 'registration' || type == '' || typ);
        return (type != 'bank');
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
                return {
                    _img: _img,
                };
            },
            bank: function() {
                return {
                    _img: _img
                };
            },
            permit: function () {

            },
            companycha: function () {
                return {
                    _img: _img
                }
            }
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
    'click .directBuy': function (event) {
        event.preventDefault();
        goToAddShopCart();
    },
    'click .needNewPage': function (event) {
        event.preventDefault();
        var defaultType = 'base';
        var productType = Router.current().params.productType;
        var type = Session.get('buyagentParmas') || defaultType;
        Router.go('buyagent', {productType: productType}, {query: 'type=' + type});
    }
});


// 银行开户
Template.dist_bank.onRendered(function () {
    this.autorun(function () {
        Meteor.subscribe("getBankDes");
    });
});


Template.dist_bank.helpers({
    bankDes: function () {
        return BankDes.find({}).fetch();
    },
    getStars: function (star) {
        return [star, star, star, star, star];
    },
    needStar: function (star, indexNow) {
        // console.log("needStar", star, indexNow);
        return ( Number(star) > Number(indexNow) );
    }
});


Template.dist_bank.events({
    'click .dist-info-box .list': function (event) {
        $(event.currentTarget).closest('.list-container').toggleClass("open");
    }
});


//
Template.dist_permit.helpers({
    foodInfo: function () {
        return PermitProduct.findOne({type: 'food'});
    },
    exportImportInfo: function () {
        return PermitProduct.findOne({type: 'exportImport'});
    }
});

// 新产品点击
Template.dist_agent.events({
    'click .product-detail': function (event) {
        $(event.currentTarget).addClass("selected").siblings().removeClass("selected");
        $('.finance-container').eq($(event.currentTarget).index()).addClass("selected").siblings().removeClass("selected");
        var value = $(event.currentTarget).attr('value');
        Session.set('buyagentParmas', value);
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
                bank: Session.get('Sel_1') || "",
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

