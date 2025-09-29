# MetaCoinList 🪙

A comprehensive multi-chain token manager for MetaMask that allows users to easily add cryptocurrency tokens across multiple blockchain networks.

## 🌟 Features

- **Multi-Chain Support**: Support for 7+ major blockchain networks
- **Smart Search**: Search tokens by name, symbol, or contract address
- **RPC Integration**: Real-time token data fetching from blockchain networks
- **One-Click Add**: Seamlessly add tokens to MetaMask wallet
- **Dark Theme**: Modern glassmorphism design with dark theme
- **Responsive Design**: Works on desktop and mobile devices

## 🌐 Supported Networks

| Network | Chain ID | Native Currency | Status |
|---------|----------|-----------------|---------|
| Ethereum | `0x1` | ETH | ✅ Active |
| Polygon | `0x89` | MATIC | ✅ Active |
| BSC (Binance Smart Chain) | `0x38` | BNB | ✅ Active |
| Arbitrum One | `0xa4b1` | ETH | ✅ Active |
| Unichain | `0x82` | ETH | ✅ Active |
| Linea | `0xe708` | ETH | ✅ Active |
| Plasma Network | `0x2611` | XPL | ✅ Active |

## 🪙 Core Tokens

Each network includes these essential tokens (when available):
- **USDC** - USD Coin
- **USDT** - Tether USD
- **WBTC** - Wrapped Bitcoin
- **WETH** - Wrapped Ether

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MetaCoinList.git

# Navigate to project directory
cd MetaCoinList

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Web3 Integration**: RainbowKit + wagmi
- **Styling**: CSS with Glassmorphism design
- **Blockchain Interaction**: Ethereum JSON-RPC

## 📁 Project Structure

```
MetaCoinList/
├── src/
│   ├── components/          # React components
│   ├── configs/            # Network configurations
│   │   ├── ethereum.json   # Ethereum network config
│   │   ├── polygon.json    # Polygon network config
│   │   ├── bsc.json        # BSC network config
│   │   ├── arbitrum.json   # Arbitrum network config
│   │   ├── unichain.json   # Unichain network config
│   │   ├── linea.json      # Linea network config
│   │   ├── plasma.json     # Plasma network config
│   │   └── index.ts        # Network registry
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── CONTRIBUTING.md         # Contribution guidelines
└── PULL_REQUEST_TEMPLATE.md # PR template
```

## 🔧 Configuration

Network configurations are stored in `src/configs/` as JSON files. Each network configuration includes:

```json
{
  "chainId": "0x1",
  "chainName": "Ethereum Mainnet",
  "rpcUrls": ["https://ethereum-rpc.publicnode.com"],
  "blockExplorerUrls": ["https://etherscan.io"],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "tokens": [
    {
      "address": "0xA0b86a33E6441C41F9c6B7f5a6E5F8a5e1e8e5a6",
      "symbol": "USDC",
      "name": "USD Coin",
      "decimals": 6,
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
    }
  ]
}
```

## 🎯 How It Works

1. **Network Selection**: Users can browse different blockchain networks
2. **Token Search**: Search for tokens by name, symbol, or contract address
3. **RPC Queries**: Real-time token data fetching from blockchain networks
4. **MetaMask Integration**: One-click token addition to MetaMask wallet
5. **Multi-Chain Support**: Seamless switching between different networks

## 🔍 Search Features

- **Text Search**: Find tokens by name or symbol
- **Address Search**: Lookup tokens by contract address
- **Multi-Chain RPC**: Automatically queries all networks for address-based searches
- **Duplicate Filtering**: Smart filtering to avoid duplicate results

## 🤝 Contributing

We welcome contributions! However, we are currently **only accepting contributions related to network configurations**.

### ✅ What We Accept:
- Adding new blockchain networks
- Updating network configurations (RPC URLs, explorers)
- Adding new tokens to existing networks
- Updating token contract addresses or metadata

### ❌ What We Don't Accept:
- UI/UX changes
- Feature modifications
- Code refactoring outside of configs

Please read our [Contributing Guidelines](CONTRIBUTING.md) and use our [PR Template](PULL_REQUEST_TEMPLATE.md) when submitting contributions.

## 🛡️ Security

- All token contracts are verified through official block explorers
- RPC endpoints use reliable public nodes or official providers
- No private keys or sensitive data are stored
- MetaMask integration follows best practices

## 🌟 Roadmap

- [ ] Support for more blockchain networks
- [ ] Token price integration
- [ ] Token portfolio tracking
- [ ] Custom token lists
- [ ] Mobile app version

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/MetaCoinList/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/MetaCoinList/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RainbowKit](https://rainbowkit.com/) for Web3 wallet integration
- [wagmi](https://wagmi.sh/) for Ethereum React hooks
- [Vite](https://vitejs.dev/) for fast development experience
- [CoinGecko](https://www.coingecko.com/) for token logos and metadata

## ⚠️ Disclaimer

This tool is for educational and convenience purposes. Always verify token contracts on official block explorers before adding them to your wallet. Use at your own risk.

---

Made with ❤️ for the DeFi community
