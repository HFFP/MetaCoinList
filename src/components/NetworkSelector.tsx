import React, { useState } from 'react'
import { NetworkConfig } from '../types'
import { getAllNetworks } from '../configs'
import { switchToNetwork } from '../utils/metamask'

interface NetworkSelectorProps {
  currentNetwork: NetworkConfig | null
  onNetworkChange: (network: NetworkConfig) => void
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ currentNetwork, onNetworkChange }) => {
  const [isLoading, setIsLoading] = useState(false)
  const networks = getAllNetworks()

  const handleNetworkSwitch = async (network: NetworkConfig) => {
    setIsLoading(true)
    try {
      await switchToNetwork(network)
      onNetworkChange(network)
    } catch (error: any) {
      console.error('Failed to switch network:', error)
      alert('Failed to switch network: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="network-selector">
      <h3>Select Network</h3>
      <div className="network-buttons">
        {networks.map((network) => (
          <button
            key={network.chainId}
            className={`network-button ${currentNetwork?.chainId === network.chainId ? 'active' : ''}`}
            onClick={() => handleNetworkSwitch(network)}
            disabled={isLoading}
          >
            {network.chainName}
          </button>
        ))}
      </div>
      {isLoading && <p>Switching network...</p>}
    </div>
  )
}

export default NetworkSelector