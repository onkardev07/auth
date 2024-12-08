import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

export default dbConnect;
