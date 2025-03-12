import { GoogleGenerativeAI } from "@google/generative-ai"
import { Router } from "express"
import { prisma } from "../config"

const botRouter = Router()
const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

const initialPrompt = `Your are a healtbot you are really good at giving remedies and medical advice to people with their current symptoms and using their medical history 
ask necessary questions one after the other  until you are comfortable at giving remedies and possible options If the medical history is not present proceed asking questions related`

botRouter.post("/remedies", async (req, res) => {
  console.log("code was here")
  const id = req.user?.id
  const symptoms = req.body
  console.log(symptoms)
  const healthRecord = await prisma.healthRecord.findFirst({
    where: {
      userId: id,
    },
    select: {
      symptoms: true,
    },
  })
  console.log(healthRecord)
  let result
  if (healthRecord) {
    const prompt = `${initialPrompt} this is the healtRecord of the user ${healthRecord} and their current symtoms ${symptoms}`
    result = await model.generateContent(prompt)
    console.log(result)
  } else {
    const prompt = `${initialPrompt} symtoms of the user ${symptoms} sorry user has no healthRecord`
    result = await model.generateContent(prompt)
  }

  res.json({ result })
})

export default botRouter
