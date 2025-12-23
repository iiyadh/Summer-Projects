const router = require('express').Router();
const {
    getUsersNotFriends,
    addFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    denySentRequest,
    getFriendRequests,
    getSentsRequests,
    getFriends,
    removeFriend,
    blockFriend,
    unblockFriend,
    getBlockedUsers,
} = require('../controllers/friendsController');
const { authenticateToken ,validateUID} = require('../middlewares/auth');


router.get('/users-not-friends', authenticateToken, validateUID, getUsersNotFriends);
router.post('/add-friend', authenticateToken, validateUID, addFriend);
router.post('/accept-friend-request', authenticateToken, validateUID, acceptFriendRequest);
router.post('/reject-friend-request', authenticateToken, validateUID, rejectFriendRequest);
router.post('/deny-sent-request', authenticateToken, validateUID, denySentRequest);
router.get('/friend-requests', authenticateToken, validateUID, getFriendRequests);
router.get('/sent-requests', authenticateToken, validateUID, getSentsRequests);
router.get('/friends', authenticateToken, validateUID, getFriends);
router.get('/blocked-users', authenticateToken, validateUID, getBlockedUsers);
router.post('/remove-friend/:friendId', authenticateToken, validateUID, removeFriend);
router.post('/block-friend', authenticateToken, validateUID, blockFriend);
router.post('/unblock-friend', authenticateToken, validateUID, unblockFriend);

module.exports = router;