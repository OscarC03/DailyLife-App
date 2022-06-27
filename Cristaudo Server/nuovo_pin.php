<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: *");
    
    require('libreria.php');
//il controllo del get evita errori di pagina
if(isset($_GET['hash'])){
    $con=connection("my_cristaudo");
	
	$hash=$_GET['hash'];
	$id=substr($hash, 32);
	$password_old=substr($hash, 0, 32);
	
	//controllo che i valori dell’hash corrispondano ai valori salvati nel database
	$sqlID="SELECT * FROM Users WHERE IDUser=".intval($id)." AND Password='".$password_old."'";
    $userData=eseguiQuery($con,$sqlID);
	
	 if($userData[0]['Username']!="" && $userData[0]['newGen']==NULL){

		$header= "From: Supporto profilo Daily Life APP <info@cristaudo.altervista.org>\n";
		$header .= "Content-Type: text/html; charset=\"iso-8859-1\"\n";
		$header .= "Content-Transfer-Encoding: 7bit\n\n";
						
		$subject= "Daily Life - Nuovo PIN generato";
		
		$mess_invio="<html><body>";
		
		$mess_invio.="
		Complimenti!, Il suo nuovo PIN utente è stato inviato sull'Applicazione Daily Life<br />
		Ora puoi accedere all'App e premere il pulsante \"Ricarica\"";
		
		$mess_invio.='</body></html>';
		

		if(@mail($userData[0]['Mail'], $subject, $mess_invio, $header)){
            $sql="UPDATE Users SET newGen='".$hash."' WHERE IDUser=".$userData[0]['IDUser'];
            $getPIN=eseguiQuery($con,$sql);		
            echo('<font color="lime" size="4rem" face="Verdana, Geneva, sans-serif" size="1.2rem"><h1 align="center">COMPLIMENTI!</h1></font><br /><font color="black" face="Verdana, Geneva, sans-serif" size="2rem"><p align="center">Il suo nuovo PIN utente è stato generato, controlli le email per concludere la procedura</p>');
            exit(200);
		}                         
	}
    else{		
    	echo('<font color="red" size="4rem" face="Verdana, Geneva, sans-serif" size="1.2rem"><h1 align="center">Mail già inviata!</h1></font><br /><font color="black" face="Verdana, Geneva, sans-serif" size="2rem"><p align="center">Il suo nuovo PIN utente è stato generato, controlli le email per concludere la procedura</p>');
        exit(401);
    }

	

} //if(isset($_GET['hash']))

?>