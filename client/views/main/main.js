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
        '极速注册': 'jisu',        
        '电商公司': 'dianshang',              
        '教育公司': 'jiaoyu',        
        '金融信息公司': 'jingrong', 
        '移动互联网公司': 'hulianwang',
        '文化传媒公司': 'wenhua',
        '商务服务公司': 'shangwu',
        '建筑设计公司': 'jianzhu',
        '医疗公司': 'yiliao',
        '银行开户': 'icon_bank',
        '财务代理': 'icon_finance',
        '流量记账包服务套餐': 'icon_packpage',
        '小企社保': 'icon_assurance'
    }[this.name];
    if(img) {
      img = '/images/icon/'+img+'.png';
    }
    else {
        img = 'http://fpoimg.com/296x296'; 
//      img = 'http://lorempixel.com/296/296/';
    }
    return img;
  }
});