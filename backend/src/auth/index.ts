import * as jwt from "jsonwebtoken"
import { Router, type Request } from "express"
import { z } from "zod"
import { prisma } from "../../prisma/index.ts"
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
      res.status(403).json({ err: `${email} already exists` })
      console.log(existingUser)
      return
    }
    const hashedPass = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    })
    const refreshToken = generateRefreshToken(email)
    const hashRefresh = await Bun.password.hash(refreshToken)
    const user = await prisma.users.create({
      data: {
        email,
        name: userName,
        password: hashedPass,
        refreshToken: hashRefresh,
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    })
    const accessToken = generateAccessToken(user)
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: true,
        secure: true,
        path: "/",
      })
      .status(200)
      .json({ accessToken })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: err })
  }
})

//send the user details
authRoute.post("/login", async (req, res) => {
  console.log("someone hit this route")
  try {
    const parsed = LoginSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(403).json(parsed.error)
      return
    }
    const { email, password } = parsed.data
    const user = await emailExists(email)
    if (!user) {
      res.status(403).json({ err: "Invalid email" })
      return
    }
    const matched = await Bun.password.verify(password, user.password)
    if (!matched) {
      res.status(403).json({ err: "Invalid password" })
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.email)
    const hashRefresh = await Bun.password.hash(refreshToken)
    // include medical data exclude refresh token password
    const loggedUser = await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken: hashRefresh },
      select: {
        email: true,
        name: true,
        id: true,
      },
    })
    console.log(loggedUser)
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
      })
      .status(200)
      .json({ user: loggedUser, accessToken })
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
      res.status(403).json({ err: "Refresh Token not available in cookies" })
      return
    }
    const user = await prisma.users.findFirst({
      where: { id: req.user?.id },
    })
    if (!user) {
      res.status(403).json({ err: "user is not found" })
    }
    if (!user?.refreshToken) {
      res
        .json(302)
        .json({ err: "User doesn't have refresh token he should re-login" })
    }
    const isMatch = await Bun.password.verify(
      cookies.refreshToken,
      user?.refreshToken as string,
    )
    if (!isMatch) {
      res
        .status(403)
        .json({ err: "refresh token is accessed and cannot be used" })
    }
    jwt.verify(cookies.refreshToken, Bun.env.REFRESH_TOKEN_SECRET!)

    const accessToken = generateAccessToken(user!)
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
//TODO: add logout endpoint
export default authRoute
