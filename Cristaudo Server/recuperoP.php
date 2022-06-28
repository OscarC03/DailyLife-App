<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header("Access-Control-Allow-Headers: *");

require('libreria.php');

if(isset($_POST['Mail'])){
    $con=connection("my_cristaudo");
	$errore=0;
	
	if($_POST['Mail']==""){
		$errore=1;
	}else{;
        $sql="SELECT IDUser,Password FROM Users WHERE Username='".$_POST["Username"]."' limit 0,1";
        $userData=eseguiQuery($con,$sql);
                
        if($userData[0]["IDUser"]!="" && $userData[0]["Password"]!="")
			$hash=$userData[0]['Password']."".$userData[0]['IDUser'];
        else
        	$errore=1;
	}	
	
	if($errore==0){
    	  $header= "From: Daily Life <info@cristaudo.altervista.org>\n";
          $header .= "Content-Type: text/html; charset=\"iso-8859-1\"\n";
          $header .= "Content-Transfer-Encoding: 7bit\n\n";

          $subject= "Daily Life - Nuova password utente";

          $mess_invio="<html><body>";

          $mess_invio.="
          Clicca sul <a href=\"https://www.cristaudo.altervista.org/nuova_password.php?hash=".$hash."\">link</a> per confermare la nuova password.<br />
          Se il link non è visibile, copia la riga qui sotto e incollala sul tuo browser: <br />
          https://www.sito.it/nuova_password.php?hash=".$hash."
          ";

          $mess_invio.='</body><html>';

          //invio email
          if(@mail($_POST['Mail'], $subject, $mess_invio, $header)){
                $sucRes->code=200;
                $sucRes->msg="Mail inviata correttamente a: ".$_POST['Mail']." Segui le istruzioni riportate per ripristinare la Password";
                $sucRes->hash=$hash;
                echo(json_encode($sucRes));
                exit(200);
                unset($_POST); //elimino le variabili post, in modo che non appaiano nel form
            }else {
                $failRes->code=406;
                $failRes->msg="Qualcosa è andato storto: Impossibile inviare la mail a: ".$_POST['Mail'];
                echo(json_encode($failRes));
                exit(406);
                unset($_POST);
             }
	}
}
?>