import { GoogleGenerativeAI } from "@google/generative-ai"
import { Router } from "express"

const botRouter = Router()
const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

botRouter.get("/remedies", async (req, res) => {
  const prompt = "what is the date today"

  const result = await model.generateContent(prompt)

  console.log(result.response.text())
  res.json(result.response.text())
})

export default botRouter
