//预约公司注册
inquiryCorpreg = new Mongo.Collection('inquiryCorpreg');

inquiryCorpreg.attachSchema(new SimpleSchema({
  mobilephone: {
    type: String,
    label: " ",
    min: 11,
    max: 11
  },
  area: {
    type: String,
    label: " ",
    //defaultValue: "虹口区",
    autoform: {
      type: "select",
      afFieldInput: {
        firstOption: "(请选择注册区域)",
      },
      options: function () {
        return [
          {label: "虹口区", value:"虹口区"},
          {label: "杨浦区", value: "杨浦区"},
		      {label: "浦东新区", value: "浦东新区"},
          {label: "普陀区", value: "普陀区"},
		      {label: "奉贤区", value: "奉贤区"},
		      {label: "松江区", value: "松江区"}
        ];
      }
    }
  },
  openid: {
    type: String,
    optional: true,
    label: " "
  },
  createTime: {
    type: Date,
    label: "",
    autoValue: function() {
      return new Date();
    }
  }
}));

inquiryCorpreg.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  }
});

//预约银行开户
inquiryBankaccount= new Mongo.Collection("inquiryBankaccount");
inquiryBankaccount.attachSchema(new SimpleSchema({
  mobilephone: {
    type: String,
    label: " ",
    min: 11,
    max: 11
  },
  bank: {
    type: String,
    autoform: {
      type: "select",
      afFieldInput: {
        firstOption: "(请选择开户银行)"
      },
      options: function () {
        return [
          {label: "中国银行", value:"中国银行"},
		      {label: "招商银行", value:"招商银行"}
        ];
      }
    }
  },
  openid: {
    type: String,
    optional: true,
    label: " "
  },
  createTime: {
    type: Date,
    label: "",
    autoValue: function() {
      return new Date();
    }
  }
}));

inquiryBankaccount.allow({
  insert: function(){
    return true;
  }
});

//预约财务代理
inquiryBookkeeping= new Mongo.Collection("inquiryBookkeeping");
inquiryBookkeeping.attachSchema(new SimpleSchema({
  mobilephone: {
    type: String,
    label: " ",
    min: 11,
    max: 11
  },
  category: {
    type: String,
    autoform: {
      type: "select",
      afFieldInput: {
        firstOption: "(请选择记账服务)"
      },
      options: function () {
        return [
          {label: "小规模", value: "小规模"},
		      {label: "一般纳税人", value:"一般纳税人"}
        ];
      }
    }
  },
  openid: {
    type: String,
    optional: true,
    label: " "
  },
  createTime: {
    type: Date,
    label: "",
    autoValue: function() {
      return new Date();
    }
  }
}));

inquiryBookkeeping.allow({
  insert: function(){
    return true;
  }
});