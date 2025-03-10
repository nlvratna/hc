import { Router } from "express"
import authRoute from "./auth"
import { verfiyJwt } from "./auth/jwt"
import botRouter from "./bot"

const route = Router()
  .use("/auth", authRoute)
  .use("/health", verfiyJwt, botRouter)

export default route
