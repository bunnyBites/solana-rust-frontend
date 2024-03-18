import { FC, useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { StudentHelper, StudentVO } from "../models/StudentIntro";
import { Card } from "./Card";
import { Center, Input, HStack, Button, Spacer } from "@chakra-ui/react";
import { StudentService } from "../services/Student.service";

const STUDENT_INTRO_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export const StudentIntroList: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [studentIntros, setStudentIntros] = useState<Array<StudentVO | null>>(
    []
  );
  const { connection } = useConnection();

  useEffect(() => {
    StudentService.o
      .fetchStudentByPage(connection, page, 10, search, search !== "")
      .then(setStudentIntros);
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
      {studentIntros?.map((studentIntro, i) => (
        <>{studentIntro && <Card key={i} studentIntro={studentIntro} />}</>
      ))}
      <Center>
        <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}

          <Spacer />

          {StudentService.studentPubkeys.length > page * 2 && (
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          )}
        </HStack>
      </Center>
    </div>
  );
};
