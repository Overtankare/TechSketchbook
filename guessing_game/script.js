document.addEventListener("DOMContentLoaded", function() {
	const num_input = document.getElementById("user_guess");
	const check_button = document.getElementById("check");
	const restart_button = document.getElementById("restart");
	function getRand() {
		return Math.floor(Math.random() * (11 - 1) + 1);
	}
	let tries = 0;
	rand = getRand();
	function checkNum() {
		tries += 1;
		const value = Number(num_input.value);
		if (num_input.checkValidity()) {
			if (value == rand) {
				output.textContent = "Correct in " + tries + " tries! Press the button above to play again.";
			}
			else if (value < rand) {
				output.textContent = "The number you are seeking is larger. This is try number " + tries + " .";
			}
			else if (value > rand) {
				output.textContent = "The number you are seeking is smaller. This is try number " + tries + " .";
			}
			else {
				output.textContent = "Whoops, something happened. This didn't count as an attempt.";
				tries -= 1;
			}
		} else {
			output.textContent = "Seems like you entered something besides a number. This didn't count as an attempt.";
			tries -= 1;
		}
	}
	check.addEventListener("click", function() {checkNum();});
	restart.addEventListener("click", function() {location.reload();});
});
