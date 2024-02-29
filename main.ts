import cryptographyExampleScript from './module_one/cryptography';
import readSolanaExampleScript from './module_one/readSolanaBlockchain';
import transactionExampleFn from './module_one/transaction';

const main = () => {
    cryptographyExampleScript();
    readSolanaExampleScript();
    transactionExampleFn();
}

main();