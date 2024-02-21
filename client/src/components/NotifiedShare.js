import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {ReactComponent as LikeIcon} from "../icons/like2.svg";
import {ReactComponent as CommentIcon} from "../icons/comment.svg";
import {ReactComponent as ShareIcon} from "../icons/share.svg";


function NotifiedShare(props) 
{
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [postLength, setPostLength] = useState(0);

    useEffect(() => 
    {
        const fetchPostById = async (postId) =>
        {
            try 
            {
                const userToken = localStorage.getItem('realTimeToken'); 
                const headers = {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                };
                const response = await axios.post('http://localhost:3001/api/fetchPostById',
                    {
                        postId: postId,
                    },
                    { headers }
                );
                console.log('Shared Post:', response.data);
                setPost(response.data);
            }
            catch (error) 
            {
                console.error('Error fetching post:', error);
            }
        };
        if (postId)  
        {
            fetchPostById(postId);
        }
    }, [postId]);

    function formatTimestamp(timestamp) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = new Date(timestamp).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    useEffect(() =>
    {
        if (post)
        {
            const postLength = Object.keys(post).length;
            setPostLength(postLength);
        }
    }, [post]);

    return (
        <div className='flex justify-center align-top mt-4'>
            {postLength!==0 &&
                <div className="flex flex-col box-border border" style={{width: "384px"}}>
                    <div className="flex justify-start gap-x-2 box-border p-2">
                        <img src={"http://localhost:3001/uploads/profilePictures/default.png"} alt="post" className="w-11" />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-sm font-semibold">{post.creator.name.split(' ')[0]}</h1>
                            <p className="text-xs">{formatTimestamp(post.timeStamp)}</p>
                        </div>
                    </div>
                    <p className="box-border px-2 text-base">{post.caption}</p>
                    <img src={post.imageData} alt="post" className="w-full h-60 object-cover mt-1" />
                    <div className="flex justify-between items-center cursor-pointer mt-1">
                        <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }}>
                            <LikeIcon className="h-6 w-6"/> <p className="text-xs">{post.likes.length <= 1 ? `${post.likes.length} Like` : `${post.likes.length} Likes`}</p>
                        </span>
                        <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }}>
                            <CommentIcon className="h-5 w-5"/> <p className="text-xs">{post.comments.length} Comment</p>
                        </span>
                        <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }}>
                            <ShareIcon className="h-5 w-5"/> <p className="text-xs">Share</p>
                        </span>
                    </div>
                </div>
            }
        </div>
    );
}


export default NotifiedShare;
