import { NetworkConfig } from '../types'
import ethereum from './ethereum.json'
import polygon from './polygon.json'
import bsc from './bsc.json'
import arbitrum from './arbitrum.json'

export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: ethereum as NetworkConfig,
  polygon: polygon as NetworkConfig,
  bsc: bsc as NetworkConfig,
  arbitrum: arbitrum as NetworkConfig
}

export const getNetworkByChainId = (chainId: string): NetworkConfig | undefined => {
  return Object.values(NETWORKS).find(network => network.chainId === chainId)
}

export const getAllNetworks = (): NetworkConfig[] => {
  return Object.values(NETWORKS)
}