//  产品中心

// Template.main.onRendered(function () {
// 	Meteor.call('getFollowersInfo', function (error, result) {console.log('get flowers info', error, result)});
// });



Template.main.helpers({
	productid: function () {
		return '123';
	},
  _img:function(){
    var img = {
        '1元注册': 'oneyuan',  
        '极速注册': '',        
        '电商公司': '',              
        '教育公司': '',        
        '金融信息公司': '', 
        '移动互联网公司': '',
        '文化传媒公司': '',
        '商务服务公司': '',
        '建筑设计公司': '',
        '医疗公司': '',
        '银行开户': '',
        '财务代理': '',
        '流量计帐包套餐服务': '',
        '小企社保': ''
    }[this.name];
    if(img) {
      img = '/images/'+img+'.png';
    }
    else {
      img = 'http://placehold.it/296x296'; 
    }
    return img;
  }
});