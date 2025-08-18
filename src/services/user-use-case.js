import User from "../models/User.js";
import Session from "../models/Session.js";
import password from "../infra/security/password.js";

async function getSelfUser(token) {
  const validSession = await Session.getByToken(token);
  return await User.getById(validSession.user_id);
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
