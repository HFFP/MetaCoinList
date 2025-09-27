import React, { useState, useEffect } from 'react'
import './App.css'
import { NetworkConfig } from './types'
import { isMetaMaskInstalled, connectWallet, getCurrentChainId, onAccountsChanged, onChainChanged, removeAllListeners } from './utils/metamask'
import { getNetworkByChainId } from './configs'
import NetworkSelector from './components/NetworkSelector'
import TokenList from './components/TokenList'

const App: React.FC = () => {
  const [metamaskInstalled, setMetamaskInstalled] = useState<boolean>(false)
  const [account, setAccount] = useState<string | null>(null)
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setMetamaskInstalled(isMetaMaskInstalled())

    if (isMetaMaskInstalled()) {
      // Set up event listeners
      onAccountsChanged((accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null)
      })

      onChainChanged(async (chainId: string) => {
        const network = getNetworkByChainId(chainId)
        setCurrentNetwork(network || null)
      })

      // Get current chain on load
      getCurrentChainId().then(chainId => {
        const network = getNetworkByChainId(chainId)
        setCurrentNetwork(network || null)
      }).catch(console.error)
    }

    return () => {
      removeAllListeners()
    }
  }, [])

  const handleConnectWallet = async () => {
    setIsLoading(true)
    try {
      const connectedAccount = await connectWallet()
      setAccount(connectedAccount)

      // Get current network after connecting
      const chainId = await getCurrentChainId()
      const network = getNetworkByChainId(chainId)
      setCurrentNetwork(network || null)
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error)
      alert('Failed to connect to MetaMask: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNetworkChange = (network: NetworkConfig) => {
    setCurrentNetwork(network)
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>MetaCoin List</h1>
        <p>Add tokens to your MetaMask wallet</p>

        {!metamaskInstalled ? (
          <div className="metamask-warning">
            <p>MetaMask is not installed. Please install MetaMask to use this application.</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="install-button"
            >
              Install MetaMask
            </a>
          </div>
        ) : !account ? (
          <button
            onClick={handleConnectWallet}
            className="connect-button"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            {currentNetwork && (
              <p>Network: {currentNetwork.chainName}</p>
            )}
          </div>
        )}
      </header>

      <main className="app-main">
        {account && (
          <>
            <NetworkSelector
              currentNetwork={currentNetwork}
              onNetworkChange={handleNetworkChange}
            />

            {currentNetwork && (
              <TokenList
                tokens={currentNetwork.tokens}
                networkName={currentNetwork.chainName}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App