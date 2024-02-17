const { Post } = require('../models/post');
const { User } = require('../models/user');
require('dotenv').config();

const addPost = async (req, res) => 
{
    try 
    {
        const { imageData, caption } = req.body;
        const user = req.user;

        const { name, email } = user;

        const newPost = new Post({
            creator: { name, email },
            imageData,
            caption,
        });

        const savedPost = await newPost.save();

        await User.findByIdAndUpdate(
            user._id,
            { $push: { posts: savedPost._id } },
            { new: true }
        );

        res.status(201).json(savedPost);
    } 
    catch (error) 
    {
        console.error('Error adding post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addPost,
};
