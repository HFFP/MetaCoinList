import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, bsc } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'MetaCoin List',
  projectId: 'YOUR_PROJECT_ID', // You can use default first, apply for WalletConnect Project ID later
  chains: [mainnet, polygon, arbitrum, bsc],
  ssr: false,
})