import genRandomBytes from "./utils/random-bytes.js";
import Session from "#src/models/Session.js";
import User from "#src/models/User.js";
import password from "#src/infra/security/password.js";
import { NotFoundError } from "#src/infra/errors.js";

const TOKEN_EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 15 * 1000; // 15 days

async function createSession(userObject) {
  const validUser = await User.getByEmail(userObject.email);

  if (!validUser) {
    throw new NotFoundError(
      `The value ${userObject.email} was not found in database`,
    );
  }

  await validatePassword(userObject.password, validUser.password);

  const expiresAt = defineExpirationTime();

  const token = genRandomBytes(48);

  return await Session.create(token, expiresAt, validUser.id);

  async function validatePassword(plainPassword, hashedPassword) {
    const result = await password.compare(plainPassword, hashedPassword);

    if (!result) {
      throw Error("InvalidCredentialError"); // TODO implement error handling
    }
  }
}

async function deleteSession(token) {
  await Session.deleteSession(token);
}

function defineExpirationTime() {
  return new Date(Date.now() + TOKEN_EXPIRATION_IN_MILLISECONDS);
}

const sessionUseCase = {
  createSession,
  defineExpirationTime,
  deleteSession,
  TOKEN_EXPIRATION_IN_MILLISECONDS,
};

export default sessionUseCase;
