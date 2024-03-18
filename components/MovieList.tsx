import { FC, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { Card } from "./Card";
import { MovieHelper, MovieVO } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Array<MovieVO | null>>([]);
  const { connection } = useConnection();

  useEffect(() => {
    connection
      .getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID))
      .then((accounts) => {
        console.log(accounts);
        const movies: Array<MovieVO | null> = accounts
          .map(({ account }) => MovieHelper.deserializeMovie(account?.data));

        console.log(movies);

        setMovies(movies);
      });
  }, []);

  return (
    <div>
      {movies.filter(Boolean).map((movie) => {
        return <Card key={movie?.title} movie={movie} />;
      })}
    </div>
  );
};
