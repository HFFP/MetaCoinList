import { NetworkConfig } from '../types'
import ethereum from './ethereum.json'
import polygon from './polygon.json'
import bsc from './bsc.json'
import arbitrum from './arbitrum.json'
import plasma from './plasma.json'
import unichain from './unichain.json'
import linea from './linea.json'

export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: ethereum as NetworkConfig,
  polygon: polygon as NetworkConfig,
  bsc: bsc as NetworkConfig,
  arbitrum: arbitrum as NetworkConfig,
  plasma: plasma as NetworkConfig,
  unichain: unichain as NetworkConfig,
  linea: linea as NetworkConfig
}

// Donation configuration
export const DONATION_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getNetworkByChainId = (chainId: string): NetworkConfig | undefined => {
  return Object.values(NETWORKS).find(network => network.chainId === chainId)
}

export const getAllNetworks = (): NetworkConfig[] => {
  return Object.values(NETWORKS)
}