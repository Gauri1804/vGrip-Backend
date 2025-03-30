import crypto from "crypto";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../mailtrap/emails.js";



export const signupAuthController = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error("❌ Email sending failed:", emailError);
            return res.status(500).json({ success: false, message: "Error sending verification email" });
        }

        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "User created! Verification email sent.",
            user: { ...user._doc, password: undefined },
        });

    } catch (error) {
        console.error("❌ General Signup Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const verifyEmailController = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Expired verification code" })
        }

        user.isVerified = true;

        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();



        res.status(200).json({
            success: true,
            message: "Email verify Successful",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log(`error in verify email ${error}`);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}



export const loginAuthController = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all the fields..."
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "user is not registered..."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "invalid username or password..."
            })
        }

        generateTokenAndSetCookie(res, user.id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "user login successfully...",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `error in login server... ${error}`
        })
    }


}



export const logoutAuthController = async (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out successfully..."
    })
}


// export const forgotPasswordController = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "user not found..." });
//         }

//         // generate rest token

//         const restToken = crypto.randomBytes(20).toString('hex');
//         const restTokenExpiredAT = Date.now() + 1 * 60 * 60 * 1000; //1hr

//         user.restPasswordToken = restToken;
//         user.restPasswordExpireAt = restTokenExpiredAT;

//         await user.save();

//         //send email

//         // await sendPasswordRestEmail(user.email, `${process.env.CLINT_URL}/forgot+-password/${restToken}`)

//         res.status(200).json({ success: true, message: "rest email send successfully..." })

//     } catch (error) {

//         res.status(500).json({ success: false, message: `error in rest email send controller ${error}` })
//     }
// }




export const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration

        user.restPasswordToken = resetToken;
        user.restPasswordExpireAt = resetTokenExpireAt;
        await user.save();

        // Send password reset email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user.email, resetLink);

        res.status(200).json({ success: true, message: "Reset email sent successfully!" });
    } catch (error) {
        console.error("Error in forgotPasswordController:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            restPasswordToken: token,
            restPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.restPasswordToken = undefined;
        user.restPasswordExpireAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found...." });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(`Error in checkAuth... ${error}`);
        res.status(400).json({ success: false, message: error.message });
    }
}