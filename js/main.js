import { GameState } from './gameState.js';
import { EventSystem } from './eventSystem.js';

class Game {
    constructor() {
        console.log('Game initializing...');
        this.gameState = new GameState();
        this.eventSystem = new EventSystem(this.gameState);
        this.gameArea = document.getElementById('gameArea');
        this.card = document.querySelector('.card');
        this.helpDialog = document.getElementById('helpDialog');
        this.setupSplashScreen();
        this.setupControls();
        this.setupHelpDialog();
        this.render();
        window.game = this;
        this.gameActive = false;
        console.log('Game initialization complete');
    }

    setupSplashScreen() {
        const newGameBtn = document.getElementById('newGameBtn');
        const loadGameBtn = document.getElementById('loadGameBtn');
        const saveGameBtn = document.getElementById('saveGameBtn');

        newGameBtn.addEventListener('click', () => {
            this.startNewGame();
        });

        loadGameBtn.addEventListener('click', () => {
            this.loadGame();
        });

        saveGameBtn.addEventListener('click', () => {
            this.saveGame();
        });

        // Initially hide save button until game starts
        saveGameBtn.style.display = 'none';
    }

    startNewGame() {
        // Create a fresh GameState instance with default values
        this.gameState = new GameState();
        // Ensure the eventSystem is updated with the new gameState
        this.eventSystem = new EventSystem(this.gameState);
        this.gameActive = true;
        this.card.classList.add('is-flipped');
        document.getElementById('saveGameBtn').style.display = 'block';
        // Render to show initial state with default gold
        this.render();
    }

    saveGame() {
        const gameData = {
            gameState: this.gameState.getState(),
            player: this.gameState.player,
            grid: this.gameState.grid
        };
        localStorage.setItem('simpleRPG_saveGame', JSON.stringify(gameData));
        alert('Game saved successfully!');
    }

    loadGame() {
        const savedGame = localStorage.getItem('simpleRPG_saveGame');
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            // Create a new GameState instance to ensure clean state
            this.gameState = new GameState();
            // Then update with saved data
            this.gameState.player = gameData.player;
            this.gameState.grid = gameData.grid;
            // Update eventSystem with the loaded gameState
            this.eventSystem = new EventSystem(this.gameState);
            this.render();
            this.card.classList.add('is-flipped');
            this.gameActive = true;
            document.getElementById('saveGameBtn').style.display = 'block';
        } else {
            alert('No saved game found!');
        }
    }

    showSplashScreen() {
        this.card.classList.remove('is-flipped');
        // Only hide save button if no active game
        if (!this.gameActive) {
            document.getElementById('saveGameBtn').style.display = 'none';
        }
    }

    setupHelpDialog() {
        const helpBtn = document.getElementById('helpBtn');
        const closeHelpBtn = document.getElementById('closeHelpBtn');

        helpBtn.addEventListener('click', () => {
            this.helpDialog.showModal();
        });

        closeHelpBtn.addEventListener('click', () => {
            this.helpDialog.close();
        });

        // Close dialog when clicking outside
        this.helpDialog.addEventListener('click', (e) => {
            const dialogDimensions = this.helpDialog.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                this.helpDialog.close();
            }
        });
    }

    setupControls() {
        console.log('Setting up controls...');
        // Movement controls
        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');

        console.log('Control buttons:', { upBtn, downBtn, leftBtn, rightBtn });

        // Ensure buttons exist before adding listeners
        if (upBtn) {
            upBtn.addEventListener('click', () => {
                console.log('Up button clicked');
                this.handleMove('up');
            });
        }
        if (downBtn) {
            downBtn.addEventListener('click', () => {
                console.log('Down button clicked');
                this.handleMove('down');
            });
        }
        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                console.log('Left button clicked');
                this.handleMove('left');
            });
        }
        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                console.log('Right button clicked');
                this.handleMove('right');
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);

            // Handle Escape key first
            if (e.key === 'Escape') {
                e.preventDefault();
                this.showSplashScreen();
                return;
            }

            // Only handle movement keys if game is active (card is flipped)
            if (this.card.classList.contains('is-flipped')) {
                e.preventDefault(); // Prevent default scroll behavior
                switch(e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        this.handleMove('up');
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        this.handleMove('down');
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        this.handleMove('left');
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        this.handleMove('right');
                        break;
                }
            }
        });

        // Touch swipe controls
        let touchStartX = 0;
        let touchStartY = 0;

        this.gameArea.addEventListener('touchstart', (e) => {
            console.log('Touch start detected');
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });

        this.gameArea.addEventListener('touchend', (e) => {
            console.log('Touch end detected');
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.handleMove('right');
                    } else {
                        this.handleMove('left');
                    }
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.handleMove('down');
                    } else {
                        this.handleMove('up');
                    }
                }
            }
        }, { passive: false });

        console.log('Controls setup complete');
    }

    handleMove(direction) {
        console.log('Handling move:', direction);
        const moved = this.gameState.movePlayer(direction);
        console.log('Move successful:', moved);
        if (moved) {
            const event = this.gameState.generateEvent();
            console.log('Generated event:', event);
            if (event.type !== 'NOTHING') {
                this.eventSystem.handleEvent(event);
            }
            this.render();
        }
    }

    render() {
        console.log('Rendering game state...');
        const state = this.gameState.getState();

        // Update help dialog XP
        const helpXp = document.getElementById('helpXp');
        if (helpXp) {
            helpXp.textContent = state.player.xp;
        }

        // Clear game area
        while (this.gameArea.firstChild) {
            this.gameArea.removeChild(this.gameArea.firstChild);
        }

        // Render grid
        for (let y = 0; y < state.grid.length; y++) {
            for (let x = 0; x < state.grid[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';

                // Render player at their current position
                if (x === state.player.x && y === state.player.y) {
                    cell.textContent = state.playerTile;
                } else {
                    cell.textContent = state.grid[y][x];
                }

                this.gameArea.appendChild(cell);
            }
        }

        // Update stats
        document.getElementById('hp').textContent = '❤️'.repeat(state.player.hp);
        document.getElementById('xp').textContent = state.player.xp;
        document.getElementById('gold').textContent = `💰 ${state.player.gold}`;
        console.log('Render complete');
    }

    async shareProgress() {
        const state = this.gameState.getState();
        const shareData = {
            title: 'Simple RPG Progress',
            text: `I've earned ${state.player.xp} XP and collected ${state.player.gold} gold in Simple RPG! 🎮`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Web Share API not supported in your browser. Here\'s your progress:\n\n' + shareData.text);
            }
        } catch (err) {
            console.error('Error sharing:', err);
            alert('Failed to share. Here\'s your progress:\n\n' + shareData.text);
        }
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, starting game...');
    new Game();
});
