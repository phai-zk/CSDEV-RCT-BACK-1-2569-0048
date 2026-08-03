import { jwt } from 'hono/jwt';
import { secretKey } from '../services/jwt.js';

export const authMiddleware = jwt({
  secret: secretKey,
  alg: 'HS256',
  verification: {
    iss: 'my-trusted-issuer',
    aud: 'my-api',
  },
});
