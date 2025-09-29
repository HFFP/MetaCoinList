import React from 'react'
import { SearchResult } from '../utils/search'
import TokenCard from './TokenCard'

interface SearchResultsProps {
  results: SearchResult[]
  searchTerm: string
  isLoading?: boolean
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchTerm, isLoading }) => {
  if (isLoading) {
    return (
      <div className="search-results-container">
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching across all networks...</p>
        </div>
      </div>
    )
  }

  if (!searchTerm.trim()) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="no-search-results">
          <p>No tokens found matching "{searchTerm}"</p>
          <small>Try searching by token name, symbol, or contract address</small>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h3>Search Results for "{searchTerm}" ({results.length} found)</h3>
      </div>

      <div className="tokens-grid">
        {results.map((result, index) => (
          <div key={`${result.networkChainId}-${result.token.address}-${index}`} className="search-token-wrapper">
            <TokenCard
              token={result.token}
              blockExplorerUrl={result.blockExplorerUrl}
              networkName={result.networkName}
              showNetworkBadge={true}
            />
            {result.isFromRPC && (
              <div className="rpc-indicator">
                <svg className="rpc-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Live from blockchain</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults