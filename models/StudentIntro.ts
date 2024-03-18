import * as borsh from "@coral-xyz/borsh";

export interface StudentVO {
  name: string;
  message: string;
}

const borschInstructionSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.str("name"),
  borsh.str("message"),
]);

const borshAccountSchema = borsh.struct([
    borsh.bool('initialized'),
    borsh.str('name'),
    borsh.str('message'),
])

export class StudentHelper {
  public static prepareStudentBuffer(student: StudentVO): Buffer {
    const buffer = Buffer.alloc(1000);

    borschInstructionSchema.encode({ ...student, variant: 0 }, buffer);

    return buffer.slice(0, borschInstructionSchema.getSpan(buffer));
  }

  public static deserializeStudentBuffer(
    studentInfo?: Buffer
  ): StudentVO | null {
    if (!studentInfo) return null;

    try {
      const { name, message } = borshAccountSchema.decode(studentInfo);
      return { name, message };
    } catch (e) {
      console.log("Deserialization error", e);
      return null;
    }
  }
}

