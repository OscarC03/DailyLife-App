<?php
function connection($dbName){
    define("DBHOST","localhost");
    define("DBUSER","root");
    define("DBPASS","");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try{
        $con = new mysqli(DBHOST,DBUSER,DBPASS,$dbName);
        $con -> set_charset("utf8");
        return $con;
    }
    catch (mysqli_sql_exception $ex){
        die("Errore di connessione al DB. " . $ex->getMessage());
    }
}

function eseguiQuery($con,$sql){
    try{
        $rs=$con->query($sql);
    }
    catch(mysqli_sql_exception $ex){
        die("Errore di esecuzione della query. " . $ex->getMessage());
    }
    if(!is_bool($rs))
        // se $rs è popolato dalla esecuzione della query allora lo
        // lo trasformo in un vettore associativo
        $data=$rs->fetch_all(MYSQLI_ASSOC);
    else
        $data=$rs;
    return $data;
}

function settaCookie($name, $value, $expire, $path, $domanin, $sec){
    setcookie($name, $value, $expire, $path, $domanin, $sec);
}
?>
