import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Clock, 
  Zap, 
  Target, 
  RotateCcw, 
  Play, 
  Pause, 
  Trophy, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react'
import { useMonadGamesID } from '../hooks/useMonadGamesID.js'

const GRID_SIZE = 8
const CONDUIT_TYPES = {
  BASIC: { cost: 10, efficiency: 1.0, color: 'bg-blue-500', name: 'Basic' },
  QUANTUM: { cost: 25, efficiency: 1.5, color: 'bg-purple-500', name: 'Quantum' },
  TEMPORAL: { cost: 50, efficiency: 2.0, color: 'bg-amber-500', name: 'Temporal' }
}

const GameBoard = ({ onScoreUpdate, playerAddress }) => {
  const [grid, setGrid] = useState([])
  const [energySources, setEnergySources] = useState([])
  const [energyTargets, setEnergyTargets] = useState([])
  const [selectedConduit, setSelectedConduit] = useState('BASIC')
  const [currentEnergy, setCurrentEnergy] = useState(100)
  const [score, setScore] = useState(0)
  const [efficiency, setEfficiency] = useState(0)
  const [currentLoop, setCurrentLoop] = useState(1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [gameState, setGameState] = useState('setup') // setup, playing, completed
  const [temporalEchoes, setTemporalEchoes] = useState([])
  const [submittingScore, setSubmittingScore] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)

  const { authenticated, isConnected, isRegistered, submitScore } = useMonadGamesID()

  // Initialize game grid
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = useCallback(() => {
    // Create empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        type: null,
        energy: 0,
        connections: [],
        temporalResidue: 0
      }))
    )

    // Place energy sources (left side)
    const sources = []
    for (let i = 1; i < GRID_SIZE - 1; i += 2) {
      sources.push({ x: 0, y: i, energy: 100 })
      newGrid[i][0] = {
        type: 'source',
        energy: 100,
        connections: [],
        temporalResidue: 0
      }
    }

    // Place energy targets (right side)
    const targets = []
    for (let i = 1; i < GRID_SIZE - 1; i += 2) {
      targets.push({ x: GRID_SIZE - 1, y: i, requiredEnergy: 80 })
      newGrid[i][GRID_SIZE - 1] = {
        type: 'target',
        energy: 0,
        requiredEnergy: 80,
        connections: [],
        temporalResidue: 0
      }
    }

    setGrid(newGrid)
    setEnergySources(sources)
    setEnergyTargets(targets)
    setCurrentEnergy(100)
    setScore(0)
    setEfficiency(0)
    setCurrentLoop(1)
    setGameState('setup')
    setTemporalEchoes([])
    setScoreSubmitted(false)
  }, [])

  const placeConduit = useCallback((row, col) => {
    if (gameState !== 'setup' || isSimulating) return
    
    const cell = grid[row][col]
    if (cell.type === 'source' || cell.type === 'target') return

    const conduitType = CONDUIT_TYPES[selectedConduit]
    if (currentEnergy < conduitType.cost) return

    const newGrid = [...grid]
    
    // Remove existing conduit if present
    if (cell.type) {
      const existingType = Object.values(CONDUIT_TYPES).find(t => t.name.toLowerCase() === cell.type)
      if (existingType) {
        setCurrentEnergy(prev => prev + existingType.cost)
      }
    }

    // Place new conduit
    newGrid[row][col] = {
      type: selectedConduit.toLowerCase(),
      energy: 0,
      connections: [],
      temporalResidue: cell.temporalResidue,
      efficiency: conduitType.efficiency
    }

    setGrid(newGrid)
    setCurrentEnergy(prev => prev - conduitType.cost)
  }, [grid, selectedConduit, currentEnergy, gameState, isSimulating])

  const simulateEnergyFlow = useCallback(async () => {
    if (gameState !== 'setup') return

    setIsSimulating(true)
    setGameState('playing')

    // Simulate energy flow through the network
    let totalEnergyDelivered = 0
    let totalEnergyUsed = 0
    let simulationSteps = 0

    const newGrid = [...grid]

    // Calculate energy paths and efficiency
    for (const source of energySources) {
      const path = findEnergyPath(newGrid, source.x, source.y)
      if (path.length > 0) {
        let energyRemaining = source.energy
        
        for (let i = 0; i < path.length - 1; i++) {
          const current = path[i]
          const cell = newGrid[current.y][current.x]
          
          if (cell.type && cell.efficiency) {
            energyRemaining *= cell.efficiency
            totalEnergyUsed += CONDUIT_TYPES[cell.type.toUpperCase()]?.cost || 0
          }
          
          simulationSteps++
        }
        
        totalEnergyDelivered += energyRemaining
      }
    }

    // Calculate score and efficiency
    const newScore = Math.floor(totalEnergyDelivered * 10)
    const newEfficiency = totalEnergyUsed > 0 ? (totalEnergyDelivered / totalEnergyUsed) * 100 : 0

    setScore(newScore)
    setEfficiency(newEfficiency)

    // Add temporal echo for next loop
    setTemporalEchoes(prev => [...prev, {
      loop: currentLoop,
      score: newScore,
      efficiency: newEfficiency,
      grid: JSON.parse(JSON.stringify(newGrid))
    }])

    // Update temporal residue
    newGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type && cell.type !== 'source' && cell.type !== 'target') {
          cell.temporalResidue += 0.1
        }
      })
    })

    setGrid(newGrid)

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSimulating(false)
    setGameState('completed')

    // Notify parent component
    if (onScoreUpdate) {
      onScoreUpdate(newScore, newEfficiency, currentLoop)
    }
  }, [grid, energySources, gameState, currentLoop, onScoreUpdate])

  const findEnergyPath = (grid, startX, startY) => {
    // Simple pathfinding algorithm (BFS)
    const queue = [{ x: startX, y: startY, path: [{ x: startX, y: startY }] }]
    const visited = new Set()

    while (queue.length > 0) {
      const { x, y, path } = queue.shift()
      const key = `${x},${y}`

      if (visited.has(key)) continue
      visited.add(key)

      // Check if we reached a target
      if (grid[y] && grid[y][x] && grid[y][x].type === 'target') {
        return path
      }

      // Explore neighbors
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dx, dy] of directions) {
        const newX = x + dx
        const newY = y + dy

        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          const cell = grid[newY][newX]
          if (cell && (cell.type === 'target' || (cell.type && cell.type !== 'source'))) {
            queue.push({
              x: newX,
              y: newY,
              path: [...path, { x: newX, y: newY }]
            })
          }
        }
      }
    }

    return []
  }

  const nextLoop = useCallback(() => {
    setCurrentLoop(prev => prev + 1)
    setCurrentEnergy(100)
    setGameState('setup')
    setScoreSubmitted(false)
  }, [])

  const resetGame = useCallback(() => {
    initializeGame()
  }, [initializeGame])

  const handleSubmitScore = useCallback(async () => {
    if (!authenticated || !isConnected || !isRegistered || scoreSubmitted) return

    try {
      setSubmittingScore(true)
      
      const result = await submitScore(score, {
        efficiency,
        loops: currentLoop,
        gameMode: 'temporal-architect',
        timestamp: Date.now(),
        playerAddress,
      })

      console.log('Score submitted successfully:', result)
      setScoreSubmitted(true)
    } catch (error) {
      console.error('Failed to submit score:', error)
    } finally {
      setSubmittingScore(false)
    }
  }, [authenticated, isConnected, isRegistered, score, efficiency, currentLoop, playerAddress, submitScore, scoreSubmitted])

  const getCellDisplay = (cell, row, col) => {
    if (cell.type === 'source') {
      return (
        <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
      )
    }

    if (cell.type === 'target') {
      return (
        <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center">
          <Target className="h-4 w-4 text-white" />
        </div>
      )
    }

    if (cell.type) {
      const conduitType = CONDUIT_TYPES[cell.type.toUpperCase()]
      return (
        <div className={`w-full h-full ${conduitType.color} rounded-lg flex items-center justify-center relative`}>
          <div className="w-2 h-2 bg-white rounded-full" />
          {cell.temporalResidue > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          )}
        </div>
      )
    }

    return (
      <div className="w-full h-full bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-gray-400 transition-colors" />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-6">
      {/* Game Header */}
      <Card className="temporal-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Temporal Loop {currentLoop}
              </CardTitle>
              <CardDescription>
                Build energy conduits to connect sources to targets
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                Energy: {currentEnergy}
              </Badge>
              <Badge variant="outline">
                Score: {score}
              </Badge>
              <Badge variant="outline">
                Efficiency: {efficiency.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Game Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Conduit Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Conduit Types</CardTitle>
            <CardDescription>Select a conduit type to place on the grid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(CONDUIT_TYPES).map(([key, conduit]) => (
              <Button
                key={key}
                variant={selectedConduit === key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedConduit(key)}
                disabled={currentEnergy < conduit.cost || gameState !== 'setup'}
              >
                <div className={`w-4 h-4 ${conduit.color} rounded mr-3`} />
                {conduit.name} - Cost: {conduit.cost} - Efficiency: {conduit.efficiency}x
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Game Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Control the temporal simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gameState === 'setup' && (
              <Button 
                onClick={simulateEnergyFlow}
                disabled={isSimulating}
                className="w-full temporal-glow"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </Button>
            )}

            {gameState === 'completed' && (
              <div className="space-y-3">
                <Button onClick={nextLoop} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Next Loop
                </Button>
                
                {authenticated && isConnected && isRegistered && !scoreSubmitted && (
                  <Button 
                    onClick={handleSubmitScore}
                    disabled={submittingScore}
                    className="w-full temporal-glow"
                    variant="secondary"
                  >
                    {submittingScore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4 mr-2" />
                        Submit to Leaderboard
                      </>
                    )}
                  </Button>
                )}

                {scoreSubmitted && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Score submitted successfully to Monad Games ID!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <Button onClick={resetGame} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Game
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Game Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Temporal Grid</CardTitle>
          <CardDescription>
            Click on empty cells to place conduits. Connect energy sources (green) to targets (red).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2 p-4 bg-gray-900 rounded-lg">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square cursor-pointer"
                  onClick={() => placeConduit(rowIndex, colIndex)}
                >
                  {getCellDisplay(cell, rowIndex, colIndex)}
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Temporal Echoes
            </CardTitle>
            <CardDescription>
              Previous loop results influence future possibilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {temporalEchoes.slice(-3).map((echo, index) => (
                <div key={echo.loop} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Loop {echo.loop}</Badge>
                    <span className="text-sm">Score: {echo.score}</span>
                    <span className="text-sm">Efficiency: {echo.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Temporal residue applied
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      {!authenticated || !isConnected || !isRegistered ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect to Monad Games ID to submit scores to the global leaderboard.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

export default GameBoard

