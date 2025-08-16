import React, { useState, useEffect } from 'react';
import { useMonadGamesID } from '../hooks/useMonadGamesID';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Trophy, Medal, Award, User, Clock, Zap, RotateCcw, RefreshCw, Crown, ExternalLink } from 'lucide-react';

const Leaderboard = () => {
  const { getLeaderboard, username, accountAddress, hasUsername, authenticated } = useMonadGamesID();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, [authenticated, hasUsername]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRankBadgeVariant = (rank) => {
    switch (rank) {
      case 1:
        return 'default';
      case 2:
        return 'secondary';
      case 3:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const openMonadGamesID = () => {
    window.open('https://monad-games-id-site.vercel.app/', '_blank');
  };

  if (loading && leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>
            Top temporal architects across the Monad network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>
            Top temporal architects across the Monad network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchLeaderboard} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Global Leaderboard
              {loading && <RefreshCw className="h-4 w-4 animate-spin ml-2" />}
            </CardTitle>
            <CardDescription>
              Top temporal architects across the Monad network
              {lastUpdated && (
                <span className="block text-xs mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={openMonadGamesID} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Monad Games ID
            </Button>
            <Button onClick={fetchLeaderboard} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!authenticated && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-sm">Connect to Compete</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect your Monad Games ID to submit scores and appear on the leaderboard
            </p>
          </div>
        )}

        {authenticated && !hasUsername && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-sm">Register Username</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Register a username to appear on the leaderboard and compete with other players
            </p>
            <Button onClick={openMonadGamesID} size="sm" variant="outline">
              <ExternalLink className="h-3 w-3 mr-1" />
              Register Now
            </Button>
          </div>
        )}

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No scores recorded yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to complete a temporal challenge!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const isCurrentUser = hasUsername && username && player.username === username;
              
              return (
                <div
                  key={`${player.playerAddress}-${index}`}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isCurrentUser 
                      ? 'bg-primary/10 border-primary/20 temporal-glow' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(player.rank)}
                      <Badge variant={getRankBadgeVariant(player.rank)}>
                        #{player.rank}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {player.username}
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {player.playerAddress?.slice(0, 6)}...{player.playerAddress?.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">{player.score?.toLocaleString() || 0}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {player.efficiency || 0}%
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        {player.loops || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(player.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Leaderboard Info</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Scores are verified and recorded on Monad Testnet</p>
            <p>• Rankings update in real-time across all games</p>
            <p>• Your Monad Games ID preserves your identity across games</p>
            <p>• Leaderboard refreshes automatically every 30 seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

