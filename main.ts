import "dotenv/config";
import { runCustomOnChainTransactionExample } from "./module_one/transaction";
import { testCreateTokenProgram } from "./module_two/createTokenProgram";

const main = () => {
  // cryptographyExampleScript();
  // readSolanaExampleScript();
  // transactionExampleFn();
  // runCustomOnChainTransactionExample();
  testCreateTokenProgram();
};

main();
