import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //required fields for user
    name : {type: String, required: true},  
    email : {type: String, required: true, unique: true},     
    password : {type: String, required: true}, 
    //fields added with default values auto added while creating user
    verifyOtp : {type: String, default: ''},
    verifyOtpExpireAt : {type: Number, default: 0},
    isAccountverified : {type: Boolean, default: false},
    resetOtp : {type: String, default: ''},
    resetOtpExpiredAt : {type: Number, default: 0},
})
// A Model in Mongoose is a wrapper around a MongoDB collection.
// It allows you to interact with the database using JavaScript methods
// creates a Model called userModel that represents the users collection in MongoDB, following the rules of userSchema.
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;