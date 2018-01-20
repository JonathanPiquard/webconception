<?php
	/*
		********************************************************************************************
		CONFIGURATION
		********************************************************************************************
	*/
	//destinataire : email admin. (pour plusieurs mail, séparer par une virgule)
	$destinataire = 'contact@webconception.fr';

	//copie ? (envoie une copie au visiteur)
	$copie = true;

	//messages de confirmation du mail
	$message_envoye = "Votre message nous est bien parvenu !";
	$message_non_envoye = "L'envoi du mail a échoué, veuillez réessayer SVP.";

	//messages d'erreur du formulaire
	$message_formulaire_invalide = "Vérifiez que tous les champs soient bien remplis et que l'email soit sans erreur.";

	/*
		********************************************************************************************
		VALIDATION ET ENVOIE
		********************************************************************************************
	*/

	//nettoyer et enregistrer un texte
	function Rec($text)	{
		$text = htmlspecialchars(trim($text), ENT_QUOTES);
		if (1 === get_magic_quotes_gpc()) {
			$text = stripslashes($text);
		}

		$text = nl2br($text);
		return $text;
	};

	//vérifier la syntaxe d'un email
	function IsEmail($email) {
		$value = preg_match('/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/', $email);
		return (($value === 0) || ($value === false)) ? false : true;
	}

	//récupérer les champs.
	$nom     = (isset($_POST['nom']))     ? Rec($_POST['nom'])     : '';
	$email   = (isset($_POST['email']))   ? Rec($_POST['email'])   : '';
	$message = (isset($_POST['message'])) ? Rec($_POST['message']) : '';

	//vérifier les variables et l'email
	$email = (IsEmail($email)) ? $email : '';

	if (($nom != '') && ($email != '') && ($message != ''))	{
		//les 3 variables sont remplies, création et envoie du mail
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'From:'.$nom.' <'.$email.'>' . "\r\n" .
				'Reply-To:'.$email. "\r\n" .
				'Content-Type: text/plain; charset="utf-8"; DelSp="Yes"; format=flowed '."\r\n" .
				'Content-Disposition: inline'. "\r\n" .
				'Content-Transfer-Encoding: 7bit'." \r\n" .
				'X-Mailer:PHP/'.phpversion();

		$cible = ($copie) ? $destinataire.';'.$email : $destinataire;

		//remplace certains caractères spéciaux
		$message = str_replace("&#039;","'",$message);
		$message = str_replace("&#8217;","'",$message);
		$message = str_replace("&quot;",'"',$message);
		$message = str_replace('<br>','',$message);
		$message = str_replace('<br />','',$message);
		$message = str_replace("&lt;","<",$message);
		$message = str_replace("&gt;",">",$message);
		$message = str_replace("&amp;","&",$message);

		//envoi du mail
		$num_emails = 0;
		$tmp = explode(';', $cible);
		foreach($tmp as $email_destinataire) {
			if (mail($email_destinataire, 'Web Conception : prise de contact', $message, $headers))
				$num_emails++;
		}

		if (($copie && $num_emails == 2) || (!$copie && $num_emails == 1))	{
			http_response_code(200);
			echo $message_envoye;
		}	else {
			http_response_code(500);
			echo $message_non_envoye;
		};
	}	else {
		//une des 2 variables (ou plus) est vide
		http_response_code(400);
		echo $message_formulaire_invalide;
	};
?>
