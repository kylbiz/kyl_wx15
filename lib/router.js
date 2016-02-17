Router.configure({
    layoutTemplate: 'layout',
    yieldTemplates: {
        'header': {to: 'header'},
        'footer': {to: 'footer'}
    },
    notFoundTemplate: 'notFoundTemplate',
    loadingTemplate: 'loading'
})

Router.map(function(){
    this.route('notFound', {
        path: '/404',
        template: 'notFoundTemplate'
    });

    //微信验证相关
    this.route('oauthnook');

    this.route('/oauthok/:openid', {
        name: 'oauthok',
        data: function() {
            return this.params.openid;
        }
    });
	
	//开业清单

    //清单首页
    this.route('/list/i/:openid', {
        name: 'list',
        subscriptions: function (){
            this.subscribe('singleList', this.params.openid);
        },
        waitOn: function(){
            return Meteor.subscribe('singleList', this.params.openid);
        },
        data: function() {
            var openid = this.params.openid;
            Session.set('openid', openid);
            var list = Lists.findOne({openid: openid});
            if (!list) Meteor.call('createList', openid, function(err, result){})
            return Lists.findOne({openid: openid});
        }
    })

    //选择行业（大类）
	this.route('list/industry/:openid', {
        name: 'listIndustry',
        data: function(){
            Session.set('openid', this.params.openid);
        }
    });

    //选择行业（小类）
	this.route('list/industry/sub/:industry/:openid', {
        name: 'listIndustrySub',
        waitOn: function (){
            return Meteor.subscribe('business');
        },
        data: function(){
            Session.set('openid', this.params.openid);
            return {
                industry: this.params.industry,
                openid: this.params.openid
            }
        }
    });
	
    //调整经营范围
	this.route('list/businessscope/:openid', {
        name: 'listBusinessscope',
        waitOn: function(){
            return Meteor.subscribe('singleList', this.params.openid);
        },
        data: function(){
            var openid = this.params.openid;
            Session.set('openid', openid);
            return Lists.findOne({openid: openid});
        }
    });

    //经营范围（增加）
	this.route('list/businessscope/add/:openid', {
        name: 'listBusinessscopeAdd',
        waitOn: function(){
            return Meteor.subscribe('singleList', this.params.openid);
        },
        data: function(){
            var openid = this.params.openid;
            Session.set('openid', openid);
            return Lists.findOne({openid: openid});
        }
    });
	
    //新增公司名称
	this.route('list/companyname/:openid', {
        name: 'listCompanyname',
        waitOn: function(){
            return Meteor.subscribe('singleList', this.params.openid); 
        },
        data: function(){
            var openid = this.params.openid;
            Session.set('openid', this.params.openid);
            return Lists.findOne({openid: openid})
        }
    });
	
    //预约
    this.route('/inquiry/i/:openid', {
        name: 'inquiry',
        data: function() {
            if (this.params.openid){
                Session.set('openid', this.params.openid);
                return this.params.openid;
            }
        }
    });

	//我的预约
    this.route('/myinquiry/i/:openid/:category', {
        name: 'inquiryMyList',
        subscriptions: function (){
            this.subscribe('inquiryCorpreg');
            this.subscribe('inquiryBankaccount');
            this.subscribe('inquiryBookkeeping');
        },
        data: function() {
            var category = this.params.category;
            var openid = this.params.openid;
            if (category){
                return {
                    category: category,
                    inquiries: function (){
                        switch(category){
                            case "corpreg": return inquiryCorpreg.find({openid: openid}); break;
                            case "bankaccount": return inquiryBankaccount.find({openid: openid}); break;
                            case "bookkeeping": return inquiryBookkeeping.find({openid: openid}); break;
                        };
                    }
                };
           }
        }
    });

    //我的预约
    this.route('/myinquiry/i/:openid', {
        name: 'inquiryMy',
        data: function() {
            if (this.params.openid){
                return {openid: this.params.openid};
            }
        }
    });

    //预约成功
	this.route('inquiry/ok/:openid', {
        name: 'inquiryOk',
        data: function (){
            if (this.params.openid){
                return {openid: this.params.openid};
            }
        }
    });

    //订单中心内容
    this.route('/order/:_id', {
        name: 'orderdetail',
        subscriptions: function (){
            this.subscribe('wxorder', this.params._id);
        },
        waitOn: function (){
            return Meteor.subscribe('wxorder', this.params._id);
        },
        data: function (){ 
            return WXOrders.findOne(this.params._id); 
        }
    });

    //订单列表
    this.route('/orders/i/:openid', {
        name: 'orders',
        subscriptions: function (){
            this.subscribe('wxorders', this.params.openid);
        },
        waitOn: function (){
            return Meteor.subscribe('wxorders', this.params.openid);
        },
        data: function() {
            var openid = this.params.openid;
            if (openid){
                return {orders: WXOrders.find({order_status: 2, buyer_openid: openid}, {sort:{order_create_time:-1}})}
            }
        }
    });

});

Router.onBeforeAction(function(){
    // var useragent = navigator.userAgent;
    // if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
    //     alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！');
    //     var opened = window.open('http://www.kyl.biz', '_self');
    //     opened.opener = null;
    //     opened.close();
    // }
    $(window).scrollTop(0);
    this.next();
})
