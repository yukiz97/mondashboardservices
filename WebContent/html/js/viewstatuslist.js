$(document).ready(function(){
	var hostStatusUp={name:"UP",color:"ForestGreen"};
	var hostStatusDown={name:"DOWN",color:"PaleVioletRed"};
	var hostStatusUnreachable={name:"UNREACHABLE",color:"DarkGrey"};

	var serviceStatusOk={name:"OK",color:"ForestGreen"};
	var serviceStatusWarning={name:"WARNING",color:"GoldenRod"};
	var serviceStatusCritical={name:"CRITICAL",color:"PaleVioletRed"};
	var serviceStatusUnknown={name:"UNKNOWN",color:"DarkGrey"};

	var hostStatusArray = {};
	hostStatusArray[0] = hostStatusUp;
	hostStatusArray[1] = hostStatusDown;
	hostStatusArray[2] = hostStatusUnreachable;

	var serviceStatusArray = {};
	serviceStatusArray[0] = serviceStatusOk;
	serviceStatusArray[1] = serviceStatusWarning;
	serviceStatusArray[2] = serviceStatusCritical;
	serviceStatusArray[3] = serviceStatusUnknown;

	var typeView = "host";

	var statusViewUrl = url+"statusview/";

	getStatusViewList(typeView);

	//loadStatusViewInterval = setInterval(function(){getStatusViewList(typeView)},16000);

	$(".btn-change-type").on("click",function(){
		var typeChange = $(this).attr("type");

		if(typeView!=typeChange)
		{
			typeView = typeChange;

			getStatusViewList(typeView);
			clearInterval(loadStatusViewInterval);

			$(".viewrow.header .name").html(typeView.charAt(0).toUpperCase()+typeView.slice(1));

			loadStatusViewInterval = setInterval(function(){getStatusViewList(typeView)},16000);
		}
	});

	$(".viewlayout .body").on("mouseover",function(){
		clearInterval(loadStatusViewInterval);
		$('#refresh-time').html("");
		$('#refresh-time').html(createHexagon());
	}).on("mouseout",function(){
		loadStatusViewInterval = setInterval(function(){getStatusViewList(typeView)},16000);
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

	function getStatusViewList(type)
	{
		var limit = returnLimit($(".viewlayout").height()-$(".viewrow.header").height(),44);

		var rqUrl = statusViewUrl+"getviewlist?type="+type+"&limit="+limit;

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
				var statusArray;
				var resultDisplay="";
				if(type=="host")
				{
					statusArray = hostStatusArray;
				}
				else if(type=="service")
				{
					statusArray = serviceStatusArray;
				}
				data.forEach(function(model) {
					resultDisplay+="<div class='viewrow animated flipInX' name='"+model.name+"' itemid='"+model.id+"'>"
					+"<div class='block-row timestamp'>"+model.timestamp+"</div>"
					+"<div class='block-row name'>"+model.name+"</div>"
					+"<div class='block-row state' type='current'><span style='background: "+statusArray[model.currentState].color+"' state='current'>"+statusArray[model.currentState].name+"</span></div>"
					+"<div class='block-row state' type='last'><span style='background: "+statusArray[model.lastState].color+"' state='current'>"+statusArray[model.lastState].name+"</span></div>"
					+"<div class='block-row output'>"+model.output+"</div>"
					+"<div class='block-row alertdot'><span id='alert-"+model.id+"' check='"+model.check+"'></span></div>"
					+"</div>";
				});

				$(".viewlayout .body").html(resultDisplay);

				$(".viewrow").on("mouseover",function(){
					var name = $(this).attr("name");

					$("div[name='"+name+"'] .name").css({"color":"rgb(218, 63, 52)","font-weight":"bold"});
				}).on("mouseout",function(){
					var name = $(this).attr("name");

					$("div[name='"+name+"'] .name").css({"color":"#181642","font-weight":"normal"})
				});
			},
			error: function(){
				console.log("get status view list fail!!!!!");
			}
		});
	}

	function updateItemViewStatus(item,status)
	{
		var itemId = item.attr("itemid");

		var rqUrl = statusViewUrl+"setitemstatus?id="+itemId+"&status="+status;

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