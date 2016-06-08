Template.products.helpers({
    productsDes: function() {
        var type = Router.current().params.products;
        return kylUtil.getProductsDes(type);
    },
	_img: function (name) {
		return kylUtil.getImg(name);
	},
    _des: function (name) {
        return kylUtil.getBriefDes(name);
    }
});
