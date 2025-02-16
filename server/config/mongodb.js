import mongoose from "mongoose";
const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to db");
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/artimage`)

}



export default connectDB;
