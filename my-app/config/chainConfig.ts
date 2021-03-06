import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const CHAIN_CONFIG = {
  mainnet: {
    displayName: "Ethereum Mainnet",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: `https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c`,
    blockExplorer: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
  } as CustomChainConfig,
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget:
        "https://polygon-mumbai.infura.io/v3/7c0e52f11cb8492c94804f28d8a0ee7f",
    blockExplorer: "https://mumbai-explorer.matic.today",
    chainId: "0x13881",
    displayName: "Polygon Mumbai Testnet",
    ticker: "matic",
    tickerName: "matic",

  } as CustomChainConfig,
  rinkeby: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget:
        "https://rinkeby.infura.io/v3/7c0e52f11cb8492c94804f28d8a0ee7f",
    blockExplorer: "https://rinkeby.etherscan.io",
    chainId: "4",
    displayName: "Rinkeby Testnet",
    ticker: "ETH",
    tickerName: "ETH",
  } as CustomChainConfig,
} as const;

export type CHAIN_CONFIG_TYPE = keyof typeof CHAIN_CONFIG;
