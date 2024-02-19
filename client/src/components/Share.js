import {useState} from 'react';
import {ReactComponent as Close} from '../icons/close.svg';
import axios from 'axios';
import "../index"
import "../styles/Share.css";
import {ReactComponent as SendIcon} from "../icons/send.svg";



function Share(props)
{
    const { post, socket, user } = props;

    const handleShareClick = async () =>
    {
        try 
        {
            props.setLoading(true);
            const userToken = localStorage.getItem('realTimeToken'); 
            const headers = {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            };
    
            // Make a POST request to the backend with the comment, post ID, and token
            const response = await axios.post('http://localhost:3001/api/addComment',
                {
                    comment,
                    postId: post._id,
                },
                { headers }
            );
            console.log('Comment added:', response.data);
            socket.emit('sharePostNotification', { postData: post, roomId: post.creator.personalRoomId, sharedBy: user.name });

            props.setLoading(false);
        } 
        catch (error) 
        {
            props.setLoading(false);
            console.error('Error sharing post:', error);
        }
    }


    return(
        <div className="comments-container bg-white relative p-8 shadow-md rounded-md w-80 h-96">
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>props.setShowShare(false)}><Close className="w-5 h-5"/></div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">Share Post</h2>
            
        </div>
    );
}


export default Share;