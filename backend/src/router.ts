import { Router } from "express";
import authRoute from "./auth";

const route = Router().use("/auth", authRoute);

export default route;
