# Simple RPG

A browser-based RPG game with emoji-based graphics, grid movement, events, and resource management. Optimized for both desktop and mobile play with a delightful, touch-friendly interface.

## Features

- Grid-based movement system with multiple control options:
  - Keyboard arrows (↑←↓→)
  - WASD keys
  - On-screen buttons
  - Touch swipe support for mobile devices
- Emoji-based graphics for universal appeal
- Player stats tracking:
  - Health Points (❤️)
  - Experience Points (⭐️)
  - Gold (💰)
- Dynamic event system with various encounters:
  - Monster battles (🐰 🦊 🐺)
  - Shop visits (🏪)
  - Inn rests (🏨)
  - Food findings (🍎 🍖)
- Responsive design optimized for mobile play
- Portrait orientation with touch-friendly controls
- Turn-based gameplay mechanics

## How to Play

1. Open `index.html` in a modern web browser
2. Use any of the following controls to move your character (😊):
   - Arrow keys or WASD on keyboard
   - Click the directional buttons on screen
   - Swipe on touch devices
3. Navigate the forest environment (🌲 🌳) to:
   - Battle monsters for experience
   - Collect gold and items
   - Find food to restore health
   - Visit shops and inns
4. Manage your resources and survive encounters

## Project Structure

```
simplerpg/
├── index.html          # Main game page
├── styles/
│   └── main.css       # Game styling and responsive layout
├── js/
│   ├── main.js        # Game initialization and core logic
│   ├── gameState.js   # Game state and turn management
│   └── eventSystem.js # Event handling and random encounters
```

## Technical Details

- Built with vanilla JavaScript using ES6 modules
- No external dependencies required
- Event-driven architecture with custom event system
- Responsive CSS grid layout with mobile-first design
- Touch-optimized controls with large hit areas
- Portrait orientation optimized for mobile play

## Visual Design

- Cheerful color scheme:
  - Primary: Forest green (#4CAF50)
  - Secondary: Wood brown (#8D6E63)
  - Accent: Playful yellow (#FFE082)
  - Background: Soft cream (#FFF8E1)
  - Text: Dark forest (#2E342D)
- Emoji-based graphics for universal appeal
- Clear visual feedback and state representation
- High contrast for readability
- Delightful animations and transitions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
