import * as borsh from "@coral-xyz/borsh";

export interface MovieVO {
  title: string;
  rating: number;
  description: string;
}

export const borshInstructionSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.str("title"),
  borsh.u8("rating"),
  borsh.str("description"),
]);

export class MovieHelper {
  public static serializeMovie(movieInfo: MovieVO): Buffer {
    const buffer = Buffer.alloc(1000);

    borshInstructionSchema.encode({ ...movieInfo, variant: 0 }, buffer);

    return buffer.slice(0, borshInstructionSchema.getSpan(buffer));
  }

  public static deserializeMovie(movieBuffer: Buffer): MovieVO | null {
    if (!movieBuffer) return null;

    console.log(movieBuffer);
    try {
      const { rating, description, title } =
        borshInstructionSchema.decode(movieBuffer);

      return { rating, description, title };
    } catch (error) {
      console.log("Deserialization error:", error);

      return null;
    }
  }
}
