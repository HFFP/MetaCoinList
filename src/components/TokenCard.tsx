import React, { useState } from 'react'
import { Token, AddTokenResult } from '../types'
import { addTokenToWallet } from '../utils/metamask'

interface TokenCardProps {
  token: Token
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [addStatus, setAddStatus] = useState<AddTokenResult | null>(null)

  const handleAddToken = async () => {
    setIsLoading(true)
    setAddStatus(null)

    try {
      const result = await addTokenToWallet(token)
      setAddStatus(result)

      if (result.success) {
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
            // 如果图片加载失败，显示一个默认的圆形图标
            const img = e.target as HTMLImageElement
            img.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#667eea" stroke="#764ba2" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
                  ${token.symbol.slice(0, 3)}
                </text>
              </svg>
            `)}`
            img.onerror = null // 防止无限循环
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

      <button
        className="add-token-button"
        onClick={handleAddToken}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add to MetaMask'}
      </button>

      {addStatus && (
        <div className={`status-message ${addStatus.success ? 'success' : 'error'}`}>
          {addStatus.message}
        </div>
      )}
    </div>
  )
}

export default TokenCard