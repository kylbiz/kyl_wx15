## 项目结构

```
├── LICENSE
├── README.md
├── client
│   ├── commentFunc                         # 客户端多个模块需要的共用功能
│   │   └── productInfo.js                  # 产品描述
│   ├── compatibility                       # 前端需要的辅助功能
│   ├── layouts                             # 客户端的总体布局
│   ├── stylesheet                          # 前端样式
│   ├── views
│   │   ├── activity_product                # 临时活动页(现已废弃)
│   │   ├── address                         # 用户地址也
│   │   ├── companyInfo                     # 注册公司资料录入页
│   │   ├── error.html                      # 出错页
│   │   ├── main                            # 旧版产品中心页(现已废弃)
│   │   ├── order                           # 订单管理页
│   │   ├── product                         # 产品描述页
│   │   ├── products                        # 产品购买页
│   │   │   ├── buyAgent                    # 所有产品的购买页入口
│   │   │   ├── companychaAgent             # 公司变更购买页
│   │   │   ├── financeAgent                # 财务代理购买页
│   │   │   ├── permitAgent                 # 许可证购买页
│   │   │   ├── products                    # 旧版产品描述页
│   │   │   └── registservice               # 公司注册购买页
│   │   ├── root                            # 公司首页入口
│   │   ├── shopcart                        # 购物车
│   │   ├── tools                           # 工具页
│   │   ├── trade                           # 支付页
│   │   └── user                            # 个人中心页
│   └── widget                              # 一些客户端需要的组件
├── dist                                    # 存放打包程序
├── lib
│   ├── collections.js                      # collections 定义
│   └── util.js                             # 客户端需要用的util工具
├── packages
│   └── npm-container                       # npm-container
│       ├── index.js
│       └── package.js
├── packages.json
├── platforms
├── private
├── public
│   ├── client
│   ├── css
│   ├── images
│   ├── js                                  # 支付宝支付与ping++的客户端js文件
│   └── pay                                 # 支付宝在微信端支付的兼容
├── release
├── router                                  # 路由相关
│   ├── router.js                           # 路由入口
│   ├── routerCtrl.js                       # 路由权限控制
│   └── routerTest.js                       # 路由测试页(现已废弃)
├── server
│   ├── errorCode.json
│   ├── lib
│   │   └── kadira.js                       # Kadira性能检测(现已废弃)
│   ├── methods                             # 对客户端开放的接口 methods
│   ├── payHandle                           # 支付前后对相关数据的处理 (之后如果接入其他支付渠道，则使用这里的逻辑)
│   ├── pingxx                              # pingxx支付相关处理逻辑
│   ├── publish.js                          # 数据订阅 publish
│   ├── sms                                 # 短信通知的接口
│   ├── startup.js                          # 系统启动时的初始化操作，包括数据库的初始化
│   └── weChat                              # 微信相关
│       ├── lib
│       │   ├── apiclient_cert.p12
│       │   └── wechatConfig.js             # 微信公众号相关配置
│       ├── wechatAPI.js                    # 微信主动调用相关API
│       ├── wechatOauth.js                  # 微信第三方授权API
│       ├── wechatPay.js                    # 微信支付相关逻辑
│       └── wechatReceive.js                # 微信官方服务器的回调
└── versions

```
