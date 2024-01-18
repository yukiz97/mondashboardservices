var filterWhitelist = [];
var filterSource = [];
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

var arrCountryCode = ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","YE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR","IO","BN","BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC","OK","MC","DG","CK","CR","HR","CU","CW","CY","CZ","CI","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PT","FG","AG","MG","ED","EG","HG","IG","RG","LG","DG","PG","UG","TG","GG","NG","WG","YH","TM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","PK","RK","WK","GL","AL","VL","BL","SL","RL","YL","IL","TL","UM","OM","GM","WM","YM","VM","LM","TM","HM","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MN","AN","RN","PN","LN","CN","ZN","IN","EN","GN","UN","FM","PN","OO","MP","KP","WP","SP","AP","GP","YP","EP","HP","NP","LP","TP","PR","QA","MK","RO","RU","RW","RE","BL","SH","KN","LC","MF","PM","VC","WS","MS","TS","AS","NR","SS","CS","LS","GS","SX","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","KT","OT","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","UM","US","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW","AX"];

var arrayCodeMapLeft = [];
var arrayCodeMapRight = [];

var strListItemMapLeft = "";
var strListItemMapRight = "";

var dynamicMapUrl = url+"dynamicmap/";
var camservice = url+"camservice/";
var realtime = false;

var startDate;
var endDate;
var whitelist;

var isUseWhitelist = false;

