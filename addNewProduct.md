## 添加新产品流程

1. 添加collection

	文件位置: `lib/collections.js`
	
	实例代码: 
	`NewProduct = new Meteor.Collection("NewProduct");`


2. 添加产品初始化信息

	文件位置: `server/startup.js`
	
	实例代码：
	
	```
	在函数productInit()中添加
	```
	

3. 添加publish信息

	文件位置: `server/publish.js`
	
	实例代码:
	
	```
	Meteor.publish('products', function(project, opt) {});
	
	# 在 products = {} 中添加新产品的collection Object
	
	products = {
		'registration': CompanyRegist.find(opt),
		'finance': FinanceAgent.find(opt),
		'bank': BankLists.find(),
		'special': SpecialProduct.find(),
		'permit': PermitProduct.find(),
		'companycha': CompanyChange.find(),
		'newProduct': NewProduct.find()
	};
	```
	
	
4. 首页添加新产品入口

	-- 前端自行添加

5. 添加产品描述页

	-- 前端自行添加

6. 添加产品购买页
	
	根据`startup.js`中初始化的新产品数据加入到选项

7. 添加购买产品的描述信息（可以不需要）

	文件位置: `client/commentFunc/productInfo.js`
	
	实例代码:
	
	```
	在函数productShowInfo()中根据需要添加
	```

8. 后端添加新产品的处理逻辑

	文件位置: `server/methods/shopcart.js`
	
	实例代码：
	
	```
	在函数getShopcartInfo()中添加对应新产品的逻辑
	```