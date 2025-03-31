import { GoogleGenerativeAI } from "@google/generative-ai"
import { Router } from "express"
import { prisma } from "../../prisma/index.ts"
const botRouter = Router()
const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `Your are a healtbot you are really good at giving remedies and medical advice 
                       to people with their current symptoms and using their medical history
                        ask necessary questions one after the other  until you are comfortable at giving remedies and possible options 
                            If the medical history is not present proceed asking questions related
`,
})

// const initialPrompt = ` ask necessary questions one after the other  until you are comfortable at giving remedies and possible options
//                         If the medical history is not present proceed asking questions related`

type Content = {
  role: ROLE
  parts: TextPart[]
}
interface TextPart {
  text: string
}
// database is the better option but workd for now
const content: Content[] = []

//test change
botRouter.post("/remedies", async (req, res) => {
  try {
    const id = req.user?.id
    const symptoms = req.body.symptoms
    if (!id || !symptoms) {
      res.status(400).json({ error: "required data is not present" })
    }
    const healthRecord = await prisma.healthRecord.findFirst({
      where: {
        userId: id,
      },
      select: {
        symptoms: {
          select: {
            id: false,
            name: true,
            prescription: true,
            reportedAt: true,
          },
        },
        id: false,
        age: true,
        gender: true,
      },
    })
    console.log(healthRecord)
    let result
    if (content.length === 0) {
      if (healthRecord) {
        const prompt = `  My health Record ${JSON.stringify(healthRecord)} and my  symptoms  are  ${symptoms}`
        const newContent: Content = {
          role: ROLE.USER,
          parts: [{ text: prompt }],
        }
        content.push(newContent)
      } else {
        const prompt = `My symptoms are ${symptoms} and sorry I don't have any healthRecord`
        const newContent: Content = {
          role: ROLE.USER,
          parts: [{ text: prompt }],
        }
        content.push(newContent)
      }
    } else {
      content.push({ role: ROLE.USER, parts: [{ text: symptoms }] })
    }

    result = await model.generateContent({
      contents: content,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.1,
      },
    })
    const response = result.response.text()
    content.push({
      role: ROLE.MODEL,
      parts: [{ text: response }],
    })

    res.json({ response })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
})

enum ROLE {
  USER = "user",
  MODEL = "model",
}

export default botRouter
