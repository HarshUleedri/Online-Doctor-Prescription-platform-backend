import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IDoctor extends Document {
  name: string;
  profilePic?: string;
  specialty: string;
  email: string;
  phone: string;
  password: string;
  role: "doctor";
  upiId: string;
  consultancyAmount: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profilePic: { type: String, default: "" },
    specialty: { type: String, required: true },
    role: { type: String, default: "doctor" },
    upiId: { type: String, default: "" },
    consultancyAmount: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experience: { type: Number, required: true },
  },
  { timestamps: true }
);

DoctorSchema.pre<IDoctor>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

DoctorSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password
  );
  return isPasswordCorrect;
};

const Doctors = mongoose.model<IDoctor>("Doctors", DoctorSchema);

export default Doctors;
