import { readFileSync } from "fs";
import { join } from "path";

export function readImageToUint8ArraySync(imagePath: string): Uint8Array {
  const filePath = join(__dirname, imagePath);
  const buffer = readFileSync(filePath);
  return new Uint8Array(buffer);
}
