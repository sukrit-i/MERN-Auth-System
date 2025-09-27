import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js'; 
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const{name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: "Please fill all the fields"});
    }

    try {
        const existingUser = await UserModel.findOne({email});

        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({name, email, password: hashedPassword});
        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,

        });

        //sending welcome email
        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our App',
            text: `Hello ${name},\n\nWelcome to our app! We're glad to have you on board.\nyour account has been created with this email id: ${email}\nBest regards,\nThe Team` 
        }
        await transporter.sendMail(mailOptions); 
        return res.json({success: true, message: "User registered successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}   

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({success: false, message: "Please fill all the fields"});
    }

    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
 
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        return res.json({success: true, message: "Login successful" });
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict',    
        })

        return res.json({success: true, message: "Logout successful"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }  
}

//send verifivation otp to user email 
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId}=req.body || {};

        if(!userId){
            return res.json({success: false, message: "Please provide userId"});
        }                   
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found, OTP not sent." });
        }

        if(user.isAccountverified){
            return res.json({success: false, message: "Account already verified"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp=otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //24 hours from now

        await user.save();

        const mailOptions ={ 
            from: process.env.SENDER_EMAIL,
            to:  user.email,
            subject: 'Verify your email',
            text: `Hello ${user.name},\n\nYour verification OTP is ${otp}. It is valid for 24 hours.\n\nBest regar ds,\nThe Team`    
        }

        await transporter.sendMail(mailOptions);

        res.json({success: true, message: "Verification OTP sent to your email"});
    } catch (error) {
        res.json({success: false, message: error.message});
    } 
}

export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false, message: "Please provide userId and otp"});
    }

    try {
        const user = await UserModel.findById(userId); 

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(!user.verifyOtp || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        } 

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }
        
        user.isAccountverified = true;
        user.verifyOtp = null;
        user.verifyOtpExpireAt = null;

        await user.save();
        return res.json({success: true, message: "Email verified successfully"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}