import web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

export class CreateTokenProgramService {
  public static readonly o = new CreateTokenProgramService();

  public async createTokenMint(
    connection: web3.Connection,
    payer: web3.Keypair,
    mintAuthority: web3.PublicKey,
    freezeAuthority: web3.PublicKey,
    decimals: number
  ): Promise<web3.PublicKey> {
    const tokenMint = await token.createMint(
      connection,
      payer,
      mintAuthority,
      freezeAuthority,
      decimals
    );

    console.log("Token mint account: ", tokenMint);

    return tokenMint;
  }

  public async createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey,
  ): Promise<token.Account> {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      owner,
    );

    return tokenAccount;
  }

  public async mintAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    destination: web3.PublicKey, // token account address
    mintAuthority: web3.PublicKey,
    amount: number, // tokens to mint
  ): Promise<string> {
    const mintTransactionSignature = await token.mintTo(
      connection,
      payer,
      mint,
      destination,
      mintAuthority,
      amount,
    );

    return mintTransactionSignature;
  }
}
