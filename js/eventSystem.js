export class EventSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.eventOverlay = document.getElementById('eventOverlay');
        this.currentMonsterHp = 0; // Add this as a class property
    }

    handleEvent(event) {
        switch (event.type) {
            case 'FOOD':
                return this.handleFoodEvent();
            case 'MONSTER':
                return this.handleMonsterEvent();
            case 'SHOP':
                return this.handleShopEvent();
            case 'INN':
                return this.handleInnEvent();
            default:
                return null;
        }
    }

    showEventOverlay(content) {
        this.eventOverlay.innerHTML = `
            <div class="event-content">
                ${content}
            </div>
        `;
        this.eventOverlay.classList.remove('hidden');
    }

    hideEventOverlay() {
        this.eventOverlay.classList.add('hidden');
        window.game.render(); // Add render call when hiding overlay
    }

    handleFoodEvent() {
        const food = this.gameState.events.FOOD.types[Math.floor(Math.random() * 2)];
        const healAmount = food === '🍎' ? 2 : 5;

        this.showEventOverlay(`
            <h2>You found some food!</h2>
            <p>${food}</p>
            <p>Restored ${healAmount} HP</p>
            <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
        `);

        this.gameState.updateStats({ hp: healAmount });
    }

    handleMonsterEvent() {
        const monsters = this.gameState.events.MONSTER.types;
        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        this.currentMonsterHp = monster.hp; // Set the monster HP as a class property

        const updateCombatUI = () => {
            const content = `
                <h2>${monster.emoji} ${monster.name}</h2>
                <p>HP: ${'❤️'.repeat(this.currentMonsterHp)}</p>
                <button onclick="window.game.eventSystem.combat('attack', ${monster.damage})">⚔️ Attack</button>
                <button onclick="window.game.eventSystem.combat('defend', ${monster.damage})">🛡️ Defend</button>
                <button onclick="window.game.eventSystem.combat('run', ${monster.damage})">🏃 Run</button>
            `;
            this.showEventOverlay(content);
        };

        updateCombatUI();
        window.game.eventSystem = this;
    }

    combat(action, monsterDamage) {
        let result = '';

        switch (action) {
            case 'attack':
                this.currentMonsterHp--;
                if (this.currentMonsterHp <= 0) {
                    const goldReward = Math.floor(Math.random() * 5) + 3;
                    this.gameState.updateStats({ gold: goldReward, xp: 1 });
                    window.game.render(); // Add render call after updating stats
                    this.showEventOverlay(`
                        <h2>Victory!</h2>
                        <p>You earned ${goldReward} gold and 1 XP</p>
                        <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
                    `);
                    return;
                }
                this.gameState.updateStats({ hp: -monsterDamage });
                break;

            case 'defend':
                this.gameState.updateStats({ hp: -Math.floor(monsterDamage / 2) });
                break;

            case 'run':
                if (Math.random() > 0.5) {
                    this.showEventOverlay(`
                        <h2>Escaped!</h2>
                        <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
                    `);
                    return;
                }
                this.gameState.updateStats({ hp: -monsterDamage });
                break;
        }

        if (this.gameState.player.hp <= 0) {
            this.showEventOverlay(`
                <h2>Game Over!</h2>
                <p>You were defeated...</p>
                <button onclick="window.game.eventSystem.startNewGameFromDeath()">Try Again</button>
            `);
            return;
        }

        const monsters = this.gameState.events.MONSTER.types;
        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        const content = `
            <h2>${monster.emoji} ${monster.name}</h2>
            <p>HP: ${'❤️'.repeat(this.currentMonsterHp)}</p>
            <button onclick="window.game.eventSystem.combat('attack', ${monsterDamage})">⚔️ Attack</button>
            <button onclick="window.game.eventSystem.combat('defend', ${monsterDamage})">🛡️ Defend</button>
            <button onclick="window.game.eventSystem.combat('run', ${monsterDamage})">🏃 Run</button>
        `;
        this.showEventOverlay(content);
    }

    startNewGameFromDeath() {
        // Hide the game over overlay first
        this.hideEventOverlay();
        // Then start a new game
        window.game.startNewGame();
    }

    handleShopEvent() {
        const shopItems = [
            { name: '🗡️ Sword', cost: 10, effect: { damage: 2 } },
            { name: '🛡️ Shield', cost: 15, effect: { defense: 2 } },
            { name: '🧪 Potion', cost: 5, effect: { hp: 5 } }
        ];

        const content = `
            <h2>🏪 Shop</h2>
            ${shopItems.map(item => `
                <div>
                    <button onclick="window.game.eventSystem.buyItem('${item.name}', ${item.cost}, ${JSON.stringify(item.effect).replace(/"/g, "'")})">
                        ${item.name} - ${item.cost}g
                    </button>
                </div>
            `).join('')}
            <button onclick="window.game.eventSystem.hideEventOverlay()">Leave Shop</button>
        `;

        this.showEventOverlay(content);
        window.game.eventSystem = this;
    }

    buyItem(name, cost, effect) {
        if (this.gameState.player.gold >= cost) {
            this.gameState.updateStats({ gold: -cost, ...effect });
            this.showEventOverlay(`
                <h2>Purchase Successful!</h2>
                <p>You bought: ${name}</p>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        } else {
            this.showEventOverlay(`
                <h2>Not enough gold!</h2>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        }
    }

    handleInnEvent() {
        const restCost = 5;
        const content = `
            <h2>🏨 Inn</h2>
            <p>Rest and restore HP (${restCost} gold)?</p>
            <button onclick="window.game.eventSystem.rest(${restCost})">Rest</button>
            <button onclick="window.game.eventSystem.hideEventOverlay()">Leave</button>
        `;

        this.showEventOverlay(content);
        window.game.eventSystem = this;
    }

    rest(cost) {
        if (this.gameState.player.gold >= cost) {
            this.gameState.updateStats({
                gold: -cost,
                hp: this.gameState.player.maxHp
            });
            this.showEventOverlay(`
                <h2>Rest Complete!</h2>
                <p>HP fully restored!</p>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        } else {
            this.showEventOverlay(`
                <h2>Not enough gold!</h2>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        }
    }
}
