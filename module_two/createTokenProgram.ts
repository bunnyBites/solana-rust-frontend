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
  // const mintAccount = await createMintAccount(connection, user);

  //   create token account
  // const tokenAccount = await createTokenAccount(mintAccount, connection, user);

  const mintInfo = await token.getMint(connection, MINT_ACCOUNT);

  // mint tokens
  // const _ = await mintToken(connection, user, mintInfo);

  // approve delegate account
  // const _delegateAccount = await approveDelegate(connection, user, mintInfo);

  // transfer tokens
  // transferTokens(connection, user, delegateAccount, mintInfo);

  // revoke delegate
  // revokeDelegate(connection, user);

  // burn tokens
  burnTokens(connection, user, mintInfo);
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
  return tokenAccount;
};

const mintToken = async (
  connection: web3.Connection,
  user: web3.Keypair,
  mintInfo: token.Mint,
) => {
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

const approveDelegate = async (
  connection: web3.Connection,
  user: web3.Keypair,
  mintInfo: token.Mint
) => {
  const delegateAccount = new web3.Keypair();

  const delegateTransactionSignature =
    await CreateTokenProgramService.o.approveDelegate(
      connection,
      user,
      TOKEN_ACCOUNT,
      delegateAccount.publicKey,
      user.publicKey,
      50 * 10 ** mintInfo.decimals
    );

  console.log("Delegate transaction signature: ", delegateTransactionSignature);
  return delegateAccount;
};

const transferTokens = async (
  connection: web3.Connection,
  user: web3.Keypair,
  delegate: web3.Keypair,
  mintInfo: token.Mint
) => {
  // create a receiver wallet
  const reciever = new web3.Keypair();

  // create a token account for the created receiver
  const recieverTokenAccount =
    await CreateTokenProgramService.o.createTokenAccount(
      connection,
      user,
      MINT_ACCOUNT,
      reciever.publicKey
    );

  // transfer token from the source to reciever using delegate account
  const transferTransactionSignature =
    await CreateTokenProgramService.o.tranferToken(
      connection,
      user,
      TOKEN_ACCOUNT,
      recieverTokenAccount.address,
      delegate,
      50 * 10 ** mintInfo.decimals
    );

  console.log("transfer transaction signature: ", transferTransactionSignature);
};

const revokeDelegate = async (
  connection: web3.Connection,
  user: web3.Keypair
) => {
  const revokeDelegateSignature =
    await CreateTokenProgramService.o.revokeDelegate(
      connection,
      user,
      TOKEN_ACCOUNT,
      user
    );

  console.log("revoke Delegate Signature: ", revokeDelegateSignature);
};

const burnTokens = async (
  connection: web3.Connection,
  user: web3.Keypair,
  mintInfo: token.Mint
) => {
  const burnTransactionSignature = await CreateTokenProgramService.o.burnToken(
    connection,
    user,
    TOKEN_ACCOUNT,
    mintInfo.address,
    user,
    10 * 10 ** mintInfo.decimals
  );

  console.log("burn Transaction Signature: ", burnTransactionSignature);
};
