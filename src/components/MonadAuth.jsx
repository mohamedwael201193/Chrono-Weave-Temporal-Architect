import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Wallet, User, Shield, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useMonadGamesID } from '../hooks/useMonadGamesID.js'

const MonadAuth = ({ onAuthSuccess, onAuthError }) => {
  const {
    ready,
    authenticated,
    isConnected,
    address,
    user,
    isRegistered,
    username,
    gameProfile,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    registerGame,
    checkRegistration,
  } = useMonadGamesID()

  const [registering, setRegistering] = useState(false)

  // Handle successful authentication
  useEffect(() => {
    if (authenticated && isConnected && address && onAuthSuccess) {
      onAuthSuccess({
        address,
        username: username || `Player${address.slice(-4)}`,
        isRegistered,
        gameProfile,
      })
    }
  }, [authenticated, isConnected, address, username, isRegistered, gameProfile, onAuthSuccess])

  // Handle errors
  useEffect(() => {
    if (error && onAuthError) {
      onAuthError(error)
    }
  }, [error, onAuthError])

  const handleConnect = async () => {
    try {
      await connectWallet()
    } catch (err) {
      console.error('Connection failed:', err)
    }
  }

  const handleRegisterGame = async () => {
    try {
      setRegistering(true)
      await registerGame()
      await checkRegistration() // Refresh registration status
    } catch (err) {
      console.error('Game registration failed:', err)
    } finally {
      setRegistering(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
    } catch (err) {
      console.error('Disconnect failed:', err)
    }
  }

  // Loading state
  if (!ready) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Initializing Monad Games ID...</p>
        </CardContent>
      </Card>
    )
  }

  // Connected and registered state
  if (authenticated && isConnected && isRegistered) {
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
                <div className="font-semibold">{username || `Player${address?.slice(-4)}`}</div>
                <div className="text-sm text-muted-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                Monad Testnet
              </Badge>
              <div className="text-xs text-muted-foreground">
                Registered Player
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://monad-games-id-site.vercel.app" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Monad Games ID
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Connected but not registered state
  if (authenticated && isConnected && !isRegistered) {
    return (
      <Card className="border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Complete Registration
          </CardTitle>
          <CardDescription>
            Register with Monad Games ID to compete on the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-black" />
              </div>
              <div>
                <div className="font-semibold">Wallet Connected</div>
                <div className="text-sm text-muted-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
            </div>
            <Badge variant="outline">
              Registration Required
            </Badge>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              To compete on the global leaderboard, you need to register with Monad Games ID.
              This creates your cross-game identity on the Monad network.
            </div>
            
            <Button 
              onClick={handleRegisterGame}
              disabled={registering}
              className="w-full"
            >
              {registering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Register with Monad Games ID
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://monad-games-id-site.vercel.app" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Not connected state
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect to Monad Games ID
        </CardTitle>
        <CardDescription>
          Sign in with your wallet to compete on the global leaderboard
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
              <div className="text-muted-foreground">Powered by Privy wallet infrastructure</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="text-sm">
              <div className="font-medium">Verifiable Scores</div>
              <div className="text-muted-foreground">All achievements recorded on Monad Testnet</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="h-5 w-5 text-accent" />
            <div className="text-sm">
              <div className="font-medium">Cross-Game Identity</div>
              <div className="text-muted-foreground">One identity across all Monad games</div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={loading}
          className="w-full temporal-glow"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>

        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <a href="https://monad-games-id-site.vercel.app" target="_blank" rel="noopener noreferrer">
              Learn more about Monad Games ID
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonadAuth

