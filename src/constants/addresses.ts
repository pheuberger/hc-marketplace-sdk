import { getAddress } from "ethers";
import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

// Type for valid contract names
type ContractName = keyof (typeof deployments)[keyof typeof deployments];

function getRequiredAddress(chainId: number, contractName: ContractName): `0x${string}` {
  const chainIdStr = chainId.toString() as keyof typeof deployments;
  const deployment = deployments[chainIdStr];

  if (!deployment) {
    throw new Error(`Missing deployment for chain ${chainId}`);
  }

  const address = deployment[contractName];
  if (!address) {
    throw new Error(`Missing required address for ${contractName} on chain ${chainId}`);
  }

  return getAddress(address) as `0x${string}`;
}

// Helper function to create addresses for a network
const createNetworkAddresses = (chainId: number): Addresses => ({
  EXCHANGE_V2: getRequiredAddress(chainId, "HypercertExchange"),
  TRANSFER_MANAGER_V2: getRequiredAddress(chainId, "TransferManager"),
  ORDER_VALIDATOR_V2: getRequiredAddress(chainId, "OrderValidatorV2A"),
  MINTER: getRequiredAddress(chainId, "HypercertMinterUUPS"),
});

// Network chain IDs
const CHAIN_IDS = {
  // Testnets
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  ARBITRUM_SEPOLIA: 421614,
  // Mainnets
  OPTIMISM: 10,
  CELO: 42220,
  ARBITRUM: 42161,
} as const;

export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  // Testnets
  [ChainId.SEPOLIA]: createNetworkAddresses(CHAIN_IDS.SEPOLIA),
  [ChainId.HARDHAT]: createNetworkAddresses(CHAIN_IDS.SEPOLIA), // Using Sepolia for Hardhat
  [ChainId.BASE_SEPOLIA]: createNetworkAddresses(CHAIN_IDS.BASE_SEPOLIA),
  [ChainId.ARBITRUM_SEPOLIA]: createNetworkAddresses(CHAIN_IDS.ARBITRUM_SEPOLIA),

  // Production nets
  [ChainId.OPTIMISM]: createNetworkAddresses(CHAIN_IDS.OPTIMISM),
  [ChainId.CELO]: createNetworkAddresses(CHAIN_IDS.CELO),
  [ChainId.ARBITRUM]: createNetworkAddresses(CHAIN_IDS.ARBITRUM),
};