const mapWhitelist = new Map(); 
const mapAddressRecognize = new Map(); 

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
	var gradientAllowNotWhitelist = "<linearGradient id='grad-notwhitelist'> <stop stop-color='#f1a50e'/> <stop offset='100%' stop-color='#f1a50e'/> </linearGradient>";

	var leftCode;
	var rightCode;
	
	var dataReport = [];
	
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
		$("#source").hide();
		
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
	
	$("#btn-download").on("click",function(){
		if(typeData=="connectivity")
		{
			dataReport.unshift(["Num","Source Data","Source IP","Source Port","Destination IP","Destination Port","Action","Protocol","Timestamp"]);
		}
		else if(typeData=="snort")
		{
			dataReport.unshift(["Num","Source IP","Source Port","Destination IP","Destination Port","Protocol","Priority","Signame","classification","Timestamp"]);
		}
		let csv = arrayToCsv(dataReport);
		
		downloadBlob(csv,"detail.csv", 'text/csv;charset=utf-8;');
	});
	
	$("#cb-whitelist").change(function(){
		isUseWhitelist = this.checked;
		console.log(isUseWhitelist);
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
		if(params.has('template'))
		{
			rqUrl+="&template="+params.get("template");
		}
		$.ajax({
			url: rqUrl,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(map){
				console.log(map);
				var mapLeft = map.mapLeft;
				var mapRight = map.mapRight;
				whitelist = map.whitelist;
				var arrUserIPRecognize = map.useriprecognize;
				
				arrUserIPRecognize.forEach(function(item){
					mapAddressRecognize.set(item.address,item.orgname+"/"+item.username);
				});
				
				console.log(mapAddressRecognize);
				
				$("#svg-container #img-left").attr("src","data:image/svg+xml;charset=utf-8;base64,"+mapLeft.background);
				$("#svg-container #img-right").attr("src","data:image/svg+xml;charset=utf-8;base64,"+mapRight.background);
				
				var circleString = "";
				var optionUknown = "<option value='unknown'>--Không xác định</option>";
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
				
				var uknCircle = "<circle code='unknown' name='Không xác định' fill='#ED1C24' cx='1000' cy='500' submap='-1' r='1'/>";

				
				$("#filter-location div[combobox='left'] select").append("<option value='all'>Tất cả</option><option value='map-left'>"+mapLeft.mapName+"</option>"+strListItemMapLeft+"<option value='map-right'>"+mapRight.mapName+"</option>"+strListItemMapRight+optionUknown);
				$("#filter-location div[combobox='right'] select").append("<option value='all'>Tất cả</option><option value='map-right'>"+mapRight.mapName+"</option>"+strListItemMapRight+"<option value='map-left'>"+mapLeft.mapName+"</option>>"+strListItemMapLeft+optionUknown);
				
				$("#svg-container").append(svgTag+gradientAllow+gradientDeny+gradientOther+gradientHigh+gradientMedium+gradientLow+gradientAllowNotWhitelist+circleString+uknCircle+"</svg>");
			
				leftCode = mapLeft.code;
				rightCode = mapRight.code;
				resizeDetailPanel();
				loadFilter(map.filter);
				
				$(".maps-name").html(mapLeft.mapName+" - "+mapRight.mapName);
				
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
		//console.log(filterSigname);
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

			startDate = date+" "+hour+":"+fromMinute+":00";
			endDate = date+" "+hour+":"+toMinute+":59";
    	}

		console.log(startDate+"--"+endDate);
		
		var typeUrl = camservice;
		var bonusParam="";
		if(typeData=="connectivity"){
			typeUrl+="getdata_connectivity";
			if(filterSource.length > 0){
				bonusParam="&source="+filterSource.toString();
			}
		}
		else
			typeUrl+="getdata_snort";
		
		var rqUrl = typeUrl+"?fromDate="+startDate+"&toDate="+endDate+"&leftCode="+leftCode+" "+leftId+"&rightCode="+rightCode+" "+rightId+bonusParam;
		
		var  arrayData = [];
		$(".loader").show();
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
					dataReport = [];
					//console.log(data);
					var countItem = 0;
					data.forEach(function(item){
						var idSource = item.from;
						var idDes = item.to;
						var idItem;
						/*if(!$("circle[code='"+idSource+"']").length && $("circle[code='"+idDes+"']").length)
						{
							idItem = "unknown-"+item.to;
						} else if($("circle[code='"+idSource+"']").length && !$("circle[code='"+idDes+"']").length){
							idItem = item.from+"-unknown";
						} else {
							
						}*/
						
						if($("circle[code='world']").length>0){
							if(arrCountryCode.includes(idSource)){
								idSource = "world";
							}	
							
							if(arrCountryCode.includes(idDes)){
								idDes = "world";
							}		
						}
						
						idItem = idSource+"-"+idDes;
						var srcport = item.src_port;
						var dstport = item.dst_port;
						var protocol = item.protocol;
						var action = item.action;
						var srcip = item.src_ip;
						var dstip = item.dst_ip;
						var keyip = srcip+"-"+dstip;
						var isWhitelist = false;
						
						if(mapWhitelist.has(keyip)){
							isWhitelist = mapWhitelist.get(keyip);
						} else {
							var checkDstInWhitelist = false;
							whitelist.forEach(function (item) {
								if(isIPInSubnet(dstip,item.sourceIp)){
									checkDstInWhitelist = true;
								}
							});
							
							if(checkDstInWhitelist){
								whitelist.forEach(function (item) {
								item.listRangeIp.forEach(function (itemip) {
									if(isIPInSubnet(srcip,itemip)){
										if(isIPInSubnet(dstip,item.sourceIp)){
											isWhitelist = true;
										}
									}
								});
							});
							} else {
								isWhitelist = true;
							}
							
							mapWhitelist.set(keyip,isWhitelist);
						}
												
						/*console.log(idItem);
						console.log(filterLocation);
						console.log(filterLocationSrcAll);
						console.log(filterLocationDesAll);
						console.log(filterLocationDesForMapLeft);
						console.log(filterLocationDesForMapRight);
						console.log(filterLocationSrcForMapLeft);
						console.log(filterLocationSrcForMapRight);*/
						if(isUseWhitelist){
							if(filterWhitelist.length == 1){
								if(filterWhitelist.includes("inwl") && !isWhitelist)
									return;
								if(filterWhitelist.includes("notinwl") && isWhitelist)
									return;
							}
						}
						var checkFilter = false;
						if(filterLocationSrcAll.length > 0 && !checkFilter){
							if(
								(filterLocationSrcAll.includes("map-left") && arrayCodeMapLeft.includes(idSource))
								|| (filterLocationSrcAll.includes("map-right") && arrayCodeMapRight.includes(idSource))
								|| filterLocationSrcAll.includes(idSource)
								){
									checkFilter = true;
							} else{
								checkFilter = false;
							}
						}
						if(filterLocationDesAll.length > 0 && !checkFilter){
							if(
								(filterLocationDesAll.includes("map-left") && arrayCodeMapLeft.includes(idDes))
								|| (filterLocationDesAll.includes("map-right") && arrayCodeMapRight.includes(idDes))
								|| filterLocationDesAll.includes(idDes) 
								){
								checkFilter = true;
							} else{
								checkFilter = false;
							}
						} 
						if(filterLocationDesForMapLeft.length > 0 && !checkFilter){
							if(arrayCodeMapLeft.includes(idSource) && filterLocationDesForMapLeft.includes(idDes)){
								checkFilter = true;
							} else {
								checkFilter = false;
							}
						}
						if(filterLocationDesForMapRight.length > 0 && !checkFilter){
							if(arrayCodeMapRight.includes(idSource) && filterLocationDesForMapRight.includes(idDes)){
								checkFilter = true;
							} else {
								checkFilter = false;
							}
						}
						if(filterLocationSrcForMapLeft.length > 0 && !checkFilter){
							if(arrayCodeMapLeft.includes(idDes) && filterLocationSrcForMapLeft.includes(idSource)){
								checkFilter = true;
							} else {
								checkFilter = false;
							}
						}
						if(filterLocationSrcForMapRight.length > 0 && !checkFilter){
							if(arrayCodeMapRight.includes(idDes) && filterLocationSrcForMapRight.includes(idSource)){
								checkFilter = true;
							} else {
								checkFilter = false;
							}
						}
						if(filterLocation.length > 0 && !checkFilter) {
							if(filterLocation.includes("map-left-map-right") || filterLocation.includes("map-right-map-left") || filterLocation.includes("map-left-map-left") || filterLocation.includes("map-right-map-right")){
								//console.log(filterLocation.includes("map-left-map-left"));
								if(
									(filterLocation.includes("map-left-map-right") && arrayCodeMapLeft.includes(idSource) && arrayCodeMapRight.includes(idDes)) 
									|| (filterLocation.includes("map-right-map-left") && arrayCodeMapLeft.includes(idDes) && arrayCodeMapRight.includes(idSource))
									|| (filterLocation.includes("map-left-map-left") && arrayCodeMapLeft.includes(idSource) && arrayCodeMapLeft.includes(idDes))
									|| (filterLocation.includes("map-right-map-right") && arrayCodeMapRight.includes(idSource) && arrayCodeMapRight.includes(idDes))
									){
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							} else {
								if(filterLocation.includes(idItem)) {
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							}
						}
						if(filterLocationSrcAll.length> 0 || filterLocation.length> 0 ||filterLocationDesAll.length> 0||filterLocationDesForMapLeft.length> 0||filterLocationDesForMapRight.length> 0||filterLocationSrcForMapLeft.length> 0||filterLocationSrcForMapRight.length> 0){
							if(!checkFilter)
								return;
						}
						
						if(filterSrcport.length > 0 && !filterSrcport.includes(srcport))
							return;
						if(filterDstport.length > 0 && !filterDstport.includes(dstport))
							return;
						if(filterProtocol.length > 0 && !filterProtocol.includes(protocol))
							return;
						if(filterAction.length > 0 && !filterAction.includes(action))
							return;
							
						arrayData.push(idItem);
						appendDisplay(item.from,item.to,item.action,isWhitelist);
						
						var detail = createDetailRow(item.from,item.fromName,item.src_ip,item.to,item.toName,item.dst_ip,action,item.date,srcport,dstport,protocol,item.sourceip,isWhitelist);
						if(detail!="")
						{
							arrayDetailA[countItem++] = detail;
							var rowReport = [countItem,item.sourceip, item.src_ip+"("+item.from+")",srcport,item.dst_ip+"("+item.to+")",dstport,action,protocol,formatDate(item.date)];
							dataReport.push(rowReport);
						}
					});
					
					//console.log(arrayData);
					
					$("#connect-count").html(countItem);
					displayToScreenDetailA("forward");

					if(autoChangePage){
						intervalDetailA = setInterval(function() {
							displayToScreenDetailA("forward");
						}, 5000);
					}
					$(".loader").hide();
				} 
				else
				{
					clearInterval(intervalDetailC);
					indexDetailC = 0;
					arrayDetailC = [];
					dataReport = [];
					
					var countItem = 0;
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
							
							var checkFilter = false;
							if(filterLocationSrcAll.length > 0 && !checkFilter){
								if(
									(filterLocationSrcAll.includes("map-left") && arrayCodeMapLeft.includes(idSource))
									|| (filterLocationSrcAll.includes("map-right") && arrayCodeMapRight.includes(idSource))
									|| filterLocationSrcAll.includes(idSource)
									){
										checkFilter = true;
								} else{
									checkFilter = false;
								}
							}
							if(filterLocationDesAll.length > 0 && !checkFilter){
								if(
									(filterLocationDesAll.includes("map-left") && arrayCodeMapLeft.includes(idDes))
									|| (filterLocationDesAll.includes("map-right") && arrayCodeMapRight.includes(idDes))
									|| filterLocationDesAll.includes(idDes) 
									){
									checkFilter = true;
								} else{
									checkFilter = false;
								}
							} 
							if(filterLocationDesForMapLeft.length > 0 && !checkFilter){
								if(arrayCodeMapLeft.includes(idSource) && filterLocationDesForMapLeft.includes(idDes)){
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							}
							if(filterLocationDesForMapRight.length > 0 && !checkFilter){
								if(arrayCodeMapRight.includes(idSource) && filterLocationDesForMapRight.includes(idDes)){
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							}
							if(filterLocationSrcForMapLeft.length > 0 && !checkFilter){
								if(arrayCodeMapLeft.includes(idDes) && filterLocationSrcForMapLeft.includes(idSource)){
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							}
							if(filterLocationSrcForMapRight.length > 0 && !checkFilter){
								if(arrayCodeMapRight.includes(idDes) && filterLocationSrcForMapRight.includes(idSource)){
									checkFilter = true;
								} else {
									checkFilter = false;
								}
							}
							if(filterLocation.length > 0 && !checkFilter) {
								if(filterLocation.includes("map-left-map-right") || filterLocation.includes("map-right-map-left") || filterLocation.includes("map-left-map-left") || filterLocation.includes("map-right-map-right")){
									//console.log(filterLocation.includes("map-left-map-left"));
									if(
										(filterLocation.includes("map-left-map-right") && arrayCodeMapLeft.includes(idSource) && arrayCodeMapRight.includes(idDes)) 
										|| (filterLocation.includes("map-right-map-left") && arrayCodeMapLeft.includes(idDes) && arrayCodeMapRight.includes(idSource))
										|| (filterLocation.includes("map-left-map-left") && arrayCodeMapLeft.includes(idSource) && arrayCodeMapLeft.includes(idDes))
										|| (filterLocation.includes("map-right-map-right") && arrayCodeMapRight.includes(idSource) && arrayCodeMapRight.includes(idDes))
										){
										checkFilter = true;
									} else {
										checkFilter = false;
									}
								} else {
									if(filterLocation.includes(idItem)) {
										checkFilter = true;
									} else {
										checkFilter = false;
									}
								}
							}
							if(filterLocationSrcAll.length> 0 || filterLocation.length> 0 ||filterLocationDesAll.length> 0||filterLocationDesForMapLeft.length> 0||filterLocationDesForMapRight.length> 0||filterLocationSrcForMapLeft.length> 0||filterLocationSrcForMapRight.length> 0){
								if(!checkFilter)
									return;
							}
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
								var rowReport = [countItem, item.src_ip+"("+item.from+")",srcport,item.dst_ip+"("+item.to+")",dstport,protocol,priority,signame,classification,formatDate(item.date)];
								dataReport.push(rowReport);
							}
							arrayData.push(idItem);
							
							appendDisplay(item.from,item.to,(priority == 1 ? "HIGH" : priority == 2 ? "MEDIUM" : "LOW"),false);
			  			}
					});
					//console.log(arrayData);
					
					$("#attack-count").html(countItem);					
					displayToScreenDetailC("forward");

					if(autoChangePage){
						intervalDetailC = setInterval(function() {
							displayToScreenDetailC("forward");
						}, 5000);
					}
					$(".loader").hide();
				}
				$("svg path").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						//console.log("remove path"+key);
					}
					else
					{
						//console.log("exist path "+key);
					}
				});
				$("svg circle[class='zoomCircle']").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						//console.log("remove circle "+key);
					}
					else
					{
						//console.log("exist circle "+key);
					}
				});
				$("svg text").each(function() {
					var key = $(this).attr("key");
					if(arrayData.indexOf(key)===-1)
					{
						$(this).remove();
						//console.log("remove text "+key);
					}
					else
					{
						//console.log("exist text "+key);
					}
				});
			},
			error: function(){
				console.log("get data dynamic map list fail!!!!!");
			}
		});
		
		//console.log(mapWhitelist);
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
			strMinute+="<option value='"+i+"' "+(i==59 ? "selected" : "")+">"+i+"</option>";
		}

		$("#formhour").html(strHour);
		$("#formfrommenute").html(strMinute.replace('selected',''));
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

		var limit = returnLimit(heightDisplay,30);
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
		var count = 0;
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
	
	$(".expand-detail").on("click",function(){
		var status = $(this).attr("status");
		if(status=="unexpand"){
			$(this).children("i").removeClass("fa-arrows-alt");
			$(this).children("i").addClass("fa-minus");
			
			$(this).attr("status","expanded");
			$(this).attr("title","thu nhỏ chi tiết");
			$("#svg-container").hide();
			resizeDetailPanel();
		} else if(status == "expanded"){
			$(this).children("i").removeClass("fa-minus");
			$(this).children("i").addClass("fa-arrows-alt");
			
			$(this).attr("status","unexpand");
			$(this).attr("title","Phóng to chi tiết");
			$("#svg-container").show();
			resizeDetailPanel();
		}
		
	});
	
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
	
	function appendDisplay(idSource,idDes,action,isWhitelist)
	{
		var idSrctmp = idSource;
		var idDestmp = idDes;
		
		if(!$("circle[code='"+idSource+"']").length && $("circle[code='"+idDes+"']").length){
			idSource = "unknown";
		} else if($("circle[code='"+idSource+"']").length && !$("circle[code='"+idDes+"']").length){
			idDes = "unknown";
		} else if(!$("circle[code='"+idSource+"']").length && !$("circle[code='"+idDes+"']").length){
			//console.log("NOT EXITST "+idSource+idDes);
			return;
		} 

		if($("circle[code='world']").length>0){
			if(arrCountryCode.includes(idSrctmp)){
				idSource = "world";
			}	
			
			if(arrCountryCode.includes(idDestmp)){
				idDes = "world";
			}		
		}

		var key = idSource+"-"+idDes;
		
		if(idSource==idDes)
		{
			return "";
		}

		if($("path[key='"+key+"'").length>0)
		{
			$("path[key='"+key+"'").attr('action',action);
			if(isUseWhitelist && !isWhitelist)
				$("path[key='"+key+"'").attr('whitelist',isWhitelist);
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
		
		createPath(srcX,srcY,dstXforPath,dstYforPath,key,action,isWhitelist);
		createCircle(srcX,srcY,key,action);
		createCircle(dstX,dstY,key,action);

		createText(srcName,srcX,srcY,key,idSource);
		createText(dstName,dstX,dstY,key,idDes);
	}

	function createPath(srcX,srcY,dstX,dstY,key,action,isWhitelist)
	{
		var strPath = "M"+srcX+" "+srcY+" q 100 -200 "+dstX+" "+dstY;

		var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		newPath.setAttribute('d',strPath);
		newPath.setAttribute('class',"path");
		newPath.setAttribute('fill',"none");
		newPath.setAttribute('stroke',"red");
		newPath.setAttribute("action", action);
		newPath.setAttribute('key',key);
		if(isUseWhitelist)
			newPath.setAttribute('whitelist',isWhitelist);

		$("svg").append(newPath);
	}

	function createCircle(x,y,key,action)
	{
		var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		
		var colorFill = "#b8b894cf";
		var colorStroke = "#8a8a5c";
		
		if(action.toLowerCase()=="allow" || action.toLowerCase()=="pass" || action.toLowerCase()=="permitted")
		{
			colorFill="#00cc44d4";
			colorStroke="#00802b";
		}else if(action="DROP" || action.toLowerCase()=="block" || action.toLowerCase()=="denied")
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
	
	function createDetailRow(idSource,nameSource,ipSource,idDes,nameDes,ipDes,action,date,srcport,dstport,protocol,sourceIp,isWhitelist){
		/*if(!$("circle[code='"+idSource+"']").length && $("circle[code='"+idDes+"']").length)
		{
			idSource = "unknown";
			nameSource = "Không xác định";
		} else if($("circle[code='"+idSource+"']").length && !$("circle[code='"+idDes+"']").length){
			idDes = "unknown";
			nameDes = "Không xác định";
		} else */
		if(!$("circle[code='"+idSource+"']").length && !$("circle[code='"+idDes+"']").length){
			return "";
		}

		if(idSource==idDes)
		{
			return "";
		}
		
		var addressReSrc = "", addressReDst = "";
		if(mapAddressRecognize.has(ipSource)){
			addressReSrc = " - "+mapAddressRecognize.get(ipSource);
		} 
		if(mapAddressRecognize.has(ipDes)){
			addressReDst = " - "+mapAddressRecognize.get(ipDes);
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
		var whitelisttext=isUseWhitelist?"whitelist='"+isWhitelist+"'" : "";
		var rowString = "<div class='detailrow animated flipInX' "+whitelisttext+">"+
		"<div class='source'>"+sourceIp+"</div>"+
		"<div class='src'><span class='filter-row' filter-id='filter-location' idsrc='"+idSource+"' iddes='"+idDes+"' direction='from'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgSource+".svg' title='"+sourceDisplay+"' /> "+sourceDisplay+" ("+ipSource+addressReSrc+")</span></div>"+
		"<div class='src_port'><span class='filter-row' filter-id='srcport' value-filter='"+srcport+"'>"+srcport+"</span></div>"+
		"<div class='dst'><span class='filter-row' filter-id='filter-location' idsrc='"+idSource+"' iddes='"+idDes+"' direction='to'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+imgDes+".svg' title='"+desDisplay+"' /> "+desDisplay+" ("+ipDes+addressReDst+")</span></div>"+
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
		
		var rowString = "<div class='detailrow animated flipInX'>"+
		"<div class='src'><span class='filter-row' filter-id='filter-location' idsrc='"+sourceCode+"' iddes='"+desCode+"' direction='from'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagSource+".svg' title='"+sourceIp+"' /> "+sourceName+" ("+sourceIp+")</span></div>"+
		"<div class='srcport'><span class='filter-row' filter-id='srcport' value-filter='"+sourcePort+"'>"+sourcePort+"</span></div>"+
		"<div class='dst'><span class='filter-row' filter-id='filter-location' idsrc='"+sourceCode+"' iddes='"+desCode+"' direction='to'><img style='width:17px;padding-bottom:5px;' src='images/flags/4x3/"+flagDes+".svg' title='"+desIp+"' /> "+desName+" ("+desIp+")</span></div>"+
		"<div class='dstport'><span class='filter-row' filter-id='dstport' value-filter='"+desPort+"'>"+desPort+"</span></div>"+
		"<div class='protocol'><span class='filter-row' filter-id='protocol' value-filter='"+protocol+"'>"+protocol+"</span></div>"+
		"<div class='priority'><span class='filter-row' filter-id='priority' value-filter='"+priority+"' priority='"+priority+"'>"+(priority == 1 ? "HIGH" : priority == 2 ? "MEDIUM" : "LOW")+"</span></div>"+
		"<div class='sig'><span class='filter-row' filter-id='signame' value-filter='"+signature+"' title='"+signature+"'>"+signature+"</span></div>"+	
		"<div class='classification'><span class='filter-row' filter-id='classification' value-filter='"+classification+"' title='"+classification+"'>"+classification+"</span></div>"+	
		"<div class='date'>"+formatDate(date)+"</div>"+
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
			//console.log("recursive for height");

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

		var heightSVG = !$("#svg-container").is(":hidden") ?  $("#svg-container").height() : 0;
		
		var heightHeader = $(".detail-header").height();

		var heightDetail = heightFull - (heightFormSearch + heightSVG + heightHeader + 20);

		//console.log(heightFull+"--"+heightFormSearch+"--"+heightSVG+"--"+heightHeader+"--"+heightDetail);
		
		if(typeData=="snort")
		{
			heightDetail-=22;
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

	//rePositionHeader();
	function rePositionHeader()
	{
		if($("#maps-name").width()==0)
		{
			//console.log("recursive for height");

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
	function formatDate(date){
		var newDate = new Date(date);
		var day = "0"+newDate.getDate();
		var month = "0"+(newDate.getMonth()+1);
		var year = newDate.getFullYear();
		var hours = "0"+newDate.getHours();
		var minutes = "0" + newDate.getMinutes();
		var seconds = "0" + newDate.getSeconds();
		
		var formattedTime = year+"-"+month.substr(-2)+"-"+day.substr(-2)+" "+hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		
		return formattedTime;
	}
	function arrayToCsv(data){
	  return data.map(row =>
	    row
	    .map(String)  // convert every value to String
	    .map(v => v.replaceAll('"', '""'))  // escape double quotes
	    .map(v => `"${v}"`)  // quote it
	    .join(',')  // comma-separated
	  ).join('\r\n');  // rows starting on new lines
	}
	function downloadBlob(content, filename, contentType) {
	  // Create a blob
	  var blob = new Blob([content], { type: contentType });
	  var url = URL.createObjectURL(blob);
	
	  // Create a link to download it
	  var pom = document.createElement('a');
	  pom.href = url;
	  pom.setAttribute('download', filename);
	  pom.click();
	}
	function loadFilter(filters){
		filters.forEach(function (item) {
			var type = item.type;
			var values = item.value.split(",");
			
		    switch (type) {
				case 'srcport':
				for(value in values) {
					addToArrayFilterType(type,values[value],filterSrcport);
				}
				break;
				case 'dstport':
				for(value in values) {
					addToArrayFilterType(type,values[value],filterDstport);
				}
				break;
				case 'filter-location':
					for(value in values) {
						var left = values[value].split("*")[0];
						var right = values[value].split("*")[1];
						
						$("#filter-location div[combobox='left'] select").val(left);
						$("#filter-location div[combobox='right'] select").val(right);
						
						$("#add-left-to-right").trigger("click");
					}
				break;
				case 'signame':
					for(value in values) {
						addToArrayFilterType(type,values[value],filterSigname);				
					}
					
				break;
				case 'classification':
					for(value in values) {
						addToArrayFilterType(type,values[value],filterClassification);				
					}
				break;
				case 'source':
				case 'protocol':
				case 'action':
				case 'priority':
					for(value in values) {
						var active = $(".btn-filterchoose[filter='"+type+"'][value-filter='"+values[value]+"']").attr("active");
						if(active=="false"){
							console.log("this is unactive");
							$(".btn-filterchoose[filter='"+type+"'][value-filter='"+values[value]+"']").trigger("click");
						} else {
							console.log("this is active");
						}					
					}
				break;
			}
		});
	}
	
	$(".loader").hide();
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

function isValidIP(ip) {
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    return ipPattern.test(ip);
}

function ipToInt(ip) {
    return ip.split('.').reduce(function (res, item) {
        return (res << 8) + parseInt(item, 10);
    }, 0);
}

function isIPInSubnet(ipToCheck, subnetWithMask) {
    if (isValidIP(subnetWithMask)) {
        // If subnetWithMask is an IP address
        const ipInt = ipToInt(ipToCheck);
        const subnetInt = ipToInt(subnetWithMask);

        return ipInt === subnetInt;
    } else {
        // If subnetWithMask is a subnet mask
        const [subnetAddress, subnetMask] = subnetWithMask.split('/');
        
        if (!isValidIP(subnetAddress)) {
            return false; // Exit early if subnet is not a valid IP
        }

        const ipInt = ipToInt(ipToCheck);
        const subnetInt = ipToInt(subnetAddress);

        const subnetMaskInt = -1 << (32 - parseInt(subnetMask, 10)) >>> 0;

        const networkAddress = subnetInt & subnetMaskInt;
        const ipNetwork = ipInt & subnetMaskInt;

        return ipNetwork === networkAddress;
    }
}