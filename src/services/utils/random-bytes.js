import { randomBytes } from "crypto";

export default function genRandomBytes(bytes) {
  return randomBytes(bytes).toString("hex");
}
