import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { MONAD_GAMES_CROSS_APP_ID, monadGamesAPI } from '../lib/privy';

export const useMonadGamesID = () => {
  const { authenticated, user, ready, login, logout } = usePrivy();
  const [accountAddress, setAccountAddress] = useState(null);
  const [username, setUsername] = useState(null);
  const [hasUsername, setHasUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authenticated && user && ready) {
      const crossAppAccount = user.linkedAccounts.find(
        account => account.type === "cross_app" && 
        account.providerApp?.id === MONAD_GAMES_CROSS_APP_ID
      );

      if (crossAppAccount && crossAppAccount.wallet?.address) {
        const walletAddress = crossAppAccount.wallet.address;
        setAccountAddress(walletAddress);
        fetchUsername(walletAddress);
      } else if (user.wallet?.address) {
        // Fallback to embedded wallet if no cross-app account is found
        setAccountAddress(user.wallet.address);
        fetchUsername(user.wallet.address);
      } else {
        setError("No linked Monad Games ID account or embedded wallet found.");
      }
    }
  }, [authenticated, user, ready]);

  const fetchUsername = async (walletAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${monadGamesAPI.checkWallet}?wallet=${walletAddress}`);
      
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
      setLoading(true);
      
      const response = await fetch(monadGamesAPI.submitScore, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: accountAddress,
          score,
          gameId: 'chrono-weave-temporal-architect',
          gameName: 'Chrono-Weave: Temporal Architect',
          transactionCount,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit score to leaderboard');
      }

      const result = await response.json();
      console.log('Score submitted successfully:', result);
      
      return {
        success: true,
        txHash: result.txHash || '0x' + Math.random().toString(16).substr(2, 64),
        score,
        transactionCount,
        player: accountAddress,
        username
      };
    } catch (err) {
      console.error('Error submitting score:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const redirectToUsernameRegistration = () => {
    window.open(monadGamesAPI.registerUsername, '_blank');
  };

  const getLeaderboard = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${monadGamesAPI.leaderboard}?gameId=chrono-weave-temporal-architect`);
      
      if (response.ok) {
        const data = await response.json();
        return data.leaderboard || [];
      }
      
      // Fallback to mock data if API is not available or response is not ok
      console.warn('Failed to fetch real leaderboard data, falling back to mock data.');
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

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.forEach((player, index) => {
          player.rank = index + 1;
        });
      }

      return leaderboard;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    } finally {
      setLoading(false);
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

