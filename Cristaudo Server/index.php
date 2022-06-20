<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: *");
    header("Content-type: image/jpeg");
    
    require('libreria.php');
    
    $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $url = explode( '/', $url);
	//$_POST = json_decode(file_get_contents("php://input"), true);

    switch($_SERVER['REQUEST_METHOD']){
        case "POST":
            manageData($url);
            break;
        case "PUT":
            modifyData($url);
            break;
        case "DELETE":
            deleteData($url);
            break;
    }

    function manageData($url){
        $exit=false;
        $con=connection("my_cristaudo");
        switch($url[2]){
            case "newUser":
                $sql="INSERT INTO Users (Nome,Cognome,Username,Mail,Password) VALUES ('".$_POST["Nome"]."','".$_POST["Cognome"]."','".$_POST["Username"]."','".$_POST["Mail"]."','".md5($_POST["Password"])."')";
                break;
            case "getUser":
                $sql="SELECT Nome,IDUser,Mail FROM Users WHERE Username='".$_POST["Username"]."'";
                break;
            case "getPreferenceUser":
                $sql="SELECT * FROM Preferenze AS P,PreferenzeUser AS PU,Users AS U WHERE U.IDUser=PU.IDUser AND P.IDPreferenza=PU.IDPreferenza AND U.IDUser=".$_POST["User"];
                break;
            case "getUsername":
                $sql="SELECT COUNT(IDUser) AS UserExist FROM Users WHERE Username='".$_POST["Username"]."'";
                 break;
            case "getPin":
                $sql="SELECT Password FROM Users WHERE Username='".$_POST["Username"]."'";
                break;
            case "getCredentials":
            	$exit=true;
                $sql="SELECT Username,Password FROM Users WHERE Username='".$_POST["Username"]."'";
            	$userData=eseguiQuery($con,$sql);
                
                if($userData[0]["Username"]==$_POST["Username"] && $userData[0]["Password"]==md5($_POST["Password"]))
                	echo("Login OK");
                else
                	echo("Error: Username o Password errate ".$userData[0]["Password"]." - ".md5($_POST["Password"]));
                break;
            case "insertPreference":
            	$sql="INSERT INTO PreferenzeUser (IDPreferenza,IDUser) VALUES (".intval($_POST["IDP1"]).",".intval($_POST["IDU"])."),(".intval($_POST["IDP2"]).",".intval($_POST["IDU"])."),(".intval($_POST["IDP3"]).",".intval($_POST["IDU"])."),(".intval($_POST["IDP4"]).",".intval($_POST["IDU"])."),(".intval($_POST["IDP5"]).",".intval($_POST["IDU"]).")";
            	break;
            case "getPreference":
                $sql="SELECT * FROM Preferenze";
                break;
            case "insertUmore":
            	$sql="INSERT INTO UmoreUtente (IDUtente,Stress,Felicita,Fisico,Mentale,Media,Data) VALUES (".intval($_POST["IDU"]).",'".$_POST["Stress"]."','".$_POST["Felicita"]."','".$_POST["Fisico"]."','".$_POST["Mentale"]."','".$_POST["Media"]."','".$_POST["Data"]."')";
            	break;
            case "insertAttivita":
            	$sql="INSERT INTO Calendar (IDUser,Activity,Descrizione,Data,Color,Energy) VALUES (".intval($_POST["IDU"]).",'".$_POST["Attivita"]."','".$_POST["Descrizione"]."','".$_POST["Data"]."','".$_POST["Color"]."',".$_POST["Energy"].")";
            	break;
            case "getUmoreUtente":
            	$sql="SELECT * FROM UmoreUtente WHERE IDUtente=".intval($_POST['IDU']);
            	break;
            case "getAttivita":
            	$sql="SELECT * FROM Calendar WHERE IDUser=".intval($_POST['IDU']);
            	break;
            case "getAttivitaID":
            	$sql="SELECT * FROM Calendar WHERE IDUser=".intval($_POST['IDU'])." AND Activity='".$_POST['Activity']."' AND Data='".$_POST['Data']."'";
            	break;
            case "modifyAttivita":
            	$sql="UPDATE Calendar SET Data = '".$_POST["Data"]."' WHERE IDUser = ".$_POST["IDU"]." AND IDCalendar =".$_POST["ID"];
            	break;
            case "modifyEvent":
            	$sql="UPDATE Calendar SET Activity = '".$_POST["Event"]."', Descrizione='".$_POST["Descr"]."' WHERE IDUser = ".$_POST["IDU"]." AND IDCalendar =".$_POST["ID"];
            	break;
            case "deleteEvent":
            	$sql="DELETE FROM Calendar WHERE IDCalendar =".$_POST["ID"];
            	break;
            case "getAttivitaByEnergy":
            	$sql="SELECT * FROM Calendar WHERE IDUser=".intval($_POST['IDU']);
            	break;
            case "modifyEventByEnergy":
            	$sql="UPDATE Calendar SET Data='".$_POST["Data"]."' WHERE IDUser = ".intval($_POST["IDU"])." AND IDCalendar =".intval($_POST["ID"]);
                break;
            case "saveImageUser":
                $sql="UPDATE Users SET userIMG='".$_POST["IMG"]."' WHERE IDUser=".intval($_POST["IDU"]);
                break;
            case "getUserModify":
                $sql="SELECT IDUser,Nome,Cognome,Username,userIMG FROM Users WHERE IDUser=".intval($_POST["IDU"]);
                break;
            case "getHash":
            	$sql="SELECT newGen FROM Users WHERE Username='".$_POST['Username']."'";
            	break;
            case "deleteHash":
            	$sql="UPDATE Users SET newGen='' WHERE Username='".$_POST['Username']."'";
            	break;
            default:
                exit(404);
                break;
        }
        
        if(!$exit){
        	echo(json_encode(eseguiQuery($con,$sql)));
        	exit(200);
        }
    }

    function modifyData($url){
        echo(json_encode("MODIFICO DATI"));
    }

    function deleteData($url){
        echo(json_encode("CANCELLO DATI"));
    }

?>