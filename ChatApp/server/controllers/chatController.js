const { Chat , Message } = require('../models/Chat');
const User = require('../models/User');

const createChat1_1 = async (req, res) => {
    const userId = req.userId;
    const { participantId } = req.body;

    try {
        if (userId === participantId) {
            return res.status(400).json({ error: "You can't chat with yourself" });
        }

        const existingChat = await Chat.findOne({
            participants: { $all: [userId, participantId] },
            $expr: { $eq: [{ $size: "$participants" }, 2] }
        });

        if (existingChat) {
            return res.status(400).json({
                chatId: existingChat._id,
                message: 'Chat already exists'
            });
        }

        const sender = await User.findById(userId);
        const participant = await User.findById(participantId);

        if (!sender || !participant) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newChat = new Chat({
            title: `${sender.username}, ${participant.username}`,
            participants: [userId, participantId]
        });

        await newChat.save();

        return res.status(201).json(newChat);

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.userId }).populate('participants', 'username profilePicture');

        return res.status(200).json(chats);
    } catch {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getMessages = async (req, res) => {
    try {
        const chatRoom = await Chat.findById(req.params.chatId)
            .populate({
                path: 'messages',
                select: 'sender content timestamp',
                populate: {
                    path: 'sender',
                    select: 'username profilePicture'
                }
            });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        if (!chatRoom.participants.includes(req.userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        return res.status(200).json(chatRoom.messages);

    } catch {
        return res.status(500).json({ error: 'Server error' });
    }
};

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    try {
        const chatRoom = await Chat.findById(chatId);
        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        if (!chatRoom.participants.includes(req.userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const newMessage = {
            sender: req.userId,
            content,
            timestamp: new Date()
        };
        const message = await Message.create(newMessage);
        chatRoom.messages.push(message._id);
        await chatRoom.save();
        const updatedChat = await Chat.findById(chatId)
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'username profilePicture'
                }
            });

        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

        return res.status(201).json({ 
            message: 'Message sent successfully',
            data: lastMessage
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { newContent } = req.body;
        console.log(messageId , newContent);
        if (!newContent || !newContent.trim()) {
            return res.status(400).json({ error: 'Message content cannot be empty' });
        }
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        if (message.sender.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        message.content = newContent;
        await message.save();

        return res.status(200).json({
            message: 'Message edited successfully',
            data: message
        });

    } catch (err) {
        console.error('editMessage error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};


const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        if (message.sender.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        await Message.findByIdAndDelete(messageId);
        await Chat.updateMany(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );
        return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const fetchFriends = async (req,res) => {
    try{
        const user = await User.findById(req.userId).populate('friends', 'username profilePicture');
        return res.status(200).json(user.friends);
    }
    catch(err){
        return res.status(500).json({ error: 'Server error' });
    }
};

const createGroupChat = async (req, res) => {
    const userId = req.userId;
    const { participantIds } = req.body;
    try {
        if (!participantIds || participantIds.length < 2) {
            return res.status(400).json({ error: 'At least two participants are required to create a group chat' });
        }
        const participants = [userId, ...participantIds];
        const newChat = new Chat({
            title: req.body.title || 'Group Chat',
            participants: participants
        });
        await newChat.save();
        return res.status(201).json(newChat);
    }catch(err){
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createChat1_1, getChats, getMessages , sendMessage , editMessage, deleteMessage , createGroupChat ,fetchFriends};