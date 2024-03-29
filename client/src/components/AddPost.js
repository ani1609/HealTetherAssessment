import React, { useState } from 'react';
import {ReactComponent as Close} from "../icons/close.svg";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


function AddPost(props) 
{
    const { user, socket, setShowAddPostForm, setLoading } = props;

    const [postData, setPostData] = useState({
        creator: {
            name: props.user.name,
            email: props.user.email,
            personalRoomId: props.user._id,
        },
        imageData: "",
        caption: "",
        likes: [],
        comments: [],
        timeStamp: Date.now(),
        postId: uuidv4(),
    });

    const handleFileChange = (event) => 
    {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
            postData.imageData = base64data;
        };
        reader.readAsDataURL(file);
        }
    };

    const handleCaptionChange = (event) => {
        setPostData((prevData) => ({
            ...prevData,
            caption: event.target.value,
        }));
    };

    const handleSubmit = async (event) => 
    {
        event.preventDefault();
        // setLoading(true);
        try 
        {
            const userToken = localStorage.getItem('realTimeToken'); // Get your JWT token from storage

            // Set the headers with the token
            const headers = {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            };

            console.log('Post data:', postData);

            // Make a POST request to the backend with imageData, caption, and token
            const response = await axios.post('http://localhost:3001/api/addPosts',
                postData,
                { headers }
            );
            console.log('Post created:', response.data);

            // Emit the new post to the server
            socket.emit('newPost', postData);
            socket.emit('newPostNotification', { postId:postData.postId, postedBy:user.name.split(' ')[0], timestamp:postData.timeStamp });

            // setLoading(false);
            setShowAddPostForm(false);
        }
        catch (error) 
        {
            // setLoading(false);
            console.error('Error creating post:', error);
        }
    };

    //Listen for new posts
    // socket.on('newPost', (postData) => 
    // {
    //     console.log('New post:', postData);
    // });

    return (
        <form className="bg-white relative p-8 shadow-md rounded-md w-80" onSubmit={handleSubmit}>
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>props.setShowAddPostForm(false)}>
                <Close className="w-5 h-5"/>
            </div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">
                Create Post
            </h2>
            <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-600">
                Image:
                </label>
                <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="caption" className="block text-sm font-medium text-gray-600">
                Caption:
                </label>
                <textarea
                value={postData.caption}
                onChange={handleCaptionChange}
                className="mt-1 p-2 w-full border rounded-md"
                />
            </div>
            <div className="flex justify-center">
                <button
                type="submit"
                className="bg-blue-500 text-white p-2 mx-auto rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                Create Post
                </button>
            </div>
        </form>
    );
};

export default AddPost;
