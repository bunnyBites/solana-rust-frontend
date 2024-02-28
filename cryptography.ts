import { Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

// const keypair = Keypair.generate();

dotenv.config();

const printkeypairDetails = (providedKeypair: Keypair) => {
    console.log("public key", providedKeypair.publicKey.toBase58());
    console.log("secret key", providedKeypair.secretKey);
}

let keypair  = getKeypairFromEnvironment("SECRET_KEY");
printkeypairDetails(keypair);