import { useState, useEffect, useCallback } from 'react'
import { monadAPI } from '../lib/monad-api.js'

export const useMonadGamesID = () => {
  const [ready, setReady] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [username, setUsername] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [gameProfile, setGameProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize connection state
  useEffect(() => {
    setReady(true)
    setAuthenticated(monadAPI.isConnected)
    setIsConnected(monadAPI.isConnected)
    setAddress(monadAPI.address)
    setUsername(monadAPI.username)
    setIsRegistered(monadAPI.isConnected) // For demo, assume registered if connected
  }, [])

  // Connect wallet using simplified API
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await monadAPI.connectWallet()
      
      setAuthenticated(true)
      setIsConnected(true)
      setAddress(result.address)
      setUsername(result.username)
      setIsRegistered(true) // For demo, assume registered after connection
      
      return result
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError('Failed to connect wallet')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await monadAPI.disconnectWallet()
      
      setAuthenticated(false)
      setIsConnected(false)
      setAddress(null)
      setUsername('')
      setIsRegistered(false)
      setGameProfile(null)
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [])

  // Register game with Monad Games ID
  const registerGame = useCallback(async () => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await monadAPI.registerGame()
      setIsRegistered(true)
      
      return result
    } catch (err) {
      console.error('Error registering game:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [isConnected])

  // Submit score to Monad Games ID leaderboard
  const submitScore = useCallback(async (score, metadata = {}) => {
    if (!authenticated || !isConnected || !isRegistered) {
      throw new Error('User not authenticated or registered')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await monadAPI.submitScore(score, metadata)
      return result
    } catch (err) {
      console.error('Error submitting score:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [authenticated, isConnected, isRegistered])

  // Get leaderboard data
  const getLeaderboard = useCallback(async (limit = 100) => {
    try {
      const leaderboard = await monadAPI.getLeaderboard(limit)
      return leaderboard
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      throw err
    }
  }, [])

  // Check registration status (simplified for demo)
  const checkRegistration = useCallback(async () => {
    if (!authenticated || !address) return

    try {
      setLoading(true)
      // For demo purposes, assume registered if connected
      setIsRegistered(true)
    } catch (err) {
      console.error('Error checking registration:', err)
      setError('Failed to check registration status')
    } finally {
      setLoading(false)
    }
  }, [authenticated, address])

  return {
    // Connection state
    ready,
    authenticated,
    isConnected,
    address,
    user: { address, username },
    wallets: [],
    
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

