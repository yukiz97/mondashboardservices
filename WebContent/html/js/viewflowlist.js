$(document).ready(function(){
	var flowViewUrl = url+"flowview/";

	getFlowViewList();

	loadFlowViewInterval = setInterval(function(){getFlowViewList()},16000);

	$(".viewlayout .body").on("mouseover",function(){
		clearInterval(loadFlowViewInterval);
		$('#refresh-time').html("");
		$('#refresh-time').html(createHexagon());
	}).on("mouseout",function(){
		loadFlowViewInterval = setInterval(function(){getFlowViewList()},16000);
		$('#refresh-time').html("");
		$('#refresh-time').svgTimer({
			time: 15,
			direction:'backward',
		});
	});

	$(function() {
		$.contextMenu({
			selector: '.body .viewrow', 
			callback: function(key, options) {
				if(key=="acknown")
				{
					updateItemViewStatus($(this),0);
				}
				else if(key=="complete")
				{
					updateItemViewStatus($(this),1);
				}
			},
			items: {
				"acknown": {name: "Xác nhận", icon: "fa-flag"},
				"complete": {name: "Hoàn thành", icon: "fa-check"},
				"sep1": "---------",
				"quit": {name: "Quit", icon: function(){
					return 'context-menu-icon context-menu-icon-quit';
				}}
			}
		}); 
	});

	function getFlowViewList()
	{
		var limit = returnLimit($(".viewlayout").height()-$(".viewrow.header").height(),44);

		var rqUrl = flowViewUrl+"getviewlist?limit="+limit;

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
				var resultConfigDisplay="";
				var resultViewDisplay="";

				var listConfig = data.configs;
				var listView = data.items;

				listConfig.forEach(function(model) {
					var type = "";
					if(model.value.includes("/"))
					{
						type="iprange";
					}
					else
					{
						type="ip";
					}	

					resultConfigDisplay+="<span type='"+type+"' class='flowview-config-block'>"+model.name+": "+model.value+"</span>";
				});

				listView.forEach(function(model) {
					var severity = "";
					if(model.severity==1)
					{
						severity = "HIGH";
					}
					else if(model.severity==2)
					{
						severity = "MEDIUM";
					}

					resultViewDisplay+="<div class='viewrow animated flipInX' itemid='"+model.id+"'>"
					+"<div class='block-row ipsource ipvalue' ip='"+model.sourceIp+"'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+model.sourceCode.value+".svg' data-toggle='tooltip' data-placement='bottom' title='"+model.sourceCode.name+"' /> "+model.sourceIp+"</div>"
					+"<div class='block-row ipdes ipvalue' ip='"+model.desIp+"'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+model.desCode.value+".svg' data-toggle='tooltip' data-placement='bottom' title='"+model.desCode.name+"' /> "+model.desIp+"</div>"
					+"<div class='block-row severity'><span severity='"+model.severity+"'>"+severity+"</span></div>"
					+"<div class='block-row signature'>"+model.signature+"</div>"
					+"<div class='block-row port' port='"+model.port+"'>"+model.port+"</div>"
					+"<div class='block-row alertdot'><span id='alert-"+model.id+"' check='"+model.check+"'></span></div>"
					+"</div>";
				});

				$("#general-flowview marquee").html(resultConfigDisplay);
				$(".viewlayout .body").html(resultViewDisplay);

				$(".ipvalue").on("mouseover",function(){
					var ip = $(this).attr("ip");

					$(".ipvalue[ip='"+ip+"']").css({"color":"rgb(218, 63, 52)","font-weight":"bold"});
				}).on("mouseout",function(){
					var ip = $(this).attr("ip");

					$(".ipvalue[ip='"+ip+"']").css({"color":"#999999","font-weight":"normal"})

				});

				$(".port").on("mouseover",function(){
					var port = $(this).attr("port");

					$(".port[port='"+port+"']").css({"color":"rgb(218, 63, 52)","font-weight":"bold"});
				}).on("mouseout",function(){
					var port = $(this).attr("port");

					$(".port[port='"+port+"']").css({"color":"#181642","font-weight":"normal"})

				});
			},
			error: function(){
				console.log("get flow view list fail!!!!!");
			}
		});
	}

	function updateItemViewStatus(item,status)
	{
		var itemId = item.attr("itemid");

		var rqUrl = flowViewUrl+"setitemstatus?id="+itemId+"&status="+status;

		$.ajax({
			url: rqUrl,
			type: 'POST',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				if(data.result=="success")
				{
					$("#alert-"+itemId).attr("check",status);
					swal("Thành công!", "Cập nhật tình trạng thành công!", "success");
				}
				else if(data.result=="fail")
				{
					swal("Thất bại!", "Cập nhật tình trạng thất bại, vui lòng thử lại sau!", "error");
				}
			},
			error: function(){
				console.log("set flow view item status fail!!!!!");
			}
		});
	}
});