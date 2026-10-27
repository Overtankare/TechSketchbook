//consts for HTML elements and audio management
const start = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const pause = document.getElementById("pause");
const paddleup = document.getElementById("up");
const paddledown = document.getElementById("down");
const livesOut = document.getElementById("lives");
const pingPongSound = new Audio('/assets/sounds/ping_pong_ball.wav');
const backgroundMusic = new Audio('/assets/sounds/Elektronomia - Vitality [NCS Release].mp3');
backgroundMusic.volume = 0.25;
backgroundMusic.loop = true;

//variables
let width = 750;
let height = 750;
let started = 0;
let ballx = 200;
let bally = 200;
let ballxspeed = 5;
let ballyspeed = 3;
let paddlex = width - 50;
let paddley = height / 2;
let paddlespeed = 5;
let hits = 0;
let uparrowpressed = 0;
let downarrowpressed = 0;
let hitCounted = 0;
let score = 0;
let lives = 5;
let highScore = localStorage.getItem("highScore");
if (highScore == null) {
	highScore = 0;
	localStorage.setItem("highScore", highScore);
}

//event listeners for buttons
start.addEventListener("click", function() {loop(); started = 1; backgroundMusic.play();});
restartBtn.addEventListener("click", restart);
pause.addEventListener("click", function() {noLoop(); started = 0; backgroundMusic.pause();});
paddleup.onpointerdown = function() {uparrowpressed = 1;};
paddleup.onpointerup = function() {uparrowpressed = 0;};
paddledown.onpointerdown = function() {downarrowpressed = 1;};
paddledown.onpointerup = function() {downarrowpressed = 0;};

noLoop();

//setup for p5.js
function setup() {
	createCanvas(750, 750)
	lives.textContent = "Lives: " + lives;
}

//the main code
function draw() {
	//don't start unless game started
	if (!started) {
		return;
	}
	if (highScore < score) {
		highScore = score;
		localStorage.setItem("highScore", highScore);
	}
	livesOut.textContent = "Lives: " + lives;
	fill(24, 71, 158);
	background(172, 200, 250);
	circle(ballx, bally, 50);
	fill(0)
	textSize(24);
	textAlign(CENTER, CENTER);
	text(hits, ballx, bally);
	text(score, 50, 50)
	textAlign(LEFT);
	text("High score: " + highScore, 25, 725);
	textAlign(CENTER, CENTER);
	fill(77, 77, 77);
	rect(paddlex, paddley, 20, 100);
	if ((keyIsDown(DOWN_ARROW) || downarrowpressed) && paddley < 650) {
		paddley += paddlespeed;
	}
	if ((keyIsDown(UP_ARROW) || uparrowpressed) && paddley > 0) {
		paddley -= paddlespeed;
	}
	ballx += ballxspeed;
	bally += ballyspeed;
	if (ballx > width - 25) {
		lives--;
		livesOut.textContent = "Lives: " + lives;
		if (lives <= 0) {
			textSize(100);
			text("Game Over!", width / 2, height / 2);
			noLoop();
		}
		ballx = 200;
		bally = 200;
	}
	if (ballx < 25) {
		hits++;
		ballx = 25;
		ballxspeed *= -1;
	}
	if (ballx < paddlex - 5 && ballx > paddlex - 25 && bally >= paddley + 25 && bally <= paddley + 75 && !hitCounted) {
		if (bally - paddley > 50) {
			pingPongSound.play();
			hits++;
			score++;
			ballxspeed = (bally - paddley - 50) / -5;
			hitCounted = 1;
		}
		else if (bally - paddley < 50) {
			pingPongSound.play();
			hits++;
			score++;
			ballxspeed = (paddley + 50 - bally) / -5;
			hitCounted = 1;
		}
		else {
			pingPongSound.play();
			hits++;
			score++;
			ballxspeed *= -1;
			hitCounted = 1;
		}
	}
	if (!(ballx < paddlex - 5 && ballx > paddlex - 25 && bally >= paddley + 25 && bally <= paddley + 75)) {
		hitCounted = 0;
	}
	if (bally < 25) {
		hits++;
		bally = 25;
		ballyspeed *= -1;
	}
	if (bally > height - 25) {
		hits++;
		bally = height - 25;
		ballyspeed *= -1;
	}
}

//Restart the game when needed
function restart() {
	started = 1;
	ballx = 200;
	bally = 200;
	ballxspeed = 5;
	ballyspeed = 3;
	paddley = height / 2;
	hits = 0;
	uparrowpressed = 0;
	downarrowpressed = 0;
	hitCounted = 0;
	score = 0;
	lives = 5;
	loop();
	draw();
}
