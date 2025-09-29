import { Token, NetworkConfig } from '../types'
import { getAllNetworks } from '../configs'

export interface SearchResult {
  token: Token
  networkName: string
  networkChainId: string
  isFromRPC?: boolean
  blockExplorerUrl?: string
}

// Check if input is a valid Ethereum address
export const isValidAddress = (input: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(input)
}

// Search tokens from configuration files
export const searchTokensFromConfig = (searchTerm: string): SearchResult[] => {
  const results: SearchResult[] = []
  const networks = getAllNetworks()

  const lowerSearchTerm = searchTerm.toLowerCase()

  networks.forEach(network => {
    network.tokens.forEach(token => {
      const matchesName = token.name.toLowerCase().includes(lowerSearchTerm)
      const matchesSymbol = token.symbol.toLowerCase().includes(lowerSearchTerm)
      const matchesAddress = token.address.toLowerCase().includes(lowerSearchTerm)

      if (matchesName || matchesSymbol || matchesAddress) {
        results.push({
          token,
          networkName: network.chainName,
          networkChainId: network.chainId,
          blockExplorerUrl: network.blockExplorerUrls?.[0]
        })
      }
    })
  })

  return results
}

// Query token info from RPC
export const queryTokenFromRPC = async (
  address: string,
  networkConfig: NetworkConfig
): Promise<Token | null> => {
  if (!isValidAddress(address)) {
    return null
  }

  try {
    // Get token symbol, name, and decimals from contract
    const rpcUrl = networkConfig.rpcUrls[0]

    // ERC-20 function signatures
    const symbolSig = '0x95d89b41' // symbol()
    const nameSig = '0x06fdde03'   // name()
    const decimalsSig = '0x313ce567' // decimals()

    const requests = [
      {
        method: 'eth_call',
        params: [{ to: address, data: symbolSig }, 'latest'],
        id: 1
      },
      {
        method: 'eth_call',
        params: [{ to: address, data: nameSig }, 'latest'],
        id: 2
      },
      {
        method: 'eth_call',
        params: [{ to: address, data: decimalsSig }, 'latest'],
        id: 3
      }
    ]

    const responses = await Promise.all(
      requests.map(request =>
        fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        }).then(res => res.json())
      )
    )

    // Parse responses
    const symbolResponse = responses[0]?.result
    const nameResponse = responses[1]?.result
    const decimalsResponse = responses[2]?.result

    if (!symbolResponse || !nameResponse || !decimalsResponse) {
      return null
    }

    // Decode hex responses
    const symbol = decodeHexString(symbolResponse)
    const name = decodeHexString(nameResponse)
    const decimals = parseInt(decimalsResponse, 16)

    if (!symbol || !name || isNaN(decimals)) {
      return null
    }

    return {
      address,
      symbol,
      name,
      decimals,
      logo: '' // No logo for RPC-queried tokens
    }
  } catch (error) {
    console.error('RPC query failed:', error)
    return null
  }
}

// Helper function to decode hex string
const decodeHexString = (hex: string): string => {
  if (!hex || hex === '0x') return ''

  try {
    // Remove 0x prefix
    const cleanHex = hex.slice(2)

    // Convert hex to bytes
    const bytes = []
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substr(i, 2), 16))
    }

    // Skip the first 32 bytes (offset) and next 32 bytes (length)
    // Then read the actual string data
    const lengthStart = 64
    const length = parseInt(cleanHex.substr(lengthStart, 64), 16)
    const dataStart = 128

    let result = ''
    for (let i = 0; i < length * 2; i += 2) {
      const charCode = parseInt(cleanHex.substr(dataStart + i, 2), 16)
      if (charCode > 0) {
        result += String.fromCharCode(charCode)
      }
    }

    return result.trim()
  } catch (error) {
    return ''
  }
}

// Search tokens from RPC across all networks
export const searchTokenFromAllRPCs = async (address: string): Promise<SearchResult[]> => {
  if (!isValidAddress(address)) {
    return []
  }

  const networks = getAllNetworks()
  const results: SearchResult[] = []

  // Query all networks in parallel
  const rpcPromises = networks.map(async network => {
    try {
      const token = await queryTokenFromRPC(address, network)
      if (token) {
        return {
          token,
          networkName: network.chainName,
          networkChainId: network.chainId,
          isFromRPC: true,
          blockExplorerUrl: network.blockExplorerUrls?.[0]
        }
      }
    } catch (error) {
      console.error(`RPC query failed for ${network.chainName}:`, error)
    }
    return null
  })

  const rpcResults = await Promise.all(rpcPromises)

  rpcResults.forEach(result => {
    if (result) {
      results.push(result)
    }
  })

  return results
}

// Main search function
export const searchTokens = async (searchTerm: string): Promise<SearchResult[]> => {
  if (!searchTerm.trim()) {
    return []
  }

  // First, search from configuration files
  const configResults = searchTokensFromConfig(searchTerm)

  // If input is an address, also search from RPC
  if (isValidAddress(searchTerm)) {
    const rpcResults = await searchTokenFromAllRPCs(searchTerm)

    // Combine results, prioritizing config results
    const allResults = [...configResults, ...rpcResults]

    // Remove duplicates (same address on same network)
    const uniqueResults = allResults.filter((result, index, array) => {
      return array.findIndex(r =>
        r.token.address.toLowerCase() === result.token.address.toLowerCase() &&
        r.networkChainId === result.networkChainId
      ) === index
    })

    return uniqueResults
  }

  return configResults
}