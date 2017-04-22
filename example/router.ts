
import { Router } from "express";
export const app = Router()

import { app as view } from "./app";
app.use(view)