Template.form.helpers({
  _dynamic: function(){
    return Router.current().params.item || "";
  }
});



//////////////////////////////////////////////////////////////
// 企业名
//////////////////////////////////////////////////////////////
Template.name_segement.events({
    'click #saveBtn': function (event, template) {
        var orderId = Router.current().params.query.orderid || "";
        if (!orderId) {
            kylUtil.alert("数据错误，请退出重登!");
            return;
        }

        var companyName = {};
        var mainName = $("#mainName").val() || "";
        if (!mainName) {
            kylUtil.alert("企业首选字号必须填!");
            return;
        }
        companyName.mainName = mainName;

        $("#alternativeName").find("input").each(function(index, element){
            var name = $(element).val() || "";
            if (name) {
                companyName["alternativeName" + (parseInt(index) + 1)] = name;
            }
        })

        updateOrder(orderId, {companyName: companyName});
    }
});


//////////////////////////////////////////////////////////////
// 类型及经营范围
//////////////////////////////////////////////////////////////
Template.scope_segement.helpers({
    pageNames: function() {
        var pageNames = [{
            name: 'scope_segement_board'
        }, {
            name: 'scope_segement_widget1'
        }, {
            name: 'scope_segement_widget2'
        }, {
            name: 'scope_segement_widget3'
        }];
        return pageNames;
    },
});

Template.scope_segement.swingToNext=function(swingObject){
  swingObject.unlockSwipeToNext();
  swingObject.slideNext();
  swingObject.lockSwipeToNext();
}

Template.scope_segement.onRendered(function(){
    var autoSwiper = new Swiper ('.swiper-container', {
      allowSwipeToNext:false,
      loop:false
    });

    $("#step").click(function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;
    });


    $(document).on("click",".scope_segement_widget1 .module",function(){
        // industryBig
        var industryBig = $(this).find(".single").first().text().trim() || "";
        Session.set('industryBig', industryBig);

        Template.scope_segement.swingToNext(autoSwiper);
        $('body').animate({scrollTop:0},600);
        return false;        
    })

    $(document).on("click",".scope_segement_widget2 .module",function(){
        // industrySmall
        var industrySmall = $(this).find(".single").first().text().trim() || "";
        Session.set("industrySmall", industrySmall);

        Template.scope_segement.swingToNext(autoSwiper);
        $('body').animate({scrollTop:0},600);
        return false;        
    })


    $(".scope_segement_widget3 #submitBtn").click(function(){
        autoSwiper.slideTo(0);
        $('body').animate({scrollTop:0},600);
    });
});


Template.scope_segement_board.helpers({
    industryBig: function () {
        Session.setDefault('industryBig', "");
        return Session.get('industryBig') || "--";
    },
    industrySmall: function () {
        Session.setDefault('industrySmall', "");
        return Session.get('industrySmall') || "--";
    },
    scopeStr: function() {
        Session.setDefault('businessScope', "");       
        return Session.get('businessScope') || "--";
    }
});

Template.scope_segement_board.events({
    'click #saveBtn': function () {
        var orderId = Router.current().params.query.orderid || "";
        var industryBig = Session.get('industryBig');
        var industrySmall = Session.get('industrySmall');
        var businessScope = Session.get('businessScope')
        if (!orderId) {
            kylUtil.alert("数据错误，请退出重登!");
            return;
        } else if (!industryBig || !industrySmall || !businessScope) {
            kylUtil.alert("各项请填写完整！");
            return;
        }

        updateOrder(orderId, {
            industryBig: industryBig,
            industrySmall: industrySmall,
            businessScope: businessScope,
        });
    }
});

// 行业大类
Template.scope_segement_widget1.helpers({
    compTypBase: function () {
        return BusinessTypeLists.find({}).fetch() || [];
    }
});
// 行业类别细分
Template.scope_segement_widget2.helpers({
    compTypDetail: function () {
        var industryBig = Session.get('industryBig');
        return Business.find({industryBig: industryBig}).fetch() || [];
    }
})
// 经营范围
Template.scope_segement_widget3.helpers({
    scopes: function () {
        var industryBig = Session.get('industryBig');
        var industrySmall = Session.get('industrySmall');
        var scopesInfo = Business.findOne({industrySmall: industrySmall, industryBig: industryBig}) || {};
        return scopesInfo.content || [];
    }
});

Template.scope_segement_widget3.events({
    "click #submitBtn": function () {
        var businessScope = [];
        $('input[type="checkbox"]').each(function(index, element) {
            var elem = $(element);
            if (elem.prop("checked")) {
                businessScope.push(elem.val());
            }
        });

        if (businessScope.length == 0) {
            kylUtil.alert("请至少选择一项经营范围!");
            return;
        }
        Session.set('businessScope', businessScope);
    }
});


function updateOrder(orderId, info, callBack) {
    Meteor.call("updateOrder", orderId, info
        , function (err, ret) {
        if (err)  {
            kylUtil.alert("数据错误");
        } else {
            console.log("save companyName OK", ret);
            if (callBack) {
                callBack();
            } else {
                Router.go('companyInfo', {}, {query: 'orderid=' + orderId});
            }
        }
    });
}



//////////////////////////////////////////////////////////////
// 注册资金与股东信息
//////////////////////////////////////////////////////////////
Template.resource_segement.events({
    'click #saveBtn': function () {
        var companyMoney = $("#money").val() || "";
        
    },
    'click #plus': function() {
        var template = Blaze.toHTML(Template.shockhoderInputBundle);
        $("#plus-content").append(template);
    },
    'click i.icon.trash': function(e) {
        $(e.currentTarget).closest(".module").remove();
    }
});

