import { FC, useEffect, useState } from "react";
import { studentMock } from "../constants/Student.const";
import { StudentVO } from "../models/StudentIntro";
import { Card } from "./Card";

export const StudentIntroList: FC = () => {
  const [studentIntros, setStudentIntros] = useState<StudentVO[]>([]);

  useEffect(() => {
    setStudentIntros(studentMock);
  }, []);

  return (
    <div>
      {studentIntros.map((studentIntro, i) => (
        <Card key={i} studentIntro={studentIntro} />
      ))}
    </div>
  );
};
