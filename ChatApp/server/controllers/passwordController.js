const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendEmail } = require('../lib/emailSender');


const forgotPassword = async (req,res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.resetToken = crypto.randomBytes(32).toString('hex');
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user.resetToken}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click here to reset your password: ${resetLink}`,
            html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #EEEEEE;
                border-radius: 8px;
                border-top: 5px solid #FF4F0F;
                box-shadow: 2px 2px 20px gray
            ">
            <h1 style="
                color: #03A6A1;
                text-align: center;
                margin-bottom: 25px;
            ">
                Password Reset Request
            </h1>

            <p style="
                color: #333;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            ">
                You requested a password reset for your account.
            </p>

            <p style="
                color: #333;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 25px;
            ">
                Please click the button below to reset your password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="
                    background-color: #FF4F0F;
                    color: white;
                    padding: 12px 25px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                    display: inline-block;
                ">
                Reset Password
                </a>
            </div>

            <p style="
                    color: #666;
                    font-size: 14px;
                    line-height: 1.5;
                    margin-top: 25px;
                    border-top: 1px solid #FFA673;
                    padding-top: 15px;
                ">
                If you didn't request this password reset, please ignore this email or contact support.
                <a href="mailto:touslesmeme500@gmail.com">Contact Us</a></p>
            </p>
            </div>
            `,
        };
        await sendEmail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const resetPassword = async (req,res) =>{
    const token = req.params.token;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    forgotPassword,
    resetPassword
}