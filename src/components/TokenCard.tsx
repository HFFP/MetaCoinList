import React, { useState, useEffect } from 'react'
import { Token, AddTokenResult } from '../types'
import { addTokenToWallet, checkTokenExists } from '../utils/metamask'

interface TokenCardProps {
  token: Token
  blockExplorerUrl?: string
  networkName?: string
  showNetworkBadge?: boolean
}

const TokenCard: React.FC<TokenCardProps> = ({ token, blockExplorerUrl, networkName, showNetworkBadge = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [addStatus, setAddStatus] = useState<AddTokenResult | null>(null)
  const [tokenExists, setTokenExists] = useState<boolean>(false)
  const [checkingExists, setCheckingExists] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      setCheckingExists(true)
      try {
        const exists = await checkTokenExists(token.address)
        setTokenExists(exists)
      } catch (error) {
        console.log('Could not check token existence:', error)
      } finally {
        setCheckingExists(false)
      }
    }

    checkToken()
  }, [token.address])

  const handleAddToken = async () => {
    setIsLoading(true)
    setAddStatus(null)

    try {
      const result = await addTokenToWallet(token)
      setAddStatus(result)

      if (result.success) {
        setTokenExists(true)
        setTimeout(() => setAddStatus(null), 3000)
      }
    } catch (error: any) {
      console.error('Failed to add token:', error)
      setAddStatus({
        success: false,
        message: 'Failed to add token: ' + error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(token.address)
      setAddStatus({
        success: true,
        message: 'Address copied to clipboard!'
      })
      setTimeout(() => setAddStatus(null), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
      setAddStatus({
        success: false,
        message: 'Failed to copy address'
      })
      setTimeout(() => setAddStatus(null), 2000)
    }
  }

  return (
    <div className="token-card">
      <div className="token-header">
        <img
          src={token.logo}
          alt={`${token.symbol} logo`}
          className="token-logo"
          onError={(e) => {
            // If image loading fails, show a default circular icon
            const img = e.target as HTMLImageElement
            img.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#667eea" stroke="#764ba2" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
                  ${token.symbol.slice(0, 3)}
                </text>
              </svg>
            `)}`
            img.onerror = null // Prevent infinite loop
          }}
        />
        <div className="token-symbol-container">
          <span className="token-symbol">{token.symbol}</span>
          {showNetworkBadge && networkName && (
            <span className="network-badge-inline">
              {networkName.replace(' Mainnet', '').replace(' One', '')}
            </span>
          )}
        </div>
      </div>

      <div className="token-name-row">
        <div className="token-name">{token.name}</div>
        {blockExplorerUrl && (
          <a
            href={`${blockExplorerUrl}/token/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            <svg className="explorer-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
            View on Explorer
          </a>
        )}
      </div>

      <div className="token-address clickable-address" onClick={handleCopyAddress} title="Click to copy">
        <span className="address-text">{token.address}</span>
        <svg className="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      </div>

      {checkingExists ? (
        <button className="add-token-button" disabled>
          Checking...
        </button>
      ) : tokenExists ? (
        <button className="add-token-button token-exists" disabled>
          ✓ Previously Added
        </button>
      ) : (
        <button
          className="add-token-button"
          onClick={handleAddToken}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add to MetaMask'}
        </button>
      )}

      {addStatus && (
        <div className={`status-message ${addStatus.success ? 'success' : 'error'}`}>
          {addStatus.message}
        </div>
      )}
    </div>
  )
}

export default TokenCard