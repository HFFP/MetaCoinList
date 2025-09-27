import React, { useState, useEffect } from 'react'
import './App.css'
import { NetworkConfig } from './types'
import { getNetworkByChainId, getAllNetworks, DONATION_ADDRESS } from './configs'
import TokenList from './components/TokenList'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { switchToNetwork } from './utils/metamask'

const App: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig | null>(null)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  useEffect(() => {
    if (chainId) {
      const network = getNetworkByChainId(`0x${chainId.toString(16)}`)
      setCurrentNetwork(network || null)
    }
  }, [chainId])

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
    const handleModalClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Close modal if click is not on wallet address button or modal content
      if (!target.closest('.wallet-address') && !target.closest('.wallet-modal')) {
        setShowAddressModal(false)
      }
    }

    if (showAddressModal) {
      document.addEventListener('click', handleModalClickOutside)
      return () => document.removeEventListener('click', handleModalClickOutside)
    }
  }, [showAddressModal])


  const handleNetworkSelect = async (network: NetworkConfig) => {
    setIsNetworkSwitching(true)
    setShowNetworkDropdown(false)

    try {
      await switchToNetwork(network)
      setCurrentNetwork(network)
    } catch (error: any) {
      console.error('Failed to switch network:', error)
      alert('Failed to switch network: ' + error.message)
    } finally {
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({message, type})
    setTimeout(() => setToast(null), 3000)
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
              <a href="https://github.com/lonzo/MetaCoinList" target="_blank" rel="noopener noreferrer" className="link-item">
                <svg className="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repository
              </a>
            </div>

            <div className="donation-section">
              <h3>Support Project</h3>
              <p>If this project helps you, consider supporting with a donation:</p>
              <div className="donation-address" onClick={handleCopyDonationAddress}>
                <span className="donation-addr">{DONATION_ADDRESS}</span>
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
                placeholder="Search token name or symbol..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="wallet-section">
              {!isConnected ? (
                <ConnectButton
                  showBalance={false}
                  chainStatus="none"
                  accountStatus="avatar"
                />
              ) : (
                <div className="wallet-connected">
                  <div className="wallet-controls">
                    {/* Network selection section */}
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

                    {/* Wallet address section */}
                    <button
                      className="wallet-address"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <span className="address-indicator"></span>
                      <span className="address-text">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </button>
                  </div>

                  {/* Address modal */}
                  {showAddressModal && (
                    <>
                      <div className="modal-backdrop"></div>
                      <div className="wallet-modal">
                        <div className="modal-header">
                          <h3>Wallet Details</h3>
                        </div>
                        <div className="modal-content">
                          <div className="full-address">
                            <span className="address-label">Address:</span>
                            <span className="full-address-text">{address}</span>
                          </div>
                          <div className="modal-actions">
                            <button className="copy-button" onClick={handleCopyAddress}>
                              📋 Copy Address
                            </button>
                            <ConnectButton
                              showBalance={false}
                              chainStatus="none"
                              accountStatus="avatar"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="token-content">
            {isConnected && address && currentNetwork && (
              <TokenList
                tokens={currentNetwork.tokens.filter(token =>
                  token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                networkName={currentNetwork.chainName}
                searchTerm={searchTerm}
              />
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
