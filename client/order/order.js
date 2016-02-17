Meteor.subscribe('push');

var hooksObject = {
	onSuccess: function (operation, result, template) {
		var pushId = result;
		var openId = Push.findOne(pushId).openid;
		var content = Push.findOne(pushId).content;
		var orderId = Order1.findOne({buyer_openid: openId})._id;

		alert(orderId);

		//发送微信推送消息
		Meteor.call('send_WechatMsg', openId, content, function(error, result) {});

		//回复咨询
		Meteor.call('orderPush', orderId, function(error, result) {});

		//跳转回列表页
		//Router.go('/inquiry1');
    }
};

Template.order1.created = function() {
	//刷新订单，从微信小店接口获取
	Meteor.call('searchOrders', function(error, result) {
		if (result==100){
			alert('成功获取微信小店订单！')
		}else{
			alert('订单获取出错，错误代码：'+error)
		}
	});
}

AutoForm.addHooks(['Push'], hooksObject);

var pushData = [{num:"0101", content:"您提交了定单，请等待系统确认，感谢对开业啦的支持!\n订单已确认，请完善您的注册信息，谢谢配合！\n1公司抬头+名字\n2经营范围\n3注册资本\n4法人信息及监事信息，法人和监事可以是股东，也可以外聘（但一个股东不可以同时做法人和监事俩个职位）\n5股东，身份证号码，投资比例\n6法人手机号码，邮箱，联系地址，以便材料交接。"},{num:"0201", content:"正在制作《企业名称预先核准申请书》请稍等！\n1）申请书打印出来后股东签字（黑色水笔签字，字迹工整）\n2）股东身份证复印件各一份（原件直接复印，拍照的勿用），打印签字后核名申请表+股东身份证原件，股东本人带着材料与我们的小伙伴到杨浦区工商局核验身份证并提交《企业名称预先核准申请书》\n联系人：林先生13564036062\n杨浦区黄兴路2022号门口"},{num:"0301", content:"您的名字已提交：\n1工商名字驳回，请您重新想名字，微信发给我们即可\n2您的名字区级已经受理，提交市区审核中，需等待五个工作日后领取《名称核准通知书》"},{num:"0401", content:"名称核准通知书已领取，您的企业名字是《开业啦（上海）网络技术有限公司》"},{num:"0501", content:"我们正在做工商签字材料，请您耐心等待!"},{num:"0601", content:"工商材料已做好，以下俩种提交方式供您选择：\n1我们邮件发送给您，表格填写内容您核实一下，日期勿填，然后您只需要打印出来签字即可，在邮寄回。\n签字注意事项：用黑色水笔，字迹清晰，股东身份证原件及监事复印件，一起寄到以下地址,谢谢配合！\n邮寄地址：上海市杨浦区铁岭路32号909B室侯经理收 联系电话 55098816\n2我们打印出来，然后在邮寄给您，您收到按表格标注法人及股东签字后寄回\n签字注意事项：用黑色水笔，字迹清晰，股东身份证原件及监事复印件，一起寄到以下地址,谢谢配合！\n邮寄地址：上海市杨浦区铁岭路32号909B室侯经理收 联系电话 55098816\n3您好，请问您的快递是否已寄出，我们还没有收到，如寄出，请把快递单号告知我们，方便跟踪。"},{num:"0701", content:"工商签字材料已收到，我们会尽快安排送工商"},{num:"0801", content:"开业啦团队的飞毛腿已将材料已送交工商局，11个工作日可以领取三证，请您耐心等待！"},{num:"0901", content:"三证已申领成功，即将给您刻三章（公章，法人章，财务章）"},{num:"1001", content:"接下来企业需要银行开基本户，开业啦提供招商银行第一年费用全免的支行开户，我们有俩个服务提供：\n1如需我们预约银行您自己去开户，请告知区域支行，我们会尽快安排银行开户。\n2如需我们代理开户，需支付200元的开户代理费用，费用请到微信公众号的后台支付，我们收到您的费用后，会尽快安排开户。\n开户需要您提供俩张身份证原件及俩个手机号码，其中一张是法人的，用于办理UKey"},{num:"1101", content:"银行开户已完成，开户许可证在2周左右可以领取，银行会短信发送给您提供的俩个手机号码，用于账户验资。"},{num:"1201", content:"开户许可证已领取，接下来需要去税务局核定税种，我们会为企业提供财务代理服务，\n1小规模3000元/年\n2一般纳税人5000元/年"}]

Template.order1Items.helpers({
	order_create_time: function(){
		return moment.unix(this.order_create_time).format("YYYY-MM-DD H:mm:ss");
	},
	order_total_price: function(){
		return this.order_total_price/100;
	},
	viewTime: function(){
		if (this.viewTime) 
			return this.viewTime.toLocaleString();
	},
	lastPushTime: function(){
		if (this.lastPushTime) 
			return this.lastPushTime.toLocaleString();
	},
	product_name: function(){
		return this.product_name;
	}
})

Template.order1.events({
	//记录查看时间
	'click #viewOrder': function(event, template) {
		Meteor.call('orderView', this._id, function(error, result) {});
	}
});

Template.order1detail.helpers({
	order_create_time: function(){
		return moment.unix(this.order_create_time).format("YYYY-MM-DD H:mm:ss");
	},
	order_total_price: function(){
		return this.order_total_price/100;
	},
	viewTime: function(){
		return moment(this.viewTime).format("YYYY-MM-DD H:mm:ss");
	},
	sex: function(){
		if(this.sex=='1'){
		  	return '男';
		}else{
		  	return '女';
		}
	},
	subscribe_time: function(){
		return moment.unix(this.subscribe_time).format("YYYY-MM-DD H:mm:ss");
	},
	defaultValues: function() {
        return { openid: this.buyer_openid };
    },
    push: function(){
    	return Push.find({openid: this.buyer_openid},{sort: {createTime:-1}})
    },
	lastPushTime: function(){
		return moment(this.lastPushTime).format("YYYY-MM-DD H:mm:ss");
	}
})

Template.order1detail.events({
	'change form#Push #category': function(event, template) {
		var category = template.find('#category').value;
		var openid = template.find('#openid').value;
		//alert(category)
		if (category){
			var content = '';
			$.grep(pushData,function(n,i){
				if(n.num==category){
					content = n.content;
				}
			})
			if (category == '0101') content = content + "\n\n试试新产品“开清单”？！\n\n<a href='http://wx.kyl.biz/list/"+openid+"'>>>>点我<<<</a>";
			template.$('[name=content]').val(content);
		}	
	},
	'click #send_WechatNews': function(event, template) {
		Meteor.call('send_WechatNews', this.buyer_openid, function(error, result) {
			alert(result)
		});
	}
});

Template.pushItems.helpers({
	createTime: function(){
		return moment(this.createTime).format("YYYY-MM-DD H:mm:ss");
	}
});