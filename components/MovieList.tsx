import { FC, useEffect, useState } from "react";
import { movieMocks } from "../constants/Movie.const";
import { Card } from "./Card";
import { MovieVO } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Array<MovieVO>>([]);

  useEffect(() => {
    setMovies(movieMocks);
  }, []);

  return (
    <div>
      {movies.map((movie) => {
        return <Card key={movie.title} movie={movie} />;
      })}
    </div>
  );
};
