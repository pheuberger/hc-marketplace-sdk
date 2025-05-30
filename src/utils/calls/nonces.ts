import { Contract, Overrides, BigNumberish, Provider, Signer } from "ethers";
import { HypercertExchange, HypercertExchangeAbi as abi } from "@hypercerts-org/contracts";
import { ContractMethods } from "../../types";

export const viewUserBidAskNonces = async (
  signerOrProvider: Provider | Signer,
  address: string,
  account: string,
  overrides?: Overrides
): Promise<{ bidNonce: bigint; askNonce: bigint }> => {
  const contract = new Contract(address, abi).connect(signerOrProvider) as HypercertExchange;
  const nonces = await contract.userBidAskNonces(account, { ...overrides });
  return { bidNonce: nonces[0], askNonce: nonces[1] };
};

export const cancelOrderNonces = (
  signer: Signer,
  address: string,
  nonces: BigNumberish[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as HypercertExchange;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.cancelOrderNonces.send(nonces, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.cancelOrderNonces.estimateGas(nonces, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.cancelOrderNonces.staticCall(nonces, { ...overrides, ...additionalOverrides }),
  };
};

export const incrementBidAskNonces = (
  signer: Signer,
  address: string,
  bid: boolean,
  ask: boolean,
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as HypercertExchange;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.incrementBidAskNonces.send(bid, ask, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.incrementBidAskNonces.estimateGas(bid, ask, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.incrementBidAskNonces.staticCall(bid, ask, { ...overrides, ...additionalOverrides }),
  };
};
