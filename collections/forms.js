//为预约单填写备注
inquiryReply = new Mongo.Collection("inquiryReply");
inquiryReply.attachSchema(new SimpleSchema({
  replyMethod: {
		type: [String],
		label:"联系方式",
    //optional: true,
		autoform: {
      type: "select-checkbox-inline",
		  options: function () {
			 return [
			  {label: "已电话联系客户", value: "1"},
			  {label: "已短信联系客户", value: "2"},
			  {label: "已微信联系客户", value: "3"}
			 ];
		  }
		}
  },
  inquiryCategory: {
		type: String,
		label:"客户性质",
		autoform: {
		  options: function () {
			 return [
			  {label: "有效客户", value: "1"},
			  {label: "同行咨询", value: "2"},
			  {label: "广告", value: "3"}
			 ];
		  }
		}
  },
  replyDatetime: {
    type: String,
    label:"联系时间",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        timezoneId: "Asia/Chongqing"
      }
    }
  },
  descriptions: {
    type: String,
	  label:"备注",
    min: 20,
    max: 1000,
    autoform: {
      rows: 5
    }
  },
  inquiryId: {
    type: String,
    label:" ",
    //optional: true,
    autoform: {
      afFieldInput: {
        type: "hidden"
      }
    }
  }
}));

//更新订单状态
orderUpdate = new Mongo.Collection("orderUpdate");
orderUpdate.attachSchema(new SimpleSchema({
    typeTest: {
      type: Boolean,
      defaultValue: true,
      label: "流程1"
   },
   typeTest2: {
      type: Boolean,
      defaultValue: true,
      label: "流程2"
   },
   typeTest3: {
      type: Boolean,
      defaultValue: true,
      label: "流程3"
   },
   typeTest4: {
      type: Boolean,
      defaultValue: true,
      label: "流程4"
   },
   typeTest5: {
      type: Boolean,
      defaultValue: true,
      label: "流程5"
   },
   typeTest6: {
      type: Boolean,
      defaultValue: true,
      label: "流程6"
   },
   typeTest7: {
      type: Boolean,
      defaultValue: true,
      label: "流程7"
   }
  
}));

