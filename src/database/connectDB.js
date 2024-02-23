import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectDB;
