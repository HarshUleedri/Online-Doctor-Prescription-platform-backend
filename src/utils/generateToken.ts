import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY environment variable is not set");
  }
  const token = jwt.sign({ id }, secret, {
    expiresIn: "7d",
  });
  return token;
};
