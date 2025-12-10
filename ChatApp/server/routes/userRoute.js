const router = require('express').Router();
const { 
    getUserProfile,
    updateUsername,
    updateBio,
    updateEmail,
    sendOTPCodeToEmail,
    verifyOTPCode,
    updatePassword ,
    updateProfilePicture} = require('../controllers/userController');
const { authenticateToken ,validateUID} = require('../middlewares/auth');


router.get('/profile', authenticateToken , validateUID, getUserProfile);
router.put('/profile/change-email', authenticateToken, validateUID, updateEmail);
router.put('/profile/change-username', authenticateToken , validateUID, updateUsername);
router.put('/profile/change-bio', authenticateToken , validateUID, updateBio);
router.put('/profile/change-profile-picture', authenticateToken , validateUID, updateProfilePicture);
router.post('/send-otp', authenticateToken , validateUID, sendOTPCodeToEmail);
router.post('/verify-otp', authenticateToken, validateUID, verifyOTPCode);
router.put('/update-password', authenticateToken, validateUID, updatePassword);



module.exports = router;