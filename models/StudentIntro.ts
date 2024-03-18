import * as borsh from '@coral-xyz/borsh';

export interface StudentVO {
    name: string;
    message: string;
}

const borschInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("name"),
    borsh.str("message"),
]);

export class StudentHelper {
    public static prepareStudentBuffer(student: StudentVO) {
        const buffer = Buffer.alloc(1000);

        borschInstructionSchema.encode({ ...student, variant: 0 }, buffer);

        return buffer.slice(0, borschInstructionSchema.getSpan(buffer));
    }
}

// export class StudentIntro {
//     name: string;
//     message: string;

//     constructor(name: string, message: string) {
//         this.name = name;
//         this.message = message;
//     }

//     static mocks: StudentIntro[] = [
//         new StudentIntro('Elizabeth Holmes', `Learning Solana so I can use it to build sick NFT projects.`),
//         new StudentIntro('Jack Nicholson', `I want to overhaul the world's financial system. Lower friction payments/transfer, lower fees, faster payouts, better collateralization for loans, etc.`),
//         new StudentIntro('Terminator', `i'm basically here to protect`),
//     ]
// }