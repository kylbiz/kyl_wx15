Meteor.methods({
	createList: function (openid) {
		var list = Lists.findOne({openid: openid});
		if (!list){
			Lists.insert({
				openid: openid,
				industryBig: "科技类",
				industrySmall: "信息科技",
				zj_num: "100",
				gd_infor: [],
				create_time: new Date(),
				update_time: new Date(),
        handled: false
			});
		}
		
	},
	chooseIndustry: function(industrySmall, openid) {
		if(industrySmall) {
			industryContent = Business.findOne({industrySmall: industrySmall}).content;
			industryContentArray = industryContent.split("、");
			industryBig = Business.findOne({industrySmall: industrySmall}).industryBig;
		}

		Lists.update({
			openid: openid
		},{
			$set: {
				industryBig: industryBig,
				industrySmall: industrySmall,
				businessScope: industryContentArray,
				update_time: new Date()
			}
		})
	},
	addCompanynames: function (companynames, openid) {
		Lists.update({
			openid: openid
		},{
			$set: {
				companynames: companynames,
				update_time: new Date()
			}
		})
	}
})