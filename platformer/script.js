//constants
const keysPressed = new Set(); //so that we can keep track of keys being pressed *right now*
const keysToPrevent = ['Space', 'ArrowUp', 'ArrowLeft', 'ArrowRight']; //keys that we need to prevent from doing their normal job
const keyBindings = {
	left: ['ArrowLeft', 'KeyA'],
	right: ['ArrowRight', 'KeyD'],
	jump: ['ArrowUp', 'KeyW', 'Space']
};

function isPressed(action) {
	return keyBindings[action].some(key => keysPressed.has(key));
}

const tileSize = 32; //length/width of each tile (square)
const tilesetImg = 'tileset.png'; //the tileset we use

const viewportWidth = 800; //width of the game window
const viewportHeight = 500; //height of the game window
const canvas = document.getElementById('game'); //the actual canvas
const context = canvas.getContext('2d'); //this is what we're going to edit the attributes of in order to make changes to our canvas

const constants = {
	gravity: 2000,
	jumpStrength: 600,
	movementSpeed: 400,
	terminalVelocity: 800
}

const backgroundLayers = [
	{ src: 'background-level-1.png', speed: 0 }, //sky background, level one
	{ src: 'background-level-2.png', speed: 0.4 }, //distant buildings, level two
	{ src: 'background-level-3.png', speed: 0.5 } //closer buildings, level three
];

const tileTypes = {
	'.': null,  //no tile
	'B': { row: 41, col: 0, solid: true }, //brick
	'C': { row: 46, col: 0, solid: true }, //cap
	'L': { row: 55, col: 0, solid: true }, //left side edge cap
	'R': { row: 45, col: 0, solid: true }, //right side edge cap
	'W': { row: 53, col: 0, solid: true} //window
};

const spawnPoint = { x: 5, y: 10 }; //where the player spawns
const spriteColour = '#ff6b6b'; //sprite colour
const spriteUrl = ''; //url for the sprite (empty--use default)
const spriteFrames = 1; //frames in the sprite

const collisionMargin = 4; //how far inside the player sprite to check for solid tiles
const cameraSmoothing = 0.1; //how smoothly the camera follows the player. 0 = static, 1 = instant snap
const animationFrameDuration = 8; //how many frames until sprite is switched
const fallDeathThreshold = 100; //pixels to fall below level before restarting

const player = {
	x: 50,
	y: 50,
	width: 32,
	height: 32,
	speedX: 0,
	speedY: 0,
	onGround: false,
	colour: spriteColour,
	facingRight: true,
	animFrame: 0,
	animTimer: 0
};

const level = [
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	"...........................................................................",
	".............BBB...........................................................",
	".....BBBBBBBBBBB.................LCCCCCCCCCCCCR............................",
	"BBBBBBBBBBBBBBBB..LCCCCCCCCCCCR...BBBBBBBBBBBB..................LCCCCCCCCCC",
	"BBWBBWBBWBBWBBWB...BBBBBBBBBBB....BBBBBBBBBBBBBBBB...............BBBBBBBBBB",
	"BBBBBBBBBBBBBBBB...BWBBBWBBBWB....BBBBBBBBBBBBBBB.....CCCCCCCR...BBBBBBBBBB",
	"WBBWBBWBBWBBWBBW...BBBBBBBBBBB....BBBBBBBBBBBBBB.....BBBBBBBB....BBBBBBBBBB",
	"BBBBBBBBBBBBBBBB...BBBBBBBBBBB....BBBBBBBBBBBBB.....BBBBBBBBB....BBBBBBBBBB",
	"BWBBWBBWBBWBBWBB...BBBWBBBWBBB....BBBBBBBBBBBB.....BBBBBBBBBB....BBBBBBBBBB",
	"BBBBBBBBBBBBBBBB...BBBBBBBBBBB....BBBBBBBBBBBB....BBBBBBBBBBB....BBBBBBBBBB",
	"BBWBBWBBWBBWBBWB...BBBBBWBBBBB....BBBBBBBBBBBB...BBBBBBBBBBBB....BBBBBBBBBB"
];

//event listeners
document.addEventListener('keydown', (event) => {
	if (event.repeat) return;
	if (keysToPrevent.includes(event.code)) {
		event.preventDefault();
	}
	keysPressed.add(event.code);
});
document.addEventListener('keyup', (event) => {
	if (keysPressed.has(event.code)) {
		keysPressed.delete(event.code);
	}
});


let loadedBgImages = [];
canvas.width = viewportWidth;
canvas.height = viewportHeight;
const tileset = new Image();
let playerSprite;
if (spriteUrl) {
	playerSprite = new Image();
	playerSprite.src = spriteUrl;
}

if (tilesetImg) {
	tileset.src = tilesetImg;
} else {
	console.error("There is no tileset!");
}

