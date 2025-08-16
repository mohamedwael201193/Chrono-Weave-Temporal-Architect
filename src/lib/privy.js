import { PrivyProvider } from '@privy-io/react-auth';

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
};

// Privy configuration for Monad Games ID integration
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'cmd8euall0037l5ixqjvhqnhg', // Your Privy App ID
  config: {
    loginMethodsAndOrder: {
      primary: ['cmd8euall0037le0my79qpz42'], // This is the Cross App ID for Monad Games ID
    },
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
};

// Monad Games ID smart contract configuration
export const monadGamesContract = {
  address: '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4',
  explorerUrl: 'https://testnet.monadexplorer.com/address/0xceCBFF203C8B6044F52CE23D914A1bfD997541A4?tab=Contract',
};

// Game configuration
export const gameConfig = {
  name: 'Chrono-Weave: Temporal Architect',
  id: 'chrono-weave-temporal-architect',
  description: 'Master the art of temporal engineering in this revolutionary strategic puzzle game.',
  url: 'https://chrono-weave-temporal-architect.vercel.app',
  image: 'https://chrono-weave-temporal-architect.vercel.app/game-icon.png',
  version: '1.0.0',
};

// Monad Games ID API endpoints
export const monadGamesAPI = {
  checkWallet: 'https://monad-games-id-site.vercel.app/api/check-wallet',
  registerUsername: 'https://monad-games-id-site.vercel.app/',
};

// Cross App ID for Monad Games ID (DO NOT CHANGE)
export const MONAD_GAMES_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';



