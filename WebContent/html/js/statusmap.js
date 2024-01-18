$(document).ready(function(){
	var statusMapUrl = url+"statusmap/";
	var params = new window.URLSearchParams(window.location.search);
	var servicesOfHost = [];

	getStatusMapList();

	function getStatusMapList()
	{
		var rqUrl = "";
		if(!params.has('id'))
		{
			rqUrl = statusMapUrl+"getmaplist";
		}
		else
		{
			rqUrl = statusMapUrl+"getmap?idMap="+params.get('id');
		}

		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				var strSlideContent = "";
				data.forEach(function(map) {
					var strItem = "";
					map.listItem.forEach(function(item){
						var icon = "";
						var status = "";
						if(item.currentState==0)
						{
							icon = "check";
							status = "ok";
						}
						else
						{
							icon = "exclamation";
							status = "notok";
							
							if(item.listService.length > 0){
								var checkRealError = false;
								item.listService.forEach(function(itemTest,index){
									var serviceName = itemTest.serviceName;
									var state = itemTest.serviceState;
									
									if(serviceName!="CHECK-UPTIME" && state >0 || serviceName=="CHECK-UPTIME" && state>1){
										checkRealError = true;
										return;
									}
								});
								
								if(!checkRealError){
									icon = "check";
									status = "assumeok";
								}
							}
						}
						servicesOfHost[item.idHost] = item.listService;
						strItem+="<div data-toggle='modal' data-target='#modal-serviceofhost' style='transform:translate("+item.x+"px, "+item.y+"px)' host-id='"+item.idHost+"' title='"+item.idHost+"' status='"+status+"' class='drag-item'><i class='fa fa-"+icon+"'></i><span>"+item.idHost+"</span></div>";
					});

					strSlideContent+="<div class='swiper-slide'>"
					+"<div class='slide'>"
					+"<img class='img-slider' src='data:image/jpeg;charset=utf-8;base64, "+map.img+"' />"
					+strItem
					+"</div>"
					+"</div>";
				});
				$(".swiper-wrapper").append(strSlideContent);
				
				console.log(servicesOfHost);
				getStatusMapTimeConfigList();
			},
			error: function(){
				console.log("get status map list fail!!!!!");
			}
		});
	}

	function getStatusMapTimeConfigList()
	{
		var rqUrl = statusMapUrl+"gettimeconfig";

		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				var refreshData = data.refresh;
				var changeSlide = data.changeslide;

				$('#refresh-time').svgTimer({
					time: refreshData,
					direction:'backward',
				});

				$("head").append("<meta http-equiv='refresh' content='"+refreshData+"'/>");

				var mySwiper = new Swiper ('.swiper-container', {
					direction: 'horizontal',
					loop: true,
					speed: 1000,
					autoplay: {
						delay: changeSlide*1000,
					},
				});

				scaleImg();
			},
			error: function(){
				console.log("get status map config fail!!!!!");
			}
		});
	}
	
	$("body").on("click",".drag-item",function(){
		var hostId = $(this).attr("host-id");
		$("#modal-serviceofhost .modal-title").html("Danh sách Service của "+hostId);
		
		var tableContent = "";
		
		servicesOfHost[hostId].forEach(function(item,index){
			var serviceName = item.serviceName;
			var state = item.serviceState;
			var lastCheck = item.lastCheck;
			var checkAttempt = item.currentAttempt + "/" +item.maxAttempt;
			var output = item.output;
			
			var stateDisplay;
			
			switch(state) {
				case 0: 
					stateDisplay = "<b style='color: ForestGreen !important'>OK</b>";
				break;
				case 1: 
					stateDisplay = "<b style='color: GoldenRod !important'>Warning</b>";
				break;
				case 2: 
					stateDisplay = "<b style='color: PaleVioletRed !important'>Critical</b>";
				break;
				case 3: 
					stateDisplay = "<b style='color: DarkGrey !important'>Unknown</b>";
				break;
				case 4: 
					stateDisplay = "<b style='color: DarkGrey !important'>Pending</b>";
				break;
			}
			
			tableContent+="<tr>"
			+"<td>"+serviceName+"</td>"
			+"<td>"+stateDisplay+"</td>"
			+"<td>"+lastCheck+"</td>"
			+"<td>"+checkAttempt+"</td>"
			+"<td>"+output+"</td>"
			+"</tr>";
		});
		$("#modal-serviceofhost tbody").html(tableContent);
	});

	$(window).on('resize', function(){
     	scaleImg();
	});

	function scaleImg(){
		var slideContainer = $(".swiper-container");

     	var containWidth = slideContainer.width();
     	var containHeight = slideContainer.height();

     	var ratio = (containHeight/500)-0.05;

     	$(".slide").css({"transform":"scale("+ratio+")"});
	}
});