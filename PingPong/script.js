const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const pausedDisplay = document.querySelector('.game-paused');
let player1Pos = canvas.height / 2 - 50;
let player2Pos = canvas.height / 2 - 50;
let player1Score = 0;
let player2Score = 0;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let ball = { 
    x: canvas.width / 2, 
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 5 * (Math.random() * 2 - 1)
};

let lastTimestamp = 0;
let gameSpeed = 1;
let hitEffect = 0;
let gameRunning = false;
let animationFrameId = null;
const colors = {
    background: '#111',
    player1: '#00f',
    player2: '#f00',
    ball: '#fff',
    net: 'rgba(255, 255, 255, 0.2)'
};
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
function setupEventListeners() {
    addEventListener('keydown', handleKeyDown);
    addEventListener('keyup', handleKeyUp);
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resetBtn.addEventListener('click', resetGame);
}

function handleKeyDown(event) {
    if (event.key in keys) {
        keys[event.key] = true;
    }
    switch (event.key) {
        case '8':
            keys.ArrowUp = true;
            break;
        case '2':
            keys.ArrowDown = true;
            break;
        case ' ':
            if (gameRunning) {
                pauseGame();
            } else {
                startGame();
            }
            break;
    }
}

function handleKeyUp(event) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
    switch (event.key) {
        case '8':
            keys.ArrowUp = false;
            break;
        case '2':
            keys.ArrowDown = false;
            break;
    }
}
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        pausedDisplay.style.display = 'none';
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        pausedDisplay.style.display = 'block';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        cancelAnimationFrame(animationFrameId);
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    player1ScoreElement.textContent = '0';
    player2ScoreElement.textContent = '0';
    resetBall(ball.vx > 0 ? 1 : -1);
    gameSpeed = 1;
    if (gameRunning) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        render();
    }
}
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    update(deltaTime);
    render();
    
    if (gameRunning) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function update(deltaTime) {
    if (!gameRunning) return;
    const speedFactor = deltaTime / (1000 / 60);
    const paddleSpeed = 8 * speedFactor * gameSpeed;
    
    if (keys.w) player2Pos = Math.max(0, player2Pos - paddleSpeed);
    if (keys.s) player2Pos = Math.min(canvas.height - paddleHeight, player2Pos + paddleSpeed);
    if (keys.ArrowUp) player1Pos = Math.max(0, player1Pos - paddleSpeed);
    if (keys.ArrowDown) player1Pos = Math.min(canvas.height - paddleHeight, player1Pos + paddleSpeed);
    ball.x += ball.vx * speedFactor * gameSpeed;
    ball.y += ball.vy * speedFactor * gameSpeed;
    if (ball.y - ballSize <= 0 || ball.y + ballSize >= canvas.height) {
        ball.vy = -ball.vy;
        hitEffect = 1;
    }
    if (ball.x - ballSize <= paddleWidth && 
        ball.y >= player2Pos && 
        ball.y <= player2Pos + paddleHeight) {
        const hitPosition = (ball.y - (player2Pos + paddleHeight/2)) / (paddleHeight/2);
        ball.vy = hitPosition * 5;
        
        ball.vx = Math.abs(ball.vx) * 1.05;
        ball.x = paddleWidth + ballSize;
        hitEffect = 1;
        gameSpeed = Math.min(1.5, gameSpeed + 0.02);
    }
    if (ball.x + ballSize >= canvas.width - paddleWidth && 
        ball.y >= player1Pos && 
        ball.y <= player1Pos + paddleHeight) {
        const hitPosition = (ball.y - (player1Pos + paddleHeight/2)) / (paddleHeight/2);
        ball.vy = hitPosition * 5;
        
        ball.vx = -Math.abs(ball.vx) * 1.05;
        ball.x = canvas.width - paddleWidth - ballSize;
        hitEffect = 1;
        gameSpeed = Math.min(1.5, gameSpeed + 0.02);
    }
    if (ball.x < 0) {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
        resetBall(1);
    } else if (ball.x > canvas.width) {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
        resetBall(-1);
    }
    if (hitEffect > 0) {
        hitEffect -= 0.05;
    }
}

function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * direction;
    ball.vy = 5 * (Math.random() * 2 - 1);
    gameSpeed = 1;
    player1Pos = canvas.height / 2 - 50;
    player2Pos = canvas.height / 2 - 50;
    if (gameRunning) {
        pauseGame();
        setTimeout(startGame, 1000);
    }
}

function render() {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = colors.net;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.player2;
    ctx.fillRect(0, player2Pos, paddleWidth, paddleHeight);
    ctx.fillStyle = colors.player1;
    ctx.fillRect(canvas.width - paddleWidth, player1Pos, paddleWidth, paddleHeight);
    const scale = 1 + hitEffect * 0.2;
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.scale(scale, scale);
    ctx.fillStyle = colors.ball;
    ctx.beginPath();
    ctx.arc(0, 0, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (hitEffect > 0) {
        ctx.shadowBlur = 20 * hitEffect;
        ctx.shadowColor = 'white';
        ctx.fillStyle = colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
setupEventListeners();
render();