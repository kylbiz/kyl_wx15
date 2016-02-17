var pushData = [{num:"0101", label:"订单确认"},{num:"0201", label:"查名材料"},{num:"0301", label:"名称提交"},{num:"0401", label:"名称通过"},{num:"0501", label:"工商材料"},{num:"0601", label:"工商签字"},{num:"0701", label:"工商送审"},{num:"0801", label:"工商出证"},{num:"0901", label:"证章快递"},{num:"1001", label:"银行开户"},{num:"1101", label:"开户领取"},{num:"1201", label:"财务推荐"}];
Meteor.subscribe('push')
Template.orders.created = function() {
	//刷新订单，从微信小店接口获取
	Meteor.call('searchOrders', function(error, result) {
		if (result==100){
			//alert('成功获取微信小店订单！')
		}else{
			alert('订单获取出错，错误代码：'+error)
		}
	});
}

Template.orders.helpers({ 
	order_total_price: function(){
		return this.order_total_price/100;
	},
	create_time: function(){
		return moment.unix(this.order_create_time).format("YYYY-MM-DD H:mm:ss");
	}
});

Template.orderdetail.helpers({ 
	create_time: function(){
    	return moment.unix(this.order_create_time).format("YYYY-MM-DD H:mm:ss");
	},
	price: function(){
    	return this.order_total_price/100;
  	},
  	push: function(){
  		return Push.find({openid: this.buyer_openid})
  	},
  	pushLabel: function(){
  		var category = this.category;
  		if (category){
			var label = '';
			$.grep(pushData,function(n,i){
				if(n.num===category){
					label = n.label;
				}
			})
		}
		return label;
  	},
  	createTime: function(){
  		return moment(this.createTime).format("YYYY-MM-DD H:mm:ss");
  	}
});