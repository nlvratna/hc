import { Router, type Request } from "express"
import { prisma } from "../../prisma"
import type { medication } from "@prisma/client"

const healthRecordRoute = Router()

//basic crud
healthRecordRoute.get("/health-record", async (req, res) => {
  try {
    const id = req.user?.id
    if (!id) {
      res.status(400).json({ error: "User Id is not found" })
      return
    }
    const heatlhRecord = await prisma.healthRecord.findUnique({
      where: { userId: id },
    })

    res.json({ heatlhRecord })
  } catch (err) {
    res.status(500).json({ err })
  }
})

type RequestBody = {
  age: number
  gender: string
  familyHistory: string[]
  Medication: medicationData[]
}
type medicationData = {
  name: string
  reportedAt: Date
  prescription: string
}

healthRecordRoute.post(
  "/add-health-record",
  async (req: Request<{}, {}, RequestBody>, res) => {
    try {
      const { age, gender, familyHistory, Medication } = req.body
      const id = req.user?.id as number
      if (!id || !req.body) {
        res.status(400).json({ err: "missing required data" })
      }

      const healthRecord = await prisma.healthRecord.create({
        data: {
          age,
          gender,
          familyHistory,
          symptoms: { create: Medication },
          userId: id,
        },
      })
      res.json({ healthRecord })
    } catch (err) {
      res.status(500).json({ err })
    }
  },
)

// chane primary details  age family History gender
healthRecordRoute.patch("/update-primary-health-record", async (req, res) => {})

// id - medication id
// change medication details
healthRecordRoute.patch("/change-medication-data/:id", async (req, res) => {})

// add new medical record
healtRecord.post("/add-medical-data", async (req, res) => {})

//TODO : add delete route
