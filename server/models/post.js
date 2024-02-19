const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    creator: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        personalRoomId: {
            type: String,
            required: true,
        },
    },
    imageData: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Array,
        default: [],
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);


module.exports = { Post };
