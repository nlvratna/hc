import * as jwt from "jsonwebtoken"
import { type Request, type Response, type NextFunction } from "express"

export function generateAccessToken({
  id,
  email,
}: {
  id: number
  name: string
  email: string
}) {
  const accessToken = jwt.sign(
    {
      userInfo: { id: id, email: email },
    },
    Bun.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10min" },
  )
  return accessToken
}

export function generateRefreshToken(email: string) {
  const accessToken = jwt.sign(
    {
      userInfo: { email: email },
    },
    Bun.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" },
  )
  return accessToken
}

export async function verfiyJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeaders =
      req.headers.authorization || (req.headers.Authorization as string)
    if (!authHeaders || !authHeaders?.startsWith("Bearer ")) {
      res.status(401).json({ err: "Authorization failed" })
    }
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
  } catch (err: any) {
    res.status(500).json({ err: err.message })
  }
}
