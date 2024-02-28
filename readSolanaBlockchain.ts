import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';

let connection = new Connection(clusterApiUrl("devnet"));

// most addresses are public key in solana network
let address = new PublicKey("BSSCXA2vyVNPCLZeGtMyR5N4y98eMhqifsVdBJkaCKXL");

const displayBalance = async () => {
    let balance = await connection.getBalance(address);
    console.log("Balance for the account is:", balance / LAMPORTS_PER_SOL, "SOL");
}

displayBalance();