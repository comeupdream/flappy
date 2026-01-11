# Custom Art Guide

This Flappy Bird remake is designed to work with your custom artwork! Follow this guide to add your own graphics.

## Asset Directory Structure

```
assets/
├── images/
│   ├── bird.png
│   ├── pipe-top.png
│   ├── pipe-bottom.png
│   └── background.png
└── sounds/
    └── (future audio files)
```

## Image Requirements

### Bird (`assets/images/bird.png`)
- **Recommended size**: 34x34 pixels (or any square size)
- **Format**: PNG with transparency
- **Description**: Your character/bird sprite
- The image will be rotated as it flaps and falls

### Pipe Top (`assets/images/pipe-top.png`)
- **Recommended width**: 60 pixels
- **Height**: Flexible (will be scaled to fit)
- **Format**: PNG with transparency
- **Description**: Top pipe/obstacle graphic
- The image is drawn from bottom to top

### Pipe Bottom (`assets/images/pipe-bottom.png`)
- **Recommended width**: 60 pixels
- **Height**: Flexible (will be scaled to fit)
- **Format**: PNG with transparency
- **Description**: Bottom pipe/obstacle graphic
- The image is drawn from top to bottom

### Background (`assets/images/background.png`)
- **Recommended size**: 400x600 pixels (canvas size)
- **Format**: PNG or JPG
- **Description**: Background scenery
- Will be stretched to fill the entire canvas

## How to Add Your Art

1. Create your custom images using your favorite graphics editor
2. Save them with the exact filenames listed above
3. Place them in the `assets/images/` directory
4. Refresh the game in your browser

## Fallback Graphics

If custom images are not found, the game will automatically use default graphics drawn with canvas. This way, the game works immediately and you can add your art whenever you're ready!

## Tips for Creating Art

- **Keep it simple**: Flappy Bird's charm is in its simplicity
- **Contrast**: Make sure your bird stands out from the background
- **Pipes**: Can be actual pipes, or anything else (trees, buildings, etc.)
- **Theme it**: Make it your own! Space theme, underwater, medieval, anything goes!
- **Transparency**: Use PNG format for bird and pipes to get clean edges

## Customizing Game Settings

Want to adjust the gameplay? Edit these values in `game.js`:

```javascript
const config = {
    gravity: 0.5,          // How fast bird falls
    flapStrength: -9,      // How high bird jumps
    pipeSpeed: 2,          // How fast pipes move
    pipeGap: 150,          // Space between pipes
    pipeSpacing: 220,      // Distance between pipe pairs
    birdSize: 34,          // Size of bird sprite
    pipeWidth: 60          // Width of pipes
};
```

## Need Help?

The game is a single HTML file with embedded CSS and JavaScript. All the code is well-commented and easy to modify. Have fun customizing!
