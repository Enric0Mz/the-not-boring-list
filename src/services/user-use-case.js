import User from "../models/User.js";
import password from "../infra/security/password.js";

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

const userUseCase = { createUser };

export default userUseCase;
