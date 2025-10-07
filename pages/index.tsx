import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

interface Cell {
  x: number
  y: number
  alive: boolean
}

const GRID_SIZE = 50
const INITIAL_PATTERNS = {
  glider: [
    { x: 1, y: 0 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ],
  pulsar: [
    { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 0, y: 2 }, { x: 5, y: 2 }, { x: 0, y: 3 }, { x: 5, y: 3 }, { x: 0, y: 4 }, { x: 5, y: 4 },
    { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 },
    { x: 2, y: 12 }, { x: 3, y: 12 }, { x: 4, y: 12 },
    { x: 0, y: 9 }, { x: 5, y: 9 }, { x: 0, y: 10 }, { x: 5, y: 10 }, { x: 0, y: 11 }, { x: 5, y: 11 },
    { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 },
    { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 },
    { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 },
    { x: 5, y: 4 }, { x: 10, y: 4 }, { x: 5, y: 5 }, { x: 10, y: 5 }, { x: 5, y: 6 }, { x: 10, y: 6 },
    { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
    { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 },
    { x: 5, y: 11 }, { x: 10, y: 11 }, { x: 5, y: 12 }, { x: 10, y: 12 }, { x: 5, y: 13 }, { x: 10, y: 13 },
    { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }
  ]
}

export default function ConwayGameOfLife() {
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  )
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(100)

  const countNeighbors = useCallback((grid: boolean[][], x: number, y: number): number => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const newX = x + i
        const newY = y + j
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          if (grid[newX][newY]) count++
        }
      }
    }
    return count
  }, [])

  const nextGeneration = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
      
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          const neighbors = countNeighbors(prevGrid, x, y)
          const isAlive = prevGrid[x][y]
          
          if (isAlive) {
            // Live cell with 2 or 3 neighbors survives
            newGrid[x][y] = neighbors === 2 || neighbors === 3
          } else {
            // Dead cell with exactly 3 neighbors becomes alive
            newGrid[x][y] = neighbors === 3
          }
        }
      }
      
      return newGrid
    })
    setGeneration(prev => prev + 1)
  }, [countNeighbors])

  const toggleCell = (x: number, y: number) => {
    if (isRunning) return
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row])
      newGrid[x][y] = !newGrid[x][y]
      return newGrid
    })
  }

  const clearGrid = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)))
    setGeneration(0)
    setIsRunning(false)
  }

  const randomizeGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => Math.random() < 0.3)
    )
    setGrid(newGrid)
    setGeneration(0)
    setIsRunning(false)
  }

  const loadPattern = (pattern: { x: number; y: number }[]) => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
    const centerX = Math.floor(GRID_SIZE / 2)
    const centerY = Math.floor(GRID_SIZE / 2)
    
    pattern.forEach(cell => {
      const x = centerX + cell.x
      const y = centerY + cell.y
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        newGrid[x][y] = true
      }
    })
    
    setGrid(newGrid)
    setGeneration(0)
    setIsRunning(false)
  }

  const toggleRunning = () => {
    setIsRunning(prev => !prev)
  }

  const step = () => {
    if (!isRunning) {
      nextGeneration()
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(nextGeneration, speed)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, nextGeneration, speed])

  const population = grid.flat().filter(cell => cell).length

  return (
    <>
      <Head>
        <title>Conway's Game of Life</title>
        <meta name="description" content="Interactive Conway's Game of Life implementation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container">
        <h1 className="title">Conway's Game of Life</h1>
        
        <div className="controls">
          <button 
            className={`btn ${isRunning ? 'danger' : 'success'}`}
            onClick={toggleRunning}
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>
          
          <button 
            className="btn secondary"
            onClick={step}
            disabled={isRunning}
          >
            Step
          </button>
          
          <button 
            className="btn danger"
            onClick={clearGrid}
            disabled={isRunning}
          >
            Clear
          </button>
          
          <button 
            className="btn secondary"
            onClick={randomizeGrid}
            disabled={isRunning}
          >
            Random
          </button>
          
          <button 
            className="btn"
            onClick={() => loadPattern(INITIAL_PATTERNS.glider)}
            disabled={isRunning}
          >
            Glider
          </button>
          
          <button 
            className="btn"
            onClick={() => loadPattern(INITIAL_PATTERNS.pulsar)}
            disabled={isRunning}
          >
            Pulsar
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="speed" style={{ color: '#666', fontSize: '14px' }}>Speed:</label>
            <input
              id="speed"
              type="range"
              min="50"
              max="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '100px' }}
            />
            <span style={{ color: '#666', fontSize: '12px' }}>{600 - speed}ms</span>
          </div>
        </div>
        
        <div className="game-container">
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
          >
            {grid.map((row, x) =>
              row.map((cell, y) => (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${cell ? 'alive' : ''}`}
                  onClick={() => toggleCell(x, y)}
                />
              ))
            )}
          </div>
        </div>
        
        <div className="stats">
          <div className="generation">Generation: {generation}</div>
          <div className="population">Population: {population}</div>
        </div>
      </div>
    </>
  )
}