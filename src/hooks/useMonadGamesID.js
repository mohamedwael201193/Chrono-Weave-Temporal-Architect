import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export const useMonadGamesID = () => {
  const { authenticated, user, ready, login, logout } = usePrivy();
  const [accountAddress, setAccountAddress] = useState(null);
  const [username, setUsername] = useState(null);
  const [hasUsername, setHasUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if privy is ready and user is authenticated
    if (authenticated && user && ready) {
      // Check if user has linkedAccounts
      if (user.linkedAccounts.length > 0) {
        // Get the cross app account created using Monad Games ID
        const crossAppAccount = user.linkedAccounts.filter(
          account => account.type === "cross_app" && 
          account.providerApp?.id === "cmd8euall0037le0my79qpz42"
        )[0];

        // The first embedded wallet created using Monad Games ID, is the wallet address
        if (crossAppAccount && crossAppAccount.embeddedWallets?.length > 0) {
          const walletAddress = crossAppAccount.embeddedWallets[0].address;
          setAccountAddress(walletAddress);
          
          // Fetch username
          fetchUsername(walletAddress);
        }
      } else {
        setError("You need to link your Monad Games ID account to continue.");
      }
    }
  }, [authenticated, user, ready]);

  const fetchUsername = async (walletAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      
      const data = await response.json();
      
      if (data.hasUsername) {
        setUsername(data.user.username);
        setHasUsername(true);
      } else {
        setHasUsername(false);
        setUsername(null);
      }
    } catch (err) {
      setError('Failed to fetch username');
      console.error('Error fetching username:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (score, transactionCount = 1) => {
    if (!accountAddress) {
      throw new Error('No wallet address available');
    }

    try {
      // This would typically be done on the server side for security
      // For demo purposes, we'll simulate the submission
      console.log('Submitting score to Monad Games ID:', { 
        score, 
        transactionCount, 
        player: accountAddress,
        username 
      });
      
      // In a real implementation, you would call your backend API here
      // which would then interact with the smart contract at:
      // 0xceCBFF203C8B6044F52CE23D914A1bfD997541A4
      // using the updatePlayerData function
      
      // Simulate successful submission for demo
      return {
        success: true,
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        score,
        transactionCount,
        player: accountAddress
      };
    } catch (err) {
      console.error('Error submitting score:', err);
      throw err;
    }
  };

  const redirectToUsernameRegistration = () => {
    window.open('https://monad-games-id-site.vercel.app/', '_blank');
  };

  // Generate mock leaderboard data for demo
  const getLeaderboard = async () => {
    try {
      // In a real implementation, you would fetch from the smart contract
      // For demo purposes, we'll return mock data with some real players
      const mockPlayers = [
        'TemporalMaster', 'QuantumArchitect', 'ChronoWeaver', 'EnergyOptimizer', 'TimeLooper',
        'VoidWalker', 'FluxCapacitor', 'TemporalEcho', 'QuantumLeap', 'ChronoSynth',
        'EnergyVortex', 'TimeBender', 'QuantumGrid', 'TemporalFlow', 'ChronoLink'
      ];

      const leaderboard = mockPlayers.map((name, index) => ({
        rank: index + 1,
        username: name,
        playerAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        score: Math.floor(Math.random() * 5000) + 1000 - (index * 100),
        efficiency: Math.floor(Math.random() * 50) + 50 - (index * 2),
        loops: Math.floor(Math.random() * 20) + 5,
        timestamp: Date.now() - (Math.random() * 86400000), // Random time in last 24h
      }));

      // Add current user to leaderboard if they have a username
      if (hasUsername && username) {
        leaderboard.unshift({
          rank: 1,
          username: username,
          playerAddress: accountAddress,
          score: Math.floor(Math.random() * 1000) + 4000,
          efficiency: Math.floor(Math.random() * 20) + 80,
          loops: Math.floor(Math.random() * 10) + 15,
          timestamp: Date.now(),
          isCurrentUser: true
        });

        // Re-sort and update ranks
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.forEach((player, index) => {
          player.rank = index + 1;
        });
      }

      return leaderboard;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  };

  return {
    authenticated,
    user,
    ready,
    login,
    logout,
    accountAddress,
    username,
    hasUsername,
    loading,
    error,
    submitScore,
    redirectToUsernameRegistration,
    getLeaderboard,
    fetchUsername: () => accountAddress && fetchUsername(accountAddress)
  };
};

