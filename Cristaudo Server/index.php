<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: *");
    
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
        $con=connection("my_cristaudo");
        switch($url[2]){
            case "newUser":
                $sql="INSERT INTO Users (Nome,Cognome,Username,Password) VALUES ('".$_POST["Nome"]."','".$_POST["Cognome"]."','".$_POST["Username"]."','".$_POST["PIN"]."')";
                break;
            case "getUser":
                $sql="SELECT Nome FROM Users WHERE Username='".$_POST["Username"]."'";
                break;
            case "getUsername":
                $sql="SELECT COUNT(IDUser) AS UserExist FROM Users WHERE Username='".$_POST["Username"]."'";
                 break;
            case "getPin":
                $sql="SELECT Password FROM Users WHERE Username='".$_POST["Username"]."'";
                break;
            case "getCredentials":
                $sql="SELECT Username,Password FROM Users WHERE Username='".$_POST["Username"]."'";
                break;
        }
        echo(json_encode(eseguiQuery($con,$sql)));
    }

    function modifyData($url){
        echo(json_encode("MODIFICO DATI"));
    }

    function deleteData($url){
        echo(json_encode("CANCELLO DATI"));
    }

?>