// Flappy Bird Remake
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Background music setup
const backgroundMusic = new Audio('assets/sounds/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // 50% volume - adjust as needed

// Start music on first user interaction
let musicStarted = false;
function startMusic() {
    if (!musicStarted) {
        backgroundMusic.play().catch(err => {
            console.log('Music autoplay prevented. Will start on first click.');
        });
        musicStarted = true;
    }
}

// Game configuration
const config = {
    gravity: 0.045,
    flapStrength: -3,
    pipeSpeed: 1.35,
    pipeGap: 180,
    pipeSpacing: 250,
    birdSize: 68,        // Visual size of the bird
    birdHitboxSize: 30,  // Collision detection size (smaller to match visible area)
    pipeWidth: 70        // Updated to match new pipe SVG width
};

// Asset manager
const assets = {
    bird: null,
    background: null,
    // Multiple pipe color variations
    pipes: {
        pink: { top: null, bottom: null },
        purple: { top: null, bottom: null },
        green: { top: null, bottom: null }
    },
    imagesLoaded: false,

    load() {
        // Attempt to load custom images (try PNG, JPG, and SVG)
        const imagesToLoad = [
            { key: 'bird', srcs: ['assets/images/bird.png', 'assets/images/bird.svg'] },
            { key: 'pipeTopPink', srcs: ['assets/images/pipe-top-pink.svg'] },
            { key: 'pipeBottomPink', srcs: ['assets/images/pipe-bottom-pink.svg'] },
            { key: 'pipeTopPurple', srcs: ['assets/images/pipe-top-purple.svg'] },
            { key: 'pipeBottomPurple', srcs: ['assets/images/pipe-bottom-purple.svg'] },
            { key: 'pipeTopGreen', srcs: ['assets/images/pipe-top-green.svg'] },
            { key: 'pipeBottomGreen', srcs: ['assets/images/pipe-bottom-green.svg'] },
            { key: 'background', srcs: ['assets/images/background.png', 'assets/images/background.jpg', 'assets/images/background.jpeg', 'assets/images/background.svg'] }
        ];

        let loadedCount = 0;
        const totalImages = imagesToLoad.length;

        imagesToLoad.forEach(imgData => {
            const tryLoadImage = (srcIndex = 0) => {
                if (srcIndex >= imgData.srcs.length) {
                    // No more sources to try
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        console.log('Using default graphics (add custom images to assets/images/)');
                    }
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    // Map pipe images to their color groups
                    if (imgData.key === 'pipeTopPink') this.pipes.pink.top = img;
                    else if (imgData.key === 'pipeBottomPink') this.pipes.pink.bottom = img;
                    else if (imgData.key === 'pipeTopPurple') this.pipes.purple.top = img;
                    else if (imgData.key === 'pipeBottomPurple') this.pipes.purple.bottom = img;
                    else if (imgData.key === 'pipeTopGreen') this.pipes.green.top = img;
                    else if (imgData.key === 'pipeBottomGreen') this.pipes.green.bottom = img;
                    else this[imgData.key] = img;

                    loadedCount++;
                    if (loadedCount === totalImages) {
                        this.imagesLoaded = true;
                    }
                };
                img.onerror = () => {
                    // Try next format
                    tryLoadImage(srcIndex + 1);
                };
                img.src = imgData.srcs[srcIndex];
            };

            tryLoadImage();
        });
    }
};

// Game state
const gameState = {
    current: 'start', // 'start', 'playing', 'gameOver', 'paused'
    score: 0,
    highScore: localStorage.getItem('flappyHighScore') || 0,
    frames: 0
};

