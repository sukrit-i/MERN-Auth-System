import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`); // mern-auth is the database name
};

export default connectDB;