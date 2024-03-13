import mongoose from "mongoose";


const connectDB = async () => {
  console.log("PP00",process.env.MONGODB_URL,process.port)
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectDB;
