Push = new Mongo.Collection("Push");
Push.attachSchema(new SimpleSchema({
  category: {
    type: String,
    label:"推送类型",
    //index: 1,
    //unique: true,
    
    autoform: {
      type: "select2",
      afFieldInput: {
        firstOption: "(请选择注册区域)"
      },
      options: function () {
        return [
          {label: "0101-订单确认", value: "0101"},
          {label: "0201-查名材料", value: "0201"},
          {label: "0301-名称提交", value: "0301"},
          {label: "0401-名称通过", value: "0401"},
          {label: "0501-工商材料", value: "0501"},
          {label: "0601-工商签字", value: "0601"},
          {label: "0701-工商送审", value: "0701"},
          {label: "0801-工商出证", value: "0801"},
          {label: "0901-证章快递", value: "0901"},
          {label: "1001-银行开户", value: "1001"},
          {label: "1101-开户领取", value: "1101"},
          {label: "1201-财务推荐", value: "1201"}
        ];
      }
    }
  },
  content: {
    type: String,
    label: "推送内容",
    autoform: {
      rows: 15
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



//Meteor.publish(null, function () {
//  return Push.find();
//});

//Push.allow({
//  insert: function () {
//    return true;
//  },
//  remove: function () {
//    return true;
//  }
//});