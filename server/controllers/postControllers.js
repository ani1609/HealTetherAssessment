const { Post } = require('../models/post');
const { User } = require('../models/user');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


const addPost = async (req, res) => 
{
    try 
    {
        const { imageData, caption, creator, postId } = req.body;
        const user=req.user;
       
        const newPost = new Post({
            creator: creator, // Use the creator directly
            imageData,
            caption,
            likes: 0,
            comments: [],
            timeStamp: Date.now(),
            postId
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

const addLike = async (req, res) => 
{
    try 
    {
        const { postId } = req.body;
        const user = req.user;

        // Find the post by postId
        const post = await Post.findOne({ postId: postId });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Push the new like into the likes array
        post.likes.push({
            creator: {
                name: user.name,
                email: user.email,
            },
            timeStamp: Date.now(),
        });

        // Save the updated post
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } 
    catch (error) 
    {
        console.error('Error adding like:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const addComment = async (req, res) => 
{
    try 
    {
        const { content, postId } = req.body;
        const user=req.user;

       // Find the post by postId
       const post = await Post.findOne({ postId: postId });

         if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Push the new comment into the comments array
        post.comments.push({
            content,
            creator: {
                name: user.name,
                email: user.email,
            },
            timeStamp: Date.now(),
        });

        // Save the updated post
        const updatedPost = await post.save();

        res.status(201).json(updatedPost);
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
        const postData = req.body;
        const user=req.user;
        const randomUUID = uuidv4();

        const newPost = new Post({
            creator: 
            {
                name: user.name,
                email: user.email,
                personalRoomId: user._id,
            },
            imageData: postData.imageData,
            caption: postData.caption,
            likes: 0,
            comments: [],
            timeStamp: Date.now(),
            postId: randomUUID,
        });

        const sharedPost = await newPost.save();

        res.status(200).json(sharedPost);
    } 
    catch (error) 
    {
        console.error('Error sharing post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const fetchPostById = async (req, res) =>
{
    console.log('fetchPostById called');
    try 
    {
        const { postId } = req.body;
        const post = await Post.findOne({ postId: postId });

        if (!post) 
        {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } 
    catch (error) 
    {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteAllPosts = async (req, res) => 
{
    try 
    {
        await Post.deleteMany({});
        console.log('All posts deleted');
    } 
    catch (error) 
    {
        console.error('Error deleting all posts:', error);
    }
};


module.exports = {
    addPost,
    fetchPosts,
    addLike,
    addComment,
    sharePost,
    fetchPostById,
    deleteAllPosts
};
