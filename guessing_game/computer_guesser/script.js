document.addEventListener("DOMContentLoaded", function() {
	function getRand(max, min) {
		return Math.floor(Math.random() * ((max + 1) - min) + min);
	}
	const max_num = document.getElementById("max");
	const min_num = document.getElementById("min");
	let tries = 0;
	let rand;
	let greaterThan;
	let lessThan;
	let computer_guess;
	function takeInput() {
		if (max_num.checkValidity() && min_num.checkValidity()) {
			rand = getRand(Number(max_num.value), Number(min_num.value));
			greaterThan = Number(min_num.value) - 1;
			lessThan = Number(max_num.value) + 1;
			max_num.disabled = true;
			min_num.disabled = true;
		} else {
			alert("You entered something besides a number. Bad.");
		}
	}
	function game() {
		while (1) {
			tries += 1;
			computer_guess = getRand(lessThan, greaterThan);
			if (computer_guess < rand) {
				greaterThan = computer_guess;
				continue;
			}
			else if (computer_guess > rand) {
				lessThan = computer_guess;
				continue;
			}
			else if (computer_guess == rand) {
				output.textContent = "The computer guessed correctly in " + tries + " guesses.";
				break;
			}
			else {
				output.textContent = "Something happened";
				tries -= 1;
				continue;
			}
		}
	}
	start.addEventListener("click", function() {takeInput(); game();});
	restart.addEventListener("click", function() {location.reload();});
});
