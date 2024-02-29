import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
    Connection, LAMPORTS_PER_SOL, PublicKey,
    SystemProgram, Transaction, clusterApiUrl,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

const transactionExampleFn = async () => {
    const transaction = new Transaction();

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(process.env.MY_PUBLIC_KEY ?? ""),
        toPubkey: new PublicKey(process.env.FRIEND_PUBLIC_KEY ?? ""),
        lamports: 1 * LAMPORTS_PER_SOL,
    });

    transaction.add(transferInstruction);

    const connection = new Connection(clusterApiUrl("devnet"));
    const signer = await sendAndConfirmTransaction(
        connection,
        transaction,
        [getKeypairFromEnvironment("SECRET_KEY")],
    );

    console.log("Transaction completed!!", signer);
}

export default transactionExampleFn;