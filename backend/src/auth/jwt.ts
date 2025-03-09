import * as jwt from "jsonwebtoken"
import { type Users } from "@prisma/client"
import { type Request, type Response, type NextFunction } from "express"

export function generateAccessToken(user: Users) {
  const accessToken = jwt.sign(
    {
      userInfo: { id: user.id, email: user.email },
    },
    Bun.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "5min" },
  )
  return accessToken
}

export function generateRefreshToken(email: string) {
  const accessToken = jwt.sign(
    {
      userInfo: { email: email },
    },
    Bun.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "1d" },
  )
  return accessToken
}

export async function verfiyJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeaders = req.headers.authorization || req.headers.Authorization
  //@ts-ignore
  if (!authHeaders || !authHeaders?.startsWith("Bearer ")) {
    res.status(401).json({ payload: "Authorization failed" })
  }
  //@ts-ignore
  const token = authHeaders.split(" ")[1]
  const payload = jwt.verify(
    token,
    Bun.env.ACCESS_TOKEN_SECRET!,
  ) as jwt.JwtPayload

  req.user = {
    id: payload.userInfo.id,
    email: payload.userInfo.email,
  }

  next()
}
