import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connection } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";

//adding type in for doctorId and userId  in express for req
declare global {
  namespace Express {
    interface Request {
      doctor?: IDoctor; // or whatever type your userId should be
    }
  }
}

// routers import

import doctorAuth from "./routes/doctorAuthRoutes/doctorAuthRoutes";
import { IDoctor } from "./models/DoctorSchema";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);

// api route

app.use("/api/v1/testing", (req: Request, res: Response) => {
  res.send("working");
});
app.use("/api/v1/doctor/", doctorAuth);

//server config

//database connection
connection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
