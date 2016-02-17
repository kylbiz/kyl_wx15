Meteor.subscribe("inquiryReply_info");
Meteor.subscribe("singleInquiry1");

var hooksObject = {
	onSuccess: function (operation, result, template) {
      var inquiryId = inquiryReply.findOne(result).inquiryId;
      var openId = Inquiry1.findOne(inquiryId).openid;
      var content = "您好，客服人员即将与您联系，请保持电话畅通。";
      
      //发送微信推送消息
      Meteor.call('send_WechatMsg', openId, content, function(error, result) {});
      
      //回复咨询
      Meteor.call('inquiryReply', inquiryId, function(error, result) {});

      //跳转回列表页
      Router.go('/inquiry1');
    }
};

AutoForm.addHooks(['inquiryReply'], hooksObject);


Template.inquiry1detail.helpers({
  defaultValues: function() {
    var inquiryId = this._id;
    var info = inquiryReply.findOne({inquiryId: inquiryId});
    if(info){
      return { 
        inquiryId: inquiryId,
        replyMethod: info.replyMethod,
        inquiryCategory: info.inquiryCategory,
        replyDatetime: info.replyDatetime,
        descriptions: info.descriptions
        
      };
    }else{
      return { inquiryId: inquiryId }
    }
  }
})

Template.inquiry1detail.created = function() {
  //something
  //alert(this._id);
  //Meteor.call('userinfo', )
};

//**************列表******************
Template.inquiry1.events({
  //记录查看时间
  'click #viewInquiry': function(event, template) {
    Meteor.call('inquiryView', this._id, function(error, result) {});
  }
});

Template.inquiry2.events({
  //记录查看时间
  'click #viewInquiry': function(event, template) {
    Meteor.call('inquiryView', this._id, function(error, result) {});
  }
});

Template.inquiry3.events({
  //记录查看时间
  'click #viewInquiry': function(event, template) {
    Meteor.call('inquiryView', this._id, function(error, result) {});
  }
});

Template.inquiry1Item.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyDatetime) 
      return this.replyTime.toLocaleString();
  }
})

Template.inquiry2Item.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyDatetime) 
      return this.replyTime.toLocaleString();
  }
})

Template.inquiry3Item.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyDatetime) 
      return this.replyTime.toLocaleString();
  }
})


//**************详细******************
Template.inquiry1detail.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyTime) 
      return this.replyTime.toLocaleString();
  },
  sex: function(){
    if(this.sex=='1'){
      return '男';
    }else{
      return '女';
    }
  },
  subscribe_time: function(){
    return new Date(parseInt(this.subscribe_time) * 1000).toLocaleString();
  }
})

Template.inquiry2detail.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyTime) 
      return this.replyTime.toLocaleString();
  },
  sex: function(){
    if(this.sex=='1'){
      return '男';
    }else{
      return '女';
    }
  },
  subscribe_time: function(){
    return new Date(parseInt(this.subscribe_time) * 1000).toLocaleString();
  }
})

Template.inquiry3detail.helpers({
  createTime: function(){
    return this.createTime.toLocaleString();
  },
  viewTime: function(){
    if (this.viewTime) 
      return this.viewTime.toLocaleString();
  },
  replyTime: function(){
    if (this.replyTime) 
      return this.replyTime.toLocaleString();
  },
  sex: function(){
    if(this.sex=='1'){
      return '男';
    }else{
      return '女';
    }
  },
  subscribe_time: function(){
    return new Date(parseInt(this.subscribe_time) * 1000).toLocaleString();
  }
})


//Template.inquiry2.helpers({ 
//  	inquiry2: function(){
//    	return Inquiry2.find();
//  	}
//});

//Template.inquiry3.helpers({ 
//  	inquiry3: function(){
//    	return Inquiry3.find();
//  	}
//});