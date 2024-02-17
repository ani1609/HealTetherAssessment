import { useState } from "react";
import "../index.css";
import Login from "./Login";
import Signup from "./Signup";
import "../styles/Navbar.css";


function Navbar()
{
    const userToken=localStorage.getItem("realTimeToken");
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);

    const handleLogOut = () =>
    {
        localStorage.removeItem('realTimeToken');
        window.location.reload();
    }



    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">Your Logo</div>
                <ul className="flex space-x-4">
                    {userToken ? (
                        <div className="flex">
                            <li className="rounded-full"></li>
                            <li className="text-white cursor-pointer" onClick={handleLogOut}>Logout</li>
                        </div>
                    ) : (
                        <div className="flex gap-8">
                            <li className="text-white cursor-pointer" onClick={()=>{setShowLoginForm(true); setShowSignupForm(false)}}>Login</li>
                            <li className="text-white cursor-pointer" onClick={()=>{setShowSignupForm(true); setShowLoginForm(false)}}>Signup</li>
                        </div>
                    )}
                </ul>
            </div>
            {showLoginForm&&
                <div className="loginFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Login setShowLoginForm={setShowLoginForm}/></div>
            }
            {showSignupForm&&
                <div className="signupFormContainer w-screen h-screen absolute left-0 z-10 flex justify-center items-center"><Signup setShowSignupForm={setShowSignupForm}/></div>
            }
        </nav>
    );
};


export default Navbar;
