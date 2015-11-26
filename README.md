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
- router
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

#### 支付系统



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

- PayLogs --支付信息

```javaScript
// 支付前
{
  "_id": "sQzzdQFG45Mp9pRxp",
  "openid": "sB8it9TbvAkJpr4gxqfIGdq82Wx9bIMsd7rLpgl8",
  "userId": "R8hD74ADSLZtipL3A",
  "shoplists": [{
    "relationId": "201511091834289541522",
    "money": "600",
    "servicename": "财务代理"
  }, {
    "relationId": "201511091833437210568",
    "money": "1",
    "servicename": "公司注册"
  }],
  "moneyAmount": 60100,
  "payed": false,
  "addressInfo": {
    "userId": "R8hD74ADSLZtipL3A",
    "receiver": "刘遵坤",
    "address": "上海市普陀区澳门路三维大厦21D",
    "phone": "15618871296",
    "tel": "",
    "zipcode": "20000",
    "createAt": {
      "$date": "2015-11-09T10:34:07.219+0000"
    }
  },
  "invoice": true,
  "createTime": {
    "$date": "2015-11-09T10:34:32.774+0000"
  }
}

// 支付后
{
  "_id": "iSrrwd5iESh87Lj2q",
  "openid": "vMeG7ipbP2boI4poiX0F7eNt8o6eTFQn3W1lG5Fg",
  "userId": "R8hD74ADSLZtipL3A",
  "shoplists": [{
    "relationId": "201511111455135927459",
    "money": "1",
    "servicename": "公司注册"
  }],
  "moneyAmount": 100,
  "payed": true,
  "addressInfo": {
    "userId": "R8hD74ADSLZtipL3A",
    "receiver": "刘遵坤",
    "address": "上海市普陀区澳门路三维大厦21D",
    "phone": "15618871296",
    "tel": "",
    "zipcode": "20000",
    "createAt": {
      "$date": "2015-11-09T10:34:07.219+0000"
    }
  },
  "invoice": false,
  "createTime": {
    "$date": "2015-11-11T06:55:19.454+0000"
  },
  "payedTime": {
    "$date": "2015-11-11T06:56:09.192+0000"
  },
  "payInfos": {
    "retryCounter": 0,
    "transaction_id": "vMeG7ipbP2boI4poiX0F7eNt8o6eTFQn3W1lG5Fg",
    "retry_counter": 0,
    "transaction_fee": 100,
    "channelType": "ALI",
    "sub_channel_type": "ALI_WEB",
    "optional": {
      "relationIdLists": "201511111455135927459",
      "invoice": "false"
    },
    "transaction_type": "PAY",
    "notify_url": "http://www.kyl.biz/webhook",
    "transactionId": "vMeG7ipbP2boI4poiX0F7eNt8o6eTFQn3W1lG5Fg",
    "transactionType": "PAY",
    "transactionFee": 100,
    "tradeSuccess": true,
    "notifyUrl": "http://www.kyl.biz/webhook",
    "channel_type": "ALI",
    "messageDetail": {
      "bc_appid": "595e34c0-4185-4b60-ae67-afd7f8af3577_222f5193-4b72-487d-92e9-d63fb872d682",
      "discount": "0.00",
      "payment_type": "1",
      "subject": "开业啦创业服务",
      "trade_no": "2015111121001004580058938303",
      "buyer_email": "1334416803@qq.com",
      "gmt_create": "2015-11-11 14:56:05",
      "notify_type": "trade_status_sync",
      "quantity": "1",
      "out_trade_no": "vMeG7ipbP2boI4poiX0F7eNt8o6eTFQn3W1lG5Fg",
      "seller_id": "2088612207933748",
      "notify_time": "2015-11-11 14:56:09",
      "trade_status": "TRADE_SUCCESS",
      "is_total_fee_adjust": "N",
      "total_fee": "1.00",
      "gmt_payment": "2015-11-11 14:56:09",
      "seller_email": "kylbiz@163.com",
      "price": "1.00",
      "buyer_id": "2088502326264585",
      "notify_id": "0fd9ab8ad2625e3e315b010ebc2063akh4",
      "use_coupon": "N",
      "sign_type": "MD5",
      "sign": "ed3bd745f45d52a276bf12885781aebe",
      "tradeSuccess": true
    },
    "message_detail": {
      "bc_appid": "595e34c0-4185-4b60-ae67-afd7f8af3577_222f5193-4b72-487d-92e9-d63fb872d682",
      "discount": "0.00",
      "payment_type": "1",
      "subject": "开业啦创业服务",
      "trade_no": "2015111121001004580058938303",
      "buyer_email": "1334416803@qq.com",
      "gmt_create": "2015-11-11 14:56:05",
      "notify_type": "trade_status_sync",
      "quantity": "1",
      "out_trade_no": "vMeG7ipbP2boI4poiX0F7eNt8o6eTFQn3W1lG5Fg",
      "seller_id": "2088612207933748",
      "notify_time": "2015-11-11 14:56:09",
      "trade_status": "TRADE_SUCCESS",
      "is_total_fee_adjust": "N",
      "total_fee": "1.00",
      "gmt_payment": "2015-11-11 14:56:09",
      "seller_email": "kylbiz@163.com",
      "price": "1.00",
      "buyer_id": "2088502326264585",
      "notify_id": "0fd9ab8ad2625e3e315b010ebc2063akh4",
      "use_coupon": "N",
      "sign_type": "MD5",
      "sign": "ed3bd745f45d52a276bf12885781aebe",
      "tradeSuccess": true
    },
    "trade_success": true,
    "sign": "e99a570e3764d4e4ea6278789b7458a7",
    "signAll": "39cbad8906e163d88d18055badb98a04",
    "timestamp": 1.44722496E12
  }
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
	    "orderId": "201510281811520620601804108643"
	},
	
	```

