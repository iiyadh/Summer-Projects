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
        default: function () {
            return `https://www.gravatar.com/avatar/${this.username}?d=https://cdn.vectorstock.com/i/500p/44/01/default-avatar-photo-placeholder-icon-grey-vector-38594401.jpg`;
        },
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;