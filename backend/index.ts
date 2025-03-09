import express from "express";
import cors from "cors";
import { usersTable } from "./db/schema";
import { hashSync } from "bcrypt";
import { db } from "./db/schema";
import { eq } from "drizzle-orm";
const app = express();

app.use(express.json());
app.use(cors());

async function seed() {
  const users: Array<typeof usersTable.$inferInsert> = [
    {
      name: "ratna",
      password: hashSync("ratna123", 12),
      email: "ratnachowdary@gmail.com",
    },
    {
      name: "akshay",
      email: "a@12gmail.com",
      password: hashSync("ak123", 12),
    },
  ];
  await db.insert(usersTable).values(users);
}

app.use("/", async (req, res) => {
  res.json({ message: "hello" });
});

app.use("/seed", async (req, res) => {
  await seed();
});

app.listen("4840", async () => {
  console.log("running");
});
