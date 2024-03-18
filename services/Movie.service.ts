import * as web3 from "@solana/web3.js";
import { MovieHelper, MovieVO } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export class MovieService {
  public static o = new MovieService();
  private accounts: Array<web3.PublicKey> = [];

  // fetch all accounts created by the program id without its data
  // store only the public keys for the fetched accounts
  public async prefetchMovies(connection: web3.Connection) {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: 0, length: 0 },
      }
    );

    this.accounts = accounts.map((account) => account.pubkey);
  }

  public async fetchPage(
    connection: web3.Connection,
    page: number,
    pageSize: number
  ): Promise<Array<MovieVO>> {
    if (!this.accounts.length) {
      await this.prefetchMovies(connection);
    }

    const preparedPaginationPubKeys = this.accounts.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    if (!preparedPaginationPubKeys.length) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      preparedPaginationPubKeys
    );

    const movies = accounts.reduce((accumulator: Array<MovieVO>, account) => {
      const deserializedMovie = MovieHelper.deserializeMovie(account?.data);

      if (!deserializedMovie) {
        return accumulator;
      }

      return [...accumulator, deserializedMovie];
    }, []);

    console.log(movies);

    return movies;
  }
}
