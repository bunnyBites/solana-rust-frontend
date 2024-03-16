import { useState, FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from "@chakra-ui/react";
import { MovieHelper, MovieVO } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const Form: FC = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const movie: MovieVO = {
      description: message,
      title,
      rating,
    };

    handleTransactionSubmit(movie);
  };

  const handleTransactionSubmit = async (movie: MovieVO) => {
    // Check that publicKey exists to ensure that the user has connected their wallet.
    if (!connection || !publicKey) return;

    // Call serialize() on movie to get a buffer representing the instruction data.
    const serializedMovieBuffer = MovieHelper.serializeMovie(movie);

    // Create a new Transaction object.
    const tx = new web3.Transaction();

    // Get all of the accounts that the transaction will read or write.

    // Ge the PDA -> account where the data for movie is actually stored.
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey!.toBuffer(), Buffer.from(movie.title)],
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

    // Create a new Instruction object that includes all of these accounts in the keys argument, includes the buffer in the data argument, and includes the program’s public key in the programId argument.
    const ix = new web3.TransactionInstruction({
        keys: [
            {
                isSigner: true,
                isWritable: false,
                pubkey: publicKey,
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
            }
        ],
        programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
        data: serializedMovieBuffer
    });

    // Add the instruction from the last step to the transaction.
    tx.add(ix);

    // Call sendTransaction, passing in the assembled transaction.
    const txSignature = await sendTransaction(tx, connection);
    console.log(txSignature);

    console.log(JSON.stringify(movie));
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
          <FormLabel color="gray.200">Movie Title</FormLabel>
          <Input
            id="title"
            color="gray.400"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Add your review</FormLabel>
          <Textarea
            id="review"
            color="gray.400"
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Rating</FormLabel>
          <NumberInput
            max={5}
            min={1}
            onChange={(valueString) => setRating(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
            <NumberInputStepper color="gray.400">
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Submit Review
        </Button>
      </form>
    </Box>
  );
};
