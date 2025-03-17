import express from "express"
import cors from "cors"
import route from "./router.ts"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.get("/", async (_req, res) => {
  res.send("hell")
})

app.use(route)

app.listen("4840", async () => {
  console.log("running")
})
