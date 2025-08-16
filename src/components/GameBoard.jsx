import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Clock, Zap, RotateCcw, Play, Pause, Trophy, Target } from 'lucide-react'

const GRID_SIZE = 8
const ENERGY_TYPES = {
  TEMPORAL: 'temporal',
  QUANTUM: 'quantum',
  VOID: 'void'
}

const CONDUIT_TYPES = {
  BASIC: { cost: 1, efficiency: 1, range: 1 },
  QUANTUM: { cost: 3, efficiency: 2, range: 2 },
  TEMPORAL: { cost: 5, efficiency: 3, range: 3 }
}

const GameBoard = ({ onScoreUpdate, playerAddress }) => {
  const [grid, setGrid] = useState([])
  const [score, setScore] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [timeLoop, setTimeLoop] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedConduit, setSelectedConduit] = useState('BASIC')
  const [gameHistory, setGameHistory] = useState([])
  const [temporalEchoes, setTemporalEchoes] = useState([])
  const [efficiency, setEfficiency] = useState(0)

  // Initialize grid
  useEffect(() => {
    initializeGrid()
  }, [])

  // Game loop
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateEnergyFlow()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, grid])

  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        type: null,
        energy: 0,
        connections: [],
        temporalResidue: 0,
        isSource: false,
        isTarget: false
      }))
    )

    // Add energy sources and targets
    newGrid[0][0] = { ...newGrid[0][0], isSource: true, energy: 100, type: ENERGY_TYPES.TEMPORAL }
    newGrid[GRID_SIZE-1][GRID_SIZE-1] = { ...newGrid[GRID_SIZE-1][GRID_SIZE-1], isTarget: true }
    newGrid[0][GRID_SIZE-1] = { ...newGrid[0][GRID_SIZE-1], isSource: true, energy: 100, type: ENERGY_TYPES.QUANTUM }
    newGrid[GRID_SIZE-1][0] = { ...newGrid[GRID_SIZE-1][0], isTarget: true }

    setGrid(newGrid)
  }

  const placeConduit = (row, col) => {
    if (grid[row][col].isSource || grid[row][col].isTarget || grid[row][col].type) return
    if (energy < CONDUIT_TYPES[selectedConduit].cost) return

    const newGrid = [...grid]
    newGrid[row][col] = {
      ...newGrid[row][col],
      type: selectedConduit,
      efficiency: CONDUIT_TYPES[selectedConduit].efficiency,
      range: CONDUIT_TYPES[selectedConduit].range
    }

    setGrid(newGrid)
    setEnergy(prev => prev - CONDUIT_TYPES[selectedConduit].cost)
    
    // Add to game history for temporal echoes
    setGameHistory(prev => [...prev, { row, col, type: selectedConduit, timeLoop }])
  }

  const updateEnergyFlow = () => {
    setGrid(prevGrid => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid))
      let totalEfficiency = 0
      let energyTransferred = 0

      // Calculate energy flow through conduits
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const cell = newGrid[row][col]
          if (cell.type && !cell.isSource && !cell.isTarget) {
            // Calculate energy from adjacent sources/conduits
            let incomingEnergy = 0
            const neighbors = getNeighbors(row, col, cell.range || 1)
            
            neighbors.forEach(([nRow, nCol]) => {
              const neighbor = newGrid[nRow][nCol]
              if (neighbor.energy > 0) {
                const transfer = Math.min(neighbor.energy * 0.1, cell.efficiency * 10)
                incomingEnergy += transfer
              }
            })

            cell.energy = Math.min(cell.energy + incomingEnergy, 100)
            
            // Add temporal residue
            cell.temporalResidue += incomingEnergy * 0.05
            
            if (cell.energy > 0) {
              totalEfficiency += cell.efficiency
              energyTransferred += cell.energy
            }
          }
        }
      }

      // Check if energy reaches targets
      let targetsReached = 0
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (newGrid[row][col].isTarget) {
            const neighbors = getNeighbors(row, col, 1)
            let targetEnergy = 0
            
            neighbors.forEach(([nRow, nCol]) => {
              const neighbor = newGrid[nRow][nCol]
              if (neighbor.energy > 0) {
                targetEnergy += neighbor.energy * 0.2
              }
            })
            
            if (targetEnergy > 10) {
              targetsReached++
            }
          }
        }
      }

      // Update score and efficiency
      const newScore = Math.floor(totalEfficiency * targetsReached * (timeLoop * 0.1 + 1))
      setScore(prev => prev + newScore)
      setEfficiency(Math.floor((energyTransferred / Math.max(1, totalEfficiency)) * 100))

      return newGrid
    })
  }

  const getNeighbors = (row, col, range) => {
    const neighbors = []
    for (let r = Math.max(0, row - range); r <= Math.min(GRID_SIZE - 1, row + range); r++) {
      for (let c = Math.max(0, col - range); c <= Math.min(GRID_SIZE - 1, col + range); c++) {
        if (r !== row || c !== col) {
          neighbors.push([r, c])
        }
      }
    }
    return neighbors
  }

  const startTimeLoop = () => {
    setIsPlaying(true)
    
    // Create temporal echoes from previous loops
    if (gameHistory.length > 0) {
      const echoes = gameHistory.filter(action => action.timeLoop < timeLoop)
      setTemporalEchoes(echoes)
    }
  }

  const resetTimeLoop = () => {
    setIsPlaying(false)
    setTimeLoop(prev => prev + 1)
    setEnergy(100)
    
    // Preserve temporal residue but reset energy
    setGrid(prevGrid => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid))
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (!newGrid[row][col].isSource) {
            newGrid[row][col].energy = 0
          }
        }
      }
      return newGrid
    })

    // Update score callback for leaderboard
    if (onScoreUpdate) {
      onScoreUpdate(score, efficiency, timeLoop)
    }
  }

  const getCellClass = (cell, row, col) => {
    let baseClass = "w-12 h-12 border border-border rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 "
    
    if (cell.isSource) {
      baseClass += "bg-primary temporal-glow "
    } else if (cell.isTarget) {
      baseClass += "bg-accent temporal-glow "
    } else if (cell.type) {
      baseClass += "bg-secondary hover:bg-secondary/80 "
      if (cell.energy > 0) {
        baseClass += "energy-pulse "
      }
    } else {
      baseClass += "bg-muted hover:bg-muted/80 "
    }

    if (cell.temporalResidue > 0) {
      baseClass += "ring-2 ring-chart-3 "
    }

    return baseClass
  }

  const getCellContent = (cell) => {
    if (cell.isSource) return <Zap className="h-6 w-6" />
    if (cell.isTarget) return <Target className="h-6 w-6" />
    if (cell.type === 'BASIC') return <div className="w-2 h-2 bg-foreground rounded-full" />
    if (cell.type === 'QUANTUM') return <div className="w-3 h-3 bg-primary rounded-full temporal-glow" />
    if (cell.type === 'TEMPORAL') return <Clock className="h-4 w-4" />
    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold temporal-text">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{energy}</div>
            <div className="text-sm text-muted-foreground">Energy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{timeLoop}</div>
            <div className="text-sm text-muted-foreground">Time Loop</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">{efficiency}%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">{temporalEchoes.length}</div>
            <div className="text-sm text-muted-foreground">Echoes</div>
          </CardContent>
        </Card>
      </div>

      {/* Conduit Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Conduit Selection</CardTitle>
          <CardDescription>Choose your temporal engineering tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.entries(CONDUIT_TYPES).map(([type, props]) => (
              <Button
                key={type}
                variant={selectedConduit === type ? "default" : "outline"}
                onClick={() => setSelectedConduit(type)}
                className="flex-1"
              >
                <div className="text-center">
                  <div className="font-semibold">{type}</div>
                  <div className="text-xs">Cost: {props.cost} | Eff: {props.efficiency}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Temporal Grid</span>
            <div className="flex gap-2">
              <Button
                onClick={isPlaying ? () => setIsPlaying(false) : startTimeLoop}
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimeLoop} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                Reset Loop
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1 p-4 bg-background rounded-lg quantum-grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(cell, rowIndex, colIndex)}
                  onClick={() => placeConduit(rowIndex, colIndex)}
                  title={`Energy: ${cell.energy.toFixed(1)} | Residue: ${cell.temporalResidue.toFixed(1)}`}
                >
                  {getCellContent(cell)}
                  {cell.energy > 0 && !cell.isSource && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full energy-pulse" />
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Temporal Echoes */}
      {temporalEchoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Temporal Echoes</CardTitle>
            <CardDescription>Actions from previous time loops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {temporalEchoes.map((echo, index) => (
                <Badge key={index} variant="secondary" className="temporal-glow">
                  {echo.type} at ({echo.row},{echo.col}) - Loop {echo.timeLoop}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GameBoard

