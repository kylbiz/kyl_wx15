//项目中涉及的所有collection

// 微信账号相关数据
WeChatInfo = new Mongo.Collection('wechatinfo');

// 用户验证码存储
UserCode = new Meteor.Collection('UserCode');

// 所有产品 -- 废弃
// Products = new Mongo.Collection('products');


// 注册公司相关产品 outside + inside
RegistrationLists = new Meteor.Collection('RegistrationLists');


// 财务产品 -- inside 财务代理
FinanceLists = new Meteor.Collection('FinanceLists');

// 财务产品 -- inside 流量记账包
BookkeepingLists = new Meteor.Collection('BookkeepingLists');

// 财务产品 -- inside 银行开户 -- 未写入数据库
BankRegister = [
  {bank: '中国银行', payment: 200},
  {bank: '招商银行', payment: 200},
  {bank: '上海银行', payment: 200}
];


// 人事产品 -- inside 只有这一个产品
AssuranceLists = new Meteor.Collection('AssuranceLists');


// 公司类型
BusinessTypeLists = new Meteor.Collection('BusinessTypeLists');
// 公司类型 子类型 科技类
Business = new Meteor.Collection('BusinessesData');
// 公司类型 子类型 服务类
Business1 = new Meteor.Collection('BusinessesData1');


// 订单
Orders = new Mongo.Collection('orders');

// 购物车
ShopCart = new Meteor.Collection('ShopCart');

// 用户地址
UserAddress = new Meteor.Collection('UserAddress');


