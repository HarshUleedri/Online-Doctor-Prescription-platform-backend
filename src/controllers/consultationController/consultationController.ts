import { Request, Response } from "express";
import Consultations from "../../models/ConsultationSchema";

export const createConsultation = async (req: Request, res: Response) => {
  try {
    const {
      doctorId,
      currentIllnessHistory,
      recentSurgery,
      familyMedicalHistory,
      transactionId,
    } = req.body;
    const patientId = req.patient?._id;
    if (!patientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    console.log(req.body);
    if (
      !doctorId ||
      !currentIllnessHistory ||
      !recentSurgery ||
      !familyMedicalHistory ||
      !transactionId
    ) {
      res.status(400).json({ message: "ALL fields are required" });
      return;
    }

    const consultation = new Consultations({
      patientId: patientId,
      doctorId,
      currentIllnessHistory,
      recentSurgery: {
        hasSurgery: recentSurgery?.hasSurgery || false,
        timeSpan: recentSurgery?.timeSpan || "",
      },
      familyMedicalHistory,
      transactionId,
      status: "pending",
    });

    await consultation.save();

    // Populate the consultation with doctor and patient details
    await consultation.populate([
      { path: "doctorId", select: "name specialty profilePicture" },
      { path: "patientId", select: "name age profilePicture" },
    ]);

    res.status(201).json({
      message: "Consultation created successfully",
      consultation,
    });
  } catch (error) {
    console.error("Create consultation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConsultationForDoctor = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctor?._id;
    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const consultations = await Consultations.find({ doctorId })
      .populate("patientId", "name age profilePic")
      .sort({ createdAt: -1 });

    res.json({ consultations });
  } catch (error) {
    console.error("Get doctor consultations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConsultationForPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patientId = req.patient?._id;
    if (!patientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const consultations = await Consultations.find({ patientId })
      .populate("doctorId", "name specialty profilePic")
      .sort({ createdAt: -1 });

    res.json({ consultations });
  } catch (error) {
    console.error("Get patient consultations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleConsultationForPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const patientId = req.patient?._id;
    if (!patientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const consultation = await Consultations.findById(id)
      .populate("doctorId", "name specialty profilePicture yearsOfExperience")
      .populate("patientId", "name age profilePicture");

    if (!consultation) {
      res.status(404).json({ error: "Consultation not found" });
      return;
    }

    res.json({ consultation });
  } catch (error) {
    console.error("Get consultation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getSingleConsultationForDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const doctorId = req.doctor?._id;
    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    const consultation = await Consultations.findById(id)
      .populate("doctorId", "name specialty profilePic yearsOfExperience")
      .populate("patientId", "name age profilePic");

    if (!consultation) {
      res.status(404).json({ error: "Consultation not found" });
      return;
    }

    res.json({ consultation });
  } catch (error) {
    console.error("Get consultation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
