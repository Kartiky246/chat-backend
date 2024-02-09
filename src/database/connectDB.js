import mongoose from "mongoose";

const connectDB = async () => {
  const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
  console.log("connected to database");
};

export default connectDB;
