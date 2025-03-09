import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config";

const authRoute = Router();

const RegisterSchema = z.object({
  userName: z.string({ required_error: "Name is required" }).trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email body"),
  password: z
    .string({ required_error: "password is required" })
    .min(6, "Password length is less than 6"),
});
const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email body"),
  password: z.string({ required_error: "password is required" }),
});

authRoute.post("/signup", async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json(parsed.error);
      return;
    }
    const { userName, email, password } = parsed.data;
    if (!emailExists(email)) {
      res.status(409).json({ error: `${email} already exists` });
      return;
    }
    const hashedPass = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    });
    const user = await prisma.users.create({
      data: {
        email,
        name: userName,
        password: hashedPass,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(403).json(parsed.error);
      return;
    }
    const { email, password } = parsed.data;
    const user = await emailExists(email);
    if (!user) {
      res.status(403).json({ payload: "Invalid email" });
      return;
    }
    const matched = await Bun.password.verify(password, user.password);
    if (!matched) {
      res.status(403).json({ payload: "Invalid password" });
    }
    res.status(200).json({ payload: "login succesfull" });
  } catch (err) {
    res.status(500).send(err);
  }
});

async function emailExists(email: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  return user;
}

export default authRoute;
