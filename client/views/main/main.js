//  产品中心

// Template.main.onRendered(function () {
// 	Meteor.call('getFollowersInfo', function (error, result) {console.log('get flowers info', error, result)});
// });



Template.main.helpers({
	productid: function () {
		return '123';
	},
  _img: function(name){
    return kylUtil.getImg(name);
  }
});