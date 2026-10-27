const ballx = document.getElementById("ballx");
const bally = document.getElementById("bally");
const ballxspeed = document.getElementById("ballxspeed");
const ballyspeed = document.getElementById("ballyspeed");
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const hitsout = document.getElementById("hits");
const xvelocity = document.getElementById("xvelocity");
const yvelocity = document.getElementById("yvelocity");
const ballcoords = document.getElementById("ballcoords");
let started = 0;
let x = 200;
let y = 200;
let xspeed = 5;
let yspeed = 3;
let hits = 0;
start.addEventListener("click", function() {
	if (!ballx.checkValidity()) {
		output.textContent += "Please enter a number. Proceeding with default x coordinate. ";
	}
	else if (Number(ballx.value) < 25 || Number(ballx.value) > 725) {
		output.textContent += "Too close to edge. Proceeding with default x coordinate. ";
	}
	else {
		x = Number(ballx.value);
	}
	if (!bally.checkValidity()) {
		output.textContent += "Please enter a number. Proceeding with default y coordinate. "
	}
	else if (Number(bally.value) < 25 || Number(bally.value) > 725) {
		output.textContent += "Too close to edge. Proceeding with default y coordinate. "
	}
	else {
		y = Number(bally.value);
	}
	ballx.disabled = true;
	bally.disabled = true;
	if (!ballxspeed.checkValidity()) {
		output.textContent += "Please enter a number. Proceeding with default x speed. ";
	}
	else if (Number(ballxspeed.value) == 0) {
		output.textContent += "Please enter a nonzero speed. Proceeding with default x speed. ";
	}
	else {
		xspeed = Number(ballxspeed.value);
	}
	if (!ballyspeed.checkValidity()) {
		output.textContent += "Please enter a number. Proceeding with default y speed. ";
	}
	else if (Number(ballyspeed.value) == 0) {
		output.textContent += "Please enter a nonzero speed. Proceeding with default y speed. ";
	}
	else {
		yspeed = Number(ballyspeed.value);
	}
	ballxspeed.disabled = true;
	ballyspeed.disabled = true;
	started = 1;
});
restart.addEventListener("click", function() {location.reload();});
function getRand(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
}
function setup() {
	createCanvas(750, 750);
	xvelocity.textContent = "x velocity: " + xspeed;
	yvelocity.textContent = "y velocity: " + yspeed;
	ballcoords.textContent = "Ball coords: (" + x + ", " + y + ")";
	textAlign(CENTER, CENTER);
	textSize(24);
}

function draw() {
	fill(24, 71, 158);
	background(172, 200, 250, 10);
	if (!started) {
		return;
	}
	circle(x, y, 50);
	fill(0);
	text(hits, x, y);
	x += xspeed;
	y += yspeed;
	if (x > width - 25 || x < 25) {
		hits++;
		xspeed *= -1;
		xvelocity.textContent = "x velocity: " + xspeed;
		hitsout.textContent = "Hits: " + hits;
	}
	if (y > height - 25 || y < 25) {
		hits++;
		yspeed *= -1;
		yvelocity.textContent = "y velocity: " + yspeed;
		hitsout.textContent = "Hits: " + hits;
	}
	ballcoords.textContent = "Ball coords: (" + x + ", " + y + ")";
}
