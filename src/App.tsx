import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
import { NetworkConfig } from './types'
import { getNetworkByChainId, getAllNetworks, DONATION_ADDRESS } from './configs'
import TokenList from './components/TokenList'
import SearchResults from './components/SearchResults'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useDisconnect } from 'wagmi'
import { switchToNetwork } from './utils/metamask'
import { searchTokens, SearchResult } from './utils/search'

const App: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig | null>(null)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false)
  const [showAddressDropdown, setShowAddressDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  // Initialize with Ethereum mainnet as default
  useEffect(() => {
    if (isConnected && chainId) {
      const network = getNetworkByChainId(`0x${chainId.toString(16)}`)
      setCurrentNetwork(network || getAllNetworks()[0]) // fallback to first network (Ethereum)
    } else if (!isConnected) {
      // Default to Ethereum mainnet when not connected
      setCurrentNetwork(getAllNetworks()[0])
    }
  }, [chainId, isConnected])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.network-dropdown-container')) {
        setShowNetworkDropdown(false)
      }
    }

    if (showNetworkDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showNetworkDropdown])

  useEffect(() => {
    const handleAddressClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Close dropdown if click is not on wallet address container
      if (!target.closest('.wallet-address-container')) {
        setShowAddressDropdown(false)
      }
    }

    if (showAddressDropdown) {
      document.addEventListener('click', handleAddressClickOutside)
      return () => document.removeEventListener('click', handleAddressClickOutside)
    }
  }, [showAddressDropdown])


  const handleNetworkSelect = async (network: NetworkConfig) => {
    setIsNetworkSwitching(true)
    setShowNetworkDropdown(false)

    if (isConnected) {
      try {
        await switchToNetwork(network)
        setCurrentNetwork(network)
      } catch (error: any) {
        console.error('Failed to switch network:', error)
        showToast('Failed to switch network: ' + error.message, 'error')
      } finally {
        setIsNetworkSwitching(false)
      }
    } else {
      // Just change the display network when not connected
      setCurrentNetwork(network)
      setIsNetworkSwitching(false)
    }
  }

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        showToast('Address copied to clipboard!', 'success')
      } catch (error) {
        console.error('Failed to copy address:', error)
        showToast('Failed to copy address', 'error')
      }
    }
  }

  const handleCopyDonationAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS)
      showToast('Donation address copied to clipboard!', 'success')
    } catch (error) {
      console.error('Failed to copy donation address:', error)
      showToast('Failed to copy donation address', 'error')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowAddressDropdown(false)
    showToast('Wallet disconnected', 'success')
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({message, type})
    setTimeout(() => setToast(null), 3000)
  }

  // Search functionality with debouncing
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchTokens(term)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      showToast('Search failed. Please try again.', 'error')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, performSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Show loading immediately for address searches
    if (value.length >= 3) {
      setIsSearching(true)
    }
  }


  return (
    <div className="App">
      <div className="app-container">
        {/* Left introduction area */}
        <aside className="app-sidebar">
          <div className="sidebar-content">
            <div className="project-intro">
              <h1>Meta CoinList</h1>
              <p>One-click token addition to your MetaMask wallet</p>
              <p>Supporting multiple mainstream blockchain networks including Ethereum, Polygon, BSC, Arbitrum and more.</p>
            </div>

            <div className="external-links">
              <h3>Related Links</h3>
              <a href="https://github.com/HFFP/MetaCoinList" target="_blank" rel="noopener noreferrer" className="link-item">
                <svg className="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repository
              </a>
            </div>

            <div className="donation-section">
              <h3>Support Project</h3>
              <p>If this project helps you, consider supporting with a donation:</p>
              <div className="donation-address clickable-address" onClick={handleCopyDonationAddress}>
                <span className="donation-addr">{DONATION_ADDRESS}</span>
                <svg className="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
            </div>
          </div>
        </aside>

        {/* Right main content area */}
        <main className="app-main">
          <div className="main-header">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search token name, symbol, or contract address..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="wallet-section">
              <div className="wallet-controls">
                {/* Network selection section - always show */}
                {currentNetwork && (
                  <div className="network-dropdown-container">
                    <button
                      className="current-network"
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                      disabled={isNetworkSwitching}
                    >
                      <span className="network-indicator"></span>
                      {isNetworkSwitching ? 'Switching...' : currentNetwork.chainName.replace(' Mainnet', '').replace(' One', '')}
                      <span className={`dropdown-arrow ${showNetworkDropdown ? 'open' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {showNetworkDropdown && (
                      <div className="network-dropdown">
                        {getAllNetworks().map((network) => (
                          <button
                            key={network.chainId}
                            className={`network-option ${currentNetwork?.chainId === network.chainId ? 'active' : ''}`}
                            onClick={() => handleNetworkSelect(network)}
                          >
                            <span className="network-indicator"></span>
                            {network.chainName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Wallet connection/address section */}
                {!isConnected ? (
                  <ConnectButton
                    showBalance={false}
                    chainStatus="none"
                    accountStatus="avatar"
                  />
                ) : (
                  <div className="wallet-address-container">
                    <button
                      className="wallet-address"
                      onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                    >
                      <span className="address-indicator"></span>
                      <span className="address-text">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </button>

                    {/* Address dropdown */}
                    {showAddressDropdown && (
                      <div className="wallet-address-dropdown">
                        <div className="dropdown-row">
                          <div
                            className="full-address-display clickable-address"
                            onClick={handleCopyAddress}
                            title="Click to copy"
                          >
                            <span className="address-text-full">{address}</span>
                            <svg className="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                          </div>
                          <button
                            className="custom-disconnect-button"
                            onClick={handleDisconnect}
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="token-content">
            {searchTerm.trim() ? (
              <SearchResults
                results={searchResults}
                searchTerm={searchTerm}
                isLoading={isSearching}
              />
            ) : (
              currentNetwork && (
                <TokenList
                  tokens={currentNetwork.tokens}
                  networkName={currentNetwork.chainName}
                  blockExplorerUrl={currentNetwork.blockExplorerUrls?.[0]}
                />
              )
            )}
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
