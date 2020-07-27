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
				case "signame":
					if(value != ""){
						addToArrayFilterType("signame",value,filterSigname);
					} else {
						swal("Không thành công!", "Giá trị không được để trống", "error");
					}
				break;
				case "classification":
					if(value != ""){
						addToArrayFilterType("classification",value,filterClassification);
					} else {
						swal("Không thành công!", "Giá trị không được để trống", "error");
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
		var valueFilter = valueFrom+"-"+valueTo
		var strDisplay = "<div class='row location-filter-result'>"
			+"<hr>"
			+"<div class='col-md-5'><span>"+captionFrom+"</span></div>"
			+"<div class='col-md-1'>"
				+"<i class='fa fa-arrow-right'></i>"
			+"</div>"
			+"<div class='col-md-5'><span>"+captionTo+"</span></div>"
			+"<div class='col-md-1'>"
				+"<button value-filter='"+valueFilter+"'>"
					+"<i class='fa fa-remove'></i>"
				+"</button>"
			+"</div>"
		+"</div>";
		filterLocation.push(valueFilter);
		$("#filter-location").append(strDisplay);
	});
	$("body").on("click",".location-filter-result button",function(){
		$(this).closest(".location-filter-result").remove();
		filterLocation.splice(filterLocation.indexOf($(this).attr("value-filter")), 1);
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