import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import "../index.css";
import "../styles/Posts.css";



function Posts(props) 
{
    const {user, socket, setLoading} = props;
    const [posts, setPosts] = useState([]);

    useEffect(() => 
    {
        const fetchPosts = async () => {
        try 
        {
            const userToken=localStorage.getItem("realTimeToken");
            const response = await axios.get('http://localhost:3001/api/fetchPosts', {
                headers: {
                    Authorization: `Bearer ${userToken}`, 
                },
            });
            setPosts(response.data);
            // console.log(response.data);
        } 
        catch (error) 
        {
            console.error('Error fetching posts:', error);
        }
        };

        fetchPosts();
    }, []); 

    //Listen for new posts
    useEffect(() => 
    {
        const handleNewPost = (postData) => {
            setPosts((prevPosts) => [postData, ...prevPosts]);
        };
    
        socket.on('newPost', handleNewPost);
    
        return () => {
            socket.off('newPost', handleNewPost);
        };
    }, [socket, setPosts]);

    //Listen for new likes
    useEffect(() => 
    {
        const handleIncreaseLikeCount = (data) => {
            console.log('Like data:', data);
            setPosts((prevPosts) => prevPosts.map((prevPost) => (prevPost.postId === data.postId ? { ...prevPost, likes: [...prevPost.likes, data.newLike] } : prevPost)));
        };
    
        socket.on('increaseLikeCount', handleIncreaseLikeCount);
    
        return () => {
            socket.off('increaseLikeCount', handleIncreaseLikeCount);
        };
    }, [socket, setPosts]);

    //Listen for new comments
    useEffect(() => 
    {
        const handleIncreaseCommentCount = (data) => {
            console.log('Comments data:', data);
            setPosts((prevPosts) => prevPosts.map((prevPost) => (prevPost.postId === data.postId ? { ...prevPost, comments: [...prevPost.comments, data.newComment] } : prevPost)));
        };
    
        socket.on('increaseCommentCount', handleIncreaseCommentCount);
    
        return () => {
            socket.off('increaseCommentCount', handleIncreaseCommentCount);
        };
    }, [socket, setPosts]);


    return (
        <div className='posts-container'>
            <h1 className='font-bold text-3xl text-center mt-4 mb-4'>Posts</h1>
            <div className='post-wrapper flex flex-col justify-center items-center gap-3 max-w-sm w-screen mx-auto border'>
                {posts.length>0 && posts.map((post,index) => (
                    <PostCard key={index}
                        user={user}
                        post={post} 
                        setPosts={setPosts}
                        socket={socket}
                        setLoading={setLoading}
                    />
                ))}
            </div>
        </div>
    );
}

export default Posts;
