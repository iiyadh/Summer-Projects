const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "Edit your bio",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    },
    otpCode: {
        type: String,
        default: null,
    },
    otpExpiration: {
        type: Date,
        default: null,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        status : { type: String , enum: ['active', 'blocked'], default: 'active'}
    }],
    friendsRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;