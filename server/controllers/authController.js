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

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

//send pw reset otp 

export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: "Please provide email"});
    }

    try {
        const user = await UserModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        } 
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp=otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //24 hours from now

        await user.save();

        const mailOptions ={ 
            from: process.env.SENDER_EMAIL,
            to:  user.email,
            subject: 'password reset OTP',
            text: `Hello ${user.name},\n\nYour password reset OTP is ${otp}. It is valid for 15 minutes.\n\nBest regards,\nThe Team`
        };
        await transporter.sendMail(mailOptions);
        
        return res.json({success: true, message: "Password reset OTP sent to your email"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//reset password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "Please provide email, otp and new password"});
    }
    try {
        const user = await UserModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(!user.resetOtp || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);  

        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpireAt = null;

        await user.save();
        return res.json({success: true, message: "Password reset successfully"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}