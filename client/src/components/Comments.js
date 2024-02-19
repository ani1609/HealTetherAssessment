import {useState} from 'react';
import {ReactComponent as Close} from '../icons/close.svg';
import axios from 'axios';
import "../index"
import "../styles/Comments.css";
import {ReactComponent as SendIcon} from "../icons/send.svg";



function Comments(props)
{
    const {post} = props;
    const [comment, setComment] = useState({
        content: "",
        creator: {
            name: props.user.name,
            email: props.user.email
        },
        timeStamp: Date.now(),
    });

    const handleAddComment = async (event) => 
    {
        event.preventDefault();
        console.log('Adding comment:', post);

        try
        {
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
            // Create a copy of post.comments and add the new comment
            post.comments.push(comment);
            // Clear the input field after adding the comment
            setComment({ content: '', creator: comment.creator, timeStamp: Date.now() });
        }
        catch (error) 
        {
            console.error('Error adding comment:', error);
        }
    };


    return(
        <div className="comments-container bg-white relative p-8 shadow-md rounded-md w-80 h-96">
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>props.setShowComments(false)}><Close className="w-5 h-5"/></div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">Comments</h2>
            <div className="mb-4 border-t">
                {post && post.comments.map((comment, index) => (
                    <p key={index} className="border-b pt-1 pb-1">{comment.content}</p>
                ))}
            </div>
            <form className='absolute flex' onSubmit={handleAddComment}>
                <input 
                    type="text" 
                    className="border rounded-md p-2 box-border" 
                    placeholder="Add a comment"
                    value={comment.content}
                    onChange={(e) => setComment({ ...comment, content: e.target.value })}
                    name="comment"
                    autoComplete='off'
                />
                <button className=""><SendIcon style={{fill:"grey"}}/></button>
            </form>
        </div>
    );
}


export default Comments;