// Bird object
const bird = {
    x: 80,
    y: canvas.height / 2,
    velocity: 0,
    rotation: 0,

    reset() {
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.rotation = 0;
    },

    flap() {
        // Start background music on first interaction
        startMusic();

        if (gameState.current === 'start') {
            gameState.current = 'playing';
            document.getElementById('startScreen').classList.add('hidden');
        }

        if (gameState.current === 'playing') {
            this.velocity = config.flapStrength;
        }

        if (gameState.current === 'gameOver') {
            resetGame();
        }
    },

    update() {
        if (gameState.current === 'playing') {
            this.velocity += config.gravity;
            this.y += this.velocity;

            // Calculate rotation based on velocity
            this.rotation = Math.min(Math.max(this.velocity * 3, -25), 90);

            // Check boundaries (using hitbox size for accurate collision)
            if (this.y + config.birdHitboxSize / 2 >= canvas.height) {
                this.y = canvas.height - config.birdHitboxSize / 2;
                gameOver();
            }

            if (this.y - config.birdHitboxSize / 2 <= 0) {
                this.y = config.birdHitboxSize / 2;
                this.velocity = 0;
            }
        }
    },

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (assets.bird && assets.imagesLoaded) {
            // Draw custom bird image
            ctx.drawImage(
                assets.bird,
                -config.birdSize / 2,
                -config.birdSize / 2,
                config.birdSize,
                config.birdSize
            );
        } else {
            // Draw default bird
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;

            // Bird body
            ctx.beginPath();
            ctx.arc(0, 0, config.birdSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(5, -5, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(7, -5, 3, 0, Math.PI * 2);
            ctx.fill();

            // Beak
            ctx.fillStyle = '#FF6347';
            ctx.beginPath();
            ctx.moveTo(config.birdSize / 2 - 5, 0);
            ctx.lineTo(config.birdSize / 2 + 5, 2);
            ctx.lineTo(config.birdSize / 2 - 5, 4);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
};

// Pipes array
const pipes = [];

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - config.pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    // Randomly select pipe color
    const colors = ['pink', 'purple', 'green'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + config.pipeGap,
        scored: false,
        color: color
    });
}

function updatePipes() {
    if (gameState.current !== 'playing') return;

    // Create new pipes
    if (gameState.frames % Math.floor(config.pipeSpacing / config.pipeSpeed) === 0) {
        createPipe();
    }

    // Update existing pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= config.pipeSpeed;

        // Remove off-screen pipes
        if (pipe.x + config.pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }

        // Check collision
        if (checkCollision(pipe)) {
            gameOver();
        }

        // Score point
        if (!pipe.scored && pipe.x + config.pipeWidth < bird.x) {
            pipe.scored = true;
            gameState.score++;
            document.getElementById('score').textContent = gameState.score;
        }
    }
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Get the pipe images for this pipe's color
        const pipeColor = assets.pipes[pipe.color];

        if (pipeColor && pipeColor.top && pipeColor.bottom && assets.imagesLoaded) {
            // Draw colored pipe images
            ctx.drawImage(
                pipeColor.top,
                pipe.x,
                pipe.topHeight - pipeColor.top.height,
                config.pipeWidth,
                pipeColor.top.height
            );
            ctx.drawImage(
                pipeColor.bottom,
                pipe.x,
                pipe.bottomY,
                config.pipeWidth,
                canvas.height - pipe.bottomY
            );
        } else {
            // Draw default pipes
            // Top pipe
            ctx.fillStyle = '#5cb85c';
            ctx.strokeStyle = '#4cae4c';
            ctx.lineWidth = 3;
            ctx.fillRect(pipe.x, 0, config.pipeWidth, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, config.pipeWidth, pipe.topHeight);

            // Top pipe cap
            ctx.fillStyle = '#6cc46c';
            ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, config.pipeWidth + 10, 20);
            ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, config.pipeWidth + 10, 20);

            // Bottom pipe
            ctx.fillStyle = '#5cb85c';
            ctx.fillRect(pipe.x, pipe.bottomY, config.pipeWidth, canvas.height - pipe.bottomY);
            ctx.strokeRect(pipe.x, pipe.bottomY, config.pipeWidth, canvas.height - pipe.bottomY);

            // Bottom pipe cap
            ctx.fillStyle = '#6cc46c';
            ctx.fillRect(pipe.x - 5, pipe.bottomY, config.pipeWidth + 10, 20);
            ctx.strokeRect(pipe.x - 5, pipe.bottomY, config.pipeWidth + 10, 20);
        }
    });
}

function checkCollision(pipe) {
    // Use hitbox size for accurate collision (smaller than visual size)
    const birdLeft = bird.x - config.birdHitboxSize / 2;
    const birdRight = bird.x + config.birdHitboxSize / 2;
    const birdTop = bird.y - config.birdHitboxSize / 2;
    const birdBottom = bird.y + config.birdHitboxSize / 2;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + config.pipeWidth;

    // Check if bird is in pipe's x range
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird hit top or bottom pipe
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
            return true;
        }
    }

    return false;
}

function drawBackground() {
    if (assets.background && assets.imagesLoaded) {
        ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
    } else {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#4ec0ca');
        gradient.addColorStop(1, '#87ceeb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(100, 80, 30, 0, Math.PI * 2);
        ctx.arc(130, 70, 40, 0, Math.PI * 2);
        ctx.arc(160, 80, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(280, 120, 35, 0, Math.PI * 2);
        ctx.arc(310, 110, 45, 0, Math.PI * 2);
        ctx.arc(340, 120, 35, 0, Math.PI * 2);
        ctx.fill();

        // Ground
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

        // Grass
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, canvas.height - 70, canvas.width, 10);
    }
}

function gameOver() {
    gameState.current = 'gameOver';

    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('flappyHighScore', gameState.highScore);
    }

    // Show game over screen
    document.getElementById('finalScore').textContent = `Score: ${gameState.score}`;
    document.getElementById('highScore').textContent = `Best: ${gameState.highScore}`;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function resetGame() {
    gameState.current = 'playing';
    gameState.score = 0;
    gameState.frames = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOverScreen').classList.add('hidden');

    bird.reset();
    pipes.length = 0;
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Update and draw pipes
    updatePipes();
    drawPipes();

    // Update and draw bird
    bird.update();
    bird.draw();

    // Increment frames
    if (gameState.current === 'playing') {
        gameState.frames++;
    }

    requestAnimationFrame(gameLoop);
}

// Pause/Unpause function
function togglePause() {
    if (gameState.current === 'playing') {
        // Pause the game
        gameState.current = 'paused';
        backgroundMusic.pause();
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else if (gameState.current === 'paused') {
        // Unpause the game
        gameState.current = 'playing';
        backgroundMusic.play();
        document.getElementById('pauseScreen').classList.add('hidden');
    }
}

// Event listeners
document.addEventListener('click', () => bird.flap());
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        bird.flap();
    }
    if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
    }
});

// Initialize game
assets.load();
gameLoop();
