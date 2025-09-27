import React from 'react'
import { Token } from '../types'
import TokenCard from './TokenCard'

interface TokenListProps {
  tokens: Token[]
  networkName: string
  searchTerm?: string
}

const TokenList: React.FC<TokenListProps> = ({ tokens, networkName, searchTerm }) => {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="no-tokens">
        <p>{searchTerm ? `No tokens found matching "${searchTerm}"` : `No tokens available for ${networkName || 'this network'}.`}</p>
      </div>
    )
  }

  return (
    <div className="token-list-container">
      <h3>Available Tokens on {networkName}</h3>
      <div className="tokens-grid">
        {tokens.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    </div>
  )
}

export default TokenList