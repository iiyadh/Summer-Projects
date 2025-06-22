const router = require('express').Router();
const { register , login , logout , refresh } = require('../controllers/authController');
const { authenticateToken , validateUID } = require('../middlewares/auth');


router.post('/register',register);
router.post('/login',login);
router.post('/refrech',refresh);
router.post('/logout',logout);

router.get('/isValidAuth',authenticateToken,validateUID,(req, res) => {
    return res.status(200).json(req.userId);
});


module.exports = router;