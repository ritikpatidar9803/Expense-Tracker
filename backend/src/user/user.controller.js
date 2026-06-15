import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";
import bcrypt from 'bcrypt';
import { sendMail } from './../utils/mail.js';
import { otpTemplate } from './../utils/otp.template.js';
import { generateOTP } from './../utils/generate.otp.js';
import { forgotPasswordTemplate } from "../utils/forgot-template.js";


export const createUser = async (req, res) => {
    try {
        const data = req.body;
        const user = new UserModel(data)
        await user.save()
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const OTP = generateOTP();
        const isEmail = await UserModel.findOne({ email });
        if (isEmail)
            return res.status(400).json({ message: "Email is already registered" });

        await sendMail(email, "OTP for SignUP", otpTemplate(OTP))
        res.json({
            message: "OTP sent successfully",
            otp: OTP,
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createToken = async (user) => {
    const payload = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
    }
    const token = await jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: "1d" });
    return token

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User not found!!" })
        }
        if (!user.status) {
            return res.status(404).json({ message: "You are not active member!!" })
        }

        const isLoged = await bcrypt.compare(password, user.password)
        if (!isLoged) {
            res.status(404).json({ message: "Your password is incorrect!!" })
        }
        const token = await createToken(user);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "DEV",
            sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path: "/",
            domain: undefined,
            maxAge: 86400000
        });
        res.json({ message: "Login Successful", role: user.role });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User doesn't exists" });
        const token = await jwt.sign({ id: user._id }, process.env.FORGOT_TOKEN_SECRET, { expiresIn: "15m" })
        console.log("token:", token);
        const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
        const sent = await sendMail(email, "Expense App - Forgot Password", forgotPasswordTemplate(user.fullname, link))
        if (!sent)
            return res.status(424).json({ message: 'Email sending failed !1' });

        res.json({ message: "Please check your email to forgot email." })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const verifyToken = async (req, res) => {
    try {

        res.json({ message: "Verification Successful" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const encrypted = await bcrypt.hash(password.toString(), 12);
        await UserModel.findByIdAndUpdate(req.user.id, { password: encrypted });

        res.json({ message: "Password Updated Successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const logout = async (req, res) => {
    try {
        res.cookie("authToken", null, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "DEV",
            sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path: "/",
            domain: undefined,
            maxAge: 0
        });
        res.status(200).json({ message: "Logout Success" });
    } catch (err) {
        res.status(401).json({ message: err.message || "Logout Failed" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const users = await UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        const total = await UserModel.countDocuments()

        res.json({
            data: users,
            total : total
        })
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error." })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const user = await UserModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found !", user });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal server error." })
    }
}
