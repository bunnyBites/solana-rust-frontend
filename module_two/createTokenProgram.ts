import web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { CreateTokenProgramService } from "../services/CreateTokenProgram.service";
import { initializeKeypair } from "./initializeKeypair";

export const testCreateTokenProgram = () => {
  // create mint account
  createMintAccount();
};

const createMintAccount = async () => {
  const connection = new web3.Connection("http://127.0.0.1:8899");
  const user = await initializeKeypair(connection);

  const tokenMint = await CreateTokenProgramService.o.createTokenMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  );

  const tokenMintInfo = await token.getMint(connection, tokenMint);
  console.log("Mint Info: ", tokenMintInfo);
};
