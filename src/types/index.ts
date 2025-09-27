export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logo: string
}

export interface NetworkConfig {
  chainId: string
  chainName: string
  rpcUrls: string[]
  blockExplorerUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  tokens: Token[]
}

export interface AddTokenResult {
  success: boolean
  message: string
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeAllListeners: (event: string) => void
    }
  }
}