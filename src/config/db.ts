import mongoose from "mongoose";

export const connection = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MongoDB is connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Fail To connect MongoDB ", error);
    process.exit(1);
  }
};
