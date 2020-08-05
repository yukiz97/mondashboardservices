$(document).ready(function(){	
	$('input').keypress(function search(e) {
	  if (e.which == 13) {
			var value = $(this).val();
			switch ($(this).attr("filter")) {
				case "srcport":
					if((!isNaN(parseInt(value)) || value=="-") && value != ""){
						addToArrayFilterType("srcport",parseInt(value),filterSrcport);
					} else {
						swal("Không thành công!", "Giá trị phải là số nguyên hoặc -", "error");
					}
				break;
				case "dstport":
					if((!isNaN(parseInt(value)) || value=="-") && value != ""){
						addToArrayFilterType("dstport",value,filterDstport);
					} else {
						swal("Không thành công!", "Giá trị phải là số nguyên hoặc -", "error");
					}
				break;
			}
			$(this).val("");
	  }
	});
	
	$("#modal-filter").on("click",".filter-type-display button",function(){
		switch ($(this).attr("filter")) {
				case "srcport":
					filterSrcport.splice(filterSrcport.indexOf($(this).attr("filter-value")), 1);
				break;
				case "dstport":
					filterDstport.splice(filterDstport.indexOf($(this).attr("filter-value")), 1);
				break;
				case "signame":
					filterSigname.splice(filterSigname.indexOf($(this).attr("filter-value")), 1);
				break;
				case "classification":
					filterClassification.splice(filterClassification.indexOf($(this).attr("filter-value")), 1);
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
				case "priority":
					filterPriority = [];
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
				case "priority":
				if(active=="true"){
					filterPriority.splice(filterPriority.indexOf(value), 1);
				} else {
					filterPriority.push(value);
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
	});
	$("#signame select").select2({
		width: '100%'
	});
	$("#classification select").select2({
		width: '100%'
	});
	$("#filter-location div[combobox='left'] select").select2({
		width: '100%'
	});
	$("#filter-location div[combobox='right'] select").select2({
		width: '100%'
	});
	$("#add-left-to-right").on("click",function(){
		var valueFrom = $("#filter-location div[combobox='left'] select option:selected").val();
		var captionFrom = $("#filter-location div[combobox='left'] select option:selected").text();
		
		var valueTo = $("#filter-location div[combobox='right'] select option:selected").val();
		var captionTo= $("#filter-location div[combobox='right'] select option:selected").text();
		var valueFilter = valueFrom+"-"+valueTo;
		
		if(valueFrom=="all" && valueTo=="all"){
			return;	
		}else if(filterLocation.includes(valueFilter)){
			swal("Không thành công!", "Giá trị đã tồn tại trong bộ lọc!", "error");
			return;
		}
		if(valueFrom=="all"){
			filterLocationDesAll.push(valueTo);
		} else if(valueTo=="all"){
			filterLocationSrcAll.push(valueFrom);
		}
		var strDisplay = "<div class='row location-filter-result'>"
			+"<hr>"
			+"<div class='col-md-5'><span>"+captionFrom+"</span></div>"
			+"<div class='col-md-1'>"
				+"<i class='fa fa-arrow-right'></i>"
			+"</div>"
			+"<div class='col-md-5'><span>"+captionTo+"</span></div>"
			+"<div class='col-md-1'>"
				+"<button from='"+valueFrom+"' to='"+valueTo+"' value-filter='"+valueFilter+"'>"
					+"<i class='fa fa-remove'></i>"
				+"</button>"
			+"</div>"
		+"</div>";
		filterLocation.push(valueFilter);
		$("#filter-location .result").append(strDisplay);
	});
	$("#add-signame").on("click",function(){
		var value = $("#signame select option:selected").val();
		
		addToArrayFilterType("signame",value,filterSigname);
	});
	$("#add-classification").on("click",function(){
		var value = $("#classification select option:selected").val();
		
		addToArrayFilterType("classification",value,filterClassification);
	});
	
	$("body").on("click",".location-filter-result button",function(){
		var from = $(this).attr("from");
		var to = $(this).attr("to");
		
		if(from=="all"){
			filterLocationDesAll.splice(filterLocationDesAll.indexOf(to), 1);
		} else if(to=="all"){
			filterLocationSrcAll.splice(filterLocationSrcAll.indexOf(to), 1);
		}

		$(this).closest(".location-filter-result").remove();
		filterLocation.splice(filterLocation.indexOf($(this).attr("value-filter")), 1);	
	});
	
	$("body").on("click",".filter-row",function(){
		var filterId = $(this).attr("filter-id");
		var value = $(this).attr("value-filter");
		switch (filterId) {
			case 'srcport':
				addToArrayFilterType(filterId,value,filterSrcport);
			break;
			case 'dstport':
				addToArrayFilterType(filterId,value,filterDstport);
			break;
			case 'signame':
				addToArrayFilterType(filterId,value,filterSigname);
			break;
			case 'classification':
				addToArrayFilterType(filterId,value,filterClassification);
			break;
			case 'filter-location':
				var direction = $(this).attr("direction");
				var srcId;
				var desId;
				console.log(direction);
				if(direction=="from"){
					srcId = $(this).attr("idsrc");
					desId = "all";
				} else if(direction=="to"){
					srcId = "all";
					desId = $(this).attr("iddes");
				}
				
				$("#filter-location div[combobox='left'] select").val(srcId);
				$("#filter-location div[combobox='right'] select").val(desId);
				
				$("#add-left-to-right").trigger("click");
			break;
			case 'protocol':
			case 'action':
			case 'priority':
				$(".btn-filterchoose[filter='"+filterId+"'][value-filter='"+value+"']").trigger("click");
			break;
		}
		
		if(realtime){
			$("#btn-realtime").trigger("click");
		} else {
			$("#btn-replay").trigger("click");
		}
	});

	function addToArrayFilterType(id,value,array){
		if(array.includes(value)){
			swal("Không thành công!", "Giá trị đã tồn tại trong bộ lọc!", "error");
			return;
		}
		array.push(value);
		var displayBlock = "<div class='filter-type-display'><span>"+value+"</span><button filter='"+id+"' filter-value='"+value+"'><i class='fa fa-remove'></i></button></div>"
		$("#"+id+" .result-type").prepend(displayBlock);
	}
});