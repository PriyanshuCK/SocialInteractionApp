import Users from "../models/userModel.js";
import { createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { compareString } from "../utils/index.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName || lastName || email || password)) {
        next("Provide Required Fields!");
        return;
    }
    try {
        const userExist = await Users.findOne({ email });
        if (userExist) {
            next("Email Address already exists");
            return;
        }

        const hashedPassword = await hashString(password);

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        sendVerificationEmail(user, res);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!(email || password)) {
            next("Please provide user credentials!");
            res.status(500).json({
                message: "Please provide user credentials!"
            });
            return;
        }

        const user = await Users.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl -password",
        });

        if (!user) {
            next("Invalid email or password!");
            res.status(500).json({
                message: "Invalid email or password!"
            });
            return;
        }

        if (!user?.verified) {
            next("User email is not verified. Check your email account and verify your email.");
            res.status(500).json({
                message: "User email is not verified. Check your email account and verify your email."
            });
            return;
        }

        const isMatch = await compareString(password, user?.password);
        if (!isMatch) {
            next("Invalid email or password!");
            res.status(500).json({
                message: "Invalid email or password!"
            });
            return;
        }

        user.password = undefined;
        const token = createJWT(user?._id);

        res.status(201).json({
            success: true,
            message: "Logged in successfully",
            user,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};