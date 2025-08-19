import User from "#src/models/User.js";
import Session from "#src/models/Session.js";
import password from "#src/infra/security/password.js";
import sessionUseCase from "./session-use-case.js";

async function getSelfUser(token) {
  const validSession = await Session.getByToken(token);
  const user = await User.getById(validSession.user_id);
  const expiresAt = sessionUseCase.defineExpirationTime();
  const renewedSession = await Session.refreshExpirationTime(token, expiresAt);
  return {
    username: user.username,
    email: user.email,
    session: {
      expires_at: renewedSession.expires_at,
      token: renewedSession.token,
    },
  };
}

async function createUser(payload) {
  const hashedPassword = await password.hash(payload.password);
  const createdUser = await User.create({
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
  });

  return {
    username: createdUser.username,
    email: createdUser.email,
  };
}

const userUseCase = { getSelfUser, createUser };

export default userUseCase;
