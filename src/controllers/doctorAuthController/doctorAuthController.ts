import { Request, Response } from "express";
import Doctors from "../../models/DoctorSchema";
import { generateAccessToken } from "../../utils/generateToken";

export const doctorSignUp = async (req: Request, res: Response) => {
  try {
    const { name, profilePic, specialty, email, phone, password, experience } =
      req.body;

    if (!name || !email || !password || !specialty || !phone || !experience) {
      res.status(400).json({ message: "ALL fields are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password Must Be at least 6 character" });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email Format " });
      return;
    }

    const doctor = await Doctors.findOne({
      $or: [{ phone }, { email }],
    });

    if (doctor) {
      if (doctor.phone === phone) {
        res.status(400).json({ message: "Phone Number is used already " });
        return;
      } else {
        res.status(400).json({ message: "email is used already " });
        return;
      }
    }

    const newDoctor = await Doctors.create({
      name,
      email,
      phone,
      password,
      profilePic,
      specialty,
      experience,
    });

    const docAccessToken = generateAccessToken(
      (newDoctor._id as string).toString()
    );

    res.cookie("docToken", docAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, message: "Successful Sign Up" });
  } catch (error) {
    console.log("Error at doctor sign up controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const doctor = await Doctors.findOne({ email });
    if (!doctor) {
      res.status(404).json({ message: "Doctor does not exists" });
      return;
    }
    const isPasswordCorrect = await doctor.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid Credential" });
      return;
    }
    const docAccessToken = generateAccessToken(
      (doctor._id as string).toString()
    );

    res.cookie("docToken", docAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Successful login" });
  } catch (error) {
    console.log("Error at doctor login controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
export const doctorLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("docToken");
    res.json({ message: "logged out" });
  } catch (error) {
    console.log("Error at doctor logout controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
