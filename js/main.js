import { GameState } from './gameState.js';
import { EventSystem } from './eventSystem.js';

class Game {
    constructor() {
        console.log('Game initializing...');
        this.gameState = new GameState();
        this.eventSystem = new EventSystem(this.gameState);
        this.gameArea = document.getElementById('gameArea');
        console.log('Game area element:', this.gameArea);
        this.setupControls();
        this.render();
        window.game = this;
        console.log('Game initialization complete');
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
        document.getElementById('xp').textContent = '⭐️'.repeat(state.player.xp);
        document.getElementById('gold').textContent = `💰 ${state.player.gold}`;
        console.log('Render complete');
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, starting game...');
    new Game();
});
