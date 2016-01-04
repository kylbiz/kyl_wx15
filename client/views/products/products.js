Template.products.helpers({
	_img: function (name) {
		return kylUtil.getImg(name);
	},
    _des: function (name) {
        return kylUtil.getBriefDes(name);
    }
});
