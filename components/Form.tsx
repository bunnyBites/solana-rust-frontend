import { FC, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { StudentHelper, StudentVO } from "../models/StudentIntro";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const STUDENT_INTRO_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export const Form: FC = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const studentIntro: StudentVO = {
      name,
      message,
    };

    handleTransactionSubmit(studentIntro);
  };

  const handleTransactionSubmit = async (studentIntro: StudentVO) => {
    if (!connection || !publicKey) return;

    const studentBuffer = StudentHelper.prepareStudentBuffer(studentIntro);
    const programId = new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID);

    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer()],
      programId
    );

    const tx = new web3.Transaction();

    const ix = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId,
      data: studentBuffer,
    });

    tx.add(ix);

    const transactionId = await sendTransaction(tx, connection);

    console.log(transactionId);
  };

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">What do we call you?</FormLabel>
          <Input
            id="name"
            color="gray.400"
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">
            What brings you to Solana, friend?
          </FormLabel>
          <Textarea
            id="message"
            color="gray.400"
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};
