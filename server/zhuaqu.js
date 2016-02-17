Meteor.methods({
	zhuaqu:function (keywords, captcha) {
		console.log(keywords);
		console.log(captcha);
		var data1,data2;
		//1.get session token
		var result1 = HTTP.call("GET", "http://www.sgs.gov.cn/notice/home", data1, function(err, result){
			if (!err){
				$ = cheerio.load(result.content);
				var session_token = $("input[name='session.token']").val();
				console.log(session_token);
				var result2 = HTTP.call("GET","http://www.sgs.gov.cn/notice/search/ent_info_list?searchType=1&captcha="+captcha+"&condition.keyword="+keywords+"&session.token="+session_token, data2, function(err, result){
					console.log(result.content);
				})
			}
			
		});
		//console.log(result);
		return "ok";
	}
})