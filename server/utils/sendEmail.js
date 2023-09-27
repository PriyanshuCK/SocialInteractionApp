import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import Verification from "../models/emailVerification.js";
import { hashString } from "./index.js";
import PasswordReset from "../models/PasswordReset.js";

const { AUTH_EMAIL, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.OAUTH_APP_PASSWORD,
    },
});

export const sendVerificationEmail = async (user, res) => {
    const { _id, email, firstName, lastName } = user;
    const token = _id + uuidv4();
    const link = APP_URL + "users/verify/" + _id + "/" + token;


    const mailOptions = {
        from: "Priyanshu Sharma" + AUTH_EMAIL,
        to: email,
        subject: "Email Verification | Connect",
        generateTextFromHTML: true,
        html: `
        <div
        style=font-family: Arial, sans-serif; font-size: 20px; color: #1e293b; background-color: white;>
            <h1 style="color: #64748b;">Please verify your email address</h1>
            <hr />
            <h4>Hi ${firstName + " " + lastName},</h4>
            <p>
                Please verify your email address so we can know that it's really you.
                <br>
            <p>This link <b>expires in 1 hour</b></p>
            <br>
            <a
                href=${link}
                style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;">
                Verify Email Address
            </a>
            </p>
            <div style="margin-top: 20px;">
                <h5>Best Regards</h5>
                <h5>Connect Team</h5>
            </div>
        </div>`,
    };

    try {
        const hashedToken = await hashString(token);
        const newVerifiedEmail = await Verification.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        if (newVerifiedEmail) {
            const result = await transporter.sendMail(mailOptions).then(() => {
                res.status(201).send({
                    success: "Pending",
                    message: "Verification email has been sent to your registered email address. Check the email to verify your account."
                });
            }).catch((error) => {
                console.log(error.message);
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Something went wrong!" });
    }
};

export const resetPasswordLink = async (user, res) => {
    const { _id, email, firstName, lastName } = user;
    const token = _id + uuidv4();
    const link = APP_URL + "users/reset-password/" + _id + "/" + token;

    const mailOptions = {
        from: "Priyanshu Sharma" + AUTH_EMAIL,
        to: email,
        subject: "Password Reset | Connect",
        generateTextFromHTML: true,
        html: `
        <div
        style=font-family: Arial, sans-serif; font-size: 20px; color: #1e293b; background-color: white;>
            <h1 style="color: #64748b;">Reset Password</h1>
            <hr />
            <h4>Hi ${firstName + " " + lastName},</h4>
            <p>
                Please click the link below to reset your account password.
                <br>
            <p>This link <b>expires in 10 minutes</b></p>
            <br>
            <a
                href=${link}
                style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;">
                Reset Password
            </a>
            </p>
            <div style="margin-top: 20px;">
                <h5>Best Regards</h5>
                <h5>Connect Team</h5>
            </div>
        </div>`,
    };

    try {
        const hashedToken = await hashString(token);
        const resetEmail = await PasswordReset.create({
            userId: _id,
            email: email,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
        });
        if (resetEmail) {
            const result = await transporter.sendMail(mailOptions).then(() => {
                res.status(201).send({
                    success: "Pending",
                    message: "Reset Password Link has been sent to your account."
                });
            }).catch((error) => {
                console.log(error.message);
                res.status(404).json({ message: "Something went wrong!" });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Something went wrong!" });
    }
};