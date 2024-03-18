import { FC, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { StudentHelper, StudentVO } from "../models/StudentIntro";
import { Card } from "./Card";

const STUDENT_INTRO_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export const StudentIntroList: FC = () => {
  const [studentIntros, setStudentIntros] = useState<Array<StudentVO | null>>(
    []
  );
  const { connection } = useConnection();

  useEffect(() => {
    connection
      .getProgramAccounts(new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID))
      .then((accounts) => {
        const students = accounts?.map(({ account }) => {
          return StudentHelper.deserializeStudentBuffer(account.data);
        });

        setStudentIntros(students);
      });
  }, []);

  return (
    <div>
      {studentIntros?.map((studentIntro, i) => (
        <>{studentIntro && <Card key={i} studentIntro={studentIntro} />}</>
      ))}
    </div>
  );
};
