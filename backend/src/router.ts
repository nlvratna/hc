import { Router } from "express"
import authRoute from "./auth"
import { verfiyJwt } from "./auth/jwt"
import botRouter from "./ai/index.ts"
import healthRecordRoute from "./healthrecord/index.ts"
const route = Router()
  .use("/auth", authRoute)
  .use("/health", verfiyJwt, botRouter)
  .use("/health-record", verfiyJwt, healthRecordRoute)
export default route
