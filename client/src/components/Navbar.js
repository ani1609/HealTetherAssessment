import { useState, useEffect } from "react";
import "../index.css";
import "../styles/Navbar.css";
import Login from "./Login";
import Signup from "./Signup";
import AddPost from "./AddPost";
import Notifications from "./Notifications";


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
        const handleNewPost = (postData) => 
        {
            console.log('New post:', postData);
            let notification="New post from "+postData.creator.name.split(" ")[0];
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        };

        props.socket.on('newPostNotification', handleNewPost);

    
        return () => {
            props.socket.off('newPostNotification', handleNewPost);
        };
    }, [props.socket]);

    //Listen for new likes
    useEffect(() => 
    {
        // console.log('Listening for new likes');
        const handlePostLike = (postData) => {
            console.log('New like:', postData);

            const notification = `${postData.likedBy} liked your post`;
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        }
    
        props.socket.on('likePostNotification', handlePostLike);


        return () => {
            props.socket.off('likePostNotification', handlePostLike);
        };
    }, [props.socket]);
    

    const handleLogOut = () =>
    {
        localStorage.removeItem('realTimeToken');
        window.location.reload();
    }



    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">HealTether</div>
                <div className="flex">
                    {userToken ? (
                        <ul className="flex space-x-4">
                            <li className="text-white cursor-pointer" onClick={()=>setShowNotification(true)}>Notificaitons</li>
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
                <div className="loginFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Login setShowLoginForm={setShowLoginForm}/></div>
            }
            {showSignupForm&&
                <div className="signupFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Signup setShowSignupForm={setShowSignupForm}/></div>
            }
            {showAddPostForm&&
                <div className="addPostFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><AddPost setShowAddPostForm={setShowAddPostForm} user={props.user} socket={props.socket}/></div>
            }
            {showNotification&&
                <div className="notificationComponentContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Notifications setShowNotification={setShowNotification} notifications={notifications} setNotifications={setNotifications}/></div>
            }
        </nav>
    );
};


export default Navbar;
