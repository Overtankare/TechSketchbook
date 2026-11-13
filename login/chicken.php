<?php
session_start();
if (isset($_SESSION["username"])) {
	if ($_SESSION["username"] === "chicken") {
		echo "<p>Halla chicken, hur mar du?</p>";
	}
	else if ($_SESSION["username"] === "steven") {
		header("Location: steven.php?error=1");	 //different error numbers for different pages, just means wrong account
	}
	else {
		header("Locaiton: howdidwegethere.php?error=schrodingers-account"); //yes i created a different page just for errors that will almost certainly NEVER happen
	}
} else {
	header("Location: index.php?error=3"); //error 3 is for wrong password
}
?>
