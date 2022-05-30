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
                $sql="INSERT INTO Users (Nome,Cognome,Username,Password) VALUES ('".$_POST["Nome"]."','".$_POST["Cognome"]."','".$_POST["Username"]."','".md5($_POST["Password"])."')";
                break;
            case "getUser":
                $sql="SELECT Nome,IDUser FROM Users WHERE Username='".$_POST["Username"]."'";
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