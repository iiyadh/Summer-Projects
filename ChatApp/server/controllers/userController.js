const User = require('../models/User');
const { sendEmail } = require('../lib/emailSender');
const bcrypt = require('bcrypt');


const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("username email profilePicture bio");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const updateUsername = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.body;
        const user = await User.findByIdAndUpdate(userId, { username }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Username updated successfully', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const updateBio = async (req, res) => {
    try {
        const userId = req.userId;
        const { bio } = req.body;
        const user = await User.findByIdAndUpdate(userId, { bio }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Bio updated successfully', bio: user.bio });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const updateEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { email } = req.body;
        const user = await User.findByIdAndUpdate(userId, { email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Email updated successfully', email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const sendOTPCodeToEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const user = await User.findById(userId);
        user.otpCode = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000;
        await user.save();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Your OTP Code',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your OTP Code</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        background-color: #EEEEEE;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #FFFFFF;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #FF4F0F 0%, #FFA673 100%);
                        padding: 40px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        color: #FFFFFF;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .content {
                        padding: 40px 30px;
                        background-color: #FFFFFF;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #333333;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 16px;
                        color: #666666;
                        line-height: 1.6;
                        margin-bottom: 30px;
                    }
                    .otp-container {
                        background-color: #EEEEEE;
                        border-left: 4px solid #03A6A1;
                        padding: 30px;
                        text-align: center;
                        margin: 30px 0;
                        border-radius: 8px;
                    }
                    .otp-label {
                        font-size: 14px;
                        color: #666666;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                    }
                    .otp-code {
                        font-size: 36px;
                        font-weight: 700;
                        color: #FF4F0F;
                        letter-spacing: 8px;
                        margin: 10px 0;
                        font-family: 'Courier New', monospace;
                    }
                    .expiry-notice {
                        font-size: 13px;
                        color: #03A6A1;
                        margin-top: 15px;
                    }
                    .warning {
                        background-color: #FFF5F0;
                        border-left: 4px solid #FFA673;
                        padding: 15px 20px;
                        margin: 25px 0;
                        border-radius: 6px;
                    }
                    .warning p {
                        margin: 0;
                        font-size: 14px;
                        color: #666666;
                        line-height: 1.5;
                    }
                    .footer {
                        background-color: #EEEEEE;
                        padding: 30px;
                        text-align: center;
                        font-size: 13px;
                        color: #999999;
                    }
                    .footer a {
                        color: #03A6A1;
                        text-decoration: none;
                    }
                    .divider {
                        height: 1px;
                        background-color: #EEEEEE;
                        margin: 30px 0;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>🔐 Verification Code</h1>
                    </div>

                    <div class="content">
                        <p class="greeting">Hello,</p>

                        <p class="message">
                            We received a request to verify your account. Use the One-Time Password (OTP) below to complete your verification:
                        </p>

                        <div class="otp-container">
                            <div class="otp-label">Your OTP Code</div>
                            <div class="otp-code">${otp}</div>
                            <div class="expiry-notice">⏱ This code will expire in 10 minutes</div>
                        </div>

                        <div class="warning">
                            <p><strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our team will never ask you for this code via email, phone, or text message.</p>
                        </div>

                        <div class="divider"></div>

                        <p class="message">
                            If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.
                        </p>
                    </div>

                    <div class="footer">
                        <p>This is an automated message, please do not reply.</p>
                        <p style="margin-top: 10px;">
                            Need help? <a href="#">Contact Support</a>
                        </p>
                        <p style="margin-top: 20px; font-size: 12px;">
                            © 2024 Your Company. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>`
        }
        await sendEmail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to email' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyOTPCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ sucess : false , message: 'User not found' });
        }
        if (user.otpCode !== otp || Date.now() > user.otpExpiration) {
            return res.status(400).json({ sucess : false , message: 'Invalid or expired OTP' });
        }
        user.otpCode = null;
        user.otpExpiration = null;
        await user.save();
        return res.status(200).json({ sucess : true ,message: 'OTP verified successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ sucess : false , message: 'Internal server error' });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldPassword , newPassword } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: 'Invalid password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.userId;
        const { profilePicture } = req.body;
        const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: user.profilePicture });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getUserProfile,
    updateUsername,
    updateBio,
    updateEmail,
    sendOTPCodeToEmail,
    verifyOTPCode,
    updatePassword,
    updateProfilePicture
};