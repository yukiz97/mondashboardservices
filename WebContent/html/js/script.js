var url = "/mondashboardservices/rest/";

var loadStatusViewInterval;
var loadFlowViewInterval;

var currentshow = "";
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

	$(".btn-view").on("click",function(){
		var type=$(this).attr("type");
		var fileName = "";
		var typeChoose = "";

		switch(type){
			case 'statusmap':
			fileName = "statusmaplist.html";
			typeChoose = "statusmap";
				if (loadFlowViewInterval !== undefined && loadFlowViewInterval !== null) {
					clearInterval(loadFlowViewInterval);
				}
				if (loadStatusViewInterval !== undefined && loadStatusViewInterval !== null) {
					clearInterval(loadStatusViewInterval);
				}
			break;
			case 'statusview':
			fileName = "viewstatuslist.html";
			typeChoose = "statusview";
				if (loadFlowViewInterval !== undefined && loadFlowViewInterval !== null) {
					clearInterval(loadFlowViewInterval);
				}
			break;
			case 'flowview':
			fileName = "viewflowlist.html";
			typeChoose = "flowview";
				if (loadStatusViewInterval !== undefined && loadStatusViewInterval !== null) {
					clearInterval(loadStatusViewInterval);
				}
			break;
		}
		if(typeChoose != currentshow)
		{
			currentshow = typeChoose;
			getDashboardContent(fileName);
		}
	});

	$(".btn-show").on("click",function(){
		var type=$(this).attr("type");
		var fileName = "";

		switch(type){
			case 'statusmap':
			fileName = "statusmaplist.html";
				if (loadFlowViewInterval !== undefined && loadFlowViewInterval !== null) {
					clearInterval(loadFlowViewInterval);
				}
				if (loadStatusViewInterval !== undefined && loadStatusViewInterval !== null) {
					clearInterval(loadStatusViewInterval);
				}
			break;
			case 'statusview':
			fileName = "viewstatuslist.html";
				if (loadFlowViewInterval !== undefined && loadFlowViewInterval !== null) {
					clearInterval(loadFlowViewInterval);
				}
			break;
			case 'flowview':
			fileName = "viewflowlist.html";
				if (loadStatusViewInterval !== undefined && loadStatusViewInterval !== null) {
					clearInterval(loadStatusViewInterval);
				}
			break;
		}

		window.open(fileName, '_blank')
	});

	function getDashboardContent(fileName)
	{
		$.ajax({
			url: fileName,
			dataType: 'text',
			success: function(data){
				data = data.replace('<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css"/>','');
				data = data.replace('<link rel="stylesheet" href="css/animate.css"/>','');
				data = data.replace('<link rel="stylesheet" href="css/sweetalert.css"/>','');
				data = data.replace('<link rel="stylesheet" href="font-awesome/css/font-awesome.min.css"/>','');
				data = data.replace('<link rel="stylesheet" href="css/style.css"/>','');
				data = data.replace('<script type="text/javascript" src="js/jquery.min.js"></script>','');
				data = data.replace('<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>','');
				data = data.replace('<script type="text/javascript" src="js/script.js"></script>','');

				$("#right-content").html(data);
			},
			error: function(){
				console.log("get view content list fail!!!!!");
			}
		});
	}
	changeHeightOfMenu();
	$(window).on('resize', function(){
     	changeHeightOfMenu();
	});

	function changeHeightOfMenu(){
		var heightMenuItem = $(".menu-item").height();

     	$(".btn-groupshow").css({"height":heightMenuItem+"px"});
     	$(".btn-groupshow i").css({"padding-top":"50%"});
	}
});

function returnLimit(all,each)
{
	return Math.floor(all/each);
}

function createHexagon()
{
	var hexagon = "<div class='svg-hexagonal-counter'>"
	+"<h2 style='margin-top:17px'><i class='fa fa-pause'></i></h2>"
	+"<svg class='counter' x='0px' y='0px' viewBox='0 0 776 628'>"
	+"<path class='track' d='M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z' style='stroke: rgb(56, 71, 83);'></path>"
	+"</svg>"
	+"</div>";

	return hexagon;
}