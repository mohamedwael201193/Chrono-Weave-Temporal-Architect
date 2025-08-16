import React from 'react';
import { useMonadGamesID } from '../hooks/useMonadGamesID';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Loader2, ExternalLink, User, Wallet, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const MonadAuth = () => {
  const {
    authenticated,
    ready,
    login,
    logout,
    accountAddress,
    username,
    hasUsername,
    loading,
    error,
    redirectToUsernameRegistration,
    fetchUsername
  } = useMonadGamesID();

  if (!ready) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Initializing Monad Games ID...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Connection Error
          </CardTitle>
          <CardDescription>
            There was an issue connecting to Monad Games ID.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={login}
            className="w-full temporal-glow"
            size="lg"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect to Monad Games ID
          </CardTitle>
          <CardDescription>
            Sign in with your Monad Games ID to play and compete on the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <div className="font-medium">Secure Authentication</div>
                <div className="text-muted-foreground">Powered by Privy Global Wallet</div>
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
            onClick={login}
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
                Sign in with Monad Games ID
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
    );
  }

  if (!hasUsername) {
    return (
      <Card className="border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Monad Username Required
          </CardTitle>
          <CardDescription>
            You need to register your Monad username to play this game
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
                  {accountAddress?.slice(0, 6)}...{accountAddress?.slice(-4)}
                </div>
              </div>
            </div>
            <Badge variant="outline">
              Username Required
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
              To compete on the global leaderboard, you need to register a username with Monad Games ID.
              This creates your cross-game identity on the Monad network.
            </div>
            
            <Button 
              onClick={redirectToUsernameRegistration}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Register Username
            </Button>

            <Button 
              onClick={fetchUsername}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking...
                </>
              ) : (
                'Check Again'
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={logout}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <div className="font-semibold">{username}</div>
              <div className="text-sm text-muted-foreground">
                {accountAddress?.slice(0, 6)}...{accountAddress?.slice(-4)}
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
          <Button variant="outline" size="sm" onClick={logout}>
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
  );
};

export default MonadAuth;


