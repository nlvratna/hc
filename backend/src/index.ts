import express from "express"
import cors from "cors"
import { prisma } from "./config"
import route from "./auth"
import { generateRefreshToken } from "./auth/jwt"

const app = express()

app.use(express.json())
app.use(cors())

async function seed() {
  try {
    const users = [
      {
        name: "ratna",
        password: Bun.password.hashSync("ratna123"),
        email: "ratna@domain.com",
      },

      {
        name: "akshay",
        email: "ak@gmail.com",
        password: Bun.password.hashSync("akshay34"),
      },
    ]
    users.forEach((u) => {
      //@ts-ignore
      u.refreshToken = generateRefreshToken(u.email)
    })

    await prisma.users.createMany({
      data: users,
    })
  } catch (err) {
    console.log(err)
  }
}
app.get("/", async (req, res) => {
  res.send("hell")
})

app.get("/seed", async (req, res) => {
  await seed()
  res.send("seeding completed")
})

app.use(route)

app.listen("4840", async () => {
  console.log("running")
})
