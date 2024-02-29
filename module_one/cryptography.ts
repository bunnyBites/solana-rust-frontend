import { Keypair } from '@solana/web3.js';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

const runCryptographyFn = () => {
    // const keypair = Keypair.generate();

    const printkeypairDetails = (providedKeypair: Keypair) => {
        console.log("public key", providedKeypair.publicKey.toBase58());
        console.log("secret key", providedKeypair.secretKey);
    }

    let keypair  = getKeypairFromEnvironment("SECRET_KEY");
    printkeypairDetails(keypair);
};

export default runCryptographyFn;