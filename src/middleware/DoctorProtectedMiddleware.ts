import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Doctors from "../models/DoctorSchema";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const protectedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { docToken } = req.cookies;
    if (!docToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      res.status(500).json("server config error of jwt env");
      return;
    }

    const decode = jwt.verify(docToken, secret) as CustomJwtPayload;

    if (!decode || !decode.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const doctor = await Doctors.findOne({ _id: decode.id }).select(
      "-password"
    );

    if (!doctor) {
      res.status(401).json({ message: "doctor not found " });
      return;
    }
    req.doctor = doctor;
    next();
  } catch (error) {
    console.log("error in protected middleware", error);
    res.status(401).json({ message: "Unauthenticated" });
  }
};
