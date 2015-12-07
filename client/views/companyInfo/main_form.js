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

        var index = 1;
        $("#alternativeName").find("input").each(function(id, element){
            var name = $(element).val() || "";
            if (name) {
                companyName["alternativeName" + index] = name;
                index += 1;
            }
        })

        var compType = $("#compType").html().trim() || "有限责任公司";
        updateOrder({companyName: companyName, companyType: compType});
    }
});


//////////////////////////////////////////////////////////////
// 类型及经营范围
//////////////////////////////////////////////////////////////
Template.scope_segement.helpers({
    pageNames: function() {
        var pageNames = [{          
            name: 'scope_segement_widget4',
            data: this
        }, {              
            name: 'exchangeScopeSegement',
            data: this  
        }, {          
            name: 'scope_segement_widget3',
            data: this
        }, {          
            name: 'scope_segement_board',
            data: this
        }, {
            name: 'scope_segement_widget1',
            data: this
        }, {
            name: 'scope_segement_widget2',
            data: this
        }];
        return pageNames;
    },
});

Template.scope_segement.swingToNext=function(swingObject){
  swingObject.unlockSwipeToNext();
  swingObject.slideNext();
  swingObject.lockSwipeToNext();
  $('body').animate({scrollTop:0},600);
}

Template.scope_segement.swingToPrev=function(swingObject){
  swingObject.unlockSwipeToPrev();
  swingObject.slidePrev();
  swingObject.lockSwipeToPrev();
  $('body').animate({scrollTop:0},600);
}

Template.scope_segement.swingToNextStep=function(swingObject){
   if(swingObject.progress>0.5) {
     Template.scope_segement.swingToNext(swingObject);
   }
   else {
     Template.scope_segement.swingToPrev(swingObject);
   }
    
}

Template.scope_segement.swingToBack=function(swingObject){
  swingObject.unlockSwipeToPrev();
  swingObject.unlockSwipeToNext();
  swingObject.slideTo(3);
  $('body').animate({scrollTop:0},600);
  swingObject.lockSwipeToPrev();
  swingObject.lockSwipeToNext();  
}

Template.scope_segement.onRendered(function(){
    var autoSwiper = new Swiper ('.swiper-container', {
      initialSlide: 3,
      loop:false,
      autoHeight: true,
      watchSlidesProgress : true
    });
    autoSwiper.lockSwipeToNext();
    autoSwiper.lockSwipeToPrev();
  
    //选择行业
    $("#step").click(function(){
       Template.scope_segement.swingToNext(autoSwiper);
       return false;
    });
    //调整行业
    $("#exchangeBtn").click(function(){
        if (Session.get('industryBig') && Session.get('industrySmall')) {
           Template.scope_segement.swingToPrev(autoSwiper);
        } else {
            kylUtil.alert("请先选择行业类型");
        }
       return false;
    });
    
    $(document).on("click",".scope_segement_widget1 .module",function(){
        // industryBig
        var industryBig = $(this).find(".single").first().text().trim() || "";
        Session.set('industryBig', industryBig);
        Template.scope_segement.swingToNext(autoSwiper);      
    });
      
    $(document).on("click",".scope_segement_widget2 .module",function(){
        // industrySmall
        var industrySmall = $(this).find(".single").first().text().trim() || "";
        Session.set("industrySmall", industrySmall);
        var industryBig = Session.get("industryBig");

        var scopes = Business.findOne({industryBig: industryBig, industrySmall: industrySmall}) || {};
        Session.set("businessScope", scopes.content || []);


        Template.scope_segement.swingToBack(autoSwiper);
    });

    $(".scope_segement_widget3 #submitBtn").click(function(){
        Template.scope_segement.swingToBack(autoSwiper);
    });
    
    $(".scope_segement_widget3 #addBtn").click(function(){
        Template.scope_segement.swingToPrev(autoSwiper);
    });
  
    $(document).on("click",".exchangeScopeSegement .module",function(){
        var businessSmall = $(this).find(".single").first().text().trim() || "";
        Session.set("businessSmall", businessSmall);
        Template.scope_segement.swingToPrev(autoSwiper);
    });     

    $(".scope_segement_widget4 #submitBtn").click(function(){
        autoSwiper.unlockSwipeToNext();
        autoSwiper.slideTo(2);
        autoSwiper.lockSwipeToNext();
        $('body').animate({scrollTop:0},600);
    }); 
});


