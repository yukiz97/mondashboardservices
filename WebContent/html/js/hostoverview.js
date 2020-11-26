$(document).ready(function(){
	var hostState = "0,1,2,3";
	var serviceState = "0,1,2,3,4";
	var params = new window.URLSearchParams(window.location.search);
	
	if(params.has('hoststate'))
	{
		hostState = params.get('hoststate');
	}
	hostStateArray = hostState.split(",");
		
	for(i = 0; i < hostStateArray.length;i++){
		$(".cb-hoststate[value='"+hostStateArray[i]+"']").attr("checked",true);
	}
	if(params.has('servicestate'))
	{
		serviceState = params.get('servicestate');
	}
	serviceStateArray = serviceState.split(",");
		
	for(i = 0; i < serviceStateArray.length;i++){
		$(".cb-servicestate[value='"+serviceStateArray[i]+"']").attr("checked",true);
	}
	
	var hostOverviewURL = url+"hostoverview/";
	
	loadHostOverviewInterval = setInterval(function(){getHostOverviewList()},16000);
	
	getHostOverviewList();
	
	function  getHostOverviewList() {
		var rqUrl = hostOverviewURL+"getlist?hoststate="+hostState+"&servicestate="+serviceState;
		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				$('#refresh-time').html("");
				$('#refresh-time').svgTimer({
					time: 15,
					direction:'backward',
				});
				
				var resultViewDisplay="";
				
				data.forEach(function(model) {
					listServiceCount = model.listServiceStateCount;			
					
					resultViewDisplay+="<div class='viewrow animated flipInX' itemid='"+model.id+"'>"
					+"<div class='block-row hostname'>"+model.hostName+"</div>"
					+"<div class='block-row hostip'>"+model.hostIP+"</div>"
					+"<div class='block-row host-state'>"+returnHostStateDisplay(model.hostState)+"</div>"
					+"<div class='block-row service-ofhost-state'>"+returnServiceStateDisplay(listServiceCount)+"</div>"
					+"</div>";
				});
				
				$(".viewlayout .body").html(resultViewDisplay);
			}
		});
	}
	
	function returnHostStateDisplay(state){
		var color = "";
		var text = "";
		
		switch(state){
			case 0:
				color = "ForestGreen";
				text = "Up";
			break;
			case 1:
				color = "PaleVioletRed";
				text = "Down";
			break;
			case 2:
				color = "DarkGrey";
				text = "Unreachable";
			break;
			case 3:
				color = "purple";
				text = "Pending";
			break;
		}
		
		return "<span class='hostoverview-hoststate-display' style='background:"+color+"'>"+text+"</span>";
	}
	
	function returnServiceStateDisplay(listService){
		var color = "";
		var text = "";
		
		ok = 0;
		warning = 0;
		critical = 0;
		unknown = 0;
		pending = 0;
		
		for(i = 0; i < listServiceCount.length;i++){
			modelService = listServiceCount[i];
			
			switch(modelService.state){
				case 0:
					//color = "ForestGreen";
					ok = modelService.count;
				break;
				case 1:
					//color = "GoldenRod";
					warning = modelService.count;
				break;
				case 2:
					//color = "PaleVioletRed";
					critical = modelService.count;
				break;
				case 3:
					//color = "DarkGrey";
					unknown = modelService.count;
				case 4:
					//color = "purple";
					pending = modelService.count;
				break;
			}
			
		}
		
		strResult = "<span class='hostoverview-servicestate-display' value='"+ok+"' style='background:ForestGreen'>"+ok+"</span>"
		+"<span class='hostoverview-servicestate-display' value='"+warning+"' style='background:GoldenRod'>"+warning+"</span>"
		+"<span class='hostoverview-servicestate-display' value='"+critical+"' style='background:PaleVioletRed'>"+critical+"</span>"
		+"<span class='hostoverview-servicestate-display' value='"+unknown+"' style='background:DarkGrey'>"+unknown+"</span>"
		+"<span class='hostoverview-servicestate-display' value='"+pending+"' style='background:purple'>"+pending+"</span>";
		
		return strResult;
	}
	
	$("#btn-applyfilter-current").on("click",function(){
		var strHost = $('.cb-hoststate:checked').map(function() {
		    return this.value;
		}).get().join();
		var strService = $('.cb-servicestate:checked').map(function() {
		    return this.value;
		}).get().join();
		
		if(strHost.trim()=="") {
			swal({
				title: "Lỗi!",
			  text: "Vui lòng chọn ít nhất 1 tình trạng của host!",
			  icon: "error",
			});
			return;
		}
		if(strService.trim()=="") {
			swal({
				title: "Lỗi!",
			  text: "Vui lòng chọn ít nhất 1 tình trạng của service của host!",
			  icon: "error",
			});
			return;
		}
		
		hostState = strHost;
		serviceState = strService;
		clearInterval(loadHostOverviewInterval);

		getHostOverviewList();
		
		loadHostOverviewInterval = setInterval(function(){getHostOverviewList()},16000);
	});
	
	$("#btn-applyfilter-new").on("click",function(){
		var strHost = $('.cb-hoststate:checked').map(function() {
		    return this.value;
		}).get().join();
		var strService = $('.cb-servicestate:checked').map(function() {
		    return this.value;
		}).get().join();
		if(strHost.trim()=="") {
			swal({
				title: "Lỗi!",
			  text: "Vui lòng chọn ít nhất 1 tình trạng của host!",
			  icon: "error",
			});
			return;
		}
		if(strService.trim()=="") {
			swal({
				title: "Lỗi!",
			  text: "Vui lòng chọn ít nhất 1 tình trạng của service của host!",
			  icon: "error",
			});
			return;
		}
			
		hostState = strHost;
		serviceState = strService;
		clearInterval(loadHostOverviewInterval);

		getHostOverviewList();
		
		loadHostOverviewInterval = setInterval(function(){getHostOverviewList()},16000);
	
		var pathname = window.location.pathname;
		
		window.open(pathname+"?hoststate="+hostState+"&servicestate="+serviceState);
	});
});