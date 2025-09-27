import React, { useState, useEffect } from 'react'
import { Token, AddTokenResult } from '../types'
import { addTokenToWallet, checkTokenExists } from '../utils/metamask'

interface TokenCardProps {
  token: Token
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
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
        <span className="token-symbol">{token.symbol}</span>
      </div>

      <div className="token-name">{token.name}</div>

      <div className="token-address">
        Contract: {token.address}
      </div>

      <div className="token-decimals">
        Decimals: {token.decimals}
      </div>

      {checkingExists ? (
        <button className="add-token-button" disabled>
          Checking...
        </button>
      ) : tokenExists ? (
        <button className="add-token-button token-exists" disabled>
          ✓ Already in Wallet
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