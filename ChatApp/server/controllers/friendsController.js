const User = require('../models/User');


const getUsersNotFriends = async (req, res) => {
    const userId = req.userId;
    const searchKeyword = req.query.keyword || '';

    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        

        const excludedIds = [
            userId,
            ...currentUser.friends,
            ...currentUser.friendsRequests,
            ...currentUser.sentRequests,
            ...currentUser.blockedUsers
        ];

        const usersNotFriend = await User.find({
            _id: { $nin: excludedIds },
            username: { $regex: searchKeyword, $options: 'i' }
        }).select('username profilePicture');

        res.status(200).json(usersNotFriend);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const addFriend = async (req, res) => {
    const userId = req.userId;
    const { friendId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const friendUser = await User.findById(friendId);

        if (friendUser.blockedUsers.includes(userId)) {
            return  res.status(400).json({ message: ` This user isn't available right now. ` });
        }

        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currentUser.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Already friends' });
        }
        currentUser.sentRequests.push(friendId);
        friendUser.friendsRequests.push(userId);
        await currentUser.save();
        await friendUser.save();
        res.status(200).json({ message: 'Friend request sended successfully' , friendRequest: { _id: friendUser._id, username: friendUser.username, profilePicture: friendUser.profilePicture } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const acceptFriendRequest = async (req, res) => {
    const userId = req.userId;
    const { requesterId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const requesterUser = await User.findById(requesterId);
        if (!currentUser || !requesterUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!currentUser.friendsRequests.includes(requesterId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }
        currentUser.friends.push(requesterId);
        requesterUser.friends.push(userId);
        currentUser.friendsRequests = currentUser.friendsRequests.filter(id => id.toString() !== requesterId);
        requesterUser.sentRequests = requesterUser.sentRequests.filter(id => id.toString() !== userId);
        await currentUser.save();
        await requesterUser.save();
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const rejectFriendRequest = async (req, res) => {
    const userId = req.userId;
    const { requesterId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const requesterUser = await User.findById(requesterId);
        if (!currentUser || !requesterUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!currentUser.friendsRequests.includes(requesterId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }
        currentUser.friendsRequests = currentUser.friendsRequests.filter(id => id.toString() !== requesterId);
        requesterUser.sentRequests = requesterUser.sentRequests.filter(id => id.toString() !== userId);
        await currentUser.save();
        await requesterUser.save();
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const denySentRequest = async (req, res) => {
    const userId = req.userId;
    const { recipientId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const recipientUser = await User.findById(recipientId);
        if (!currentUser || !recipientUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!currentUser.sentRequests.includes(recipientId)) {
            return res.status(400).json({ message: 'No sent request to this user' });
        }
        currentUser.sentRequests = currentUser.sentRequests.filter(id => id.toString() !== recipientId);
        recipientUser.friendsRequests = recipientUser.friendsRequests.filter(id => id.toString() !== userId);
        await currentUser.save();
        await recipientUser.save();
        res.status(200).json({ message: 'Sent friend request denied' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFriendRequests = async (req, res) => {
    const userId = req.userId;
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const requesters = await User.find({ _id: { $in: currentUser.friendsRequests } }).select('username profilePicture');
        res.status(200).json(requesters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getSentsRequests = async (req, res) => {
    const userId = req.userId;
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const sentRequests = await User.find({ _id: { $in: currentUser.sentRequests } }).select('username profilePicture');
        res.status(200).json(sentRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getFriends = async (req, res) => {
  const userId = req.userId;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const friendsWithStatus = currentUser.friends.map(friend => ({
      id: friend._id || friend,
      status: friend.status || 'active'
    }));
    const friendIds = friendsWithStatus.map(f => f.id);
    const friendsData = await User.find({ 
      _id: { $in: friendIds } 
    }).select('username profilePicture');
    res.status(200).json(friendsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeFriend = async (req, res) => {
    const userId = req.userId;
    const friendId = req.params.friendId;
    try {
        const currentUser = await User.findById(userId);
        const friendUser = await User.findById(friendId);
        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!currentUser.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Not friends' });
        }
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== friendId);
        friendUser.friends = friendUser.friends.filter(id => id.toString() !== userId);
        await currentUser.save();
        await friendUser.save();
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const blockFriend = async (req, res) => {
    const userId = req.userId;
    const { friendId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const friendUser = await User.findById(friendId);
        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const friendIndex = currentUser.friends.findIndex(id => id.toString() === friendId);
        if (friendIndex === -1) {
            return res.status(400).json({ message: 'Not friends' });
        }
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== friendId);
        friendUser.friends = friendUser.friends.filter(id => id.toString() !== userId);
        currentUser.blockedUsers.push(friendId);
        await friendUser.save();
        await currentUser.save();
        res.status(200).json({ message: 'Friend blocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const unblockFriend = async (req, res) => {
    const userId = req.userId;
    const { friendId } = req.body;
    try {
        const currentUser = await User.findById(userId);
        const friendUser = await User.findById(friendId);
        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id.toString() !== friendId);
        await currentUser.save();
        res.status(200).json({ message: 'Friend unblocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBlockedUsers = async (req, res) => {
    const userId = req.userId;
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const blockedFriends = currentUser.blockedUsers;
        const blockedUsersData = await User.find({ 
            _id: { $in: blockedFriends } 
        }).select('username profilePicture');
        res.status(200).json(blockedUsersData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
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
};
