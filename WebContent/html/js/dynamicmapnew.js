var filterProtocol = [];
var filterAction = [];
var filterSrcport = [];
var filterDstport = [];
var filterSigname = [];
var filterClassification = [];
var filterPriority = [];
var filterLocation = [];
var filterLocationSrcAll = [];
var filterLocationDesAll = [];
var filterLocationDesForMapLeft = [];
var filterLocationDesForMapRight = [];
var filterLocationSrcForMapLeft = [];
var filterLocationSrcForMapRight = [];

var arrayCodeMapLeft = [];
var arrayCodeMapRight = [];

var strListItemMapLeft = "";
var strListItemMapRight = "";

var dynamicMapUrl = url+"dynamicmap/";
var camservice = url+"camservice/";
var realtime = false;

$(document).ready(function(){
	var params = new window.URLSearchParams(window.location.search);
	var typeData;
	
	var svgTag = "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='1900px' height='600px' viewBox='0 0 1900 600' enable-background='new 0 0 1900 600' xml:space='preserve' id = 'svg5718'>";
	var gradientAllow = "<linearGradient id='grad-allow'> <stop stop-color='#11998e'/> <stop offset='100%' stop-color='#38ef7d'/> </linearGradient>";
	var gradientDeny = "<linearGradient id='grad-deny'> <stop stop-color='#4d0000'/> <stop offset='100%' stop-color='#ff3333'/> </linearGradient>";
	var gradientOther = "<linearGradient id='grad-other'> <stop stop-color='#C9D6FF'/> <stop offset='100%' stop-color='#E2E2E2'/> </linearGradient>";
	var gradientHigh = "<linearGradient id='grad-high'> <stop stop-color='#ae5a75'/> <stop offset='100%' stop-color='#ae5a75'/> </linearGradient>";
	var gradientMedium = "<linearGradient id='grad-medium'> <stop stop-color='#ae831a'/> <stop offset='100%' stop-color='#ae831a'/> </linearGradient>";
	var gradientLow = "<linearGradient id='grad-low'> <stop stop-color='#228b22'/> <stop offset='100%' stop-color='#228b22'/> </linearGradient>";
	
	var leftCode;
	var rightCode;
	
	var arrayDetailA = [];
	var indexDetailA = 0;
	var intervalDetailA;

	var arrayDetailB = [];
	var indexDetailB = 0;
	var intervalDetailB;
	
	var arrayDetailC = [];
	var indexDetailC = 0;
	var intervalDetailC;

	var autoChangePage = true;
	var myInterval;
	
	var modeView = "Chế độ xem: ";
	
	if(!params.has('left') || !params.has('right') || !params.has("type"))
	{
		window.location.href = 'index.html';
	}
	
	var leftId = params.get('left');
	var rightId = params.get('right');
	
	typeData = params.get('type');
	
	if(typeData=="connectivity")
	{
		$("#type-map-name").html("BẢN ĐỒ KIỂM SOÁT KẾT NỐI MẠNG")
		$("#detail-a").css("display","inline-block");
		$("#priority").hide();
		$("#signame").hide();
		$("#classification").hide();
	}
	else if(typeData=="snort")
	{
		$("#type-map-name").html("BẢN ĐỒ THEO DÕI DẤU HIỆU TẤN CÔNG MẠNG")
		$("#detail-c").css("display","inline-block");
		$("#action").hide();
		
		getSigNameList();
		getClassificationList();
	}
	
	loadValueForForm();
	getDynamicMap();
	
	$("#btn-replay").on("click",function(){
		removeAllDisplayElement();
		clearInterval(myInterval);
		realtime = false;
		getMainData();
		$("#btn-realtime").children("i").removeClass("fa-pause");
		$("#btn-realtime").children("i").addClass("fa-play");
		$("#btn-realtime").attr("status","pause");
		$("#btn-realtime").attr("title","Nhấn để xem trực tuyến");
		$("#mode-name").html(modeView+"<span style='background: #5c2622;'>Phát lại</span>");
	});

	$("#btn-realtime").on("click",function(){
		var status = $(this).attr("status");
		var message = "";
		$("#mode-name").html(modeView+"<span style='background: #172f42;'>Trực tuyến</span>");
		if(status=="pause"){
			removeAllDisplayElement();
			if(realtime==false)
			{
				realtime = true;
			}
			getMainData();
			clearInterval(myInterval);
	
			myInterval = setInterval(function() {
				getMainData();
			}, 20000);
			
			$(this).children("i").removeClass("fa-play");
			$(this).children("i").addClass("fa-pause");
			
			$(this).attr("status","play");
			$(this).attr("title","Nhấn để dừng xem trực tuyến");
		} else if(status=="play"){
			$(this).children("i").removeClass("fa-pause");
			$(this).children("i").addClass("fa-play");
			clearInterval(myInterval);
			$(this).attr("status","pause");
			$(this).attr("title","Nhấn để xem trực tuyến");
		}
	});
	
	$("#apply-filter-replay").on("click",function(){
		$("#btn-replay").trigger("click");
	});
	
	$("#apply-filter-realtime").on("click",function(){
		if($("#btn-realtime").attr("status")=="play"){
			$("#btn-realtime").trigger("click");
		    $("#btn-realtime").trigger("click");
		} else {
			$("#btn-realtime").trigger("click");
		}
	});
	
	function getSigNameList(){
		var rqUrl = dynamicMapUrl+"getsignamelist";
		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				var strSig = "";
				for(i = 0 ; i < data.length ; i++){
					strSig += "<option value='"+data[i]+"'>"+data[i]+"</option>";
				}
				$("#signame select").append("<optgroup label='Mẫu nhận dạng tấn công'>"+strSig+"</optgroup>");
			},
			error: function(){
				console.log("get sig name list fail!!!!!");
			}
		});
	}
	function getClassificationList(){
		var rqUrl = dynamicMapUrl+"getclassificationlist";
		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				var strSig = "";
				for(i = 0 ; i < data.length ; i++){
					strSig += "<option value='"+data[i]+"'>"+data[i]+"</option>";
				}
				$("#classification select").append("<optgroup label='Phân loại'>"+strSig+"</optgroup>");
			},
			error: function(){
				console.log("get sig name list fail!!!!!");
			}
		});
	}
	
	function getDynamicMap()
	{
		var rqUrl = dynamicMapUrl+"getdynamicmap?idMapLeft="+leftId+"&idMapRight="+rightId;

		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(map){
				console.log(map);
				var mapLeft = map.mapLeft;
				var mapRight = map.mapRight;
				
				$("#svg-container #img-left").attr("src","data:image/svg+xml;charset=utf-8;base64,"+mapLeft.background);
				$("#svg-container #img-right").attr("src","data:image/svg+xml;charset=utf-8;base64,"+mapRight.background);
				
				var circleString = "";
				mapLeft.items.forEach(function(item){
					circleString += "<circle code='"+item.code+"' name='"+item.name+"' fill='#ED1C24' cx='"+item.x+"' cy='"+item.y+"' submap='"+item.mapLevel2Id+"' side='left' r='1'/>";
					strListItemMapLeft += "<option value='"+item.code+"'>--"+item.name+"</option>";
					arrayCodeMapLeft.push(item.code);
				});
				mapRight.items.forEach(function(item){
					circleString += "<circle code='"+item.code+"' name='"+item.name+"' fill='#ED1C24' cx='"+(item.x+950)+"' cy='"+item.y+"' submap='"+item.mapLevel2Id+"' side='right' r='1'/>";
					strListItemMapRight += "<option value='"+item.code+"'>--"+item.name+"</option>";
					arrayCodeMapRight.push(item.code);
				});
				
				$("#filter-location div[combobox='left'] select").append("<option value='all'>Tất cả</option><option value='map-left'>"+mapLeft.mapName+"</option>"+strListItemMapLeft+"<option value='map-right'>"+mapRight.mapName+"</option>"+strListItemMapRight);
				$("#filter-location div[combobox='right'] select").append("<option value='all'>Tất cả</option><option value='map-right'>"+mapRight.mapName+"</option>"+strListItemMapRight+"<option value='map-left'>"+mapLeft.mapName+"</option>>"+strListItemMapLeft);
				
				$("#svg-container").append(svgTag+gradientAllow+gradientDeny+gradientOther+gradientHigh+gradientMedium+gradientLow+circleString+"</svg>");
			
				leftCode = mapLeft.code;
				rightCode = mapRight.code;
				resizeDetailPanel();
				
				$("#maps-name").html(mapLeft.mapName+" - "+mapRight.mapName);
				
				if(params.has('play'))
				{
					var play = params.get('play');
					if(play=="realtime")
					{
						$("#btn-realtime").trigger("click");
					}
					else if(play=="replay")
					{
						$("#formdate").val(params.get("date"));
						$("#formhour").val(params.get("hour"));
						$("#formfrommenute").val(params.get("from"));
						$("#formtomenute").val(params.get("to"));
						
						$("#btn-replay").trigger("click");
					}
				}
			},
			error: function(){
				console.log("get dynamic map list fail!!!!!");
			}
		});
	}
	
	function getMainData(){
		if(realtime == true){
    		startDate = timeConverter2(Date.now()-(50000));
    		endDate = timeConverter2(Date.now());
    	}
    	else
    	{
			var date = $("#formdate").val();
			var hour = $("#formhour").val();
			var fromMinute = $("#formfrommenute").val();
			var toMinute = $("#formtomenute").val();

			if(hour<10)
				hour = 0+hour;
			if(fromMinute<10)
				fromMinute = 0+fromMinute;
			if(toMinute<10)
				toMinute = 0+toMinute;

			var startDate = date+" "+hour+":"+fromMinute+":00";
			var endDate = date+" "+hour+":"+toMinute+":59";
    	}

		console.log(startDate+"--"+endDate);
		
		var typeUrl = camservice;
		
		if(typeData=="connectivity")
			typeUrl+="getdata_connectivity";
		else
			typeUrl+="getdata_snort";
		
		var rqUrl = typeUrl+"?fromDate="+startDate+"&toDate="+endDate+"&leftCode="+leftCode+" "+leftId+"&rightCode="+rightCode+" "+rightId;
		var  arrayData = [];
		$.ajax({
			url: rqUrl,
			type: 'POST',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				console.log(filterLocationSrcAll);
				console.log(filterLocationDesAll);
				if(typeData=="connectivity")
				{
					clearInterval(intervalDetailA);
					indexDetailA = 0;
					arrayDetailA = [];
					
					var countItem = 0;
					console.log(filterLocationSrcAll);
					data.forEach(function(item){
						var idItem = item.from+"-"+item.to;
						var srcport = item.src_port;
						var dstport = item.dst_port;
						var protocol = item.protocol;
						var action = item.action;
                        
                        var actionTmp = action;
                        if(action=="pass")
                            actionTmp="ALLOW";
                         else if(action=="block"){
                         	actionTmp="DROP";
                         }
						if(filterLocationSrcAll.length > 0){
							if(
								(filterLocationSrcAll.includes("map-left") && arrayCodeMapLeft.includes(item.from))
								|| (filterLocationSrcAll.includes("map-right") && arrayCodeMapRight.includes(item.from))
								|| filterLocationSrcAll.includes(item.from)){
								
							}
						} else if(filterLocationDesAll.length > 0){
							if(
								(filterLocationDesAll.includes("map-left") && arrayCodeMapLeft.includes(item.to))
								(filterLocationDesAll.includes("map-right") && arrayCodeMapRight.includes(item.to))
								|| filterLocationDesAll.includes(item.to)
								){
									
							}
						} else if(filterLocationDesForMapLeft.length > 0 && arrayCodeMapLeft.includes(item.from) && filterLocationDesForMapLeft.includes(item.to)){
							
						} else if(filterLocationDesForMapRight.length > 0 && arrayCodeMapRight.includes(item.from) && filterLocationDesForMapRight.includes(item.to)){
							
						} else if(filterLocationSrcForMapLeft.length > 0 && arrayCodeMapLeft.includes(item.to) && filterLocationSrcForMapLeft.includes(item.from)){
							
						} else if(filterLocationSrcForMapRight.length > 0 && arrayCodeMapRight.includes(item.to) && filterLocationSrcForMapRight.includes(item.from)){
							
						} else if(filterLocation.length > 0) {
							if(filterLocation.includes("map-left-map-right") || filterLocation.includes("map-right-map-left") || filterLocation.includes("map-left-map-left") || filterLocation.includes("map-right-map-right")){
								console.log(filterLocation.includes("map-left-map-left"));
								if(
									(filterLocation.includes("map-left-map-right") && arrayCodeMapLeft.includes(item.from) && arrayCodeMapRight.includes(item.to)) 
									|| (filterLocation.includes("map-right-map-left") && arrayCodeMapLeft.includes(item.to) && arrayCodeMapRight.includes(item.from))
									|| (filterLocation.includes("map-left-map-left") && arrayCodeMapLeft.includes(item.from) && arrayCodeMapLeft.includes(item.to))
									|| (filterLocation.includes("map-right-map-right") && arrayCodeMapRight.includes(item.from) && arrayCodeMapRight.includes(item.to))
									){
									
								} else {
									return;
								}
							} else if(!filterLocation.includes(idItem))
								return;
						}
							
						if(filterSrcport.length > 0 && !filterSrcport.includes(srcport))
							return;
						if(filterDstport.length > 0 && !filterDstport.includes(dstport))
							return;
						if(filterProtocol.length > 0 && !filterProtocol.includes(protocol.toLowerCase()))
							return;
						if(filterAction.length > 0 && !filterAction.includes(actionTmp))
							return;
							
						arrayData.push(idItem);
						appendDisplay(item.from,item.to,item.action);
						
						var detail = createDetailRow(item.from,item.fromName,item.src_ip,item.to,item.toName,item.dst_ip,action,item.date,srcport,dstport,protocol,item.sourceip);
						if(detail!="")
						{
							arrayDetailA[countItem++] = detail;
						}
					});
					
					console.log(arrayData);
					
					$("#connect-count").html(countItem);
					displayToScreenDetailA();

					if(autoChangePage){
						intervalDetailA = setInterval(function() {
							displayToScreenDetailA();
						}, 5000);
					}
				} 
				else
				{
					clearInterval(intervalDetailC);
					indexDetailC = 0;
					arrayDetailC = [];
					
					var countItem = 0;
					console.log(filterClassification);
					data.forEach(function(item){
				  		if(item.id !== "VN_VN")
			  			{
							var idItem = item.from+"-"+item.to;
							var srcport = item.src_port;
							var dstport = item.dst_port;
							var protocol = item.protocol;
							var priority = item.priority;
							var signame = item.sig_name;
							var classification = item.classification;
							
							if(filterLocationSrcAll.length > 0 && filterLocationSrcAll.includes(item.from)){
								
							} else if(filterLocationDesAll.length > 0 && filterLocationDesAll.includes(item.to)){
								
							} else if(filterLocation.length > 0 && !filterLocation.includes(idItem))
								return;
							if(filterSrcport.length > 0 && !filterSrcport.includes(srcport))
								return;
							if(filterDstport.length > 0 && !filterDstport.includes(dstport))
								return;
							if(filterProtocol.length > 0 && !filterProtocol.includes(protocol))
								return;
							if(filterPriority.length > 0 && !filterPriority.includes(priority))
								return;
							if(filterSigname.length > 0 && !filterSigname.includes(signame))
								return;
							if(filterClassification.length > 0 && !filterClassification.includes(classification))
								return;
							
				  			var detail = createDetailRowSnort(item.src_ip,item.fromName,item.from,item.dst_ip,item.toName,item.to,signame,item.src_port,item.dst_port,item.date,classification,protocol,priority);
							if(detail!="")
							{
								arrayDetailC[countItem++] = detail;
							}
							arrayData.push(idItem);
							
							appendDisplay(item.from,item.to,(priority == 1 ? "HIGH" : priority == 2 ? "MEDIUM" : "LOW"));
			  			}
					});
					console.log(arrayData);
					
					$("#attack-count").html(countItem);					
					displayToScreenDetailC("forward");

					if(autoChangePage){
						intervalDetailC = setInterval(function() {
							displayToScreenDetailC("forward");
						}, 5000);
					}
				}
				$("svg path").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						console.log("remove path"+key);
					}
					else
					{
						console.log("exist path "+key);
					}
				});
				$("svg circle[class='zoomCircle']").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						console.log("remove circle "+key);
					}
					else
					{
						console.log("exist circle "+key);
					}
				});
				$("svg text").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						console.log("remove text "+key);
					}
					else
					{
						console.log("exist text "+key);
					}
				});
			},
			error: function(){
				console.log("get data dynamic map list fail!!!!!");
			}
		});
	}
	
	function getTrigger(){
		var rqUrl = camservice+"gettrigerrlog";

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;

		var yyyy = today.getFullYear();
		if (dd < 10) {
		  dd = '0' + dd;
		} 
		if (mm < 10) {
		  mm = '0' + mm;
		} 
		var today = dd+"-"+mm+"-"+yyyy;
		$("#date-display-detail-b").html("DATE "+today);

		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(data){
				clearInterval(intervalDetailB);
				indexDetailB = 0;
				arrayDetailB = [];
				
				var countItem = 0;

				//for(var i = 0;i<23;i++){
				for(var i=0;i< data.length;i++){
					if(i<50)
					{
						arrayDetailB[countItem++] = createDetailRowTrigger(data[i]);
					}
				}
				$("#trigger-count").html(data.length);

				displayToScreenDetailB();

				intervalDetailB = setInterval(function() {
					displayToScreenDetailB();
				}, 10000);
			},
			error: function(){
				console.log("trigger-error:");
			}
		});
	}
	
	function loadValueForForm()
	{
		var today = new Date();
		var day = today.getDate()<10?"0"+today.getDate():today.getDate();
		var year = today.getFullYear()<10?"0"+today.getFullYear():today.getFullYear();
		var month = (today.getMonth()+1)<10?"0"+(today.getMonth()+1):(today.getMonth()+1);
		
		$("#formdate").val(year+"-"+month+"-"+day);
		
		var strHour = "";
		var strMinute = "";

		for(var i = 0;i<=23;i++)
		{
			var select = "";
			if(i == today.getHours())
				select = "selected";
			
			strHour+="<option value='"+i+"' "+select+">"+i+"</option>";
		}

		for(var i = 0;i<=59;i++)
		{
			strMinute+="<option value='"+i+"'>"+i+"</option>";
		}

		$("#formhour").html(strHour);
		$("#formfrommenute").html(strMinute);
		$("#formtomenute").html(strMinute);
	}
	
	function displayToScreenDetailA(direction)
	{
		$("#mar-detail-a").html("");
		if(arrayDetailA.length==0)
		{
			return;
		}
		
		if(indexDetailA == arrayDetailA.length - 1)
		{
			if(direction == "forward")
				indexDetailA = 0;
		}

		var heightDisplay = $("#mar-detail-a").height();

		var limit = returnLimit(heightDisplay,33);

		var i;

		if(direction=="forward"){
			i = indexDetailA;
		} else {
			i = indexDetailA-(limit*2);
			
			if(i<0){
				i = 0;
			}
		}
		endIndex = i+limit;
		for(i;i<endIndex;i++)
		{
			$("#mar-detail-a").append(arrayDetailA[i]);
			if(i==(arrayDetailA.length - 1))
			{
				break;
			}
		}
		indexDetailA = i;
	} 
	
	function displayToScreenDetailC(direction)
	{
		$("#mar-detail-c").html("");
		if(arrayDetailC.length==0)
		{
			return;
		}
		console.log(indexDetailC + " - "+ arrayDetailC.length+"----");
		if(indexDetailC == arrayDetailC.length - 1)
		{
			if(direction == "forward")
				indexDetailC = 0;
		}

		var heightDisplay = $("#mar-detail-c").height();

		var limit = returnLimit(heightDisplay,33);

		var i;
		
		if(direction=="forward"){
			i = indexDetailC;
		} else {
			i = indexDetailC-(limit*2);
			
			if(i<0){
				i = 0;
			}
		}

		endIndex = i+limit;
		console.log(i+" - "+indexDetailC);
		for(i;i<endIndex;i++)
		{
			$("#mar-detail-c").append(arrayDetailC[i]);
			if(i==(arrayDetailC.length - 1))
			{
				break;
			}
		}
		indexDetailC = i;
	}
	
	$(".btn-detail-play").on("click",function(){
		var status = $(this).attr("status");
		if(status=="play"){
			if(typeData=="connectivity"){
				clearInterval(intervalDetailA);
			} else if(typeData=="snort"){
				clearInterval(intervalDetailC);
			}
			
			$(this).children("i").removeClass("fa-pause");
			$(this).children("i").addClass("fa-play");
			
			$(this).attr("status","pause");
			$(this).attr("title","Chuyển trang tự động");
			autoChangePage = false;
		} else if(status == "pause"){
			if(typeData=="connectivity"){
				intervalDetailA = setInterval(function() {
					displayToScreenDetailA("forward");
				}, 5000);
			} else if(typeData=="snort"){
				intervalDetailC = setInterval(function() {
					displayToScreenDetailC("forward");
				}, 5000);
			}
			
			$(this).children("i").removeClass("fa-play");
			$(this).children("i").addClass("fa-pause");
			
			$(this).attr("status","play");
			$(this).attr("title","Dừng chuyển trang tự động");
			autoChangePage = true;
		}
	});
	
	$(".btn-detail-left").on("click",function(){
		if(typeData=="connectivity"){
			displayToScreenDetailA("backward")
		} else if(typeData=="snort"){
			displayToScreenDetailC("backward")
		}
	});
	
	$(".btn-detail-right").on("click",function(){
		var type = $(this).attr("type");
		
		if(typeData=="connectivity"){
			displayToScreenDetailA("forward")
		} else if(typeData=="snort"){
			displayToScreenDetailC("forward")
		}
	});
	
	function appendDisplay(idSource,idDes,action)
	{
		if(!$("circle[code='"+idSource+"']").length || !$("circle[code='"+idDes+"']").length)
		{
			//console.log('id source or id des doesn\'t exits -- '+idSource+" -- "+idDes);
			return;
		}

		var key = idSource+"-"+idDes;
		
		if(idSource==idDes)
		{
			return "";
		}

		if($("path[key='"+key+"'").length)
		{
			//console.log('exits!!');
			return;
		}

		var src = $("circle[code='"+idSource+"']");
		var dst = $("circle[code='"+idDes+"']");

		var srcName = src.attr("name");
		var dstName = dst.attr("name");

		var srcX = src.attr("cx");
		var srcY = src.attr("cy");

		var dstX = dst.attr("cx");
		var dstY = dst.attr("cy");	

		var dstXforPath = dstX - srcX;
		var dstYforPath = dstY - srcY;

		createPath(srcX,srcY,dstXforPath,dstYforPath,key,action);
		createCircle(srcX,srcY,key,action);
		createCircle(dstX,dstY,key,action);

		createText(srcName,srcX,srcY,key,idSource);
		createText(dstName,dstX,dstY,key,idDes);
	}

	function createPath(srcX,srcY,dstX,dstY,key,action)
	{
		var strPath = "M"+srcX+" "+srcY+" q 100 -200 "+dstX+" "+dstY;

		var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newPath.setAttribute('d',strPath);
		newPath.setAttribute('class',"path");
		newPath.setAttribute('fill',"none");
		//newPath.setAttribute('stroke',"red");
		newPath.setAttribute("action", action);
		newPath.setAttribute('key',key);

		$("svg").append(newPath);
	}

	function createCircle(x,y,key,action)
	{
		var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		
		var colorFill = "#b8b894cf";
		var colorStroke = "#8a8a5c";
		
		if(action=="ALLOW")
		{
			colorFill="#00cc44d4";
			colorStroke="#00802b";
		}else if(action="DROP")
		{
			colorFill="#ff4d4dc4";
			colorStroke="#cc0000";
		}
		
		newCircle.setAttribute("r","10");
	 	newCircle.setAttribute("cx",x);
	 	newCircle.setAttribute("cy",y);
	 	newCircle.setAttribute("fill","none");
		newCircle.setAttribute("class","zoomCircle");
		newCircle.setAttribute("stroke","none");
		newCircle.setAttribute("key",key);

		var circleAnimate = "<animate attributeName='r' from='0' to='10' dur='1.5s' repeatCount='indefinite'/>"
		+"<animate attributeName='fill' values='"+colorFill+"' dur='1s' begin='0s' repeatCount='indefinite'/>"
		+"<animate attributeName='stroke' values='"+colorStroke+"' dur='1s' begin='0s' repeatCount='indefinite' />";

		newCircle.innerHTML = circleAnimate;
		
		$("svg").append(newCircle);
	}

	function createText(text,x,y,key,code)
	{
		var newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');

		newText.setAttribute('x', x);
		newText.setAttribute('y', y);
		newText.setAttribute('fill','orange');
		newText.setAttribute('font-size','12px');
		newText.setAttribute('key', key);

		newText.innerHTML = text;

		$("svg").append(newText);
		
		var circle = $("circle[code='"+code+"']");
		var side = circle.attr("side");
		var submapId = circle.attr("submap");
		
		if(submapId!=-1)
		{
			$("text[key='"+key+"']").on("click",function(){
				var left,right;
				
				if(side=='left')
				{
					left = submapId;
					right = rightId;
				}
				else
				{
					left = leftId;
					right = submapId;
				}
				
				var src = "?left="+left+"&right="+right+"&type="+typeData;
				
				if(realtime)
				{
					src+="&play=realtime";
				}
				else
				{
					var date = $("#formdate").val();
					var hour = $("#formhour").val();
					var fromMinute = $("#formfrommenute").val();
					var toMinute = $("#formtomenute").val();
					
					src+="&play=replay&date="+date+"&hour="+hour+"&from="+fromMinute+"&to="+toMinute;
				}
				
				window.open(
						  src,
						  '_blank' // <- This is what makes it open in a new window.
						);
			});
		}
	}
	
	function removeAllDisplayElement()
	{
		$("path").remove();
		$("circle[class='zoomCircle']").remove();
		$("text").remove();
	}
	
	function createDetailRow(idSource,nameSource,ipSource,idDes,nameDes,ipDes,action,date,srcport,dstport,protocol,sourceIp){
		if(!$("circle[code='"+idSource+"']").length || !$("circle[code='"+idDes+"']").length)
		{
			//console.log('id source or id des doesn\'t exits -- '+idSource+" -- "+idDes);
			return "";
		}

		if(idSource==idDes)
		{
			return "";
		}
		
		var sourceDisplay = (nameSource==null?idSource:nameSource);
		var desDisplay = (nameDes==null?idDes:nameDes);
		
		var imgSource = idSource.length==2 ? idSource.toLowerCase() : "ukn";
		var imgDes = idDes.length==2 ? idDes.toLowerCase() : "ukn";
		var newDate = new Date(date);
		var day = "0"+newDate.getDate();
		var month = "0"+(newDate.getMonth()+1);
		var year = newDate.getFullYear();
		var hours = "0"+newDate.getHours();
		var minutes = "0" + newDate.getMinutes();
		var seconds = "0" + newDate.getSeconds();
		
		var formattedTime = year+"-"+month.substr(-2)+"-"+day.substr(-2)+" "+hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		var rowString = "<div class='detailrow animated flipInX'>"+
		"<div class='source'>"+sourceIp+"</div>"+
		"<div class='src'><span class='filter-row' filter-id='filter-location' idsrc='"+idSource+"' iddes='"+idDes+"' direction='from'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgSource+".svg' title='"+sourceDisplay+"' /> "+sourceDisplay+" ("+ipSource+")</span></div>"+
		"<div class='src_port'><span class='filter-row' filter-id='srcport' value-filter='"+srcport+"'>"+srcport+"</span></div>"+
		"<div class='dst'><span class='filter-row' filter-id='filter-location' idsrc='"+idSource+"' iddes='"+idDes+"' direction='to'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgDes+".svg' title='"+desDisplay+"' /> "+desDisplay+" ("+ipDes+")</span></div>"+
		"<div class='dst_port'><span class='filter-row' filter-id='dstport' value-filter='"+dstport+"'>"+dstport+"</span></div>"+
		"<div class='protocol'><span class='filter-row' filter-id='protocol' value-filter='"+protocol+"'>"+protocol+"</span></div>"+
		"<div class='action'><span class='filter-row' filter-id='action' value-filter='"+action+"' action='"+action+"'>"+action+"</span></div>"+
		"<div class='date'>"+formattedTime+"</div>"+
		"</div>";
		return rowString;
	}
	
	function createDetailRowSnort(sourceIp,sourceName,sourceCode,desIp,desName,desCode,signature,sourcePort,desPort,date,classification,protocol,priority){
		if(!$("circle[code='"+sourceCode+"']").length || !$("circle[code='"+desCode+"']").length)
		{
			//console.log('id source or id des doesn\'t exits -- '+idSource+" -- "+idDes);
			return "";
		}

		if(sourceCode==desCode)
		{
			return "";
		}
		
		var flagSource = sourceCode.length > 2 ? 'ukn' : sourceCode.toLowerCase();
		var flagDes = desCode.length > 2 ? 'ukn' : desCode.toLowerCase();
		
		var newDate = new Date(date);
		var day = "0"+newDate.getDate();
		var month = "0"+(newDate.getMonth()+1);
		var year = newDate.getFullYear();
		var hours = "0"+newDate.getHours();
		var minutes = "0" + newDate.getMinutes();
		var seconds = "0" + newDate.getSeconds();
		
		var formattedTime = year+"-"+month.substr(-2)+"-"+day.substr(-2)+" "+hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		var rowString = "<div class='detailrow animated flipInX'>"+
		"<div class='src'><span class='filter-row' filter-id='filter-location' idsrc='"+sourceCode+"' iddes='"+desCode+"' direction='from'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagSource+".svg' title='"+sourceIp+"' /> "+sourceName+" ("+sourceIp+")</span></div>"+
		"<div class='srcport'><span class='filter-row' filter-id='srcport' value-filter='"+sourcePort+"'>"+sourcePort+"</span></div>"+
		"<div class='dst'><span class='filter-row' filter-id='filter-location' idsrc='"+sourceCode+"' iddes='"+desCode+"' direction='to'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagDes+".svg' title='"+desIp+"' /> "+desName+" ("+desIp+")</span></div>"+
		"<div class='dstport'><span class='filter-row' filter-id='dstport' value-filter='"+desPort+"'>"+desPort+"</span></div>"+
		"<div class='protocol'><span class='filter-row' filter-id='protocol' value-filter='"+protocol+"'>"+protocol+"</span></div>"+
		"<div class='priority'><span class='filter-row' filter-id='priority' value-filter='"+priority+"' priority='"+priority+"'>"+(priority == 1 ? "HIGH" : priority == 2 ? "MEDIUM" : "LOW")+"</span></div>"+
		"<div class='sig'><span class='filter-row' filter-id='signame' value-filter='"+signature+"' title='"+signature+"'>"+signature+"</span></div>"+	
		"<div class='classification'><span class='filter-row' filter-id='classification' value-filter='"+classification+"' title='"+classification+"'>"+classification+"</span></div>"+	
		"<div class='date'>"+formattedTime+"</div>"+
		"</div>";
		return rowString;
	}

	function createDetailRowTrigger(item){
	 	var rowString = "<div class='detailrow animated flipInX'>"+
	 	"<div class='srcip'>"+item.SOURCEIP+"</div>"+
	 	"<div class='program'>"+item.PROGRAM+"</div>"+
	 	"<div class='message'><span>"+item.MESSAGE+"</span></div>"+
	 	"<div class='date'>"+timeConverter(item.DATE)+"</div>"+
	 	"</div>";
	 	
	 	return rowString;
	 }
	
	function timeConverter(UNIX_timestamp){
		var today = new Date(UNIX_timestamp);
		var date = String(today.getDate()).padStart(2, '0');
		var month = String(today.getMonth() + 1).padStart(2, '0');
		var year = today.getFullYear();
		var hour = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		if(date<10)
			date='0'+date;
//		if(month<10)
//			month='0'+month;
		if(hour<10)
			hour='0'+hour;
		if(min<10)
			min='0'+min;
		if(sec<10)
			sec='0'+sec;
		var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
		return time;
	}

	function timeConverter2(UNIX_timestamp){
		var today = new Date(UNIX_timestamp);
		var date = String(today.getDate()).padStart(2, '0');
		var month = String(today.getMonth() + 1).padStart(2, '0');
		var year = today.getFullYear();
		var hour = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		if(date<10)
			date='0'+date;
		
		if(hour<10)
			hour='0'+hour;
		if(min<10)
			min='0'+min;
		if(sec<10)
			sec='0'+sec;
		var time = year+"-"+month+"-"+date+" "+hour+":"+min+":"+sec;
		return time;
	}
	
	$(window).on('resize', function(){
     	resizeDetailPanel();
		rePosition();
	});
	
	var intervalSetHeight;
	function resizeDetailPanel()
	{
		if($("#svg-container").height()==20)
		{
			console.log("recursive for height");

			intervalSetHeight = setInterval(function() {
				resizeDetailPanel();
				rePosition();
			}, 500);

			return;
		}
		else
		{
			clearInterval(intervalSetHeight);
		}

		var heightFull = $("body").height();

		var heightFormSearch = $("#form-select-date").outerHeight();

		var heightSVG = $("#svg-container").height();

		var heightHeader = $(".detail-header").height();

		var heightDetail = heightFull - (heightFormSearch + heightSVG + heightHeader + 20);

		//console.log(heightFull+"--"+heightFormSearch+"--"+heightSVG+"--"+heightHeader+"--"+heightDetail);
		
		if(typeData=="snort")
		{
			heightDetail-=43;
		}

		$(".detail-body").css("height",heightDetail+"px");
		
		/*if(typeData=="connectivity")
		{
			getTrigger();

			var loadTrigger=setInterval(function() {
				getTrigger();
			}, 60000);
		}*/
	}
	var intervalHeader;

	rePositionHeader();
	function rePositionHeader()
	{
		if($("#maps-name").width()==0)
		{
			console.log("recursive for height");

			intervalHeader = setInterval(function() {
				rePositionHeader();
			}, 500);

			return;
		}
		else
		{
			clearInterval(intervalHeader);
		}
		var typeMapNameleft = $("#type-map-name").width() / 2;
		$("#type-map-name").css("left","calc(50% - "+typeMapNameleft+"px)");
		var typeMapNameleft = $("#maps-name").width() / 2;
		$("#maps-name").css("left","calc(50% - "+typeMapNameleft+"px)");
		console.log($("#type-map-name").width());
	}
	function rePosition()
	{
		var bodyWidth = $("body").width();
		var svgWidth = $("#svg-container").width();
		
		var result = bodyWidth-svgWidth;
//		console.log("body "+bodyWidth+" svg "+svgWidth+" result "+result);
		if(result>0)
			$("#svg-container").css("margin-left",(result/2));
	}
});