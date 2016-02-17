WXTokens = new Meteor.Collection('wxtokens');//微信令牌
WXTickets = new Meteor.Collection('wxtickets');//微信令牌
WXPay = new Meteor.Collection('wxpay');//微信支付参数
WXOrders = new Meteor.Collection('wxorders');//微信订单
WXLocations = new Meteor.Collection('wxlocations');//微信订单
Push = new Meteor.Collection('Push');
WXMsgs = new Mongo.Collection("wxmsgs");
WXAccessToken = new Mongo.Collection('WXAccessToken'); // wechat token for oauth

