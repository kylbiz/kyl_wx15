//项目中涉及的所有collection

// 微信账号相关数据
WeChatInfo = new Meteor.Collection('wechatinfo');

// 用户验证码存储
UserCode = new Meteor.Collection('UserCode');

// 订单
Orders = new Meteor.Collection('Orders');

// 支付记录
PayLogs = new Meteor.Collection('PayLogs');

// 购物车
ShopCart = new Meteor.Collection('ShopCart');

// 用户地址
UserAddress = new Meteor.Collection('UserAddress');

// 公司行业类型
BusinessTypeLists = new Meteor.Collection('BusinessTypeLists');

// 公司细分类型及经营范围
Business = new Meteor.Collection('Business');	// 包含基础经营范围
Business1 = new Meteor.Collection('Business1');	// 包含附加经营范围

// 产品版本控制
WebSiteInfoMobile = new Meteor.Collection("WebSiteInfoMobile");

// 公司注册
CompanyRegist = new Meteor.Collection("CompanyRegist");

// 财务代理产品
FinanceAgent = new Meteor.Collection("FinanceAgent");

// 银行开户
BankLists = new Meteor.Collection('BankLists_wechat');

// 特殊商品
SpecialProduct = new Meteor.Collection("SpecialProduct_wechat");




//////////////////////////////////////////////////////////////////////
// 废弃产品 start (暂保留)

// 注册公司相关产品 outside + inside
RegistrationLists = new Meteor.Collection('RegistrationLists_wechat');

// 财务产品 -- inside 财务代理
FinanceLists = new Meteor.Collection('FinanceLists_wechat');

// 财务产品 -- inside 流量记账包
BookkeepingLists = new Meteor.Collection('BookkeepingLists_wechat');

// 人事产品 -- inside 只有这一个产品
AssuranceLists = new Meteor.Collection('AssuranceLists_wechat');

// 商标注册产品
TradeMark = new Meteor.Collection('TradeMark_wechat');

// 废弃产品 end
///////////////////////////////////////////////////////////////////////


