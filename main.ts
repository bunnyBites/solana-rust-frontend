import "dotenv/config";
import cryptographyExampleScript from "./module_one/cryptography";
import readSolanaExampleScript from "./module_one/readSolanaBlockchain";
import {
  transactionExampleFn,
  runCustomOnChainTransactionExample,
} from "./module_one/transaction";

const main = () => {
  // cryptographyExampleScript();
  // readSolanaExampleScript();
  // transactionExampleFn();
  runCustomOnChainTransactionExample();
};

main();
