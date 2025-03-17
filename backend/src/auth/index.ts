import * as jwt from "jsonwebtoken"
import { Router, type Request } from "express"
import { z } from "zod"
import { prisma } from "../config"
import { generateRefreshToken, generateAccessToken } from "./jwt"

const authRoute = Router()

const RegisterSchema = z.object({
  userName: z.string({ required_error: "Name is required" }).trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email body"),
  password: z
    .string({ required_error: "password is required" })
    .min(6, "Password length is less than 6"),
})
const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email body"),
  password: z.string({ required_error: "password is required" }),
})

authRoute.post("/signup", async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(422).json(parsed.error)
      return
    }
    const { userName, email, password } = parsed.data
    const existingUser = await emailExists(email)
    if (existingUser != null) {
      res.status(403).json({ payload: `${email} already exists` })
      console.log(existingUser)
      return
    }
    const hashedPass = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    })
    const refreshToken = generateRefreshToken(email)

    const user = await prisma.users.create({
      data: {
        email,
        name: userName,
        password: hashedPass,
        refreshToken: refreshToken,
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    })
    console.log("code was here")
    const accessToken = generateAccessToken(user)
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .status(200)
      .json({ accessToken })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
})

authRoute.post("/login", async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(403).json(parsed.error)
      return
    }
    const { email, password } = parsed.data
    const user = await emailExists(email)
    if (!user) {
      res.status(403).json({ payload: "Invalid email" })
      return
    }
    const matched = await Bun.password.verify(password, user.password)
    if (!matched) {
      res.status(403).json({ payload: "Invalid password" })
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.email)
    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    })
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .status(200)
      .json({ accessToken })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

authRoute.get("/access-token", async (req: Request, res) => {
  try {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies?.refreshToken) {
      res
        .status(403)
        .json({ message: "Refresh Token not available in cookies" })
      return
    }
    const user = await prisma.users.findFirst({
      where: { email: req.user?.email },
    })
    if (!user || user?.refreshToken != cookies.refreshToken) {
      res.status(403).json({ message: "Invalid refresh Token" })
      return
    }

    jwt.verify(cookies.refreshToken, Bun.env.REFRESH_TOKEN_SECRET!)
    const accessToken = generateAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

async function emailExists(email: string) {
  const user = await prisma.users.findUnique({ where: { email } })
  return user
}
export default authRoute
