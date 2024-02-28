import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();

console.log("public key", keypair.publicKey.toBase58());
console.log("secret key", keypair.secretKey);