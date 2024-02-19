import "../index.css";
import {ReactComponent as Like} from "../icons/like.svg";
import {ReactComponent as Comment} from "../icons/comment.svg";
import {ReactComponent as Share} from "../icons/share.svg";


function PostCard(props) 
{
    const {user, post, socket} = props;
    function formatTimestamp(timestamp) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = new Date(timestamp).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const handleLikeClick = async () => 
    {
        try 
        {
            socket.emit('likePostNotification', { postData: post, roomId: post.creator.personalRoomId, likedBy: user.name });
        } 
        catch (error) 
        {
            console.error('Error liking post:', error);
        }
    }

    return (
        <div className="flex flex-col box-border" style={{width: "100%"}}>
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
                <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }} onClick={handleLikeClick}>
                    <Like className="h-6 w-6"/> <p className="text-xs">Like</p>
                </span>
                <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }}>
                    <Comment className="h-5 w-5"/> <p className="text-xs">Comment</p>
                </span>
                <span className="flex justify-center box-border p-2 gap-x-2 items-center" style={{ flex: 1 }}>
                    <Share className="h-5 w-5"/> <p className="text-xs">Share</p>
                </span>
            </div>
        </div>
    );
}

export default PostCard;
