const { Post } = require('../models/post');
const { User } = require('../models/user');
require('dotenv').config();


const addPost = async (req, res) => 
{
    try 
    {
        const { imageData, caption, creator } = req.body;
        const user=req.user;
       
        const newPost = new Post({
            creator: creator, // Use the creator directly
            imageData,
            caption,
            likes: 0,
            comments: [],
            timeStamp: Date.now(),
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

const fetchPosts = async (req, res) => 
{
    try 
    {
        const posts = await Post.find().sort({ timeStamp: -1 });
        res.status(200).json(posts);
    } 
    catch (error) 
    {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addComment = async (req, res) => 
{
    try 
    {
        const { comment, postId } = req.body;
        const user=req.user;

        console.log('Add comment request:', { comment, postId });

        const sharedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            user._id,
            { $push: { posts: sharedPost._id } },
            { new: true }
        );

        res.status(201).json(sharedPost);
    } 
    catch (error) 
    {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const sharePost = async (req, res) => 
{
    try 
    {
        const post = req.body;
        const user=req.user;

        console.log('Share post request:', post);

        const newPost = new Post({
            creator: {
                name: user.name,
                email: user.email,
                personalRoomId: user._id
            },
            imageData: post.imageData,
            caption: post.caption,
            likes: 0,
            comments: [],
            timeStamp: Date.now(),
        });

        const savedPost = await newPost.save();

        await User.findByIdAndUpdate(
            user._id,
            { $push: { posts: savedPost._id } },
            { new: true }
        );

        res.status(200).json(savedPost);
    } 
    catch (error) 
    {
        console.error('Error sharing post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    addPost,
    fetchPosts,
    addComment,
    sharePost
};
