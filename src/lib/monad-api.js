// Simplified Monad Games ID API integration
// This provides a working implementation without complex wallet dependencies

export const MONAD_GAMES_API = {
  BASE_URL: 'https://monad-games-id-site.vercel.app/api',
  REGISTER_GAME: '/games/register',
  SUBMIT_SCORE: '/scores/submit',
  GET_LEADERBOARD: '/leaderboard',
  GET_USER_PROFILE: '/users/profile',
}

export const GAME_CONFIG = {
  id: 'chrono-weave-temporal-architect',
  name: 'Chrono-Weave: Temporal Architect',
  version: '1.0.0',
  description: 'Master the art of temporal engineering in this revolutionary strategic puzzle game.',
}

// Mock wallet connection for demonstration
export class MockWallet {
  constructor() {
    this.isConnected = false
    this.address = null
    this.username = null
  }

  async connect() {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    this.isConnected = true
    this.address = `0x${Math.random().toString(16).substr(2, 40)}`
    this.username = `Player${this.address.slice(-4)}`
    
    return {
      address: this.address,
      username: this.username,
    }
  }

  async disconnect() {
    this.isConnected = false
    this.address = null
    this.username = null
  }

  async signMessage(message) {
    if (!this.isConnected) {
      throw new Error('Wallet not connected')
    }
    
    // Simulate message signing
    await new Promise(resolve => setTimeout(resolve, 500))
    return `0x${Math.random().toString(16).substr(2, 128)}`
  }
}

// Monad Games ID API client
export class MonadGamesAPI {
  constructor() {
    this.wallet = new MockWallet()
  }

  async connectWallet() {
    return await this.wallet.connect()
  }

  async disconnectWallet() {
    await this.wallet.disconnect()
  }

  get isConnected() {
    return this.wallet.isConnected
  }

  get address() {
    return this.wallet.address
  }

  get username() {
    return this.wallet.username
  }

  async registerGame() {
    if (!this.wallet.isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      const message = `Register game: ${GAME_CONFIG.name}\nAddress: ${this.wallet.address}\nTimestamp: ${Date.now()}`
      const signature = await this.wallet.signMessage(message)

      // In a real implementation, this would call the actual API
      // For now, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        gameId: GAME_CONFIG.id,
        playerAddress: this.wallet.address,
        registered: true,
      }
    } catch (error) {
      console.error('Game registration failed:', error)
      throw error
    }
  }

  async submitScore(score, metadata = {}) {
    if (!this.wallet.isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      const scoreData = {
        gameId: GAME_CONFIG.id,
        playerAddress: this.wallet.address,
        score,
        metadata,
        timestamp: Date.now(),
      }

      const message = `Submit score: ${score}\nGame: ${GAME_CONFIG.id}\nPlayer: ${this.wallet.address}\nTimestamp: ${scoreData.timestamp}`
      const signature = await this.wallet.signMessage(message)

      // In a real implementation, this would call the actual API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store score locally for demo purposes
      this.storeScoreLocally(scoreData)

      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        scoreData,
      }
    } catch (error) {
      console.error('Score submission failed:', error)
      throw error
    }
  }

  async getLeaderboard(limit = 100) {
    try {
      // In a real implementation, this would fetch from the actual API
      // For now, we'll return mock data with any locally stored scores
      const localScores = this.getLocalScores()
      const mockData = this.generateMockLeaderboard()
      
      // Combine local scores with mock data
      const combined = [...localScores, ...mockData]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))

      return combined
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      throw error
    }
  }

  storeScoreLocally(scoreData) {
    try {
      const scores = JSON.parse(localStorage.getItem('chrono_weave_scores') || '[]')
      scores.push({
        ...scoreData,
        username: this.wallet.username,
        playerAddress: this.wallet.address,
      })
      localStorage.setItem('chrono_weave_scores', JSON.stringify(scores))
    } catch (error) {
      console.error('Failed to store score locally:', error)
    }
  }

  getLocalScores() {
    try {
      return JSON.parse(localStorage.getItem('chrono_weave_scores') || '[]')
    } catch (error) {
      console.error('Failed to get local scores:', error)
      return []
    }
  }

  generateMockLeaderboard() {
    const mockPlayers = [
      'TemporalMaster', 'QuantumArchitect', 'ChronoWeaver', 'EnergyOptimizer', 'TimeLooper',
      'VoidWalker', 'FluxCapacitor', 'TemporalEcho', 'QuantumLeap', 'ChronoSynth',
      'EnergyVortex', 'TimeBender', 'QuantumGrid', 'TemporalFlow', 'ChronoLink'
    ]

    return mockPlayers.map((name, index) => ({
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
}

// Global API instance
export const monadAPI = new MonadGamesAPI()

