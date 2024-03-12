import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const Home: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const onLoad = () => {
    if (!connection || !publicKey) return;

    // connection.onAccountChange(
    //   publicKey,
    //   (updatedAccountInfo) => {
    //     setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    //   },
    //   "confirmed"
    // );

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info!.lamports / LAMPORTS_PER_SOL);
    });
  };

  useEffect(onLoad, [connection, publicKey]);

  return (
    <>
      <WalletMultiButton />
      <p>Balance: {balance}</p>
    </>
  );
};
