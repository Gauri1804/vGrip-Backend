// import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
// import { mailtrapClient, sender } from "./mailtrap.config.js"

// export const sendVerificationEmail = async (email, verificationToken) => {
//     const recipient = [{ email }]
//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "verify your email",
//             html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
//             category: "Email Verification"
//         })

//         console.log(`email send successfully ${response}`)

//     } catch (error) {
//         console.log(`error on verification email ${error.message}`)
//         throw new Error(`error on verification email ${error.message}`)
//     }
// }

// // export const sendWelcomeEmail = async (email, name) => {
// //     const recipient = [{ email }];

// //     try {
// //         const reasons = await mailtrapClient.send({
// //             from: sender,
// //             to: recipient,
// //             template_uuid: "365a40bf-6616-4d0c-a885-40f03460c49d",
// //             template_variables: {
// //                 "company_info_name": "vGrip the Learning platform",
// //                 "name": name
// //             }
// //         })

// //         console.log(`Welcome email send successfully ${reasons}`)
// //     } catch (error) {
// //         console.error(`error in Welcome email send ${error.message}`)
// //     }
// // }

// export const sendPasswordRestEmail = async (email, restURL) => {
//     const recipient = [{ email }];
//     try {
//         const reasons = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Rest your Password...",
//             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{restURL}", restURL),
//             category: "Password Rest"
//         })
//         console.log(`rest password email send successfully ${reasons}`)
//     } catch (error) {
//         console.log(`error sending password rest email ${error}`)

//         throw new Error(`error sending password rest email ${error}`)
//     }
// }


// import emailjs from "@emailjs/nodejs";
// import dotenv from "dotenv";
// dotenv.config()
// export const sendVerificationEmail = async (email, verificationToken) => {

//     try {
//         const templateParams = {
//             user_email: email,
//             verification_code: verificationToken
//         };

//         await emailjs.send(
//             process.env.EMAIL_JS_SERVICE_ID,   // Replace with Email.js Service ID
//             process.env.EMAIL_JS_TEMPLATE_ID,  // Replace with Email.js Template ID
//             templateParams,
//             {
//                 publicKey: process.env.EMAIL_JS_PUBLIC_KEY,  // Replace with Email.js Public Key
//                 privateKey: process.env.EMAIL_JS_PRIVATE_KEY // Replace with Email.js Private Key
//             }
//         );

//         console.log("Verification email sent successfully");
//     } catch (error) {
//         console.error("Error sending verification email:", error);
//     }
// };

//kaam ka hai
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// export const sendVerificationEmail = async (email, verificationToken) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         let mailOptions = {
//             from: `"VGrip" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Verify Your Email",
//             html: `<p>Your verification code is: <strong>${verificationToken}</strong></p>`,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log("✅ Email sent successfully to:", email);
//     } catch (error) {
//         console.error("❌ Full Email Sending Error:", error);
//         throw new Error("Email sending failed");
//     }
// };



//new 

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password, NOT your normal password
    },
});

/**
 * Sends a verification email to the user
 * @param {string} email - The user's email
 * @param {string} verificationToken - The verification token
 */
export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: `"VGrip" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Your verification code is: <strong>${verificationToken}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent successfully to:", email);
    } catch (error) {
        console.error("❌ Full Email Sending Error:", error);
        throw new Error("Email sending failed");
    }
};

/**
 * Sends a password reset email to the user
 * @param {string} email - The user's email
 * @param {string} resetToken - The password reset token
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;



        const mailOptions = {
            from: `"VGrip" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" style="color: blue; font-size: 16px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent successfully to:", email);
    } catch (error) {
        console.error("❌ Full Email Sending Error:", error);
        throw new Error("Email sending failed");
    }
};
