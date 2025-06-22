const User = require('../models/User');
const jwt = require('jsonwebtoken');

const validateUID = async (req ,res , next) =>{
    try{
        const user = await User.findById(req.userId);
        if (!user) {
            res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.userId = payload.userId;
        next();
    });
}

module.exports = {
    authenticateToken,
    validateUID
};