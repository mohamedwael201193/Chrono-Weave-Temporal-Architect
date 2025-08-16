import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Trophy, Medal, Award, Clock, Zap, Target, Users } from 'lucide-react'

const Leaderboard = ({ currentScore, currentEfficiency, currentLoop, playerAddress }) => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [playerRank, setPlayerRank] = useState(null)
  const [loading, setLoading] = useState(false)

  // Mock leaderboard data - in real implementation, this would come from Monad Games ID
  const mockLeaderboardData = [
    {
      rank: 1,
      username: "TemporalMaster",
      address: "0x1234...5678",
      score: 15420,
      efficiency: 94,
      loops: 12,
      timestamp: Date.now() - 3600000
    },
    {
      rank: 2,
      username: "QuantumArchitect",
      address: "0x2345...6789",
      score: 14850,
      efficiency: 91,
      loops: 11,
      timestamp: Date.now() - 7200000
    },
    {
      rank: 3,
      username: "ChronoEngineer",
      address: "0x3456...7890",
      score: 13920,
      efficiency: 88,
      loops: 10,
      timestamp: Date.now() - 10800000
    },
    {
      rank: 4,
      username: "VoidWeaver",
      address: "0x4567...8901",
      score: 12750,
      efficiency: 85,
      loops: 9,
      timestamp: Date.now() - 14400000
    },
    {
      rank: 5,
      username: "EnergyConduit",
      address: "0x5678...9012",
      score: 11680,
      efficiency: 82,
      loops: 8,
      timestamp: Date.now() - 18000000
    }
  ]

  useEffect(() => {
    // Simulate loading leaderboard data
    setLoading(true)
    setTimeout(() => {
      setLeaderboardData(mockLeaderboardData)
      setLoading(false)
      
      // Calculate player rank based on current score
      if (currentScore > 0) {
        const rank = mockLeaderboardData.filter(entry => entry.score > currentScore).length + 1
        setPlayerRank(rank)
      }
    }, 1000)
  }, [currentScore])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{rank}</div>
    }
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours === 1) return "1 hour ago"
    return `${hours} hours ago`
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Current Player Stats */}
      {currentScore > 0 && (
        <Card className="temporal-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold temporal-text">{currentScore}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentEfficiency}%</div>
                <div className="text-sm text-muted-foreground">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{currentLoop}</div>
                <div className="text-sm text-muted-foreground">Loops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">#{playerRank || "—"}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>
            Top temporal architects across all dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-muted animate-pulse">
                  <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/4" />
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-4 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-muted/50 ${
                    entry.address === playerAddress ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{entry.username}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatAddress(entry.address)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTimeAgo(entry.timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold temporal-text">{entry.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">{entry.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Eff</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-accent">{entry.loops}</div>
                      <div className="text-xs text-muted-foreground">Loops</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">24h</div>
            <div className="text-sm text-muted-foreground">Reset Period</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Active Players</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-chart-3" />
            <div className="text-2xl font-bold">∞</div>
            <div className="text-sm text-muted-foreground">Possibilities</div>
          </CardContent>
        </Card>
      </div>

      {/* Monad Integration Info */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Powered by Monad Games ID</CardTitle>
          <CardDescription>
            Secure, transparent, and verifiable leaderboards on the Monad Testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Blockchain Integration</div>
              <div className="text-xs text-muted-foreground">
                All scores are recorded on-chain for complete transparency
              </div>
            </div>
            <Badge variant="secondary" className="temporal-glow">
              Testnet MON Rewards
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Leaderboard

