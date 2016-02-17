Lists = new Mongo.Collection("list");
Lists.attachSchema(new SimpleSchema({
  //基础字段
  openid: {type: String},
  create_time: {type: Date},
  update_time: {type: Date},
  //行业
  industryBig: {type: String, optional: true},
  industrySmall: {type: String, optional: true},
  businessScope: {type: [String], label: "已选择的经营范围", optional: true},
  //清单
  zj_num: {type: Number, label:" "},
  gd_infor: {type:Array,label:"股东信息",minCount:0,maxCount:5},
  "gd_infor.$": {type: Object},
  "gd_infor.$.name": {type: String,label:"姓名"},
  "gd_infor.$.quantity": {type: Number,label:"股权比例%",decimal: true,autoform: {step: "0.01"}},
  //字号
  companyName1: {type: String,optional:true,label:"字号1"},
  companyName2: {type: String,optional:true,label:"字号2"},
  companyName3: {type: String,optional:true,label:"字号3"},
  companyName4: {type: String,optional:true,label:" "},
  companyName5: {type: String,optional:true,label:" "},
  companyName6: {type: String,optional:true,label:" "},
  companyName7: {type: String,optional:true,label:" "},
  companyName8: {type: String,optional:true,label:" "},
  companyName9: {type: String,optional:true,label:" "},
  handled: {type: Boolean, optional: true}
   
}))

Lists.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  }
});