Template.inquiryMyList.helpers({
	inquiryNo: function (){
		return moment(this.createTime).format("YYYYMMDDHmmss");
	},
	category:  function (){
		switch(this.category){
			case "corpreg": return "公司注册"; break;
			case "bankaccount": return "银行开户"; break;
			case "bookkeeping": return "财务代理"; break;
			default: return "公司注册"
		}
	},
	category_icon: function (){
		switch(this.category){
			case "corpreg": return "glyphicon-home"; break;
			case "bankaccount": return "glyphicon-credit-card"; break;
			case "bookkeeping": return "glyphicon-usd"; break;
			default: return "glyphicon-home" 
		}
	},
	createTime: function (){
		return moment(this.createTime).format("YYYY-MM-DD H:mm:ss")
	}
})