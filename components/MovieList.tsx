import { FC, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Card } from "./Card";
import { MovieVO } from "../models/Movie";
import { MovieService } from "../services/Movie.service";
import { Center, HStack, Button, Spacer, Input } from "@chakra-ui/react";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Array<MovieVO | null>>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const { connection } = useConnection();

  useEffect(() => {
    MovieService.o
      .fetchPage(connection, page, 10, search, search === "")
      .then(setMovies);
  }, [page, search]);

  return (
    <div>
      <Center>
        <Input
          id="search"
          color="gray.400"
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search"
          w="97%"
          mt={2}
          mb={2}
        />
      </Center>
      {movies.filter(Boolean).map((movie) => {
        return <Card key={movie?.title} movie={movie} />;
      })}
      <Center>
        <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}

          <Spacer />

          {MovieService.accounts.length > page * 2 && (
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          )}
        </HStack>
      </Center>
    </div>
  );
};
