$(document).ready(function(){
	var statusMapUrl = url+"statusmap/";
	var params = new window.URLSearchParams(window.location.search);

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
						}

						strItem+="<div style='transform:translate("+item.x+"px, "+item.y+"px)' host-id='"+item.idHost+"' title='"+item.displayName+"' status='"+status+"' class='drag-item'><i class='fa fa-"+icon+"'></i></div>";
					});

					strSlideContent+="<div class='swiper-slide'>"
					+"<div class='slide'>"
					+"<img class='img-slider' src='data:image/jpeg;charset=utf-8;base64, "+map.img+"' />"
					+strItem
					+"</div>"
					+"</div>";
				});
				$(".swiper-wrapper").append(strSlideContent);

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