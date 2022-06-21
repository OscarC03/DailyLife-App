<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header("Access-Control-Allow-Headers: *");
    
    require('libreria.php');
    
//funzione che crea una password random
function random($lunghezza=12){
	$caratteri_disponibili ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	$codice = "";
	for($i = 0; $i<$lunghezza; $i++){
		$codice = $codice.substr($caratteri_disponibili,rand(0,strlen($caratteri_disponibili)-1),1);
	}
	return $codice;
}



//il controllo del get evita errori di pagina
if(isset($_GET['hash'])){
    $con=connection("my_cristaudo");
	
	$hash=$_GET['hash'];
	$id=substr($hash, 32);
	$password_old=substr($hash, 0, 32);

	$password=random(8); //nuova password di 8 caratteri
	
	//controllo che i valori dell’hash corrispondano ai valori salvati nel database
    $sql="SELECT * FROM Users WHERE IDUser=".$id." AND Password='".$password_old."'";
    $userData=eseguiQuery($con,$sql);
	
	if($userData[0]['Username']!=""){ 
		$email=$userData[0]['Mail'];
    	$sqlUpdate="UPDATE Users SET Password='".md5($password)."' WHERE IDUser=".$id." AND Password='".$password_old."'";
    	$result=eseguiQuery($con,$sqlUpdate);

		$header= "From: Daily Life - Recupero credenziali <info@sito.it>\n";
		$header .= "Content-Type: text/html; charset=\"iso-8859-1\"\n";
		$header .= "Content-Transfer-Encoding: 7bit\n\n";
						
		$subject= "Daily Life - Nuova password utente";
		
		$mess_invio="<html><body>";
		
		$mess_invio.="
        Salve ".$userData[0]['Username']." Ci è pervernuta una richiesta di recupero credenziali,
		La sua nuova password utente è ".$password."<br />
		Ora puoi accedere all'applicazione Daily Life. Questa è una password generata randomicamente, la invitiamo a modificarla nella sezione \"Impostazioni\" -> \"Modifica Profilo\".
		";
		
		$mess_invio.='</body></html>';
		

		if(@mail($email, $subject, $mess_invio, $header)){?>
			La password è stata cambiata con successo. Controlla la tua email.<br /><br /> 
		<?php
		}
	
	}

	

} //if(isset($_GET['hash']))

?>