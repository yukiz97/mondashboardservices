$(document).ready(function(){
	var dynamicMapUrl = url+"dynamicmap/";
	var camservice = url+"camservice/";
	
	var params = new window.URLSearchParams(window.location.search);
	var typeData;
	
	var svgTag = "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='1900px' height='600px' viewBox='0 0 1900 600' enable-background='new 0 0 1900 600' xml:space='preserve' id = 'svg5718'>";
	var gradientAllow = "<linearGradient id='grad-allow'> <stop stop-color='#11998e'/> <stop offset='100%' stop-color='#38ef7d'/> </linearGradient>";
	var gradientDeny = "<linearGradient id='grad-deny'> <stop stop-color='#4d0000'/> <stop offset='100%' stop-color='#ff3333'/> </linearGradient>";
	var gradientOther = "<linearGradient id='grad-other'> <stop stop-color='#C9D6FF'/> <stop offset='100%' stop-color='#E2E2E2'/> </linearGradient>";

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

	var realtime = false;
	var myInterval;
	
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
	}
	else if(typeData=="snort")
	{
		$("#type-map-name").html("BẢN ĐỒ THEO DÕI DẤU HIỆU TẤN CÔNG MẠNG")
		$("#detail-c").css("display","inline-block");
	}
	
	loadValueForForm();
	getDynamicMap();
	
	$("#btn-replay").on("click",function(){
		removeAllDisplayElement();
		clearInterval(myInterval);
		realtime = false;
		getMainData();
	});

	$("#btn-realtime").on("click",function(){
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
	});
	
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
				});
				mapRight.items.forEach(function(item){
					circleString += "<circle code='"+item.code+"' name='"+item.name+"' fill='#ED1C24' cx='"+(item.x+950)+"' cy='"+item.y+"' submap='"+item.mapLevel2Id+"' side='right' r='1'/>";
				});
				$("#svg-container").append(svgTag+gradientAllow+gradientDeny+gradientOther+circleString+"</svg>");
			
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
				if(typeData=="connectivity")
				{
					clearInterval(intervalDetailA);
					indexDetailA = 0;
					arrayDetailA = [];
					
					var countItem = 0;
					data.forEach(function(item){
						arrayData.push(item.from+"-"+item.to);
						appendDisplay(item.from,item.to,item.action);
						
						var detail = createDetailRow(item.from,item.fromName,item.src_ip,item.to,item.toName,item.dst_ip,item.action,item.date,item.src_port,item.dst_port,item.protocol,item.sourceip);
						if(detail!="")
						{
							arrayDetailA[countItem++] = detail;
						}
					});
					
					console.log(arrayData);
					
					$("#attack-count").html(countItem);
					displayToScreenDetailA();

					intervalDetailA = setInterval(function() {
						displayToScreenDetailA();
					}, 5000);
				}
				else
				{
					clearInterval(intervalDetailC);
					indexDetailC = 0;
					arrayDetailC = [];
					
					var countItem = 0;
					data.forEach(function(item){
				  		if(item.id !== "VN_VN")
			  			{
				  			var detail = createDetailRowSnort(item.src_ip,item.fromname,item.from,item.dst_ip,item.toname,item.to,item.sig_name,item.src_port,item.dst_port,item.date,item.classification,item.protocol,item.priority);
							if(detail!="")
							{
								arrayDetailC[countItem++] = detail;
							}
							arrayData.push(item.from+"-"+item.to);
							appendDisplay(item.from,item.to,null);
			  			}
					});
					console.log(arrayData);
					
					displayToScreenDetailC();

					intervalDetailC = setInterval(function() {
						displayToScreenDetailC();
					}, 5000);
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
	
	function displayToScreenDetailA()
	{
		$("#mar-detail-a").html("");
		if(arrayDetailA.length==0)
		{
			return;
		}

		var heightDisplay = $("#mar-detail-a").height();

		var limit = returnLimit(heightDisplay,30);

		var i;

		/*console.log(heightDisplay);
		console.log("start: "+indexDetailA);
		console.log("limit: "+limit);
		console.log("array size: "+arrayDetailA.length);*/

		var checkOutOfArray = false;
		for(i = indexDetailA;i<(indexDetailA+limit);i++)
		{
			$("#mar-detail-a").append(arrayDetailA[i]);
			if(i==(arrayDetailA.length - 1))
			{
				checkOutOfArray = true;
				break;
			}
		}

		if(checkOutOfArray)
		{
			indexDetailA = 0;
		}
		else
		{
			indexDetailA = i;
		}
	} 

	function displayToScreenDetailB()
	{
		$("#mar-detail-b").html("");
		if(arrayDetailB.length==0)
		{
			return;
		}

		var heightDisplay = $("#mar-detail-b").height();

		var limit = returnLimit(heightDisplay,23);

		var i;

		/*console.log(heightDisplay);
		console.log("start: "+indexDetailB);
		console.log("limit: "+limit);
		console.log("array size: "+arrayDetailB.length);*/

		var checkOutOfArray = false;
		for(i = indexDetailB;i<(indexDetailB+limit);i++)
		{
			$("#mar-detail-b").append(arrayDetailB[i]);
			if(i==(arrayDetailB.length - 1))
			{
				checkOutOfArray = true;
				break;
			}
		}

		if(checkOutOfArray)
		{
			indexDetailB = 0;
		}
		else
		{
			indexDetailB = i;
		}
	}
	
	function displayToScreenDetailC()
	{
		$("#mar-detail-c").html("");
		if(arrayDetailC.length==0)
		{
			return;
		}

		var heightDisplay = $("#mar-detail-c").height();

		var limit = returnLimit(heightDisplay,30);

		var i;

		var checkOutOfArray = false;
		for(i = indexDetailC;i<(indexDetailC+limit);i++)
		{
			$("#mar-detail-c").append(arrayDetailC[i]);
			if(i==(arrayDetailC.length - 1))
			{
				checkOutOfArray = true;
				break;
			}
		}

		if(checkOutOfArray)
		{
			indexDetailC = 0;
		}
		else
		{
			indexDetailC = i;
		}
	}
	
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

		var rowString = "<div action='"+action+"' class='detailrow animated flipInX'>"+
		"<div class='source'>"+sourceIp+"</div>"+
		"<div class='src'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgSource+".svg' title='"+sourceDisplay+"' /> "+sourceDisplay+" ("+ipSource+")</div>"+
		"<div class='src_port'>"+srcport+"</div>"+
		"<div class='dst'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgDes+".svg' title='"+desDisplay+"' /> "+desDisplay+" ("+ipDes+")</div>"+
		"<div class='dst_port'>"+dstport+"</div>"+
		"<div class='protocol'>"+protocol+"</div>"+
		"<div class='action'>"+action+"</div>"+
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
		"<div class='src'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagSource+".svg' title='"+sourceIp+"' /> "+sourceIp+"</div>"+
		"<div class='srcport'>"+sourcePort+"</div>"+
		"<div class='dst'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagDes+".svg' title='"+desIp+"' /> "+desIp+"</div>"+
		"<div class='dstport'>"+desPort+"</div>"+
		"<div class='protocol'>"+protocol+"</div>"+
		"<div class='priority'>"+priority+"</div>"+
		"<div class='sig'>"+signature+"</div>"+	
		"<div class='classification'>"+classification+"</div>"+	
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
		
		if(typeData=="connectivity")
		{
			getTrigger();

			var loadTrigger=setInterval(function() {
				getTrigger();
			}, 60000);
		}
	}
	
	function rePosition()
	{
		var bodyWidth = $("body").width();
		var svgWidth = $("#svg-container").width();
		
		var result = bodyWidth-svgWidth;
		if(result>0)
			$("#svg-container").css("margin-left",(result/2));
	}
});