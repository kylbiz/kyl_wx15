Meteor.subscribe('list');
Meteor.subscribe('wxuser');

Template.list.helpers({
	lists: function () {
		return Lists.find({});
	}
	
})

Template.listItem.helpers({
	create_time: function(){
		return moment(this.create_time).format("YYYY-MM-DD H:mm:ss");
	},
	nickname: function(){
		Meteor.call('get_WechatUserBaseInfo3', this.openid)
		return WXUsers.findOne({openid: this.openid}).nickname;
	},
	handled: function(){
		if (this.handled){
			return '已保存';
		}else{
			return '未保存';
		}
	}

})