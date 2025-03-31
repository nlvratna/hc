import { Router, type Request, type Response } from "express"
import { prisma } from "../../prisma"
import { Prisma } from "@prisma/client"

const healthRecordRoute = Router()

type RequestBody = {
  age: Date
  gender: string
  familyHistory: string[]
  medication: MedicationData[]
}
type MedicationData = {
  name: string
  reportedAt: Date
  prescription: string
}

//basic crud
healthRecordRoute.get("/record", async (req, res) => {
  console.log("I had hit the route")
  try {
    const id = req.user?.id
    if (!id) {
      res.status(400).json({ error: "User Id is not found" })
      return
    }
    const healthRecord = await prisma.healthRecord.findUnique({
      where: { userId: id },
      include: { symptoms: true },
    })
    if (!healthRecord) {
      console.log("no healthRecord")
      res.status(404).json({ err: "No Health Record is found" })
      return
    }

    res.json({ healthRecord })
  } catch (err) {
    res.status(500).json({ err })
  }
})

healthRecordRoute.post(
  "/create",
  async (req: Request<{}, {}, RequestBody>, res) => {
    try {
      const { age, gender, familyHistory, medication } = req.body
      const id = req.user?.id as number
      if (!id || !req.body) {
        res.status(400).json({ err: "missing required data" })
      }
      console.log(req.body)
      const parsedAge = new Date(age)
      parsedAge.setHours(0, 0, 0, 0)
      const healthRecord = await prisma.healthRecord.create({
        data: {
          age: parsedAge,
          gender,
          familyHistory,
          symptoms: {
            createMany: {
              data: medication,
            },
          },
          userId: id,
        },
        include: {
          symptoms: true,
        },
      })

      res.status(201).json({ healthRecord })
    } catch (err) {
      console.log(err)
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(422).json({ err: "user HealthRecord already exists" })
        }
      } else {
        res.status(500).json({ err })
      }
    }
  },
)

// change primary details  age family History gender
healthRecordRoute.put("/update", async (req, res) => {
  try {
    console.log("update route")
    const id = req.user?.id

    const data = req.body
    console.log(data)
    if (!id) {
      res.status(400).json({ err: "user Id is not found" })
    }

    // use txn to update both healthRecord and medical Data
    // it is working
    const healthRecord = await prisma.healthRecord.update({
      where: { userId: id },
      data: {
        age: data.age,
        gender: data.gender,
        symptoms: {
          upsert: data.medication.map((med: any) => ({
            where: {
              name_healthRecordId: {
                name: med.name,
                healthRecordId: data.id,
              },
            },
            update: {
              name: med.name,
              prescription: med.prescription,
              reportedAt: med.reportedAt,
            },
            create: {
              name: med.name,
              prescription: med.prescription,
              reportedAt: med.reportedAt,
            },
          })),
        },
      },
    })
    res.json(healthRecord)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
})
// not using these requests
// id - medication id
// change medication details
// healthRecordRoute.patch("/change-medical-data/:id", async (req, res) => {
//   try {
//     const userId = req.user?.id
//     const id = req.params.id
//     if (!id || !userId) {
//       res.status(400).json({ err: "user Id is not found" })
//     }
//     const data = req.body
//     const medicaldata = await prisma.medication.update({
//       where: { id: parseInt(id), healthRecord: { userId: userId } },
//       data: data,
//     })
//     res.json(medicaldata)
//   } catch (err) {
//     res.status(500).json({ err })
//   }
// })
//
// // add new medical record
// // not using this route
// healthRecordRoute.post("/add-medical-data", async (req, res: Response) => {
//   try {
//     const userId = req.user?.id
//     const data = req.body
//     const medicalData = await prisma.medication.create({
//       data: {
//         name: data.name,
//         prescription: data.prescription,
//         reportedAt: data.reportedAt,
//         healthRecord: { connect: { userId: userId } },
//       },
//       include: { healthRecord: true },
//     })
//     res.json(medicalData)
//   } catch (err) {
//     console.log(err)
//     res.status(400).json({ err })
//   }
// })
//
// //id - medical data id to be deleted
// // don't use this route and just put the record instead
// healthRecordRoute.delete("/delete-medical-data/:id", async (req, res) => {
//   try {
//     const userId = req.user?.id
//     const medicalDataId = parseInt(req.params.id)
//     if (!userId || !medicalDataId) {
//       res
//         .status(403)
//         .json({ err: "required field is not found userId/medicalDataId" })
//     }
//     await prisma.medication.delete({
//       where: {
//         id: medicalDataId,
//         healthRecord: { userId: userId },
//       },
//     })
//     res.status(204)
//   } catch (err: any) {
//     res.status(500).json({ err: err })
//   }
// })
// //TODO : add delete route
//
export default healthRecordRoute
