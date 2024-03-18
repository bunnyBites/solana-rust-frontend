import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { MovieHelper, MovieVO } from "../models/Movie";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export class MovieService {
  public static o = new MovieService();
  public static accounts: Array<web3.PublicKey> = [];

  // fetch all accounts created by the program id without its data
  // store only the public keys for the fetched accounts
  public async prefetchMovies(connection: web3.Connection, search: string) {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: {offset: 2, length: 18 },
        filters: (!search ? [] : [
            {
                memcmp: {
                    bytes: bs58.encode(Buffer.from(search)),
                    offset: 6,
                }
            }
        ]),
      }
    );

    MovieService.accounts = accounts
      .toSorted((a, b) => {
        const lengthA = a.account.data.readUInt32LE(0);
        const lengthB = b.account.data.readUInt32LE(0);

        const dataA = a.account.data.slice(4, 4 + lengthA);
        const dataB = b.account.data.slice(4, 4 + lengthB);

        return dataA.compare(dataB);
      }).map((account) => account.pubkey);
  }

  public async fetchPage(
    connection: web3.Connection,
    page: number,
    pageSize: number,
    search: string,
    reload: boolean,
  ): Promise<Array<MovieVO>> {
    if (!MovieService.accounts.length || reload) {
      await this.prefetchMovies(connection, search);
    }

    const preparedPaginationPubKeys = MovieService.accounts.slice(
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
