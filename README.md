# 开业啦微信商城

## 依赖的包
>
- accounts-password  1.1.1* Password support for accounts
- alanning:roles     1.2.13* Role-based authorization
- http               1.1.0* Make HTTP calls to remote servers
- insecure           1.0.3* Allow all database writes by default
- iron:router        1.0.9* Routing specifically designed for Meteor
- meteor-platform    1.2.2* Include a standard set of Meteor packages in your app
- meteorhacks:npm    1.5.0  Use npm modules with your Meteor App
- npm-container      1.2.0+ Contains all your npm dependencies

## 项目结构
- both
- client
- server
- public


## 功能实现

#### 微信基本API接口的实现 -- 使用 wechat-api
- access_token的维护
	- 中控服务器统一管理access_token
	- 提供token的 get(主动、被动)、 isValid(验证是否过期) save(存储)

- 消息加解密(暂不需要) -- 使用 wechat-crypto

#### 账号系统
- 微信账号与公司账号（电话）绑定、接触绑定
	- `accounts-password`, `meteor-roles`
	- 注意点: 用户取消关注后follwers列表中仍保存用户的openid 但是user信息中subscribe＝0，除openid外其他信息都清除,openid对应一个公众号永久不变

#### 产品数据
- ShopCart -- 购物车

```javaScript
{
	userId: Meteor.userId(),
	relationId: relationId, 	// 订单号
	productType: productType,
	typeNameFlag: typeNameFlag,
	moneyAmount: moneyAmount,
	servicesNameList: servicesNameList,
	payed: false,
	canceled: false,
	finished: false,
	host: 'KYLPC', // 或 'KYLWX',
	createTime: new Date(),
	productProgress: { 	// 公司注册需要该字段说明进度
			status: 0
	}
}
```
- UserAddress -- 收货地址

