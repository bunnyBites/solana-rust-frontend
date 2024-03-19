import web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { CreateTokenProgramService } from "../services/CreateTokenProgram.service";
import { initializeKeypair } from "./initializeKeypair";

const MINT_ACCOUNT = new web3.PublicKey(
  "CEdKsK4u3ujMeqvsc3SrzPCnwAKanz1D6jqc1efdS2qa"
);
const TOKEN_ACCOUNT = new web3.PublicKey(
  "6vciYDxvmZss5R8GuC7XhxEtJtoR3MkUrA4M2JmqzeSC"
);

export const testCreateTokenProgram = async () => {
  const connection = new web3.Connection("http://127.0.0.1:8899");
  const user = await initializeKeypair(connection);

  // create mint account
  //   createMintAccount(connection, user);

  //   create token account
  //   createTokenAccount(MINT_ACCOUNT, connection, user);

  // mint tokens
  mintToken(connection, user);
};

const createMintAccount = async (
  connection: web3.Connection,
  user: web3.Keypair
): Promise<web3.PublicKey> => {
  const tokenMint = await CreateTokenProgramService.o.createTokenMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  );

  const tokenMintInfo = await token.getMint(connection, tokenMint);
  console.log("Mint Info: ", tokenMintInfo);

  return tokenMint;
};

const createTokenAccount = async (
  mintAccount: web3.PublicKey,
  connection: web3.Connection,
  user: web3.Keypair
) => {
  const tokenAccount = await CreateTokenProgramService.o.createTokenAccount(
    connection,
    user,
    mintAccount,
    user.publicKey
  );

  console.log("Token Account created!!", tokenAccount);
};

const mintToken = async (connection: web3.Connection, user: web3.Keypair) => {
  const mintInfo = await token.getMint(connection, MINT_ACCOUNT);

  const mintedTokenTransactionSignature =
    await CreateTokenProgramService.o.mintAccount(
      connection,
      user,
      MINT_ACCOUNT,
      TOKEN_ACCOUNT,
      user.publicKey,
      100 * 10 ** mintInfo.decimals
    );

  console.log("Mint Transaction signature", mintedTokenTransactionSignature);
};
