import {useState} from 'react';
import {ReactComponent as Close} from '../icons/close.svg';
import axios from 'axios';
import "../index"
import "../styles/Comments.css";
import {ReactComponent as SendIcon} from "../icons/send.svg";



function Comments(props)
{
    const { post, setPosts, socket, user, setShowComments } = props;
    const [comment, setComment] = useState('');

    const handleAddComment = async (event) => 
    {
        event.preventDefault();
        if (comment === '') 
            return;
        try
        {
            // props.setLoading(true);
            const userToken = localStorage.getItem('realTimeToken'); 
            const headers = {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            };
    
            // Make a POST request to the backend with the comment, post ID, and token
            const response = await axios.post('http://localhost:3001/api/addComment',
                {
                    content: comment,
                    postId: post.postId,
                },
                { headers }
            );
            console.log('Comment added:', response.data);

            // setPosts(prevPosts => prevPosts.map(prevPost => (prevPost.postId === post.postId ? response.data : prevPost)));
        
            socket.emit('commentPostNotification', { roomId: post.creator.personalRoomId, postId: post.postId, commentedBy: user.name.split(' ')[0], timestamp: new Date() });
            const newComment = {
                content: comment,
                creator: {
                    name: user.name,
                    email: user.email,
                },
                timeStamp: Date.now(),
            };
            socket.emit('increaseCommentCount', { postId: post.postId, newComment });

            setComment('');
            // setShowComments(false);
            // props.setLoading(false);
        }
        catch (error) 
        {
            // props.setLoading(false);
            console.error('Error adding comment:', error);
        }
    };

    function formatTimestamp(timestamp) 
    {
        const options1 = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const formattedTime = new Date(timestamp).toLocaleString('en-US', options1);

        const options2 = {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        };
        const formattedData = new Date(timestamp).toLocaleString('en-US', options2);

        return `${formattedTime} ${formattedData}`;
    }


    return(
        <div className="comments-container bg-white relative p-6 shadow-md rounded-md w-80 h-96">
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>setShowComments(false)}>
                <Close className="w-5 h-5"/>
            </div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">
                Comments
            </h2>
            <ul className="comments-wrapper mb-4 border-t overflow-auto">
                {post && post.comments.map((comment, index) => (
                    <li key={index} className="border-b pt-1 pb-1 flex items-center">
                        <p className='text-base font-semibold'>{comment.creator.name}&nbsp;</p>
                        <p className='text-base flex flex-wrap'>{comment.content}</p>
                        <p className='text-xs ml-auto'>{formatTimestamp(comment.timeStamp)}</p>
                    </li>
                ))}
            </ul>
            <form className='absolute flex justify-between' onSubmit={handleAddComment}>
                <input 
                    type="text" 
                    className="border rounded-md p-2 box-border" 
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    name="comment"
                    autoComplete='off'
                />
                <button className=""><SendIcon style={{fill:"grey"}}/></button>
            </form>
        </div>
    );
}


export default Comments;