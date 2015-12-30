Template.shockholder.helpers({
	holder: function () {
		var orderInfo = this || {};
		holders = orderInfo.holders || {};
		var holderId = Router.current().params.query.holderId;
		if (orderInfo && holderId) {
			for(key in holders) {
				var info = holders[key] || {};
				if (info.holderId == holderId) {
					return info;
				}
			}
		}

		return {};
	}
});