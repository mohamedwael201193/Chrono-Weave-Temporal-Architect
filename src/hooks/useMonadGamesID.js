import { useState, useEffect, useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useAccount, useSignMessage } from 'wagmi'
import { MONAD_GAMES_API, GAME_CONFIG } from '../lib/privy.js'

export const useMonadGamesID = () => {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [isRegistered, setIsRegistered] = useState(false)
  const [username, setUsername] = useState('')
  const [gameProfile, setGameProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize connection state
  useEffect(() => {
    if (authenticated && address) {
      checkRegistration()
    }
  }, [authenticated, address])

  // Connect wallet using Privy
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await login()
      
      return { success: true }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError('Failed to connect wallet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [login])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await logout()
      setIsRegistered(false)
      setUsername('')
      setGameProfile(null)
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [logout])

  // Register game with Monad Games ID
  const registerGame = useCallback(async () => {
    if (!authenticated || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      setLoading(true)
      setError(null)

      const message = `Register game: ${GAME_CONFIG.name}\nAddress: ${address}\nTimestamp: ${Date.now()}`
      const signature = await signMessageAsync({ message })

      const response = await fetch(`${MONAD_GAMES_API.BASE_URL}${MONAD_GAMES_API.REGISTER_GAME}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: GAME_CONFIG.id,
          gameName: GAME_CONFIG.name,
          playerAddress: address,
          message,
          signature,
          timestamp: Date.now(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`)
      }

      const result = await response.json()
      setIsRegistered(true)
      setUsername(result.username || `Player${address.slice(-4)}`)
      
      return result
    } catch (err) {
      console.error('Error registering game:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [authenticated, address, signMessageAsync])

  // Submit score to Monad Games ID leaderboard
  const submitScore = useCallback(async (score, metadata = {}) => {
    if (!authenticated || !address || !isRegistered) {
      throw new Error('User not authenticated or registered')
    }

    try {
      setLoading(true)
      setError(null)

      const scoreData = {
        gameId: GAME_CONFIG.id,
        playerAddress: address,
        score,
        metadata,
        timestamp: Date.now(),
      }

      const message = `Submit score: ${score}\nGame: ${GAME_CONFIG.id}\nPlayer: ${address}\nTimestamp: ${scoreData.timestamp}`
      const signature = await signMessageAsync({ message })

      const response = await fetch(`${MONAD_GAMES_API.BASE_URL}${MONAD_GAMES_API.SUBMIT_SCORE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scoreData,
          message,
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error(`Score submission failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (err) {
      console.error('Error submitting score:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [authenticated, address, isRegistered, signMessageAsync])

  // Get leaderboard data
  const getLeaderboard = useCallback(async (limit = 100) => {
    try {
      const response = await fetch(`${MONAD_GAMES_API.BASE_URL}${MONAD_GAMES_API.GET_LEADERBOARD}?gameId=${GAME_CONFIG.id}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`)
      }

      const result = await response.json()
      return result.leaderboard || []
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      // Return mock data as fallback
      return generateMockLeaderboard()
    }
  }, [])

  // Check registration status
  const checkRegistration = useCallback(async () => {
    if (!authenticated || !address) return

    try {
      setLoading(true)
      const response = await fetch(`${MONAD_GAMES_API.BASE_URL}${MONAD_GAMES_API.GET_USER_PROFILE}?address=${address}&gameId=${GAME_CONFIG.id}`)
      
      if (response.ok) {
        const result = await response.json()
        setIsRegistered(result.registered || false)
        setUsername(result.username || `Player${address.slice(-4)}`)
        setGameProfile(result.profile)
      } else {
        setIsRegistered(false)
      }
    } catch (err) {
      console.error('Error checking registration:', err)
      setError('Failed to check registration status')
    } finally {
      setLoading(false)
    }
  }, [authenticated, address])

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
      metadata: {
        efficiency: Math.floor(Math.random() * 50) + 50 - (index * 2),
        loops: Math.floor(Math.random() * 20) + 5,
        gameMode: 'temporal-architect',
      },
      timestamp: Date.now() - (Math.random() * 86400000), // Random time in last 24h
    }))
  }

  return {
    // Connection state
    ready,
    authenticated,
    isConnected,
    address,
    user,
    wallets,
    
    // Registration state
    isRegistered,
    username,
    gameProfile,
    
    // Loading and error states
    loading,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    registerGame,
    submitScore,
    getLeaderboard,
    checkRegistration,
  }
}

