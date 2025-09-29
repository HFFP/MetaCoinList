# Contributing to MetaCoinList

Thank you for your interest in contributing to MetaCoinList! 🎉

## 🚨 Important Notice

**We are currently ONLY accepting contributions related to blockchain network configurations.**

## 📋 What You Can Contribute

### ✅ Accepted Contributions:
- **New Network Configurations**: Add support for new blockchain networks
- **Network Updates**: Update RPC URLs, block explorers, or network metadata
- **Token Additions**: Add new tokens to existing networks
- **Token Updates**: Update token contract addresses or metadata

### ❌ Not Accepted:
- UI/UX changes
- Feature additions
- Code refactoring
- Styling modifications
- New functionality

## 🏗️ How to Contribute

### 1. Fork the Repository
```bash
git fork https://github.com/yourusername/MetaCoinList
```

### 2. Create a Feature Branch
```bash
git checkout -b add-network-[network-name]
# or
git checkout -b update-tokens-[network-name]
```

### 3. Make Your Changes
Only modify files in the `src/configs/` directory:
- `src/configs/[network].json` - Network configuration files
- `src/configs/index.ts` - Network registry (when adding new networks)

### 4. Verify Your Configuration
- Ensure JSON syntax is valid
- Verify all URLs are accessible
- Check contract addresses on block explorers
- Test RPC endpoints

### 5. Submit a Pull Request
Use our PR template and provide:
- Clear description of changes
- Verification sources
- Block explorer links for contract addresses

## 📁 File Structure

```
src/configs/
├── index.ts           # Network registry
├── ethereum.json      # Ethereum mainnet config
├── polygon.json       # Polygon mainnet config
├── arbitrum.json      # Arbitrum One config
├── bsc.json          # BSC mainnet config
├── plasma.json       # Plasma Network config
├── unichain.json     # Unichain config
└── linea.json        # Linea config
```

## 🔧 Configuration Format

### Network Configuration Template:
```json
{
  "chainId": "0x1",
  "chainName": "Network Name",
  "rpcUrls": ["https://rpc.network.com"],
  "blockExplorerUrls": ["https://explorer.network.com"],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "tokens": [
    {
      "address": "0x...",
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
    }
  ]
}
```

## ✅ Quality Guidelines

### Network Requirements:
- Mainnet only (no testnets)
- Reliable, official RPC endpoints
- Official block explorer
- Unique chain ID in hex format

### Token Requirements:
- Verified contract addresses
- Official token metadata
- Correct decimal places
- High-quality logos (preferably CoinGecko URLs)

### Preferred Tokens:
When adding a new network, prioritize these tokens if available:
- USDC (USD Coin)
- USDT (Tether USD)
- WBTC (Wrapped Bitcoin)
- WETH (Wrapped Ether)

## 📚 Resources

- [ChainList](https://chainlist.org/) - Network information
- [CoinGecko](https://www.coingecko.com/) - Token logos and metadata
- Network official documentation
- Block explorers for contract verification

## 🚫 Common Rejection Reasons

- Modifying files outside `src/configs/`
- Unverified contract addresses
- Unreliable RPC endpoints
- Missing verification sources
- Testnet configurations
- Invalid JSON syntax

## 💬 Questions?

If you have questions about network configurations or need help verifying information, please open an issue before submitting a PR.

## 🙏 Thank You

Your contributions help make MetaCoinList more comprehensive and useful for the community!

---

**Note**: This project is currently in a configuration-focused phase. We appreciate your understanding that broader code contributions are not being accepted at this time.