function loadBackgrounds() {
	for (let i = 0; i < backgroundLayers.length; i++) {
		const img = new Image();
		img.onerror = () => {
			console.warn(`Failed to load background image: ${backgroundLayers[i] ? backgroundLayers[i].src : 'unknown'}`);
		};
		img.src = backgroundLayers[i].src;
		loadedBgImages[i] = img;
	}
}
loadBackgrounds();
function findStartPosition() {
	if (spawnPoint) {
		player.x = spawnPoint.x * tileSize + tileSize / 2 - player.width / 2;
		player.y = spawnPoint.y * tileSize + tileSize - player.height;
		return;
	}
	for (let y = 0; y < level.length - 1; y++) {
		for (let x = 0; x < level[y].length; x++) {
			const current = level[y][x];
			const below = level[y + 1] ? level[y + 1][x] : '.';
			if (current === '.' && tileTypes[below] && tileTypes[below].solid) {
				player.x = x * tileSize + tileSize / 2 - player.width / 2;
				player.y = y * tileSize + tileSize - player.height;
				return;
			}
		}
	}
}
let cameraX = 0;
let cameraY = 0;
function restartGame() {
	findStartPosition();
	player.speedX = 0;
	player.speedY = 0;
	cameraX = 0;
	cameraY = 0;
}
function getTileAt(px, py) {
	const tx = Math.floor(px / tileSize);
	const ty = Math.floor(py / tileSize);
	if (!Number.isFinite(tx) || !Number.isFinite(ty)) {
		return null;
	} else if (ty < 0 || ty >= level.length) {
		return null;
	} else if (tx < 0 || tx >= level[ty].length) {
		return null;
	} else {
		return tileTypes[level[ty][tx]] || null;
	}
}
function isSolidAt(px, py) {
	const tile = getTileAt(px, py);
	return tile && tile.solid;
}
function update(dt) {
	if (isPressed('left')) {
		player.speedX = -constants.movementSpeed;
		player.facingRight = false;
	} else if (isPressed('right')) {
		player.speedX = constants.movementSpeed;
		player.facingRight = true;
	} else {
		//Different friction for ground vs air - maintain momentum when jumping
		const friction = player.onGround ? 0.7 : 0.98;
		player.speedX *= friction;
		if (Math.abs(player.speedX) < 0.1) player.speedX = 0;
	}
	if (Math.abs(player.speedX) > 0.5 && spriteFrames > 1) {
		player.animTimer++;
		if (player.animTimer >= animationFrameDuration) {
			player.animTimer = 0;
			player.animFrame = (player.animFrame + 1) % spriteFrames;
		}
	} else {
		player.animFrame = 0;
		player.animTimer = 0;
	}
	if (isPressed('jump') && player.onGround) {
		player.speedY = -constants.jumpStrength;
		player.onGround = false;
	}
	player.speedY += constants.gravity * dt;
	if (player.speedY > constants.terminalVelocity) {
		player.speedY = constants.terminalVelocity;
	}
	player.x += player.speedX * dt;
	if (player.speedX > 0) {
		if (isSolidAt(player.x + player.width, player.y + collisionMargin) ||
			isSolidAt(player.x + player.width, player.y + player.height - collisionMargin)) {
			player.x = Math.floor((player.x + player.width) / tileSize) * tileSize - player.width;
			player.speedX = 0;
		}
	} else if (player.speedX < 0) {
		if (isSolidAt(player.x, player.y + collisionMargin) ||
			isSolidAt(player.x, player.y + player.height - collisionMargin)) {
			player.x = Math.floor(player.x / tileSize) * tileSize + tileSize;
			player.speedX = 0;
		}
	}
	player.y += player.speedY * dt;
	player.onGround = false;
	if (player.speedY >= 0) {
		if (isSolidAt(player.x + collisionMargin, player.y + player.height) ||
			isSolidAt(player.x + player.width - collisionMargin, player.y + player.height)) {
			player.y = Math.floor((player.y + player.height) / tileSize) * tileSize - player.height;
			player.speedY = 0;
			player.onGround = true;
		}
	} else if (player.speedY < 0) {
		if (isSolidAt(player.x + collisionMargin, player.y) ||
			isSolidAt(player.x + player.width - collisionMargin, player.y)) {
			player.y = Math.floor(player.y / tileSize) * tileSize + tileSize;
			player.speedY = 0;
		}
	}
	if (player.y > level.length * tileSize + fallDeathThreshold) {
		restartGame();
	}
	const targetCameraX = player.x - viewportWidth / 3;
	cameraX += (targetCameraX - cameraX) * cameraSmoothing;
	cameraX = Math.max(0, Math.min(cameraX, level[0].length * tileSize - viewportWidth));
	const targetCameraY = player.y - viewportHeight / 2;
	cameraY += (targetCameraY - cameraY) * cameraSmoothing;
	const maxCameraY = level.length * tileSize - viewportHeight;
	cameraY = Math.max(0, Math.min(cameraY, maxCameraY > 0 ? maxCameraY : 0));
}