```javaScript
{
	userId: Meteor.userId(),
	receiver: receiver,
	address: address,
	phone: phone,
	tel: tel,
	zipcode: zipcode,
	createAt: new Date()
}
```
- Orders -- 订单

	**公司注册**

	```javascript
	{
	    "_id": "jkiaek26RucNGGzAL",
	    "userId": "vhNg8YmASBGmZ97cR",  // 对应下单用户的 _id
	    "relationId": "201510201815142806741",  // 购物车每个产品支付时又一个relationId , 这个值中可能 一个产品 中两个子产品使用 同一个 relationId , 暂时没有这样的情况，但是这个需保留
	    "productType": "公司注册",   // 产品类型：公司注册，财务代理，社保代理...
	    "typeNameFlag": "registration", //分别为 registration, bank, finance, assurance, bookkeeping
	    "moneyAmount": "1000", //当前订单价格
	    "servicesNameList": [   // 当前订单信息
	        {
	            "name": "互联网公司[杨浦]", // 当前订单具体内容
	            "money": "1000",          //当前订单价格
	            "scale": 1,                 // 购买数量 
	            "servicesContains": [      // 订单中包含，也就是详细信息
	                {
	                    "name": "企业信用代码证（原三证三章合一）"
	                }
	            ]
	        }
	    ],
	    "payed": true,  //是否支付
	    "canceled": false,  // 是否取消订单
	    "finished": false,  // 是否完成订单
	    "userConfirmed": false, // 当前用户是否提交订单，提交后不可修改订单
	    "host": "KYLPC",  // 订单来源， KYLPC 官网网页版， KYLWECHAT 微信端
	    "createTime": ISODate("2015-10-20T10:15:14.281Z"),
	    "productProgress": {    // 如果是公司注册，有当前订单处在那个阶段
	        "status": 2
	    },
	    "openid": "EivAKvpRS7lddftS44bkQCDXvXQ9spqFnnQbdLSQ", // 支付记录号 对应支付中的 out_trade_no
	    "payedTime": ISODate("2015-10-20T10:16:14.946Z"),  //支付时间
	    "addressInfo": {  // 当前用户提供的收货地址等信息
	        "userId": "vhNg8YmASBGmZ97cR",
	        "receiver": "刘遵坤",
	        "address": "吉林省长春市净月大街2555号",
	        "phone": "15618871296",
	        "tel": "",
	        "zipcode": "20000",
	        "createAt": ISODate("2015-10-20T10:15:44.322Z")
	    },
	    "cartId": "zibfHHSukqhLZ6ytr",  //该订单在购物车中的 _id
	    "orderId": "2015102018161495003750",  //当前订单 的orderId 
	    "businessScope": [     //经营范围
	        "技术开发",
	        "技术咨询",
	        "技术转让",
	        "技术服务，化工原料及产品（除危险化学品",
	        "监控化学品",
	        "烟花爆竹",
	        "民用爆炸物品",
	        "易制毒化学品）",
	        "纺织原料",
	        "洗涤用品",
	        "实验室设备",
	        "一类医疗器械批发零售"
	    ],
	    "industryBig": "科技类", //大分类
	    "industrySmall": "生物科技",// 小分类
	    "holders": [
	        {
	            "selectType": 0,
	            "holderType": "自然人",
	            "sex": "男",
	            "code": "411502199006029612", //身份证
	            "address": "上海市普陀区",
	            "holderName": "刘遵坤",
	            "moneyPercent": "10", //占股比例
	            "money": "100", //出资额
	            "holderId": "1268204128"
	        },
	        {
	            "selectType": 1,
	            "holderType": "企业",
	            "holderName": "开业啦（上海）网络科技有限公司",
	            "moneyPercent": "80",
	            "money": "200",
	            "holderId": "2338548297"
	        }
	    ],
	    "companyName": {  //注册公司名称
	        "mainName": "卡也来", //名称
	        "alternativeName1": "", // 备用名称，共有四个
	        "alternativeName2": "",
	        "alternativeName3": "",
	        "alternativeName4": ""
	    },
	    "contractor": {  //企业联络人
	        "liaisons": {
	            "liaisonsName": "啊",
	            "liaisonsId": "411502199006029612",
	            "liaisonsPhone": "15618871296",
	            "liaisonsEmail": "liuzk552@gmail.com"
	        },
	        "financialStaff": { // 财务联络人
	            "financialStaffName": "b",
	            "financialStaffId": "411502199006029613",
	            "financialStaffPhone": "15618871296",
	            "financialStaffEmail": "zunkun.liu@kyl.biz"
	        }
	    }
	}
	
	```

	**财务代理**

	```javascript
	{
	    "_id": "zJQo3hwoAXcghMDjv",
	    "userId": "vhNg8YmASBGmZ97cR",
	    "relationId": "201510281811006245427",
	    "productType": "财务代理",
	    "typeNameFlag": "finance",
	    "moneyAmount": "800",
	    "servicesNameList": [
	        {
	            "name": "小规模纳税人-抄报税（零申报）+年度公示+汇算清缴-季度",
	            "money": "800",
	            "scale": 1,
	            "servicesContains": [
	                
	            ]
	        }
	    ],
	    "payed": true,
	    "canceled": false,
	    "finished": false,
	    "host": "KYLPC",
	    "createTime": ISODate("2015-10-28T10:11:00.624Z"),
	    "openid": "CHS7Y8KEcQqP6kVDkO4SLkO9NXAFQpcwLy1U4ZQu",
	    "payedTime": ISODate("2015-10-28T10:11:52.026Z"),
	    "addressInfo": {
	        "userId": "vhNg8YmASBGmZ97cR",
	        "receiver": "刘遵坤",
	        "address": "吉林省长春市净月大街2555号",
	        "phone": "15618871296",
	        "tel": "",
	        "zipcode": "20000",
	        "createAt": ISODate("2015-10-20T10:15:44.322Z")
	    },
	    "cartId": "k2sfCy8Y5hZxsCSzw",
	    "orderId": "2015102818115205801527"
	},
	
	
	```

	**银行开户**

	```javascript
	{
	    "_id": "BEBCHQMuTJ2q4Wkaj",
	    "userId": "vhNg8YmASBGmZ97cR",
	    "relationId": "201510281810451932183",
	    "productType": "银行开户",
	    "typeNameFlag": "bank",
	    "moneyAmount": "200",
	    "servicesNameList": [
	        {
	            "name": "中国银行",
	            "money": "200",
	            "scale": 1,
	            "servicesContains": [
	                {
	                    "name": "银行开户许可证明"
	                }
	            ]
	        }
	    ],
	    "payed": true,
	    "canceled": false,
	    "finished": false,
	    "host": "KYLPC",
	    "createTime": ISODate("2015-10-28T10:10:45.195Z"),
	    "openid": "CHS7Y8KEcQqP6kVDkO4SLkO9NXAFQpcwLy1U4ZQu",
	    "payedTime": ISODate("2015-10-28T10:11:52.027Z"),
	    "addressInfo": {
	        "userId": "vhNg8YmASBGmZ97cR",
	        "receiver": "刘遵坤",
	        "address": "吉林省长春市净月大街2555号",
	        "phone": "15618871296",
	        "tel": "",
	        "zipcode": "20000",
	        "createAt": ISODate("2015-10-20T10:15:44.322Z")
	    },
	    "cartId": "QJdnyup3tAus24ySA",
	    "orderId": "2015102818115204700518"
	},
	
	
	```

	**流量记账包服务套餐**

	```javascript
	{
	    "_id": "P6RNEgoJYQAcoXGxf",
	    "userId": "vhNg8YmASBGmZ97cR",
	    "relationId": "201510281810542717628",
	    "productType": "流量记账包服务套餐",
	    "typeNameFlag": "bookkeeping",
	    "moneyAmount": "500",
	    "servicesNameList": [
	        {
	            "name": "小规模纳税人[成长型记账包]",
	            "money": "500",
	            "scale": 1,
	            "servicesContains": [
	                {
	                    "name": "成长型记账包"
	                }
	            ]
	        }
	    ],
	    "payed": true,
	    "canceled": false,
	    "finished": false,
	    "host": "KYLPC",
	    "createTime": ISODate("2015-10-28T10:10:54.272Z"),
	    "openid": "CHS7Y8KEcQqP6kVDkO4SLkO9NXAFQpcwLy1U4ZQu",
	    "payedTime": ISODate("2015-10-28T10:11:52.027Z"),
	    "addressInfo": {
	        "userId": "vhNg8YmASBGmZ97cR",
	        "receiver": "刘遵坤",
	        "address": "吉林省长春市净月大街2555号",
	        "phone": "15618871296",
	        "tel": "",
	        "zipcode": "20000",
	        "createAt": ISODate("2015-10-20T10:15:44.322Z")
	    },
	    "cartId": "rdWuBtNmeatipuzGP",
	    "orderId": "2015102818115206206018"
	},
	
	```

	**小企人事**

	```javascript
	{
	    "_id": "2kXQDm29FnTbtnR5A",
	    "userId": "vhNg8YmASBGmZ97cR",
	    "relationId": "201510281811069336621",
	    "productType": "小企人事",
	    "typeNameFlag": "assurance",
	    "moneyAmount": 240,
	    "servicesNameList": [
	        {
	            "name": "社保+公积金每月代缴[一年-1人]",
	            "money": 240,
	            "scale": "1",
	            "servicesContains": [
	                
	            ]
	        }
	    ],
	    "payed": true,
	    "canceled": false,
	    "finished": false,
	    "host": "KYLPC",
	    "createTime": ISODate("2015-10-28T10:11:06.933Z"),
	    "openid": "CHS7Y8KEcQqP6kVDkO4SLkO9NXAFQpcwLy1U4ZQu",
	    "payedTime": ISODate("2015-10-28T10:11:52.025Z"),
	    "addressInfo": {
	        "userId": "vhNg8YmASBGmZ97cR",
	        "receiver": "刘遵坤",
	        "address": "吉林省长春市净月大街2555号",
	        "phone": "15618871296",
	        "tel": "",
	        "zipcode": "20000",
	        "createAt": ISODate("2015-10-20T10:15:44.322Z")
	    },
	    "cartId": "ZvhPpkDfjxunquXhK",
	    "orderId": "2015102818115204108643"
	},
	
	```

	
	


## 进度
- Day 1 --[熟悉基本流程，环境搭建]
- Day 2 --[access-token的获取]
- Day 3 --[项目基本结构]
- Day 4 --[购买流程，账号系统的基本实现]
- Day 5 --[微信账号获取]
- Day 6 --[微信账号绑定，相关产品collection梳理]
- Day 7 --[]


