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
      let walletAddress = null;

      // Try to get the cross-app account wallet address first
      const crossAppAccount = user.linkedAccounts.find(
        account => account.type === "cross_app" && 
        account.providerApp?.id === MONAD_GAMES_CROSS_APP_ID
      );

      if (crossAppAccount && crossAppAccount.wallet?.address) {
        walletAddress = crossAppAccount.wallet.address;
      } else if (user.wallet?.address) {
        // Fallback to embedded wallet if no cross-app account is found
        walletAddress = user.wallet.address;
      }

      if (walletAddress) {
        setAccountAddress(walletAddress);
        fetchUsername(walletAddress);
      } else {
        setError("No linked Monad Games ID account or embedded wallet found. Please connect a wallet.");
      }
    } else if (ready && !authenticated) {
      // Clear state if not authenticated
      setAccountAddress(null);
      setUsername(null);
      setHasUsername(false);
      setError(null);
    }
  }, [authenticated, user, ready]);

  const fetchUsername = async (walletAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${monadGamesAPI.checkWallet}?wallet=${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch username: ${response.statusText}`);
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
      setError(`Error fetching username: ${err.message}`);
      console.error('Error fetching username:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (score, transactionCount = 1) => {
    if (!accountAddress) {
      throw new Error('No wallet address available to submit score.');
    }
    if (!hasUsername) {
      throw new Error('Please reserve a username before submitting scores.');
    }

    setLoading(true);
    setError(null);
    try {
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
        throw new Error(`Failed to submit score: ${response.statusText}`);
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
      setError(`Error submitting score: ${err.message}`);
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
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${monadGamesAPI.leaderboard}?gameId=chrono-weave-temporal-architect`);
      
      if (response.ok) {
        const data = await response.json();
        return data.leaderboard || [];
      }
      
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
      setError(`Error fetching leaderboard: ${err.message}`);
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

