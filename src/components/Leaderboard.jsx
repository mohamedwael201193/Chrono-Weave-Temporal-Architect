import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Zap, 
  Clock, 
  Target, 
  Users, 
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useMonadGamesID } from '../hooks/useMonadGamesID.js'

const Leaderboard = ({ currentScore, currentEfficiency, currentLoop, playerAddress }) => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [playerRank, setPlayerRank] = useState(null)

  const { getLeaderboard, authenticated, isConnected, isRegistered } = useMonadGamesID()

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getLeaderboard(100)
      setLeaderboardData(data || [])
      
      // Find player rank if connected
      if (playerAddress && data) {
        const rank = data.findIndex(entry => 
          entry.playerAddress?.toLowerCase() === playerAddress.toLowerCase()
        )
        setPlayerRank(rank >= 0 ? rank + 1 : null)
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
      setError('Failed to load leaderboard data')
      
      // Use mock data as fallback
      setLeaderboardData(generateMockLeaderboard())
    } finally {
      setLoading(false)
    }
  }

  // Generate mock leaderboard data for fallback
  const generateMockLeaderboard = () => {
    const mockPlayers = [
      'TemporalMaster', 'QuantumArchitect', 'ChronoWeaver', 'EnergyOptimizer', 'TimeLooper',
      'VoidWalker', 'FluxCapacitor', 'TemporalEcho', 'QuantumLeap', 'ChronoSynth',
      'EnergyVortex', 'TimeBender', 'QuantumGrid', 'TemporalFlow', 'ChronoLink'
    ]

    return mockPlayers.map((name, index) => ({
      rank: index + 1,
      username: name,
      playerAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      score: Math.floor(Math.random() * 5000) + 1000 - (index * 100),
      efficiency: Math.floor(Math.random() * 50) + 50 - (index * 2),
      loops: Math.floor(Math.random() * 20) + 5,
      timestamp: Date.now() - (Math.random() * 86400000), // Random time in last 24h
      gameMode: 'temporal-architect'
    })).sort((a, b) => b.score - a.score)
  }

  // Refresh leaderboard
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchLeaderboard()
    setRefreshing(false)
  }

  // Initial load
  useEffect(() => {
    fetchLeaderboard()
  }, [])

  // Auto-refresh every 30 seconds if connected
  useEffect(() => {
    if (authenticated && isConnected) {
      const interval = setInterval(fetchLeaderboard, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated, isConnected])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Trophy className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankBadgeVariant = (rank) => {
    switch (rank) {
      case 1:
        return "default"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  const formatAddress = (address) => {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else {
      return 'Recently'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading leaderboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Leaderboard Header */}
      <Card className="temporal-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>
                Top temporal architects competing across the Monad network
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Player Stats */}
      {playerAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold temporal-text">{currentScore}</div>
                <div className="text-sm text-muted-foreground">Current Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold temporal-text">{currentEfficiency.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold temporal-text">{currentLoop}</div>
                <div className="text-sm text-muted-foreground">Current Loop</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold temporal-text">
                  {playerRank ? `#${playerRank}` : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      {!authenticated || !isConnected || !isRegistered ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect to Monad Games ID to see real-time leaderboard data and submit your scores.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Players
          </CardTitle>
          <CardDescription>
            {authenticated && isConnected ? 'Live data from Monad Testnet' : 'Demo leaderboard data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.slice(0, 20).map((entry, index) => {
              const isCurrentPlayer = playerAddress && 
                entry.playerAddress?.toLowerCase() === playerAddress.toLowerCase()
              
              return (
                <div
                  key={entry.playerAddress || index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrentPlayer 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank || index + 1)}
                      <Badge variant={getRankBadgeVariant(entry.rank || index + 1)}>
                        #{entry.rank || index + 1}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="font-semibold">
                        {entry.username || `Player${entry.playerAddress?.slice(-4) || Math.random().toString(36).substr(2, 4)}`}
                        {isCurrentPlayer && (
                          <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatAddress(entry.playerAddress)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold">{entry.score}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{entry.efficiency?.toFixed(1) || '0.0'}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{entry.loops || 1}</div>
                        <div className="text-xs text-muted-foreground">Loops</div>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {leaderboardData.length === 0 && !loading && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leaderboard data available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to submit a score!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Highest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold temporal-text">
              {leaderboardData[0]?.score || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              by {leaderboardData[0]?.username || 'Unknown'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Best Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold temporal-text">
              {Math.max(...leaderboardData.map(e => e.efficiency || 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Maximum recorded
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold temporal-text">
              {leaderboardData.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Temporal architects
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Leaderboard

