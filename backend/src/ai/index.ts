import { GoogleGenerativeAI } from "@google/generative-ai"
import { Router } from "express"
import { prisma } from "../config"

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

botRouter.post("/remedies", async (req, res) => {
  const id = req.user?.id
  const symptoms = req.body.symptoms
  console.log(symptoms)

  try {
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
      // seperate fucntion?
      if (content.length === 0) {
        const prompt = `  My health Record ${healthRecord} and my  symptoms  are  ${symptoms}`
        const newContent: Content = {
          role: ROLE.USER,
          parts: [{ text: prompt }],
        }
        content.push(newContent)
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
      content.push({
        role: ROLE.MODEL,
        parts: [{ text: result.response.text() }],
      })
      console.log(result.response.text())
    } else {
      console.log("code was here")
      if (content.length === 0) {
        const prompt = `My symptoms are ${symptoms} and sorry I don't have any healthRecord`
        const newContent: Content = {
          role: ROLE.USER,
          parts: [{ text: prompt }],
        }
        content.push(newContent)
        console.log(content[0])
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
      console.log(result.response.text())
    }
    content.push({
      role: ROLE.MODEL,
      parts: [{ text: result.response.text() }],
    })
    res.json({ payload: result.response.text() })
  } catch (err) {
    console.log(err)
    res.json({ err })
  }
})

enum ROLE {
  USER = "user",
  MODEL = "model",
}

export default botRouter
