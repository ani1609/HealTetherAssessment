import { useState } from "react";
import "../index.css";
import "../styles/PostCard.css";
import {ReactComponent as LikeIcon} from "../icons/like2.svg";
import {ReactComponent as CommentIcon} from "../icons/comment.svg";
import {ReactComponent as ShareIcon} from "../icons/share.svg";
import Comments from "./Comments";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';



function PostCard(props) 
{
    const {user, post, setPosts, socket} = props;
    const [showComments, setShowComments] = useState(false);


    function formatTimestamp(timestamp) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = new Date(timestamp).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const handleLikeClick = async () => 
    {
        try
        {
            // props.setLoading(true);
            const userToken = localStorage.getItem('realTimeToken'); 
            const headers = {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            };
    
            // Make a POST request to the backend with the comment, post ID, and token
            const response = await axios.post('http://localhost:3001/api/addLike',
                {
                    postId: post.postId,
                },
                { headers }
            );
            console.log('Updated post:', response.data);

            // setPosts(prevPosts => prevPosts.map(prevPost => (prevPost.postId === post.postId ? response.data : prevPost)));

            socket.emit('likePostNotification', { roomId: post.creator.personalRoomId, postId: post.postId, likedBy:user.name.split(' ')[0], timestamp: new Date() });
            const newLike = {
                creator: {
                    name: user.name,
                    email: user.email,
                },
                timeStamp: Date.now(),
            }
            socket.emit('increaseLikeCount', { postId: post.postId, newLike });
            // props.setLoading(false);
        }
        catch (error) 
        {
            // props.setLoading(false);
            console.error('Error liking post:', error);
        }
    }

    const handleShareClick = async () =>
    {
        try 
        {
            // props.setLoading(true);
            const postData = {
                creator: {
                    name: props.user.name,
                    email: props.user.email,
                    personalRoomId: props.user._id,
                },
                imageData: post.imageData,
                caption: post.caption,
                likes: [],
                comments: [],
                timeStamp: Date.now(),
                postId: uuidv4(),
            };

            const userToken = localStorage.getItem('realTimeToken'); 
            const headers = {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            };
    
            // Make a POST request to the backend with the comment, post ID, and token
            const response = await axios.post('http://localhost:3001/api/sharePost',
                postData,
                { headers }
            );
            console.log('Post shared:', response.data);

            socket.emit('newPost', postData);
            socket.emit('sharePostNotification', { roomId: post.creator.personalRoomId, postId: postData.postId, sharedBy:user.name.split(' ')[0], timestamp: new Date() });
            
            // props.setLoading(false);
        } 
        catch (error) 
        {
            // props.setLoading(false);
            console.error('Error sharing post:', error);
        }
    }


    return (
        <div className="flex flex-col box-border" style={{width: "100%"}}>
            <div className="flex justify-start gap-x-2 box-border p-2 border-b border-t">
                <img src={"http://localhost:3001/uploads/profilePictures/default.png"} alt="post" className="w-11" />
                <div className="flex flex-col justify-center">
                    <h1 className="text-sm font-semibold">{post.creator.name.split(' ')[0]}</h1>
                    <p className="text-xs">{formatTimestamp(post.timeStamp)}</p>
                </div>
            </div>
            <p className="box-border px-2 text-base">{post.caption}</p>
            <img src={post.imageData} alt="post" className="w-full h-60 object-cover" />
            <div className="flex justify-between items-center cursor-pointer mt-1 box-border border-b border-t">
                <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }} onClick={handleLikeClick}>
                    <LikeIcon className="h-6 w-6"/> <p className="text-xs">{post.likes.length <= 1 ? `${post.likes.length} Like` : `${post.likes.length} Likes`}</p>
                </span>
                <span className="flex justify-center box-border p-2 gap-x-2 items-center border-l border-r box-border" style={{ flex: 1 }} onClick={()=>setShowComments(true)}>
                    <CommentIcon className="h-5 w-5"/> <p className="text-xs">{post.comments.length <= 1 ? `${post.comments.length} Comment` : `${post.comments.length} Comments`}</p>
                </span>
                <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }} onClick={handleShareClick}>
                    <ShareIcon className="h-5 w-5"/> <p className="text-xs">Share</p>
                </span>
            </div>
            {
                showComments && <div className="commentsComponentContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Comments user={props.user} setShowComments={setShowComments} post={post} setPosts={setPosts} socket={props.socket} setLoading={props.setLoading}/></div>
            }
        </div>
    );
}


export default PostCard;
