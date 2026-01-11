# FLAPPY BIRD REMAKE

A fully functional Flappy Bird clone built with HTML5 Canvas and JavaScript. Designed to easily integrate your custom artwork!

## 🎮 Play Online

**[Play the game now!](https://comeupdream.github.io/flappy/)**

## Features

- Classic Flappy Bird gameplay with optimized physics
- Smooth controls with gentle gravity and responsive flapping
- Score tracking with persistent local high score
- Accurate collision detection with separate hitbox
- Custom art support - use your own graphics (PNG, JPG, SVG)!
- Colorful red, blue, and yellow pipe graphics
- Beautiful cartoon background scenery
- Works in any modern web browser

## How to Play

1. Open `index.html` in your web browser
2. Click or press SPACE to start and flap
3. Navigate through the pipes without hitting them
4. Try to beat your high score!

## Controls

- **Click** or **Spacebar**: Flap / Start / Restart

## Adding Your Custom Art

This game is designed to work with YOUR custom artwork!

Simply add your images to the `assets/images/` folder:
- `bird.png` - Your character sprite (34x34px recommended)
- `pipe-top.png` - Top obstacle graphic
- `pipe-bottom.png` - Bottom obstacle graphic
- `background.png` - Background scenery (400x600px)

For detailed instructions, see [CUSTOM_ART_GUIDE.md](CUSTOM_ART_GUIDE.md)

The game works immediately with default graphics and will automatically use your custom art when you add it!

## Project Structure

```
flappy-bird-remake/
├── index.html          # Main game page
├── style.css           # Game styling
├── game.js             # Game logic and engine
├── assets/
│   ├── images/         # Place your custom images here
│   └── sounds/         # For future audio files
├── README.md
└── CUSTOM_ART_GUIDE.md # Detailed art customization guide
```

## Technologies Used

- HTML5 Canvas
- Vanilla JavaScript
- CSS3

## License

Free to use and modify. Have fun!
