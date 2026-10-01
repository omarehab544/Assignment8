import mongoose from 'mongoose';

const connectDB = async () => {
  try {
const conn = await mongoose.connect( 'mongodb://localhost:27017/saraha',{serverSelectionTimeoutMS:1000});
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
   
  }
};

export default connectDB;