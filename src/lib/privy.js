import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// Define Monad Testnet
export const monadTestnet = {
  id: 41454,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet1.monad.xyz'] },
    public: { http: ['https://testnet1.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer-testnet.monad.xyz' },
  },
  testnet: true,
}

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [monadTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider(),
  ]
)

// Wagmi configuration
export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
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

