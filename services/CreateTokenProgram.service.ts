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
}
