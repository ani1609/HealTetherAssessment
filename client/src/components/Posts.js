import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import "../index.css";
import "../styles/Posts.css";



function Posts(props) 
{
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
    
        props.socket.on('newPost', handleNewPost);
    
        return () => {
            props.socket.off('newPost', handleNewPost);
        };
    }, [props.socket, setPosts]);


    return (
        <div className='posts-container'>
            <h1 className='font-bold text-3xl text-center mt-4 mb-4'>Posts</h1>
            <div className='post-wrapper flex flex-col justify-center items-center gap-3 max-w-sm w-screen mx-auto border'>
                {posts.length>0 && posts.map((post,index) => (
                    <PostCard key={index}
                        user={props.user}
                        post={post} 
                        setPosts={setPosts}
                        socket={props.socket}
                        setLoading={props.setLoading}
                    />
                ))}
            </div>
        </div>
    );
}

export default Posts;
