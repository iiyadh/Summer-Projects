const router = require('express').Router();
const { createChat1_1, getChats, getMessages , sendMessage , editMessage, deleteMessage } = require('../controllers/chatController');
const { authenticateToken , validateUID } = require('../middlewares/auth');


router.post('/create-chat', authenticateToken, validateUID, createChat1_1);
router.get('/chats', authenticateToken, validateUID, getChats);
router.get('/messages/:chatId', authenticateToken, validateUID, getMessages);
router.post('/send-message', authenticateToken, validateUID, sendMessage);
router.put('/edit-message/:messageId', authenticateToken, validateUID, editMessage);
router.delete('/delete-message/:messageId', authenticateToken, validateUID, deleteMessage);


module.exports = router;