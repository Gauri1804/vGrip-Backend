import express from 'express'
import { signupAuthController, loginAuthController, logoutAuthController, verifyEmailController, resetPasswordController, forgotPasswordController, checkAuth } from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { sendVerificationEmail } from "../mailtrap/emails.js";
const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signupAuthController);

router.post('/login', loginAuthController);

router.post('/logout', logoutAuthController)

router.post("/verify-email", verifyEmailController)

router.post('/forgot-password', forgotPasswordController)

router.post('/reset-password/:token', resetPasswordController)


router.get("/test-email", async (req, res) => {
    try {
        await sendVerificationEmail("your-email@gmail.com", "123456");
        res.json({ success: true, message: "Test email sent successfully!" });
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        res.status(500).json({ success: false, message: "Email sending failed" });
    }
});
export default router;