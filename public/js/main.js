// JavaScript Document

$(document).ready(function(){
 
 	  $("#myModal").modal("show");

	 //新增股东
	  $("#addShareholder").click(function(evt){
		  evt.preventDefault();
	  
		  $(".addShareholder").append(
		  	"<div class='row mt20'>" + 
				"<div class='col-xs-5'>" +
					"<label>股东姓名</label>" +
					"<input type='input' class='form-control' name='gdname' />" +
				"</div>" +
				"<div class='col-xs-5'>" +
					"<label>股权比例</label>" +
					"<div class='input-group'>"+
						"<input style='ime-mode: disabled;' maxlength='5' min='0' max='100'"+
						"onkeyup='CheckKeyUp(this)' type='input' class='form-control' name='gdinfor'/>" +
						"<span class='input-group-addon'>%</span>" +
					"</div>" +
				"</div>" +
				"<div class='col-xs-2'>" + 
					"<a href='javascript:void(0);' class='del-list'>" +
						"<span class='flaticon flaticon-light12'></span>" +
					"</a>" +
				"</div>" +
			"</div>"
		  );
		  
	   $(".del-list").click(function(){
		  		$(this).parents(".row").remove();
		  })
	  });
	  
	  $(".del-list").click(function(){
		  		$(this).parents(".row").remove();
		  })

	  


	
	
	//监事修改
	$(".jsBtn").click(function(){
		alert($("#jsName").val());
		$("#jsOpen").addClass("hide");
		});
		
	
	//日历点击添加样式
	$(".calendar td.doTxt").click(function(){
		//alert($(this).parents("tbody").children("tr").children("td.doTxt").length);
		$(this).parents("tbody").children("tr").children("td.doTxt").removeClass("curTxt");
		$(this).addClass("curTxt");
		})
	  
});


//判断股东比例输入框为数字和小数并小数点后留2位
function CheckKeyUp(obj)  
{  
   obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
   obj.value = obj.value.replace(/^\./g,"");  //验证第一个字符是数字而不是.  
   obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
   obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
   obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
   
   //判断输入股东比例是否大于100
   var CheckInput = obj.value;
   if(CheckInput>100){
	   alert("股权比例不能超过100%，请您修改");
	   }
} 


//验证清单页面
function validateForm(){
	//公司字号不能为空  
	var qyname=document.getElementsByName("fname");
	  for(var i=0;i<qyname.length;i++)
	  {
		  if(qyname[i].value==''){
				alert('公司字号不能为空');	
				return false;
			}
	  }
	  
	 //法人或股东姓名不能为空
	 var gdname=document.getElementsByName("gdname");
	  for(var i=0;i<gdname.length;i++)
	  {
		  if(gdname[i].value==''){
				alert('法人或股东姓名不能为空');	
				return false;
			}
	  } 
	 
	  
	  //股权比例不能为空AND股权比例所有的值加起来必须刚好等于100%,不能大于100%，也不能小100%
	  var gdinfor=document.getElementsByName("gdinfor");
	  var num=0;
	  for(var i=0;i<gdinfor.length;i++)
	   {
			if(gdinfor[i].value==''){
			  alert('股权比例不能为空');	
			  return false;
			}
		   
		   num+=parseInt(gdinfor[i].value);
		  
	   }
	   
	  if(num != 100){
		 alert("请确保所有的股东比例加起来为100%");
		 return false;
		 }

	 
	 
	 // 注册资金不能为空
	 var zczj=document.forms["myForm"]["zjnum"].value;
	 if (zczj==null || zczj=="")
		{
			alert("注册资金不能为空");
			return false;
		} 
 
  
}
 





//经营范围
function addSel(obj){
	  var checkValue=obj.innerHTML;
	  var scBox=$(obj).parent().parent().attr("id");
	  $(".jyfw-list-cur").append("<div class='col-md-3 col-xs-4'><a href='#' onclick='delSel(this,\"" + scBox + "\")'>"+ checkValue +"</a></div>");
	  $(obj).parent().remove();
	  return false;
  }
  function delSel(obj,parentId){
	  var checkValue=obj.innerHTML;
	  $("#"+parentId).append("<div class='col-md-3 col-xs-4'><a href='#' onclick='addSel(this)'>" + checkValue + "</a></div>");
	  $(obj).parent().remove();
	  return false;
  }
  
  $(".panel-body").children(".jyfw-list").each(function(){
		if ($(this).find('.col-xs-4').length == 0) {
				$(this).append("<div class='col-xs-12'><p>经营范围已经全部选择了</p></div>");
			}else{
				$(this).children(".col-xs-12").hide();
				}
	 })
	 
 


