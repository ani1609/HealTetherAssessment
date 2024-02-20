import { useState, useEffect } from "react";
import "../index.css";
import "../styles/Navbar.css";
import Login from "./Login";
import Signup from "./Signup";
import AddPost from "./AddPost";
import Notifications from "./Notifications";
import {ReactComponent as BellIcon} from "../icons/bell.svg";


function Navbar(props)
{
    const userToken=localStorage.getItem("realTimeToken");
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [showAddPostForm, setShowAddPostForm] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    //Listen for new posts
    useEffect(() => 
    {
        //Listen for new posts
        const handleNewPost = (data) => 
        {
            console.log('New post:', data);
            const newNotification = {
                content: `${data.postedBy} created a new post`,
                postId: data.postId,
                timestamp: data.timestamp
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        };

        //Listen for new likes
        const handlePostLike = (data) => {
            console.log('New like:', data);
            const newNotification = {
                content: `${data.likedBy} liked your post`,
                postId: data.postId,
                timestamp: data.timestamp
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        }

        //Listen for new comments
        const handlePostComment = (data) => {
            console.log('New comment:', data);
            const newNotification = {
                content: `${data.commentedBy} commented on your post`,
                postId: data.postId,
                timestamp: data.timestamp
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        }

        //Listen for new share posts
        const handlePostShare = (data) => {
            console.log('New share:', data);
            const newNotification = {
                content: `${data.sharedBy} shared your post`,
                postId: data.postId,
                timestamp: data.timestamp
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        }


        props.socket.on('newPostNotification', handleNewPost);
        props.socket.on('likePostNotification', handlePostLike);
        props.socket.on('commentPostNotification', handlePostComment);
        props.socket.on('sharePostNotification', handlePostShare);
        

    
        return () => {
            props.socket.off('newPostNotification', handleNewPost);
            props.socket.off('likePostNotification', handlePostLike);
            props.socket.off('commentPostNotification', handlePostComment);
            props.socket.off('sharePostNotification', handlePostShare);
        };
    }, [props.socket]);


    const handleLogOut = () =>
    {
        props.setLoading(true);
        localStorage.removeItem('realTimeToken');
        window.location.reload();
    }



    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">HealTether</div>
                <div className="flex">
                    {userToken ? (
                        <ul className="flex jsutify-center items-center space-x-4">
                            <li className="text-white cursor-pointer relative" onClick={()=>setShowNotification(true)}>{notifications.length > 0 && <span className="dot"></span>}<BellIcon className="fill-white w-10"/></li>
                            <li className="text-white cursor-pointer" onClick={()=>setShowAddPostForm(true)}>New Post</li>
                            <li className="text-white cursor-pointer" onClick={handleLogOut}>Logout</li>
                        </ul>
                    ) : (
                        <ul className="flex space-x-4">
                            <li className="text-white cursor-pointer" onClick={()=>{setShowLoginForm(true); setShowSignupForm(false)}}>Login</li>
                            <li className="text-white cursor-pointer" onClick={()=>{setShowSignupForm(true); setShowLoginForm(false)}}>Signup</li>
                        </ul>
                    )}
                </div>
            </div>
            {showLoginForm&&
                <div className="loginFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Login setShowLoginForm={setShowLoginForm} setLoading={props.setLoading}/></div>
            }
            {showSignupForm&&
                <div className="signupFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Signup setShowSignupForm={setShowSignupForm} setLoading={props.setLoading}/></div>
            }
            {showAddPostForm&&
                <div className="addPostFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><AddPost setShowAddPostForm={setShowAddPostForm} user={props.user} socket={props.socket} setLoading={props.setLoading}/></div>
            }
            {showNotification&&
                <div className="notificationComponentContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Notifications setShowNotification={setShowNotification} notifications={notifications} setNotifications={setNotifications} setLoading={props.setLoading}/></div>
            }
        </nav>
    );
};


export default Navbar;
