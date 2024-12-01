# Simple RPG

A browser-based RPG game with grid movement, events, and resource management.

## Features

- Grid-based movement system
- Multiple control options:
  - Keyboard arrows (↑←↓→)
  - WASD keys
  - On-screen buttons
  - Touch swipe support for mobile devices
- Player stats tracking:
  - Health Points (HP)
  - Experience Points (XP)
  - Gold
- Dynamic event system
- Responsive design for both desktop and mobile play

## How to Play

1. Open `index.html` in a modern web browser
2. Use any of the following controls to move your character:
   - Arrow keys or WASD on keyboard
   - Click the directional buttons on screen
   - Swipe on touch devices
3. Navigate the grid to:
   - Collect gold
   - Gain experience
   - Manage your health points
4. Watch for events that occur as you move around

## Project Structure

```
simplerpg/
├── index.html          # Main game page
├── styles/
│   └── main.css       # Game styling
├── js/
│   ├── main.js        # Game initialization and core logic
│   ├── gameState.js   # Game state management
│   └── eventSystem.js # Event handling system
```

## Technical Details

- Built with vanilla JavaScript using ES6 modules
- No external dependencies required
- Fully client-side game logic
- Event-driven architecture
- Responsive CSS grid layout

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
