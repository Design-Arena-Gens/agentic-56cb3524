# Conway's Game of Life

An interactive web implementation of Conway's Game of Life built with Next.js and React.

## Features

- Interactive grid where you can click to toggle cells
- Play/Pause controls for continuous evolution
- Step-by-step evolution
- Clear and randomize grid
- Predefined patterns (Glider, Pulsar)
- Adjustable simulation speed
- Real-time generation and population counters
- Responsive design

## Game Rules

1. Any live cell with 2 or 3 live neighbors survives
2. Any dead cell with exactly 3 live neighbors becomes alive
3. All other live cells die, and all other dead cells stay dead

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The app is configured for static export and can be deployed to Vercel:

```bash
vercel deploy --prod
```

## Controls

- **Play/Pause**: Start or stop the simulation
- **Step**: Advance one generation manually
- **Clear**: Reset the grid to empty
- **Random**: Fill the grid with random cells
- **Glider**: Load a glider pattern
- **Pulsar**: Load a pulsar pattern
- **Speed**: Adjust simulation speed (50ms to 500ms per generation)