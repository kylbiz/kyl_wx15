# 开业啦微信商城
*(`meteor`版本: 1.1.0.3)*

## 项目结构
*见 `projStruct.md`*


## 产品数据
*见 `dataStruct.md`*


## 功能实现

#### 账号系统
- 微信账号与公司账号（电话）绑定、解除绑定
	- `accounts-password`, `meteor-roles`
	- 注意点: 用户取消关注后follwers列表中仍保存用户的openid 但是user信息中subscribe＝0，除openid外其他信息都清除,openid对应一个公众号永久不变

#### 微信OAuth
*-- 使用 wehcat-oauth*

#### 支付系统
*-- 使用 wechat-pay*

#### 微信基本API接口的实现
*-- 使用 wechat-api*

- access_token的维护
	- 中控服务器统一管理access_token
	- 提供token的 get(主动、被动)、 isValid(验证是否过期) save(存储)

- 消息加解密(暂不需要) -- 使用 wechat-crypto



## 当前遗留问题
- 购物车与订单中商品的时效问题
- 支付成功后，在支付成功页，点击浏览器的返回按钮，跳转到订单详情页面
- 退款逻辑
- 共享收货地址的获取

## 维护

#### 注意点

- 产品图片信息写死在 `both/util.js --getImg()`中
- 产品辅助描述信息写死在 `both/util.js --getBriefDes()`中
- 产品大体价格信息写死在 `both/util.js --getPriceGeneral()`中
- 产品购买的信息部分写死在`client/views/product.js`中
- 更改网站地址或支付URL时，注意`ping++`的`webhook url`及微信支付的授权页面及回调`url`
- 测试支付的接口

```
Meteor.call("payOKTest", {
    out_trade_no: result.payOrderId,
    des: "test"
}, function(err, res) {
    if (!err) {
        console.log("支付成功");
        Router.go('/paySuccess?order=' + result.payOrderId + '&style=测试');
    } else {
        console.log("支付失败，请重试");
        Router.go('shopcart');
    }
});

```


#### 计划
- 更新产品
- 添加对支付宝服务窗的支持 (待实现) -- (1. 帐号支持； 2. 支付支持)

#### 维护日志
#### 
- 添加微信支付后的模板通知
- 添加自动化部署
- 添加首页弹出式公告
- 开放除微信以外的浏览器访问
- 添加ping++第三方支付
- 添加根据微信帐号的自动登录
- 更新产品信息
	- 添加更新产品处理逻辑;
	- 与之前的产品兼容;
		- 前台: 订单列表信息显示，旧购物车订单不可支付，未付款订单设置可支付时间限制(12小时)
		- 后台: 更新产品与旧有产品的显示
		- 公告: 产品更新提示
- 财务代理加上由开业啦代理选项
- 添加新产品(许可证，公司变更)