Template.scope_segement_board.helpers({
    industryBigStr: function (industryBig) {
        Session.setDefault('industryBig', industryBig || "");
        return Session.get('industryBig') || "--";
    },
    industrySmallStr: function (industrySmall) {
        Session.setDefault('industrySmall', industrySmall || "");
        return Session.get('industrySmall') || "--";
    },
    scopeStr: function(businessScope) {
        Session.setDefault('businessScope', businessScope || "");       
        return Session.get('businessScope') || "";
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

        updateOrder({
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
        return Session.get('businessScope') || [];
    }
});

Template.scope_segement_widget3.events({
    "click #submitBtn": function () {
        var scopeChecked = [];
        $('input[type="checkbox"]').each(function(index, element) {
            if ($(element).prop("checked")) {
                console.log("$(element).val()", $(element).val());
                var str = $(element).val();
                if (scopeChecked.indexOf(str) < 0) {
                    scopeChecked.push(str);
                }
            }
        });

        if (scopeChecked.length == 0) {
            kylUtil.alert("请至少选择一项经营范围!");
            return;
        }
        console.log("widget3", scopeChecked);
        Session.set('businessScope', scopeChecked);        
    }
});


// 调整经营范围 类型
Template.exchangeScopeSegement.onRendered(function () {
    // set default 
    var businessBig = $('.ui-tab .active .addScopeSel').html().trim() || "";
    Session.set('businessBig', businessBig);
});

Template.exchangeScopeSegement.helpers({
    scopeChange: function () {
        return Business1.find({}).fetch();
    },
    businessSmall_0: function () {
        return Business1.find({}).fetch()[0].businessSmall;
    },
    businessSmall_1: function () {
        return Business1.find({}).fetch()[1].businessSmall;
    },
});

Template.exchangeScopeSegement.events({
    'click #box_tab0 .single': function (event, template) {
        console.log("box_tab0", $(event.currentTarget).context.innerText );
    },
    'click #box_tab1 .single': function (event, template) {

    },
    'click .ui-tab .tab': function(e) {
        var self = $(e.currentTarget);
        self.addClass("active").siblings().removeClass("active");

        var businessBig = $('.ui-tab .active .addScopeSel').html().trim() || "";
        Session.set('businessBig', businessBig);
    }
});

// 增加经营范围
Template.scope_segement_widget4.helpers({
    isSeled: function (str) {
        var businessScope = Session.get("businessScope") || [];
        if (businessScope.indexOf(str) >= 0){
            return "checked";
        }
        return "";
    },
    scopes: function () {
        var businessBig = Session.get("businessBig");
        var businessSmall = Session.get("businessSmall");

        var scopeInfo = Business1.findOne({businessBig: businessBig, "businessSmall.cate": businessSmall}) || {};
        var info = scopeInfo.businessSmall || [];
        for (key in info) {
            if (info[key].cate == businessSmall) {
                return info[key].content || [];
            }
        }

        return [];
    }
});

Template.scope_segement_widget4.events({
    "click #submitBtn" : function () {
        var businessScope = Session.get("businessScope") || [];
        $('input[type="checkbox"]').each(function(index, element) {
            var str = $(element).val() || "";
            var checked = $(element).prop("checked");
            var index = businessScope.indexOf(str);
            if (str && checked && index < 0) {
                businessScope.push(str);
            }

            if (str && !checked && index >= 0) {
                businessScope.pop(index);
            }
        });
        console.log("widget4 save", businessScope);

        Session.set("businessScope", businessScope);
    }
})




//////////////////////////////////////////////////////////////
// 注册资金与股东信息
//////////////////////////////////////////////////////////////
Template.resource_segement.events({
    'click #saveBtn': function () {
        var companyMoney = $("#money").val() || "";
        if (!companyMoney && !parseInt(companyMoney) ) {
            kylUtil.alert("请正确填写注册资金");
            return;
        }

        var holders = [];
        var moneyAll = 0;
        var percentAll = 0;
        var ret_status = [true, 'ok'];
        var holdersCode = [];

        console.log("resource_segement saveBtn");
        var holderTemplate = $(".hodlerSpace .content");
        holderTemplate.each(function (index, elem) {
            var selectType = parseInt($(elem).attr("holder") || "998");
            console.log("fsdfsdf", selectType);
            var holderType = "";
            if (selectType == 0) {
                holderType = "自然人";
            } else if (selectType == 1) {
                holderType = "企业";
            } else {
                kylUtil.alert("数据错误");
                return;
            }

            var holderName = $(elem).find('#name').val() || "";
            var money = $(elem).find('#money').val() || "";
            var moneyPercent = $(elem).find('#percent').val() || "";
            moneyInt = parseInt(money);
            percentInt = parseInt(moneyPercent);

            if ( holderName 
                && moneyInt && moneyInt >= 0  
                && percentInt && percentInt > 0 && percentInt <= 100) {

                var holder = {
                    selectType: selectType,
                    holderType: holderType,
                    holderName: holderName,
                    money: money,
                    moneyPercent: moneyPercent,
                    holderId: kylUtil.randomNumber(10)
                }


                if (selectType == 0) {
                    var sex = $(elem).find('#sexSel').val() || "";
                    var code = $(elem).find('#code').val() || "";
                    var address = $(elem).find('#address').val() || "";

                    if (sex && code && address) {
                        if (!kylUtil.verifyIDCard(code)) {
                            ret_status = [false, "股东身份证信息有误"];
                            return;
                        }

                        if (holdersCode.indexOf(code) >= 0) {
                            ret_status = [false, "股东不可重复"];
                            return;
                        }
                        holdersCode.push(code);

                        holder.sex = sex;
                        holder.code = code;
                        holder.address = address;
                    } else {
                        ret_status = [false, "请填入有效信息"];
                        return;
                    }
                }

                moneyAll += moneyInt;
                percentAll += percentInt;
                holders.push(holder);

            } else {
                ret_status = [false, '请填入有效信息'];
                return;
            }
        });
        
        if (!ret_status[0]) {
            kylUtil.alert(ret_status[1]);
            return;
        }

        if (holders.length == 0) {
            console.log("ret_status", ret_status, holders.length, holders);
            kylUtil.alert("请填写有效股东信息");
            return;
        }

        if (moneyAll > parseInt(companyMoney)) {
            kylUtil.alert("股东出资总额不得大于注册资金");
            return;
        }

        if (percentAll > 100) {
            kylUtil.alert("股东占股比例总和不得大于100%");
            return;
        }

        updateOrder({companyMoney: companyMoney, holders: holders});
    },
    'click #plus': function() {
        Template.layoutTemplate.select({
            title: "选择股东类型", 
            options: [{name: "自然人", value: 0}, {name: "企业", value: 1}]
        }).on(function (ret, selVal) {
            if (ret) {
                console.log("fuck sel", selVal, typeof(selVal));

                var template = Blaze.toHTMLWithData(Template.shockhoderInputBundle, {selectType: parseInt(selVal)});
                $("#plus-content").append(template);                
            }
        });
    },
    'click i.icon.trash': function(e) {
        $(e.currentTarget).closest(".module").remove();
    }
});

Template.shockhoderInputBundle.helpers({
    theSex: function (sexNow, sexStr) {
        console.log("thesex", sexNow, sexStr);
        if ((sexNow && sexStr && (sexNow == sexStr))) {
            return "selected"
        }
        return "";
    }
});


//////////////////////////////////////////////////////////////
// 法人与监事
//////////////////////////////////////////////////////////////
Template.manager_segement.events({
    'click #saveBtn': function (event, template) {
        var legalPersonName = $("#legalPersonName").val().trim() || "";
        var legalPersonId = $("#legalPersonId").val().trim() || "";

        var supervisorName = $("#supervisorName").val().trim() || "";
        var supervisorId = $("#supervisorId").val().trim() || "";
        if (!legalPersonName || !legalPersonId || !supervisorName || !supervisorId) {
            kylUtil.alert("所填项不可为空");
            return;
        }
        if (!kylUtil.verifyIDCard(legalPersonId) || !kylUtil.verifyIDCard(supervisorId)) {
            kylUtil.alert("输入身份证信息非法");
            return;
        }

        // 法人 != 监事
        if (supervisorId == legalPersonId) {
            kylUtil.alert("企业法人与监事不可为同一人");
            return;
        }

        // 财务 ！= 法人 监事 股东
        var orderInfo = template.data;
        var verif = judgeFinaWithOthers( orderInfo, {otherId: [supervisorId, legalPersonId]})
        if (!verif) {
            kylUtil.alert("企业的监事、法人不可与财务为同一人");
            return;
        }

        updateOrder({
            legalPerson: {
                legalPersonName: legalPersonName,
                legalPersonId: legalPersonId
            },
            supervisor: {
                supervisorName: supervisorName,
                supervisorId: supervisorId
            }
        });
    }
});


//////////////////////////////////////////////////////////////
// 财务负责人与经办人
//////////////////////////////////////////////////////////////
Template.others_segement.events({
    'click #saveBtn': function (event, template) {
        var finaName = $("#finaName").val().trim() || "";
        var finaId = $("#finaId").val().trim() || "";
        var finaPhone = $("#finaPhone").val().trim() || "";
        var finaEmail = $("#finaEmail").val().trim() || "";

        var liaName = $("#liaName").val().trim() || "";
        var liaId = $("#liaId").val().trim() || "";
        var liaPhone = $("#liaPhone").val().trim() || "";
        var liaEmail = $("#liaEmail").val().trim() || "";

        var contractor = {};
        var callBack = false;

        // 企业联络人
        if (!liaName || !liaId || !liaPhone || !liaEmail) {
            kylUtil.alert("所填项不可为空");
            return;
        }

        if (!kylUtil.verifyIDCard(liaId)) {
            kylUtil.alert("企业联络人身份证信息非法");
            return;
        }

        var liaisons = {
            liaisonsName: liaName,
            liaisonsId: liaId,
            liaisonsPhone: liaPhone,
            liaisonsEmail: liaEmail
        }
        contractor.liaisons = liaisons;
       

        // 财务负责人
        if (!finaName || !finaId || !finaPhone || !finaEmail) {
            kylUtil.alert("所填项不可为空");
            return;
        }

        if (!kylUtil.verifyIDCard(finaId)) {
            kylUtil.alert("财务负责人身份证信息非法");
            return;
        }

        var orderInfo = template.data;
        var verif = judgeFinaWithOthers(orderInfo, {finaId: finaId});
        if (!verif) {
            kylUtil.alert("财务负责人不可与股东、监事、法人为同一人");
            callBack = function () {};
        } else {
            var financialStaff = {
                financialStaffName: finaName,
                financialStaffId: finaId,
                financialStaffPhone: finaPhone,
                financialStaffEmail: finaEmail
            }
            contractor.financialStaff = financialStaff;            
        }

        updateOrder({
            contractor: contractor
        }, callBack);
    }
});



//////////////////////////////////////////////////////////////
// 资料对接人
//////////////////////////////////////////////////////////////
Template.contractor_segement.events({
    'click #saveBtn': function (event, template) {
        var consName = $("#consName").val().trim() || "";
        var consPhone = $("#consPhone").val().trim() || "";
        var consEmail = $("#consEmail").val().trim() || "";
        var consQQ = $("#consQQ").val().trim() || "";

        if (!consName || !consPhone || !consEmail) {
            kylUtil.alert("所填项不可为空");
            return;
        }

        updateOrder({
            consigner: {
                consignerName: consName,
                consignerPhone: consPhone,
                consignerEmail: consEmail,
                consignerQQ: consQQ
            }
        });
    }
});

/*
 * 判断 财务 ！= 法人 监事 股东
 * @param info格式 {finaId: 财务id}、 {otherId: 法人 or 监事 or 股东 id}
 */
function judgeFinaWithOthers(orderInfo, info) {
    if (!orderInfo) {
        console.log("judgeFinaWithOthers orderInfo not found");
        return false;
    }

    var handle = {
        finaId: function (cid) {
            if (!cid) {
                return false;
            }

            // 法人
            var legalPerson = orderInfo.legalPerson;
            if (legalPerson && legalPerson.legalPersonId 
                && legalPerson.legalPersonId == cid) {
                return false;
            }

            // 监事
            var supervisor = orderInfo.supervisor;
            if (supervisor && supervisor.supervisorId 
                && supervisor.supervisorId == cid) {
                return false;
            }

            // 股东
            var holders = orderInfo.holders || [];
            if (holders) {
                for (holder in holders) {
                    if (holder.holderId == cid) {
                        return false;
                    }
                }
            }
            return true;
        },
        otherId: function (cids) {
            if (!cids) {
                return false;
            }

            var contractor = orderInfo.contractor;
            if (contractor && contractor.financialStaff) {
                var financialStaff = contractor.financialStaff;
                var finId = financialStaff.financialStaffId || "";
                if (!Array.isArray(cids)) {
                    cids = [cids];
                }

                for (cid in cids) {
                    if (finId == cid) {
                        return false;
                    }
                }
            }

            return true;
        }
    };

    for (key in info) {
        return handle[key](info[key]);
    }
}



function updateOrder(info, callBack) {
    var orderId = Router.current().params.query.orderid || "";
    if (!orderId) {
        kylUtil.alert("数据错误，请退出重登!");
        return;
    }


    Meteor.call("updateOrder", orderId, info
        , function (err, ret) {
        if (err)  {
            kylUtil.alert(err.message);
        } else {
            console.log("save order info OK", ret);
            if (callBack) {
                callBack();
            } else {
                Router.go('companyInfo', {}, {query: 'orderid=' + orderId});
            }
        }
    });
}

