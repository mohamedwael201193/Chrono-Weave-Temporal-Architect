import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'

// Define Monad Testnet
export const monadTestnet = defineChain({
  id: 41454,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet-explorer.monad.xyz' },
  },
  testnet: true,
})

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
})

// Query client for React Query
export const queryClient = new QueryClient()

// Privy configuration
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'cmd8euall0037l5ixqjvhqnhg',
  config: {
    loginMethods: ['wallet'],
    appearance: {
      theme: 'dark',
      accentColor: '#6366f1',
      logo: 'https://chrono-weave-temporal-architect.vercel.app/logo.png',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
    defaultChain: monadTestnet,
    supportedChains: [monadTestnet],
  },
}

// Monad Games ID API endpoints
export const MONAD_GAMES_API = {
  BASE_URL: 'https://monad-games-id-site.vercel.app/api',
  REGISTER_GAME: '/games/register',
  SUBMIT_SCORE: '/scores/submit',
  GET_LEADERBOARD: '/leaderboard',
  GET_USER_PROFILE: '/users/profile',
}

// Game configuration
export const GAME_CONFIG = {
  id: import.meta.env.VITE_GAME_ID || 'chrono-weave-temporal-architect',
  name: import.meta.env.VITE_GAME_NAME || 'Chrono-Weave: Temporal Architect',
  version: '1.0.0',
  description: 'Master the art of temporal engineering in this revolutionary strategic puzzle game.',
}

