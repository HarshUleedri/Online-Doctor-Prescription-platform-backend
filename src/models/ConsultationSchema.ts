import mongoose, { Document } from "mongoose";

export interface IConsultation extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  currentIllnessHistory: string;
  recentSurgery: {
    hasSurgery: boolean;
    timeSpan?: string;
  };
  familyMedicalHistory: {
    diabetics: "diabetic" | "non-diabetic";
    allergies: string;
    others: string;
  };
  transactionId: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctors",
      required: true,
    },
    currentIllnessHistory: {
      type: String,
      required: true,
      trim: true,
    },
    recentSurgery: {
      hasSurgery: {
        type: Boolean,
        default: false,
      },
      timeSpan: {
        type: String,
        trim: true,
      },
    },
    familyMedicalHistory: {
      diabetics: {
        type: String,
        enum: ["diabetic", "non-diabetic"],
        required: true,
      },
      allergies: {
        type: String,
        trim: true,
        default: "",
      },
      others: {
        type: String,
        trim: true,
        default: "",
      },
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Consultations = mongoose.model<IConsultation>(
  "Consultations",
  ConsultationSchema
);

export default Consultations;
