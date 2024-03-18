import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { StudentHelper, StudentVO } from "../models/StudentIntro";

const STUDENT_INTRO_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export class StudentService {
  public static readonly o = new StudentService();
  public static studentPubkeys: Array<web3.PublicKey> = [];

  public async fetchStudentByPage(
    connection: web3.Connection,
    page: number,
    pageCount: number,
    search: string,
    isReload: boolean
  ): Promise<Array<StudentVO>> {
    if (!StudentService.studentPubkeys.length || isReload) {
      StudentService.o.prefetchStudenInfo(connection, search);
    }

    const preparedStudentPubkeys = StudentService.studentPubkeys.slice(
      (page - 1) * pageCount,
      page * pageCount
    );

    if (!preparedStudentPubkeys.length) return [];

    const fetchedAccounts = await connection.getMultipleAccountsInfo(
      preparedStudentPubkeys
    );

    const studentInfo = fetchedAccounts.reduce(
      (accum: Array<StudentVO>, account) => {
        const deserializedStudent = StudentHelper.deserializeStudentBuffer(
          account?.data
        );

        if (!deserializedStudent) {
          return accum;
        }

        return [...accum, deserializedStudent];
      },
      []
    );

    return studentInfo;
  }

  private async prefetchStudenInfo(
    connection: web3.Connection,
    search: string
  ) {
    const studentAccounts = await connection.getProgramAccounts(
      new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID),
      {
        dataSlice: {
          offset: 1,
          length: 12,
        },
        filters: !search
          ? []
          : [
              {
                memcmp: {
                  offset: 5, // 1 + 4 (borsh pre 4 byte for data)
                  bytes: bs58.encode(Buffer.from(search)),
                },
              },
            ],
      }
    );

    StudentService.studentPubkeys = studentAccounts.map(
      (account) => account.pubkey
    );
  }
}
