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
  // MetaMask doesn't provide a standard API to check if a token is already added
  // We'll use localStorage to track tokens that were successfully added
  if (!isMetaMaskInstalled()) {
    return false
  }

  try {
    const addedTokens = JSON.parse(localStorage.getItem('metamask-added-tokens') || '[]')
    const currentAccount = await getCurrentAccount()
    const key = `${currentAccount.toLowerCase()}-${tokenAddress.toLowerCase()}`
    return addedTokens.includes(key)
  } catch (error) {
    return false
  }
}

const markTokenAsAdded = (tokenAddress: string, account: string) => {
  try {
    const addedTokens = JSON.parse(localStorage.getItem('metamask-added-tokens') || '[]')
    const key = `${account.toLowerCase()}-${tokenAddress.toLowerCase()}`
    if (!addedTokens.includes(key)) {
      addedTokens.push(key)
      localStorage.setItem('metamask-added-tokens', JSON.stringify(addedTokens))
    }
  } catch (error) {
    console.error('Failed to mark token as added:', error)
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

  // Check if token is already tracked as added
  try {
    const tokenExists = await checkTokenExists(tokenConfig.address)
    if (tokenExists) {
      return { success: true, message: 'Token already tracked as added!' }
    }
  } catch (error) {
    console.log('Could not check token tracking status, proceeding with add')
  }

  try {
    const result = await window.ethereum!.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenConfig.address,
        },
      },
    } as any)

    console.log('MetaMask response:', result)

    if (result === true) {
      // Mark token as added in localStorage
      const currentAccount = await getCurrentAccount()
      markTokenAsAdded(tokenConfig.address, currentAccount)
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
    window.ethereum!.on('accountsChanged', (accounts: string[]) => {
      // Clear token tracking when account changes since tokens are account-specific
      if (accounts.length === 0) {
        // User disconnected, could clear all tracking or keep it
        console.log('User disconnected from MetaMask')
      }
      callback(accounts)
    })
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