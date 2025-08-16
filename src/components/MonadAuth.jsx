import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Wallet, User, Shield, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

const MonadAuth = ({ onAuthSuccess, onAuthError }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  // Check if already connected on component mount
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      // Check if user is already connected to Monad Games ID
      // This would integrate with Privy Global wallet
      const savedConnection = localStorage.getItem('monad_games_id_connection')
      if (savedConnection) {
        const connectionData = JSON.parse(savedConnection)
        setUserInfo(connectionData)
        setIsConnected(true)
        if (onAuthSuccess) {
          onAuthSuccess(connectionData)
        }
      }
    } catch (err) {
      console.error('Error checking existing connection:', err)
    }
  }

  const connectToMonadGamesID = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Simulate Monad Games ID connection process
      // In real implementation, this would integrate with Privy Global wallet
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful connection
      const mockUserInfo = {
        username: `Player${Math.floor(Math.random() * 10000)}`,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        gameId: `monad_${Math.random().toString(36).substr(2, 9)}`,
        connectedAt: Date.now(),
        network: 'Monad Testnet'
      }

      setUserInfo(mockUserInfo)
      setIsConnected(true)
      
      // Save connection to localStorage
      localStorage.setItem('monad_games_id_connection', JSON.stringify(mockUserInfo))

      if (onAuthSuccess) {
        onAuthSuccess(mockUserInfo)
      }
    } catch (err) {
      setError('Failed to connect to Monad Games ID. Please try again.')
      if (onAuthError) {
        onAuthError(err)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setUserInfo(null)
    localStorage.removeItem('monad_games_id_connection')
  }

  const registerGame = async () => {
    try {
      // Simulate game registration with Monad Games ID
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation, this would call the Monad Games ID smart contract
      console.log('Game registered with Monad Games ID')
      
      return {
        gameId: 'chrono-weave-temporal-architect',
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        registered: true
      }
    } catch (err) {
      console.error('Game registration failed:', err)
      throw err
    }
  }

  const submitScore = async (score, efficiency, loops) => {
    if (!isConnected || !userInfo) {
      throw new Error('Not connected to Monad Games ID')
    }

    try {
      // Simulate score submission to blockchain
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const scoreData = {
        player: userInfo.address,
        score,
        efficiency,
        loops,
        timestamp: Date.now(),
        gameId: 'chrono-weave-temporal-architect'
      }

      // In real implementation, this would submit to Monad smart contract
      console.log('Score submitted to Monad Games ID:', scoreData)
      
      return {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000),
        success: true
      }
    } catch (err) {
      console.error('Score submission failed:', err)
      throw err
    }
  }

  if (isConnected && userInfo) {
    return (
      <Card className="temporal-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Connected to Monad Games ID
          </CardTitle>
          <CardDescription>
            Your temporal architect identity is secured on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold">{userInfo.username}</div>
                <div className="text-sm text-muted-foreground">
                  {userInfo.address.slice(0, 6)}...{userInfo.address.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                {userInfo.network}
              </Badge>
              <div className="text-xs text-muted-foreground">
                Connected {new Date(userInfo.connectedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://monad.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Monad Network
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect to Monad Games ID
        </CardTitle>
        <CardDescription>
          Sign in with your Monad Games ID to compete on the global leaderboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <div className="font-medium">Secure Authentication</div>
              <div className="text-muted-foreground">Powered by Privy Global wallet</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="text-sm">
              <div className="font-medium">Verifiable Scores</div>
              <div className="text-muted-foreground">All achievements recorded on-chain</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="h-5 w-5 text-accent" />
            <div className="text-sm">
              <div className="font-medium">Cross-Game Identity</div>
              <div className="text-muted-foreground">One username across all Monad games</div>
            </div>
          </div>
        </div>

        <Button 
          onClick={connectToMonadGamesID} 
          disabled={isConnecting}
          className="w-full temporal-glow"
          size="lg"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Sign in with Monad Games ID
            </>
          )}
        </Button>

        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <a href="https://monad-foundation.notion.site/How-to-integrate-Monad-Games-ID-24e6367594f2802b8dd1ef3fbf3d136a" target="_blank" rel="noopener noreferrer">
              Learn more about Monad Games ID
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export the score submission function for use in other components
export { MonadAuth as default }
export const useMonadGamesID = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const savedConnection = localStorage.getItem('monad_games_id_connection')
    if (savedConnection) {
      const connectionData = JSON.parse(savedConnection)
      setUserInfo(connectionData)
      setIsConnected(true)
    }
  }, [])

  const submitScore = async (score, efficiency, loops) => {
    if (!isConnected || !userInfo) {
      throw new Error('Not connected to Monad Games ID')
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const scoreData = {
        player: userInfo.address,
        score,
        efficiency,
        loops,
        timestamp: Date.now(),
        gameId: 'chrono-weave-temporal-architect'
      }

      console.log('Score submitted to Monad Games ID:', scoreData)
      
      return {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000),
        success: true
      }
    } catch (err) {
      console.error('Score submission failed:', err)
      throw err
    }
  }

  return {
    isConnected,
    userInfo,
    submitScore
  }
}

