
//*******************订单*******************
Meteor.publish('wxorders', function(openid) {
	check(openid, String);
  return WXOrders.find({buyer_openid: openid}, {sort:{order_create_time:-1}});
});

Meteor.publish('wxorder', function(id){
  return WXOrders.find(id);
});

Meteor.publish('inquiryCorpreg', function(){
  return inquiryCorpreg.find({}, {sort:{createTime:-1}});
});

Meteor.publish('inquiryBankaccount', function(){
  return inquiryBankaccount.find({}, {sort:{createTime:-1}});
});

Meteor.publish('inquiryBookkeeping', function(){
  return inquiryBookkeeping.find({}, {sort:{createTime:-1}});
});

Meteor.publish('push', function(openid) {
	//check(openid, String);
  return Push.find({}, {sort:{createTime:-1}});
});

//*******************清单*******************
Meteor.publish('singleList', function(openid) {
	check(openid, String);
  return Lists.find({openid: openid});
});

Meteor.publish('list', function() {
  return Lists.find({});
})

Meteor.publish('business', function() {
  return Business.find({});
});

Meteor.publish('business1', function() {
  return Business1.find({});
});