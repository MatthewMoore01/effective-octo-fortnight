# Crowd Runner

Crowd Runner is an HTML5 arcade-style game built with Phaser 3. Navigate through arithmetic gates to keep your crowd alive and overcome waves of obstacles.

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Game Mechanics](#game-mechanics)
- [Controls](#controls)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- Procedurally generated levels with increasing difficulty
- Five levels with arithmetic operations (+, -, *, /)
- Unlockable levels stored in localStorage
- Simple and intuitive keyboard controls
- Designed for quick and casual gameplay

## Demo
*(Add a link to a live demo or include a screenshot here)*

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MatthewMoore01/effective-octo-fortnight.git
   cd effective-octo-fortnight
   ```
2. Start a local HTTP server (required for ES modules):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   ```
3. Open your browser to http://localhost:8000

## Usage
- From the main menu, click on any unlocked level to start.
- Navigate through gates to modify your crowd’s size.
- Survive waves of red squares; your count must meet or exceed the wave size.
- Unlock the next level upon completion.

## Game Mechanics
The game revolves around two core mechanics:
1. Gates: Choose left or right path to apply an arithmetic operation to your crowd count.
2. Waves: Groups of enemies that reduce your crowd count if you have sufficient numbers; otherwise, it's game over.

Levels 1–5 introduce operations in increasing complexity: `+`, `-`, `*`, `/`.

## Controls
- Left Arrow / A: Move left
- Right Arrow / D: Move right
- Click on level buttons in the main menu

## Project Structure
```
├── index.html           # Main HTML file
├── style.css            # Stylesheet
├── src/                 # JavaScript source files
│   ├── BootScene.js     # Asset generation and preload
│   ├── MainMenuScene.js # Main menu UI
│   ├── GameScene.js     # Core game logic
│   └── main.js          # Game configuration
├── game_logs_*.json     # Sample game logs (for debugging)
└── server.log           # Server log (for reference)
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request. Ensure your code follows the existing style and passes basic manual testing.

## License
This project is licensed under the MIT License.
