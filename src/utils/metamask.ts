import { NetworkConfig, Token, AddTokenResult } from '../types'

export const isMetaMaskInstalled = (): boolean => {
  return typeof window.ethereum !== 'undefined' && !!window.ethereum.isMetaMask
}

export const connectWallet = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  } catch (error: any) {
    throw new Error('Failed to connect to MetaMask: ' + error.message)
  }
}

export const getCurrentChainId = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId',
    })
    return chainId
  } catch (error: any) {
    throw new Error('Failed to get chain ID: ' + error.message)
  }
}

export const switchToNetwork = async (networkConfig: NetworkConfig): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    })
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: networkConfig.chainId,
              chainName: networkConfig.chainName,
              rpcUrls: networkConfig.rpcUrls,
              blockExplorerUrls: networkConfig.blockExplorerUrls,
              nativeCurrency: networkConfig.nativeCurrency,
            },
          ],
        })
      } catch (addError: any) {
        throw new Error('Failed to add network: ' + addError.message)
      }
    } else {
      throw new Error('Failed to switch network: ' + switchError.message)
    }
  }
}

export const checkTokenExists = async (tokenAddress: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    return false
  }

  try {
    // Try to get token balance to check if already added
    const balance = await window.ethereum!.request({
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: '0x70a08231000000000000000000000000' + (await getCurrentAccount()).slice(2)
        },
        'latest'
      ]
    })
    return balance !== null
  } catch (error) {
    // If call fails, token might not exist or not added
    return false
  }
}

const getCurrentAccount = async (): Promise<string> => {
  const accounts = await window.ethereum!.request({
    method: 'eth_accounts'
  })
  return accounts[0] || ''
}

export const addTokenToWallet = async (tokenConfig: Token): Promise<AddTokenResult> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  console.log('Adding token:', tokenConfig)

  // Check if token is already added
  try {
    const tokenExists = await checkTokenExists(tokenConfig.address)
    if (tokenExists) {
      return { success: true, message: 'Token already exists in wallet!' }
    }
  } catch (error) {
    console.log('Could not check if token exists, proceeding with add')
  }

  try {
    const result = await window.ethereum!.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenConfig.address,
          symbol: tokenConfig.symbol,
          decimals: tokenConfig.decimals,
          image: tokenConfig.logo,
        },
      },
    })

    console.log('MetaMask response:', result)

    if (result === true) {
      return { success: true, message: 'Token added successfully!' }
    } else {
      return { success: false, message: 'Token addition was cancelled.' }
    }
  } catch (error: any) {
    console.error('MetaMask error:', error)
    throw new Error('Failed to add token: ' + error.message)
  }
}

export const getAccountBalance = async (account: string, tokenAddress?: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    // For native currency balance
    if (!tokenAddress) {
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      })
      return balance
    }

    // For ERC20 token balance, we would need to implement contract calls
    // This is a simplified version
    return '0x0'
  } catch (error: any) {
    throw new Error('Failed to get balance: ' + error.message)
  }
}

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.on('accountsChanged', callback)
  }
}

// Listen for chain changes
export const onChainChanged = (callback: (chainId: string) => void): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.on('chainChanged', callback)
  }
}

// Remove listeners
export const removeAllListeners = (): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.removeAllListeners('accountsChanged')
    window.ethereum!.removeAllListeners('chainChanged')
  }
}