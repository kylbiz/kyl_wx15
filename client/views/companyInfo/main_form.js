Template.form.helpers({
  _dynamic:function(){
    return Router.current().params.item || "";
  }
});

Template.scope_segement.helpers({
  pageNames:function(){
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
  }
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
        var industryBig = $(this).find(".single").first().text() || "";
        console.log("industryBig", industryBig);
        Session.set('industryBig', industryBig);
       Template.scope_segement.swingToNext(autoSwiper);
       return false;        
    })

    $(document).on("click",".scope_segement_widget2 .module",function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;        
    })

    /*
    $(".scope_segement_widget3 #submit").click(function(){
       autoSwiper.slideTo(0);
       return false;
    });
    */
});

Template.resource_segement.events({
  'click #plus':function(){
    var template = Blaze.toHTML(Template.shockhoderInputBundle);
    $("#plus-content").append(template);
  },
  'click i.icon.trash':function(e){
    $(e.currentTarget).closest(".module").remove(); 
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


        Meteor.call("updateOrder", orderId, {companyName: companyName}
            , function (err, ret) {
            if (err)  {
                kylUtil.alert("数据错误");
            } else {
                console.log("save companyName OK", ret);
                Router.go('companyInfo', {}, {query: 'orderid=' + orderId});
            }
        });
    }
});


//////////////////////////////////////////////////////////////
// 类型及经营范围
//////////////////////////////////////////////////////////////
Template.scope_segement.events({

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
        return Business.find({}).fetch() || [];
    }
})