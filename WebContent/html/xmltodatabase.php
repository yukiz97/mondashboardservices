<?php 
/*-------------- config --------------*/
$host="localhost";
$username="root";
$password="";
$database="db_connectivitymap";

$xmlFilePath = "D://world.xml";

$checkOldRecord = false; // có hay không - kiểm tra nếu đã tồn tại dữ liệu - nếu = false sẽ xóa dữ liệu cũ

/*-------------- code execute --------------*/
$checkSuccess = true;

$connect = mysqli_connect($host, $username, $password, $database) or die ("Fail to connect to database");
mysqli_set_charset($connect,"utf8");

$xmlFile = simplexml_load_file($xmlFilePath) or die("</br>Fail to open ".$xmlFilePath);

$typeName = $xmlFile['typename'];

if($checkOldRecord)
{
	$queryCheck = "SELECT idCoordinate FROM coordinate_default WHERE typeCoordinate = '{$typeName}' LIMIT 1";
	$resultCheck = executeQuery($queryCheck);
	echo mysqli_affected_rows($connect);
	if(mysqli_affected_rows($connect)>0)
	{
		$checkSuccess = false;
		echo "</br>Fail to insert new data - data already exited in database";
	}
}
else
{
	$queryDelete = "DELETE FROM coordinate_default WHERE typeCoordinate = '{$typeName}'";
	$resultDelete = executeQuery($queryDelete);

	if(mysqli_affected_rows($connect)>0)
	{
		echo "</br>Deleted ".mysqli_affected_rows($connect)." rows";
	}
}

if($checkSuccess)
{
	$valueInsert = "";
	foreach($xmlFile->circle as $circle) {
		$name = $circle['name'];
		$valueId = $circle['id'];
		$cx = $circle['cx'];
		$cy = $circle['cy'];

		$valueInsert.="('{$name}','{$valueId}',$cx,$cy,'{$typeName}'),";
	}
	$valueInsert = substr($valueInsert, 0,-1);

	$queryInsert = "INSERT INTO coordinate_default(name,valueId,cx,cy,typeCoordinate) VALUES ".$valueInsert;
	$resultInsert = executeQuery($queryInsert);

	echo "</br>Inserted success ".mysqli_affected_rows($connect)." rows";

	mysqli_close($connect);
}

function executeQuery($query)
{
	GLOBAL $connect;
	return mysqli_query($connect,$query) or die ('Invalid query: ' .mysqli_error($connect));
}
?>