Router.configure({
  //layoutTemplate: 'layout',
  yieldTemplates: {
    'header': {to: 'header'},
    'footer': {to: 'footer'}
  }
  //subscriptions: function(){
      //this.subscribe('notifies');
  //},
  //notFoundTemplate: 'notFoundTemplate',
  //loadingTemplate: 'loading'
})

Inquiry1Controller = RouteController.extend({
  template: 'inquiry1',
  increment: 10,

  Limit: function() { 
    return parseInt(this.params.limit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.Limit()};
  },
  subscriptions: function() {
    this.inquiriesSub = Meteor.subscribe('inquiry1', this.findOptions());
  },
  inquiries: function() {
    return Inquiry1.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.inquiries().count() === this.Limit();
    var nextPath = this.route.path({limit: this.Limit() + this.increment});
    return {
      inquiry1: this.inquiries(),
      ready: this.inquiriesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Inquiry2Controller = RouteController.extend({
  template: 'inquiry2',
  increment: 10,

  Limit: function() { 
    return parseInt(this.params.limit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.Limit()};
  },
  subscriptions: function() {
    this.inquiriesSub = Meteor.subscribe('inquiry2', this.findOptions());
  },
  inquiries: function() {
    return Inquiry2.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.inquiries().count() === this.Limit();
    var nextPath = this.route.path({limit: this.Limit() + this.increment});
    return {
      inquiry2: this.inquiries(),
      ready: this.inquiriesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Inquiry3Controller = RouteController.extend({
  template: 'inquiry3',
  increment: 10,

  Limit: function() { 
    return parseInt(this.params.limit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.Limit()};
  },
  subscriptions: function() {
    this.inquiriesSub = Meteor.subscribe('inquiry3', this.findOptions());
  },
  inquiries: function() {
    return Inquiry3.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.inquiries().count() === this.Limit();
    var nextPath = this.route.path({limit: this.Limit() + this.increment});
    return {
      inquiry3: this.inquiries(),
      ready: this.inquiriesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Order1Controller = RouteController.extend({
  template: 'order1',
  increment: 10,

  Limit: function() { 
    return parseInt(this.params.limit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.Limit()};
  },
  subscriptions: function() {
    this.ordersSub = Meteor.subscribe('order1', this.findOptions());
  },
  orders: function() {
    return Order1.find({}, this.findOptions())
  },
  data: function() {
    var hasMore = this.orders().count() === this.Limit();
    var nextPath = this.route.path({limit: this.Limit() + this.increment});
    return {
      order1: this.orders(),
      ready: this.ordersSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});


Router.map(function(){

  //********************预约*******************
  //公司注册
  this.route('/inquiry1/:limit?', { //列表（带翻页）
    name: 'inquiry1'
  });

  this.route('/inquiry1/detail/:_id', { //详细
    name: 'inquiry1detail',
    waitOn: function() {
      return [Meteor.subscribe('singleInquiry1', this.params._id)];
    },
    data: function() {
      if(Inquiry1.findOne(this.params._id)){
        Meteor.call('get_WechatUserBaseInfo', Inquiry1.findOne(this.params._id).openid, this.params._id)
      }
      return Inquiry1.findOne(this.params._id); 
    }
  });

  //银行开户
  this.route('/inquiry2/:limit?', { //列表（带翻页）
    name: 'inquiry2'
  });

  this.route('/inquiry2/detail/:_id', {//详细
    name: 'inquiry2detail',
    waitOn: function() {
      return [Meteor.subscribe('singleInquiry2', this.params._id)];
    },
    data: function() { 
      if(Inquiry2.findOne(this.params._id)){
        Meteor.call('get_WechatUserBaseInfo', Inquiry2.findOne(this.params._id).openid, this.params._id)
      }
      return Inquiry2.findOne(this.params._id); 
    }
  });


  //财务代理
  this.route('/inquiry3/:limit?', { //列表（带翻页）
    name: 'inquiry3'
  });

  this.route('/inquiry3/detail/:_id', {//详细
    name: 'inquiry3detail',
    waitOn: function() {
        return [Meteor.subscribe('singleInquiry3', this.params._id)];
    },
    data: function() { 
      if(Inquiry3.findOne(this.params._id)){
        Meteor.call('get_WechatUserBaseInfo', Inquiry3.findOne(this.params._id).openid, this.params._id)
      }
      return Inquiry3.findOne(this.params._id); 
    }
  });

  //********************订单*******************
  this.route('/order1/:limit?', { //列表（带翻页）
    name: 'order1'
  });

  this.route('/order1/detail/:_id', {//详细
    name: 'order1detail',
    waitOn: function() {
      return [Meteor.subscribe('singleOrder1', this.params._id)];
    },
    data: function() { 
      if(Order1.findOne(this.params._id)){
        Meteor.call('get_WechatUserBaseInfo2', Order1.findOne(this.params._id).buyer_openid, this.params._id)
      }
      return Order1.findOne(this.params._id); 
    }
  });
  //this.route('order1');
  this.route('order2');
  this.route('order3');

  //********************清单*******************
  this.route('/list/:limit?', {
    name: 'list'
  });

  this.route('/list/detail/:_id', {//详细
    name: 'listdetail',
    waitOn: function() {
        return [Meteor.subscribe('singleList', this.params._id)];
    },
    data: function() { 
      return Lists.findOne(this.params._id); 
    }
  });
});