function drawBackgrounds(camX, camY) {
	const levelWorldHeight = level.length * tileSize;
	const levelBottomOnScreen = levelWorldHeight - camY
	const visibleHeight = Math.min(levelBottomOnScreen, viewportHeight);
	for (let i = 0; i < backgroundLayers.length; i++) {
		const layer = backgroundLayers[i];
		const img = loadedBgImages[i];

		if (img && img.complete && img.naturalWidth > 0) {
			const parallaxX = camX * layer.speed;
			const scale = visibleHeight / img.naturalHeight;
			const scaledWidth = Math.ceil(img.naturalWidth * scale);
			const scaledHeight = Math.ceil(visibleHeight);
			const bgY = levelBottomOnScreen - scaledHeight;
			const startX = Math.round(-(parallaxX % scaledWidth));

			for (let x = startX; x < viewportWidth; x += scaledWidth) {
				context.drawImage(img, Math.round(x), bgY, scaledWidth, scaledHeight);
			}

			if (startX > 0) {
				context.drawImage(img, Math.round(startX - scaledWidth), bgY, scaledWidth, scaledHeight);
			}
		}
	}
}

function drawLevel(camX, camY) {
	const startCol = Math.floor(camX / tileSize);
	const endCol = startCol + Math.ceil(viewportWidth / tileSize) + 2;
	const startRow = Math.floor(camY / tileSize);
	const endRow = startRow + Math.ceil(viewportHeight / tileSize) + 2;
	
	for (let y = Math.max(0, startRow); y < Math.min(level.length, endRow); y++) {
		for (let x = startCol; x < endCol && x < level[y].length; x++) {
			const tile = tileTypes[level[y][x]];
			if (tile) {
				const screenX = x * tileSize - camX;
				const screenY = y * tileSize - camY;
				if (tileset.complete && tileset.naturalWidth > 0) {
					context.imageSmoothingEnabled = false;
					context.drawImage(tileset, tile.col * tileSize, tile.row * tileSize, tileSize, tileSize, screenX, screenY, tileSize, tileSize);
				} else {
					context.fillStyle = tile.solid ? '#4a5568' : '#2d3748';
					context.fillRect(screenX, screenY, tileSize, tileSize);
				}
			}
		}
	}
}

function drawPlayer(camX, camY) {
	const playerScreenX = player.x - camX;
	const playerScreenY = player.y - camY;
	
	if (playerSprite && playerSprite.complete && playerSprite.naturalWidth > 0) {
		const frameWidth = playerSprite.naturalWidth / spriteFrames;
		const srcX = player.animFrame * frameWidth;
		context.save();
		context.imageSmoothingEnabled = false;
		if (!player.facingRight) {
			context.translate(playerScreenX + player.width, playerScreenY);
			context.scale(-1, 1);
			context.drawImage(playerSprite, srcX, 0, frameWidth, playerSprite.naturalHeight, 0, 0, player.width, player.height);
		} else {
			context.drawImage(playerSprite, srcX, 0, frameWidth, playerSprite.naturalHeight, playerScreenX, playerScreenY, player.width, player.height);
		}
		context.restore();
	} else {
		context.save();
		let drawX = playerScreenX;
		let drawY = playerScreenY;
		if (player.facingRight) {
			context.translate(playerScreenX + player.width, playerScreenY);
			context.scale(-1, 1);
			drawX = 0; drawY = 0;
		}
		context.fillStyle = player.colour;
		context.fillRect(drawX, drawY, player.width, player.height);
		context.fillStyle = '#fff';
		context.fillRect(drawX + 4, drawY + 6, 4, 4);
		context.fillRect(drawX + 12, drawY + 6, 4, 4);
		context.fillStyle = '#333';
		context.fillRect(drawX + 5, drawY + 8, 2, 2);
		context.fillRect(drawX + 13, drawY + 8, 2, 2);
		context.restore();
	}
}

function draw() {
	const camX = Math.round(cameraX);
	const camY = Math.round(cameraY);
	
	const gradient = context.createLinearGradient(0, 0, 0, viewportHeight);
	gradient.addColorStop(0, '#1a1a3e');
	gradient.addColorStop(1, '#2d1b4e');
	context.fillStyle = gradient;
	context.fillRect(0, 0, viewportWidth, viewportHeight);

	drawBackgrounds(camX, camY);
	drawLevel(camX, camY);
	drawPlayer(camX, camY);
}

let lastTime = 0;
function gameLoop(currentTime) {
	if (lastTime === 0) {
		lastTime = currentTime;
	}
	const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05); //currentTime is built in; we use this to find the change in time in seconds (hence the division by 1000)
	lastTime = currentTime; //update the last recorded time to the most recent given timestamp
	update(deltaTime);
	draw();
	requestAnimationFrame(gameLoop);
}
findStartPosition();
requestAnimationFrame(gameLoop);
