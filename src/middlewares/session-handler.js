import { UnauthorizedError } from "#src/infra/errors.js";
import Session from "#src/models/Session.js";
import User from "#src/models/User.js";
import sessionUseCase from "#src/services/session-use-case.js";

export default async function validateSession(req, res, next) {
  if (!req.headers.authorization) {
    throw new UnauthorizedError();
  }
  const token = req.headers.authorization.split(" ")[1];

  const session = await Session.getByToken(token);
  const user = await User.getById(session.user_id);

  const expiresAt = sessionUseCase.defineExpirationTime();

  const renewedSession = await Session.refreshExpirationTime(token, expiresAt);
  req.session = {
    userId: session.user_id,
    username: user.username,
    email: user.email,
    session: {
      expires_at: renewedSession.expires_at,
      token: renewedSession.token,
    },
  };
  next();
}
