import { Request, Response } from "express";
import imageKit from "../../utils/imagekitConfig";

export const DoctorImageUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }
    const profileImage = await imageKit.upload({
      file: file.buffer,
      fileName: `${file.originalname
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove all special chars except spaces
        .trim() // Remove leading/trailing spaces
        .replace(/\s+/g, "-")}.png`,
      folder: `Doctor/ProfileImage`,
    });
    if (!profileImage) {
      res.status(500).json({ message: "Url not generated" });
      return;
    }
    res.status(201).json({ url: profileImage.url });
  } catch (error) {
    console.log("Error at Doctor image upload", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
