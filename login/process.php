<?php
session_start();
if ($_POST["username"] === "chicken" && $_POST["password"] === "qwertyasdfwasd") {
	$_SESSION["username"] = "chicken";
	header("Location: /chicken.php");
	exit;
}
else if ($_POST["username"] === "steven" && $_POST["password"] === "supercoolpassword") {
	$_SESSION["username"] = "steven";
	header("Location: /steven.php");
	exit;
}
else {
	echo "Wrong user/pw combo man. rip";
}
?>
