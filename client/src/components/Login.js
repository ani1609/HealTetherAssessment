import React, { useState } from "react";
import {ReactComponent as Close} from "../icons/close.svg";
import axios from "axios";


function Login(props) 
{
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const handleChange = (e) => 
    {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        try
        {
            const response = await axios.post('http://localhost:3001/api/users/login', {
                email,
                password,
            });
            localStorage.setItem('realTimeToken', response.data.token);
            window.location.reload();
        }
        catch (error) 
        {
            console.error('Error logging in:', error);
        }
    };

    return (
        <form className="bg-white relative p-8 shadow-md rounded-md w-80" onSubmit={handleSubmit}>
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>props.setShowLoginForm(false)}><Close className="w-5 h-5"/></div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
                </label>
                <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
                </label>
                <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 mx-auto rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Login
                </button>
            </div>
        </form>
    );
}

export default Login;
