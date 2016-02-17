//单个发布
Meteor.publish('singleInquiry1', function(id) { //公司注册预约
	//check(id, String);
  	return Inquiry1.find(id);
});

Meteor.publish('singleInquiry2', function(id) { //银行开户预约
  check(id, String);
  return Inquiry2.find(id);
});

Meteor.publish('singleInquiry3', function(id) { //财务代理预约
  check(id, String);
  return Inquiry3.find(id);
});

Meteor.publish('inquiryReply_info', function() {
	return inquiryReply.find();
})

//列表发布
Meteor.publish('inquiry1', function() { //公司注册预约
	return Inquiry1.find({}, {sort: {createTime:-1}})
})

Meteor.publish('inquiry2', function() { //银行开户预约
	return Inquiry2.find({}, {sort: {createTime:-1}})
})

Meteor.publish('inquiry3', function() { //财务代理预约
	return Inquiry3.find({}, {sort: {createTime:-1}})
})

Meteor.publish('order1', function() { //财务代理预约
	return Order1.find({}, {sort: {order_create_time:-1}})
})

Meteor.publish('singleOrder1', function(id) { //公司注册预约
	//check(id, String);
  	return Order1.find(id);
});

Meteor.publish('push', function() { 
  	return Push.find({}, {sort: {createTime: -1}});
  	//return Push.find();
});

Meteor.publish('singlePush', function(id) { 
  	return Push.find(id);
});

Meteor.publish('list', function() { 
    return Lists.find({}, {sort: {create_time: -1}});
});

Meteor.publish('singleList', function(id) { 
    return Lists.find(id);
});

Meteor.publish('wxuser', function() {
  return WXUsers.find({})
})
