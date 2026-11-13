<?php
session_start();
if (isset($_SESSION["username"])) {
	if ($_SESSION["username"] === "steven") {
		echo "hi steven";
	} else if ($_SESSION["username"] === "chicken") {
		header("Location: chicken.php?error=1");
	}
} else {
	header("Location: index.php?error=3");
}
?>
