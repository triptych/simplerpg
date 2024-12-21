export class EventSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.eventOverlay = document.getElementById('eventOverlay');
        this.currentMonsterHp = 0;
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
            case 'TREASURE':
                return this.handleTreasureEvent();
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

        // Get all buttons in the overlay
        const buttons = this.eventOverlay.querySelectorAll('button');
        if (buttons.length > 0) {
            // Focus first button
            buttons[0].focus();

            // Track current focused button index
            let currentFocusIndex = 0;

            // Add keyboard navigation
            this.eventOverlay.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        currentFocusIndex = (currentFocusIndex + 1) % buttons.length;
                        buttons[currentFocusIndex].focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        currentFocusIndex = (currentFocusIndex - 1 + buttons.length) % buttons.length;
                        buttons[currentFocusIndex].focus();
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        buttons[currentFocusIndex].click();
                        break;
                }
            });
        }
    }

    hideEventOverlay() {
        this.eventOverlay.classList.add('hidden');
        window.game.render();
    }

    handleFoodEvent() {
        const food = this.gameState.events.FOOD.types[Math.floor(Math.random() * 2)];
        const healAmount = food === '🍎' ? 2 : 5;

        const xpReward = 1; // 1 XP for finding food
        this.showEventOverlay(`
            <h2>You found some food!</h2>
            <p>${food}</p>
            <p>Restored ${healAmount} HP and gained ${xpReward} XP</p>
            <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
        `);

        this.gameState.updateStats({ hp: healAmount, xp: xpReward });
    }

    handleMonsterEvent() {
        const monsters = this.gameState.events.MONSTER.types;
        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        this.currentMonsterHp = monster.hp;

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

    handleTreasureEvent() {
        this.showEventOverlay(`
            <h2>You found a treasure chest! 💎</h2>
            <p>Do you want to open it?</p>
            <button onclick="window.game.eventSystem.openTreasure()">Open Chest</button>
            <button onclick="window.game.eventSystem.hideEventOverlay()">Leave it</button>
        `);
        window.game.eventSystem = this;
    }

    openTreasure() {
        const treasureData = this.gameState.events.TREASURE;
        const isTrapped = Math.random() < treasureData.trapChance;

        if (isTrapped) {
            this.gameState.updateStats({ hp: -treasureData.trapDamage });
            this.showEventOverlay(`
                <h2>It was trapped! 💥</h2>
                <p>You took ${treasureData.trapDamage} damage</p>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        } else {
            const goldFound = Math.floor(Math.random() * (treasureData.maxGold - treasureData.minGold + 1)) + treasureData.minGold;
            const xpReward = Math.floor(Math.random() * 2) + 2; // 2-3 XP for finding treasure
            this.gameState.updateStats({ gold: goldFound, xp: xpReward });
            this.showEventOverlay(`
                <h2>Treasure! ✨</h2>
                <p>You found ${goldFound} gold and ${xpReward} XP!</p>
                <button onclick="window.game.eventSystem.hideEventOverlay()">Continue</button>
            `);
        }
    }

    combat(action, monsterDamage) {
        let result = '';

        switch (action) {
            case 'attack':
                this.currentMonsterHp--;
                if (this.currentMonsterHp <= 0) {
                    const goldReward = Math.floor(Math.random() * 5) + 3;
                    const xpReward = Math.floor(Math.random() * 3) + 3; // 3-5 XP for defeating monsters
                    this.gameState.updateStats({ gold: goldReward, xp: xpReward });
                    window.game.render();
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
        this.hideEventOverlay();
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
