import { Router, type Request, type Response } from "express"
import { prisma } from "../../prisma"
import { Prisma } from "@prisma/client"

const healthRecordRoute = Router()

//basic crud
healthRecordRoute.get("/record", async (req, res) => {
  console.log("I had hit the route")
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
  age: Date
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
      console.log(err)
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if ((err.code = "P2002")) {
          res.status(422).json({ err: "user HealthRecord already exists" })
        }
      } else {
        res.status(500).json({ err })
      }
    }
  },
)

// change primary details  age family History gender
healthRecordRoute.patch("/update-primary-health-record", async (req, res) => {
  try {
    const id = req.user?.id

    const data = req.body
    if (!id) {
      res.status(400).json({ err: "user Id is not found" })
    }

    const healthRecord = await prisma.healthRecord.update({
      where: { userId: id },
      data: data,
    })
    res.json(healthRecord)
  } catch (err) {
    res.status(500).json({ err })
  }
})

// id - medication id
// change medication details
healthRecordRoute.patch("/change-medical-data/:id", async (req, res) => {
  try {
    const userId = req.user?.id
    const id = req.params.id
    if (!id || !userId) {
      res.status(400).json({ err: "user Id is not found" })
    }
    const data = req.body
    const medicaldata = await prisma.medication.update({
      where: { id: parseInt(id), healthRecord: { userId: userId } },
      data: data,
    })
    res.json(medicaldata)
  } catch (err) {
    res.status(500).json({ err })
  }
})

// add new medical record
healthRecordRoute.post("/add-medical-data", async (req, res: Response) => {
  try {
    const userId = req.user?.id
    const data = req.body
    const medicalData = await prisma.medication.create({
      data: {
        name: data.name,
        prescription: data.prescription,
        reportedAt: data.reportedAt,
        healthRecord: { connect: { userId: userId } },
      },
      include: { healthRecord: true },
    })
    res.json(medicalData)
  } catch (err) {
    console.log(err)
    res.status(400).json({ err })
  }
})

//TODO : add delete route

export default healthRecordRoute
