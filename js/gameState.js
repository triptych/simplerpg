export class GameState {
    constructor() {
        this.gridSize = 5;
        this.grid = [];
        this.player = {
            x: Math.floor(this.gridSize / 2),
            y: Math.floor(this.gridSize / 2),
            hp: 3,
            maxHp: 3,
            xp: 0,
            gold: 10
        };
        this.tiles = {
            TREE1: '🌲',
            TREE2: '🌳',
            PLAYER: '😊',
            EMPTY: '🌱',
            SHOP: '🏪',
            INN: '🏨'
        };
        this.events = {
            NOTHING: { chance: 0.55 },
            FOOD: { chance: 0.15, types: ['🍎', '🍖'] },
            MONSTER: {
                chance: 0.15,
                types: [
                    { emoji: '🐰', name: 'Forest Rabbit', hp: 2, damage: 1 },
                    { emoji: '🦊', name: 'Wild Fox', hp: 3, damage: 2 },
                    { emoji: '🐺', name: 'Wolf', hp: 4, damage: 3 }
                ]
            },
            TREASURE: {
                chance: 0.05,
                trapChance: 0.4,
                trapDamage: 2,
                minGold: 3,
                maxGold: 8
            },
            SHOP: { chance: 0.05 },
            INN: { chance: 0.05 }
        };
        this.initializeGrid();
    }

    initializeGrid() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(this.tiles.EMPTY));

        // Place trees randomly, but ensure there's always a path
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                // Skip the player's position and adjacent tiles
                if (Math.abs(x - this.player.x) <= 1 && Math.abs(y - this.player.y) <= 1) {
                    continue;
                }
                // 50% chance to place a tree
                if (Math.random() < 0.5) {
                    this.grid[y][x] = Math.random() < 0.5 ? this.tiles.TREE1 : this.tiles.TREE2;
                }
            }
        }

        // Ensure player position is empty
        this.grid[this.player.y][this.player.x] = this.tiles.EMPTY;
    }

    movePlayer(direction) {
        const newPosition = { x: this.player.x, y: this.player.y };

        switch (direction) {
            case 'up': newPosition.y = Math.max(0, this.player.y - 1); break;
            case 'down': newPosition.y = Math.min(this.gridSize - 1, this.player.y + 1); break;
            case 'left': newPosition.x = Math.max(0, this.player.x - 1); break;
            case 'right': newPosition.x = Math.min(this.gridSize - 1, this.player.x + 1); break;
        }

        // Check if the new position is walkable (not a tree)
        if (this.grid[newPosition.y][newPosition.x] === this.tiles.EMPTY ||
            this.grid[newPosition.y][newPosition.x] === this.tiles.SHOP ||
            this.grid[newPosition.y][newPosition.x] === this.tiles.INN) {

            // Update player position
            this.player.x = newPosition.x;
            this.player.y = newPosition.y;
            return true;
        }

        return false;
    }

    generateEvent() {
        const rand = Math.random();
        let cumulativeChance = 0;

        for (const [eventType, eventData] of Object.entries(this.events)) {
            cumulativeChance += eventData.chance;
            if (rand < cumulativeChance) {
                return { type: eventType, data: eventData };
            }
        }

        return { type: 'NOTHING', data: this.events.NOTHING };
    }

    updateStats(changes) {
        if (changes.hp !== undefined) {
            this.player.hp = Math.min(Math.max(0, this.player.hp + changes.hp), this.player.maxHp);
        }
        if (changes.xp !== undefined) {
            this.player.xp += changes.xp;
        }
        if (changes.gold !== undefined) {
            this.player.gold = Math.max(0, this.player.gold + changes.gold);
        }
    }

    getState() {
        return {
            grid: this.grid,
            player: { ...this.player },
            playerTile: this.tiles.PLAYER
        };
    }
}