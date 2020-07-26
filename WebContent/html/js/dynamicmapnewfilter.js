$(document).ready(function(){
	$('input').keypress(function search(e) {
	  if (e.which == 13) {
			var value = $(this).val();
			switch ($(this).attr("filter")) {
				case "sourceip":
					addToArrayFilterType("sourceip",value,filterSourceIP);
				break;
				case "srcport":
					addToArrayFilterType("srcport",value,filterSrcport);
				break;
				case "dstport":
					addToArrayFilterType("dstport",value,filterDstport);
				break;
			}
	  }
	});
	
	$("#modal-filter").on("click",".filter-type-display button",function(){
		console.log(":he");
		switch ($(this).attr("filter")) {
				case "sourceip":
					filterSourceIP.splice(filterSourceIP.indexOf($(this).attr("filter-value")), 1);
				break;
				case "srcport":
					filterSrcport.splice(filterSrcport.indexOf($(this).attr("filter-value")), 1);
				break;
				case "dstport":
					filterDstport.splice(filterDstport.indexOf($(this).attr("filter-value")), 1);
				break;
			}
		$(this).closest(".filter-type-display").remove();
	});
	
	$(".btn-filterchoose").on("click",function(){
		var filter = $(this).attr("filter");
		var value = $(this).attr("value-filter");
		var active = $(this).attr("active");
		
		if(value=="all"){
			switch (filter) {
				case "protocol":
					filterProtocol = [];
				break;
				case "action":
					filterAction = [];
				break;
			}
			$(this).attr("class","btn btn-primary btn-filterchoose");
			$(".btn-filterchoose[filter='"+filter+"'][value-filter!='all']").removeClass("btn-info");
			$(".btn-filterchoose[filter='"+filter+"'][value-filter!='all']").addClass("btn-default");
			$(".btn-filterchoose[filter='"+filter+"'][value-filter!='all']").attr("active","false");
		}else{
			$(".btn-filterchoose[filter='"+filter+"'][value-filter='all']").attr("class","btn btn-default btn-filterchoose");
			switch (filter) {
				case "protocol":
				if(active=="true"){
					filterProtocol.splice(filterProtocol.indexOf(value), 1);
				} else {
					filterProtocol.push(value);
				}
				break;
				case "action":
				if(active=="true"){
					filterAction.splice(filterAction.indexOf(value), 1);
				} else {
					filterAction.push(value);
				}
				break;
			}
			if(active=="true"){
				$(this).attr("active","false");
				
				$(this).removeClass("btn-info");
				$(this).addClass("btn-default");
			} else{
				$(this).attr("active","true");
				
				$(this).removeClass("btn-default");
				$(this).addClass("btn-info");
			}	
		}	
		console.log(filterProtocol);
	});
	
	function addToArrayFilterType(id,value,array){
		array.push(value);
		var displayBlock = "<div class='filter-type-display'><span>"+value+"</span><button filter='"+id+"' filter-value='"+value+"'><i class='fa fa-remove'></i></button></div>"
		$("#"+id+" .result-type").prepend(displayBlock);
	}
});