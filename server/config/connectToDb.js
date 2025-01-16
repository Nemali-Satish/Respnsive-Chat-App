import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected : ${connect.connection.host}`);
  } catch (error) {
    console.log(`DB Connection Failed : ${error}`);
  }
};

export default connectDB;
