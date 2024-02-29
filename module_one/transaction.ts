import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

// wallet can also be called keypair
const payerWallet = getKeypairFromEnvironment("SECRET_KEY");

const senderPubKey = new PublicKey(process.env.MY_PUBLIC_KEY ?? "");
const receiverPubKey = new PublicKey(process.env.FRIEND_PUBLIC_KEY ?? "");

export const transactionExampleFn = async () => {
  const transaction = new Transaction();

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: senderPubKey,
    toPubkey: receiverPubKey,
    lamports: 1 * LAMPORTS_PER_SOL,
  });

  transaction.add(transferInstruction);

  confirmTransaction(transaction);
};

const programId = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
const programDataId = new PublicKey(
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
);

export const runCustomOnChainTransactionExample = () => {
  const transaction = new Transaction();

  const instruction = new TransactionInstruction({
    keys: [
      {
        isSigner: false,
        isWritable: true,
        pubkey: programDataId,
      },
    ],
    programId,
  });

  transaction.add(instruction);

  const transferInstruction = new TransactionInstruction({
    keys: [
      {
        pubkey: senderPubKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: receiverPubKey,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: SystemProgram.programId,
    data: Buffer.alloc(2, LAMPORTS_PER_SOL),
  });

  transaction.add(transferInstruction);

  confirmTransaction(transaction);
};

const confirmTransaction = (transaction: Transaction) => {
  sendAndConfirmTransaction(connection, transaction, [payerWallet]).then(
    (signer) => {
      console.log("Transaction signed successfully", signer);
    }
  );
};
