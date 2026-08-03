import { sign } from "hono/jwt";

export const secretKey = process.env.JWT_SECRET || "";

export const generateToken = async (payload: any) => {
  return await sign(
    {
      ...payload,
      iss: "my-trusted-issuer",
      aud: "my-api",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    secretKey,
    "HS256",
  );
};
