import jwt from "jsonwebtoken";

export interface JwtPayload {
  _id: string;
  role: string;
}
export interface JwtToken {
  id: string;
  role: string;
}

export function signAccessToken(user: JwtPayload) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" },
  );
}

export function signRefreshToken(user: JwtPayload) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.REFRESH_SECRET!,
    { expiresIn: "15d" },
  );
}

export function verifyAccess(token: string) {
  return jwt.verify(token, process.env.ACCESS_SECRET!) as JwtToken;
}

export function verifyRefresh(token: string): JwtToken {
  return jwt.verify(token, process.env.REFRESH_SECRET!) as JwtToken;
}

export function generateTokens(_id: string, role: string) {
  const jwtPayload = { _id, role };
  const accessToken = signAccessToken(jwtPayload);
  const refreshToken = signRefreshToken(jwtPayload);
  return { accessToken, refreshToken };
}
