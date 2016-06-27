## 产品数据

- ShopCart -- 购物车

```javaScript
{
  userId: Meteor.userId(),
  relationId: relationId,   // 订单号
  productType: productType,
  typeNameFlag: typeNameFlag,
  moneyAmount: moneyAmount,
  servicesNameList: servicesNameList,
  payed: false,
  canceled: false,
  finished: false,
  host: 'KYLPC', // 或 'KYLWX' 或 'KYLWAP',
  createTime: new Date(),
  productProgress: {  // 公司注册需要该字段说明进度
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
  "paySuccessInfo": {
      //支付成功返回信息 （2016/3/3）
  },
  "payFailInfos":[
    {}, // 支付失败返回信息 (2016/3/3)
  ],
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
      "industryBig": "管理类",
      "industrySmall": "投资管理",
      "businessScope": [
          "投资管理",
          "投资管理咨询",
          "企业管理服务",
          "供应链管理",
          "企业管理咨询",
          "商务咨询",
          "投资信息咨询",
          "市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）",
          "企业形象策划",
          "市场营销策划"
      ],
      "companyMoney": "200",
      "companyName": {
          "mainName": "开业啦",
          "alternativeName1": "备用字号1",
          "alternativeName2": "备用字号2",
          "alternativeName3": "备用字号3",
          "alternativeName4": "备用字号4"
      },
      "holders": [
          {
              "selectType": 1,
              "holderType": "企业",
              "holderName": "开业啦（上海）网络技术有限公司",
              "moneyPercent": "50",
              "money": "100",
              "holderId": "4481122321"
          },
          {
              "selectType": 0,
              "holderType": "自然人",
              "sex": "男",
              "code": "411502199002567896",
              "address": "上海市普陀区澳门路三维大厦21D",
              "holderName": "刘遵坤",
              "moneyPercent": "50",
              "money": "100",
              "holderId": "2786837871"
          }
      ],
      "legalPerson": {
          "legalPersonName": "法人",
          "legalPersonId": "411502199006029612"
      },
      "supervisor": {
          "supervisorName": "监事",
          "supervisorId": "411502199006029613"
      },
      "contractor": {
          "liaisons": {
              "liaisonsName": "企业联络人",
              "liaisonsId": "411502199006029612",
              "liaisonsPhone": "15618871296",
              "liaisonsEmail": "liuzk552@gmail.com"
          },
          "financialStaff": {
              "financialAgent": false,  // 是否需要财务代理
              "financialStaffName": "财务负责人",
              "financialStaffId": "411502199006029614",
              "financialStaffPhone": "15618871258",
              "financialStaffEmail": "zunkun.liu@kyl.biz"
          }
      },
      "consigner": {
          "consignerName": "资料对接人",
          "consignerPhone": "15618871296",
          "consignerEmail": "liuzunkun@gmail.com"
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
