import { Contract, Signer, Provider } from "ethers";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

import abiIERC721 from "../abis/IERC721.json";
import abiTransferManager from "../abis/TransferManager.json";
import { Addresses, ChainId } from "../types";

export class SafeTransactionBuilder {
  private readonly apiKit: SafeApiKit;

  constructor(
    private readonly provider: Provider,
    private readonly signer: Signer,
    private readonly chainId: ChainId,
    private readonly addresses: Addresses
  ) {
    this.apiKit = new SafeApiKit({
      chainId: BigInt(this.chainId),
    });
  }

  /**
   * Bundle approval operations into a single Safe transaction
   * @internal
   */
  public async bundleApprovals(safeAddress: string, collectionAddress: string): Promise<string> {
    const protocolKit = await Safe.init({
      provider: this.provider as any,
      signer: this.signer as any,
      safeAddress: safeAddress,
    });

    const transferManagerContract = new Contract(this.addresses.TRANSFER_MANAGER_V2, abiTransferManager);
    const erc721Contract = new Contract(collectionAddress, abiIERC721);

    const transactions = [
      {
        to: this.addresses.TRANSFER_MANAGER_V2,
        data: transferManagerContract.interface.encodeFunctionData("grantApprovals", [[this.addresses.EXCHANGE_V2]]),
        value: "0",
      },
      {
        to: collectionAddress,
        data: erc721Contract.interface.encodeFunctionData("setApprovalForAll", [
          this.addresses.TRANSFER_MANAGER_V2,
          true,
        ]),
        value: "0",
      },
    ];

    const safeTx = await protocolKit.createTransaction({
      transactions,
    });

    const safeTxHash = await protocolKit.getTransactionHash(safeTx);
    const senderSignature = await protocolKit.signHash(safeTxHash);

    await this.apiKit.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTx.data,
      safeTxHash,
      senderAddress: await this.signer.getAddress(),
      senderSignature: senderSignature.data,
    });

    return safeTxHash;
  }
}
