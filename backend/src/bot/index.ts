import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

const prompt = "what is the date today"

const result = await model.generateContent(prompt)

console.log(result.response.text())