## 进度
- Day 1 --[熟悉基本流程，环境搭建]
- Day 2 --[access-token的获取]
- Day 3 --[项目基本结构]
- Day 4 --[购买流程，账号系统的基本实现]
- Day 5 --[微信账号获取]
- Day 6 --[微信账号绑定，相关产品collection梳理]
- Day 7 --[整合前端代码,登录验证码的实现]
- Day 8 --[微信openid的获取，微信支付的实现，包括收货地址的获取]
- Day 9 --[产品购买流程]
- Day 10 --[购买产品的具体细节]
- Day 11 --[购买具体 -后半段，购买产品信息获取与数据库存储]
- Day 12 --[产品购买全流程完毕 -购物车到地址设置到支付订单的对接] - not finish
- Day 13 -- 请假
- Day 14 --[产品购买全流程完毕 -购物车到地址设置到支付订单的对接]
- Day 15 --[资料填写，订单界面]
- Day 16 --[个人用户界面等相关辅助界面]
- Day 17 --[项目整理]

## 当前遗留问题
- 微信支付 -- 生成订单时的保存与支付后的确认
- 退款逻辑
- 测试access_token oauth_token的get、save
- 共享收货地址的获取
- 支付过程中的标记与处理
- 跳转去登录之后，回调过来的处理


## 其他

#### 微信
appid --  --公众号唯一标识
secret --APPID对应的接口密码, 用于 1.获取接口调用凭证`access_token`时使用； 2.`OAuth2.0`获取用户openId
mch_id --微信支付商户收款号
key --交易过程生成签名的密钥

**微信支付**

- 准备: 
	- 申请商户账号，获取支付权限
	- 配置oauth授权域名, 配置（测试）支付授权目录(在授权域名之下), 添加测试白名单
- 发起支付请求
	- 参数准备
		- prepay_id: 发起统一下单
		- paySign: access_token => jsapi_ticket => 签名
	- H5调用

	``` javaScript
	WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId" ： "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
           "timeStamp"：" 1395712654",         //时间戳，自1970年以来的秒数     
           "nonceStr" ： "e61463f8efa94090b1f366cccfbbb444", //随机串     
           "package" ： "prepay_id=u802345jgfjsdfgsdg888",     
           "signType" ： "MD5",         //微信签名方式：     
           "paySign" ： "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
       },
       function(res){     
           if(res.err_msg == "get_brand_wcpay_request：ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
       }
   ); 
	```		
	- JSSDK调用
	


