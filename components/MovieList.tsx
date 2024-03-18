import { FC, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { Card } from "./Card";
import { MovieHelper, MovieVO } from "../models/Movie";
import { MovieService } from "../services/Movie.service";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Array<MovieVO | null>>([]);
  const { connection } = useConnection();

  useEffect(() => {
    MovieService.o.fetchPage(connection, 1, 10).then(setMovies);
  }, []);

  return (
    <div>
      {movies.filter(Boolean).map((movie) => {
        return <Card key={movie?.title} movie={movie} />;
      })}
    </div>
  );
};
